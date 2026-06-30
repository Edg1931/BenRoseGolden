import { NextResponse } from "next/server";
import { recordDayPass } from "@/lib/learn/accounts";

/**
 * Persist a passed day test to the signed-in learner's CRM record. No-op for
 * anonymous visitors (they still keep local progress), so it's always safe to call.
 */
export async function POST(request: Request) {
  try {
    const { daySlug, score, certificateId } = await request.json();
    if (typeof daySlug !== "string" || typeof score !== "number") {
      return NextResponse.json({ error: "daySlug and score are required." }, { status: 400 });
    }
    const learner = await recordDayPass(daySlug, score, certificateId ?? null);
    return NextResponse.json({ saved: Boolean(learner) });
  } catch {
    // Never let progress-saving break the learner's flow.
    return NextResponse.json({ saved: false });
  }
}
