import { NextResponse } from "next/server";
import { signInLearner, LearnerAuthError } from "@/lib/learn/accounts";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const learner = await signInLearner(String(email ?? ""), String(password ?? ""));
    return NextResponse.json({ id: learner.id, firstName: learner.firstName });
  } catch (err) {
    const status = err instanceof LearnerAuthError ? 400 : 500;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sign-in failed" },
      { status },
    );
  }
}
