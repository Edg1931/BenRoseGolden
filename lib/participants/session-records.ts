import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { participantSchema, type Participant } from "./schema";
export { mergeRecords } from "./merge-records";

/**
 * Carries records created during THIS browser's visit, for deployments running
 * without a database.
 *
 * Sample-data mode keeps participants in a module-level array. That is fine on
 * one long-lived server and wrong on serverless, where each request may be
 * handled by a different short-lived instance: someone signs up, then the staff
 * client list is served by an instance that never saw them and they appear to
 * have vanished.
 *
 * The learner session already solves this for the learner's own pages by
 * carrying their record in a signed cookie. This extends the same idea to the
 * staff views, so a person created in this browser stays visible across both
 * sides of the app. It is a continuity mechanism for demos and evaluation, not
 * storage: another browser won't see these records, and they expire. Configure
 * Supabase for real persistence — this goes inert the moment you do.
 */

const COOKIE = "br_session_records";
const SECRET = process.env.LEARNER_SESSION_SECRET || "dev-insecure-learner-secret-change-me";

/** Cookies cap around 4KB; keep well inside it. */
const MAX_RECORDS = 3;

function sign(value: string): string {
  const mac = createHmac("sha256", SECRET).update(value).digest("hex").slice(0, 32);
  return `${value}.${mac}`;
}

function unsign(signed: string): string | null {
  const i = signed.lastIndexOf(".");
  if (i < 0) return null;
  const value = signed.slice(0, i);
  const expected = createHmac("sha256", SECRET).update(value).digest("hex").slice(0, 32);
  const a = Buffer.from(signed.slice(i + 1));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b) ? value : null;
}

/** Drop the heavy free-text fields so several records fit in one cookie. */
function trim(p: Participant): Participant {
  return { ...p, communications: [], notes: undefined };
}

/** Remember a newly created participant for the rest of this browser session. */
export async function rememberRecord(p: Participant): Promise<void> {
  try {
    const existing = (await recalledRecords()).filter((r) => r.id !== p.id);
    const next = [trim(p), ...existing].slice(0, MAX_RECORDS);
    const payload = Buffer.from(JSON.stringify(next)).toString("base64url");
    const store = await cookies();
    store.set(COOKIE, sign(payload), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
  } catch {
    // Called from a Server Component (read-only cookies) — the in-memory store
    // still has the record, so this is a no-op rather than a failure.
  }
}

/** Records created in this browser, newest first. */
export async function recalledRecords(): Promise<Participant[]> {
  try {
    const store = await cookies();
    const raw = store.get(COOKIE)?.value;
    if (!raw) return [];
    const payload = unsign(raw);
    if (!payload) return [];
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((r) => {
        try {
          return participantSchema.parse(r);
        } catch {
          return null;
        }
      })
      .filter((r): r is Participant => r !== null);
  } catch {
    return [];
  }
}

