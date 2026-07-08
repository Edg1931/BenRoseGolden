import { z } from "zod";
import { LANGUAGES } from "@/lib/participants/curriculum";

/**
 * Preferred-lender directory. Each lender is a robust partner profile: the loan
 * officer + institution, the languages they serve (so we can match clients who
 * speak other languages), the loan and down-payment-assistance programs they
 * offer (which surface in the assistance area), plus a partnership tier that
 * models a light advertising/sponsorship and referral relationship.
 */

export const LOAN_TYPES = ["conventional", "fha", "va", "usda", "ohfa", "jumbo", "renovation"] as const;
export type LoanType = (typeof LOAN_TYPES)[number];
export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  conventional: "Conventional",
  fha: "FHA",
  va: "VA",
  usda: "USDA",
  ohfa: "OHFA",
  jumbo: "Jumbo",
  renovation: "Renovation (203k)",
};

/** Partnership tiers — the light "pay to advertise / preferred" model. */
export const LENDER_TIERS = ["featured", "preferred", "standard"] as const;
export type LenderTier = (typeof LENDER_TIERS)[number];
export const LENDER_TIER_LABELS: Record<LenderTier, string> = {
  featured: "Featured partner",
  preferred: "Preferred",
  standard: "Standard",
};

export const ASSISTANCE_KINDS = ["grant", "forgivable-loan", "dpa", "special-rate", "closing-cost", "other"] as const;
export type AssistanceKind = (typeof ASSISTANCE_KINDS)[number];
export const ASSISTANCE_KIND_LABELS: Record<AssistanceKind, string> = {
  grant: "Grant",
  "forgivable-loan": "Forgivable loan",
  dpa: "Down-payment assistance",
  "special-rate": "Special rate / discount",
  "closing-cost": "Closing-cost help",
  other: "Other",
};

/** A financial-assistance / loan program a lender offers. Feeds the assistance area. */
export const lenderProgramSchema = z.object({
  name: z.string().min(1).max(160),
  kind: z.enum(ASSISTANCE_KINDS).default("dpa"),
  amount: z.string().max(160).optional(),
  description: z.string().max(1000).optional(),
  link: z.string().url().optional(),
});
export type LenderProgram = z.infer<typeof lenderProgramSchema>;

export const lenderSchema = z.object({
  id: z.string().uuid(),

  // Institution + loan officer
  institutionName: z.string().min(1).max(160),
  contactName: z.string().max(120).optional(),
  title: z.string().max(120).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(20).optional(),
  website: z.string().url().optional(),
  nmls: z.string().max(20).optional(),
  logoUrl: z.string().url().optional(),

  address: z
    .object({ city: z.string().optional(), county: z.string().optional(), state: z.string().default("OH").optional() })
    .optional(),
  /** Ohio counties served (Benjamin Rose serves Northeast Ohio). */
  serviceCounties: z.array(z.string()).default([]),

  /** Languages this lender/team can serve — the marker to match non-English clients. */
  languages: z.array(z.enum(LANGUAGES)).default(["en"]),

  loanTypes: z.array(z.enum(LOAN_TYPES)).default([]),
  /** Assistance / loan programs the lender offers (populate the assistance area). */
  programs: z.array(lenderProgramSchema).default([]),

  /** Short marketing description for newsletters & flyers. */
  marketingBlurb: z.string().max(600).optional(),

  // Partnership / advertising
  tier: z.enum(LENDER_TIERS).default("standard"),
  /** True when the lender sponsors/advertises with us. */
  advertising: z.boolean().default(false),
  /** Optional monthly sponsorship amount (USD). */
  monthlyRate: z.number().nonnegative().optional(),
  partnerSince: z.string().optional(),
  /** True when this lender receives client referrals from us. */
  receivesReferrals: z.boolean().default(true),

  active: z.boolean().default(true),
  notes: z.string().max(4000).optional(),

  dateAdded: z.string(),
  lastUpdated: z.string(),
});
export type Lender = z.infer<typeof lenderSchema>;

export const createLenderSchema = lenderSchema.omit({ id: true, lastUpdated: true }).partial({ dateAdded: true });
export type CreateLenderInput = z.input<typeof createLenderSchema>;

export const updateLenderSchema = lenderSchema.omit({ id: true, lastUpdated: true, dateAdded: true }).partial();
export type UpdateLenderInput = z.infer<typeof updateLenderSchema>;
