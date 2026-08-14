import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { isGoldenSide } from "@/lib/auth/roles";
import { draftCampaign, toSponsorProfile } from "@/lib/content/agent";
import { renderNewsletterHtml } from "@/lib/content/newsletter";
import { listLenders } from "@/lib/lenders/repository";

export const maxDuration = 120;

/**
 * Draft a campaign. For newsletters this returns a DESIGNED issue: the
 * structured document, the rendered email HTML (for live preview), and a
 * plain-text body. `sponsorIds` selects partner lenders to promote — their
 * names, offers, and amounts are passed to the writer verbatim from the
 * directory, never invented.
 */
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

    let sponsors;
    if (Array.isArray(body.sponsorIds) && body.sponsorIds.length > 0) {
      const lenders = await listLenders();
      sponsors = lenders
        .filter((l) => body.sponsorIds.includes(l.id))
        .map(toSponsorProfile);
    }

    const result = await draftCampaign({
      type: body.type,
      topic: body.topic,
      audience: body.audience ?? {},
      language: body.language ?? "en",
      highlights: body.highlights,
      instructions: body.instructions,
      sources: Array.isArray(body.sources) ? body.sources : undefined,
      sponsors,
    });

    return NextResponse.json({
      ...result,
      html: result.design ? renderNewsletterHtml(result.design) : undefined,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Draft failed" },
      { status: 500 },
    );
  }
}
