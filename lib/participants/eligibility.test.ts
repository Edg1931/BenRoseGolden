import { describe, it, expect } from "vitest";
import {
  toBuyerProfile,
  hasCompletedPrePurchase,
  phaseProgress,
} from "@/lib/participants/eligibility";
import { seedParticipants } from "@/lib/participants/seed";
import { MODULES } from "@/lib/participants/curriculum";
import type { Participant } from "@/lib/participants/schema";

const sample = seedParticipants[0];
const prePurchaseIds = MODULES.filter((m) => m.phase === "pre-purchase").map((m) => m.id);

describe("toBuyerProfile", () => {
  it("maps household fields onto the buyer profile", () => {
    const profile = toBuyerProfile(sample);
    expect(profile.householdSize).toBe(sample.household.size ?? 1);
    expect(profile.householdIncome).toBe(sample.household.annualIncome ?? 0);
    expect(profile.county).toBe(sample.address?.county);
  });

  it("defaults household size to 1 when missing", () => {
    const p = { ...sample, household: { ...sample.household, size: undefined } } as Participant;
    expect(toBuyerProfile(p).householdSize).toBe(1);
  });
});

describe("hasCompletedPrePurchase", () => {
  it("is true only when every pre-purchase module is completed", () => {
    const allDone = {
      ...sample,
      moduleProgress: prePurchaseIds.map((id) => ({ moduleId: id, status: "completed" as const })),
    } as unknown as Participant;
    expect(hasCompletedPrePurchase(allDone)).toBe(true);
  });

  it("is false when a pre-purchase module is missing", () => {
    const missingOne = {
      ...sample,
      moduleProgress: prePurchaseIds
        .slice(1)
        .map((id) => ({ moduleId: id, status: "completed" as const })),
    } as unknown as Participant;
    expect(hasCompletedPrePurchase(missingOne)).toBe(false);
  });

  it("is false with no progress at all", () => {
    const none = { ...sample, moduleProgress: [] } as Participant;
    expect(hasCompletedPrePurchase(none)).toBe(false);
  });
});

describe("phaseProgress", () => {
  it("returns sane per-phase counts for every seeded participant", () => {
    for (const p of seedParticipants) {
      for (const phase of phaseProgress(p)) {
        expect(phase.completed).toBeLessThanOrEqual(phase.total);
        expect(phase.percent).toBeGreaterThanOrEqual(0);
        expect(phase.percent).toBeLessThanOrEqual(100);
        if (phase.total > 0) {
          expect(phase.percent).toBe(Math.round((phase.completed / phase.total) * 100));
        }
      }
    }
  });
});
