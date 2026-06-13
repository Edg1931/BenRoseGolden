/**
 * Interactive "podcast" scripts for Day 1 — two friendly hosts talking through
 * each module conversationally. Played in the browser with two alternating
 * voices; the learner can pause at any line and ask the AI Coach a question
 * (NotebookLM-style), then resume.
 *
 * Authored in English for natural two-host audio (interactive podcast audio is
 * English-only for now, like the tools that inspired it); the written lessons
 * and quiz remain fully trilingual.
 */

export type Host = "maya" | "devon";

export interface PodcastLine {
  speaker: Host;
  text: string;
}

export interface PodcastEpisode {
  /** Matches a Day 1 lesson `section`. */
  section: "budgeting" | "credit-basics";
  title: string;
  blurb: string;
  lines: PodcastLine[];
}

export const HOST_LABELS: Record<Host, string> = {
  maya: "Maya",
  devon: "Devon",
};

export const DAY1_PODCAST: PodcastEpisode[] = [
  {
    section: "budgeting",
    title: "Money Management & Budgeting",
    blurb: "Maya and Devon talk through budgets, expenses, and good money habits.",
    lines: [
      { speaker: "maya", text: "Welcome back to Home Ready, the show that gets you to your front door. I'm Maya." },
      { speaker: "devon", text: "And I'm Devon. Today we're talking money management — the foundation of buying a home." },
      { speaker: "maya", text: "Let's start simple. A budget. People hear that word and tense up." },
      { speaker: "devon", text: "Right, but a budget is just a spending plan. It gives every dollar of your income a job before the month begins — needs, bills, saving, and paying down debt." },
      { speaker: "maya", text: "So instead of wondering where your money went, you decide where it goes." },
      { speaker: "devon", text: "Exactly. And it starts with two numbers: money coming in, and money going out." },
      { speaker: "maya", text: "Let's break down the going-out part, because not all expenses are the same." },
      { speaker: "devon", text: "Good point. Fixed expenses stay the same each month — your rent or mortgage, a car payment, insurance. Variable expenses change — groceries, gas, utilities." },
      { speaker: "maya", text: "And some surprise you, like a car repair. Those are the irregular ones that wreck a budget if you're not ready." },
      { speaker: "devon", text: "That's why writing every expense down matters. People are always shocked how much the small, regular stuff adds up." },
      { speaker: "maya", text: "Here's a number worth remembering: try to keep housing costs around 30 percent of your gross monthly income." },
      { speaker: "devon", text: "Gross meaning before taxes. Stay near that 30 percent line and the rest of your budget stays healthy." },
      { speaker: "maya", text: "What about when money's just tight, Devon?" },
      { speaker: "devon", text: "Don't ignore it — that's how debt grows. Track your spending, cut the non-essentials, and remember free financial counseling can help you build a plan." },
      { speaker: "maya", text: "And good habits make it stick: a shopping list, avoiding your spending triggers, an accountability partner." },
      { speaker: "devon", text: "Habits, not income alone, decide whether you hit your savings goal. That's the whole game." },
      { speaker: "maya", text: "If any of that raised a question, pause us and ask the Coach. Otherwise — on to credit." },
    ],
  },
  {
    section: "credit-basics",
    title: "Understanding Credit",
    blurb: "The hosts demystify credit reports, scores, and how to build credit.",
    lines: [
      { speaker: "devon", text: "Okay Maya, credit. This is the one that makes people nervous." },
      { speaker: "maya", text: "It doesn't have to. Let's start with the credit report — what even is it?" },
      { speaker: "devon", text: "It's a record of how you've borrowed and repaid money. Your loans, credit cards, payment history, balances — all of it." },
      { speaker: "maya", text: "And three big companies collect that: Equifax, Experian, and TransUnion. The credit bureaus." },
      { speaker: "devon", text: "Here's a tip everyone should use: you can get a free copy from each bureau at least once a year at AnnualCreditReport.com." },
      { speaker: "maya", text: "And checking your own report does not hurt your score. A lot of people don't know that." },
      { speaker: "devon", text: "Now the score itself — that number from roughly 300 to 850. What moves it the most?" },
      { speaker: "maya", text: "Payment history. By far the biggest factor. Paying every bill on time, every time." },
      { speaker: "devon", text: "Number two is credit utilization — how much of your available credit you're actually using. Keep those balances well below your limits." },
      { speaker: "maya", text: "After that it's the length of your history, your mix of credit types, and recent inquiries." },
      { speaker: "devon", text: "And notice what's NOT on there — your income, your age, your race. Those can't be used to judge your credit." },
      { speaker: "maya", text: "So if I want to build credit, what's the playbook?" },
      { speaker: "devon", text: "Pay on time — set up autopay. Keep utilization low. Don't apply for a bunch of new credit at once. Keep older accounts open. And check your report for errors." },
      { speaker: "maya", text: "And dispute anything that's wrong with the bureau directly." },
      { speaker: "devon", text: "Why does this matter so much? Many down-payment-assistance programs want a score around 620 to 640." },
      { speaker: "maya", text: "Steady habits get you there. That's your ticket to real help buying a home." },
      { speaker: "devon", text: "Got a question rattling around? Hit pause and ask the Coach. You've got this." },
    ],
  },
];

export function episodeFor(section: PodcastEpisode["section"]): PodcastEpisode | undefined {
  return DAY1_PODCAST.find((e) => e.section === section);
}
