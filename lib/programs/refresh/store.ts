import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { DiffedCandidate } from "./diff";

/**
 * Persistence for scheduled-refresh runs. The weekly cron stores each run's
 * diffed candidates here as a REVIEW QUEUE; staff approve them into the live
 * `programs` table from the dashboard. Nothing auto-publishes.
 *
 * Backed by Supabase when configured; a no-op (returns null/empty) otherwise, so
 * the cron still runs and reports a summary without persistence.
 */

export interface RefreshRunSummary {
  total: number;
  new: number;
  changed: number;
  unchanged: number;
  invalidDropped: number;
}

export interface RefreshRun {
  id: string;
  created_at: string;
  trigger: "cron" | "manual";
  model: string;
  summary: RefreshRunSummary;
  status: "pending_review" | "reviewed";
}

export async function saveRefreshRun(run: {
  trigger: "cron" | "manual";
  model: string;
  summary: RefreshRunSummary;
  diffed: DiffedCandidate[];
}): Promise<string | null> {
  const client = getSupabaseAdminClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from("program_refresh_runs")
      .insert({
        trigger: run.trigger,
        model: run.model,
        summary: run.summary,
        candidates: run.diffed,
        status: "pending_review",
      })
      .select("id")
      .single();
    if (error || !data) return null;
    return data.id as string;
  } catch {
    return null;
  }
}

/** The most recent run still awaiting staff review, if any. */
export async function latestPendingRun(): Promise<RefreshRun | null> {
  const client = getSupabaseAdminClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from("program_refresh_runs")
      .select("id, created_at, trigger, model, summary, status")
      .eq("status", "pending_review")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return data as RefreshRun;
  } catch {
    return null;
  }
}
