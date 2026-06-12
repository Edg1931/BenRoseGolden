import type { Program } from "@/lib/programs/schema";
import { candidateId, type CandidateProgram } from "./schema";

export type CandidateStatus = "new" | "changed" | "unchanged";

export interface DiffedCandidate {
  id: string;
  status: CandidateStatus;
  candidate: CandidateProgram;
  /** Existing curated record this matches, if any. */
  existing?: Program;
  /** Field names that differ (for "changed"). */
  changedFields: string[];
}

/** Match a candidate to an existing program by slug id, then by name. */
function findExisting(
  candidate: CandidateProgram,
  existing: Program[],
): Program | undefined {
  const id = candidateId(candidate);
  return (
    existing.find((p) => p.id === id) ||
    existing.find(
      (p) => p.name.toLowerCase().trim() === candidate.name.toLowerCase().trim(),
    )
  );
}

/** Compare the fields a reviewer cares about; returns the list that differ. */
function changedFieldsBetween(
  candidate: CandidateProgram,
  existing: Program,
): string[] {
  const changed: string[] = [];
  const cmp = (label: string, a: unknown, b: unknown) => {
    if (JSON.stringify(a ?? null) !== JSON.stringify(b ?? null)) changed.push(label);
  };
  cmp("assistanceType", candidate.assistanceType, existing.assistanceType);
  cmp("amount", candidate.amount, existing.amount);
  cmp("eligibility.incomeLimit", candidate.eligibility.incomeLimit, existing.eligibility.incomeLimit);
  cmp("eligibility.creditMin", candidate.eligibility.creditMin, existing.eligibility.creditMin);
  cmp("requiresHomebuyerEd", candidate.requiresHomebuyerEd, existing.requiresHomebuyerEd);
  cmp("mustUseApprovedLender", candidate.mustUseApprovedLender, existing.mustUseApprovedLender);
  cmp("sourceUrl", candidate.sourceUrl, existing.sourceUrl);
  return changed;
}

export function diffCandidates(
  candidates: CandidateProgram[],
  existing: Program[],
): DiffedCandidate[] {
  return candidates.map((candidate) => {
    const match = findExisting(candidate, existing);
    if (!match) {
      return {
        id: candidateId(candidate),
        status: "new",
        candidate,
        changedFields: [],
      };
    }
    const changedFields = changedFieldsBetween(candidate, match);
    return {
      id: candidateId(candidate),
      status: changedFields.length > 0 ? "changed" : "unchanged",
      candidate,
      existing: match,
      changedFields,
    };
  });
}

/** Drop null/undefined so optional fields stay absent rather than null. */
function clean<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined) out[k] = v;
  }
  return out as T;
}

/** Turn an approved candidate into a curated Program record. */
export function candidateToProgram(candidate: CandidateProgram): Program {
  return {
    id: candidateId(candidate),
    name: candidate.name,
    provider: candidate.provider,
    level: candidate.level,
    geography: clean({
      statewide: candidate.geography.statewide,
      counties: candidate.geography.counties ?? undefined,
      cities: candidate.geography.cities ?? undefined,
      excludes: candidate.geography.excludes ?? undefined,
    }),
    assistanceType: candidate.assistanceType,
    amount: candidate.amount,
    amountStructured: candidate.amountStructured ?? undefined,
    eligibility: clean({
      firstTimeBuyer: candidate.eligibility.firstTimeBuyer ?? undefined,
      incomeLimit: candidate.eligibility.incomeLimit ?? undefined,
      occupation: candidate.eligibility.occupation ?? undefined,
      creditMin: candidate.eligibility.creditMin ?? undefined,
      propertyType: candidate.eligibility.propertyType ?? undefined,
      purchasePriceLimit: candidate.eligibility.purchasePriceLimit ?? undefined,
    }),
    requiresHomebuyerEd: candidate.requiresHomebuyerEd,
    mustUseApprovedLender: candidate.mustUseApprovedLender ?? undefined,
    participatingLenders: candidate.participatingLenders ?? undefined,
    repayment: candidate.repayment ?? undefined,
    howToApply: candidate.howToApply,
    sourceUrl: candidate.sourceUrl,
    lastVerified: candidate.lastVerified,
    dataSource: "curated",
  };
}
