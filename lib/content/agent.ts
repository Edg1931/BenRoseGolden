import Anthropic from "@anthropic-ai/sdk";
import { LANGUAGE_LABELS, TRACK_LABELS } from "@/lib/participants/curriculum";
import { STAGE_LABELS } from "@/lib/participants/schema";
import { COURSE_DAYS } from "@/lib/learn/course";
import { loadAllPrograms } from "@/lib/programs/sources";
import { LENDER_TIER_LABELS, LOAN_TYPE_LABELS, type Lender } from "@/lib/lenders/schema";
import type { FeedItem } from "./feed";
import type { Audience, CampaignType } from "./schema";
import {
  newsletterDocSchema,
  renderNewsletterText,
  type NewsletterDoc,
  type NewsletterSection,
} from "./newsletter";

/**
 * AI drafting for newsletters & flyers.
 *
 * Newsletters are DESIGNED documents (lib/content/newsletter.ts): Claude Opus 5
 * is briefed with the site's real content — the four classes, the live
 * assistance-program database, and the partner-lender directory — and composes
 * a structured issue (hero, articles, a stat graphic, a program card, the
 * class call-to-action, partner spotlights). Facts must come from the brief;
 * copy is where the model adds value.
 *
 * Without ANTHROPIC_API_KEY, a local assembler builds the same designed issue
 * from the same real data with pre-written copy per audience track, so the
 * composer always produces something worth sending.
 */

const MODEL = "claude-opus-5";

export function isDraftConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export interface SponsorProfile {
  institutionName: string;
  contactName?: string;
  tierLabel: string;
  website?: string;
  offers: { name: string; amount?: string; description?: string }[];
  loanTypes: string[];
  languages: string[];
}

/** Trim a Lender into the profile the newsletter needs. */
export function toSponsorProfile(l: Lender): SponsorProfile {
  return {
    institutionName: l.institutionName,
    contactName: l.contactName ?? undefined,
    tierLabel: LENDER_TIER_LABELS[l.tier],
    website: l.website ?? undefined,
    offers: (l.programs ?? []).map((p) => ({
      name: p.name,
      amount: p.amount ?? undefined,
      description: p.description ?? undefined,
    })),
    loanTypes: (l.loanTypes ?? []).map((t) => LOAN_TYPE_LABELS[t] ?? t),
    languages: (l.languages ?? []).map((c) => LANGUAGE_LABELS[c] ?? c),
  };
}

export interface DraftRequest {
  type: CampaignType;
  topic: string;
  /** Optional pre-chosen subject line (assembler uses it verbatim). */
  subject?: string;
  audience: Audience;
  language: string; // language code
  highlights?: string[];
  instructions?: string;
  /** Recent Benjamin Rose articles / resources to weave into the draft. */
  sources?: FeedItem[];
  /** Partner lenders to promote in this issue. */
  sponsors?: SponsorProfile[];
}

