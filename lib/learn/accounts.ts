import "server-only";
import { cookies } from "next/headers";
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  enrollLearner,
  findLearnerByAuthId,
  findLearnerByEmail,
  findLearnerById,
  patchLearner,
} from "@/lib/participants/repository";
import { participantSchema, type Participant } from "@/lib/participants/schema";
import { DAY_MODULE_IDS } from "./course";
import { DEMO_LEARNER_IDS, isDemoLearnerId, type DemoPersona } from "./demo";

/**
 * Learner accounts: the public homebuyer classes are gated behind a profile, so
 * everyone who starts becomes a Benjamin Rose lead in the CRM with their progress
 * and financial snapshot tracked. Email + password.
 *
 * When Supabase is configured, accounts are real Supabase Auth users (linked to
 * the CRM record by authUserId). Without Supabase (local/demo), credentials are
 * kept in memory (scrypt-hashed) so the full flow still works. Either way the
 * session is a signed, httpOnly cookie pointing at the learner's CRM record.
 */

const COOKIE = "br_learner";
const SECRET = process.env.LEARNER_SESSION_SECRET || "dev-insecure-learner-secret-change-me";

// ── In-memory credential store (only used when Supabase isn't configured) ──
const credentials = new Map<string, { participantId: string; hash: string }>();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

// ── Signed session cookie ──
function sign(value: string): string {
  const mac = createHmac("sha256", SECRET).update(value).digest("hex").slice(0, 32);
  return `${value}.${mac}`;
}

function unsign(signed: string): string | null {
  const i = signed.lastIndexOf(".");
  if (i < 0) return null;
  const value = signed.slice(0, i);
  const mac = signed.slice(i + 1);
  const expected = createHmac("sha256", SECRET).update(value).digest("hex").slice(0, 32);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b) ? value : null;
}

/**
 * The session cookie carries a SIGNED, trimmed snapshot of the learner's record
 * — not just an id — so their hub and progress survive even when there's no
 * shared database (e.g. Vercel serverless without Supabase, where each request
 * may hit a fresh instance with empty memory). Heavy fields are dropped to keep
 * the cookie small.
 */
function serializeLearner(p: Participant): string {
  const trimmed = { ...p, communications: [], notes: undefined };
  return Buffer.from(JSON.stringify(trimmed)).toString("base64url");
}

function deserializeLearner(b64: string): Participant | null {
  try {
    return participantSchema.parse(JSON.parse(Buffer.from(b64, "base64url").toString("utf8")));
  } catch {
    return null;
  }
}

async function setSession(p: Participant) {
  const store = await cookies();
  store.set(COOKIE, sign(serializeLearner(p)), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180, // 180 days
  });
}

/** The learner snapshot stored in the (signed) session cookie, or null. */
async function readSessionLearner(): Promise<Participant | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  const value = unsign(raw);
  return value ? deserializeLearner(value) : null;
}

async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export interface LearnerSignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  preferredLanguage?: Participant["preferredLanguage"];
  address?: Participant["address"];
  household?: Participant["household"];
  tracks?: Participant["tracks"];
}

export class LearnerAuthError extends Error {}

/** Create a learner account + linked CRM lead, and start their session. */
export async function signUpLearner(input: LearnerSignupInput): Promise<Participant> {
  const email = input.email.trim().toLowerCase();
  if (!email || !input.password) throw new LearnerAuthError("Email and password are required.");
  if (input.password.length < 8)
    throw new LearnerAuthError("Password must be at least 8 characters.");
  if (!input.firstName?.trim()) throw new LearnerAuthError("Please enter your name.");

  const profile = {
    firstName: input.firstName.trim(),
    lastName: input.lastName?.trim() || undefined,
    email,
    phone: input.phone?.trim() || undefined,
    preferredLanguage: input.preferredLanguage,
    address: input.address,
    household: input.household,
    tracks: input.tracks ?? [],
  };

  // The welcome-page "Sign me up" box captures a CRM lead with this email
  // BEFORE the person reaches account creation. A lead with no credentials is
  // not an account — adopt it (attach the login, enrich the profile) rather
  // than telling the person who just signed up that they already exist.
  if (isSupabaseConfigured()) {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase!.auth.signUp({
      email,
      password: input.password,
    });
    if (error) throw new LearnerAuthError(error.message);
    const lead = await findLearnerByEmail(email);
    const learner =
      lead && !lead.authUserId
        ? await patchLearner(lead.id, { ...profile, authUserId: data.user?.id })
        : await enrollLearner({ ...profile, authUserId: data.user?.id });
    await setSession(learner);
    return learner;
  }

  // Dev / in-memory
  if (credentials.has(email)) {
    throw new LearnerAuthError("An account with this email already exists. Try signing in.");
  }
  const lead = await findLearnerByEmail(email);
  const learner = lead ? await patchLearner(lead.id, profile) : await enrollLearner(profile);
  credentials.set(email, { participantId: learner.id, hash: hashPassword(input.password) });
  await setSession(learner);
  return learner;
}

