import { amiPercentForIncome } from "@/lib/programs/ami";
import type { Participant } from "./schema";

/**
 * Fill in the fields staff shouldn't have to compute by hand.
 *
 * Right now that's `% of AMI` — derived from county + household size + income
 * via the HUD table. Applied on every write path (single add, mass import,
 * staff edit, learner self-service) so the eligibility engine always has it,
 * regardless of how the record got here.
 *
 * An explicitly entered `amiPercent` always wins: if someone typed a number
 * from an official determination letter, we never overwrite it.
 */
export function withDerivedFields(p: Participant): Participant {
  const { household, address } = p;
  if (household.amiPercent != null) return p;

  const county = address?.county;
  const income = household.annualIncome;
  if (!county || income == null || income <= 0) return p;

  const percent = amiPercentForIncome(county, household.size ?? 1, income);
  if (percent == null || percent > 300) return p;

  return { ...p, household: { ...household, amiPercent: percent } };
}

/**
 * Re-derive after an edit. When the incoming patch touched the household but
 * left `% of AMI` blank, the stored value is a stale derivation — drop it and
 * recompute from the new income/county/size rather than keeping an old number.
 */
export function refreshDerivedFields(p: Participant, recomputeAmi: boolean): Participant {
  const base = recomputeAmi
    ? { ...p, household: { ...p.household, amiPercent: undefined } }
    : p;
  return withDerivedFields(base);
}
