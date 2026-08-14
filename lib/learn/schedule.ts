/**
 * Live class schedule — the in-person and virtual sessions of the same
 * HUD-approved homebuyer education course that runs online here.
 *
 * The online classes are one way to take the course; these sessions are the
 * classroom way. Sessions mirror the Benjamin Rose events calendar
 * (benrose.org/events) — update this list as new dates are posted there.
 * Past sessions are filtered out automatically, so a stale date is never
 * shown to a visitor.
 */

export interface ClassSession {
  /** ISO date, e.g. "2026-09-09". */
  date: string;
  /** Display times, e.g. "6:00 p.m. – 8:00 p.m." */
  time: string;
  format: "in-person" | "virtual";
  /** Venue for in-person sessions. */
  location?: string;
  /** Where to register — the Benjamin Rose events calendar. */
  registerUrl: string;
}

export const EVENTS_CALENDAR_URL = "https://benrose.org/events";

export const CLASS_SESSIONS: ClassSession[] = [
  {
    date: "2026-09-09",
    time: "6:00 p.m. – 8:00 p.m.",
    format: "virtual",
    registerUrl: EVENTS_CALENDAR_URL,
  },
  {
    date: "2026-09-10",
    time: "6:00 p.m. – 8:00 p.m.",
    format: "in-person",
    location: "Benjamin Rose Headquarters",
    registerUrl: EVENTS_CALENDAR_URL,
  },
];

/** Upcoming sessions (today included), soonest first. */
export function upcomingSessions(now: Date, limit = 4): ClassSession[] {
  const today = now.toISOString().slice(0, 10);
  return CLASS_SESSIONS.filter((s) => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}
