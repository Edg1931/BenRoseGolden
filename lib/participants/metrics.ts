import {
  LANGUAGE_LABELS,
  TRACK_LABELS,
  type LanguageCode,
  type Track,
} from "./curriculum";
import {
  PARTICIPANT_STAGES,
  type Participant,
  type ParticipantStage,
} from "./schema";
import { hasCompletedPrePurchase } from "./eligibility";

export interface CrmMetrics {
  total: number;
  byStage: Record<ParticipantStage, number>;
  graduates: number;
  referred: number;
  /** enroll → graduate rate. */
  graduationRate: number;
  /** graduate → referred rate. */
  referralRate: number;
  atRisk: number; // foreclosure-prevention track
  needsCredit: number; // credit-repair track
  byLanguage: { language: LanguageCode; label: string; count: number }[];
  byTrack: { track: Track; label: string; count: number }[];
  consentedShare: number;
}

export function computeCrmMetrics(participants: Participant[]): CrmMetrics {
  const byStage = Object.fromEntries(
    PARTICIPANT_STAGES.map((s) => [s, 0]),
  ) as Record<ParticipantStage, number>;

  const langCounts = new Map<LanguageCode, number>();
  const trackCounts = new Map<Track, number>();
  let graduates = 0;
  let referred = 0;
  let enrolledOrBeyond = 0;
  let atRisk = 0;
  let needsCredit = 0;
  let consentedShare = 0;

  for (const p of participants) {
    byStage[p.stage] += 1;
    langCounts.set(p.preferredLanguage, (langCounts.get(p.preferredLanguage) ?? 0) + 1);
    for (const t of p.tracks) trackCounts.set(t, (trackCounts.get(t) ?? 0) + 1);

    if (p.stage !== "lead") enrolledOrBeyond += 1;
    if (p.stage === "graduated" || p.stage === "referred" || hasCompletedPrePurchase(p)) {
      graduates += 1;
    }
    if (p.stage === "referred" || p.referralId) referred += 1;
    if (p.tracks.includes("foreclosure-prevention")) atRisk += 1;
    if (p.tracks.includes("credit-repair") || p.household.creditBand === "below-580") needsCredit += 1;
    if (p.consentToShare) consentedShare += 1;
  }

  const byLanguage = [...langCounts.entries()]
    .map(([language, count]) => ({ language, label: LANGUAGE_LABELS[language], count }))
    .sort((a, b) => b.count - a.count);

  const byTrack = [...trackCounts.entries()]
    .map(([track, count]) => ({ track, label: TRACK_LABELS[track], count }))
    .sort((a, b) => b.count - a.count);

  return {
    total: participants.length,
    byStage,
    graduates,
    referred,
    graduationRate: enrolledOrBeyond === 0 ? 0 : graduates / enrolledOrBeyond,
    referralRate: graduates === 0 ? 0 : referred / graduates,
    atRisk,
    needsCredit,
    byLanguage,
    byTrack,
    consentedShare,
  };
}

export function formatPct(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
