import { COURSE_DAYS, DAY_MODULE_IDS, type CourseDay } from "./course";
import type { Participant } from "@/lib/participants/schema";

/**
 * A learner's record of what they've actually done — the thing their profile
 * page, their certificate, and the staff view all read from.
 *
 * Progress lives on the CRM participant record (certificates keyed by day slug,
 * module scores in moduleProgress), so it follows the person across devices and
 * is the same data a counselor sees. This module just reads it into a shape the
 * UI can render.
 */

export interface DayRecord {
  day: CourseDay;
  passed: boolean;
  /** ISO date (yyyy-mm-dd) the day was passed. */
  passedDate?: string;
  /** Best test score recorded for the day's modules, 0–100. */
  score?: number;
  lessonCount: number;
  minutes: number;
}

export interface Transcript {
  days: DayRecord[];
  passedCount: number;
  totalDays: number;
  percent: number;
  /** Every class passed — the full course certificate is earned. */
  graduated: boolean;
  /** Date the final class was passed. */
  graduationDate?: string;
  /** Total instruction time completed, in minutes (HUD counts ~8 hours). */
  minutesCompleted: number;
  /** The next class to take, or null when they're done. */
  nextDay: CourseDay | null;
}

/** Best recorded score across the modules a given day covers. */
function scoreForDay(learner: Participant, daySlug: string): number | undefined {
  const moduleIds = DAY_MODULE_IDS[daySlug] ?? [];
  const scores = learner.moduleProgress
    .filter((m) => moduleIds.includes(m.moduleId) && typeof m.score === "number")
    .map((m) => m.score as number);
  return scores.length > 0 ? Math.max(...scores) : undefined;
}

export function buildTranscript(learner: Participant): Transcript {
  const certByDay = new Map(
    learner.certificates
      .filter((c) => c.phase && /^day-\d+$/.test(c.phase))
      .map((c) => [c.phase as string, c]),
  );

  const days: DayRecord[] = COURSE_DAYS.map((day) => {
    const cert = certByDay.get(day.slug);
    return {
      day,
      passed: !!cert,
      passedDate: cert?.issuedDate,
      score: scoreForDay(learner, day.slug),
      lessonCount: day.lessons.length,
      minutes: day.minutes,
    };
  });

  const passed = days.filter((d) => d.passed);
  const graduated = passed.length === COURSE_DAYS.length && COURSE_DAYS.length > 0;
  const graduationDate = graduated
    ? passed
        .map((d) => d.passedDate)
        .filter((d): d is string => !!d)
        .sort()
        .at(-1)
    : undefined;

  return {
    days,
    passedCount: passed.length,
    totalDays: COURSE_DAYS.length,
    percent: COURSE_DAYS.length ? Math.round((passed.length / COURSE_DAYS.length) * 100) : 0,
    graduated,
    graduationDate,
    minutesCompleted: passed.reduce((sum, d) => sum + d.minutes, 0),
    nextDay: days.find((d) => !d.passed)?.day ?? null,
  };
}

/**
 * A stable, human-quotable id for the completion certificate, derived from the
 * learner's record id so it's the same every time it's printed or verified.
 */
export function certificateId(learner: Participant): string {
  return `BR-${learner.id.replace(/-/g, "").slice(0, 10).toUpperCase()}`;
}
