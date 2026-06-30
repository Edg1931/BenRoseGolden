import { NextResponse } from "next/server";
import { getCurrentLearner, updateLearnerProfile, LearnerAuthError } from "@/lib/learn/accounts";
import { CREDIT_BANDS } from "@/lib/participants/schema";

/** The learner updates their own financial snapshot (optional fields). */
export async function PATCH(request: Request) {
  try {
    const learner = await getCurrentLearner();
    if (!learner) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

    const b = await request.json();
    const creditBand = CREDIT_BANDS.includes(b.creditBand) ? b.creditBand : learner.household.creditBand;

    const updated = await updateLearnerProfile({
      phone: typeof b.phone === "string" ? b.phone.trim() || undefined : learner.phone,
      address: {
        ...learner.address,
        city: typeof b.city === "string" ? b.city.trim() || undefined : learner.address?.city,
        county: typeof b.county === "string" ? b.county.trim() || undefined : learner.address?.county,
        state: "OH",
      },
      household: {
        ...learner.household,
        size: num(b.householdSize) ?? learner.household.size,
        annualIncome: num(b.annualIncome) ?? learner.household.annualIncome,
        creditBand,
        firstTimeBuyer:
          typeof b.firstTimeBuyer === "boolean" ? b.firstTimeBuyer : learner.household.firstTimeBuyer,
      },
    });
    return NextResponse.json({ ok: true, household: updated.household });
  } catch (err) {
    const status = err instanceof LearnerAuthError ? 400 : 500;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status },
    );
  }
}

function num(v: unknown): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}
