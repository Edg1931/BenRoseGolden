import Anthropic from "@anthropic-ai/sdk";
import type { FeedItem } from "./feed";
import { ARTICLE_TOPICS, ARTICLE_TOPIC_LABELS, type ArticleTopic } from "./article-topics";

export { ARTICLE_TOPICS, ARTICLE_TOPIC_LABELS, type ArticleTopic };

/**
 * Article research for newsletters.
 *
 * Staff pick topic areas; Claude Opus 5 searches the web for CURRENT, real
 * articles from reputable outlets and agencies, returning title/URL/source/
 * excerpt for each. Results are candidates for a human to check into an issue —
 * the composer never auto-inserts them.
 *
 * Without an API key (and on any failure), a curated per-topic library of
 * real, stable resources is returned instead, so the button always produces
 * genuine links — never fabricated ones.
 */

const TOPIC_SEARCH_HINTS: Record<ArticleTopic, string> = {
  "cleveland-homebuying":
    "buying a home in Cleveland / Cuyahoga County: market news, neighborhood programs, local homebuyer resources",
  "first-time-buyer":
    "first-time homebuyer guidance: preparing to buy, mortgages, common mistakes, saving for a down payment",
  "credit-repair":
    "credit repair and credit building: raising a credit score, disputing errors, credit counseling",
  "fha-counseling":
    "FHA loans and HUD-approved housing counseling: FHA requirements, benefits, finding a counselor",
  "assistance-programs":
    "down-payment and closing-cost assistance: grants, forgivable loans, Ohio and national programs",
  "seniors-families":
    "older adults and housing: aging in place, senior housing decisions, families and caregivers helping a parent with housing or finances",
};

/** Curated, real, stable resources per topic — the no-API and failure fallback. */
export const CURATED_ARTICLES: Record<ArticleTopic, FeedItem[]> = {
  "cleveland-homebuying": [
    {
      title: "CHN Housing Partners — Cleveland homebuyer programs",
      url: "https://chnhousingpartners.org/",
      source: "CHN Housing Partners",
      excerpt: "Cleveland's large housing nonprofit: purchase programs, counseling, and repair help.",
    },
    {
      title: "Cleveland Neighborhood Progress — neighborhood resources",
      url: "https://www.clevelandnp.org/",
      source: "Cleveland Neighborhood Progress",
      excerpt: "Community development across Cleveland neighborhoods, including housing initiatives.",
    },
  ],
  "first-time-buyer": [
    {
      title: "Buying a House — step-by-step tools",
      url: "https://www.consumerfinance.gov/owning-a-home/",
      source: "CFPB",
      excerpt: "Government guides for loan comparison, closing costs, and each step to the keys.",
    },
    {
      title: "Buying a Home — HUD homebuyer resources",
      url: "https://www.hud.gov/topics/buying_a_home",
      source: "HUD",
      excerpt: "What to know before you buy, plus programs that can help.",
    },
    {
      title: "Ohio first-time homebuyer programs (OHFA)",
      url: "https://myohiohome.org/",
      source: "OHFA",
      excerpt: "Down-payment assistance, affordable loans, and the Mortgage Tax Credit.",
    },
  ],
  "credit-repair": [
    {
      title: "Get your free credit reports",
      url: "https://www.annualcreditreport.com/",
      source: "AnnualCreditReport",
      excerpt: "The only federally authorized source for free weekly credit reports.",
    },
    {
      title: "Disputing errors on your credit report",
      url: "https://www.consumerfinance.gov/ask-cfpb/how-do-i-dispute-an-error-on-my-credit-report-en-314/",
      source: "CFPB",
      excerpt: "Step-by-step guide to disputing credit-report errors with the bureaus.",
    },
    {
      title: "Find a nonprofit credit counselor",
      url: "https://www.nfcc.org/",
      source: "NFCC",
      excerpt: "The National Foundation for Credit Counseling's member agencies.",
    },
  ],
  "fha-counseling": [
    {
      title: "Find a HUD-approved housing counselor",
      url: "https://www.hud.gov/i_want_to/talk_to_a_housing_counselor",
      source: "HUD",
      excerpt: "Free, expert help for buying a home or avoiding foreclosure.",
    },
    {
      title: "FHA loans — what they are and how they work",
      url: "https://www.consumerfinance.gov/ask-cfpb/what-is-an-fha-loan-en-112/",
      source: "CFPB",
      excerpt: "Plain-language answers about FHA loans and who they fit.",
    },
  ],
  "assistance-programs": [
    {
      title: "Ohio Housing Finance Agency — homebuyer assistance",
      url: "https://www.ohiohome.org/",
      source: "OHFA",
      excerpt: "The state agency behind Your Choice! DPA, Ohio Heroes, and Grants for Grads.",
    },
    {
      title: "Down payment assistance — how it works",
      url: "https://www.consumerfinance.gov/owning-a-home/",
      source: "CFPB",
      excerpt: "Understanding grants, second mortgages, and forgivable loans before you apply.",
    },
  ],
  "seniors-families": [
    {
      title: "Benjamin Rose — services for older adults & caregivers",
      url: "https://www.benrose.org/",
      source: "Benjamin Rose",
      excerpt: "Programs and expertise for seniors and the families who care for them.",
    },
    {
      title: "Housing options for older adults",
      url: "https://www.ncoa.org/",
      source: "NCOA",
      excerpt: "The National Council on Aging's guidance on housing and money for seniors.",
    },
    {
      title: "Eldercare Locator — find local support",
      url: "https://eldercare.acl.gov/",
      source: "ACL",
      excerpt: "The federal directory connecting older adults and caregivers to local services.",
    },
    {
      title: "Reverse mortgages — what families should know",
      url: "https://www.consumerfinance.gov/consumer-tools/reverse-mortgages/",
      source: "CFPB",
      excerpt: "Straight answers before a senior taps home equity.",
    },
  ],
};

