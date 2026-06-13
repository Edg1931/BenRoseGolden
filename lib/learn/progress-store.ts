"use client";

/**
 * Client-side learner progress (localStorage): XP, viewed lessons, and passed
 * day tests. Self-serve learners aren't authenticated, so this gives them
 * persistent progress, badges, and the full-course completion state across
 * visits on the same device. (Counselor-tracked participants live in the CRM.)
 */

export interface DayPass {
  score: number;
  certificateId: string | null;
  date: string; // ISO
}

export interface LearnerProgress {
  xp: number;
  /** daySlug → lesson ids viewed */
  viewed: Record<string, string[]>;
  /** daySlug → passing result */
  passed: Record<string, DayPass>;
}

const KEY = "br-learn-progress-v1";

const EMPTY: LearnerProgress = { xp: 0, viewed: {}, passed: {} };

export function loadProgress(): LearnerProgress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw) as LearnerProgress;
    return {
      xp: typeof p.xp === "number" ? p.xp : 0,
      viewed: p.viewed ?? {},
      passed: p.passed ?? {},
    };
  } catch {
    return EMPTY;
  }
}

function save(p: LearnerProgress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Storage may be unavailable (private mode); progress just won't persist.
  }
}

export function addXp(amount: number): LearnerProgress {
  const p = loadProgress();
  p.xp += amount;
  save(p);
  return p;
}

/** Record a viewed lesson; awards 10 XP the first time. Returns new progress. */
export function markViewed(daySlug: string, lessonId: string): LearnerProgress {
  const p = loadProgress();
  const list = p.viewed[daySlug] ?? [];
  if (!list.includes(lessonId)) {
    p.viewed[daySlug] = [...list, lessonId];
    p.xp += 10;
    save(p);
  }
  return p;
}

/** Record a passed day test (50 XP the first time). Returns new progress. */
export function markPassed(daySlug: string, pass: DayPass): LearnerProgress {
  const p = loadProgress();
  const first = !p.passed[daySlug];
  p.passed[daySlug] = pass;
  if (first) p.xp += 50;
  save(p);
  return p;
}

export function daysPassedCount(p: LearnerProgress): number {
  return Object.keys(p.passed).length;
}
