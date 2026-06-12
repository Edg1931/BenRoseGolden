import { z } from "zod";
import { CONTENT_FORMATS, LANGUAGES, TRACKS } from "@/lib/participants/curriculum";
import { PARTICIPANT_STAGES } from "@/lib/participants/schema";

/**
 * Module 3 — content library + marketing campaigns.
 *
 * Content items are the multi-format / multi-language learning assets tied to
 * curriculum modules (the BR accessibility goal). Campaigns are newsletters and
 * flyers — drafted with Claude, audience-targeted against the CRM, managed here,
 * and sent via an email provider in a later phase.
 */

export const contentItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  /** Curriculum module this asset teaches, if any. */
  moduleId: z.string().optional(),
  track: z.enum(TRACKS).optional(),
  format: z.enum(CONTENT_FORMATS),
  language: z.enum(LANGUAGES),
  summary: z.string(),
  url: z.string().url().optional(),
  durationMin: z.number().optional(),
  tags: z.array(z.string()).default([]),
  lastUpdated: z.string(),
});
export type ContentItem = z.infer<typeof contentItemSchema>;

export const CAMPAIGN_TYPES = ["newsletter", "flyer"] as const;
export type CampaignType = (typeof CAMPAIGN_TYPES)[number];

export const CAMPAIGN_STATUSES = ["draft", "ready", "sent"] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const audienceSchema = z.object({
  stages: z.array(z.enum(PARTICIPANT_STAGES)).optional(),
  tracks: z.array(z.enum(TRACKS)).optional(),
  language: z.enum(LANGUAGES).optional(),
});
export type Audience = z.infer<typeof audienceSchema>;

export const campaignSchema = z.object({
  id: z.string(),
  type: z.enum(CAMPAIGN_TYPES),
  title: z.string(),
  subject: z.string().optional(),
  audience: audienceSchema.default({}),
  language: z.enum(LANGUAGES).default("en"),
  bodyMarkdown: z.string().default(""),
  status: z.enum(CAMPAIGN_STATUSES).default("draft"),
  /** Provenance: which model drafted it, if AI-assisted. */
  draftedBy: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Campaign = z.infer<typeof campaignSchema>;

export const createCampaignSchema = campaignSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial({ status: true, audience: true, language: true, bodyMarkdown: true });
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
