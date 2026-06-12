import { z } from "zod";

/**
 * Module 2 — Ohio down-payment-assistance & grant finder.
 *
 * Programs are read from a curated database (data/programs.seed.json), shaped to
 * accept the full statewide Ohio dataset later. A second data source (the Down
 * Payment Resource API) can be swapped in behind the source adapter interface
 * (lib/programs/sources) without changing this schema or the matching engine.
 */

export const PROGRAM_LEVELS = ["state", "county", "city", "nonprofit"] as const;
export type ProgramLevel = (typeof PROGRAM_LEVELS)[number];

export const ASSISTANCE_TYPES = [
  "grant",
  "forgivable-loan",
  "deferred-second",
  "mcc-tax-credit",
] as const;
export type AssistanceType = (typeof ASSISTANCE_TYPES)[number];

export const ASSISTANCE_TYPE_LABELS: Record<AssistanceType, string> = {
  grant: "Grant",
  "forgivable-loan": "Forgivable Loan",
  "deferred-second": "Deferred Second Mortgage",
  "mcc-tax-credit": "Mortgage Credit Certificate (Tax Credit)",
};

export const PROPERTY_TYPES = [
  "single-family",
  "condo",
  "townhome",
  "2-4-unit",
  "manufactured",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

/** Geography: statewide, or scoped to specific counties/cities. */
export const geographySchema = z.object({
  statewide: z.boolean().default(false),
  counties: z.array(z.string()).optional(),
  cities: z.array(z.string()).optional(),
});
export type Geography = z.infer<typeof geographySchema>;

/** The benefit amount — a flat dollar amount, a percent of price, or a range. */
export const benefitSchema = z.object({
  /** Flat max dollar amount, when applicable. */
  amount: z.number().nonnegative().optional(),
  /** Percent of purchase price (0–100), when applicable. */
  percent: z.number().min(0).max(100).optional(),
  /** Free-text fallback for complex structures (e.g. "up to 5%, max $10k"). */
  description: z.string().optional(),
});
export type Benefit = z.infer<typeof benefitSchema>;

export const eligibilitySchema = z.object({
  firstTimeBuyer: z.boolean().optional(), // true = must be first-time buyer
  /** Income limit as a flat dollar cap; household-size table can be added later. */
  incomeLimit: z.number().nonnegative().optional(),
  /** Occupation restriction, e.g. "teacher", "first-responder", or undefined. */
  occupation: z.array(z.string()).optional(),
  creditMin: z.number().min(300).max(850).optional(),
  propertyType: z.array(z.enum(PROPERTY_TYPES)).optional(),
  purchasePriceLimit: z.number().nonnegative().optional(),
});
export type Eligibility = z.infer<typeof eligibilitySchema>;

export const programSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.string(),
  level: z.enum(PROGRAM_LEVELS),
  geography: geographySchema,
  assistanceType: z.enum(ASSISTANCE_TYPES),
  benefit: benefitSchema,
  eligibility: eligibilitySchema,
  requiresHomebuyerEd: z.boolean().default(false),
  mustUseApprovedLender: z.boolean().default(false),
  participatingLenders: z.array(z.string()).optional(),
  howToApply: z.string(),
  sourceUrl: z.string().url(),
  lastVerified: z.string(), // ISO date
  /** Provenance, so curated + API-sourced records can coexist. */
  dataSource: z.enum(["curated", "dpr"]).default("curated"),
});
export type Program = z.infer<typeof programSchema>;

export const programsFileSchema = z.object({
  version: z.string(),
  state: z.literal("OH"),
  programs: z.array(programSchema),
});