export function curatedArticles(topics: ArticleTopic[]): FeedItem[] {
  const chosen = topics.length ? topics : [...ARTICLE_TOPICS];
  const out: FeedItem[] = [];
  for (const t of chosen) {
    for (const a of CURATED_ARTICLES[t]) {
      if (!out.some((x) => x.url === a.url)) out.push(a);
    }
  }
  return out;
}

export interface ArticleSearchResult {
  articles: FeedItem[];
  source: "ai" | "curated";
  model?: string;
}

const FINDER_SYSTEM = `You are a research assistant curating reading material for a housing newsletter published by Benjamin Rose, a Cleveland-based nonprofit serving first-time homebuyers, people repairing credit, families in housing counseling, and older adults & their caregivers.

Find CURRENT, REAL articles and resources a reader would genuinely benefit from. Rules:
- Only include pages you found via web search — copy the exact URL from the search result. Never construct or guess a URL.
- Prefer reputable sources: government agencies (HUD, CFPB, OHFA), established nonprofits, major news outlets, and local Cleveland/Ohio outlets. Avoid lender marketing, content farms, and paywalled pieces.
- Prefer recent pieces (this year) for news; evergreen official guides are fine too.
- Write a one-sentence excerpt in plain language saying why it's worth the reader's time.
- 6–10 items across the requested topics.

When done, call submit_articles exactly once.`;

const submitArticlesTool: Anthropic.Beta.BetaTool = {
  name: "submit_articles",
  description: "Submit the curated article list.",
  input_schema: {
    type: "object",
    properties: {
      articles: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            url: { type: "string", description: "Exact URL from a search result." },
            source: { type: "string", description: "Publisher, e.g. HUD, CFPB, Cleveland.com" },
            excerpt: { type: "string" },
            date: { type: "string", description: "Publish date if known, yyyy-mm-dd." },
          },
          required: ["title", "url", "source"],
        },
      },
    },
    required: ["articles"],
  },
};

function validArticle(a: unknown): a is FeedItem {
  if (!a || typeof a !== "object") return false;
  const x = a as Record<string, unknown>;
  if (typeof x.title !== "string" || !x.title.trim()) return false;
  if (typeof x.source !== "string" || !x.source.trim()) return false;
  if (typeof x.url !== "string") return false;
  try {
    const u = new URL(x.url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** Search the web for fresh articles; falls back to the curated library. */
export async function findArticles(
  topics: ArticleTopic[],
  extraQuery?: string,
): Promise<ArticleSearchResult> {
  const fallback: ArticleSearchResult = {
    articles: curatedArticles(topics),
    source: "curated",
  };
  if (!process.env.ANTHROPIC_API_KEY) return fallback;

  try {
    const client = new Anthropic();
    const chosen = topics.length ? topics : [...ARTICLE_TOPICS];
    const prompt = [
      `Find current articles/resources for these topic areas:`,
      ...chosen.map((t) => `- ${ARTICLE_TOPIC_LABELS[t]}: ${TOPIC_SEARCH_HINTS[t]}`),
      extraQuery ? `Also specifically: ${extraQuery}` : "",
      `Today's date: ${new Date().toISOString().slice(0, 10)}. Search, then call submit_articles.`,
    ]
      .filter(Boolean)
      .join("\n");

    const messages: Anthropic.Beta.BetaMessageParam[] = [
      { role: "user", content: prompt },
    ];
    const tools: Anthropic.Beta.BetaToolUnion[] = [
      { type: "web_search_20260209", name: "web_search", max_uses: 8 },
      submitArticlesTool,
    ];

    for (let i = 0; i < 6; i++) {
      const response = await client.beta.messages.create({
        model: "claude-opus-5",
        max_tokens: 8000,
        thinking: { type: "adaptive" },
        betas: ["server-side-fallback-2026-06-01"],
        fallbacks: [{ model: "claude-opus-4-8" }],
        system: FINDER_SYSTEM,
        tools,
        messages,
      });
      messages.push({
        role: "assistant",
        content: response.content as Anthropic.Beta.BetaContentBlockParam[],
      });

      const submit = response.content.find(
        (b): b is Anthropic.Beta.BetaToolUseBlock =>
          b.type === "tool_use" && b.name === "submit_articles",
      );
      if (submit) {
        const raw = (submit.input as { articles?: unknown[] })?.articles ?? [];
        const articles = raw.filter(validArticle).map((a) => ({
          title: a.title.trim().slice(0, 140),
          url: a.url,
          source: a.source.trim().slice(0, 60),
          excerpt: a.excerpt?.trim().slice(0, 220) || undefined,
          date: a.date,
        }));
        if (articles.length === 0) return fallback;
        return { articles, source: "ai", model: response.model };
      }
      if (response.stop_reason === "pause_turn") continue;
      if (response.stop_reason === "end_turn") {
        messages.push({
          role: "user",
          content: "Call submit_articles now with what you found.",
        });
        continue;
      }
      break;
    }
    return fallback;
  } catch {
    return fallback;
  }
}
