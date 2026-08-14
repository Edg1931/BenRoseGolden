import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { ROLES, type Role } from "./roles";

/**
 * Staff sign-in for deployments running WITHOUT Supabase.
 *
 * With Supabase, staff identity comes from a real auth user plus a `profiles`
 * row (see lib/auth/session.ts) and none of this applies. Without it, the app
 * previously handed full CRM access to anyone who knew the URL — every client
 * record, unauthenticated. This closes that with a shared passcode, which is the
 * right weight for a sample-data deployment: enough to keep the client list off
 * the open internet, without pretending to be per-user accounts.
 *
 * Set STAFF_PASSCODE to turn it on. When it is unset the behaviour is unchanged
 * (open access with a dev user) so local development keeps working — but the
 * dashboard shows a standing warning so an unprotected deployment can't go
 * unnoticed.
 */

const COOKIE = "br_staff";
const SECRET =
  process.env.STAFF_SESSION_SECRET ||
  process.env.LEARNER_SESSION_SECRET ||
  "dev-insecure-staff-secret-change-me";

export interface StaffSession {
  role: Role;
  org?: "benjamin-rose" | "esop";
  name?: string;
}

/** True when a passcode is configured, i.e. the staff area is gated. */
export function isStaffPasscodeEnabled(): boolean {
  return Boolean(process.env.STAFF_PASSCODE);
}

/**
 * A no-Supabase deployment with no passcode set is serving the CRM to anyone
 * with the link. Surfaced in the UI rather than failed silently.
 */
export function isStaffAreaUnprotected(): boolean {
  return !isSupabaseConfigured() && !isStaffPasscodeEnabled();
}

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

/** Constant-time passcode comparison, so a wrong guess leaks no timing signal. */
export function verifyPasscode(input: string): boolean {
  const expected = process.env.STAFF_PASSCODE;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function startStaffSession(session: StaffSession): Promise<void> {
  const store = await cookies();
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  store.set(COOKIE, sign(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // a working day; staff re-authenticate daily
  });
}

export async function endStaffSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function readStaffSession(): Promise<StaffSession | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  const payload = unsign(raw);
  if (!payload) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as StaffSession;
    if (!(ROLES as readonly string[]).includes(parsed.role)) return null;
    return parsed;
  } catch {
    return null;
  }
}
