import { describe, expect, it } from "vitest";
import { participantSchema, type Participant } from "@/lib/participants/schema";
import { buildTranscript, certificateId } from "./transcript";
import { demoLearners, DEMO_LEARNER_IDS, isDemoLearnerId } from "./demo";
import { COURSE_DAYS } from "./course";

function learner(overrides: Partial<Participant> = {}): Participant {
  return participantSchema.parse({
    id: "11111111-1111-4111-8111-111111111111",
    firstName: "Test",
    dateAdded: "2026-01-01",
    lastUpdated: "2026-01-01",
    ...overrides,
  });
}

const cert = (slug: string, date: string) => ({
  name: `Homebuyer Education — ${slug}`,
  issuedDate: date,
  phase: slug,
});

describe("buildTranscript", () => {
  it("reports nothing taken for a brand-new learner", () => {
    const t = buildTranscript(learner());
    expect(t.passedCount).toBe(0);
    expect(t.percent).toBe(0);
    expect(t.graduated).toBe(false);
    expect(t.minutesCompleted).toBe(0);
    expect(t.nextDay?.slug).toBe("day-1");
  });

  it("counts passed days and points at the next one", () => {
    const t = buildTranscript(
      learner({ certificates: [cert("day-1", "2026-06-24"), cert("day-2", "2026-07-02")] }),
    );
    expect(t.passedCount).toBe(2);
    expect(t.nextDay?.slug).toBe("day-3");
    expect(t.days[0].passed).toBe(true);
    expect(t.days[0].passedDate).toBe("2026-06-24");
    expect(t.days[2].passed).toBe(false);
  });

  it("surfaces the best score recorded for a day's modules", () => {
    const t = buildTranscript(
      learner({
        certificates: [cert("day-1", "2026-06-24")],
        moduleProgress: [
          { moduleId: "budgeting", status: "completed", score: 80 },
          { moduleId: "credit-basics", status: "completed", score: 95 },
        ],
      }),
    );
    expect(t.days[0].score).toBe(95);
  });

  it("graduates only when every day is passed, dated by the last one", () => {
    const all = COURSE_DAYS.map((d, i) => cert(d.slug, `2026-07-0${i + 1}`));
    const t = buildTranscript(learner({ certificates: all }));
    expect(t.graduated).toBe(true);
    expect(t.percent).toBe(100);
    expect(t.graduationDate).toBe(`2026-07-0${COURSE_DAYS.length}`);
    expect(t.nextDay).toBeNull();
  });

  it("ignores non-day certificates when counting classes", () => {
    const t = buildTranscript(
      learner({
        certificates: [
          { name: "HUD Pre-Purchase", issuedDate: "2026-02-12", phase: "pre-purchase" },
        ],
      }),
    );
    expect(t.passedCount).toBe(0);
    expect(t.graduated).toBe(false);
  });
});

describe("certificateId", () => {
  it("is stable for a given learner", () => {
    const p = learner();
    expect(certificateId(p)).toBe(certificateId(p));
    expect(certificateId(p)).toMatch(/^BR-[0-9A-F]{10}$/);
  });
});

describe("demo learners", () => {
  it("are valid participant records", () => {
    for (const d of demoLearners) expect(() => participantSchema.parse(d)).not.toThrow();
  });

  it("match the personas they are meant to show", () => {
    const [jordan, alicia] = demoLearners;
    expect(buildTranscript(jordan).passedCount).toBe(2);
    expect(buildTranscript(jordan).graduated).toBe(false);
    expect(buildTranscript(alicia).graduated).toBe(true);
  });

  it("allowlists only the two demo ids", () => {
    expect(isDemoLearnerId(DEMO_LEARNER_IDS["in-progress"])).toBe(true);
    expect(isDemoLearnerId(DEMO_LEARNER_IDS.graduate)).toBe(true);
    expect(isDemoLearnerId("a1111111-1111-1111-1111-111111111111")).toBe(false);
  });
});
