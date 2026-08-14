import { describe, expect, it } from "vitest";
import { AMI_FISCAL_YEAR, amiDataAge, amiIncomeLimit, amiPercentForIncome } from "./ami";

describe("amiDataAge", () => {
  it("is current during the fiscal year the data came from", () => {
    const a = amiDataAge(new Date(Date.UTC(AMI_FISCAL_YEAR, 0, 15)));
    expect(a.yearsBehind).toBe(0);
    expect(a.stale).toBe(false);
  });

  it("rolls the fiscal year over in October", () => {
    const sep = amiDataAge(new Date(Date.UTC(AMI_FISCAL_YEAR, 8, 30))); // Sep
    const oct = amiDataAge(new Date(Date.UTC(AMI_FISCAL_YEAR, 9, 1))); // Oct
    expect(sep.yearsBehind).toBe(0);
    expect(oct.yearsBehind).toBe(1);
  });

  it("flags data a year or more behind as stale", () => {
    const a = amiDataAge(new Date(Date.UTC(AMI_FISCAL_YEAR + 2, 5, 1)));
    expect(a.yearsBehind).toBe(2);
    expect(a.stale).toBe(true);
    expect(a.label).toContain(String(AMI_FISCAL_YEAR));
  });

  it("never reports a negative age", () => {
    expect(amiDataAge(new Date(Date.UTC(AMI_FISCAL_YEAR - 5, 0, 1))).yearsBehind).toBe(0);
  });
});

describe("AMI limit and percent are inverses", () => {
  it("round-trips an income through percent and back to a limit", () => {
    const pct = amiPercentForIncome("cuyahoga", 3, 52000);
    expect(pct).toBe(67);
    const cap = amiIncomeLimit("cuyahoga", 3, pct!);
    expect(Math.abs(cap! - 52000)).toBeLessThan(500);
  });

  it("returns null for counties outside the table", () => {
    expect(amiPercentForIncome("atlantis", 2, 50000)).toBeNull();
    expect(amiIncomeLimit("atlantis", 2, 80)).toBeNull();
  });
});
