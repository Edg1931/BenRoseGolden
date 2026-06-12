/**
 * Benjamin Rose homebuyer & housing-stability curriculum.
 *
 * This is the canonical phase → module map that participant progress is tracked
 * against, so completion is consistent across import, the profile UI, and
 * reports. Each module carries the formats it's available in and a `hasTest`
 * flag — tracking only for now, but structured so an in-app quiz/scoring engine
 * can be layered on later without reshaping data.
 */

export const CONTENT_FORMATS = [
  "in-person",
  "pdf",
  "audio",
  "podcast",
  "video",
  "slideshow",
  "large-print",
] as const;
export type ContentFormat = (typeof CONTENT_FORMATS)[number];

export const CONTENT_FORMAT_LABELS: Record<ContentFormat, string> = {
  "in-person": "In-person class",
  pdf: "PDF",
  audio: "Audiobook",
  podcast: "Podcast",
  video: "Video",
  slideshow: "Interactive slideshow",
  "large-print": "Large print",
};

export const LANGUAGES = [
  "en",
  "es",
  "so",
  "ar",
  "ne",
  "fr",
  "sw",
  "zh",
] as const;
export type LanguageCode = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: "English",
  es: "Spanish",
  so: "Somali",
  ar: "Arabic",
  ne: "Nepali",
  fr: "French",
  sw: "Swahili",
  zh: "Chinese",
};

/** The program tracks a participant may be on (drives recommendations). */
export const TRACKS = [
  "first-time-buyer",
  "foreclosure-prevention",
  "credit-repair",
  "post-purchase",
  "financial-coaching",
  "rental-stability",
] as const;
export type Track = (typeof TRACKS)[number];

export const TRACK_LABELS: Record<Track, string> = {
  "first-time-buyer": "First-Time Homebuyer",
  "foreclosure-prevention": "Foreclosure Prevention",
  "credit-repair": "Credit Repair",
  "post-purchase": "Post-Purchase",
  "financial-coaching": "Financial Coaching",
  "rental-stability": "Rental Stability",
};

export interface CurriculumModule {
  id: string;
  name: string;
  phase: string;
  track: Track;
  hasTest: boolean;
  /** Formats this module's content is published in (for distribution). */
  formats: ContentFormat[];
}

export interface CurriculumPhase {
  id: string;
  name: string;
  track: Track;
  order: number;
}

export const PHASES: CurriculumPhase[] = [
  { id: "pre-purchase", name: "Pre-Purchase Homebuyer Education", track: "first-time-buyer", order: 1 },
  { id: "financial", name: "Financial Coaching & Credit", track: "financial-coaching", order: 2 },
  { id: "foreclosure", name: "Foreclosure Prevention", track: "foreclosure-prevention", order: 3 },
  { id: "post-purchase", name: "Post-Purchase Success", track: "post-purchase", order: 4 },
];

export const MODULES: CurriculumModule[] = [
  // Phase 1 — Pre-Purchase Homebuyer Education (HUD curriculum)
  { id: "budgeting", name: "Budgeting & Money Management", phase: "pre-purchase", track: "first-time-buyer", hasTest: true, formats: ["in-person", "pdf", "audio", "slideshow"] },
  { id: "credit-basics", name: "Understanding Credit & Your Score", phase: "pre-purchase", track: "first-time-buyer", hasTest: true, formats: ["in-person", "pdf", "audio", "podcast", "slideshow"] },
  { id: "mortgages", name: "Understanding Mortgages & Financing", phase: "pre-purchase", track: "first-time-buyer", hasTest: true, formats: ["in-person", "pdf", "video", "slideshow"] },
  { id: "shopping", name: "Shopping for a Home", phase: "pre-purchase", track: "first-time-buyer", hasTest: true, formats: ["in-person", "pdf", "slideshow"] },
  { id: "closing", name: "The Closing Process", phase: "pre-purchase", track: "first-time-buyer", hasTest: true, formats: ["in-person", "pdf", "audio", "slideshow"] },

  // Phase 2 — Financial Coaching & Credit
  { id: "debt-reduction", name: "Debt Reduction Strategies", phase: "financial", track: "credit-repair", hasTest: false, formats: ["in-person", "pdf", "audio"] },
  { id: "building-savings", name: "Building Savings & Emergency Funds", phase: "financial", track: "financial-coaching", hasTest: false, formats: ["in-person", "pdf", "audio", "podcast"] },
  { id: "credit-repair", name: "Repairing & Building Credit", phase: "financial", track: "credit-repair", hasTest: true, formats: ["in-person", "pdf", "video", "slideshow"] },

  // Phase 3 — Foreclosure Prevention
  { id: "default-basics", name: "Understanding Mortgage Default", phase: "foreclosure", track: "foreclosure-prevention", hasTest: false, formats: ["in-person", "pdf", "audio"] },
  { id: "loss-mitigation", name: "Loss Mitigation Options", phase: "foreclosure", track: "foreclosure-prevention", hasTest: true, formats: ["in-person", "pdf", "slideshow"] },
  { id: "servicer", name: "Working with Your Servicer", phase: "foreclosure", track: "foreclosure-prevention", hasTest: false, formats: ["in-person", "pdf", "audio"] },

  // Phase 4 — Post-Purchase Success
  { id: "home-maintenance", name: "Home Maintenance Basics", phase: "post-purchase", track: "post-purchase", hasTest: false, formats: ["in-person", "pdf", "video"] },
  { id: "avoid-predatory", name: "Avoiding Predatory Refinancing", phase: "post-purchase", track: "post-purchase", hasTest: false, formats: ["in-person", "pdf", "audio", "podcast"] },
  { id: "building-equity", name: "Building & Protecting Equity", phase: "post-purchase", track: "post-purchase", hasTest: false, formats: ["in-person", "pdf", "slideshow"] },
];

export function modulesForPhase(phaseId: string): CurriculumModule[] {
  return MODULES.filter((m) => m.phase === phaseId);
}

export function getModule(id: string): CurriculumModule | undefined {
  return MODULES.find((m) => m.id === id);
}

export function getPhase(id: string): CurriculumPhase | undefined {
  return PHASES.find((p) => p.id === id);
}
