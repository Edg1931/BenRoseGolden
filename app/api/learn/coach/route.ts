import { NextResponse } from "next/server";
import { askCoach, type CoachMessage } from "@/lib/learn/coach";
import { LEARN_LANGS, type LearnLang } from "@/lib/learn/content";

export const maxDuration = 60;

/**
 * Public "Ask AI Coach" endpoint for the Day 1 learner course. Grounded in the
 * Day 1 material server-side; works with or without an ANTHROPIC_API_KEY.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      question?: string;
      history?: CoachMessage[];
      lang?: string;
    };
    const question = body.question?.trim();
    if (!question) {
      return NextResponse.json({ error: "A question is required." }, { status: 400 });
    }
    const lang: LearnLang = LEARN_LANGS.includes(body.lang as LearnLang)
      ? (body.lang as LearnLang)
      : "en";
    const history = Array.isArray(body.history) ? body.history : [];

    const reply = await askCoach(question, history, lang);
    return NextResponse.json(reply);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Coach is unavailable right now." },
      { status: 500 },
    );
  }
}
