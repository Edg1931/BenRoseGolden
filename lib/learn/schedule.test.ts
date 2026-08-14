import { describe, expect, it } from "vitest";
import { CLASS_SESSIONS, upcomingSessions, EVENTS_CALENDAR_URL } from "./schedule";

describe("class schedule", () => {
  it("lists the September sessions from the events calendar", () => {
    const dates = CLASS_SESSIONS.map((s) => `${s.date}:${s.format}`);
    expect(dates).toContain("2026-09-09:virtual");
    expect(dates).toContain("2026-09-10:in-person");
    const inPerson = CLASS_SESSIONS.find((s) => s.format === "in-person");
    expect(inPerson?.location).toBe("Benjamin Rose Headquarters");
    for (const s of CLASS_SESSIONS) expect(s.registerUrl).toBe(EVENTS_CALENDAR_URL);
  });

  it("shows upcoming sessions soonest-first and includes today", () => {
    const before = upcomingSessions(new Date("2026-08-14T12:00:00Z"));
    expect(before.map((s) => s.date)).toEqual(["2026-09-09", "2026-09-10"]);
    const onDay = upcomingSessions(new Date("2026-09-10T08:00:00Z"));
    expect(onDay.map((s) => s.date)).toEqual(["2026-09-10"]);
  });

  it("never shows a stale date", () => {
    expect(upcomingSessions(new Date("2027-01-01T00:00:00Z"))).toHaveLength(0);
  });
});
