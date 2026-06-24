import { NextResponse } from "next/server";
import { loadAllPrograms } from "@/lib/programs/sources";
import { refreshPrograms, isRefreshConfigured } from "@/lib/programs/refresh/agent";
import { diffCandidates } from "@/lib/programs/refresh/diff";
import { saveRefreshRun } from "@/lib/programs/refresh/store";

// The web-search agent can run for a while; give it room on Vercel.
export const maxDuration = 300;

/**
 * GET /api/cron/refresh-programs — scheduled weekly by Vercel Cron (see
 * vercel.json). Runs the AI research agent, diffs candidates against the live
 * program database, and stores the run as a review queue for staff. It does
 * NOT modify the live programs — keeping a human in the loop, by design, because
 * vulnerable buyers rely on this data.
 *
 * Auth: Vercel sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is
 * set. We require it so the endpoint can't be triggered by the public.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not configured; scheduled refresh is disabled." },
      { status: 503 },
    );
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isRefreshConfigured()) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "ANTHROPIC_API_KEY not set — nothing to research.",
    });
  }

  try {
    const [result, existing] = await Promise.all([refreshPrograms(), loadAllPrograms()]);
    const diffed = diffCandidates(result.candidates, existing);
    const summary = {
      total: diffed.length,
      new: diffed.filter((d) => d.status === "new").length,
      changed: diffed.filter((d) => d.status === "changed").length,
      unchanged: diffed.filter((d) => d.status === "unchanged").length,
      invalidDropped: result.invalidCount,
    };

    const runId = await saveRefreshRun({
      trigger: "cron",
      model: result.model,
      summary,
      diffed,
    });

    return NextResponse.json({
      ok: true,
      persisted: runId !== null,
      runId,
      summary,
      generatedAt: result.generatedAt,
      note: runId
        ? "Stored as a pending review queue for staff."
        : "Supabase not configured — summary only, nothing persisted.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Refresh failed" },
      { status: 500 },
    );
  }
}
