import { describe, expect, it } from "vitest";
import { mergeRecords } from "./merge-records";
import { participantSchema, type Participant } from "./schema";

const make = (id: string, firstName: string): Participant =>
  participantSchema.parse({
    id,
    firstName,
    dateAdded: "2026-01-01",
    lastUpdated: "2026-01-01",
  });

describe("mergeRecords", () => {
  const stored = [make("11111111-1111-4111-8111-111111111111", "Seeded")];

  it("adds a browser-session record the store never saw", () => {
    const extra = make("22222222-2222-4222-8222-222222222222", "NewSignup");
    const merged = mergeRecords(stored, [extra]);
    expect(merged).toHaveLength(2);
    expect(merged.map((p) => p.firstName)).toContain("NewSignup");
  });

  it("never duplicates a record the store already has", () => {
    const same = make("11111111-1111-4111-8111-111111111111", "Seeded");
    expect(mergeRecords(stored, [same])).toHaveLength(1);
  });

  it("prefers the stored copy when both exist", () => {
    const staleCopy = make("11111111-1111-4111-8111-111111111111", "StaleName");
    const merged = mergeRecords(stored, [staleCopy]);
    expect(merged[0].firstName).toBe("Seeded");
  });

  it("is a no-op when nothing was remembered", () => {
    expect(mergeRecords(stored, [])).toEqual(stored);
  });
});
