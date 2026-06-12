import { randomUUID } from "crypto";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Per-recipient sent-log for campaigns. Supabase-backed (the `campaign_sends`
 * table) when configured, in-memory otherwise. Gives staff an auditable record
 * of who a newsletter reached and whether delivery succeeded.
 */

export interface SentLogEntry {
  id: string;
  campaignId: string;
  participantId: string;
  email: string;
  status: "sent" | "failed";
  error?: string;
  sentAt: string;
}

const memory: SentLogEntry[] = [];

export async function recordSends(
  entries: Omit<SentLogEntry, "id" | "sentAt">[],
): Promise<SentLogEntry[]> {
  const now = new Date().toISOString();
  const rows: SentLogEntry[] = entries.map((e) => ({ ...e, id: randomUUID(), sentAt: now }));
  if (rows.length === 0) return rows;

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.from("campaign_sends").insert(rows);
    if (error) throw error;
  } else {
    memory.push(...rows);
  }
  return rows;
}

export async function listSends(campaignId: string): Promise<SentLogEntry[]> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("campaign_sends")
      .select("*")
      .eq("campaignId", campaignId)
      .order("sentAt", { ascending: false });
    if (error) throw error;
    return (data ?? []) as SentLogEntry[];
  }
  return memory.filter((e) => e.campaignId === campaignId);
}
