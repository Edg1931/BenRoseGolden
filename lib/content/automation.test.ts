import { describe, expect, it } from "vitest";
import {
  NEWSLETTER_SEGMENTS,
  autoKeyFor,
  monthKey,
  monthTitle,
  pendingSegments,
  selectSegments,
} from "./automation";
import { TRACKS } from "@/lib/participants/curriculum";

const SEPT = new Date("2026-09-01T14:00:00Z");

describe("monthly newsletter automation", () => {
  it("keys a run to its month and segment", () => {
    expect(monthKey(SEPT)).toBe("2026-09");
    expect(monthTitle(SEPT)).toBe("September 2026");
    expect(autoKeyFor(SEPT, NEWSLETTER_SEGMENTS[0])).toBe("2026-09:first-time-buyer");
  });

  it("covers the four core need segments with valid tracks and audiences", () => {
    expect(NEWSLETTER_SEGMENTS.map((s) => s.track)).toEqual([
      "first-time-buyer",
      "credit-repair",
      "financial-coaching",
      "foreclosure-prevention",
    ]);
    for (const s of NEWSLETTER_SEGMENTS) {
      expect(TRACKS).toContain(s.track);
      expect(s.audience.tracks).toEqual([s.track]);
      expect(s.topics.length).toBeGreaterThan(0);
    }
  });

  it("skips segments whose issue already exists this month", () => {
    const existing = [
      { autoKey: "2026-09:first-time-buyer" },
      { autoKey: "2026-08:credit-repair" }, // last month — does not block September
      { autoKey: undefined },
    ];
    const todo = pendingSegments(SEPT, existing);
    expect(todo.map((s) => s.track)).toEqual([
      "credit-repair",
      "financial-coaching",
      "foreclosure-prevention",
    ]);
  });

  it("is fully pending on a fresh month and fully skipped when all exist", () => {
    expect(pendingSegments(SEPT, [])).toHaveLength(4);
    const all = NEWSLETTER_SEGMENTS.map((s) => ({ autoKey: autoKeyFor(SEPT, s) }));
    expect(pendingSegments(SEPT, all)).toHaveLength(0);
  });

  it("filters a run to the requested segments", () => {
    expect(selectSegments()).toHaveLength(4);
    expect(selectSegments([])).toHaveLength(4);
    expect(selectSegments(["credit-repair"]).map((s) => s.track)).toEqual(["credit-repair"]);
    expect(selectSegments(["credit-repair", "first-time-buyer"])).toHaveLength(2);
  });
});
