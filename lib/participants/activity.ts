import { MODULES } from "./curriculum";
import type { Participant } from "./schema";

/**
 * Derives a recent-activity stream from participant records so the dashboard can
 * show the program coming alive — new sign-ups, class completions, certificates,
 * and referrals — without a separate events table. Pure + sorted newest-first.
 */

export type ActivityKind = "signup" | "module" | "certificate" | "referral";

export interface ActivityEvent {
  id: string;
  date: string; // ISO (YYYY-MM-DD or full)
  kind: ActivityKind;
  icon: string;
  participantId: string;
  name: string;
  text: string;
}

const MODULE_NAME = new Map(MODULES.map((m) => [m.id, m.name]));

function fullName(p: Participant): string {
  return [p.firstName, p.lastName].filter(Boolean).join(" ") || "A learner";
}

export function recentActivity(participants: Participant[], limit = 8): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  for (const p of participants) {
    const name = fullName(p);

    // Sign-up / intake
    events.push({
      id: `${p.id}-signup`,
      date: p.dateAdded,
      kind: "signup",
      icon: p.source === "web" ? "✨" : "➕",
      participantId: p.id,
      name,
      text: p.source === "web" ? "created a profile and started the classes" : "was added to the program",
    });

    // Completed modules
    for (const m of p.moduleProgress) {
      if (m.status === "completed" && m.completedDate) {
        const label = MODULE_NAME.get(m.moduleId) ?? m.moduleId;
        events.push({
          id: `${p.id}-mod-${m.moduleId}`,
          date: m.completedDate,
          kind: "module",
          icon: "📘",
          participantId: p.id,
          name,
          text: `completed ${label}${m.score != null ? ` (${m.score}%)` : ""}`,
        });
      }
    }

    // Certificates earned
    for (const c of p.certificates) {
      events.push({
        id: `${p.id}-cert-${c.issuedDate}`,
        date: c.issuedDate,
        kind: "certificate",
        icon: "🎓",
        participantId: p.id,
        name,
        text: `earned a certificate — ${c.name}`,
      });
    }

    // Referral to a Golden Group agent
    if (p.referralId) {
      events.push({
        id: `${p.id}-referral`,
        date: p.consentDate ?? p.stageSince ?? p.lastUpdated,
        kind: "referral",
        icon: "🤝",
        participantId: p.id,
        name,
        text: "was referred to a Golden Group agent",
      });
    }
  }

  return events
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

/** Human "x days ago" relative to a reference date (defaults to today). */
export function relativeDay(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const days = Math.floor((now.getTime() - then) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  if (days < 365) return `${Math.round(days / 30)}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}
