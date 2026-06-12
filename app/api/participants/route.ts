import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createParticipant, listParticipants } from "@/lib/participants/repository";
import { computeCrmMetrics } from "@/lib/participants/metrics";

export async function GET() {
  const user = await getCurrentUser();
  const participants = await listParticipants(user);
  return NextResponse.json({
    participants,
    metrics: computeCrmMetrics(participants),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  try {
    const body = await request.json();
    const created = await createParticipant(user, body);
    return NextResponse.json({ participant: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid request" },
      { status: 400 },
    );
  }
}
