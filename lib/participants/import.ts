import { LANGUAGES, type LanguageCode } from "./curriculum";
import {
  CREDIT_BANDS,
  type CreateParticipantInput,
  type CreditBand,
} from "./schema";

/**
 * CSV mass-import for the thousands of existing graduates.
 *
 * A small dependency-free CSV parser (handles quoted fields, commas, and
 * newlines inside quotes) plus a flexible column auto-mapper, so staff can
 * upload an export from a spreadsheet without reformatting it.
 */

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/** Canonical fields we can map an arbitrary CSV column onto. */
export const IMPORT_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "city",
  "county",
  "zip",
  "preferredLanguage",
  "householdSize",
  "annualIncome",
  "creditBand",
  "firstTimeBuyer",
  "stage",
  "tags",
  "notes",
] as const;
export type ImportField = (typeof IMPORT_FIELDS)[number];

/** Guess a mapping from CSV headers to canonical fields. */
export function autoMapHeaders(headers: string[]): Record<number, ImportField | ""> {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const aliases: Record<ImportField, string[]> = {
    firstName: ["firstname", "first", "fname", "givenname"],
    lastName: ["lastname", "last", "lname", "surname", "familyname"],
    email: ["email", "emailaddress", "e-mail"],
    phone: ["phone", "phonenumber", "mobile", "cell", "tel"],
    city: ["city", "town"],
    county: ["county"],
    zip: ["zip", "zipcode", "postalcode", "postal"],
    preferredLanguage: ["language", "preferredlanguage", "lang"],
    householdSize: ["householdsize", "household", "familysize"],
    annualIncome: ["income", "annualincome", "householdincome"],
    creditBand: ["credit", "creditband", "creditscore", "fico"],
    firstTimeBuyer: ["firsttimebuyer", "fthb", "firsttime"],
    stage: ["stage", "status"],
    tags: ["tags", "labels"],
    notes: ["notes", "note", "comments"],
  };
  const result: Record<number, ImportField | ""> = {};
  headers.forEach((h, i) => {
    const n = norm(h);
    const match = (Object.keys(aliases) as ImportField[]).find((field) =>
      aliases[field].some((a) => a === n),
    );
    result[i] = match ?? "";
  });
  return result;
}

function toCreditBand(value: string): CreditBand {
  const v = value.trim();
  if ((CREDIT_BANDS as readonly string[]).includes(v)) return v as CreditBand;
  const n = Number(v);
  if (!Number.isNaN(n) && n > 0) {
    if (n < 580) return "below-580";
    if (n < 640) return "580-639";
    if (n < 700) return "640-699";
    if (n < 750) return "700-749";
    return "750-plus";
  }
  return "unknown";
}

function toLanguage(value: string): LanguageCode {
  const v = value.trim().toLowerCase();
  if ((LANGUAGES as readonly string[]).includes(v)) return v as LanguageCode;
  const map: Record<string, LanguageCode> = {
    english: "en",
    spanish: "es",
    somali: "so",
    arabic: "ar",
    nepali: "ne",
    french: "fr",
    swahili: "sw",
    chinese: "zh",
  };
  return map[v] ?? "en";
}

function toBool(value: string): boolean | undefined {
  const v = value.trim().toLowerCase();
  if (["yes", "y", "true", "1"].includes(v)) return true;
  if (["no", "n", "false", "0"].includes(v)) return false;
  return undefined;
}

/** Build a participant input from one CSV data row given the column mapping. */
export function rowToParticipant(
  row: string[],
  mapping: Record<number, ImportField | "">,
): CreateParticipantInput {
  const get = (field: ImportField): string => {
    const idx = Object.entries(mapping).find(([, f]) => f === field)?.[0];
    return idx !== undefined ? (row[Number(idx)] ?? "").trim() : "";
  };

  const income = Number(get("annualIncome").replace(/[^0-9.]/g, ""));
  const size = Number(get("householdSize"));

  return {
    org: "benjamin-rose",
    firstName: get("firstName") || "Unknown",
    lastName: get("lastName") || undefined,
    email: get("email") || undefined,
    phone: get("phone") || undefined,
    address: {
      city: get("city") || undefined,
      county: get("county") || undefined,
      zip: get("zip") || undefined,
      state: "OH",
    },
    preferredLanguage: get("preferredLanguage") ? toLanguage(get("preferredLanguage")) : "en",
    preferredFormats: [],
    contactChannels: [],
    doNotContact: false,
    household: {
      size: Number.isFinite(size) && size > 0 ? size : undefined,
      annualIncome: Number.isFinite(income) && income > 0 ? income : undefined,
      creditBand: get("creditBand") ? toCreditBand(get("creditBand")) : "unknown",
      firstTimeBuyer: toBool(get("firstTimeBuyer")),
    },
    tracks: [],
    stage: "lead",
    moduleProgress: [],
    certificates: [],
    communications: [],
    tags: get("tags") ? get("tags").split(/[;|]/).map((t) => t.trim()).filter(Boolean) : [],
    source: "import",
    consentToShare: false,
    notes: get("notes") || undefined,
  };
}
