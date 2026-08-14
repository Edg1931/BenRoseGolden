import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ROLES, type AuthUser, type Role } from "./roles";
import { isStaffPasscodeEnabled, readStaffSession } from "./staff-session";

/**
 * Resolve the current user.
 *
 * With Supabase configured: reads the session and the user's role/org from the
 * `profiles` table (see SQL migration).
 *
 * Without Supabase (local dev): returns a dev user. The role can be switched
 * with a `dev_role` cookie (admin | golden-agent | benjamin-rose) and a
 * `dev_org` cookie (benjamin-rose | esop) so RBAC can be exercised in the UI.
 */
/**
 * Like getCurrentUser but returns null instead of throwing when there's no staff
 * user. Used to let a signed-in staff member (e.g. a master admin) PREVIEW the
 * learner classes without creating a learner account. In local dev this always
 * returns the dev staff user, so previews just work.
 */
export async function tryGetCurrentUser(): Promise<AuthUser | null> {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser> {
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      // Caller (layout/middleware) is responsible for redirecting to sign-in.
      throw new Error("Not authenticated");
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, org, name")
      .eq("id", user.id)
      .maybeSingle();

    // No staff profile = not staff (e.g. a self-enrolled learner account). Deny
    // staff access — never default an authenticated user into a staff role.
    if (!profile) {
      throw new Error("Not authorized: no staff profile for this account");
    }

    return {
      id: user.id,
      email: user.email ?? "",
      role: profile.role as Role,
      org: profile.org ?? undefined,
      name: profile.name ?? undefined,
    };
  }

  // ---- No Supabase: passcode session, or the open dev user ----
  const staff = await readStaffSession();
  if (staff) {
    return {
      id: "staff-session",
      email: staff.name ? `${staff.name.toLowerCase().replace(/\s+/g, ".")}@benjaminrose.local` : "staff@benjaminrose.local",
      role: staff.role,
      org: staff.role === "benjamin-rose" ? staff.org ?? "benjamin-rose" : undefined,
      name: staff.name ?? undefined,
    };
  }

  // A configured passcode means the staff area is gated: no session, no access.
  // The layout redirects to /staff/signin.
  if (isStaffPasscodeEnabled()) {
    throw new Error("Not authenticated");
  }

  // ---- Dev fallback (no Supabase, no passcode configured) ----
  const cookieStore = await cookies();
  const role = normalizeRole(cookieStore.get("dev_role")?.value);
  const org =
    (cookieStore.get("dev_org")?.value as "benjamin-rose" | "esop" | undefined) ??
    "benjamin-rose";

  return {
    id: "dev-user",
    email: "dev@benrosegolden.local",
    role,
    org: role === "benjamin-rose" ? org : undefined,
    name: role === "golden-agent" ? "Jordan Avery" : "Dev User",
  };
}

function normalizeRole(value?: string): Role {
  if (value && (ROLES as readonly string[]).includes(value)) return value as Role;
  return "golden-agent"; // default dev role: full access
}