export interface DraftResult {
  bodyMarkdown: string;
  subject?: string;
  /** The designed newsletter document (newsletters only). */
  design?: NewsletterDoc;
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

/* ── The site-content brief the AI writes from ────────────────────────────── */

interface SiteBrief {
  classes: { title: string; blurb: string; minutes: number }[];
  programs: {
    name: string;
    provider: string;
    amount: string;
    requiresHomebuyerEd: boolean;
  }[];
  programCount: number;
}

async function buildSiteBrief(): Promise<SiteBrief> {
  let programs: SiteBrief["programs"] = [];
  let programCount = 0;
  try {
    const all = await loadAllPrograms();
    programCount = all.length;
    programs = all.slice(0, 10).map((p) => ({
      name: p.name,
      provider: p.provider,
      amount: p.amount,
      requiresHomebuyerEd: p.requiresHomebuyerEd === true,
    }));
  } catch {
    // Newsletter drafting must never fail because the program dataset didn't load.
  }
  return {
    classes: COURSE_DAYS.map((d) => ({
      title: d.title,
      blurb: d.blurb,
      minutes: d.minutes,
    })),
    programs,
    programCount,
  };
}

/* ── AI path ──────────────────────────────────────────────────────────────── */

const NEWSLETTER_SYSTEM = `You are the newsletter designer-writer for Benjamin Rose, a nonprofit running HUD-approved housing programs (first-time homebuyer education, foreclosure prevention, credit/financial coaching) in Ohio, in partnership with The Golden Group realty.

Voice: warm, encouraging, plain-language, trustworthy — never salesy, never jargon-heavy. Readers are first-time buyers, at-risk homeowners, or people rebuilding credit; some read in their second language. Short sentences. Concrete actions. Celebrate progress.

You compose a DESIGNED issue by calling submit_newsletter with structured sections. Design guidance:
- Open with a hero (kicker + headline + 1-2 sentence intro) that speaks to this issue's audience.
- Include exactly one "stat" section — one big, true number from the brief (e.g. the count of assistance programs, a dollar amount a program offers, or a well-known credit fact like payment history being 35% of a FICO score). It is the issue's visual anchor.
- 2–3 short "article" sections with practical, specific guidance the audience can act on this week. Draw topics from the class material in the brief.
- One "checklist" (4–6 items) the reader can actually do.
- When the brief includes assistance programs, include one "program" section using a program's REAL name/provider/amount from the brief. Point its url at /assistance.
- Always include a "classCta" pointing at /learn/start inviting them to the free classes (mention the certificate unlocking down-payment assistance).
- For each partner in the brief, include one "sponsor" section: write a warm 1-2 sentence blurb; copy institutionName, contactName, tierLabel, website, and offers VERBATIM from the brief — never invent or alter an offer or amount.
- When the brief lists RECENT ARTICLES, include one "reads" section (title like "Worth your time this month") listing 3–5 of them — copy each title/source/url VERBATIM from the brief and add a one-line note on why it's worth reading. Never list an article that is not in the brief.
- Optionally end with a "quote" (an encouraging, realistic composite — attribute it like "A recent Benjamin Rose graduate", never a named real person).

Hard rules: every number and program fact must come from the brief — never invent amounts, rates, or eligibility. Links must be site-relative (/learn/start, /assistance) or partner websites from the brief. Write the subject line to be opened (concrete benefit, no clickbait, no ALL CAPS), plus a preheader that adds new information.`;

const newsletterTool: Anthropic.Beta.BetaTool = {
  name: "submit_newsletter",
  description: "Submit the designed newsletter issue.",
  input_schema: {
    type: "object",
    properties: {
      subject: { type: "string" },
      preheader: { type: "string" },
      sections: {
        type: "array",
        items: {
          type: "object",
          description:
            "One section. kind ∈ hero|article|stat|checklist|program|classCta|sponsor|quote; include the fields for that kind: hero{kicker?,headline,intro}, article{emoji?,title,paragraphs[],cta{label,url}?}, stat{value,label,caption?}, checklist{title,items[]}, program{name,provider,amount,blurb,url?}, classCta{title,body,buttonLabel,url}, sponsor{institutionName,contactName?,tierLabel,blurb,offers[{name,amount?}],website?}, reads{title,items[{title,source,url,note?}]}, quote{text,attribution}.",
          properties: { kind: { type: "string" } },
          required: ["kind"],
          additionalProperties: true,
        },
      },
    },
    required: ["subject", "sections"],
  },
};

async function aiNewsletter(
  req: DraftRequest,
  brief: SiteBrief,
): Promise<DraftResult | null> {
  const client = new Anthropic();
  const langName = LANGUAGE_LABELS[req.language as keyof typeof LANGUAGE_LABELS] ?? "English";

  const briefText = [
    `TOPIC: ${req.topic}`,
    `AUDIENCE: ${audienceDescription(req.audience)}. Write in ${langName}.`,
    req.highlights?.length ? `MUST HIGHLIGHT:\n- ${req.highlights.join("\n- ")}` : "",
    req.instructions ? `EXTRA INSTRUCTIONS: ${req.instructions}` : "",
    `\nTHE FREE CLASSES (4 days, ~8 hours total, earns the HUD-recognized certificate most down-payment-assistance programs require):`,
    ...brief.classes.map((c, i) => `  Day ${i + 1}: ${c.title} — ${c.blurb} (~${c.minutes} min)`),
    brief.programCount
      ? `\nASSISTANCE PROGRAM DATABASE (${brief.programCount} verified Ohio programs; a sample — use these names/amounts verbatim):\n` +
        brief.programs
          .map(
            (p) =>
              `  - ${p.name} (${p.provider}) — ${p.amount}${p.requiresHomebuyerEd ? " [requires homebuyer-ed certificate]" : ""}`,
          )
          .join("\n")
      : "",
    req.sponsors?.length
      ? `\nPARTNERS TO PROMOTE (copy names/offers/amounts verbatim):\n` +
        req.sponsors
          .map(
            (s) =>
              `  - ${s.institutionName} (${s.tierLabel})${s.contactName ? `, contact ${s.contactName}` : ""}${s.website ? `, ${s.website}` : ""}. Loan types: ${s.loanTypes.join(", ") || "—"}. Languages: ${s.languages.join(", ")}. Offers: ${
                s.offers.map((o) => `${o.name}${o.amount ? ` (${o.amount})` : ""}`).join("; ") || "—"
              }`,
          )
          .join("\n")
      : "",
    req.sources?.length
      ? `\nRECENT ARTICLES (use in a "reads" section, and/or link inline where a topic fits):\n` +
        req.sources.map((s) => `  - ${s.title} (${s.url})${s.excerpt ? ` — ${s.excerpt}` : ""}`).join("\n")
      : "",
    `\nCompose the issue now and call submit_newsletter once.`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    betas: ["server-side-fallback-2026-06-01"],
    fallbacks: [{ model: "claude-opus-4-8" }],
    system: NEWSLETTER_SYSTEM,
    tools: [newsletterTool],
    tool_choice: { type: "tool", name: "submit_newsletter" },
    messages: [{ role: "user", content: briefText }],
  });

