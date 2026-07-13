import { randomUUID } from "crypto";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  canEditReferral,
  canViewReferral,
  isGoldenSide,
  type AuthUser,
} from "@/lib/auth/roles";
import {
  createReferralSchema,
  referralSchema,
  updateReferralSchema,
  type CreateReferralInput,
  type Referral,
  type UpdateReferralInput,
} from "./schema";
import { seedReferrals } from "./seed";

/**
 * Data access for referrals. RBAC is applied here (and mirrored in Supabase RLS)
 * so visibility/edit rules hold regardless of which caller hits the data.
 *
 * Two backends:
 *  - Supabase, when configured (RLS enforces row scoping in Postgres).
 *  - In-memory seed, for local dev (scoping applied in code below).
 */

// Module-scoped mutable copy for the in-memory backend (dev only).
const memory: Referral[] = seedReferrals.map((r) => ({ ...r }));

function scopeForUser(user: AuthUser, rows: Referral[]): Referral[] {
  if (isGoldenSide(user)) return rows;
  return rows.filter((r) => r.source === user.org);
}

export async function listReferrals(user: AuthUser): Promise<Referral[]> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    // RLS already scopes rows to what this user may see.
    const { data, error } = await supabase
      .from("referrals")
      .select("*")
      .order("dateReferred", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => referralSchema.parse(row));
  }
  return scopeForUser(user, memory).sort((a, b) =>
    b.dateReferred.localeCompare(a.dateReferred),
  );
}

export async function getReferral(
  user: AuthUser,
  id: string,
): Promise<Referral | null> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("referrals")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const referral = referralSchema.parse(data);
    return canViewReferral(user, referral) ? referral : null;
  }
  const found = memory.find((r) => r.id === id) ?? null;
  if (!found) return null;
  return canViewReferral(user, found) ? found : null;
}

export async function createReferral(
  user: AuthUser,
  input: CreateReferralInput,
): Promise<Referral> {
  const parsed = createReferralSchema.parse(input);
  const now = new Date().toISOString();
  // Zod fills stage/outcome/certificateCompleted/consentToShare via defaults;
  // only id, timestamps, and a dateReferred fallback need supplying here.
  const referral: Referral = referralSchema.parse({
    ...parsed,
    id: randomUUID(),
    dateReferred: parsed.dateReferred ?? now,
    lastUpdated: now,
  });

  // Benjamin Rose staff may only create referrals for their own org.
  if (!isGoldenSide(user) && referral.source !== user.org) {
    throw new ForbiddenError("Cannot create a referral for another organization.");
  }

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("referrals")
      .insert(referral)
      .select("*")
      .single();
    if (error) throw error;
    return referralSchema.parse(data);
  }
  memory.unshift(referral);
  return referral;
}

/**
 * System-level referral insert with NO user gate — used only by the
 * participant→referral auto-link (lib/referrals/from-participant), which runs
 * server-side when a client graduates and has consented. Do not expose to an
 * HTTP handler without an auth check.
 */
export async function insertReferralSystem(input: CreateReferralInput): Promise<Referral> {
  const parsed = createReferralSchema.parse(input);
  const now = new Date().toISOString();
  const referral: Referral = referralSchema.parse({
    ...parsed,
    id: randomUUID(),
    dateReferred: parsed.dateReferred ?? now,
    lastUpdated: now,
  });
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.from("referrals").insert(referral).select("*").single();
    if (error) throw error;
    return referralSchema.parse(data);
  }
  memory.unshift(referral);
  return referral;
}

export async function updateReferral(
  user: AuthUser,
  id: string,
  input: UpdateReferralInput,
): Promise<Referral> {
  const existing = await getReferral(user, id);
  if (!existing) throw new NotFoundError("Referral not found.");

  const patch = sanitizePatchForUser(user, existing, updateReferralSchema.parse(input));
  const next: Referral = referralSchema.parse({
    ...existing,
    ...patch,
    id: existing.id,
    lastUpdated: new Date().toISOString(),
  });

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("referrals")
      .update(next)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return referralSchema.parse(data);
  }
  const idx = memory.findIndex((r) => r.id === id);
  memory[idx] = next;
  return next;
}

/**
 * Enforce limited-edit: Golden Group edits everything; Benjamin Rose staff may
 * only change intake/consent fields on their own referrals, never pipeline
 * state (stage / assignedAgent / outcome / source).
 */
function sanitizePatchForUser(
  user: AuthUser,
  existing: Referral,
  patch: UpdateReferralInput,
): UpdateReferralInput {
  if (canEditReferral(user, existing)) return patch;

  const goldenOwnedFields: (keyof UpdateReferralInput)[] = [
    "stage",
    "assignedAgent",
    "outcome",
    "source",
    "deal",
    "blockerReason",
  ];
  const cleaned: UpdateReferralInput = { ...patch };
  for (const field of goldenOwnedFields) delete cleaned[field];
  return cleaned;
}

export class ForbiddenError extends Error {}
export class NotFoundError extends Error {}
