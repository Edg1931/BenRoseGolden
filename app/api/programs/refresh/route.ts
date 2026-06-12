import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { isGoldenSide } from "@/lib/auth/roles";
import { loadAllPrograms } from "@/lib/programs/sources";
import { refreshPrograms, isRefreshConfigured } from "@/lib/programs/refresh/agent";
import { diffCandidates } from "@/lib/programs/refresh/diff";

// The web-search agent can run for a while; give it room on Vercel.
export const maxDuration = 300;

/**
 * POST /api/programs/refresh — run the AI research agent and return candidate
 * programs diffed against the current curated database. Admin / Golden Group
 * only. Returns candidates for REVIEW; it does not modify any data.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!isGoldenSide(user)) {
    return NextResponse.json(
      { error: "Only Golden Group staff can refresh the program database." },
      { status: 403 },
    );
  }

  if (!isRefreshConfigured()) {
    return NextResponse.json(
      {
        error:
          "AI refresh is not configured. Set ANTHROPIC_API_KEY to enable it.",
      },
      { status: 503 },
    );
  }

  let geographyHint: string | undefined;
  try {
    const body = await request.json().catch(() => ({}));
    if (typeof body?.geographyHint === "string" && body.geographyHint.trim()) {
      geographyHint = body.geographyHint.trim();
    }
  } catch {
    // No body is fine — statewide sweep.
  }

  try {
    const [result, existing] = await Promise.all([
      refreshPrograms(geographyHint),
      loadAllPrograms(),
    ]);

    const diffed = diffCandidates(result.candidates, existing);
    return NextResponse.json({
      diffed,
      summary: {
        total: diffed.length,
        new: diffed.filter((d) => d.status === "new").length,
        changed: diffed.filter((d) => d.status === "changed").length,
        unchanged: diffed.filter((d) => d.status === "unchanged").length,
        invalidDropped: result.invalidCount,
      },
      model: result.model,
      generatedAt: result.generatedAt,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Refresh failed" },
      { status: 500 },
    );
  }
}