  const submit = response.content.find(
    (b): b is Anthropic.Beta.BetaToolUseBlock =>
      b.type === "tool_use" && b.name === "submit_newsletter",
  );
  if (!submit) return null;

  const parsed = newsletterDocSchema.safeParse(submit.input);
  if (!parsed.success) return null;

  const design = parsed.data;
  return {
    design,
    subject: design.subject,
    bodyMarkdown: renderNewsletterText(design),
    source: "ai",
    model: response.model,
  };
}

/* ── Local assembler (no API key) ─────────────────────────────────────────── */

type TrackKey = "first-time-buyer" | "credit-repair" | "financial-coaching" | "foreclosure-prevention";

const TRACK_COPY: Record<
  TrackKey,
  { kicker: string; headline: string; intro: string; article: NewsletterSection; checklist: NewsletterSection; stat: NewsletterSection }
> = {
  "first-time-buyer": {
    kicker: "Your path to the front door",
    headline: "You're closer to your own keys than you think",
    intro:
      "Buying your first home isn't about being rich — it's about being ready. This month: what to do first, and the help waiting for you when you finish class.",
    article: {
      kind: "article",
      emoji: "🏠",
      title: "The one document that unlocks the money",
      paragraphs: [
        "Most Ohio down-payment-assistance programs share one requirement: a certificate from a HUD-approved homebuyer education course. Finish our four free classes and that certificate is yours — and with it, programs offering thousands of dollars toward your down payment and closing costs.",
        "The classes are online, self-paced, and in your language. Most people finish in about eight hours, spread over a few weeks.",
      ],
      cta: { label: "Start Day 1 free", url: "/learn/start" },
    },
    checklist: {
      kind: "checklist",
      title: "Do these 5 things this month",
      items: [
        "Pull your free credit report at annualcreditreport.com and check it for errors",
        "Start (or grow) a house fund — even $25 a paycheck builds the habit",
        "Finish Day 1: Money Management & Understanding Credit",
        "Add your income and county to your profile so we can match you to assistance",
        "Ask your counselor which programs your certificate will unlock",
      ],
    },
    stat: {
      kind: "stat",
      value: "$0",
      label: "What our classes, counseling, and certificate cost you",
      caption: "Free, HUD-approved, and yours to keep.",
    },
  },
  "credit-repair": {
    kicker: "Credit comeback",
    headline: "Your score isn't a grade — it's a lever you can move",
    intro:
      "A credit score isn't a judgment of who you are. It's five numbers you can work on, one habit at a time. Here's where to start this month.",
    article: {
      kind: "article",
      emoji: "📈",
      title: "The two habits that move your score fastest",
      paragraphs: [
        "Payment history is the single biggest slice of your score — about 35%. One tool: set every account to autopay the minimum, then pay more by hand. The autopay is your safety net against a late mark that stays for seven years.",
        "Second is utilization — how much of your card limits you're using. Below 30% helps; below 10% helps more. Paying mid-cycle, before the statement closes, lowers the number the bureaus see.",
      ],
      cta: { label: "Take the free credit class", url: "/learn/day-1" },
    },
    checklist: {
      kind: "checklist",
      title: "Your credit checklist",
      items: [
        "Set autopay minimums on every account — today",
        "Pull all three bureau reports free at annualcreditreport.com",
        "Dispute any account you don't recognize (your counselor can help)",
        "Pay cards down mid-cycle to cut reported utilization",
        "Keep your oldest card open — age helps your score",
      ],
    },
    stat: {
      kind: "stat",
      value: "35%",
      label: "of your FICO score is payment history alone",
      caption: "One habit — paying on time — moves more than a third of your score.",
    },
  },
  "financial-coaching": {
    kicker: "Money, managed",
    headline: "A budget isn't a diet — it's a plan for what you love",
    intro:
      "Budgets fail when they're built on guilt. Ours start from what matters to you, then make the money follow. Here's this month's plan.",
    article: {
      kind: "article",
      emoji: "💡",
      title: "Try the 50/30/20 starting line",
      paragraphs: [
        "Half your take-home for needs, 30% for wants, 20% for savings and debt. Nobody lands exactly there — the point is seeing where you are, without judgment, so you can move one number at a time.",
        "Our free Day 1 class walks you through it with worksheets, a budget calculator, and a coach that answers questions in plain language.",
      ],
      cta: { label: "Build your budget in Day 1", url: "/learn/day-1" },
    },
    checklist: {
      kind: "checklist",
      title: "This month's money moves",
      items: [
        "Track every dollar for two weeks — no fixing, just seeing",
        "Name one 'want' you'll keep on purpose (a budget with zero joy fails)",
        "Open a separate savings account and automate $10–$25 per paycheck",
        "List your debts smallest to largest — pick your payoff order",
        "Book a free session with a Benjamin Rose financial coach",
      ],
    },
    stat: {
      kind: "stat",
      value: "20%",
      label: "the slice of take-home pay to aim toward savings & debt",
      caption: "Start smaller if you need to — the habit beats the amount.",
    },
  },
  "foreclosure-prevention": {
    kicker: "You have options",
    headline: "Behind on the mortgage? The worst move is silence.",
    intro:
      "Falling behind doesn't mean losing your home. The earlier you act, the more options you have — and every one of them starts with a conversation, not a courtroom.",
    article: {
      kind: "article",
      emoji: "🛡️",
      title: "Call your servicer before they call you",
      paragraphs: [
        "Loss-mitigation options — forbearance, repayment plans, loan modification — are real, and servicers are required to review you for them. The families who keep their homes are the ones who engage early, with help.",
        "A Benjamin Rose counselor can be on the call with you, for free. We know the scripts, the paperwork, and the deadlines.",
      ],
      cta: { label: "Get free counseling now", url: "/welcome" },
    },
    checklist: {
      kind: "checklist",
      title: "If you're behind, do this now",
      items: [
        "Open every letter from your servicer — deadlines hide in them",
        "Call a Benjamin Rose counselor before you call the bank alone",
        "Gather your last 2 pay stubs, bank statements, and hardship dates",
        "Never pay a company that promises to 'save your home' for a fee",
        "Know your rights: Ohio requires specific notices before foreclosure",
      ],
    },
    stat: {
      kind: "stat",
      value: "FREE",
      label: "HUD-approved foreclosure counseling, always",
      caption: "Anyone charging you for it is a red flag.",
    },
  },
};

