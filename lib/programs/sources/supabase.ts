import type { ProgramSource } from "./index";
import { programSchema, type Program } from "../schema";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Supabase-backed curated programs — the live, staff-curated layer that keeps
 * the finder current. Staff approve AI-refreshed candidates into the `programs`
 * table (via /api/programs/apply); this source reads them back so they reach the
 * public finder and OVERRIDE the static seed for matching ids.
 *
 * Uses the service-role client so the public (unauthenticated) finder can read
 * this reference data. Any error degrades to seed-only — the finder never breaks
 * because the database is unavailable.
 */
export const supabaseSource: ProgramSource = {
  id: "supabase",
  get enabled() {
    return getSupabaseAdminClient() !== null;
  },
  async load(): Promise<Program[]> {
    const client = getSupabaseAdminClient();
    if (!client) return [];
    try {
      const { data, error } = await client.from("programs").select("*");
      if (error || !data) return [];
      const programs: Program[] = [];
      for (const row of data) {
        // Tri-state fields are stored as text ('true' | 'false' | 'verify').
        const normalized = {
          ...row,
          requiresHomebuyerEd: parseTriState(row.requiresHomebuyerEd),
          mustUseApprovedLender:
            row.mustUseApprovedLender == null
              ? undefined
              : parseTriState(row.mustUseApprovedLender),
          dataSource: "curated" as const,
        };
        const parsed = programSchema.safeParse(normalized);
        if (parsed.success) programs.push(parsed.data);
      }
      return programs;
    } catch {
      return [];
    }
  },
};

function parseTriState(value: unknown): boolean | "verify" {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return "verify";
}
