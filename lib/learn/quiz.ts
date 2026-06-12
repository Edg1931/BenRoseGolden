import { getQuiz, publicQuiz, QUIZ_PASS_THRESHOLD } from "@/lib/participants/quiz";
import type { PublicQuizQuestion } from "@/lib/participants/quiz";
import type { Localized } from "./content";

/**
 * Day 1 test = the existing `budgeting` + `credit-basics` module quizzes,
 * combined into one learner-facing test. Questions and the answer key come
 * straight from lib/participants/quiz.ts so there's a single source of truth;
 * this module only adds the day→modules mapping, combined scoring, and
 * translations of the on-screen question/option text (scoring is by option
 * index, so translations are presentation only).
 */

export const DAY1_MODULES = ["budgeting", "credit-basics"] as const;

/** English questions with NO answer key, safe to send to the browser. */
export function day1PublicQuestions(): PublicQuizQuestion[] {
  return DAY1_MODULES.flatMap((m) => {
    const q = getQuiz(m);
    return q ? publicQuiz(q) : [];
  });
}

export interface Day1QuizResult {
  score: number;
  correct: number;
  total: number;
  passed: boolean;
}

/** Score combined Day 1 answers (questionId → chosen option index) server-side. */
export function scoreDay1(answers: Record<string, number>): Day1QuizResult {
  const questions = DAY1_MODULES.flatMap((m) => getQuiz(m) ?? []);
  const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const total = questions.length;
  const score = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { score, correct, total, passed: score >= QUIZ_PASS_THRESHOLD };
}

export { QUIZ_PASS_THRESHOLD };

/**
 * Translations of each question and its options, keyed by question id. Option
 * arrays MUST stay in the same order as lib/participants/quiz.ts so the chosen
 * index still maps to the correct answer. English is read from the source bank.
 */
export interface QuizI18n {
  question: Localized;
  options: Localized[];
}

