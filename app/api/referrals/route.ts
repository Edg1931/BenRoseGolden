import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createReferral, listReferrals, ForbiddenError } from "@/lib/referrals/repository";
import { redactReferrals } from "@/lib/referrals/redaction";
import { computeMetrics } from "@/lib/referrals/metrics";

export async function GET() {
  const user = await getCurrentUser();
  const referrals = await listReferrals(user);
  // Metrics use unredacted rows (counts only); the payload is redacted.
  return NextResponse.json({
    referrals: redactReferrals(referrals),
    metrics: computeMetrics(referrals),
    viewer: { role: user.role, org: user.org ?? null },
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  try {
    const body = await request.json();
    const created = await createReferral(user, body);
    return NextResponse.json({ referral: created }, { status: 201 });
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid request" },
      { status: 400 },
    );
  }
}
