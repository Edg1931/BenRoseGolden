import type { Program } from "./schema";
import { ASSISTANCE_TYPE_LABELS } from "./schema";
import { amiIncomeLimit, parseAmiPercent } from "./ami";
import { occupationMatches } from "./occupations";

/** Title-case a county name for display in reasons/caveats. */
function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Buyer inputs collected by the Module 2 questionnaire. */
export interface BuyerProfile {
  county?: string;
  city?: string;
  firstTimeBuyer: boolean;
  householdSize: number;
  householdIncome: number;
  occupation?: string;
  estimatedCredit: number;
  completedHomebuyerEd: boolean;
  /** Optional, refines purchase-price-limit checks when known. */
  targetPurchasePrice?: number;
}

export interface MatchResult {
  program: Program;
  /** Higher = better fit. Used to rank the list. */
  score: number;
  /** Plain-language reasons the buyer qualifies. */
  reasons: string[];
  /** Reasons they may NOT qualify / caveats to verify. */
  caveats: string[];
  /** True when the buyer's HUD certificate satisfies a required-education program. */
  unlockedByCertificate: boolean;
  /** The single most useful next action. */
  nextStep: string;
  link: string;
}

/**
 * Pull a dollar amount out of a number or a string like "$313,500".
 * Returns undefined for AMI/percent text ("80% AMI", "Varies by county",
 * "verify") — we require 4+ digits so "80" or "3 years" never read as a cap.
 */
function parseMoney(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return undefined;
  const match = value.replace(/,/g, "").match(/\$?\s*(\d{4,})(?:\.\d+)?/);
  return match ? Number(match[1]) : undefined;
}

/** Normalize an occupation restriction to a list of tokens, or null for "all". */
function occupationRestriction(program: Program): string[] | null {
  const occ = program.eligibility.occupation;
  if (!occ || occ === "all") return null;
  const tokens = Array.isArray(occ) ? occ : [occ];
  const detail = program.eligibility.occupationDetail;
  return typeof detail === "string" ? [...tokens, detail] : tokens;
}

function servesLocation(program: Program, buyer: BuyerProfile): boolean {
  const geo = program.geography;
  const county = buyer.county?.toLowerCase();
  const city = buyer.city?.toLowerCase();

  // Explicit carve-outs win — e.g. the county program that excludes Cleveland.
  const excludes = (geo.excludes ?? []).map((s) => s.toLowerCase());
  if (city && excludes.includes(city)) return false;

  if (geo.statewide) return true;

  const countyMatch =
    !!county && (geo.counties ?? []).some((c) => c.toLowerCase() === county);
  const cityMatch =
    !!city && (geo.cities ?? []).some((c) => c.toLowerCase() === city);

  // Scoped program but the buyer's location doesn't match → not served.
  if ((geo.counties?.length || geo.cities?.length) && !countyMatch && !cityMatch) {
    return false;
  }
  return countyMatch || cityMatch;
}

/**
 * Score a single program against the buyer. Returns null only on a hard,
 * machine-verifiable ineligibility (location, first-time, numeric income/credit,
 * numeric price cap). Soft/textual limits become caveats to confirm.
 */
