import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { isGoldenSide } from "@/lib/auth/roles";
import { createLender } from "@/lib/lenders/repository";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!isGoldenSide(user) && user.role !== "benjamin-rose") {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }
  try {
    const body = await request.json();
    const lender = await createLender(body);
    return NextResponse.json({ id: lender.id });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Create failed" }, { status: 400 });
  }
}
