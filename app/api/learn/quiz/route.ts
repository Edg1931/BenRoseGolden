import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { scoreDay1 } from "@/lib/learn/quiz";

/**
 * Public Day 1 test scoring for the self-serve learner course. No auth and no
 * database write — the learner isn't yet a tracked participant — but scoring
 * still happens server-side so the answer key never reaches the browser.
 * Returns a certificate id only on a passing score.
 */
export async function POST(request: Request) {
  try {
    const { answers } = (await request.json()) as {
      answers?: Record<string, number>;
    };
    if (typeof answers !== "object" || answers == null) {
      return NextResponse.json({ error: "answers are required" }, { status: 400 });
    }

    const result = scoreDay1(answers);
    const certificateId = result.passed
      ? `BR-D1-${randomUUID().slice(0, 8).toUpperCase()}`
      : null;

    return NextResponse.json({ result, certificateId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
