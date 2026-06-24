import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for trusted SERVER-ONLY jobs (scheduled cron,
 * public-facing reads of curated reference data) that must bypass row-level
 * security and run without a user session.
 *
 * NEVER import this from client components. Returns null when the service key
 * isn't configured, so callers degrade gracefully to seed data.
 */
let cached: SupabaseClient | null | undefined;

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cached =
    url && serviceKey
      ? createClient(url, serviceKey, { auth: { persistSession: false } })
      : null;
  return cached;
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
