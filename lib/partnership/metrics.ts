import type { Participant } from "@/lib/participants/schema";
import {
  BLOCKER_REASON_LABELS,
  type BlockerReason,
  type Referral,
} from "@/lib/referrals/schema";

/**
 * Partnership metrics: the end-to-end story board members care about. It stitches
 * Benjamin Rose's class funnel (from the participant CRM) together with The Golden
 * Group's referral pipeline (from the referral tracker) into ONE funnel, and adds
 * the money generated and the give-back to Benjamin Rose, plus where people stall.
 *
 * The two datasets are joined conceptually (participants flow into referrals once
 * handed off); counts come from whichever system owns that step.
 */

export interface FunnelStep {
  key: string;
  label: string;
  count: number;
  /** Conversion from the previous step, 0–1 (null for the first step). */
  fromPrev: number | null;
  /** Conversion from the very top of the funnel, 0–1. */
  fromTop: number | null;
  /** Which partner owns this step. */
  owner: "benjamin-rose" | "golden-group";
}

export interface Money {
  closes: number;
  totalSaleVolume: number;
  totalCommission: number;
  /** Give-back to Benjamin Rose that has actually been remitted. */
  brContributionPaid: number;
  /** Give-back pledged from deals not yet remitted (closed-unpaid + under-contract). */
  brContributionPledged: number;
  brContributionTotal: number;
  avgContributionPerClose: number;
  /** Under-contract deals not yet closed: expected volume + expected give-back. */
  pipelineVolume: number;
  pipelineBrContribution: number;
}

export interface Obstacle {
  key: string;
  label: string;
  count: number;
}

export interface PartnershipReport {
  funnel: FunnelStep[];
  money: Money;
  obstacles: Obstacle[];
  /** Headline conversions for the KPI row. */
  signUpToClose: number; // top of funnel → closed
  graduateToReferral: number; // graduated → handed off
  referralToClose: number; // handed off → closed
}

function pct(n: number, d: number): number | null {
  return d === 0 ? null : n / d;
}

/** Has this participant actually started the classes (any module touched or past lead)? */
function startedClass(p: Participant): boolean {
  return p.stage !== "lead" || p.moduleProgress.length > 0;
}

function graduated(p: Participant): boolean {
  return (
    p.stage === "graduated" ||
    p.stage === "referred" ||
    p.certificates.some((c) => c.phase === "pre-purchase") ||
    p.moduleProgress.filter((m) => m.status === "completed").length >= 5
  );
}

