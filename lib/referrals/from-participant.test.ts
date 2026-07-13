import { describe, it, expect } from "vitest";
import { participantSchema, type Participant } from "@/lib/participants/schema";
import { createParticipant } from "@/lib/participants/repository";
import { isReferralEligible, mapParticipantToReferral } from "./from-participant";
import { listReferrals } from "./repository";
import type { AuthUser } from "@/lib/auth/roles";

const golden: AuthUser = { id: "u-golden", email: "agent@golden.example", role: "golden-agent" };

function participant(overrides: Partial<Participant>): Participant {
  return participantSchema.parse({
    id: "00000000-0000-0000-0000-000000000000",
    firstName: "Sam",
    lastName: "Rivera",
    consentToShare: true,
    stage: "graduated",
    dateAdded: "2026-01-01",
    lastUpdated: "2026-01-01",
    ...overrides,
  });
}

describe("isReferralEligible", () => {
  it("is true only when graduated/referred, consented, and not yet linked", () => {
    expect(isReferralEligible(participant({}))).toBe(true);
    expect(isReferralEligible(participant({ stage: "lead" }))).toBe(false);
    expect(isReferralEligible(participant({ consentToShare: false }))).toBe(false);
    expect(isReferralEligible(participant({ referralId: "11111111-1111-1111-1111-111111111111" }))).toBe(false);
  });
});

describe("mapParticipantToReferral", () => {
  it("maps identity, source, and program type privately", () => {
    const r = mapParticipantToReferral(participant({ org: "esop", email: "s@x.com" }));
    expect(r.firstName).toBe("Sam");
    expect(r.lastInitial).toBe("R");
    expect(r.source).toBe("esop");
    expect(r.programType).toBe("homebuyer-ed");
    expect(r.contact?.email).toBe("s@x.com");
  });

  it("routes foreclosure-prevention clients to the foreclosure program type", () => {
    const r = mapParticipantToReferral(participant({ tracks: ["foreclosure-prevention"] }));
    expect(r.programType).toBe("foreclosure");
  });
});

describe("auto-link on save", () => {
  it("creates a linked Golden Group referral when a client graduates with consent", async () => {
    const before = (await listReferrals(golden)).length;
    const created = await createParticipant(golden, {
      firstName: "Autolink",
      lastName: "Xavier",
      email: "autolink@example.com",
      consentToShare: true,
      stage: "graduated",
      certificates: [{ name: "HUD Pre-Purchase", issuedDate: "2026-05-01", phase: "pre-purchase" }],
    });

    // Participant is linked and advanced to "referred".
    expect(created.referralId).toBeTruthy();
    expect(created.stage).toBe("referred");

    // A matching referral now exists in the pipeline.
    const after = await listReferrals(golden);
    expect(after.length).toBe(before + 1);
    const ref = after.find((r) => r.id === created.referralId);
    expect(ref?.firstName).toBe("Autolink");
    expect(ref?.lastInitial).toBe("X");
    expect(ref?.certificateCompleted).toBe(true);
    expect(ref?.consentToShare).toBe(true);
  });

  it("does NOT create a referral without consent", async () => {
    const before = (await listReferrals(golden)).length;
    const created = await createParticipant(golden, {
      firstName: "NoConsent",
      stage: "graduated",
      consentToShare: false,
    });
    expect(created.referralId).toBeUndefined();
    expect((await listReferrals(golden)).length).toBe(before);
  });
});
