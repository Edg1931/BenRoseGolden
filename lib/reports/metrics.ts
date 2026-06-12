import {
  CONTENT_FORMAT_LABELS,
  LANGUAGE_LABELS,
  MODULES,
  PHASES,
  TRACK_LABELS,
  type ContentFormat,
} from "@/lib/participants/curriculum";
import {
  PARTICIPANT_STAGES,
  STAGE_LABELS,
  type Participant,
} from "@/lib/participants/schema";
import type { Campaign } from "@/lib/content/schema";

const DAY = 1000 * 60 * 60 * 24;

function daysInStage(p: Participant): number {
  const t = new Date(p.stageSince ?? p.dateAdded).getTime();
  if (Number.isNaN(t)) return 0;
  return Math.max(0, Math.floor((Date.now() - t) / DAY));
}

export interface Bar {
  key: string;
  label: string;
  value: number;
  /** Optional denominator for a rate. */
  total?: number;
}

export interface ReportData {
  totalParticipants: number;
  moduleCompletion: Bar[]; // completed count per module
  phaseCompletion: Bar[]; // % completed per phase
  formatUsage: Bar[]; // how content was consumed
  languageReach: Bar[];
  needs: Bar[];
  funnel: Bar[]; // enrolled -> graduated -> referred
  timeInStage: Bar[]; // avg days currently spent in each stage
  feedback: { avgScore: number | null; scored: number };
  campaigns: { total: number; byStatus: Record<string, number>; byType: Record<string, number> };
}

export function computeReports(participants: Participant[], campaigns: Campaign[]): ReportData {
  const total = participants.length;
  const statusByModule = new Map<string, { completed: number; inProgress: number }>();
  const formatCounts = new Map<ContentFormat, number>();
  const langCounts = new Map<string, number>();
  const trackCounts = new Map<string, number>();
  let scoreSum = 0;
  let scored = 0;
  let enrolled = 0;
  let graduated = 0;
  let referred = 0;

  for (const p of participants) {
    if (p.stage !== "lead") enrolled += 1;
    if (p.stage === "graduated" || p.stage === "referred") graduated += 1;
    if (p.stage === "referred" || p.referralId) referred += 1;
    langCounts.set(p.preferredLanguage, (langCounts.get(p.preferredLanguage) ?? 0) + 1);
    for (const t of p.tracks) trackCounts.set(t, (trackCounts.get(t) ?? 0) + 1);

    for (const mp of p.moduleProgress) {
      const cur = statusByModule.get(mp.moduleId) ?? { completed: 0, inProgress: 0 };
      if (mp.status === "completed") cur.completed += 1;
      else if (mp.status === "in-progress") cur.inProgress += 1;
      statusByModule.set(mp.moduleId, cur);
      if (mp.format) formatCounts.set(mp.format, (formatCounts.get(mp.format) ?? 0) + 1);
      if (typeof mp.score === "number") {
        scoreSum += mp.score;
        scored += 1;
      }
    }
  }

  const moduleCompletion: Bar[] = MODULES.map((m) => ({
    key: m.id,
    label: m.name,
    value: statusByModule.get(m.id)?.completed ?? 0,
    total,
  }));

  const phaseCompletion: Bar[] = PHASES.map((phase) => {
    const mods = MODULES.filter((m) => m.phase === phase.id);
    const completers = participants.filter((p) => {
      const done = new Set(
        p.moduleProgress.filter((mp) => mp.status === "completed").map((mp) => mp.moduleId),
      );
      return mods.every((m) => done.has(m.id));
    }).length;
    return { key: phase.id, label: phase.name, value: completers, total };
  });

  const formatUsage: Bar[] = [...formatCounts.entries()]
    .map(([f, value]) => ({ key: f, label: CONTENT_FORMAT_LABELS[f], value }))
    .sort((a, b) => b.value - a.value);

  const languageReach: Bar[] = [...langCounts.entries()]
    .map(([k, value]) => ({ key: k, label: LANGUAGE_LABELS[k as keyof typeof LANGUAGE_LABELS] ?? k, value }))
    .sort((a, b) => b.value - a.value);

  const needs: Bar[] = [...trackCounts.entries()]
    .map(([k, value]) => ({ key: k, label: TRACK_LABELS[k as keyof typeof TRACK_LABELS] ?? k, value }))
    .sort((a, b) => b.value - a.value);

  const funnel: Bar[] = [
    { key: "enrolled", label: "Enrolled", value: enrolled, total },
    { key: "graduated", label: "Graduated", value: graduated, total },
    { key: "referred", label: "Referred", value: referred, total },
  ];

  // Average days currently spent in each stage (the time-in-phase view).
  const timeInStage: Bar[] = PARTICIPANT_STAGES.map((stage) => {
    const inStage = participants.filter((p) => p.stage === stage);
    const avg = inStage.length
      ? Math.round(inStage.reduce((s, p) => s + daysInStage(p), 0) / inStage.length)
      : 0;
    return { key: stage, label: STAGE_LABELS[stage], value: avg };
  });

  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};
  for (const c of campaigns) {
    byStatus[c.status] = (byStatus[c.status] ?? 0) + 1;
    byType[c.type] = (byType[c.type] ?? 0) + 1;
  }

  return {
    totalParticipants: total,
    moduleCompletion,
    phaseCompletion,
    formatUsage,
    languageReach,
    needs,
    funnel,
    timeInStage,
    feedback: { avgScore: scored ? Math.round(scoreSum / scored) : null, scored },
    campaigns: { total: campaigns.length, byStatus, byType },
  };
}

/** Build a CSV string for the module-completion report. */
export function moduleCompletionCsv(report: ReportData): string {
  const rows = [["Module", "Completed", "Total", "Completion %"]];
  for (const b of report.moduleCompletion) {
    const pct = b.total ? Math.round((b.value / b.total) * 100) : 0;
    rows.push([b.label, String(b.value), String(b.total ?? 0), `${pct}%`]);
  }
  return rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
}
