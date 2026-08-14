import Anthropic from "@anthropic-ai/sdk";
import {
  candidateProgramSchema,
  type CandidateProgram,
} from "./schema";
import { sourceWarning } from "./source-quality";

/**
 * AI refresh agent for the curated Ohio program database.
 *
 * Uses Claude Opus 5 with the server-side web_search + web_fetch tools to find
 * current homebuyer down-payment-assistance / grant programs, READ each
 * program's official page to verify the details, then hand back a structured
 * list via the `submit_programs` tool. The output is treated as UNVERIFIED
 * candidates for human review — it never writes the database.
 *
 * Accuracy design, in layers:
 *  1. The model must fetch and cite an official source per program, and is
 *     told to never invent numbers.
 *  2. Coverage-first with honest labels: uncertain programs are INCLUDED at
 *     confidence "low" with a reviewer note, not silently dropped — the human
 *     review step is the filter, so recall belongs to the model and precision
 *     to the reviewer.
 *  3. Every candidate is schema-validated, and cited domains are classified
 *     deterministically (source-quality.ts) so non-official citations carry a
 *     visible warning in review.
 *  4. If Claude Opus 5's safety classifiers decline the request, the API
 *     retries it on Claude Opus 4.8 server-side (`fallbacks`), so a scheduled
 *     run degrades to the previous model instead of returning nothing.
 *
 * We do NOT use output_config.format here because web_search emits citations
 * (incompatible with structured outputs); a tool call is the robust way to get
 * a structured payload alongside server-side search.
 */

const MODEL = "claude-opus-5";
const FALLBACK_MODEL = "claude-opus-4-8";

const EFFORT_LEVELS = ["low", "medium", "high", "xhigh", "max"] as const;
type Effort = (typeof EFFORT_LEVELS)[number];

/**
 * Research depth. `xhigh` is the recommended setting for agentic research on
 * Claude Opus 5; REFRESH_EFFORT exists as an ops knob — set it to "high" if
 * runs hit the platform's function-duration limit.
 */
function effort(): Effort {
  const configured = process.env.REFRESH_EFFORT;
  return (EFFORT_LEVELS as readonly string[]).includes(configured ?? "")
    ? (configured as Effort)
    : "xhigh";
}

export function isRefreshConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const SYSTEM = `You are a research assistant maintaining a curated database of Ohio homebuyer down-payment-assistance and grant programs for a real-estate brokerage and a HUD-approved housing-counseling nonprofit.

Your job: find CURRENT, REAL programs that help Ohio homebuyers with down payment and closing costs — at the state (e.g. OHFA), county, city, and nonprofit levels — and verify each one against its official source.

How to verify — this data guides vulnerable first-time buyers:
- For each program, use web_fetch to READ the official page (a government agency, housing finance agency, or the nonprofit that runs it) before reporting it. Cite that page as sourceUrl. Prefer .gov / agency / nonprofit sites over blogs or lender marketing.
- Never invent numbers. If a dollar amount, income limit, or credit minimum isn't stated by the source, use null — do not estimate.
- Report every real program you find an official source for. Do NOT drop a program because a detail is uncertain or funding status is unclear — include it with confidence "low" and say exactly what a reviewer should double-check in reviewerNote. A human reviewer approves each program before it is published, so your job is coverage with honest confidence labels; theirs is the final filter.
- Set lastVerified to today's date (provided below).
- Flag requiresHomebuyerEd accurately — many DPA programs require a HUD-approved homebuyer-education certificate.
- Do NOT scrape or enumerate individual lenders. participatingLenders should only list lenders the official program page names.
- Put the benefit in the human-readable "amount" field (e.g. "Up to 10% of price, max $20,900"); add amountStructured only when you can cleanly machine-encode it.
- Use the closest assistanceType: grant, forgivable_loan, deferred_loan, second_mortgage, rate_discount, tax_credit, or match.

When you have researched thoroughly, call the submit_programs tool exactly once with all the programs you found.`;