function primaryTrack(a: Audience): TrackKey {
  const t = a.tracks?.find((x): x is TrackKey => x in TRACK_COPY);
  return t ?? "first-time-buyer";
}

function assembleNewsletter(req: DraftRequest, brief: SiteBrief): NewsletterDoc {
  const copy = TRACK_COPY[primaryTrack(req.audience)];
  const sections: NewsletterSection[] = [];

  sections.push({
    kind: "hero",
    kicker: copy.kicker,
    headline: req.topic.trim() && !/newsletter/i.test(req.topic) ? req.topic : copy.headline,
    intro: copy.intro,
  });
  sections.push(copy.stat);
  sections.push(copy.article);

  if (req.highlights?.length) {
    sections.push({ kind: "checklist", title: "This issue's highlights", items: req.highlights });
  }
  sections.push(copy.checklist);

  const spotlight = brief.programs.find((p) => p.requiresHomebuyerEd) ?? brief.programs[0];
  if (spotlight) {
    sections.push({
      kind: "program",
      name: spotlight.name,
      provider: spotlight.provider,
      amount: spotlight.amount,
      blurb: spotlight.requiresHomebuyerEd
        ? "One of the programs your class certificate unlocks. Your counselor can check your eligibility in minutes."
        : "One of the verified Ohio assistance programs in our database. Your counselor can check your eligibility in minutes.",
      url: "/assistance",
    });
  }

  sections.push({
    kind: "classCta",
    title: "Four free classes. One certificate. Real money.",
    body: `Finish our HUD-approved course (about 8 hours, online, at your pace) and earn the certificate that ${
      brief.programCount ? `programs across our ${brief.programCount}-program Ohio database` : "most assistance programs"
    } ask for.`,
    buttonLabel: "Take the free classes",
    url: "/learn/start",
  });

  for (const s of req.sponsors ?? []) {
    sections.push({
      kind: "sponsor",
      institutionName: s.institutionName,
      contactName: s.contactName,
      tierLabel: s.tierLabel,
      blurb: `A Golden Group partner lender${s.languages.length > 1 ? ` serving clients in ${s.languages.join(", ")}` : ""}${
        s.loanTypes.length ? `, offering ${s.loanTypes.slice(0, 4).join(", ")} loans` : ""
      }.`,
      offers: s.offers.slice(0, 3).map((o) => ({ name: o.name, amount: o.amount })),
      website: s.website,
    });
  }

  if (req.sources?.length) {
    sections.push({
      kind: "reads",
      title: "Worth your time this month",
      items: req.sources.slice(0, 5).map((src) => ({
        title: src.title,
        source: src.source,
        url: src.url,
        note: src.excerpt,
      })),
    });
  }

  sections.push({
    kind: "quote",
    text: "I thought owning a home was for other people. The classes broke it into steps, and the steps were doable.",
    attribution: "A recent Benjamin Rose graduate",
  });

  return {
    subject: req.subject ?? `${copy.headline} — Benjamin Rose`,
    preheader: copy.intro.slice(0, 120),
    sections,
  } as NewsletterDoc;
}

