"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { LearnLang } from "@/lib/learn/content";

type L = Record<LearnLang, string>;

/**
 * Annotated sample Loan Estimate — the standardized 3-page form every lender
 * must give you. Learners tap each section to learn what to check and what a
 * "red flag" looks like, so they can compare lenders and avoid surprises. All
 * numbers are illustrative.
 */
const T = {
  title: { en: "Read a sample Loan Estimate", es: "Lee una Estimación de Préstamo de ejemplo", ar: "اقرأ نموذج تقدير القرض" },
  intro: {
    en: "Every lender must give you this standard form within 3 days of applying. It's how you compare offers fairly. Tap “What to check” on each part.",
    es: "Cada prestamista debe darte este formulario estándar dentro de 3 días de aplicar. Así comparas ofertas con justicia. Toca “Qué revisar” en cada parte.",
    ar: "على كل مُقرض أن يمنحك هذا النموذج القياسي خلال 3 أيام من التقديم. به تقارن العروض بإنصاف. اضغط «ما الذي تتحقق منه» في كل جزء.",
  },
  whatToCheck: { en: "What to check", es: "Qué revisar", ar: "ما الذي تتحقق منه" },
  hide: { en: "Hide", es: "Ocultar", ar: "إخفاء" },
  doc: { en: "Loan Estimate", es: "Estimación de Préstamo", ar: "تقدير القرض" },

  secTerms: { en: "Loan terms", es: "Términos del préstamo", ar: "شروط القرض" },
  termsBody: {
    en: "Confirm the loan amount and rate, and that 'Prepayment penalty' and 'Balloon payment' both say NO. A yes on either can trap you — walk away or ask why.",
    es: "Confirma el monto y la tasa, y que 'Penalización por pago anticipado' y 'Pago globo' digan NO. Un sí en cualquiera puede atraparte: retírate o pregunta por qué.",
    ar: "أكّد مبلغ القرض والفائدة، وأن 'غرامة السداد المبكر' و'الدفعة البالونية' كلاهما 'لا'. فأي 'نعم' قد يوقعك - انسحب أو اسأل عن السبب.",
  },
  secPayment: { en: "Projected payments", es: "Pagos proyectados", ar: "المدفوعات المتوقعة" },
  paymentBody: {
    en: "This is your full monthly payment including taxes and insurance (escrow) — not just principal and interest. Make sure it fits the budget you built in Day 1.",
    es: "Este es tu pago mensual completo con impuestos y seguro (escrow), no solo capital e interés. Asegúrate de que entre en el presupuesto del Día 1.",
    ar: "هذه دفعتك الشهرية الكاملة شاملةً الضرائب والتأمين (الضمان) - وليست أصل القرض والفائدة فقط. تأكّد أنها تناسب ميزانية اليوم الأول.",
  },
  secCosts: { en: "Costs at closing", es: "Costos al cierre", ar: "التكاليف عند الإتمام" },
  costsBody: {
    en: "Closing costs and the total cash you need at closing. Get Loan Estimates from 2–3 lenders the same week and compare these side by side — fees can differ by thousands.",
    es: "Los costos de cierre y el efectivo total que necesitas. Obtén Estimaciones de 2–3 prestamistas la misma semana y compáralas lado a lado: las comisiones pueden variar miles.",
    ar: "تكاليف الإتمام وإجمالي النقد الذي تحتاجه عند الإتمام. احصل على تقديرات من 2–3 مُقرضين في الأسبوع نفسه وقارنها جنباً إلى جنب - فقد تختلف الرسوم بآلاف.",
  },
  secCompare: { en: "Comparisons (APR)", es: "Comparaciones (APR)", ar: "المقارنات (APR)" },
  compareBody: {
    en: "The APR folds the fees into a single yearly rate, so it's the fairest way to compare two loans. A low interest rate with a high APR means high fees — look closely.",
    es: "El APR junta las comisiones en una sola tasa anual, así que es la forma más justa de comparar dos préstamos. Una tasa baja con APR alto significa comisiones altas: míralo de cerca.",
    ar: "يدمج معدّل APR الرسوم في سعر سنوي واحد، فهو أعدل طريقة لمقارنة قرضين. وسعر فائدة منخفض مع APR مرتفع يعني رسوماً عالية - دقّق جيداً.",
  },
} satisfies Record<string, L>;

function Section({ title, body, lang, children }: { title: string; body: string; lang: LearnLang; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const tt = (k: string) => T[k as keyof typeof T][lang];
  return (
    <div className="border-b border-border last:border-b-0">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-plum">{title}</span>
        <button onClick={() => setOpen((o) => !o)}
          className="shrink-0 rounded-full border border-brand-rose px-2.5 py-0.5 text-[11px] font-medium text-brand-rose hover:bg-brand-blush">
          {open ? tt("hide") : `ⓘ ${tt("whatToCheck")}`}
        </button>
      </div>
      <div className="px-3 pb-3">{children}</div>
      {open && <p className="mx-3 mb-3 rounded-md bg-brand-blush px-3 py-2 text-xs leading-relaxed text-brand-plum">{body}</p>}
    </div>
  );
}

function Field({ k, v, ok }: { k: string; v: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className={ok ? "font-medium text-emerald-700" : "font-medium"}>{v}</span>
    </div>
  );
}

export function LoanEstimateExhibit({ lang }: { lang: LearnLang }) {
  const tt = (k: string) => T[k as keyof typeof T][lang];
  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">📑</span>
        <h3 className="font-semibold">{tt("title")}</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{tt("intro")}</p>

      <div className="mt-4 overflow-hidden rounded-lg border-2 border-border">
        <div className="bg-brand-plum px-4 py-2 text-white">
          <p className="text-xs uppercase tracking-wide text-white/70">{tt("doc")}</p>
          <p className="font-semibold">Greater Cleveland Mortgage · 30-year fixed</p>
        </div>
        <Section title={tt("secTerms")} body={tt("termsBody")} lang={lang}>
          <div className="space-y-1">
            <Field k="Loan amount" v="$190,000" />
            <Field k="Interest rate" v="6.5% (fixed)" />
            <Field k="Prepayment penalty" v="NO" ok />
            <Field k="Balloon payment" v="NO" ok />
          </div>
        </Section>
        <Section title={tt("secPayment")} body={tt("paymentBody")} lang={lang}>
          <div className="space-y-1">
            <Field k="Principal & interest" v="$1,201" />
            <Field k="Est. taxes + insurance" v="$385" />
            <Field k="Estimated total monthly" v="$1,586" />
          </div>
        </Section>
        <Section title={tt("secCosts")} body={tt("costsBody")} lang={lang}>
          <div className="space-y-1">
            <Field k="Estimated closing costs" v="$6,800" />
            <Field k="Estimated cash to close" v="$16,800" />
          </div>
        </Section>
        <Section title={tt("secCompare")} body={tt("compareBody")} lang={lang}>
          <div className="space-y-1">
            <Field k="APR" v="6.74%" />
            <Field k="Total you'll pay in 5 years" v="$104,300" />
          </div>
        </Section>
      </div>
    </Card>
  );
}
