import { NextResponse } from "next/server";
import { signOutLearner } from "@/lib/learn/accounts";

export async function POST() {
  await signOutLearner();
  return NextResponse.json({ ok: true });
}
