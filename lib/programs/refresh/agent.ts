import Anthropic from "@anthropic-ai/sdk";
import {
  candidateProgramSchema,
  type CandidateProgram,
} from "./schema";

/**
 * AI refresh agent for the curated Ohio program database.
 *
 * Uses Claude (Opus 4.8) with the server-side web_search tool to find current
 * homebuyer down-payment-assistance / grant programs, then has the model hand
 * back a structured list via the `submit_programs` tool. The output is treated
 * as UNVERIFIED candidates for human review — it never writes the database.
 *
 * Provider: Anthropic (claude-api skill). Model: claude-opus-4-8, adaptive
 * thinking. We do NOT use output_config.format here because web_search emits
 * citations (incompatible with structured outputs); a tool call is the robust
 * way to get a structured payload alongside server-side search.
 */

const MODEL = "claude-opus-4-8";

export function isRefreshConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const SYSTEM = `You are a research assistant maintaining a curated database of Ohio homebuyer down-payment-assistance and grant programs for a real-estate brokerage and a HUD-approved housing-counseling nonprofit.

Your job: find CURRENT, REAL programs that help Ohio homebuyers with down payment and closing costs — at the state (e.g. OHFA), county, city, and nonprofit levels. Use web search to verify each program against an official source (a government agency, housing finance agency, or the nonprofit that runs it).

Critical rules — this data is used by vulnerable first-time buyers, so accuracy matters more than coverage:
- Only include a program if you can cite an official source URL for it. Prefer .gov / agency / nonprofit sites over blogs or lender marketing.
- Never invent numbers. If a dollar amount, income limit, or credit minimum isn't stated by the source, use null — do not estimate.
- Set lastVerified to today's date (provided below).
- Flag requiresHomebuyerEd accurately — many DPA programs require a HUD-approved homebuyer-education certificate.
- Set a confidence level per program and add a short reviewerNote pointing to where you found it and anything a human should double-check.
- Do NOT scrape or enumerate individual lenders. participatingLenders should only list lenders the official program page names.

When you have researched thoroughly, call the submit_programs tool exactly once with all the programs you found.`;

const submitProgramsTool: Anthropic.Tool = {
  name: "submit_programs",
  description:
    "Submit the final list of researched Ohio homebuyer assistance programs for human review.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      programs: {
        type: "array",
        description: "All programs found, each backed by an official source URL.",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            provider: { type: "string", description: "Agency/org that runs it." },
            level: { type: "string", enum: ["state", "county", "city", "nonprofit"] },
            geography: {
              type: "object",
              properties: {
                statewide: { type: "boolean" },
                counties: { type: "array", items: { type: "string" } },
                cities: { type: "array", items: { type: "string" } },
              },
            },
            assistanceType: {
              type: "string",
              enum: ["grant", "forgivable-loan", "deferred-second", "mcc-tax-credit"],
            },
            benefit: {
              type: "object",
              properties: {
                amount: { type: ["number", "null"] },
                percent: { type: ["number", "null"] },
                description: { type: "string" },
              },
            },
            eligibility: {
              type: "object",
              properties: {
                firstTimeBuyer: { type: ["boolean", "null"] },
                incomeLimit: { type: ["number", "null"] },
                occupation: { type: "array", items: { type: "string" } },
                creditMin: { type: ["number", "null"] },
                propertyType: { type: "array", items: { type: "string" } },
                purchasePriceLimit: { type: ["number", "null"] },
              },
            },
            requiresHomebuyerEd: { type: "boolean" },
            mustUseApprovedLender: { type: "boolean" },
            participatingLenders: { type: "array", items: { type: "string" } },
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
            "benefit",
            "eligibility",
            "requiresHomebuyerEd",
            "mustUseApprovedLender",
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

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Research current Ohio homebuyer down-payment-assistance and grant programs. Today's date is ${today}. ${scope}\n\nVerify each against an official source, then call submit_programs with the full list.`,
    },
  ];

  const tools: Anthropic.ToolUnion[] = [
    { type: "web_search_20260209", name: "web_search" },
    submitProgramsTool,
  ];

  // Manual loop: server-side web_search runs inside each create() call and may
  // pause_turn; the model finishes by calling our client-side submit_programs.
  for (let i = 0; i < 10; i++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: SYSTEM,
      tools,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    const submit = response.content.find(
      (b): b is Anthropic.ToolUseBlock =>
        b.type === "tool_use" && b.name === "submit_programs",
    );
    if (submit) {
      return normalize(submit.input, MODEL);
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
    // Any other stop reason (e.g. refusal): stop and report nothing found.
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
    if (parsed.success) candidates.push(parsed.data);
    else invalidCount += 1;
  }

  return {
    candidates,
    invalidCount,
    model,
    generatedAt: new Date().toISOString(),
  };
}
