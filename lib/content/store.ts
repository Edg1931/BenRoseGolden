import { randomUUID } from "crypto";
import { getSupabaseServerClient } from "@/lib/supabase/server";
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
 * Content + campaigns store. Supabase-backed when configured (the `campaigns`
 * table); in-memory seed otherwise so the marketing views work in dev. Content
 * items are static reference assets shipped with the app.
 */

const memory: Campaign[] = seedCampaigns.map((c) => ({ ...c }));

export function listContent(): ContentItem[] {
  return seedContent;
}

export async function listCampaigns(): Promise<Campaign[]> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("updatedAt", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => campaignSchema.parse(row));
  }
  return [...memory].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getCampaign(id: string): Promise<Campaign | undefined> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.from("campaigns").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? campaignSchema.parse(data) : undefined;
  }
  return memory.find((c) => c.id === id);
}

export async function createCampaign(input: CreateCampaignInput): Promise<Campaign> {
  const parsed = createCampaignSchema.parse(input);
  const now = new Date().toISOString();
  const campaign = campaignSchema.parse({
    ...parsed,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  });

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.from("campaigns").insert(campaign).select("*").single();
    if (error) throw error;
    return campaignSchema.parse(data);
  }
  memory.unshift(campaign);
  return campaign;
}

export async function updateCampaign(id: string, patch: Partial<Campaign>): Promise<Campaign> {
  const existing = await getCampaign(id);
  if (!existing) throw new Error("Campaign not found");
  const next = campaignSchema.parse({
    ...existing,
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  });

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.from("campaigns").update(next).eq("id", id).select("*").single();
    if (error) throw error;
    return campaignSchema.parse(data);
  }
  const idx = memory.findIndex((c) => c.id === id);
  memory[idx] = next;
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
