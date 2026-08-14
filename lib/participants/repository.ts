import { randomUUID } from "crypto";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isGoldenSide, type AuthUser } from "@/lib/auth/roles";
import {
  createParticipantSchema,
  participantSchema,
  updateParticipantSchema,
  type CreateParticipantInput,
  type Participant,
  type UpdateParticipantInput,
} from "./schema";
import { seedParticipants } from "./seed";
import { refreshDerivedFields, withDerivedFields } from "./derive";
import { autoCreateReferral } from "@/lib/referrals/from-participant";

/**
 * When a participant reaches "graduated" with consent, hand them off: create the
 * linked Golden Group referral and reflect the hand-off on the record. Best-effort
 * and idempotent (only fires when there's no referralId yet). Returns the record
 * to persist (possibly with referralId + stage advanced to "referred").
 */
async function withAutoReferral(next: Participant, now: string): Promise<Participant> {
  const refId = await autoCreateReferral(next);
  if (!refId) return next;
  return participantSchema.parse({
    ...next,
    referralId: refId,
    stage: next.stage === "graduated" ? "referred" : next.stage,
    stageSince: next.stage === "graduated" ? now : next.stageSince ?? next.dateAdded,
    lastUpdated: now,
  });
}

/**
 * Data access for Benjamin Rose participants. Supabase-backed when configured
 * (RLS scopes rows), else in-memory seed for local dev. Benjamin Rose staff see
 * only their own org's participants; Golden Group / admin see all.
 */

const memory: Participant[] = seedParticipants.map((p) => ({ ...p }));

function scopeForUser(user: AuthUser, rows: Participant[]): Participant[] {
  if (isGoldenSide(user)) return rows;
  return rows.filter((p) => p.org === user.org);
}

export async function listParticipants(user: AuthUser): Promise<Participant[]> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .order("lastUpdated", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => participantSchema.parse(row));
  }
  return scopeForUser(user, memory).sort((a, b) =>
    b.lastUpdated.localeCompare(a.lastUpdated),
  );
}

export async function getParticipant(
  user: AuthUser,
  id: string,
): Promise<Participant | null> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const p = participantSchema.parse(data);
    return isGoldenSide(user) || p.org === user.org ? p : null;
  }
  const found = memory.find((p) => p.id === id) ?? null;
  if (!found) return null;
  return isGoldenSide(user) || found.org === user.org ? found : null;
}

function buildParticipant(input: CreateParticipantInput): Participant {
  const parsed = createParticipantSchema.parse(input);
  const now = new Date().toISOString();
  return withDerivedFields(
    participantSchema.parse({
      ...parsed,
      id: randomUUID(),
      dateAdded: parsed.dateAdded ?? now,
      stageSince: parsed.stageSince ?? parsed.dateAdded ?? now,
      lastUpdated: now,
    }),
  );
}

export async function createParticipant(
  user: AuthUser,
  input: CreateParticipantInput,
): Promise<Participant> {
  let participant = buildParticipant(input);
  if (!isGoldenSide(user) && user.org) participant.org = user.org;
  participant = await withAutoReferral(participant, participant.lastUpdated);

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("participants")
      .insert(participant)
      .select("*")
      .single();
    if (error) throw error;
    return participantSchema.parse(data);
  }
  memory.unshift(participant);
  return participant;
}

