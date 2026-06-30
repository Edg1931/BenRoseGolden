import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ROLES, type AuthUser, type Role } from "./roles";

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

  // ---- Dev fallback ----
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