/** Sign in an existing learner and start their session. */
export async function signInLearner(emailRaw: string, password: string): Promise<Participant> {
  const email = emailRaw.trim().toLowerCase();

  if (isSupabaseConfigured()) {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw new LearnerAuthError("Invalid email or password.");
    const learner =
      (await findLearnerByAuthId(data.user.id)) ?? (await findLearnerByEmail(email));
    if (!learner) throw new LearnerAuthError("No learner profile found for this account.");
    await setSession(learner);
    return learner;
  }

  const cred = credentials.get(email);
  if (!cred || !verifyPassword(password, cred.hash)) {
    throw new LearnerAuthError("Invalid email or password.");
  }
  const learner = await findLearnerById(cred.participantId);
  if (!learner) throw new LearnerAuthError("Profile not found.");
  await setSession(learner);
  return learner;
}

export async function signOutLearner(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await getSupabaseServerClient();
    await supabase?.auth.signOut();
  }
  await clearSession();
}

/** The signed-in learner's CRM record, or null. Safe to call in server components. */
export async function getCurrentLearner(): Promise<Participant | null> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await getSupabaseServerClient();
      const {
        data: { user },
      } = await supabase!.auth.getUser();
      if (!user) return null;
      return (
        (await findLearnerByAuthId(user.id)) ??
        (user.email ? await findLearnerByEmail(user.email) : null)
      );
    }
    // No database: the cookie snapshot IS the source of truth.
    return await readSessionLearner();
  } catch {
    return null;
  }
}

/** Merge a partial patch onto a learner record and re-validate. */
function applyPatch(learner: Participant, patch: Parameters<typeof patchLearner>[1]): Participant {
  return participantSchema.parse({
    ...learner,
    ...patch,
    id: learner.id,
    dateAdded: learner.dateAdded,
    lastUpdated: new Date().toISOString(),
  });
}

/** Update the signed-in learner's own profile (financial snapshot, etc.). */
export async function updateLearnerProfile(
  patch: Parameters<typeof patchLearner>[1],
): Promise<Participant> {
  const learner = await getCurrentLearner();
  if (!learner) throw new LearnerAuthError("Not signed in.");
  if (isSupabaseConfigured()) return patchLearner(learner.id, patch);
  // No database: update the cookie snapshot in place.
  const next = applyPatch(learner, patch);
  await setSession(next);
  return next;
}

/** Curriculum modules each course day maps to (mirrors quiz.ts DAY_MODULES). */
/**
 * Record a passed day test on the learner's CRM record: marks the day's modules
 * completed (with the score), advances a brand-new lead to "in-progress", and
 * adds the certificate. No-op (returns null) for anonymous visitors.
 */
export async function recordDayPass(
  daySlug: string,
  score: number,
  certificateId?: string | null,
): Promise<Participant | null> {
  const learner = await getCurrentLearner();
  if (!learner) return null;

  const now = new Date().toISOString();
  const moduleIds = DAY_MODULE_IDS[daySlug] ?? [];
  const progress = [...learner.moduleProgress];
  for (const moduleId of moduleIds) {
    const existing = progress.find((m) => m.moduleId === moduleId);
    const entry = {
      moduleId,
      status: "completed" as const,
      completedDate: now,
      score: Math.round(score),
    };
    if (existing) Object.assign(existing, entry);
    else progress.push(entry);
  }

  const certificates = [...learner.certificates];
  if (!certificates.some((c) => c.phase === daySlug)) {
    certificates.push({
      name: `Homebuyer Education — ${daySlug.replace("day-", "Day ")}`,
      issuedDate: now.slice(0, 10),
      phase: daySlug,
    });
  }

  const patch = {
    moduleProgress: progress,
    certificates,
    stage: learner.stage === "lead" ? ("in-progress" as const) : learner.stage,
  };
  if (isSupabaseConfigured()) return patchLearner(learner.id, patch);
  // No database: persist progress into the cookie snapshot.
  const next = applyPatch(learner, patch);
  await setSession(next);
  return next;
}

/**
 * Sign in as one of the fabricated demo learners, so the client experience can
 * be shown live without filling in a sign-up form. Refuses any id that is not
 * on the demo allowlist — this door can never open a real learner's account.
 */
export async function startDemoSession(persona: DemoPersona): Promise<Participant | null> {
  const id = DEMO_LEARNER_IDS[persona];
  if (!id || !isDemoLearnerId(id)) return null;
  const learner = await findLearnerById(id);
  if (!learner || !isDemoLearnerId(learner.id)) return null;
  await setSession(learner);
  return learner;
}
