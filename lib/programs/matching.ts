import type { Program } from "./schema";
import { ASSISTANCE_TYPE_LABELS } from "./schema";

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

  // Income — hard rule only when there's a clean dollar cap; AMI text → caveat.
  const incomeCap = parseMoney(el.incomeLimit);
  if (typeof incomeCap === "number") {
    if (buyer.householdIncome > incomeCap) return null;
    reasons.push(`your income is within the $${incomeCap.toLocaleString()} limit`);
    score += 2;
  } else if (typeof el.incomeLimit === "string" && el.incomeLimit !== "verify") {
    caveats.push(`income limit: ${el.incomeLimit}`);
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
    const occ = buyer.occupation?.toLowerCase().trim();
    const matched =
      !!occ &&
      restriction.some((r) => {
        const t = r.toLowerCase();
        return t.includes(occ) || occ.includes(t.split(/[ ,;]/)[0]);
      });
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