export function computePartnershipReport(
  participants: Participant[],
  referrals: Referral[],
): PartnershipReport {
  // ── Benjamin Rose class funnel (from the participant CRM) ──
  const signedUp = participants.length;
  const started = participants.filter(startedClass).length;
  const grads = participants.filter(graduated).length;

  // ── Golden Group referral pipeline (from the referral tracker) ──
  const PIPELINE_ORDER = ["referred", "contacted", "home-search", "under-contract", "closed"];
  const rank = (stage: string) => PIPELINE_ORDER.indexOf(stage);
  const handedOff = referrals.length;
  // "Agent engaged" = progressed past the initial hand-off (contacted or further).
  const activelyContacted = referrals.filter((r) => rank(r.stage) >= 1).length;
  const underContract = referrals.filter((r) => r.stage === "under-contract" || r.stage === "closed").length;
  const closed = referrals.filter((r) => r.stage === "closed").length;

  const funnel: FunnelStep[] = [
    { key: "signed-up", label: "Signed up", count: signedUp, owner: "benjamin-rose", fromPrev: null, fromTop: null },
    { key: "started", label: "Started classes", count: started, owner: "benjamin-rose", fromPrev: pct(started, signedUp), fromTop: pct(started, signedUp) },
    { key: "graduated", label: "Graduated", count: grads, owner: "benjamin-rose", fromPrev: pct(grads, started), fromTop: pct(grads, signedUp) },
    { key: "referred", label: "Handed off to Golden Group", count: handedOff, owner: "golden-group", fromPrev: pct(handedOff, grads), fromTop: pct(handedOff, signedUp) },
    { key: "contacted", label: "Agent engaged", count: activelyContacted, owner: "golden-group", fromPrev: pct(activelyContacted, handedOff), fromTop: pct(activelyContacted, signedUp) },
    { key: "under-contract", label: "Under contract", count: underContract, owner: "golden-group", fromPrev: pct(underContract, activelyContacted), fromTop: pct(underContract, signedUp) },
    { key: "closed", label: "Closed 🎉", count: closed, owner: "golden-group", fromPrev: pct(closed, underContract), fromTop: pct(closed, signedUp) },
  ];

  // ── Money ──
  let totalSaleVolume = 0, totalCommission = 0, brPaid = 0, brPledged = 0;
  let pipelineVolume = 0, pipelineBrContribution = 0;
  for (const r of referrals) {
    const d = r.deal;
    if (!d) continue;
    if (r.stage === "closed") {
      totalSaleVolume += d.salePrice ?? 0;
      totalCommission += d.commissionAmount ?? 0;
      if (d.contributionPaid) brPaid += d.benjaminRoseContribution ?? 0;
      else brPledged += d.benjaminRoseContribution ?? 0;
    } else if (r.stage === "under-contract") {
      pipelineVolume += d.salePrice ?? 0;
      pipelineBrContribution += d.benjaminRoseContribution ?? 0;
      if (!d.contributionPaid) brPledged += d.benjaminRoseContribution ?? 0;
    }
  }

  const money: Money = {
    closes: closed,
    totalSaleVolume,
    totalCommission,
    brContributionPaid: brPaid,
    brContributionPledged: brPledged,
    brContributionTotal: brPaid + brPledged,
    avgContributionPerClose: closed ? Math.round((brPaid + brPledged) / closed) : 0,
    pipelineVolume,
    pipelineBrContribution,
  };

  // ── Obstacles: where people fall out, both sides of the funnel ──
  const obstacleCounts = new Map<string, number>();
  const add = (key: string, n = 1) => obstacleCounts.set(key, (obstacleCounts.get(key) ?? 0) + n);

  // Class-side: signed up but never started; started but stalled before graduating.
  const neverStarted = participants.filter((p) => !startedClass(p)).length;
  if (neverStarted) add("never-started", neverStarted);
  const stalledInClass = participants.filter(
    (p) => startedClass(p) && !graduated(p) && p.stage !== "inactive",
  ).length;
  if (stalledInClass) add("stalled-in-class", stalledInClass);
  const inactive = participants.filter((p) => p.stage === "inactive").length;
  if (inactive) add("inactive", inactive);

  // Referral-side: explicit blocker reasons on stalled/declined referrals.
  for (const r of referrals) {
    if (r.blockerReason) add(`ref:${r.blockerReason}`, 1);
  }

  const OBSTACLE_LABELS: Record<string, string> = {
    "never-started": "Signed up, never started classes",
    "stalled-in-class": "Started but stalled in classes",
    inactive: "Went inactive",
  };

  const obstacles: Obstacle[] = [...obstacleCounts.entries()]
    .map(([key, count]) => {
      const label = key.startsWith("ref:")
        ? BLOCKER_REASON_LABELS[key.slice(4) as BlockerReason]
        : OBSTACLE_LABELS[key] ?? key;
      return { key, label, count };
    })
    .sort((a, b) => b.count - a.count);

  return {
    funnel,
    money,
    obstacles,
    signUpToClose: pct(closed, signedUp) ?? 0,
    graduateToReferral: pct(handedOff, grads) ?? 0,
    referralToClose: pct(closed, handedOff) ?? 0,
  };
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function formatPct(rate: number | null): string {
  return rate == null ? "—" : `${Math.round(rate * 100)}%`;
}
