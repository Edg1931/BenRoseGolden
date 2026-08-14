/**
 * Occupation choices offered to buyers and staff.
 *
 * These are the "hero" categories real DPA programs carve out (teachers, first
 * responders, healthcare, military). The matching engine token-matches these
 * labels against a program's `eligibility.occupation`, so the wording here is
 * load-bearing — keep the leading noun ("Teacher", "Police", "Firefighter")
 * aligned with how programs describe their restrictions.
 */
export const OCCUPATION_OPTIONS = [
  "",
  "Teacher / educator",
  "Police officer",
  "Firefighter / EMT",
  "Healthcare worker",
  "Veteran / active military",
  "Other",
] as const;

/** The label appended when a participant is flagged as a veteran. */
export const VETERAN_OCCUPATION = "Veteran / active military";

/**
 * Combine a stated occupation with veteran status into the single string the
 * matching engine reads, so a veteran who is also a teacher matches BOTH the
 * teacher-only and veteran-only programs.
 */
export function occupationForMatching(
  occupation?: string,
  veteran?: boolean,
): string | undefined {
  const parts: string[] = [];
  if (occupation && occupation.trim()) parts.push(occupation.trim());
  if (veteran && !parts.some((p) => /veteran|military/i.test(p))) {
    parts.push(VETERAN_OCCUPATION);
  }
  return parts.length > 0 ? parts.join(", ") : undefined;
}

/**
 * Keywords each occupation choice should match on, because programs describe
 * their carve-outs in their own words. "Ohio Heroes" says "Veterans, active-duty
 * military, police, firefighters, EMTs/paramedics, physicians, nurses, and
 * teachers/administrators" — a naive string compare against "Teacher / educator"
 * finds nothing, so we match on profession keywords instead.
 */
const OCCUPATION_KEYWORDS: { match: RegExp; keywords: string[] }[] = [
  { match: /teacher|educator|school/i, keywords: ["teacher", "educator", "administrator", "school", "faculty"] },
  { match: /police|law enforcement|sheriff/i, keywords: ["police", "law enforcement", "sheriff", "deputy", "first responder", "peace officer"] },
  { match: /fire|emt|paramedic/i, keywords: ["firefighter", "fire fighter", "emt", "paramedic", "first responder", "emergency medical"] },
  { match: /health|nurse|physician|doctor|medical/i, keywords: ["nurse", "physician", "doctor", "healthcare", "health care", "medical"] },
  { match: /veteran|military|armed forces/i, keywords: ["veteran", "military", "active duty", "active-duty", "armed forces", "service member"] },
];

/** Keywords to test a restriction against, for a given buyer occupation string. */
function keywordsFor(occupation: string): string[] {
  const found = OCCUPATION_KEYWORDS.filter((o) => o.match.test(occupation)).flatMap(
    (o) => o.keywords,
  );
  if (found.length > 0) return found;
  // Unrecognized / free-text occupation: fall back to its own significant words.
  return occupation
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => w.length > 3 && w !== "other");
}

/**
 * Does the buyer's occupation satisfy a program's occupation restriction?
 * `restrictionTexts` is the program's `occupation` plus its `occupationDetail`.
 */
export function occupationMatches(
  occupation: string | undefined,
  restrictionTexts: string[],
): boolean {
  if (!occupation?.trim()) return false;
  const haystack = restrictionTexts.join(" ").toLowerCase();
  if (!haystack.trim()) return false;
  return keywordsFor(occupation).some((k) => haystack.includes(k));
}
