import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getCampaign } from "@/lib/content/store";
import { dispatchNewsletter, DispatchError } from "@/lib/content/dispatch";

/**
 * Send a newsletter campaign to its targeted audience. Delivery logic lives in
 * lib/content/dispatch.ts (shared with the monthly automation).
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();
  try {
    const campaign = await getCampaign(id);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    const result = await dispatchNewsletter(user, campaign);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof DispatchError) {
      return NextResponse.json(
        { error: err.message, wouldReach: err.wouldReach },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Send failed" },
      { status: 500 },
    );
  }
}
