import { z } from "zod";

/**
 * Module 1 — ESOP / Benjamin Rose referral tracker.
 *
 * PRIVACY: This schema intentionally stores ONLY referral-stage information.
 * It has no fields for counseling notes, financial documents, or any other
 * content from a client's Benjamin Rose / ESOP counseling file. Contact
 * details live in a separate optional `contact` object that is gated behind
 * `consentToShare` everywhere it is read (see lib/referrals/redaction.ts).
 */

export const REFERRAL_SOURCES = ["benjamin-rose", "esop"] as const;
export type ReferralSource = (typeof REFERRAL_SOURCES)[number];

export const PROGRAM_TYPES = [
  "homebuyer-ed",
  "pre-purchase",
  "foreclosure",
  "post-purchase",
] as const;
export type ProgramType = (typeof PROGRAM_TYPES)[number];

/** Pipeline stages, in pipeline order. The kanban renders columns in this order. */
export const REFERRAL_STAGES = [
  "referred",
  "contacted",
  "home-search",
  "under-contract",
  "closed",
  "on-hold",
  "declined",
] as const;
export type ReferralStage = (typeof REFERRAL_STAGES)[number];

/** Stages that count as a successful close for the graduate→close rate. */
export const CLOSED_STAGES: ReferralStage[] = ["closed"];

export const OUTCOMES = [
  "in-progress",
  "purchased-home",
  "not-ready",
  "lost-other-agent",
  "withdrew",
] as const;
export type Outcome = (typeof OUTCOMES)[number];

/** Human-readable labels for UI. */
export const SOURCE_LABELS: Record<ReferralSource, string> = {
  "benjamin-rose": "Benjamin Rose",
  esop: "ESOP",
};

export const PROGRAM_TYPE_LABELS: Record<ProgramType, string> = {
  "homebuyer-ed": "Homebuyer Education",
  "pre-purchase": "Pre-Purchase Counseling",
  foreclosure: "Foreclosure Prevention",
  "post-purchase": "Post-Purchase",
};

export const STAGE_LABELS: Record<ReferralStage, string> = {
  referred: "Referred",
  contacted: "Contacted",
  "home-search": "Home Search",
  "under-contract": "Under Contract",
  closed: "Closed",
  "on-hold": "On Hold",
  declined: "Declined",
};

export const OUTCOME_LABELS: Record<Outcome, string> = {
  "in-progress": "In Progress",
  "purchased-home": "Purchased Home",
  "not-ready": "Not Ready",
  "lost-other-agent": "Closed w/ Other Agent",
  withdrew: "Withdrew",
};

/** Contact info — optional, and only ever surfaced when consentToShare is true. */
export const contactSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(7).max(20).optional(),
});
export type ReferralContact = z.infer<typeof contactSchema>;

export const referralSchema = z.object({
  id: z.string().uuid(),

  // Minimal identifying info — first name + last initial only by design.
  firstName: z.string().min(1).max(80),
  lastInitial: z.string().min(1).max(1),

  contact: contactSchema.optional(),

  source: z.enum(REFERRAL_SOURCES),
  programType: z.enum(PROGRAM_TYPES),

  certificateCompleted: z.boolean().default(false),
  certificateDate: z.string().datetime().optional(),

  // Consent gate. Contact info must not be shown or used unless this is true.
  consentToShare: z.boolean().default(false),
  consentDate: z.string().datetime().optional(),

  stage: z.enum(REFERRAL_STAGES).default("referred"),
  assignedAgent: z.string().max(120).optional(),

  dateReferred: z.string().datetime(),
  lastUpdated: z.string().datetime(),

  notes: z.string().max(4000).optional(),
  outcome: z.enum(OUTCOMES).default("in-progress"),
});

export type Referral = z.infer<typeof referralSchema>;

/** Shape accepted when creating a referral (server fills id/timestamps). */
export const createReferralSchema = referralSchema
  .omit({ id: true, lastUpdated: true })
  .partial({ dateReferred: true, stage: true, outcome: true });
export type CreateReferralInput = z.infer<typeof createReferralSchema>;

/** Shape accepted on update — every field optional except none required here. */
export const updateReferralSchema = referralSchema
  .omit({ id: true, lastUpdated: true })
  .partial();
export type UpdateReferralInput = z.infer<typeof updateReferralSchema>;
