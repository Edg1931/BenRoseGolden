import { NextResponse } from "next/server";
import { startDemoSession } from "@/lib/learn/accounts";
import { DEMO_LEARNER_IDS, type DemoPersona } from "@/lib/learn/demo";

/**
 * Enter the client experience as a sample learner, for demonstrations.
 *
 * Only the two fabricated personas are accepted — anything else is rejected, so
 * this can never be used to enter a real learner's account.
 */
export async function POST(request: Request) {
  const { persona } = await request.json().catch(() => ({ persona: null }));

  if (typeof persona !== "string" || !(persona in DEMO_LEARNER_IDS)) {
    return NextResponse.json({ error: "Unknown demo persona." }, { status: 400 });
  }

  const learner = await startDemoSession(persona as DemoPersona);
  if (!learner) {
    return NextResponse.json({ error: "Demo learner is unavailable." }, { status: 404 });
  }

  return NextResponse.json({ firstName: learner.firstName, id: learner.id });
}