/* ── Entry point ──────────────────────────────────────────────────────────── */

export async function draftCampaign(req: DraftRequest): Promise<DraftResult> {
  if (req.type === "newsletter") {
    const brief = await buildSiteBrief();

    if (isDraftConfigured()) {
      try {
        const ai = await aiNewsletter(req, brief);
        if (ai) return ai;
      } catch {
        // fall through to the assembler — drafting must never dead-end
      }
    }

    const design = assembleNewsletter(req, brief);
    return {
      design,
      subject: design.subject,
      bodyMarkdown: renderNewsletterText(design),
      source: "template",
    };
  }

  // Flyers stay Markdown (they're printed/downloaded, not emailed).
  return flyerDraft(req);
}

/* ── Flyer path (Markdown, unchanged behavior) ────────────────────────────── */

const FLYER_SYSTEM = `You are the communications writer for Benjamin Rose, a nonprofit that runs HUD-approved housing programs (first-time homebuyer education, foreclosure prevention, and credit/financial coaching) in Ohio.

Voice: warm, encouraging, plain-language, and trustworthy — never salesy or jargon-heavy. Output GitHub-flavored Markdown only (no preamble, no code fences): a bold headline, a one-line hook, 3–5 punchy benefit bullets, and a call to action with a placeholder for contact info. Keep it concise.`;

async function flyerDraft(req: DraftRequest): Promise<DraftResult> {
  if (!isDraftConfigured()) {
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
    return {
      source: "template",
      bodyMarkdown: `# ${req.topic}\n\n**Benjamin Rose is here to help you reach a stable home.**\n\n${bullets}\n\n**Ready to start?** Call or visit us today — _[add phone / address / signup link]_.`,
    };
  }

  const client = new Anthropic();
  const langName = LANGUAGE_LABELS[req.language as keyof typeof LANGUAGE_LABELS] ?? "English";
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    thinking: { type: "adaptive" },
    system: FLYER_SYSTEM,
    messages: [
      {
        role: "user",
        content: [
          `Write a flyer for Benjamin Rose. Topic: ${req.topic}.`,
          `Audience: ${audienceDescription(req.audience)}. Write it in ${langName}.`,
          req.highlights?.length ? `Highlight:\n- ${req.highlights.join("\n- ")}` : "",
          req.instructions ? `Extra instructions: ${req.instructions}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  return { bodyMarkdown: text, source: "ai", model: response.model };
}
