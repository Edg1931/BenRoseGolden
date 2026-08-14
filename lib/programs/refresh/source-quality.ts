/**
 * Deterministic source-quality annotation for AI-researched programs.
 *
 * The agent is told to cite official sources, but the reviewer shouldn't have
 * to eyeball every URL to notice when it didn't. This classifies the cited
 * domain and appends a reviewer-facing warning to candidates whose source
 * doesn't look like a government / housing-agency / nonprofit page — the usual
 * shape of a lender-marketing or blog citation slipping through.
 *
 * Annotation only: it never drops a candidate or changes the model's stated
 * confidence. The human reviewer stays the judge.
 */

/** Domains that are official sources but don't have an official-looking TLD. */
const KNOWN_OFFICIAL_HOSTS = [
  "ohiohome.org", // Ohio Housing Finance Agency
  "myohiohome.org",
  "hud.gov",
  "huduser.gov",
];

export type SourceQuality = "official" | "likely-official" | "unofficial";

/** Classify how official a cited source URL looks. */
export function classifySource(sourceUrl: string): SourceQuality {
  let host: string;
  try {
    host = new URL(sourceUrl).hostname.toLowerCase();
  } catch {
    return "unofficial";
  }

  if (KNOWN_OFFICIAL_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
    return "official";
  }
  // Government TLDs, incl. state/county sites like cuyahogacounty.us.
  if (host.endsWith(".gov") || host.endsWith(".us")) return "official";
  // Agencies and nonprofits overwhelmingly live on .org.
  if (host.endsWith(".org")) return "likely-official";
  return "unofficial";
}

/**
 * The reviewer warning for a non-official source, or null when none is needed.
 */
export function sourceWarning(sourceUrl: string): string | null {
  if (classifySource(sourceUrl) !== "unofficial") return null;
  let host = sourceUrl;
  try {
    host = new URL(sourceUrl).hostname;
  } catch {
    return `Cited source is not a valid URL — verify before approving.`;
  }
  return `Cited source (${host}) is not a government/agency/nonprofit domain — confirm it is the program's official page before approving.`;
}
