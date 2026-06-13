import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { scoreDay } from "@/lib/learn/quiz";
import { getDay } from "@/lib/learn/course";

/**
 * Public day-test scoring for the self-serve learner course. No auth and no
 * database write — the learner isn't yet a tracked participant — but scoring
 * happens server-side so answer keys never reach the browser. Returns a
 * certificate id only on a passing score.
 */
export async function POST(request: Request) {
  try {
    const { answers, day } = (await request.json()) as {
      answers?: Record<string, number>;
      day?: string;
    };
    if (typeof answers !== "object" || answers == null) {
      return NextResponse.json({ error: "answers are required" }, { status: 400 });
    }
    const daySlug = typeof day === "string" && getDay(day) ? day : "day-1";

    const result = scoreDay(daySlug, answers);
    if (!result) {
      return NextResponse.json({ error: "Unknown day" }, { status: 404 });
    }

    const dayNum = daySlug.replace("day-", "");
    const certificateId = result.passed
      ? `BR-D${dayNum}-${randomUUID().slice(0, 8).toUpperCase()}`
      : null;

    return NextResponse.json({ result, certificateId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