const submitProgramsTool: Anthropic.Beta.BetaTool = {
  name: "submit_programs",
  description:
    "Submit the final list of researched Ohio homebuyer assistance programs for human review.",
  input_schema: {
    type: "object",
    properties: {
      programs: {
        type: "array",
        description: "All programs found, each backed by an official source URL.",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            provider: { type: "string", description: "Agency/org that runs it." },
            level: {
              type: "string",
              enum: ["state", "regional", "county", "city", "nonprofit"],
            },
            geography: {
              type: "object",
              description:
                "statewide flag, plus counties/cities served and any excluded cities.",
              properties: {
                statewide: { type: "boolean" },
                counties: { type: "array", items: { type: "string" } },
                cities: { type: "array", items: { type: "string" } },
                excludes: { type: "array", items: { type: "string" } },
              },
            },
            assistanceType: {
              type: "string",
              enum: [
                "grant",
                "forgivable_loan",
                "deferred_loan",
                "second_mortgage",
                "rate_discount",
                "tax_credit",
                "match",
              ],
            },
            amount: {
              type: "string",
              description:
                "Human-readable benefit, e.g. 'Up to 10% of price, max $20,900'. This is the source of truth.",
            },
            amountStructured: {
              type: "object",
              description:
                "Optional machine-readable form, e.g. {percent: 10, maxDollar: 20900}. Use null for amounts the source doesn't state.",
            },
            eligibility: {
              type: "object",
              description:
                "Use numbers when the source gives a clean cap; otherwise the source's own text (e.g. 'At or below 80% AMI') or 'verify'.",
              properties: {
                firstTimeBuyer: { type: ["boolean", "null"] },
                incomeLimit: { type: ["string", "number", "null"] },
                occupation: { type: "string" },
                creditMin: { type: ["number", "null"] },
                propertyType: { type: "string" },
                purchasePriceLimit: { type: ["string", "number", "null"] },
              },
            },
            requiresHomebuyerEd: {
              description: "true, false, or 'verify' if unconfirmed.",
              anyOf: [{ type: "boolean" }, { type: "string", enum: ["verify"] }],
            },
            mustUseApprovedLender: {
              anyOf: [{ type: "boolean" }, { type: "string", enum: ["verify"] }],
            },
            participatingLenders: { type: "array", items: { type: "string" } },
            repayment: { type: "string" },
            howToApply: { type: "string" },
            sourceUrl: { type: "string", description: "Official source URL." },
            lastVerified: { type: "string", description: "ISO date (today)." },
            confidence: { type: "string", enum: ["high", "medium", "low"] },
            reviewerNote: { type: "string" },
          },
          required: [
            "name",
            "provider",
            "level",
            "geography",
            "assistanceType",
            "amount",
            "eligibility",
            "requiresHomebuyerEd",
            "howToApply",
            "sourceUrl",
            "lastVerified",
            "confidence",
          ],
        },
      },
    },
    required: ["programs"],
  },
};

export interface RefreshResult {
  candidates: CandidateProgram[];
  /** Candidates the model returned that failed schema validation (dropped). */
  invalidCount: number;
  model: string;
  generatedAt: string;
}

/**
 * After a mid-output safety fallback, the API requires echoed assistant turns
 * to omit model-internal blocks (thinking, tool_use, unpaired server-tool use)
 * that came BEFORE the final `fallback` boundary block; text, paired
 * server-tool blocks, and everything after the boundary echo unchanged.
 * With no fallback block present this is the identity function.
 */
export function sanitizeEchoContent<
  T extends { type: string; id?: string; tool_use_id?: string },
>(content: T[]): T[] {
  const boundary = content.map((b) => b.type).lastIndexOf("fallback");
  if (boundary < 0) return content;

  const before = content.slice(0, boundary);
  const pairedServerToolIds = new Set(
    before
      .filter(
        (b) =>
          (b.type === "web_search_tool_result" ||
            b.type === "web_fetch_tool_result") &&
          b.tool_use_id,
      )
      .map((b) => b.tool_use_id as string),
  );

  const kept = before.filter((b) => {
    if (b.type === "text" || b.type === "fallback") return true;
    if (b.type === "server_tool_use") return pairedServerToolIds.has(b.id ?? "");
    if (b.type === "web_search_tool_result" || b.type === "web_fetch_tool_result") {
      return true;
    }
    return false; // thinking, redacted_thinking, tool_use, unknown internals
  });

  return [...kept, ...content.slice(boundary)];
}