export function evaluateProgram(
  program: Program,
  buyer: BuyerProfile,
): MatchResult | null {
  if (!servesLocation(program, buyer)) return null;

  const el = program.eligibility;
  const reasons: string[] = [];
  const caveats: string[] = [];
  let score = 0;

  // First-time buyer (hard rule only when the program explicitly requires it).
  if (el.firstTimeBuyer === true) {
    if (!buyer.firstTimeBuyer) return null;
    reasons.push("you're a first-time homebuyer");
    score += 1;
  } else if (el.firstTimeBuyer === false) {
    reasons.push("open to repeat buyers (not first-time only)");
  }

  // Income — a clean dollar cap is a hard rule; a "% AMI" limit becomes a hard
  // rule too once we can resolve it against the buyer's county + household size
  // (HUD AMI table); otherwise it stays a caveat to confirm.
  const incomeCap = parseMoney(el.incomeLimit);
  const knownIncome = buyer.householdIncome > 0;
  if (typeof incomeCap === "number") {
    if (knownIncome && buyer.householdIncome > incomeCap) return null;
    reasons.push(`your income is within the $${incomeCap.toLocaleString()} limit`);
    score += 2;
  } else if (typeof el.incomeLimit === "string" && el.incomeLimit !== "verify") {
    const amiPercent = parseAmiPercent(el.incomeLimit);
    const amiCap =
      amiPercent != null && buyer.county
        ? amiIncomeLimit(buyer.county, buyer.householdSize, amiPercent)
        : null;
    if (amiPercent != null && amiCap != null) {
      const where = `${amiPercent}% AMI (~$${amiCap.toLocaleString()} for ${buyer.householdSize} in ${titleCase(buyer.county!)})`;
      if (knownIncome && buyer.householdIncome > amiCap) return null;
      if (knownIncome) {
        reasons.push(`your income is within the ${where}`);
        score += 2;
      } else {
        caveats.push(`income must be at or below ${where}`);
      }
    } else {
      // No clean AMI percent, or county not in the AMI table → confirm manually.
      caveats.push(`income limit: ${el.incomeLimit}`);
    }
  }

  // Credit — hard rule only when a numeric minimum is published.
  if (typeof el.creditMin === "number") {
    if (buyer.estimatedCredit < el.creditMin) return null;
    reasons.push(`your estimated credit meets the ${el.creditMin}+ minimum`);
    score += 1;
  }

  // Purchase-price limit.
  const priceCap = parseMoney(el.purchasePriceLimit);
  if (typeof priceCap === "number") {
    if (
      typeof buyer.targetPurchasePrice === "number" &&
      buyer.targetPurchasePrice > priceCap
    ) {
      return null;
    }
    caveats.push(`home price must be at or below $${priceCap.toLocaleString()}`);
  } else if (
    typeof el.purchasePriceLimit === "string" &&
    el.purchasePriceLimit !== "verify"
  ) {
    caveats.push(`purchase-price limit: ${el.purchasePriceLimit}`);
  }

  // Occupation restriction.
  const restriction = occupationRestriction(program);
  if (restriction) {
    const matched = occupationMatches(buyer.occupation, restriction);
    if (matched) {
      reasons.push(`your occupation (${buyer.occupation}) qualifies`);
      score += 2;
    } else {
      caveats.push(`limited to: ${restriction[0]}`);
    }
  }

  // Local programs rank above statewide ones for the same buyer.
  if (!program.geography.statewide) score += 1;

  // Homebuyer education + certificate unlock.
  let unlockedByCertificate = false;
  if (program.requiresHomebuyerEd === true) {
    if (buyer.completedHomebuyerEd) {
      unlockedByCertificate = true;
      reasons.push("your HUD homebuyer-education certificate is on file");
      score += 3; // strongly surface programs the certificate unlocks
    } else {
      caveats.push("requires completing HUD homebuyer education first");
    }
  } else if (program.requiresHomebuyerEd === "verify") {
    caveats.push("may require homebuyer education — confirm with the program");
  }

  if (program.mustUseApprovedLender === true) {
    caveats.push("must use an approved participating lender");
  } else if (program.mustUseApprovedLender === "verify") {
    caveats.push("may require an approved lender — confirm");
  }

  // Surface funding-round programs (grants are often first-come/closed between rounds).
  if (/funding round|first-come|exhausted|closed between/i.test(program.notes ?? "")) {
    caveats.push("availability is limited to open funding rounds — check current status");
  }

  return {
    program,
    score,
    reasons,
    caveats,
    unlockedByCertificate,
    nextStep: buildNextStep(program, buyer),
    link: program.sourceUrl,
  };
}

function buildNextStep(program: Program, buyer: BuyerProfile): string {
  if (program.requiresHomebuyerEd === true && !buyer.completedHomebuyerEd) {
    return "Complete HUD-approved homebuyer education, then apply.";
  }
  if (program.mustUseApprovedLender === true && program.participatingLenders?.length) {
    return `Contact an approved lender (${program.participatingLenders
      .slice(0, 2)
      .join(", ")}) to apply.`;
  }
  return program.howToApply;
}

/** Rank all programs for a buyer, best fit first. Certificate-unlocked rise. */
export function matchPrograms(
  programs: Program[],
  buyer: BuyerProfile,
): MatchResult[] {
  return programs
    .map((p) => evaluateProgram(p, buyer))
    .filter((r): r is MatchResult => r !== null)
    .sort((a, b) => {
      if (a.unlockedByCertificate !== b.unlockedByCertificate) {
        return a.unlockedByCertificate ? -1 : 1;
      }
      if (b.score !== a.score) return b.score - a.score;
      return benefitWeight(b.program) - benefitWeight(a.program);
    });
}

/** Rough benefit size for ranking tiebreaks, from the structured amount. */
function benefitWeight(program: Program): number {
  const s = program.amountStructured as Record<string, unknown> | undefined;
  if (!s) return 0;
  if (typeof s.maxDollar === "number") return s.maxDollar;
  if (typeof s.veteranMaxDollar === "number") return s.veteranMaxDollar;
  if (typeof s.percent === "number") return s.percent * 1000;
  if (Array.isArray(s.range) && typeof s.range[1] === "number") {
    return s.range[1] * 1000;
  }
  return 0;
}

export function assistanceTypeLabel(program: Program): string {
  return ASSISTANCE_TYPE_LABELS[program.assistanceType];
}
