import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { isGoldenSide } from "@/lib/auth/roles";
import { runMonthlyNewsletters } from "@/lib/content/automation";

export const maxDuration = 300;

/**
 * POST /api/content/automation/run — staff trigger for this month's issues
 * (the same run the cron performs). Body {send: true} also delivers them when
 * email is configured. Idempotent: already-generated segments are skipped.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!isGoldenSide(user) && user.role !== "benjamin-rose") {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));
  const run = await runMonthlyNewsletters(user, {
    mode: body?.send === true ? "send" : undefined,
  });
  return NextResponse.json(run);
}
