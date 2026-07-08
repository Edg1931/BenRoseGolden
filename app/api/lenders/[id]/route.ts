import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { isGoldenSide } from "@/lib/auth/roles";
import { updateLender } from "@/lib/lenders/repository";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!isGoldenSide(user) && user.role !== "benjamin-rose") {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const lender = await updateLender(id, body);
    return NextResponse.json({ id: lender.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: message.includes("not found") ? 404 : 400 });
  }
}
