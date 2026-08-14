/**
 * HUD Area Median Income (AMI) lookup — turns a program's "80% AMI" style income
 * limit into a real dollar cap for a given Ohio county and household size, so the
 * finder can qualify/disqualify instead of just flagging a caveat.
 *
 * Method: store the HUD 4-person Area Median Family Income (MFI) per county, then
 * apply HUD's standard family-size adjustment factors and the program's AMI
 * percent. This mirrors how HUD derives size-adjusted limits.
 *
 * The MFI figures below are approximate HUD FY2024 values (counties in the same
 * metro share a figure). They drive the finder but should be refreshed annually
 * from the official source: https://www.huduser.gov/portal/datasets/il.html
 */

const AMI_DATA_YEAR = "FY2024 (approximate — verify at huduser.gov)";

/** HUD family-size adjustment factors relative to a 4-person household. */
const SIZE_FACTOR: Record<number, number> = {
  1: 0.7,
  2: 0.8,
  3: 0.9,
  4: 1.0,
  5: 1.08,
  6: 1.16,
  7: 1.24,
  8: 1.32,
};

/**
 * Approximate HUD FY2024 Area Median Family Income (4-person) by Ohio county.
 * Keyed by lowercase county name (no "county" suffix).
 */
const COUNTY_MFI_4PERSON: Record<string, number> = {
  // Cleveland-Elyria metro
  cuyahoga: 86300,
  lorain: 86300,
  lake: 86300,
  geauga: 86300,
  medina: 86300,
  // Columbus metro
  franklin: 102700,
  delaware: 102700,
  fairfield: 102700,
  licking: 102700,
  union: 102700,
  // Cincinnati metro
  hamilton: 98900,
  butler: 98900,
  warren: 98900,
  clermont: 98900,
  // Akron metro
  summit: 88700,
  portage: 88700,
  // Dayton metro
  montgomery: 87200,
  greene: 87200,
  miami: 87200,
  // Toledo metro
  lucas: 81300,
  wood: 81300,
  // Canton metro
  stark: 80500,
  // Youngstown metro
  mahoning: 73400,
  trumbull: 73400,
};

function normalizeCounty(county: string): string {
  return county.toLowerCase().replace(/\s+county$/, "").trim();
}

function sizeFactor(size: number): number {
  if (size <= 1) return SIZE_FACTOR[1];
  if (size >= 8) return SIZE_FACTOR[8] + (size - 8) * 0.08; // HUD adds 8% per extra person
  return SIZE_FACTOR[size];
}

/** Counties with AMI data, for "is this county covered?" checks/UI. */
export function amiSupportedCounties(): string[] {
  return Object.keys(COUNTY_MFI_4PERSON);
}

export function isAmiCountySupported(county?: string): boolean {
  return !!county && normalizeCounty(county) in COUNTY_MFI_4PERSON;
}

/**
 * The income cap (USD) at a given AMI percent for a county + household size,
 * rounded to the nearest $50. Returns null when the county isn't in the table.
 */
export function amiIncomeLimit(
  county: string,
  householdSize: number,
  amiPercent: number,
): number | null {
  const mfi = COUNTY_MFI_4PERSON[normalizeCounty(county)];
  if (mfi == null) return null;
  const size = Math.max(1, Math.round(householdSize) || 1);
  const cap = mfi * sizeFactor(size) * (amiPercent / 100);
  return Math.round(cap / 50) * 50;
}

/**
 * The inverse of {@link amiIncomeLimit}: where a household's income falls as a
 * percent of area median, given their county and size. Returns null when the
 * county isn't in the table. Used to fill in a participant's `% of AMI` so staff
 * never have to compute it by hand and program matching has it on file.
 */
export function amiPercentForIncome(
  county: string,
  householdSize: number,
  annualIncome: number,
): number | null {
  const mfi = COUNTY_MFI_4PERSON[normalizeCounty(county)];
  if (mfi == null) return null;
  const size = Math.max(1, Math.round(householdSize) || 1);
  const median = mfi * sizeFactor(size);
  if (median <= 0) return null;
  return Math.round((annualIncome / median) * 100);
}

/** Extract an AMI percent from a textual income limit like "80% AMI". */
export function parseAmiPercent(incomeLimit: unknown): number | null {
  if (typeof incomeLimit !== "string") return null;
  const m = incomeLimit.match(/(\d{2,3})\s*%\s*ami/i);
  return m ? Number(m[1]) : null;
}

export { AMI_DATA_YEAR };
