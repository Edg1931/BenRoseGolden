import Anthropic from "@anthropic-ai/sdk";
import { LANGUAGE_LABELS, TRACK_LABELS } from "@/lib/participants/curriculum";
import { STAGE_LABELS } from "@/lib/participants/schema";
import type { FeedItem } from "./feed";
import type { Audience, CampaignType } from "./schema";

/**
 * AI drafting for newsletters & flyers, tightly integrated with Claude.
 * Model: claude-opus-4-8, adaptive thinking. Falls back to a structured local
 * template when ANTHROPIC_API_KEY isn't set, so the composer always works.
 */

const MODEL = "claude-opus-4-8";

export function isDraftConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export interface DraftRequest {
  type: CampaignType;
  topic: string;
  audience: Audience;
  language: string; // language code
  highlights?: string[];
  instructions?: string;
  /** Recent Benjamin Rose articles / resources to weave into the draft. */
  sources?: FeedItem[];
}

/** A "More from Benjamin Rose" markdown section linking the chosen sources. */
function sourcesSection(sources?: FeedItem[]): string {
  if (!sources?.length) return "";
  const links = sources
    .map((s) => `- [${s.title}](${s.url})${s.excerpt ? ` — ${s.excerpt}` : ""}`)
    .join("\n");
  return `\n\n## More from Benjamin Rose\n\n${links}`;
}

export interface DraftResult {
  bodyMarkdown: string;
  subject?: string;
  source: "ai" | "template";
  model?: string;
}

function audienceDescription(a: Audience): string {
  const parts: string[] = [];
  if (a.stages?.length) parts.push(a.stages.map((s) => STAGE_LABELS[s]).join(", "));
  if (a.tracks?.length) parts.push(a.tracks.map((t) => TRACK_LABELS[t]).join(", "));
  if (a.language) parts.push(`${LANGUAGE_LABELS[a.language] ?? a.language}-speaking`);
  return parts.length ? parts.join("; ") : "all Benjamin Rose participants";
}

const SYSTEM = `You are the communications writer for Benjamin Rose, a nonprofit that runs HUD-approved housing programs (first-time homebuyer education, foreclosure prevention, and credit/financial coaching) in Ohio.

Voice: warm, encouraging, plain-language, and trustworthy — never salesy or jargon-heavy. Many readers are first-time buyers, at-risk homeowners, or rebuilding credit, and some are reading in their second language. Be concrete and action-oriented.

Output GitHub-flavored Markdown only (no preamble, no code fences). For a newsletter: a friendly headline, 2–4 short sections, and a clear call to action. For a flyer: a bold headline, a one-line hook, 3–5 punchy benefit bullets, and a call to action with a placeholder for contact info. Keep it concise.`;

export async function draftCampaign(req: DraftRequest): Promise<DraftResult> {
  if (!isDraftConfigured()) {
    return templateDraft(req);
  }

  const client = new Anthropic();
  const langName = LANGUAGE_LABELS[req.language as keyof typeof LANGUAGE_LABELS] ?? "English";
  const prompt = [
    `Write a ${req.type} for Benjamin Rose.`,
    `Topic: ${req.topic}.`,
    `Audience: ${audienceDescription(req.audience)}.`,
    `Write it in ${langName}.`,
    req.highlights?.length ? `Highlight these points:\n- ${req.highlights.join("\n- ")}` : "",
    req.sources?.length
      ? `Weave in and link these recent Benjamin Rose articles/resources where they fit naturally, using Markdown links. End with a short "More from Benjamin Rose" list of any you didn't link inline:\n${req.sources
          .map((s) => `- ${s.title} (${s.url})${s.excerpt ? ` — ${s.excerpt}` : ""}`)
          .join("\n")}`
      : "",
    req.instructions ? `Extra instructions: ${req.instructions}` : "",
    req.type === "newsletter"
      ? "Also propose a short email subject line on the first line prefixed exactly with 'SUBJECT: '."
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    thinking: { type: "adaptive" },
    system: SYSTEM,
    messages: [{ role: "user", content: prompt }],
  });

  let text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  let subject: string | undefined;
  const m = text.match(/^SUBJECT:\s*(.+)\n+/i);
  if (m) {
    subject = m[1].trim();
    text = text.slice(m[0].length).trim();
  }

  return { bodyMarkdown: text, subject, source: "ai", model: MODEL };
}

/** Deterministic local fallback so the feature works without an API key. */
function templateDraft(req: DraftRequest): DraftResult {
  const aud = audienceDescription(req.audience);
  const bullets = (req.highlights?.length
    ? req.highlights
    : [
        "Free HUD-approved homebuyer education",
        "Foreclosure-prevention counseling",
        "Credit-building and financial coaching",
        "Help finding down-payment assistance you qualify for",
      ]
  )
    .map((h) => `- ${h}`)
    .join("\n");

  const more = sourcesSection(req.sources);

  if (req.type === "flyer") {
    return {
      source: "template",
      bodyMarkdown: `# ${req.topic}\n\n**Benjamin Rose is here to help you reach a stable home.**\n\n${bullets}\n\n**Ready to start?** Call or visit us today — _[add phone / address / signup link]_.${more}`,
    };
  }
  return {
    source: "template",
    subject: `Benjamin Rose: ${req.topic}`,
    bodyMarkdown: `# ${req.topic}\n\nHello! This update is for ${aud}.\n\nBenjamin Rose offers:\n\n${bullets}\n\nWe meet you where you are — in the language and format that works best for you. **Reply or call to take the next step.**${more}`,
  };
}
