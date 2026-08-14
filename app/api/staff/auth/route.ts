import { NextResponse } from "next/server";
import {
  endStaffSession,
  isStaffPasscodeEnabled,
  startStaffSession,
  verifyPasscode,
} from "@/lib/auth/staff-session";
import { ROLES, type Role } from "@/lib/auth/roles";

const ROLE_NAMES: Record<Role, string> = {
  admin: "Master Admin",
  "golden-agent": "Golden Group Agent",
  "benjamin-rose": "Benjamin Rose Staff",
};

/** Sign a staff member in with the shared passcode (no-Supabase deployments). */
export async function POST(request: Request) {
  if (!isStaffPasscodeEnabled()) {
    return NextResponse.json(
      { error: "Passcode sign-in isn't enabled on this deployment." },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const passcode = typeof body.passcode === "string" ? body.passcode : "";
  const role: Role = (ROLES as readonly string[]).includes(body.role)
    ? (body.role as Role)
    : "admin";
  const org = body.org === "esop" ? "esop" : "benjamin-rose";

  if (!verifyPasscode(passcode)) {
    return NextResponse.json({ error: "That passcode isn't right." }, { status: 401 });
  }

  await startStaffSession({ role, org, name: ROLE_NAMES[role] });
  return NextResponse.json({ role });
}

/** Sign out of the staff area. */
export async function DELETE() {
  await endStaffSession();
  return NextResponse.json({ signedOut: true });
}
