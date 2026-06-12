import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { bulkImportParticipants } from "@/lib/participants/repository";
import { rowToParticipant, type ImportField } from "@/lib/participants/import";

export const maxDuration = 120;

/**
 * POST /api/participants/import — commit a mapped CSV.
 * Body: { rows: string[][], mapping: Record<number, ImportField | ""> }
 * `rows` are DATA rows only (header already stripped client-side).
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  try {
    const body = await request.json();
    const rows: string[][] = Array.isArray(body?.rows) ? body.rows : [];
    const mapping: Record<number, ImportField | ""> = body?.mapping ?? {};
    if (rows.length === 0) {
      return NextResponse.json({ error: "No rows to import." }, { status: 400 });
    }
    const inputs = rows.map((row) => rowToParticipant(row, mapping));
    const result = await bulkImportParticipants(user, inputs);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Import failed" },
      { status: 400 },
    );
  }
}
