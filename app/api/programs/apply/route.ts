import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { isGoldenSide } from "@/lib/auth/roles";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { programSchema } from "@/lib/programs/schema";
import { candidateProgramSchema } from "@/lib/programs/refresh/schema";
import { candidateToProgram } from "@/lib/programs/refresh/diff";

/**
 * POST /api/programs/apply — persist reviewer-approved candidates as curated
 * programs. Admin / Golden Group only.
 *
 * With Supabase configured, candidates are upserted into the `programs` table.
 * Without it (seed mode), the file system is read-only at runtime, so we return
 * the validated records for the reviewer to download and commit into
 * data/programs.seed.json. Either way, nothing is written without explicit
 * human approval.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!isGoldenSide(user)) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const rawCandidates = Array.isArray(body?.candidates) ? body.candidates : null;
  if (!rawCandidates) {
    return NextResponse.json(
      { error: "Expected { candidates: [...] }." },
      { status: 400 },
    );
  }

  // Validate as candidates, then convert + validate as curated Programs.
  const programs = [];
  for (const item of rawCandidates) {
    const candidate = candidateProgramSchema.safeParse(item);
    if (!candidate.success) continue;
    const program = programSchema.safeParse(candidateToProgram(candidate.data));
    if (program.success) programs.push(program.data);
  }

  if (programs.length === 0) {
    return NextResponse.json(
      { error: "No valid programs to apply." },
      { status: 400 },
    );
  }

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase
      .from("programs")
      .upsert(programs, { onConflict: "id" });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ applied: true, count: programs.length });
  }

  // Seed mode: hand the records back for the reviewer to commit.
  return NextResponse.json({
    applied: false,
    reason:
      "Supabase not configured — download these and commit them into data/programs.seed.json.",
    programs,
  });
}
