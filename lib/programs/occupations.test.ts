import { describe, expect, it } from "vitest";
import { occupationForMatching, occupationMatches } from "./occupations";

const OHIO_HEROES = [
  "Eligible heroes only",
  "Veterans, active-duty military, police, firefighters, EMTs/paramedics, physicians, nurses, and teachers/administrators.",
];
const GRADS = [
  "Recent graduates",
  "Must have earned an associate, bachelor's, master's, or doctorate degree within the past 48 months.",
];

describe("occupationMatches", () => {
  it.each([
    "Teacher / educator",
    "Police officer",
    "Firefighter / EMT",
    "Healthcare worker",
    "Veteran / active military",
  ])("matches %s against Ohio Heroes", (occ) => {
    expect(occupationMatches(occ, OHIO_HEROES)).toBe(true);
  });

  it("does not match a hero profession against the recent-graduate program", () => {
    expect(occupationMatches("Teacher / educator", GRADS)).toBe(false);
  });

  it("is false when no occupation was captured", () => {
    expect(occupationMatches(undefined, OHIO_HEROES)).toBe(false);
    expect(occupationMatches("", OHIO_HEROES)).toBe(false);
  });

  it("does not match the generic 'Other' choice", () => {
    expect(occupationMatches("Other", OHIO_HEROES)).toBe(false);
  });

  it("still matches free-text occupations on their own words", () => {
    expect(occupationMatches("Registered nurse", OHIO_HEROES)).toBe(true);
  });
});

describe("occupationForMatching", () => {
  it("combines occupation and veteran status", () => {
    expect(occupationForMatching("Teacher / educator", true)).toBe(
      "Teacher / educator, Veteran / active military",
    );
  });
  it("returns undefined when nothing is known", () => {
    expect(occupationForMatching(undefined, false)).toBeUndefined();
  });
});