export const DAY1_QUIZ_I18N: Record<string, QuizI18n> = {
  "budgeting-1": {
    question: {
      en: "A monthly budget is best described as a plan that…",
      es: "Un presupuesto mensual se describe mejor como un plan que…",
      ar: "تُوصَف الميزانية الشهرية على أفضل وجه بأنها خطة…",
    },
    options: [
      {
        en: "Tracks only your debts",
        es: "Solo registra tus deudas",
        ar: "تتعقّب ديونك فقط",
      },
      {
        en: "Gives every dollar of income a job across spending, saving, and debt",
        es: "Le da una tarea a cada dólar de ingreso entre gastos, ahorros y deudas",
        ar: "تُعطي كل دولار من الدخل مهمة بين الإنفاق والادخار وسداد الديون",
      },
      {
        en: "Is only needed when you fall behind on bills",
        es: "Solo se necesita cuando te atrasas en las cuentas",
        ar: "لا تلزم إلا عندما تتأخر عن سداد الفواتير",
      },
      {
        en: "Replaces the need for an emergency fund",
        es: "Reemplaza la necesidad de un fondo de emergencia",
        ar: "تُغني عن الحاجة إلى صندوق طوارئ",
      },
    ],
  },
  "budgeting-2": {
    question: {
      en: "Which expense is a FIXED cost in most household budgets?",
      es: "¿Qué gasto es un costo FIJO en la mayoría de los presupuestos del hogar?",
      ar: "أي مصروف يُعدّ تكلفة ثابتة في معظم ميزانيات الأسرة؟",
    },
    options: [
      { en: "Groceries", es: "Comida del supermercado", ar: "مشتريات البقالة" },
      {
        en: "Rent or mortgage payment",
        es: "Pago de alquiler o hipoteca",
        ar: "دفعة الإيجار أو الرهن العقاري",
      },
      { en: "Dining out", es: "Comer fuera", ar: "تناول الطعام في الخارج" },
      { en: "Gas for the car", es: "Gasolina para el auto", ar: "وقود السيارة" },
    ],
  },
  "budgeting-3": {
    question: {
      en: "A common guideline for keeping housing affordable is to spend no more than about…",
      es: "Una guía común para mantener la vivienda accesible es no gastar más de aproximadamente…",
      ar: "من القواعد الشائعة لإبقاء السكن في حدود القدرة المالية ألّا تُنفق أكثر من نحو…",
    },
    options: [
      {
        en: "10% of gross monthly income on housing",
        es: "10% del ingreso mensual bruto en vivienda",
        ar: "10% من الدخل الشهري الإجمالي على السكن",
      },
      {
        en: "30% of gross monthly income on housing",
        es: "30% del ingreso mensual bruto en vivienda",
        ar: "30% من الدخل الشهري الإجمالي على السكن",
      },
      {
        en: "60% of gross monthly income on housing",
        es: "60% del ingreso mensual bruto en vivienda",
        ar: "60% من الدخل الشهري الإجمالي على السكن",
      },
      {
        en: "There is no guideline",
        es: "No hay ninguna guía",
        ar: "لا توجد قاعدة",
      },
    ],
  },
  "budgeting-4": {
    question: {
      en: "The first step when your expenses are higher than your income is to…",
      es: "El primer paso cuando tus gastos son mayores que tus ingresos es…",
      ar: "الخطوة الأولى عندما تكون مصروفاتك أعلى من دخلك هي…",
    },
    options: [
      {
        en: "Take out a payday loan",
        es: "Sacar un préstamo de día de pago",
        ar: "الحصول على قرض حتى يوم الراتب",
      },
      {
        en: "Ignore it until next month",
        es: "Ignorarlo hasta el próximo mes",
        ar: "تجاهل الأمر حتى الشهر التالي",
      },
      {
        en: "Track spending to find and cut non-essential costs",
        es: "Registrar los gastos para encontrar y recortar costos no esenciales",
        ar: "تتبّع الإنفاق لاكتشاف التكاليف غير الضرورية وتقليصها",
      },
      {
        en: "Stop paying your rent",
        es: "Dejar de pagar el alquiler",
        ar: "التوقف عن دفع الإيجار",
      },
    ],
  },
  "credit-basics-1": {
    question: {
      en: "Which factor has the LARGEST impact on a typical credit score?",
      es: "¿Qué factor tiene el MAYOR impacto en un puntaje de crédito típico?",
      ar: "أي عامل له الأثر الأكبر في الدرجة الائتمانية المعتادة؟",
    },
    options: [
      { en: "Payment history", es: "Historial de pagos", ar: "سجلّ المدفوعات" },
      {
        en: "Number of credit cards",
        es: "Cantidad de tarjetas de crédito",
        ar: "عدد البطاقات الائتمانية",
      },
      { en: "Your income", es: "Tus ingresos", ar: "دخلك" },
      { en: "Your age", es: "Tu edad", ar: "عمرك" },
    ],
  },
  "credit-basics-2": {
    question: {
      en: "Credit utilization refers to…",
      es: "El uso del crédito se refiere a…",
      ar: "يشير معدّل استخدام الائتمان إلى…",
    },
    options: [
      {
        en: "How long you've had credit",
        es: "Cuánto tiempo has tenido crédito",
        ar: "مدّة امتلاكك للائتمان",
      },
      {
        en: "The share of your available revolving credit you're using",
        es: "La parte de tu crédito rotativo disponible que estás usando",
        ar: "نسبة ما تستخدمه من ائتمانك المتجدّد المتاح",
      },
      {
        en: "How many times you check your score",
        es: "Cuántas veces revisas tu puntaje",
        ar: "عدد مرات اطّلاعك على درجتك",
      },
      {
        en: "The interest rate on your loans",
        es: "La tasa de interés de tus préstamos",
        ar: "سعر الفائدة على قروضك",
      },
    ],
  },
  "credit-basics-3": {
    question: {
      en: "How often can you get a free copy of your credit report from each major bureau?",
      es: "¿Con qué frecuencia puedes obtener una copia gratis de tu informe de crédito de cada agencia principal?",
      ar: "كم مرة يمكنك الحصول على نسخة مجانية من تقرير ائتمانك من كل وكالة رئيسية؟",
    },
    options: [
      { en: "Never", es: "Nunca", ar: "أبداً" },
      { en: "Only if you pay", es: "Solo si pagas", ar: "فقط إذا دفعت" },
      {
        en: "At least once a year",
        es: "Al menos una vez al año",
        ar: "مرة واحدة سنوياً على الأقل",
      },
      {
        en: "Once every five years",
        es: "Una vez cada cinco años",
        ar: "مرة كل خمس سنوات",
      },
    ],
  },
  "credit-basics-4": {
    question: {
      en: "The best way to keep utilization low and protect your score is to…",
      es: "La mejor manera de mantener bajo el uso del crédito y proteger tu puntaje es…",
      ar: "أفضل طريقة لإبقاء معدّل الاستخدام منخفضاً وحماية درجتك هي…",
    },
    options: [
      {
        en: "Close old accounts",
        es: "Cerrar las cuentas antiguas",
        ar: "إغلاق الحسابات القديمة",
      },
      {
        en: "Max out one card and pay the others",
        es: "Llenar una tarjeta al máximo y pagar las demás",
        ar: "استنفاد بطاقة واحدة بالكامل ودفع البقية",
      },
      {
        en: "Keep balances well below your limits and pay on time",
        es: "Mantener los saldos muy por debajo de tus límites y pagar a tiempo",
        ar: "إبقاء الأرصدة أدنى بكثير من حدودك والدفع في الموعد",
      },
      {
        en: "Apply for several new cards at once",
        es: "Solicitar varias tarjetas nuevas a la vez",
        ar: "التقدّم بطلب عدة بطاقات جديدة دفعة واحدة",
      },
    ],
  },
};
