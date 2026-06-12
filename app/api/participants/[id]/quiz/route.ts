import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCurrentUser } from "@/lib/auth/session";
import { getParticipant, updateParticipant } from "@/lib/participants/repository";
import { getModule } from "@/lib/participants/curriculum";
import { scoreQuiz } from "@/lib/participants/quiz";
import { completeModule, recordAttempt } from "@/lib/participants/progress";
import type { Communication } from "@/lib/participants/schema";

/**
 * Score a module quiz server-side and persist the outcome. Passing completes the
 * module (and may auto-issue the HUD certificate); a fail records the attempt.
 * Either way an internal timeline note is logged for the counselor.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();
  try {
    const { moduleId, answers } = (await request.json()) as {
      moduleId?: string;
      answers?: Record<string, number>;
    };
    if (!moduleId || typeof answers !== "object" || answers == null) {
      return NextResponse.json({ error: "moduleId and answers are required" }, { status: 400 });
    }

    const result = scoreQuiz(moduleId, answers);
    if (!result) {
      return NextResponse.json({ error: "No quiz for that module" }, { status: 404 });
    }

    const participant = await getParticipant(user, id);
    if (!participant) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const moduleName = getModule(moduleId)?.name ?? moduleId;
    const note: Communication = {
      id: randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      channel: "note",
      direction: "internal",
      subject: `Module quiz: ${moduleName}`,
      body: `Scored ${result.score}% (${result.correct}/${result.total}) — ${
        result.passed ? "passed" : "did not pass"
      }.`,
      byUser: user.name ?? user.email ?? undefined,
    };

    const base = result.passed
      ? completeModule(participant, moduleId, { score: result.score })
      : recordAttempt(participant, moduleId, result.score);

    const updated = await updateParticipant(user, id, {
      ...base,
      communications: [...participant.communications, note],
    });

    const certIssued =
      updated.certificates.length > participant.certificates.length;

    return NextResponse.json({ result, certIssued, participant: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
