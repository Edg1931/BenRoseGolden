import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createCampaign, listCampaigns, resolveAudience } from "@/lib/content/store";
import { listParticipants } from "@/lib/participants/repository";

export async function GET() {
  const user = await getCurrentUser();
  const participants = await listParticipants(user);
  const campaigns = listCampaigns().map((c) => ({
    ...c,
    reach: resolveAudience(c.audience, participants).total,
  }));
  return NextResponse.json({ campaigns });
}

export async function POST(request: Request) {
  await getCurrentUser();
  try {
    const body = await request.json();
    const campaign = createCampaign(body);
    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid request" },
      { status: 400 },
    );
  }
}
