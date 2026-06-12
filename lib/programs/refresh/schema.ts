import { z } from "zod";
import { ASSISTANCE_TYPES, PROGRAM_LEVELS } from "@/lib/programs/schema";

/**
 * A "candidate" program produced by the AI refresh agent. It mirrors the
 * canonical `Program` shape (amount as human-readable text + optional
 * amountStructured, loose eligibility/geography) but is treated as unverified
 * research output: it carries a confidence score and reviewer note, and must
 * pass human review before becoming curated data.
 */

const triState = z.union([z.boolean(), z.literal("verify")]);

export const candidateProgramSchema = z.object({
  name: z.string().min(1),
  provider: z.string().min(1),
  level: z.enum(PROGRAM_LEVELS),
  geography: z
    .object({
      statewide: z.boolean(),
      counties: z.array(z.string()).nullish(),
      cities: z.array(z.string()).nullish(),
      excludes: z.array(z.string()).nullish(),
    })
    .passthrough(),
  assistanceType: z.enum(ASSISTANCE_TYPES),
  amount: z.string().min(1),
  amountStructured: z.record(z.unknown()).nullish(),
  eligibility: z
    .object({
      firstTimeBuyer: z.boolean().nullish(),
      incomeLimit: z.union([z.string(), z.number()]).nullish(),
      occupation: z.union([z.string(), z.array(z.string())]).nullish(),
      creditMin: z.number().nullish(),
      propertyType: z.union([z.string(), z.array(z.string())]).nullish(),
      purchasePriceLimit: z.union([z.string(), z.number()]).nullish(),
    })
    .passthrough(),
  requiresHomebuyerEd: triState,
  mustUseApprovedLender: triState.nullish(),
  participatingLenders: z.array(z.string()).nullish(),
  repayment: z.string().nullish(),
  howToApply: z.string().min(1),
  sourceUrl: z.string().url(),
  lastVerified: z.string().min(1),
  /** Agent's confidence that this program is real, current, and accurate. */
  confidence: z.enum(["high", "medium", "low"]),
  /** Reviewer-facing note: where it was found, anything to double-check. */
  reviewerNote: z.string().nullish(),
});

export type CandidateProgram = z.infer<typeof candidateProgramSchema>;

/** Slug a candidate into a stable id so it can be diffed against existing data. */
export function candidateId(c: CandidateProgram): string {
  return c.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}
