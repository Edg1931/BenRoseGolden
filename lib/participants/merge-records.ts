import type { Participant } from "./schema";

/**
 * Merge records carried in the browser session into a list from the store,
 * preferring the store's copy when both hold the same person.
 *
 * Kept free of any Next.js runtime import so it stays unit-testable.
 */
export function mergeRecords(
  stored: Participant[],
  remembered: Participant[],
): Participant[] {
  const known = new Set(stored.map((p) => p.id));
  const extra = remembered.filter((p) => !known.has(p.id));
  return [...extra, ...stored];
}