export async function updateParticipant(
  user: AuthUser,
  id: string,
  input: UpdateParticipantInput,
): Promise<Participant> {
  const existing = await getParticipant(user, id);
  if (!existing) throw new Error("Participant not found");

  const patch = updateParticipantSchema.parse(input);
  const now = new Date().toISOString();
  const stageChanged = patch.stage != null && patch.stage !== existing.stage;
  let next = participantSchema.parse({
    ...existing,
    ...patch,
    id: existing.id,
    dateAdded: existing.dateAdded,
    // Reset the time-in-phase clock only when the stage actually changes.
    stageSince: stageChanged ? now : existing.stageSince ?? existing.dateAdded,
    lastUpdated: now,
  });
  next = refreshDerivedFields(next, patch.household != null && patch.household.amiPercent == null);
  next = await withAutoReferral(next, now);

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("participants")
      .update(next)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return participantSchema.parse(data);
  }
  const idx = memory.findIndex((p) => p.id === id);
  memory[idx] = next;
  return next;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Learner self-service (no staff AuthUser). A learner who creates their own
 * profile via the public classes becomes a Benjamin Rose "lead". These helpers
 * are unscoped by design — callers MUST first verify the learner session owns
 * the record (see lib/learn/accounts.ts).
 * ──────────────────────────────────────────────────────────────────────── */

/** Create a self-enrolled learner as a Benjamin Rose lead from the web. */
export async function enrollLearner(input: CreateParticipantInput): Promise<Participant> {
  const participant = buildParticipant({
    ...input,
    org: "benjamin-rose",
    source: "web",
    stage: input.stage ?? "lead",
  });
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("participants")
      .insert(participant)
      .select("*")
      .single();
    if (error) throw error;
    return participantSchema.parse(data);
  }
  memory.unshift(participant);
  return participant;
}

async function findLearnerBy(field: "id" | "email" | "authUserId", value: string) {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq(field, value)
      .maybeSingle();
    if (error) throw error;
    return data ? participantSchema.parse(data) : null;
  }
  const found = memory.find((p) => p[field] === value) ?? null;
  return found;
}

export const findLearnerById = (id: string) => findLearnerBy("id", id);
export const findLearnerByEmail = (email: string) =>
  findLearnerBy("email", email.trim().toLowerCase());
export const findLearnerByAuthId = (authUserId: string) =>
  findLearnerBy("authUserId", authUserId);

/** Update a learner's own record (financial snapshot, progress, certificates). */
export async function patchLearner(
  id: string,
  input: UpdateParticipantInput,
): Promise<Participant> {
  const existing = await findLearnerById(id);
  if (!existing) throw new Error("Participant not found");
  const patch = updateParticipantSchema.parse(input);
  const now = new Date().toISOString();
  let next = participantSchema.parse({
    ...existing,
    ...patch,
    id: existing.id,
    dateAdded: existing.dateAdded,
    stageSince: existing.stageSince ?? existing.dateAdded,
    lastUpdated: now,
  });
  next = refreshDerivedFields(next, patch.household != null && patch.household.amiPercent == null);
  next = await withAutoReferral(next, now);
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("participants")
      .update(next)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return participantSchema.parse(data);
  }
  const idx = memory.findIndex((p) => p.id === id);
  if (idx >= 0) memory[idx] = next;
  return next;
}

export interface BulkImportResult {
  inserted: number;
  failed: number;
  errors: { row: number; message: string }[];
}

/** Mass-import participants (the thousands of existing graduates). */
export async function bulkImportParticipants(
  user: AuthUser,
  inputs: CreateParticipantInput[],
): Promise<BulkImportResult> {
  const built: Participant[] = [];
  const errors: { row: number; message: string }[] = [];

  inputs.forEach((input, i) => {
    try {
      const p = buildParticipant(input);
      if (!isGoldenSide(user) && user.org) p.org = user.org;
      built.push(p);
    } catch (e) {
      errors.push({ row: i + 1, message: e instanceof Error ? e.message : "Invalid row" });
    }
  });

  const supabase = await getSupabaseServerClient();
  if (supabase && built.length > 0) {
    // Chunk inserts to stay within payload limits on large imports.
    for (let i = 0; i < built.length; i += 500) {
      const chunk = built.slice(i, i + 500);
      const { error } = await supabase.from("participants").insert(chunk);
      if (error) {
        errors.push({ row: i + 1, message: error.message });
      }
    }
  } else {
    memory.unshift(...built);
  }

  return { inserted: built.length, failed: errors.length, errors };
}
