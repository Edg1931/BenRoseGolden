import { NextResponse } from "next/server";
import { signUpLearner, LearnerAuthError } from "@/lib/learn/accounts";
import { CREDIT_BANDS } from "@/lib/participants/schema";
import { LANGUAGES, TRACKS } from "@/lib/participants/curriculum";

/** Create a learner account + CRM lead from the public classes sign-up form. */
export async function POST(request: Request) {
  try {
    const b = await request.json();

    const creditBand = CREDIT_BANDS.includes(b.creditBand) ? b.creditBand : undefined;
    const preferredLanguage = LANGUAGES.includes(b.preferredLanguage) ? b.preferredLanguage : "en";
    const tracks = Array.isArray(b.tracks) ? b.tracks.filter((t: string) => TRACKS.includes(t as never)) : [];

    const household = {
      size: numeric(b.householdSize),
      annualIncome: numeric(b.annualIncome),
      creditBand: creditBand ?? "unknown",
      firstTimeBuyer: typeof b.firstTimeBuyer === "boolean" ? b.firstTimeBuyer : undefined,
    };
    const address =
      b.city || b.county ? { city: str(b.city), county: str(b.county), state: "OH" } : undefined;

    const learner = await signUpLearner({
      email: String(b.email ?? ""),
      password: String(b.password ?? ""),
      firstName: String(b.firstName ?? ""),
      lastName: str(b.lastName),
      phone: str(b.phone),
      preferredLanguage,
      address,
      household,
      tracks,
    });

    return NextResponse.json({ id: learner.id, firstName: learner.firstName });
  } catch (err) {
    const status = err instanceof LearnerAuthError ? 400 : 500;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sign-up failed" },
      { status },
    );
  }
}

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
function numeric(v: unknown): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}
