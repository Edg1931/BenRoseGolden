import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getParticipant, updateParticipant } from "@/lib/participants/repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();
  const participant = await getParticipant(user, id);
  if (!participant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ participant });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();
  try {
    const body = await request.json();
    const updated = await updateParticipant(user, id, body);
    return NextResponse.json({ participant: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
