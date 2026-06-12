"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import type { PublicQuizQuestion } from "@/lib/participants/quiz";

interface SubmitResult {
  result: { score: number; correct: number; total: number; passed: boolean };
  certIssued: boolean;
}

/** Client quiz: collect answers, submit for server-side scoring, show outcome. */
export function QuizRunner({
  participantId,
  moduleId,
  questions,
}: {
  participantId: string;
  moduleId: string;
  questions: PublicQuizQuestion[];
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<SubmitResult | null>(null);

  const allAnswered = questions.every((q) => answers[q.id] != null);

  async function submit() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/participants/${participantId}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not submit quiz");
      setOutcome(data as SubmitResult);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not submit quiz");
    } finally {
      setBusy(false);
    }
  }

  function retake() {
    setOutcome(null);
    setAnswers({});
    setErr(null);
  }

  if (outcome) {
    const { result, certIssued } = outcome;
    return (
      <Card className="space-y-3 p-6 text-center">
        <div className="text-4xl">{result.passed ? "🎉" : "📝"}</div>
        <div className="text-2xl font-semibold">{result.score}%</div>
        <p className="text-sm text-muted-foreground">
          {result.correct} of {result.total} correct
        </p>
        {result.passed ? (
          <p className="text-sm font-medium text-emerald-700">
            Passed — module marked complete.
          </p>
        ) : (
          <p className="text-sm font-medium text-amber-700">
            Not passed yet. Review the material and try again.
          </p>
        )}
        {certIssued && (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
            🎓 HUD Pre-Purchase Homebuyer Education certificate issued!
          </p>
        )}
        <div className="flex justify-center gap-2 pt-1">
          {!result.passed && (
            <button
              onClick={retake}
              className="rounded-md border border-input px-4 py-2 text-sm hover:bg-muted"
            >
              Retake
            </button>
          )}
          <button
            onClick={() => router.push(`/contacts/${participantId}`)}
            className="rounded-md bg-brand-gold px-4 py-2 text-sm font-medium text-white"
          >
            Back to profile
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q, qi) => (
        <Card key={q.id} className="space-y-3 p-4">
          <div className="font-medium">
            {qi + 1}. {q.text}
          </div>
          <div className="space-y-1.5">
            {q.options.map((opt, oi) => {
              const checked = answers[q.id] === oi;
              return (
                <label
                  key={oi}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                    checked ? "border-brand-gold bg-brand-gold/10" : "border-input hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={checked}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        </Card>
      ))}

      {err && <p className="text-sm text-red-700">{err}</p>}

      <button
        onClick={submit}
        disabled={!allAnswered || busy}
        className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {busy ? "Scoring…" : allAnswered ? "Submit test" : "Answer all questions to submit"}
      </button>
    </div>
  );
}
