import { CREDIT_BAND_ESTIMATE, type Participant } from "./schema";
import { MODULES, PHASES, type Track } from "./curriculum";
import { matchPrograms, type BuyerProfile, type MatchResult } from "@/lib/programs/matching";
import { occupationForMatching } from "@/lib/programs/occupations";
import type { Program } from "@/lib/programs/schema";

/** Translate a participant into the DPA matching engine's buyer profile. */
export function toBuyerProfile(p: Participant): BuyerProfile {
  return {
    county: p.address?.county,
    city: p.address?.city,
    firstTimeBuyer: p.household.firstTimeBuyer ?? p.tracks.includes("first-time-buyer"),
    householdSize: p.household.size ?? 1,
    householdIncome: p.household.annualIncome ?? 0,
    occupation: occupationForMatching(p.household.occupation, p.household.veteran),
    estimatedCredit: CREDIT_BAND_ESTIMATE[p.household.creditBand] || 0,
    completedHomebuyerEd: hasCompletedPrePurchase(p),
    targetPurchasePrice: p.household.targetPurchasePrice,
  };
}

/** Programs this participant likely qualifies for (top matches). */
export function matchedPrograms(p: Participant, programs: Program[]): MatchResult[] {
  return matchPrograms(programs, toBuyerProfile(p));
}

/** True once the participant has completed all pre-purchase education modules. */
export function hasCompletedPrePurchase(p: Participant): boolean {
  const prePurchase = MODULES.filter((m) => m.phase === "pre-purchase").map((m) => m.id);
  const completed = new Set(
    p.moduleProgress.filter((mp) => mp.status === "completed").map((mp) => mp.moduleId),
  );
  return prePurchase.every((id) => completed.has(id));
}

export interface PhaseProgress {
  phaseId: string;
  name: string;
  track: Track;
  total: number;
  completed: number;
  inProgress: number;
  percent: number;
}

/** Per-phase completion, for the profile progress UI and reports. */
export function phaseProgress(p: Participant): PhaseProgress[] {
  const byId = new Map(p.moduleProgress.map((mp) => [mp.moduleId, mp.status]));
  return PHASES.map((phase) => {
    const mods = MODULES.filter((m) => m.phase === phase.id);
    const completed = mods.filter((m) => byId.get(m.id) === "completed").length;
    const inProgress = mods.filter((m) => byId.get(m.id) === "in-progress").length;
    return {
      phaseId: phase.id,
      name: phase.name,
      track: phase.track,
      total: mods.length,
      completed,
      inProgress,
      percent: mods.length ? Math.round((completed / mods.length) * 100) : 0,
    };
  });
}

export interface Recommendation {
  kind: "education" | "assistance" | "track" | "consent" | "content";
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
}

/**
 * Expert "next best actions" tailored to the participant — the heart of a
 * useful CRM. Surfaces the right path for foreclosure vs credit-repair vs
 * first-time-buyer, content in their preferred format/language, and consent.
 */
export function recommendations(p: Participant, programs: Program[]): Recommendation[] {
  const recs: Recommendation[] = [];

  // Situation-specific routing.
  if (p.tracks.includes("foreclosure-prevention")) {
    recs.push({
      kind: "track",
      title: "Connect to foreclosure-prevention counseling",
      detail: "Flagged as at-risk. Prioritize loss-mitigation options and servicer outreach.",
      priority: "high",
    });
  }
  if (p.household.creditBand === "below-580" || p.tracks.includes("credit-repair")) {
    recs.push({
      kind: "track",
      title: "Start credit-repair coaching",
      detail: "Credit is the gating factor for most DPA programs (many require 620–640+).",
      priority: "high",
    });
  }

  // Education path.
  const completedPre = hasCompletedPrePurchase(p);
  if (!completedPre && (p.tracks.includes("first-time-buyer") || p.tracks.length === 0)) {
    recs.push({
      kind: "education",
      title: "Finish Pre-Purchase Homebuyer Education",
      detail: "Completing the HUD certificate unlocks most down-payment-assistance programs.",
      priority: "high",
    });
  }

  // Assistance the certificate unlocks.
  const matches = matchedPrograms(p, programs);
  const unlocked = matches.filter((m) => m.unlockedByCertificate);
  if (completedPre && unlocked.length > 0) {
    recs.push({
      kind: "assistance",
      title: `${unlocked.length} program(s) unlocked by their certificate`,
      detail: `Top match: ${unlocked[0].program.name}.`,
      priority: "high",
    });
  } else if (matches.length > 0) {
    recs.push({
      kind: "assistance",
      title: `${matches.length} assistance program(s) may fit`,
      detail: `e.g. ${matches[0].program.name}. Confirm eligibility details.`,
      priority: "medium",
    });
  }

  // Content delivery in their preferred form.
  if (p.preferredFormats.length > 0 || p.preferredLanguage !== "en") {
    recs.push({
      kind: "content",
      title: "Send content in their preferred format/language",
      detail: "Match delivery to how they learn best to improve completion and test pass rates.",
      priority: "medium",
    });
  }

  // Consent to refer to an agent once ready.
  if (completedPre && !p.consentToShare && p.stage !== "referred") {
    recs.push({
      kind: "consent",
      title: "Request consent to refer to The Golden Group",
      detail: "They've graduated. With consent, hand off to an agent to start the home search.",
      priority: "medium",
    });
  }

  return recs;
}
