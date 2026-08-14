import type { Participant } from "@/lib/participants/schema";

/**
 * Two fabricated learners used to demonstrate the client experience without
 * typing a sign-up form live: one partway through the course, one who has
 * finished and earned the certificate.
 *
 * They are ordinary CRM records (seeded, tagged "demo"), so the same person can
 * be shown from BOTH sides in a presentation — their own profile as they see it,
 * and their counselor's view of them in the Clients list.
 *
 * Only the ids listed in DEMO_LEARNER_IDS may be entered without a password.
 * That allowlist is what keeps the demo door from ever opening a real learner's
 * account — see app/api/demo/enter.
 */

export type DemoPersona = "in-progress" | "graduate";

export const DEMO_LEARNER_IDS: Record<DemoPersona, string> = {
  "in-progress": "d0000001-0000-4000-8000-000000000001",
  graduate: "d0000002-0000-4000-8000-000000000002",
};

export const DEMO_PERSONA_BY_ID: Record<string, DemoPersona> = Object.fromEntries(
  Object.entries(DEMO_LEARNER_IDS).map(([persona, id]) => [id, persona as DemoPersona]),
) as Record<string, DemoPersona>;

export function isDemoLearnerId(id: string): boolean {
  return id in DEMO_PERSONA_BY_ID;
}

const day = (slug: string, date: string) => ({
  name: `Homebuyer Education — ${slug.replace("day-", "Day ")}`,
  issuedDate: date,
  phase: slug,
});

export const demoLearners: Participant[] = [
  {
    id: DEMO_LEARNER_IDS["in-progress"],
    org: "benjamin-rose",
    firstName: "Jordan",
    lastName: "Rivera",
    email: "jordan.rivera@example.com",
    phone: "216-555-0188",
    address: { city: "Cleveland", county: "Cuyahoga", state: "OH", zip: "44105" },
    preferredLanguage: "en",
    preferredFormats: ["audio", "podcast"],
    contactChannels: ["email", "sms"],
    doNotContact: false,
    household: {
      size: 2,
      annualIncome: 48000,
      amiPercent: 70,
      creditBand: "640-699",
      firstTimeBuyer: true,
      targetPurchasePrice: 165000,
      savingsAvailable: 4200,
      monthlyDebt: 410,
      occupation: "Healthcare worker",
    },
    tracks: ["first-time-buyer"],
    stage: "in-progress",
    stageSince: "2026-07-02",
    assignedCounselor: "Counselor Rivera",
    moduleProgress: [
      { moduleId: "budgeting", status: "completed", completedDate: "2026-06-24", score: 90, format: "audio" },
      { moduleId: "credit-basics", status: "completed", completedDate: "2026-06-24", score: 90, format: "audio" },
      { moduleId: "mortgages", status: "completed", completedDate: "2026-07-02", score: 85, format: "audio" },
    ],
    certificates: [day("day-1", "2026-06-24"), day("day-2", "2026-07-02")],
    communications: [
      {
        id: "demo-c1",
        date: "2026-07-03",
        channel: "email",
        direction: "outbound",
        subject: "Nice work on Day 2",
        body: "Sent the Day 3 podcast link and the closing-cost worksheet.",
        byUser: "Counselor Rivera",
      },
    ],
    tags: ["demo", "sample-client"],
    source: "web",
    consentToShare: false,
    notes: "Sample record used for demonstrations.",
    dateAdded: "2026-06-20",
    lastUpdated: "2026-07-03",
  },
  {
    id: DEMO_LEARNER_IDS.graduate,
    org: "benjamin-rose",
    firstName: "Alicia",
    lastName: "Monroe",
    email: "alicia.monroe@example.com",
    phone: "216-555-0177",
    address: { city: "Lakewood", county: "Cuyahoga", state: "OH", zip: "44107" },
    preferredLanguage: "en",
    preferredFormats: ["slideshow", "pdf"],
    contactChannels: ["email", "phone"],
    doNotContact: false,
    household: {
      size: 3,
      annualIncome: 54000,
      creditBand: "700-749",
      firstTimeBuyer: true,
      targetPurchasePrice: 190000,
      savingsAvailable: 9500,
      monthlyDebt: 380,
      occupation: "Teacher / educator",
    },
    tracks: ["first-time-buyer"],
    stage: "graduated",
    stageSince: "2026-08-01",
    assignedCounselor: "Counselor Rivera",
    moduleProgress: [
      { moduleId: "budgeting", status: "completed", completedDate: "2026-07-08", score: 95 },
      { moduleId: "credit-basics", status: "completed", completedDate: "2026-07-08", score: 95 },
      { moduleId: "mortgages", status: "completed", completedDate: "2026-07-15", score: 92 },
      { moduleId: "shopping", status: "completed", completedDate: "2026-07-24", score: 88 },
      { moduleId: "closing", status: "completed", completedDate: "2026-07-24", score: 88 },
    ],
    certificates: [
      day("day-1", "2026-07-08"),
      day("day-2", "2026-07-15"),
      day("day-3", "2026-07-24"),
      day("day-4", "2026-08-01"),
    ],
    communications: [
      {
        id: "demo-c2",
        date: "2026-08-01",
        channel: "email",
        direction: "outbound",
        subject: "Your certificate is ready",
        body: "Congratulations — certificate issued and assistance matches refreshed.",
        byUser: "Counselor Rivera",
      },
    ],
    tags: ["demo", "sample-client"],
    source: "web",
    consentToShare: false,
    notes: "Sample record used for demonstrations.",
    dateAdded: "2026-07-01",
    lastUpdated: "2026-08-01",
  },
];
