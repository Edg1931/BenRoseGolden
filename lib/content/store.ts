import { randomUUID } from "crypto";
import {
  campaignSchema,
  createCampaignSchema,
  type Campaign,
  type ContentItem,
  type CreateCampaignInput,
} from "./schema";
import { seedCampaigns, seedContent } from "./seed";
import type { Participant } from "@/lib/participants/schema";
import type { Audience } from "./schema";

/**
 * In-memory store for content + campaigns (seed-backed; swap to Supabase later).
 * Content items are static reference assets; campaigns are mutable.
 */

const campaigns: Campaign[] = seedCampaigns.map((c) => ({ ...c }));

export function listContent(): ContentItem[] {
  return seedContent;
}

export function listCampaigns(): Campaign[] {
  return [...campaigns].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getCampaign(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id);
}

export function createCampaign(input: CreateCampaignInput): Campaign {
  const parsed = createCampaignSchema.parse(input);
  const now = new Date().toISOString();
  const campaign = campaignSchema.parse({
    ...parsed,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  });
  campaigns.unshift(campaign);
  return campaign;
}

export function updateCampaign(id: string, patch: Partial<Campaign>): Campaign {
  const idx = campaigns.findIndex((c) => c.id === id);
  if (idx < 0) throw new Error("Campaign not found");
  const next = campaignSchema.parse({
    ...campaigns[idx],
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  });
  campaigns[idx] = next;
  return next;
}

/** How many CRM participants an audience filter reaches (and how to contact). */
export function resolveAudience(
  audience: Audience,
  participants: Participant[],
): { total: number; emailable: number; reachable: Participant[] } {
  const reachable = participants.filter((p) => {
    if (p.doNotContact) return false;
    if (audience.stages?.length && !audience.stages.includes(p.stage)) return false;
    if (audience.tracks?.length && !audience.tracks.some((t) => p.tracks.includes(t))) return false;
    if (audience.language && p.preferredLanguage !== audience.language) return false;
    return true;
  });
  return {
    total: reachable.length,
    emailable: reachable.filter((p) => !!p.email).length,
    reachable,
  };
}
