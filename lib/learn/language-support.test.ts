import { describe, expect, it } from "vitest";
import {
  COURSE_LANGUAGES,
  courseLanguageList,
  isCourseLanguage,
  languageSupportNotice,
  supportOnlyLanguages,
} from "./language-support";
import { LANGUAGES } from "@/lib/participants/curriculum";
import { participantSchema } from "@/lib/participants/schema";
import { recommendations } from "@/lib/participants/eligibility";

describe("course language coverage", () => {
  it("teaches English, Spanish and Arabic", () => {
    expect([...COURSE_LANGUAGES].sort()).toEqual(["ar", "en", "es"]);
    for (const l of COURSE_LANGUAGES) expect(isCourseLanguage(l)).toBe(true);
  });

  it("records more languages than it teaches, and names the difference", () => {
    const support = supportOnlyLanguages();
    expect(support.length).toBe(LANGUAGES.length - COURSE_LANGUAGES.length);
    expect(support).toContain("so");
    expect(support).toContain("ne");
    for (const l of support) expect(isCourseLanguage(l)).toBe(false);
  });

  it("lists the course languages in plain words", () => {
    expect(courseLanguageList()).toBe("English, Spanish, or Arabic");
  });
});

describe("languageSupportNotice", () => {
  it("says nothing when the course already speaks their language", () => {
    for (const l of COURSE_LANGUAGES) expect(languageSupportNotice(l)).toBeNull();
  });

  it("explains the gap and points at human help", () => {
    const n = languageSupportNotice("so");
    expect(n).not.toBeNull();
    expect(n!.heading).toContain("Somali");
    expect(n!.body).toContain("interpreter");
    expect(n!.body).toContain("English, Spanish, or Arabic");
  });
});

describe("staff recommendation for untaught languages", () => {
  const make = (preferredLanguage: string) =>
    participantSchema.parse({
      id: "11111111-1111-4111-8111-111111111111",
      firstName: "Test",
      preferredLanguage,
      dateAdded: "2026-01-01",
      lastUpdated: "2026-01-01",
    });

  it("raises a high-priority action for a Somali speaker", () => {
    const recs = recommendations(make("so"), []);
    const r = recs.find((x) => x.title.includes("Somali"));
    expect(r).toBeDefined();
    expect(r!.priority).toBe("high");
    expect(r!.detail).toContain("interpreter");
  });

  it("does not raise it for a Spanish speaker the course serves", () => {
    const recs = recommendations(make("es"), []);
    expect(recs.find((x) => x.title.includes("Spanish-language support"))).toBeUndefined();
  });
});
