import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { isGoldenSide } from "@/lib/auth/roles";
import { draftCampaign } from "@/lib/content/agent";

export const maxDuration = 120;

export async function POST(request: Request) {
  const user = await getCurrentUser();
  // BR staff and Golden side can draft; leads cannot reach this route anyway.
  if (!isGoldenSide(user) && user.role !== "benjamin-rose") {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }
  try {
    const body = await request.json();
    if (!body?.topic || !body?.type) {
      return NextResponse.json({ error: "topic and type are required." }, { status: 400 });
    }
    const result = await draftCampaign({
      type: body.type,
      topic: body.topic,
      audience: body.audience ?? {},
      language: body.language ?? "en",
      highlights: body.highlights,
      instructions: body.instructions,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Draft failed" },
      { status: 500 },
    );
  }
}
