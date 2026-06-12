import { z } from "zod";
import { CONTENT_FORMATS, LANGUAGES, TRACKS } from "./curriculum";

/**
 * Module 1 (expanded) — Benjamin Rose Participants CRM.
 *
 * Benjamin Rose is the data controller for participants in its housing programs.
 * This record holds the full client profile its staff need. The `consentToShare`
 * flag still governs what crosses to The Golden Group via the referral pipeline
 * (lib/referrals) — sharing is gated, but BR's own use of its data is not.
 */

export const PARTICIPANT_STAGES = [
  "lead",
  "enrolled",
  "in-progress",
  "graduated",
  "referred",
  "inactive",
] as const;
export type ParticipantStage = (typeof PARTICIPANT_STAGES)[number];

export const STAGE_LABELS: Record<ParticipantStage, string> = {
  lead: "Lead",
  enrolled: "Enrolled",
  "in-progress": "In Progress",
  graduated: "Graduated",
  referred: "Referred to Agent",
  inactive: "Inactive",
};

export const CREDIT_BANDS = ["unknown", "below-580", "580-639", "640-699", "700-749", "750-plus"] as const;
export type CreditBand = (typeof CREDIT_BANDS)[number];

export const CREDIT_BAND_LABELS: Record<CreditBand, string> = {
  unknown: "Unknown",
  "below-580": "Below 580",
  "580-639": "580–639",
  "640-699": "640–699",
  "700-749": "700–749",
  "750-plus": "750+",
};

export const MODULE_STATUS = ["not-started", "in-progress", "completed"] as const;
export type ModuleStatus = (typeof MODULE_STATUS)[number];

export const moduleProgressSchema = z.object({
  moduleId: z.string(),
  status: z.enum(MODULE_STATUS).default("not-started"),
  completedDate: z.string().optional(),
  /** Score 0–100 when a test was taken (test engine is a later phase). */
  score: z.number().min(0).max(100).optional(),
  /** Format the participant consumed it in (for distribution insight). */
  format: z.enum(CONTENT_FORMATS).optional(),
});
export type ModuleProgress = z.infer<typeof moduleProgressSchema>;

export const certificateSchema = z.object({
  name: z.string(),
  issuedDate: z.string(),
  url: z.string().url().optional(),
  /** Phase/track this certificate is for (e.g. "pre-purchase"). */
  phase: z.string().optional(),
});
export type Certificate = z.infer<typeof certificateSchema>;

export const communicationSchema = z.object({
  id: z.string(),
  date: z.string(),
  channel: z.enum(["email", "sms", "phone", "in-person", "mail", "note"]),
  direction: z.enum(["inbound", "outbound", "internal"]).default("outbound"),
  subject: z.string().optional(),
  body: z.string().max(4000).optional(),
  byUser: z.string().optional(),
});
export type Communication = z.infer<typeof communicationSchema>;

export const addressSchema = z.object({
  line1: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  state: z.string().default("OH").optional(),
  zip: z.string().optional(),
});

export const householdSchema = z.object({
  size: z.number().int().min(1).max(20).optional(),
  annualIncome: z.number().nonnegative().optional(),
  amiPercent: z.number().min(0).max(300).optional(),
  creditBand: z.enum(CREDIT_BANDS).default("unknown"),
  firstTimeBuyer: z.boolean().optional(),
  targetPurchasePrice: z.number().nonnegative().optional(),
});
export type Household = z.infer<typeof householdSchema>;

export const participantSchema = z.object({
  id: z.string().uuid(),
  org: z.enum(["benjamin-rose", "esop"]).default("benjamin-rose"),

  firstName: z.string().min(1).max(80),
  lastName: z.string().max(80).optional(),
  preferredName: z.string().max(80).optional(),

  email: z.string().email().optional(),
  phone: z.string().min(7).max(20).optional(),
  address: addressSchema.optional(),

  preferredLanguage: z.enum(LANGUAGES).default("en"),
  /** How this person wants to RECEIVE content — the core BR accessibility goal. */
  preferredFormats: z.array(z.enum(CONTENT_FORMATS)).default([]),
  /** Preferred contact channels. */
  contactChannels: z.array(z.enum(["email", "sms", "phone", "mail"])).default([]),
  doNotContact: z.boolean().default(false),

  household: householdSchema.default({ creditBand: "unknown" }),
  /** Needs/situations driving recommendations (FTHB vs foreclosure vs credit). */
  tracks: z.array(z.enum(TRACKS)).default([]),

  stage: z.enum(PARTICIPANT_STAGES).default("lead"),
  assignedCounselor: z.string().optional(),

  moduleProgress: z.array(moduleProgressSchema).default([]),
  certificates: z.array(certificateSchema).default([]),
  communications: z.array(communicationSchema).default([]),

  tags: z.array(z.string()).default([]),
  source: z.enum(["class", "web", "referral", "import", "event", "partner"]).default("class"),

  /** Gate for crossing into The Golden Group referral pipeline. */
  consentToShare: z.boolean().default(false),
  consentDate: z.string().optional(),
  referralId: z.string().uuid().optional(),

  notes: z.string().max(8000).optional(),
  dateAdded: z.string(),
  lastUpdated: z.string(),
});

export type Participant = z.infer<typeof participantSchema>;

export const createParticipantSchema = participantSchema
  .omit({ id: true, lastUpdated: true })
  .partial({ dateAdded: true, stage: true });
export type CreateParticipantInput = z.infer<typeof createParticipantSchema>;

export const updateParticipantSchema = participantSchema
  .omit({ id: true, lastUpdated: true, dateAdded: true })
  .partial();
export type UpdateParticipantInput = z.infer<typeof updateParticipantSchema>;
