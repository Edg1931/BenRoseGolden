/**
 * Role model for the partnership.
 *
 * - `golden-agent`  : The Golden Group agents. Full edit on all referrals.
 * - `benjamin-rose` : Benjamin Rose / ESOP staff. Read + limited edit on
 *                     ONLY the referrals their own organization created.
 * - `admin`         : Partnership admin. Full access (manage agents, all orgs).
 *
 * The same checks live here (app layer) AND in Supabase RLS (SQL migration),
 * so access is enforced even if a query bypasses the API route.
 */

export const ROLES = ["admin", "golden-agent", "benjamin-rose"] as const;
export type Role = (typeof ROLES)[number];

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  /** For benjamin-rose staff: which source org they belong to. */
  org?: "benjamin-rose" | "esop";
  /** Display name used to match against a referral's assignedAgent. */
  name?: string;
}

import type { Referral } from "@/lib/referrals/schema";

export function isGoldenSide(user: AuthUser): boolean {
  return user.role === "admin" || user.role === "golden-agent";
}

/** Can this user see the referral at all? */
export function canViewReferral(user: AuthUser, referral: Referral): boolean {
  if (isGoldenSide(user)) return true;
  // Benjamin Rose staff see only referrals from their own org.
  return referral.source === user.org;
}

/** Can this user fully edit (stage, agent, outcome, notes) the referral? */
export function canEditReferral(user: AuthUser, referral: Referral): boolean {
  return isGoldenSide(user);
}

/**
 * Fields a benjamin-rose user may edit on their own referrals (limited edit).
 * They can correct their own intake data + consent, but not pipeline state
 * owned by the Golden Group (stage / assignedAgent / outcome).
 */
export const BENJAMIN_ROSE_EDITABLE_FIELDS = [
  "firstName",
  "lastInitial",
  "contact",
  "programType",
  "certificateCompleted",
  "certificateDate",
  "consentToShare",
  "consentDate",
  "notes",
] as const;

export function canLimitedEditReferral(
  user: AuthUser,
  referral: Referral,
): boolean {
  if (isGoldenSide(user)) return true;
  return referral.source === user.org;
}

/** Which editable fields are allowed for this user on this referral. */
export function allowedEditFields(
  user: AuthUser,
  referral: Referral,
): "all" | readonly string[] | "none" {
  if (canEditReferral(user, referral)) return "all";
  if (canLimitedEditReferral(user, referral)) return BENJAMIN_ROSE_EDITABLE_FIELDS;
  return "none";
}
