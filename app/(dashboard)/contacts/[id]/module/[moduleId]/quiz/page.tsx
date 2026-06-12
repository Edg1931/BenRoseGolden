import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getParticipant } from "@/lib/participants/repository";
import { getModule } from "@/lib/participants/curriculum";
import { getQuiz, publicQuiz, QUIZ_PASS_THRESHOLD } from "@/lib/participants/quiz";
import { QuizRunner } from "@/components/participants/quiz-runner";

export const dynamic = "force-dynamic";

export default async function ModuleQuizPage({
  params,
}: {
  params: Promise<{ id: string; moduleId: string }>;
}) {
  const { id, moduleId } = await params;
  const user = await getCurrentUser();
  const participant = await getParticipant(user, id);
  if (!participant) notFound();

  const mod = getModule(moduleId);
  const quiz = getQuiz(moduleId);
  if (!mod || !quiz) notFound();

  const fullName = [participant.firstName, participant.lastName].filter(Boolean).join(" ");
  const prior = participant.moduleProgress.find((mp) => mp.moduleId === moduleId);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href={`/contacts/${id}`} className="text-sm text-muted-foreground hover:underline">
        ← Back to {fullName}
      </Link>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Module test
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{mod.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {quiz.length} questions · pass with {QUIZ_PASS_THRESHOLD}% or higher.
          {prior?.status === "completed" && " This module is already complete — retaking updates the score."}
        </p>
      </div>

      <QuizRunner
        participantId={id}
        moduleId={moduleId}
        questions={publicQuiz(quiz)}
      />
    </div>
  );
}
