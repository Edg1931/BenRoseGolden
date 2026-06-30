import type { Localized } from "./content";
import type { Participant } from "@/lib/participants/schema";

/**
 * Personalizes the course to a learner's situation using the financial and goal
 * data on their profile. Pure + trilingual: each tip carries en/es/ar so it
 * renders in the learner's chosen language. Shown on the course home and atop
 * each day so the classes speak to *their* path to a home.
 */

export interface TailorTip {
  id: string;
  icon: string;
  text: Localized;
}

export interface Tailoring {
  firstName: string;
  tips: TailorTip[];
  /** True when we have little financial data and should nudge them to add it. */
  needsProfile: boolean;
}

const LOW_CREDIT = new Set(["below-580", "580-639"]);
const OK_CREDIT = new Set(["640-699", "700-749", "750-plus"]);

export function buildTailoring(p: Participant): Tailoring {
  const tips: TailorTip[] = [];
  const h = p.household;
  const firstTime = h.firstTimeBuyer ?? p.tracks.includes("first-time-buyer");

  if (LOW_CREDIT.has(h.creditBand)) {
    tips.push({
      id: "credit-build",
      icon: "📈",
      text: {
        en: "Your credit is your biggest opportunity right now. Focus on the credit lessons — reaching a 640 score unlocks most Ohio down-payment programs (OHFA).",
        es: "Tu crédito es tu mayor oportunidad ahora. Concéntrate en las lecciones de crédito: llegar a 640 desbloquea la mayoría de los programas de ayuda de Ohio (OHFA).",
        ar: "ائتمانك هو أكبر فرصة لك الآن. ركّز على دروس الائتمان - الوصول إلى درجة 640 يفتح معظم برامج المساعدة في أوهايو (OHFA).",
      },
    });
  } else if (OK_CREDIT.has(h.creditBand)) {
    tips.push({
      id: "credit-ready",
      icon: "✅",
      text: {
        en: "Your credit likely already meets OHFA's ~640 threshold — a real advantage. Use the mortgage lessons to shop confidently for the best rate.",
        es: "Tu crédito probablemente ya cumple el umbral de ~640 de OHFA, una verdadera ventaja. Usa las lecciones de hipotecas para buscar la mejor tasa con confianza.",
        ar: "ائتمانك على الأرجح يستوفي عتبة OHFA البالغة ~640 - ميزة حقيقية. استخدم دروس الرهن للبحث بثقة عن أفضل سعر.",
      },
    });
  }

  if (firstTime) {
    tips.push({
      id: "first-time",
      icon: "🏡",
      text: {
        en: "As a first-time buyer, you may qualify for OHFA first-time programs and down-payment assistance — the mortgage and assistance lessons are especially for you.",
        es: "Como comprador por primera vez, podrías calificar para programas de OHFA y ayuda para el pago inicial: las lecciones de hipoteca y ayuda son especialmente para ti.",
        ar: "بصفتك مشترياً لأول مرة، قد تتأهل لبرامج OHFA والمساعدة في الدفعة الأولى - دروس الرهن والمساعدة مخصّصة لك بشكل خاص.",
      },
    });
  }

  if (p.tracks.includes("foreclosure-prevention")) {
    tips.push({
      id: "foreclosure",
      icon: "🛟",
      text: {
        en: "You told us keeping your home is a priority. A Benjamin Rose counselor can help you with options today — don't wait.",
        es: "Nos dijiste que mantener tu casa es una prioridad. Un asesor de Benjamin Rose puede ayudarte con opciones hoy mismo, no esperes.",
        ar: "أخبرتنا أن الحفاظ على منزلك أولوية. يمكن لمستشار Benjamin Rose مساعدتك في الخيارات اليوم - لا تنتظر.",
      },
    });
  }

  // Low down payment likely → FHA is the natural fit.
  if (firstTime && (LOW_CREDIT.has(h.creditBand) || h.creditBand === "640-699")) {
    tips.push({
      id: "fha",
      icon: "🏛️",
      text: {
        en: "An FHA loan lets you buy with as little as 3.5% down at a 580+ score. Try the FHA toggle in the payment calculator (Day 2) to see your real numbers.",
        es: "Un préstamo FHA te permite comprar con tan poco como 3.5% de inicial con puntaje de 580+. Prueba la opción FHA en la calculadora de pagos (Día 2).",
        ar: "يتيح لك قرض FHA الشراء بدفعة أولى تصل إلى 3.5% بدرجة 580+. جرّب خيار FHA في حاسبة الدفعات (اليوم 2).",
      },
    });
  }

  const needsProfile =
    h.creditBand === "unknown" && h.annualIncome == null && !p.address?.city;
  if (needsProfile) {
    tips.push({
      id: "complete-profile",
      icon: "🔓",
      text: {
        en: "Add your income, location, and credit to your profile to unlock the down-payment assistance you may qualify for.",
        es: "Agrega tu ingreso, ubicación y crédito a tu perfil para desbloquear la ayuda para el pago inicial a la que podrías calificar.",
        ar: "أضف دخلك وموقعك وائتمانك إلى ملفك لفتح المساعدة في الدفعة الأولى التي قد تتأهل لها.",
      },
    });
  }

  return { firstName: p.firstName, tips: tips.slice(0, 3), needsProfile };
}
