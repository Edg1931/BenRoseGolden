/**
 * Newsletter source material — recent Benjamin Rose articles and trusted housing
 * resources staff can pull into a newsletter or flyer.
 *
 * When NEWS_FEED_URL is set (an RSS/Atom feed — e.g. the Benjamin Rose blog), the
 * latest posts are fetched live and cached. Otherwise (and on any fetch error)
 * the curated FALLBACK_SOURCES below are used so the composer always has real,
 * working links to offer — never fabricated articles.
 *
 * Set NEWS_FEED_URL to the org's real blog/news feed to surface live content.
 */

export interface FeedItem {
  title: string;
  url: string;
  /** Where it came from, e.g. "Benjamin Rose", "HUD", "OHFA". */
  source: string;
  excerpt?: string;
  /** Display date string if known. */
  date?: string;
}

/**
 * Curated, real, housing-relevant links. These are authoritative resources a
 * Benjamin Rose housing newsletter would genuinely point readers to — used as
 * the default and as a graceful fallback when no live feed is configured.
 */
export const FALLBACK_SOURCES: FeedItem[] = [
  {
    title: "Benjamin Rose — programs & services",
    url: "https://www.benrose.org",
    source: "Benjamin Rose",
    excerpt: "The nonprofit's hub for housing, financial coaching, and community support.",
  },
  {
    title: "Find a HUD-approved housing counselor",
    url: "https://www.hud.gov/i_want_to/talk_to_a_housing_counselor",
    source: "HUD",
    excerpt: "Free, expert help for buying a home or avoiding foreclosure.",
  },
  {
    title: "Ohio first-time homebuyer programs (OHFA)",
    url: "https://myohiohome.org/",
    source: "OHFA",
    excerpt: "Down-payment assistance, affordable loans, and the Mortgage Tax Credit.",
  },
  {
    title: "Buying a House — step-by-step tools",
    url: "https://www.consumerfinance.gov/owning-a-home/",
    source: "CFPB",
    excerpt: "Government guides for comparing loans and understanding closing costs.",
  },
  {
    title: "Get your free credit reports",
    url: "https://www.annualcreditreport.com/",
    source: "AnnualCreditReport",
    excerpt: "The only federally authorized source for free weekly credit reports.",
  },
  {
    title: "Buying a Home — HUD homebuyer resources",
    url: "https://www.hud.gov/topics/buying_a_home",
    source: "HUD",
    excerpt: "What to know before you buy, plus programs that can help.",
  },
];

/** Strip CDATA, tags, and entities from a feed snippet, then truncate. */
function clean(html: string, max = 180): string {
  const text = html
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

function tag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1].trim() : null;
}

/** Minimal RSS/Atom parser — no extra dependencies. */
function parseFeed(xml: string, sourceName: string, limit: number): FeedItem[] {
  const isAtom = /<entry[\s>]/i.test(xml) && !/<item[\s>]/i.test(xml);
  const blocks = xml.match(isAtom ? /<entry[\s>][\s\S]*?<\/entry>/gi : /<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  const items: FeedItem[] = [];
  for (const block of blocks) {
    const title = tag(block, "title");
    if (!title) continue;
    let url: string | null = null;
    if (isAtom) {
      const link = block.match(/<link[^>]*href="([^"]+)"[^>]*\/?>/i);
      url = link ? link[1] : null;
    } else {
      url = tag(block, "link");
    }
    if (!url) continue;
    const rawExcerpt = tag(block, "description") ?? tag(block, "summary") ?? "";
    const rawDate = tag(block, "pubDate") ?? tag(block, "updated") ?? tag(block, "published");
    items.push({
      title: clean(title, 120),
      url: url.trim(),
      source: sourceName,
      excerpt: rawExcerpt ? clean(rawExcerpt) : undefined,
      date: rawDate ? new Date(rawDate).toISOString().slice(0, 10) : undefined,
    });
    if (items.length >= limit) break;
  }
  return items;
}

/**
 * Featured / advertising preferred lenders as newsletter items, so staff can
 * promote paying partners in a newsletter or flyer with one click.
 */
export async function getLenderFeedItems(limit = 4): Promise<FeedItem[]> {
  try {
    const { listLenders } = await import("@/lib/lenders/repository");
    const lenders = await listLenders();
    return lenders
      .filter((l) => l.active && (l.tier === "featured" || l.advertising) && l.website)
      .slice(0, limit)
      .map((l) => ({
        title: l.institutionName + (l.contactName ? ` — ${l.contactName}` : ""),
        url: l.website!,
        source: "Partner lender",
        excerpt: l.marketingBlurb ?? (l.programs.map((p) => p.name).join(", ") || undefined),
      }));
  } catch {
    return [];
  }
}

/**
 * Returns newsletter source material: live feed posts when NEWS_FEED_URL is
 * configured (followed by the curated links), otherwise the curated links alone.
 * Never throws — falls back to FALLBACK_SOURCES on any error.
 */
export async function getNewsletterSources(limit = 6): Promise<FeedItem[]> {
  const feedUrl = process.env.NEWS_FEED_URL;
  const sourceName = process.env.NEWS_FEED_SOURCE_NAME || "Benjamin Rose";
  if (!feedUrl) return FALLBACK_SOURCES.slice(0, limit);

  try {
    const res = await fetch(feedUrl, {
      headers: { "User-Agent": "BenjaminRoseHousing/1.0 (+newsletter)" },
      next: { revalidate: 21_600 }, // 6 hours
    });
    if (!res.ok) return FALLBACK_SOURCES.slice(0, limit);
    const xml = await res.text();
    const live = parseFeed(xml, sourceName, limit);
    if (live.length === 0) return FALLBACK_SOURCES.slice(0, limit);
    // Live posts first, then top up with curated links if there's room.
    const merged = [...live];
    for (const f of FALLBACK_SOURCES) {
      if (merged.length >= limit) break;
      if (!merged.some((m) => m.url === f.url)) merged.push(f);
    }
    return merged.slice(0, limit);
  } catch {
    return FALLBACK_SOURCES.slice(0, limit);
  }
}
