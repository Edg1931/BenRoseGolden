import type { Referral } from "./schema";

/**
 * Consent gate for vulnerable-population data.
 *
 * Contact info (email/phone) must NEVER be shown or used unless the client has
 * given `consentToShare`. We strip it server-side so it is not even sent to the
 * browser when consent is absent — redaction is not a CSS/`hidden` concern.
 */

export type RedactedReferral = Referral & {
  /** True when contact info was withheld because consent is missing. */
  contactWithheld: boolean;
};

export function redactReferral(referral: Referral): RedactedReferral {
  if (referral.consentToShare && referral.contact) {
    return { ...referral, contactWithheld: false };
  }
  // Drop the contact object entirely when consent is missing.
  const { contact: _omit, ...rest } = referral;
  return { ...rest, contactWithheld: Boolean(referral.contact) && !referral.consentToShare };
}

export function redactReferrals(referrals: Referral[]): RedactedReferral[] {
  return referrals.map(redactReferral);
}

/**
 * Guard for any code path that intends to *use* contact info (e.g. emailing).
 * Throws rather than silently leaking, so a missing consent check fails loudly.
 */
export function assertContactUsable(referral: Referral): ReferralContactUsable {
  if (!referral.consentToShare || !referral.contact) {
    throw new Error(
      `Cannot use contact info for referral ${referral.id}: consentToShare is required.`,
    );
  }
  return { id: referral.id, contact: referral.contact };
}

interface ReferralContactUsable {
  id: string;
  contact: NonNullable<Referral["contact"]>;
}
