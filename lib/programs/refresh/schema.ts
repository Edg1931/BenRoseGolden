import { z } from "zod";
import {
  ASSISTANCE_TYPES,
  PROGRAM_LEVELS,
  PROPERTY_TYPES,
} from "@/lib/programs/schema";

/**
 * A "candidate" program produced by the AI refresh agent. It is intentionally
 * close to `Program` but kept separate: candidates are unverified research
 * output that must pass human review before becoming curated data. The agent
 * also attaches a confidence score and free-text sourcing notes for the
 * reviewer.
 */
export const candidateProgramSchema = z.object({
  name: z.string().min(1),
  provider: z.string().min(1),
  level: z.enum(PROGRAM_LEVELS),
  geography: z.object({
    statewide: z.boolean(),
    counties: z.array(z.string()).nullish(),
    cities: z.array(z.string()).nullish(),
  }),
  assistanceType: z.enum(ASSISTANCE_TYPES),
  benefit: z.object({
    amount: z.number().nonnegative().nullish(),
    percent: z.number().min(0).max(100).nullish(),
    description: z.string().nullish(),
  }),
  eligibility: z.object({
    firstTimeBuyer: z.boolean().nullish(),
    incomeLimit: z.number().nonnegative().nullish(),
    occupation: z.array(z.string()).nullish(),
    creditMin: z.number().nullish(),
    propertyType: z.array(z.enum(PROPERTY_TYPES)).nullish(),
    purchasePriceLimit: z.number().nonnegative().nullish(),
  }),
  requiresHomebuyerEd: z.boolean(),
  mustUseApprovedLender: z.boolean(),
  participatingLenders: z.array(z.string()).nullish(),
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
