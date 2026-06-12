import { getModule } from "./curriculum";

/**
 * In-app module quizzes. Each `hasTest` curriculum module has a short
 * multiple-choice quiz here; passing it (>= QUIZ_PASS_THRESHOLD) completes the
 * module and feeds the same certificate logic as manual check-off.
 *
 * Correct answers live server-side only — the quiz page ships `publicQuiz()`
 * (questions + options, no answer key) to the browser and scores on the server.
 */

export const QUIZ_PASS_THRESHOLD = 70;

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  /** Index into `options` of the correct answer (server-side only). */
  correctIndex: number;
}

/** A question safe to send to the client — no answer key. */
export interface PublicQuizQuestion {
  id: string;
  text: string;
  options: string[];
}

const QUIZZES: Record<string, QuizQuestion[]> = {
  budgeting: [
    {
      id: "budgeting-1",
      text: "A monthly budget is best described as a plan that…",
      options: [
        "Tracks only your debts",
        "Gives every dollar of income a job across spending, saving, and debt",
        "Is only needed when you fall behind on bills",
        "Replaces the need for an emergency fund",
      ],
      correctIndex: 1,
    },
    {
      id: "budgeting-2",
      text: "Which expense is a FIXED cost in most household budgets?",
      options: ["Groceries", "Rent or mortgage payment", "Dining out", "Gas for the car"],
      correctIndex: 1,
    },
    {
      id: "budgeting-3",
      text: "A common guideline for keeping housing affordable is to spend no more than about…",
      options: [
        "10% of gross monthly income on housing",
        "30% of gross monthly income on housing",
        "60% of gross monthly income on housing",
        "There is no guideline",
      ],
      correctIndex: 1,
    },
    {
      id: "budgeting-4",
      text: "The first step when your expenses are higher than your income is to…",
      options: [
        "Take out a payday loan",
        "Ignore it until next month",
        "Track spending to find and cut non-essential costs",
        "Stop paying your rent",
      ],
      correctIndex: 2,
    },
  ],
  "credit-basics": [
    {
      id: "credit-basics-1",
      text: "Which factor has the LARGEST impact on a typical credit score?",
      options: ["Payment history", "Number of credit cards", "Your income", "Your age"],
      correctIndex: 0,
    },
    {
      id: "credit-basics-2",
      text: "Credit utilization refers to…",
      options: [
        "How long you've had credit",
        "The share of your available revolving credit you're using",
        "How many times you check your score",
        "The interest rate on your loans",
      ],
      correctIndex: 1,
    },
    {
      id: "credit-basics-3",
      text: "How often can you get a free copy of your credit report from each major bureau?",
      options: ["Never", "Only if you pay", "At least once a year", "Once every five years"],
      correctIndex: 2,
    },
    {
      id: "credit-basics-4",
      text: "The best way to keep utilization low and protect your score is to…",
      options: [
        "Close old accounts",
        "Max out one card and pay the others",
        "Keep balances well below your limits and pay on time",
        "Apply for several new cards at once",
      ],
      correctIndex: 2,
    },
  ],
  mortgages: [
    {
      id: "mortgages-1",
      text: "In a fixed-rate mortgage, the interest rate…",
      options: [
        "Changes every year",
        "Stays the same for the life of the loan",
        "Is set by the buyer",
        "Only applies for the first month",
      ],
      correctIndex: 1,
    },
    {
      id: "mortgages-2",
      text: "Private mortgage insurance (PMI) is typically required when a buyer…",
      options: [
        "Puts down less than 20%",
        "Has a perfect credit score",
        "Buys a home in cash",
        "Uses a 15-year loan",
      ],
      correctIndex: 0,
    },
    {
      id: "mortgages-3",
      text: "A mortgage pre-approval is valuable because it…",
      options: [
        "Guarantees the lowest rate forever",
        "Shows sellers you're a serious, qualified buyer",
        "Is required to attend an open house",
        "Replaces the home inspection",
      ],
      correctIndex: 1,
    },
    {
      id: "mortgages-4",
      text: "Which of these is part of a typical monthly mortgage payment (PITI)?",
      options: [
        "Principal, interest, taxes, and insurance",
        "Only principal and interest",
        "Utilities and internet",
        "Real-estate agent commission",
      ],
      correctIndex: 0,
    },
  ],
  shopping: [
    {
      id: "shopping-1",
      text: "A buyer's agent primarily represents…",
      options: [
        "The seller's interests",
        "The lender's interests",
        "The buyer's interests in the transaction",
        "The county tax office",
      ],
      correctIndex: 2,
    },
    {
      id: "shopping-2",
      text: "Why is a professional home inspection important before buying?",
      options: [
        "It sets the sale price",
        "It identifies condition issues and needed repairs",
        "It is required to get a library card",
        "It replaces homeowners insurance",
      ],
      correctIndex: 1,
    },
    {
      id: "shopping-3",
      text: "An earnest money deposit is…",
      options: [
        "A fee paid to the inspector",
        "A good-faith deposit showing you're serious about an offer",
        "The same as your down payment tip",
        "A penalty for viewing too many homes",
      ],
      correctIndex: 1,
    },
  ],
  closing: [
    {
      id: "closing-1",
      text: "A Closing Disclosure must be provided to the buyer at least…",
      options: [
        "On the day of closing",
        "Three business days before closing",
        "One year before closing",
        "It is optional",
      ],
      correctIndex: 1,
    },
    {
      id: "closing-2",
      text: "Closing costs typically include…",
      options: [
        "Only the down payment",
        "Lender fees, title charges, and prepaid taxes/insurance",
        "Your monthly utility bills",
        "Furniture for the new home",
      ],
      correctIndex: 1,
    },
    {
      id: "closing-3",
      text: "At the final walkthrough before closing, the buyer should…",
      options: [
        "Sign the loan immediately without looking",
        "Confirm the home's condition and agreed repairs are done",
        "Negotiate a brand-new price",
        "Skip it to save time",
      ],
      correctIndex: 1,
    },
  ],
  "credit-repair": [
    {
      id: "credit-repair-1",
      text: "If you find an error on your credit report, you should…",
      options: [
        "Ignore it",
        "Dispute it with the credit bureau",
        "Close all your accounts",
        "Open a new card to offset it",
      ],
      correctIndex: 1,
    },
    {
      id: "credit-repair-2",
      text: "Which action most reliably rebuilds credit over time?",
      options: [
        "Making every payment on time",
        "Applying for many loans quickly",
        "Carrying high balances",
        "Paying a credit-repair company to 'erase' history",
      ],
      correctIndex: 0,
    },
    {
      id: "credit-repair-3",
      text: "Many down-payment-assistance programs require a minimum credit score around…",
      options: ["400", "500", "620–640", "800"],
      correctIndex: 2,
    },
  ],
  "loss-mitigation": [
    {
      id: "loss-mitigation-1",
      text: "If you're at risk of missing a mortgage payment, the best first step is to…",
      options: [
        "Stop opening mail from the servicer",
        "Contact your servicer or a HUD-approved counselor early",
        "Wait until foreclosure is filed",
        "Move out immediately",
      ],
      correctIndex: 1,
    },
    {
      id: "loss-mitigation-2",
      text: "A forbearance agreement generally allows a homeowner to…",
      options: [
        "Skip payments permanently with no repayment",
        "Temporarily pause or reduce payments during hardship",
        "Lower the home's purchase price",
        "Avoid ever contacting the servicer",
      ],
      correctIndex: 1,
    },
    {
      id: "loss-mitigation-3",
      text: "A loan modification changes…",
      options: [
        "The terms of your existing loan to make it affordable",
        "The address of your home",
        "Your credit score directly",
        "Your property taxes only",
      ],
      correctIndex: 0,
    },
  ],
};

/** Return the quiz for a module, or null if it has no test. */
export function getQuiz(moduleId: string): QuizQuestion[] | null {
  const mod = getModule(moduleId);
  if (!mod || !mod.hasTest) return null;
  return QUIZZES[moduleId] ?? null;
}

/** True when a module is testable and a quiz is authored for it. */
export function hasQuiz(moduleId: string): boolean {
  return getQuiz(moduleId) !== null;
}

/** Strip the answer key for sending to the browser. */
export function publicQuiz(questions: QuizQuestion[]): PublicQuizQuestion[] {
  return questions.map(({ id, text, options }) => ({ id, text, options }));
}

export interface QuizResult {
  score: number;
  correct: number;
  total: number;
  passed: boolean;
}

/** Score submitted answers (questionId → chosen option index) against the key. */
export function scoreQuiz(
  moduleId: string,
  answers: Record<string, number>,
): QuizResult | null {
  const questions = getQuiz(moduleId);
  if (!questions) return null;
  const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const score = Math.round((correct / questions.length) * 100);
  return {
    score,
    correct,
    total: questions.length,
    passed: score >= QUIZ_PASS_THRESHOLD,
  };
}
