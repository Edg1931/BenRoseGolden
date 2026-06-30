import type { LearnLang } from "@/lib/learn/content";

/**
 * Copy for the PUBLIC funnel (marketing, learner sign-up/sign-in, assistance
 * finder) in English / Spanish / Arabic — so the whole front door speaks the
 * visitor's language, not just the lessons. Keyed strings; use t(lang, key).
 */
export type L = Record<LearnLang, string>;

export const PUB: Record<string, L> = {
  // ── Learner auth ──────────────────────────────────────────────────────────
  authSignupTitle: { en: "Create your free profile", es: "Crea tu perfil gratuito", ar: "أنشئ ملفك المجاني" },
  authSigninTitle: { en: "Welcome back", es: "Bienvenido de nuevo", ar: "مرحباً بعودتك" },
  authSignupSub: {
    en: "Save your progress across all four classes, earn your certificate, and see the down-payment assistance you may qualify for.",
    es: "Guarda tu progreso en las cuatro clases, obtén tu certificado y descubre la ayuda para el pago inicial a la que puedes calificar.",
    ar: "احفظ تقدّمك في الدروس الأربعة، واحصل على شهادتك، واطّلع على المساعدة في الدفعة الأولى التي قد تتأهل لها.",
  },
  authSigninSub: {
    en: "Sign in to pick up your classes where you left off.",
    es: "Inicia sesión para continuar tus clases donde las dejaste.",
    ar: "سجّل الدخول لمتابعة دروسك من حيث توقّفت.",
  },
  firstName: { en: "First name", es: "Nombre", ar: "الاسم الأول" },
  lastName: { en: "Last name", es: "Apellido", ar: "اسم العائلة" },
  email: { en: "Email", es: "Correo electrónico", ar: "البريد الإلكتروني" },
  password: { en: "Password", es: "Contraseña", ar: "كلمة المرور" },
  passwordHint: { en: "At least 8 characters.", es: "Al menos 8 caracteres.", ar: "‎8 أحرف على الأقل." },
  phone: { en: "Phone", es: "Teléfono", ar: "الهاتف" },
  optional: { en: "(optional)", es: "(opcional)", ar: "(اختياري)" },
  language: { en: "Language", es: "Idioma", ar: "اللغة" },
  unlockMatches: {
    en: "Unlock your assistance matches (optional)",
    es: "Desbloquea tus coincidencias de ayuda (opcional)",
    ar: "افتح المساعدات المطابقة لك (اختياري)",
  },
  unlockHelp: {
    en: "Tell us a little and we'll show the down-payment help you may qualify for. You can add this later, too.",
    es: "Cuéntanos un poco y te mostraremos la ayuda para el pago inicial a la que puedes calificar. También puedes agregarlo más tarde.",
    ar: "أخبرنا قليلاً وسنعرض لك المساعدة في الدفعة الأولى التي قد تتأهل لها. ويمكنك إضافتها لاحقاً أيضاً.",
  },
  city: { en: "City", es: "Ciudad", ar: "المدينة" },
  county: { en: "County", es: "Condado", ar: "المقاطعة" },
  householdSize: { en: "Household size", es: "Tamaño del hogar", ar: "عدد أفراد الأسرة" },
  annualIncome: { en: "Annual income", es: "Ingreso anual", ar: "الدخل السنوي" },
  creditEstimate: { en: "Credit (estimate)", es: "Crédito (estimado)", ar: "الائتمان (تقديري)" },
  firstTimeBuyerQ: { en: "First-time buyer?", es: "¿Comprador por primera vez?", ar: "هل تشتري لأول مرة؟" },
  notSure: { en: "Not sure", es: "No estoy seguro", ar: "غير متأكد" },
  yes: { en: "Yes", es: "Sí", ar: "نعم" },
  no: { en: "No", es: "No", ar: "لا" },
  createStart: { en: "Create profile & start →", es: "Crear perfil y empezar →", ar: "أنشئ الملف وابدأ →" },
  signInBtn: { en: "Sign in →", es: "Iniciar sesión →", ar: "تسجيل الدخول →" },
  pleaseWait: { en: "Please wait…", es: "Por favor espera…", ar: "يرجى الانتظار…" },
  haveProfile: { en: "Already have a profile?", es: "¿Ya tienes un perfil?", ar: "هل لديك ملف بالفعل؟" },
  signInLink: { en: "Sign in", es: "Inicia sesión", ar: "سجّل الدخول" },
  newHere: { en: "New here?", es: "¿Eres nuevo?", ar: "أنت جديد هنا؟" },
  createLink: { en: "Create your free profile", es: "Crea tu perfil gratuito", ar: "أنشئ ملفك المجاني" },
  nonprofitNote: {
    en: "Benjamin Rose is a nonprofit. Your information is used to support your housing goals — never sold.",
    es: "Benjamin Rose es una organización sin fines de lucro. Tu información se usa para apoyar tus metas de vivienda, nunca se vende.",
    ar: "Benjamin Rose منظمة غير ربحية. تُستخدم معلوماتك لدعم أهدافك السكنية - ولا تُباع أبداً.",
  },
  somethingWrong: { en: "Something went wrong", es: "Algo salió mal", ar: "حدث خطأ ما" },
};

export function t(lang: LearnLang, key: keyof typeof PUB): string {
  return PUB[key]?.[lang] ?? PUB[key]?.en ?? String(key);
}
