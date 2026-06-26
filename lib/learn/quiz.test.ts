import { describe, it, expect } from "vitest";
import { dayPublicQuestions, scoreDay } from "@/lib/learn/quiz";
import { getQuiz, scoreQuiz } from "@/lib/participants/quiz";

/** Mirrors DAY_MODULES in quiz.ts — the curriculum banks each day test draws on. */
const DAY_MODULES: Record<string, string[]> = {
  "day-1": ["budgeting", "credit-basics"],
  "day-2": ["mortgages"],
  "day-3": ["shopping", "closing"],
  "day-4": [],
};
const DAYS = Object.keys(DAY_MODULES);

describe("day quiz scoring (scoreDay)", () => {
  it("public questions never expose the answer key", () => {
    for (const d of DAYS) {
      for (const q of dayPublicQuestions(d)) {
        expect(q).not.toHaveProperty("correctIndex");
      }
    }
  });

  it("an unknown day scores null", () => {
    expect(scoreDay("day-99", {})).toBeNull();
  });

  for (const d of DAYS) {
    it(`${d}: no answers => 0% and not passed, total matches public questions`, () => {
      const pub = dayPublicQuestions(d);
      const r = scoreDay(d, {})!;
      expect(r).not.toBeNull();
      expect(r.total).toBe(pub.length);
      expect(r.total).toBeGreaterThan(0);
      expect(r.correct).toBe(0);
      expect(r.score).toBe(0);
      expect(r.passed).toBe(false);
    });

    it(`${d}: correct module answers are scored correctly`, () => {
      const answers: Record<string, number> = {};
      let expectedCorrect = 0;
      for (const m of DAY_MODULES[d]) {
        for (const q of getQuiz(m) ?? []) {
          answers[q.id] = q.correctIndex;
          expectedCorrect++;
        }
      }
      const r = scoreDay(d, answers)!;
      expect(r.correct).toBe(expectedCorrect);
      expect(r.score).toBe(Math.round((expectedCorrect / r.total) * 100));
      expect(r.passed).toBe(r.score >= 70);
    });
  }
});

describe("module quiz scoring (scoreQuiz)", () => {
  it("perfect answers => 100 and passed", () => {
    const bank = getQuiz("budgeting")!;
    const answers = Object.fromEntries(bank.map((q) => [q.id, q.correctIndex]));
    const r = scoreQuiz("budgeting", answers)!;
    expect(r.score).toBe(100);
    expect(r.correct).toBe(bank.length);
    expect(r.passed).toBe(true);
  });

  it("all-wrong answers => 0 correct and not passed", () => {
    const bank = getQuiz("budgeting")!;
    const answers = Object.fromEntries(
      bank.map((q) => [q.id, (q.correctIndex + 1) % q.options.length]),
    );
    const r = scoreQuiz("budgeting", answers)!;
    expect(r.correct).toBe(0);
    expect(r.passed).toBe(false);
  });

  it("an unknown module scores null", () => {
    expect(scoreQuiz("not-a-module", {})).toBeNull();
  });
});
