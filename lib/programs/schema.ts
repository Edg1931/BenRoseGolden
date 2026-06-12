import { z } from "zod";

/**
 * Module 2 — Ohio down-payment-assistance & grant finder.
 *
 * The schema mirrors the curated statewide dataset (data/programs.seed.json):
 * `amount` is the human-readable source of truth, `amountStructured` is a
 * best-effort machine-readable form, and eligibility/geography are kept loose
 * (strings like "Varies by county", "verify", or "$313,500") because real
 * program terms are often textual and uncertain. Objects use `.passthrough()`
 * so newly-added source fields never break a load.
 */

export const PROGRAM_LEVELS = [
  "state",
  "regional",
  "county",
  "city",
  "nonprofit",
] as const;
export type ProgramLevel = (typeof PROGRAM_LEVELS)[number];

export const ASSISTANCE_TYPES = [
  "grant",
  "forgivable_loan",
  "deferred_loan",
  "second_mortgage",
  "rate_discount",
  "tax_credit",
  "match",
] as const;
export type AssistanceType = (typeof ASSISTANCE_TYPES)[number];

export const ASSISTANCE_TYPE_LABELS: Record<AssistanceType, string> = {
  grant: "Grant",
  forgivable_loan: "Forgivable Loan",
  deferred_loan: "Deferred Loan",
  second_mortgage: "Second Mortgage",
  rate_discount: "Rate Discount",
  tax_credit: "Tax Credit (MCC)",
  match: "Matched Savings",
};

/** Geography: statewide, or scoped to counties/cities with optional carve-outs. */
export const geographySchema = z
  .object({
    statewide: z.boolean().default(false),
    counties: z.array(z.string()).optional(),
    cities: z.array(z.string()).optional(),
    excludes: z.array(z.string()).optional(),
    neighborhoods: z.array(z.string()).optional(),
    zips: z.array(z.string()).optional(),
    multiState: z.array(z.string()).optional(),
  })
  .passthrough();
export type Geography = z.infer<typeof geographySchema>;

/** Loose eligibility — values may be numbers OR descriptive strings. */
export const eligibilitySchema = z
  .object({
    firstTimeBuyer: z.boolean().optional(),
    incomeLimit: z.union([z.string(), z.number()]).optional(),
    occupation: z.union([z.string(), z.array(z.string())]).optional(),
    occupationDetail: z.string().optional(),
    creditMin: z.number().nullable().optional(),
    propertyType: z.union([z.string(), z.array(z.string())]).optional(),
    purchasePriceLimit: z.union([z.string(), z.number()]).optional(),
  })
  .passthrough();
export type Eligibility = z.infer<typeof eligibilitySchema>;

/** A field may be a clean boolean or the sentinel "verify" (not yet confirmed). */
const triState = z.union([z.boolean(), z.literal("verify")]);
export type TriState = z.infer<typeof triState>;

export const programSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    provider: z.string(),
    level: z.enum(PROGRAM_LEVELS),
    geography: geographySchema,
    assistanceType: z.enum(ASSISTANCE_TYPES),
    /** Human-readable benefit (source of truth). */
    amount: z.string(),
    /** Machine-readable best-effort; shape varies by program. */
    amountStructured: z.record(z.unknown()).optional(),
    eligibility: eligibilitySchema,
    requiresHomebuyerEd: triState,
    mustUseApprovedLender: triState.optional(),
    participatingLenders: z.array(z.string()).optional(),
    repayment: z.string().optional(),
    howToApply: z.string(),
    sourceUrl: z.string().url(),
    lastVerified: z.string(),
    notes: z.string().optional(),
    dataSource: z.enum(["curated", "dpr"]).default("curated"),
  })
  .passthrough();
export type Program = z.infer<typeof programSchema>;

/** Accepts the curated file: optional `meta`, plus the programs array. */
export const programsFileSchema = z
  .object({
    meta: z.record(z.unknown()).optional(),
    version: z.string().optional(),
    state: z.string().optional(),
    programs: z.array(programSchema),
  })
  .passthrough();

/** True only when the program definitely requires homebuyer education. */
export function requiresEducation(p: Program): boolean {
  return p.requiresHomebuyerEd === true;
}
