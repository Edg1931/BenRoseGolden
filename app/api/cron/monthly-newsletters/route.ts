import { NextResponse } from "next/server";
import { runMonthlyNewsletters } from "@/lib/content/automation";
import type { AuthUser } from "@/lib/auth/roles";

// Generation can involve AI drafting + article search per segment.
export const maxDuration = 300;

/** System identity for scheduled runs — sees all orgs, named in timelines. */
const SYSTEM_USER: AuthUser = {
  id: "system-newsletter-automation",
  email: "automation@benrosegolden.local",
  role: "admin",
  name: "Monthly newsletter automation",
};

/**
 * GET /api/cron/monthly-newsletters — scheduled for the 1st of each month by
 * Vercel Cron (see vercel.json). Creates one designed issue per audience
 * segment; NEWSLETTER_AUTOPILOT=send also emails them. Idempotent per month,
 * so retries never double-send.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not configured; scheduled newsletters are disabled." },
      { status: 503 },
    );
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const run = await runMonthlyNewsletters(SYSTEM_USER);
  return NextResponse.json({ ok: true, ...run });
}
