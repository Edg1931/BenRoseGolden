import { describe, expect, it } from "vitest";
import { participantSchema, type Participant } from "./schema";
import { refreshDerivedFields, withDerivedFields } from "./derive";
import { toBuyerProfile } from "./eligibility";

function make(overrides: Partial<Participant> = {}): Participant {
  return participantSchema.parse({
    id: "11111111-1111-4111-8111-111111111111",
    firstName: "Test",
    dateAdded: "2026-01-01",
    lastUpdated: "2026-01-01",
    ...overrides,
  });
}

describe("withDerivedFields", () => {
  it("derives % of AMI from county, household size and income", () => {
    // Cuyahoga 4-person MFI 86,300 × 0.9 (3-person) = 77,670. 52,000 ≈ 67%.
    const p = withDerivedFields(
      make({
        address: { county: "Cuyahoga", state: "OH" },
        household: { size: 3, annualIncome: 52000, creditBand: "unknown" },
      }),
    );
    expect(p.household.amiPercent).toBe(67);
  });

  it("accepts a county written as 'Cuyahoga County'", () => {
    const p = withDerivedFields(
      make({
        address: { county: "Cuyahoga County", state: "OH" },
        household: { size: 3, annualIncome: 52000, creditBand: "unknown" },
      }),
    );
    expect(p.household.amiPercent).toBe(67);
  });

  it("never overwrites a percent that was entered by hand", () => {
    const p = withDerivedFields(
      make({
        address: { county: "Cuyahoga", state: "OH" },
        household: { size: 3, annualIncome: 52000, amiPercent: 80, creditBand: "unknown" },
      }),
    );
    expect(p.household.amiPercent).toBe(80);
  });

  it("leaves it blank when the county is unknown to the HUD table", () => {
    const p = withDerivedFields(
      make({
        address: { county: "Nowhere", state: "OH" },
        household: { size: 2, annualIncome: 50000, creditBand: "unknown" },
      }),
    );
    expect(p.household.amiPercent).toBeUndefined();
  });

  it("leaves it blank when income is missing", () => {
    const p = withDerivedFields(
      make({ address: { county: "Cuyahoga", state: "OH" }, household: { size: 2, creditBand: "unknown" } }),
    );
    expect(p.household.amiPercent).toBeUndefined();
  });
});

describe("refreshDerivedFields", () => {
  it("recomputes a stale derived percent when income changes", () => {
    const edited = make({
      address: { county: "Cuyahoga", state: "OH" },
      household: { size: 3, annualIncome: 70000, amiPercent: 67, creditBand: "unknown" },
    });
    // 70,000 / 77,670 ≈ 90%
    expect(refreshDerivedFields(edited, true).household.amiPercent).toBe(90);
  });

  it("keeps the stored percent when the edit did not touch the household", () => {
    const edited = make({
      address: { county: "Cuyahoga", state: "OH" },
      household: { size: 3, annualIncome: 70000, amiPercent: 67, creditBand: "unknown" },
    });
    expect(refreshDerivedFields(edited, false).household.amiPercent).toBe(67);
  });
});

describe("toBuyerProfile occupation", () => {
  it("passes the stated occupation through to the matching engine", () => {
    const p = make({ household: { creditBand: "unknown", occupation: "Teacher / educator" } });
    expect(toBuyerProfile(p).occupation).toBe("Teacher / educator");
  });

  it("adds veteran status so veteran-only programs still match", () => {
    const p = make({
      household: { creditBand: "unknown", occupation: "Teacher / educator", veteran: true },
    });
    expect(toBuyerProfile(p).occupation).toBe("Teacher / educator, Veteran / active military");
  });

  it("does not duplicate veteran when it is already the occupation", () => {
    const p = make({
      household: { creditBand: "unknown", occupation: "Veteran / active military", veteran: true },
    });
    expect(toBuyerProfile(p).occupation).toBe("Veteran / active military");
  });

  it("is undefined when nothing was captured", () => {
    expect(toBuyerProfile(make()).occupation).toBeUndefined();
  });
});
