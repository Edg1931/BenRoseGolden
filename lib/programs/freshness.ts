import type { Program } from "./schema";

/** Days after which a program's verification is considered due for re-checking. */
export const STALE_AFTER_DAYS = 180;

export interface Freshness {
  total: number;
  /** Most recent `lastVerified` across the dataset (ISO date), or null. */
  newestVerified: string | null;
  /** Oldest `lastVerified` (ISO date), or null. */
  oldestVerified: string | null;
  /** Count of programs not verified within STALE_AFTER_DAYS. */
  staleCount: number;
}

function daysSince(iso: string): number | null {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / 86_400_000);
}

/** Summarize how current the program dataset is, for honest freshness signals. */
export function datasetFreshness(programs: Program[]): Freshness {
  let newest: string | null = null;
  let oldest: string | null = null;
  let staleCount = 0;

  for (const p of programs) {
    const v = p.lastVerified;
    if (!v) continue;
    if (!newest || v > newest) newest = v;
    if (!oldest || v < oldest) oldest = v;
    const age = daysSince(v);
    if (age != null && age > STALE_AFTER_DAYS) staleCount += 1;
  }

  return { total: programs.length, newestVerified: newest, oldestVerified: oldest, staleCount };
}

/** True when a program is due for re-verification. */
export function isStale(program: Program): boolean {
  const age = program.lastVerified ? daysSince(program.lastVerified) : null;
  return age != null && age > STALE_AFTER_DAYS;
}
