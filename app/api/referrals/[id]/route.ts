import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getReferral,
  updateReferral,
  ForbiddenError,
  NotFoundError,
} from "@/lib/referrals/repository";
import { redactReferral } from "@/lib/referrals/redaction";
import { allowedEditFields } from "@/lib/auth/roles";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();
  const referral = await getReferral(user, id);
  if (!referral) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    referral: redactReferral(referral),
    permissions: { editable: allowedEditFields(user, referral) },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();
  try {
    const body = await request.json();
    const updated = await updateReferral(user, id, body);
    return NextResponse.json({ referral: redactReferral(updated) });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid request" },
      { status: 400 },
    );
  }
}
