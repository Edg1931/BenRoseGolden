import { getQuiz, publicQuiz, QUIZ_PASS_THRESHOLD } from "@/lib/participants/quiz";
import type { PublicQuizQuestion, QuizQuestion } from "@/lib/participants/quiz";

/**
 * SERVER-ONLY day tests for the learner course. Answer keys live here (and in
 * lib/participants/quiz.ts) and must never be imported from client components —
 * the client gets questions via `dayPublicQuestions()` (no keys) and the
 * translations in lib/learn/quiz-i18n.ts.
 *
 * Days 1–3 reuse the curriculum module banks so staff tracking and the learner
 * course stay consistent; Day 4 (insurance & maintenance) has no curriculum
 * bank, so its questions are authored here.
 */

/** Which curriculum-module quizzes make up each day's test. */
const DAY_MODULES: Record<string, string[]> = {
  "day-1": ["budgeting", "credit-basics"],
  "day-2": ["mortgages"],
  "day-3": ["shopping", "closing"],
  "day-4": [],
};

/** Local banks for days without a curriculum module quiz. */
const LOCAL_QUESTIONS: Record<string, QuizQuestion[]> = {
  "day-4": [
    {
      id: "day4-1",
      text: "Your lender requires homeowner's insurance because…",
      options: [
        "It makes the house look nicer",
        "The home is the loan's collateral, so it must be protected",
        "It replaces the home inspection",
        "It is optional in Ohio",
      ],
      correctIndex: 1,
    },
    {
      id: "day4-2",
      text: "Flood damage to your home is typically…",
      options: [
        "Covered by every standard policy",
        "Only covered with separate flood coverage",
        "Covered if you have a mortgage",
        "Never insurable",
      ],
      correctIndex: 1,
    },
    {
      id: "day4-3",
      text: "Choosing a higher insurance deductible generally means…",
      options: [
        "A lower premium, but more out-of-pocket if you file a claim",
        "A higher premium",
        "No change in cost",
        "The lender pays the difference",
      ],
      correctIndex: 0,
    },
    {
      id: "day4-4",
      text: "Hot/cold spots, pests, mold, or a sudden jump in utility bills are…",
      options: [
        "Normal — every home has them, ignore them",
        "Warning signs of fixable problems like insulation gaps or moisture",
        "Reasons to file an insurance claim immediately",
        "Only a problem in old homes",
      ],
      correctIndex: 1,
    },
  ],
};

function dayQuestions(daySlug: string): QuizQuestion[] {
  const fromModules = (DAY_MODULES[daySlug] ?? []).flatMap((m) => getQuiz(m) ?? []);
  return [...fromModules, ...(LOCAL_QUESTIONS[daySlug] ?? [])];
}

/** Questions with NO answer key, safe to send to the browser. */
export function dayPublicQuestions(daySlug: string): PublicQuizQuestion[] {
  return publicQuiz(dayQuestions(daySlug));
}

export interface DayQuizResult {
  score: number;
  correct: number;
  total: number;
  passed: boolean;
}

/** Score a day's submitted answers (questionId → chosen option index). */
export function scoreDay(daySlug: string, answers: Record<string, number>): DayQuizResult | null {
  const questions = dayQuestions(daySlug);
  if (questions.length === 0) return null;
  const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const score = Math.round((correct / questions.length) * 100);
  return { score, correct, total: questions.length, passed: score >= QUIZ_PASS_THRESHOLD };
}

export { QUIZ_PASS_THRESHOLD };
