import { NextResponse } from "next/server";
import { loadAllPrograms } from "@/lib/programs/sources";
import { matchPrograms, type BuyerProfile } from "@/lib/programs/matching";
import { ASSISTANCE_TYPE_LABELS } from "@/lib/programs/schema";

export const maxDuration = 30;

/**
 * Public program matcher for the self-serve assistance finder. Takes the
 * buyer's answers, runs the same matching engine the staff tool uses, and
 * returns ranked, plain-language results trimmed to what the UI needs.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<BuyerProfile>;
    const buyer: BuyerProfile = {
      county: typeof body.county === "string" ? body.county.toLowerCase().trim() : undefined,
      city: typeof body.city === "string" ? body.city.toLowerCase().trim() : undefined,
      firstTimeBuyer: body.firstTimeBuyer !== false,
      householdSize: Math.min(8, Math.max(1, Number(body.householdSize) || 1)),
      householdIncome: Math.max(0, Number(body.householdIncome) || 0),
      occupation: typeof body.occupation === "string" ? body.occupation : undefined,
      estimatedCredit: Math.max(0, Number(body.estimatedCredit) || 0),
      completedHomebuyerEd: body.completedHomebuyerEd === true,
      targetPurchasePrice:
        typeof body.targetPurchasePrice === "number" && body.targetPurchasePrice > 0
          ? body.targetPurchasePrice
          : undefined,
    };

    const programs = await loadAllPrograms();
    const results = matchPrograms(programs, buyer).map((r) => ({
      id: r.program.id,
      name: r.program.name,
      provider: r.program.provider,
      level: r.program.level,
      amount: r.program.amount,
      assistanceType: ASSISTANCE_TYPE_LABELS[r.program.assistanceType],
      repayment: r.program.repayment ?? null,
      requiresHomebuyerEd: r.program.requiresHomebuyerEd === true,
      lastVerified: r.program.lastVerified,
      reasons: r.reasons,
      caveats: r.caveats,
      unlockedByCertificate: r.unlockedByCertificate,
      nextStep: r.nextStep,
      link: r.link,
    }));

    return NextResponse.json({
      totalPrograms: programs.length,
      matches: results,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not match programs" },
      { status: 400 },
    );
  }
}
