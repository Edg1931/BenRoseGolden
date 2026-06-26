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

/** Local banks: questions authored here (in addition to the curriculum module
 *  banks) so each day test also covers that day's newer lessons. */
const LOCAL_QUESTIONS: Record<string, QuizQuestion[]> = {
  "day-1": [
    {
      id: "day1-1",
      text: "A good guideline for credit utilization is to keep it…",
      options: [
        "Above 50% of your limits",
        "Under about 30% of your limits",
        "At exactly 100%",
        "It doesn't matter",
      ],
      correctIndex: 1,
    },
    {
      id: "day1-2",
      text: "A SMART savings goal is best described as…",
      options: [
        "'Save more money someday'",
        "Specific, Measurable, Achievable, Relevant, and Time-bound",
        "Only about cutting out all spending",
        "A loan you take from the bank",
      ],
      correctIndex: 1,
    },
    {
      id: "day1-3",
      text: "If you spot an error on your credit report, the best move is to…",
      options: [
        "Ignore it",
        "Dispute it with the credit bureau",
        "Close all your accounts",
        "Open a new credit card to offset it",
      ],
      correctIndex: 1,
    },
    {
      id: "day1-4",
      text: "Before pouring savings into a down payment, it's smart to first build…",
      options: [
        "A small emergency fund",
        "A bigger entertainment budget",
        "A second car loan",
        "Nothing — put every dollar toward the home",
      ],
      correctIndex: 0,
    },
  ],
  "day-2": [
    {
      id: "day2m-1",
      text: "With a credit score of 580 or higher, the minimum FHA down payment is…",
      options: ["0%", "3.5%", "10%", "20%"],
      correctIndex: 1,
    },
    {
      id: "day2m-2",
      text: "FHA loans charge an upfront mortgage insurance premium (UFMIP) of about…",
      options: [
        "0.25% of the loan",
        "1.75% of the loan",
        "10% of the loan",
        "There is no upfront premium",
      ],
      correctIndex: 1,
    },
    {
      id: "day2m-3",
      text: "When the housing ratio and the debt-to-income ratio give different limits, a lender uses…",
      options: [
        "The higher of the two",
        "The lower of the two",
        "Only the housing ratio",
        "Neither — only your credit score",
      ],
      correctIndex: 1,
    },
    {
      id: "day2m-4",
      text: "A VA loan is notable because eligible veterans often pay…",
      options: [
        "A 20% down payment",
        "0% down with no monthly mortgage insurance",
        "Double the interest rate",
        "An extra inspection fee",
      ],
      correctIndex: 1,
    },
    {
      id: "day2m-5",
      text: "A common guideline for annual home-maintenance savings is about…",
      options: [
        "1% of the home's value per year",
        "50% of your income",
        "Nothing — repairs are rare",
        "10% of the home's value every month",
      ],
      correctIndex: 0,
    },
  ],
  "day-3": [
    {
      id: "day3-1",
      text: "A dual agent in a real estate deal represents…",
      options: [
        "Only the buyer",
        "Only the seller",
        "Both the buyer and the seller",
        "The bank",
      ],
      correctIndex: 2,
    },
    {
      id: "day3-2",
      text: "Under the current rules, the Buyer Representation Agreement is signed…",
      options: [
        "After closing",
        "Before the agent provides services",
        "Only if you buy a foreclosure",
        "Never — it's optional",
      ],
      correctIndex: 1,
    },
    {
      id: "day3-3",
      text: "While touring a home, fresh paint in just one spot may…",
      options: [
        "Always be meaningless",
        "Hide a problem like a water stain — worth asking about",
        "Mean the home is brand new",
        "Automatically lower the price",
      ],
      correctIndex: 1,
    },
  ],
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
    {
      id: "day4-5",
      text: "Replacement-cost coverage pays…",
      options: [
        "Only the depreciated value of an item",
        "Enough to buy the item new today",
        "Nothing for electronics",
        "Only for the structure, never belongings",
      ],
      correctIndex: 1,
    },
    {
      id: "day4-6",
      text: "In Ohio, owning a dog the state classifies as 'vicious' requires liability coverage of at least…",
      options: ["$1,000", "$10,000", "$100,000", "No coverage is required"],
      correctIndex: 2,
    },
    {
      id: "day4-7",
      text: "The best time to line up homeowner's insurance is…",
      options: [
        "A year after moving in",
        "As soon as you sign the purchase contract",
        "Only after a disaster",
        "It's optional, so never",
      ],
      correctIndex: 1,
    },
    {
      id: "day4-8",
      text: "A simple, low-cost habit that prevents some of the most expensive home repairs is…",
      options: [
        "Cleaning gutters and directing water away from the foundation",
        "Repainting the whole house every year",
        "Turning the heat off all winter",
        "Never changing the furnace filter",
      ],
      correctIndex: 0,
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
