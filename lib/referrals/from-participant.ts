import type { Participant } from "@/lib/participants/schema";
import type { CreateReferralInput } from "./schema";
import { insertReferralSystem } from "./repository";

/**
 * Zero-manual-entry link between the two systems: when a Benjamin Rose client
 * reaches "graduated" AND has consented to share, we automatically create the
 * privacy-safe Golden Group referral (first name + last initial only; contact
 * flows through the same consent gate) and link it back to the participant.
 */

export function isReferralEligible(p: Participant): boolean {
  return (
    p.consentToShare &&
    !p.referralId &&
    (p.stage === "graduated" || p.stage === "referred")
  );
}

function toIso(d?: string): string | undefined {
  if (!d) return undefined;
  const t = new Date(d.length === 10 ? `${d}T00:00:00.000Z` : d);
  return Number.isNaN(t.getTime()) ? undefined : t.toISOString();
}

export function mapParticipantToReferral(p: Participant): CreateReferralInput {
  const lastInitial = (p.lastName?.trim().charAt(0) || p.firstName.trim().charAt(0) || "?").toUpperCase();
  const programType = p.tracks.includes("foreclosure-prevention") ? "foreclosure" : "homebuyer-ed";
  const latestCert = [...p.certificates].sort((a, b) => b.issuedDate.localeCompare(a.issuedDate))[0];
  return {
    firstName: p.firstName,
    lastInitial,
    contact: p.email || p.phone ? { email: p.email, phone: p.phone } : undefined,
    source: p.org === "esop" ? "esop" : "benjamin-rose",
    programType,
    certificateCompleted: p.certificates.length > 0,
    certificateDate: toIso(latestCert?.issuedDate),
    consentToShare: p.consentToShare,
    consentDate: toIso(p.consentDate),
    stage: "referred",
    notes: "Auto-created when the client graduated and consented to share.",
  };
}

/**
 * If the participant just became eligible, create the linked referral and return
 * its id (or null). Best-effort: never throws, so it can't break a save.
 */
export async function autoCreateReferral(p: Participant): Promise<string | null> {
  if (!isReferralEligible(p)) return null;
  try {
    const ref = await insertReferralSystem(mapParticipantToReferral(p));
    return ref.id;
  } catch {
    return null;
  }
}