/**
 * Run the research agent. `geographyHint` lets a caller scope the search
 * (e.g. "Cuyahoga County"); omit for a statewide sweep.
 */
export async function refreshPrograms(
  geographyHint?: string,
): Promise<RefreshResult> {
  if (!isRefreshConfigured()) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to enable AI program refresh.",
    );
  }

  const client = new Anthropic();
  const today = new Date().toISOString().slice(0, 10);

  const scope = geographyHint
    ? `Focus on programs available in: ${geographyHint} (plus statewide Ohio programs that apply there).`
    : `Sweep statewide: OHFA programs, plus major county and city programs (e.g. Cuyahoga, Franklin, Hamilton, Columbus, Cleveland, Cincinnati) and notable nonprofits.`;

  const messages: Anthropic.Beta.BetaMessageParam[] = [
    {
      role: "user",
      content: `Research current Ohio homebuyer down-payment-assistance and grant programs. Today's date is ${today}. ${scope}\n\nVerify each against its official page, then call submit_programs with the full list.`,
    },
  ];

  const tools: Anthropic.Beta.BetaToolUnion[] = [
    { type: "web_search_20260209", name: "web_search" },
    { type: "web_fetch_20260209", name: "web_fetch" },
    submitProgramsTool,
  ];

  // Manual loop: server-side web_search/web_fetch run inside each call and may
  // pause_turn; the model finishes by calling our client-side submit_programs.
  // Streaming keeps the long xhigh turns clear of HTTP timeouts.
  for (let i = 0; i < 10; i++) {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 64000,
      thinking: { type: "adaptive" },
      output_config: { effort: effort() },
      // A safety-classifier decline retries on the previous Opus server-side,
      // so a scheduled run degrades gracefully instead of returning nothing.
      betas: ["server-side-fallback-2026-06-01"],
      fallbacks: [{ model: FALLBACK_MODEL }],
      system: SYSTEM,
      tools,
      messages,
    });
    const response = await stream.finalMessage();

    messages.push({
      role: "assistant",
      content: sanitizeEchoContent(
        response.content,
      ) as Anthropic.Beta.BetaContentBlockParam[],
    });

    const submit = response.content.find(
      (b): b is Anthropic.Beta.BetaToolUseBlock =>
        b.type === "tool_use" && b.name === "submit_programs",
    );
    if (submit) {
      return normalize(submit.input, response.model);
    }

    if (response.stop_reason === "pause_turn") {
      continue; // server-side tool loop hit its cap; resume
    }
    if (response.stop_reason === "end_turn") {
      // Researched but didn't submit — nudge once.
      messages.push({
        role: "user",
        content:
          "Call the submit_programs tool now with every program you verified.",
      });
      continue;
    }
    // Any other stop reason (refusal on the whole fallback chain, etc.):
    // stop and report nothing found rather than fabricating.
    break;
  }

  return { candidates: [], invalidCount: 0, model: MODEL, generatedAt: new Date().toISOString() };
}

function normalize(input: unknown, model: string): RefreshResult {
  const raw =
    input && typeof input === "object" && "programs" in input
      ? (input as { programs: unknown[] }).programs
      : [];

  const candidates: CandidateProgram[] = [];
  let invalidCount = 0;
  for (const item of raw ?? []) {
    const parsed = candidateProgramSchema.safeParse(item);
    if (parsed.success) candidates.push(annotateSource(parsed.data));
    else invalidCount += 1;
  }

  return {
    candidates,
    invalidCount,
    model,
    generatedAt: new Date().toISOString(),
  };
}

/** Attach the deterministic source-domain warning where one applies. */
function annotateSource(candidate: CandidateProgram): CandidateProgram {
  const warning = sourceWarning(candidate.sourceUrl);
  if (!warning) return candidate;
  const note = candidate.reviewerNote?.trim();
  return {
    ...candidate,
    reviewerNote: note ? `${note} ⚠ ${warning}` : `⚠ ${warning}`,
  };
}
