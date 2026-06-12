import {
  REFERRAL_STAGES,
  type Referral,
  type ReferralStage,
} from "./schema";

export interface PipelineMetrics {
  total: number;
  byStage: Record<ReferralStage, number>;
  graduates: number; // certificate completed
  referredCount: number; // total referrals (the funnel entry)
  closedCount: number;
  /** graduate → close rate, 0–1. Of those who completed the program, how many closed. */
  graduateToCloseRate: number;
  /** referral → close rate, 0–1. Of all referrals, how many closed. */
  referralToCloseRate: number;
}

export function computeMetrics(referrals: Referral[]): PipelineMetrics {
  const byStage = Object.fromEntries(
    REFERRAL_STAGES.map((s) => [s, 0]),
  ) as Record<ReferralStage, number>;

  let graduates = 0;
  let closedCount = 0;
  let graduatesClosed = 0;

  for (const r of referrals) {
    byStage[r.stage] += 1;
    if (r.stage === "closed") closedCount += 1;
    if (r.certificateCompleted) {
      graduates += 1;
      if (r.stage === "closed") graduatesClosed += 1;
    }
  }

  const total = referrals.length;

  return {
    total,
    byStage,
    graduates,
    referredCount: total,
    closedCount,
    graduateToCloseRate: graduates === 0 ? 0 : graduatesClosed / graduates,
    referralToCloseRate: total === 0 ? 0 : closedCount / total,
  };
}

export function formatRate(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
