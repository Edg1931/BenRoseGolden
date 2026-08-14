import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { isGoldenSide } from "@/lib/auth/roles";
import { runMonthlyNewsletters, NEWSLETTER_SEGMENTS } from "@/lib/content/automation";
import type { Track } from "@/lib/participants/curriculum";

export const maxDuration = 300;

/**
 * POST /api/content/automation/run — staff trigger for monthly issues.
 *
 * The interactive UI calls this once PER SEGMENT ({track}) with curated
 * articles, so each request does at most one AI drafting call and finishes
 * well inside serverless time limits — generating all four segments in one
 * request is what the long-budget cron does, not a browser. Idempotent:
 * already-generated segments are skipped.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!isGoldenSide(user) && user.role !== "benjamin-rose") {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));

  const validTracks = NEWSLETTER_SEGMENTS.map((s) => s.track);
  const track =
    typeof body?.track === "string" && (validTracks as string[]).includes(body.track)
      ? (body.track as Track)
      : undefined;

  const run = await runMonthlyNewsletters(user, {
    mode: body?.send === true ? "send" : undefined,
    tracks: track ? [track] : undefined,
    articleMode: "curated", // keep interactive requests fast; the cron does AI article search
  });
  return NextResponse.json(run);
}
