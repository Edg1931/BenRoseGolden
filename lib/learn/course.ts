import type { Lesson, Localized } from "./content";
import { DAY1_LESSONS, DAY1_SECTIONS } from "./content";
import { DAY2_LESSONS, DAY2_SECTIONS } from "./day2";
import { DAY3_LESSONS, DAY3_SECTIONS } from "./day3";
import { DAY4_LESSONS, DAY4_SECTIONS } from "./day4";

/**
 * The 4-day course registry — the single map the learner routes, quizzes,
 * podcasts, and progress tracking all key off. Day order mirrors the in-person
 * class series the content was authored from.
 */

export interface CourseDay {
  slug: string;
  order: number;
  /** English title/blurb for cards & metadata (lesson content is trilingual). */
  title: string;
  blurb: string;
  icon: string;
  /** Original class slide deck (public path) — viewable & downloadable. */
  pdf: string;
  sections: Record<string, Localized>;
  lessons: Lesson[];
}

export const COURSE_DAYS: CourseDay[] = [
  {
    slug: "day-1",
    order: 1,
    title: "Money Management & Understanding Credit",
    blurb: "Build a budget, understand your expenses, and learn how credit reports and scores really work.",
    icon: "💰",
    pdf: "/materials/day-1-money-management-credit.pdf",
    sections: DAY1_SECTIONS,
    lessons: DAY1_LESSONS,
  },
  {
    slug: "day-2",
    order: 2,
    title: "Obtaining a Mortgage & Know Your Rights",
    blurb: "How mortgages work, what you can afford (the 29/41 rule), the homebuying team, and your rights as a borrower.",
    icon: "🏦",
    pdf: "/materials/day-2-mortgage-rights.pdf",
    sections: DAY2_SECTIONS,
    lessons: DAY2_LESSONS,
  },
  {
    slug: "day-3",
    order: 3,
    title: "Shopping for a Home & Home Inspection",
    blurb: "House-hunting with a plan, making an offer, escrow, and what the inspection protects you from.",
    icon: "🔍",
    pdf: "/materials/day-3-shopping-inspection.pdf",
    sections: DAY3_SECTIONS,
    lessons: DAY3_LESSONS,
  },
  {
    slug: "day-4",
    order: 4,
    title: "Home Insurance Basics & Home Maintenance",
    blurb: "Protect your investment with the right insurance, a seasonal maintenance routine, and smart improvements.",
    icon: "🛡️",
    pdf: "/materials/day-4-insurance-maintenance.pdf",
    sections: DAY4_SECTIONS,
    lessons: DAY4_LESSONS,
  },
];

export function getDay(slug: string): CourseDay | undefined {
  return COURSE_DAYS.find((d) => d.slug === slug);
}

/** Localized display title per day for the player header / certificate. */
export const DAY_TITLES: Record<string, Localized> = {
  "day-1": {
    en: "Day 1 — Money Management & Understanding Credit",
    es: "Día 1 — Manejo del dinero y entender el crédito",
    ar: "اليوم الأول - إدارة المال وفهم الائتمان",
  },
  "day-2": {
    en: "Day 2 — Obtaining a Mortgage & Know Your Rights",
    es: "Día 2 — Obtener una hipoteca y conocer tus derechos",
    ar: "اليوم الثاني - الحصول على رهن عقاري ومعرفة حقوقك",
  },
  "day-3": {
    en: "Day 3 — Shopping for a Home & Home Inspection",
    es: "Día 3 — Buscar casa e inspección de la vivienda",
    ar: "اليوم الثالث - البحث عن منزل وفحصه",
  },
  "day-4": {
    en: "Day 4 — Home Insurance Basics & Home Maintenance",
    es: "Día 4 — Seguro de vivienda y mantenimiento del hogar",
    ar: "اليوم الرابع - أساسيات تأمين المنزل وصيانته",
  },
};
