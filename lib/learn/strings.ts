import type { Localized } from "./content";

/**
 * UI copy for the learner course, in every supported language. Kept separate
 * from lesson content so buttons/labels translate alongside the material and the
 * whole experience (including right-to-left Arabic) stays fully localized.
 */
export const UI: Record<string, Localized> = {
  // Course home
  courseHomeKicker: {
    en: "Free • HUD-Approved Homebuyer Education",
    es: "Gratis • Educación para compradores aprobada por HUD",
    ar: "مجاناً • تعليم لمشتري المنازل معتمد من HUD",
  },
  courseHomeTitle: {
    en: "Homebuyer Education — learn at your own pace",
    es: "Educación para compradores: aprende a tu ritmo",
    ar: "تعليم مشتري المنازل - تعلّم وفق وتيرتك الخاصة",
  },
  courseHomeBody: {
    en: "Four short classes take you from managing money to closing on your home. Read it, or press Listen and follow along — in English, Spanish, or Arabic. Pass the test to earn your certificate.",
    es: "Cuatro clases breves te llevan desde manejar tu dinero hasta cerrar la compra de tu casa. Léelo o presiona Escuchar y sigue la lección, en inglés, español o árabe. Aprueba la prueba para obtener tu certificado.",
    ar: "أربع دروس قصيرة تأخذك من إدارة المال إلى إتمام شراء منزلك. اقرأه، أو اضغط استمع وتابع الدرس - بالإنجليزية أو الإسبانية أو العربية. اجتَز الاختبار لتحصل على شهادتك.",
  },
  startClass: { en: "Start class", es: "Comenzar clase", ar: "ابدأ الدرس" },
  comingSoon: { en: "Coming soon", es: "Próximamente", ar: "قريباً" },
  minutes: { en: "min", es: "min", ar: "دقيقة" },

  // Player chrome
  language: { en: "Language", es: "Idioma", ar: "اللغة" },
  listen: { en: "Listen", es: "Escuchar", ar: "استمع" },
  stop: { en: "Stop", es: "Detener", ar: "إيقاف" },
  keyTerms: { en: "Key terms", es: "Términos clave", ar: "مصطلحات أساسية" },
  whyItMatters: {
    en: "Why it matters",
    es: "Por qué importa",
    ar: "لماذا يهمّ ذلك",
  },
  back: { en: "Back", es: "Atrás", ar: "رجوع" },
  next: { en: "Next", es: "Siguiente", ar: "التالي" },
  lessonProgress: {
    // Filled in with numbers at render time: "Lesson {n} of {total}"
    en: "Lesson {n} of {total}",
    es: "Lección {n} de {total}",
    ar: "الدرس {n} من {total}",
  },

  // Quiz
  testTitle: {
    en: "Class Test",
    es: "Prueba de la clase",
    ar: "اختبار الدرس",
  },
  testIntro: {
    en: "Answer these questions to check what you learned. You need 70% to pass — you can retake it as many times as you need.",
    es: "Responde estas preguntas para comprobar lo que aprendiste. Necesitas 70% para aprobar y puedes repetirla las veces que necesites.",
    ar: "أجب عن هذه الأسئلة للتحقق مما تعلّمته. تحتاج إلى 70% للنجاح - ويمكنك إعادة المحاولة بقدر ما تحتاج.",
  },
  startTest: {
    en: "Start the test",
    es: "Comenzar la prueba",
    ar: "ابدأ الاختبار",
  },
  reviewLessons: {
    en: "Review the lessons",
    es: "Repasar las lecciones",
    ar: "مراجعة الدروس",
  },
  submitTest: { en: "Submit test", es: "Enviar prueba", ar: "إرسال الاختبار" },
  answerAll: {
    en: "Answer every question to submit",
    es: "Responde todas las preguntas para enviar",
    ar: "أجب عن كل الأسئلة لتتمكن من الإرسال",
  },
  scoring: { en: "Scoring…", es: "Calificando…", ar: "جارٍ التقييم…" },
  passed: {
    en: "You passed!",
    es: "¡Aprobaste!",
    ar: "لقد نجحت!",
  },
  notPassed: {
    en: "Not passed yet",
    es: "Aún no aprobaste",
    ar: "لم تنجح بعد",
  },
  correctOf: {
    // "{correct} of {total} correct"
    en: "{correct} of {total} correct",
    es: "{correct} de {total} correctas",
    ar: "{correct} من {total} صحيحة",
  },
  notPassedHelp: {
    en: "Review the material and try again — there's no limit on attempts.",
    es: "Repasa el material e inténtalo de nuevo: no hay límite de intentos.",
    ar: "راجع المادة وحاول مرة أخرى - لا يوجد حدّ لعدد المحاولات.",
  },
  retake: { en: "Retake the test", es: "Repetir la prueba", ar: "إعادة الاختبار" },

  // Certificate
  certEarnedTitle: {
    en: "Class complete — certificate earned!",
    es: "¡Clase completada: certificado obtenido!",
    ar: "اكتمل الدرس - حصلت على الشهادة!",
  },
  certNamePrompt: {
    en: "Enter your full name as it should appear on your certificate:",
    es: "Escribe tu nombre completo como debe aparecer en tu certificado:",
    ar: "أدخل اسمك الكامل كما يجب أن يظهر على شهادتك:",
  },
  certNamePlaceholder: {
    en: "Your full name",
    es: "Tu nombre completo",
    ar: "اسمك الكامل",
  },
  certHeading: {
    en: "Certificate of Completion",
    es: "Certificado de finalización",
    ar: "شهادة إتمام",
  },
  certPresentedTo: {
    en: "This certifies that",
    es: "Esto certifica que",
    ar: "تشهد هذه الوثيقة بأن",
  },
  certCompleted: {
    en: "has successfully completed",
    es: "ha completado con éxito",
    ar: "قد أتمّ بنجاح",
  },
  certProgram: {
    en: "Benjamin Rose Housing • HUD-Approved Homebuyer Education",
    es: "Benjamin Rose Housing • Educación para compradores aprobada por HUD",
    ar: "Benjamin Rose Housing • تعليم لمشتري المنازل معتمد من HUD",
  },
  certDate: { en: "Date", es: "Fecha", ar: "التاريخ" },
  certId: { en: "Certificate ID", es: "ID del certificado", ar: "معرّف الشهادة" },
  certFootnote: {
    en: "Complete all four days to earn your full HUD Homebuyer Education certificate, which can unlock down-payment assistance.",
    es: "Completa los cuatro días para obtener tu certificado completo de Educación para Compradores de HUD, que puede desbloquear ayuda para el pago inicial.",
    ar: "أكمل الأيام الأربعة جميعها للحصول على شهادتك الكاملة لتعليم مشتري المنازل المعتمدة من HUD، والتي يمكن أن تفتح لك المساعدة في الدفعة الأولى.",
  },
  print: {
    en: "Print / Save as PDF",
    es: "Imprimir / Guardar como PDF",
    ar: "طباعة / حفظ بصيغة PDF",
  },

  // Next-step handoff
  nextStepTitle: {
    en: "Your next step: down-payment assistance",
    es: "Tu siguiente paso: ayuda para el pago inicial",
    ar: "خطوتك التالية: المساعدة في الدفعة الأولى",
  },
  nextStepBody: {
    en: "Completing your homebuyer education can unlock thousands of dollars in down-payment help. See what you may qualify for and connect with a counselor.",
    es: "Completar tu educación para compradores puede desbloquear miles de dólares en ayuda para el pago inicial. Mira para qué puedes calificar y conéctate con un asesor.",
    ar: "إكمال تعليمك كمشترٍ للمنزل قد يفتح لك آلاف الدولارات من المساعدة في الدفعة الأولى. اطّلع على ما قد تتأهل له وتواصل مع مستشار.",
  },
  findAssistance: {
    en: "Find assistance I may qualify for",
    es: "Buscar la ayuda para la que puedo calificar",
    ar: "ابحث عن المساعدة التي قد أتأهل لها",
  },
  continueLater: {
    en: "Back to all classes",
    es: "Volver a todas las clases",
    ar: "العودة إلى جميع الدروس",
  },

  // Tabs
  tabLessons: { en: "Lessons", es: "Lecciones", ar: "الدروس" },
  tabPodcast: { en: "Podcast", es: "Pódcast", ar: "بودكاست" },
  tabCoach: { en: "Ask AI", es: "Pregunta a la IA", ar: "اسأل الذكاء الاصطناعي" },

  // Podcast
  podcastTitle: {
    en: "Interactive Podcast",
    es: "Pódcast interactivo",
    ar: "بودكاست تفاعلي",
  },
  podcastIntro: {
    en: "Two hosts walk you through the module. Pause anytime to ask the AI Coach a question — then keep listening.",
    es: "Dos presentadores te explican el módulo. Pausa cuando quieras para preguntarle al Coach de IA y luego sigue escuchando.",
    ar: "يشرح لك مُقدّمان الوحدة. أوقِف مؤقتاً في أي وقت لتسأل مدرّب الذكاء الاصطناعي، ثم تابِع الاستماع.",
  },
  podcastEnglishNote: {
    en: "Podcast audio is in English; the lessons and quiz are available in all languages.",
    es: "El audio del pódcast está en inglés; las lecciones y la prueba están en todos los idiomas.",
    ar: "صوت البودكاست بالإنجليزية؛ أما الدروس والاختبار فمتوفّرة بجميع اللغات.",
  },
  play: { en: "Play", es: "Reproducir", ar: "تشغيل" },
  pause: { en: "Pause", es: "Pausa", ar: "إيقاف مؤقت" },
  restart: { en: "Restart", es: "Reiniciar", ar: "إعادة التشغيل" },
  askCoachBtn: {
    en: "Pause & ask a question",
    es: "Pausar y hacer una pregunta",
    ar: "إيقاف وطرح سؤال",
  },

  // Coach
  coachTitle: { en: "Ask the AI Coach", es: "Pregúntale al Coach de IA", ar: "اسأل مدرّب الذكاء الاصطناعي" },
  coachIntro: {
    en: "Stuck on something? Ask anything about the course — budgeting, credit, mortgages, inspections, or insurance — and I'll help you get ready for the test.",
    es: "¿Tienes una duda? Pregunta lo que quieras sobre el curso —presupuesto, crédito, hipotecas, inspecciones o seguros— y te ayudo a prepararte para la prueba.",
    ar: "هل توقّفت عند نقطة ما؟ اسأل أي شيء عن الكورس - الميزانية أو الائتمان أو الرهن أو الفحص أو التأمين - وسأساعدك على الاستعداد للاختبار.",
  },
  coachPlaceholder: {
    en: "Type your question…",
    es: "Escribe tu pregunta…",
    ar: "اكتب سؤالك…",
  },
  send: { en: "Send", es: "Enviar", ar: "إرسال" },
  coachThinking: { en: "Coach is thinking…", es: "El Coach está pensando…", ar: "المدرّب يفكّر…" },
  coachDisclaimer: {
    en: "Coach explains course concepts and won't reveal exact test answers. For personal advice, talk to a Benjamin Rose counselor.",
    es: "El Coach explica los conceptos del curso y no revela las respuestas exactas de la prueba. Para consejo personal, habla con un asesor de Benjamin Rose.",
    ar: "يشرح المدرّب مفاهيم الكورس ولا يكشف إجابات الاختبار الدقيقة. للحصول على نصيحة شخصية، تحدّث مع مستشار من Benjamin Rose.",
  },
  suggested: { en: "Try asking:", es: "Prueba a preguntar:", ar: "جرّب أن تسأل:" },

  // Budget calculator
  calcTitle: {
    en: "Try it: Budget calculator",
    es: "Pruébalo: Calculadora de presupuesto",
    ar: "جرّبها: حاسبة الميزانية",
  },
  calcIncome: {
    en: "Your gross monthly income",
    es: "Tu ingreso mensual bruto",
    ar: "دخلك الشهري الإجمالي",
  },
  calcHousing: {
    en: "Suggested max for housing (30%)",
    es: "Máximo sugerido para vivienda (30%)",
    ar: "الحد الأقصى المقترح للسكن (30%)",
  },
  calcNeeds: { en: "Needs (50%)", es: "Necesidades (50%)", ar: "الاحتياجات (50%)" },
  calcWants: { en: "Wants (30%)", es: "Gustos (30%)", ar: "الرغبات (30%)" },
  calcSavings: { en: "Savings & debt (20%)", es: "Ahorro y deudas (20%)", ar: "الادخار والديون (20%)" },
  calcHint: {
    en: "A common starting point is the 50/30/20 plan. Adjust your income to see the targets.",
    es: "Un buen punto de partida es el plan 50/30/20. Ajusta tu ingreso para ver las metas.",
    ar: "نقطة انطلاق شائعة هي خطة 50/30/20. عدّل دخلك لترى الأهداف.",
  },

  // Progress / gamification
  xp: { en: "XP", es: "XP", ar: "نقاط" },
  lessonsDone: { en: "lessons read", es: "lecciones leídas", ar: "دروس مقروءة" },
};

/** Fill simple {token} placeholders in a localized string. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
