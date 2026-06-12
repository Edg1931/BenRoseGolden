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

function servesLocation(program: Program, buyer: BuyerProfile): boolean {
  const geo = program.geography;
  if (geo.statewide) return true;
  const county = buyer.county?.toLowerCase();
  const city = buyer.city?.toLowerCase();
  const countyMatch =
    !!county && (geo.counties ?? []).some((c) => c.toLowerCase() === county);
  const cityMatch =
    !!city && (geo.cities ?? []).some((c) => c.toLowerCase() === city);
  // If a program scopes geography but the buyer gave no matching location, exclude.
  if ((geo.counties?.length || geo.cities?.length) && !countyMatch && !cityMatch) {
    return false;
  }
  return countyMatch || cityMatch;
}

/**
 * Score a single program against the buyer. Returns null when the buyer is
 * clearly ineligible on a hard rule (location, first-time, income, credit).
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

  // First-time buyer (hard rule when required).
  if (el.firstTimeBuyer) {
    if (!buyer.firstTimeBuyer) return null;
    reasons.push("you're a first-time homebuyer");
    score += 1;
  }

  // Income (hard rule when a cap exists).
  if (typeof el.incomeLimit === "number") {
    if (buyer.householdIncome > el.incomeLimit) return null;
    reasons.push(
      `your household income is within the $${el.incomeLimit.toLocaleString()} limit`,
    );
    score += 2;
  }

  // Credit (hard rule when a minimum exists).
  if (typeof el.creditMin === "number") {
    if (buyer.estimatedCredit < el.creditMin) return null;
    reasons.push(`your estimated credit meets the ${el.creditMin}+ minimum`);
    score += 1;
  }

  // Purchase price limit (caveat unless the buyer gave a target above the cap).
  if (typeof el.purchasePriceLimit === "number") {
    if (
      typeof buyer.targetPurchasePrice === "number" &&
      buyer.targetPurchasePrice > el.purchasePriceLimit
    ) {
      return null;
    }
    caveats.push(
      `home price must be at or below $${el.purchasePriceLimit.toLocaleString()}`,
    );
  }

  // Occupation (caveat — buyer may still qualify, confirm with provider).
  if (el.occupation && el.occupation.length > 0) {
    const occ = buyer.occupation?.toLowerCase();
    const occMatch = occ && el.occupation.some((o) => o.toLowerCase() === occ);
    if (occMatch) {
      reasons.push(`your occupation (${buyer.occupation}) qualifies`);
      score += 2;
    } else {
      caveats.push(`limited to: ${el.occupation.join(", ")}`);
    }
  }

  // Geography precision boost — local programs rank above statewide for a match.
  if (!program.geography.statewide) score += 1;

  // Homebuyer education + certificate unlock.
  let unlockedByCertificate = false;
  if (program.requiresHomebuyerEd) {
    if (buyer.completedHomebuyerEd) {
      unlockedByCertificate = true;
      reasons.push("your HUD homebuyer-education certificate is on file");
      score += 3; // strongly surface programs the certificate unlocks
    } else {
      caveats.push("requires completing HUD homebuyer education first");
    }
  }

  if (program.mustUseApprovedLender) {
    caveats.push("must use an approved participating lender");
  }

  const nextStep = buildNextStep(program, buyer, unlockedByCertificate);

  return {
    program,
    score,
    reasons,
    caveats,
    unlockedByCertificate,
    nextStep,
    link: program.sourceUrl,
  };
}

function buildNextStep(
  program: Program,
  buyer: BuyerProfile,
  unlocked: boolean,
): string {
  if (program.requiresHomebuyerEd && !buyer.completedHomebuyerEd) {
    return "Complete HUD-approved homebuyer education, then apply.";
  }
  if (program.mustUseApprovedLender && program.participatingLenders?.length) {
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
      // Unlocked-by-certificate first, then by score, then by benefit size.
      if (a.unlockedByCertificate !== b.unlockedByCertificate) {
        return a.unlockedByCertificate ? -1 : 1;
      }
      if (b.score !== a.score) return b.score - a.score;
      return benefitWeight(b.program) - benefitWeight(a.program);
    });
}

function benefitWeight(program: Program): number {
  return program.benefit.amount ?? program.benefit.percent ?? 0;
}

export function assistanceTypeLabel(program: Program): string {
  return ASSISTANCE_TYPE_LABELS[program.assistanceType];
}
