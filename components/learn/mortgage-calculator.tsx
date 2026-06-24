"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { LearnLang } from "@/lib/learn/content";

type L = Record<LearnLang, string>;

/**
 * Mortgage payment (PITI) calculator. Price + down payment + rate + term -> the
 * real monthly payment, broken into Principal & Interest, Taxes, Insurance, and
 * PMI (added automatically when the down payment is under 20%). Teaches that the
 * payment is more than just principal and interest.
 */
const T = {
  title: { en: "Try it: monthly payment calculator", es: "Pruébalo: calculadora del pago mensual", ar: "جرّبها: حاسبة الدفعة الشهرية" },
  intro: {
    en: "Your real payment is 'PITI': Principal, Interest, Taxes, and Insurance — plus PMI if you put down less than 20%. See how each piece adds up.",
    es: "Tu pago real es 'PITI': capital, interés, impuestos y seguro, más el PMI si das menos del 20%. Mira cómo suma cada parte.",
    ar: "دفعتك الحقيقية هي 'PITI': أصل القرض والفائدة والضرائب والتأمين - بالإضافة إلى تأمين PMI إن دفعت أقل من 20%. شاهد كيف يتجمّع كل جزء.",
  },
  price: { en: "Home price", es: "Precio de la casa", ar: "سعر المنزل" },
  down: { en: "Down payment", es: "Pago inicial", ar: "الدفعة الأولى" },
  rate: { en: "Interest rate", es: "Tasa de interés", ar: "سعر الفائدة" },
  term: { en: "Loan term", es: "Plazo del préstamo", ar: "مدة القرض" },
  years: { en: "years", es: "años", ar: "سنوات" },
  monthly: { en: "Estimated monthly payment", es: "Pago mensual estimado", ar: "الدفعة الشهرية المقدّرة" },
  pi: { en: "Principal & interest", es: "Capital e interés", ar: "أصل القرض والفائدة" },
  taxes: { en: "Property taxes (est.)", es: "Impuestos (aprox.)", ar: "ضرائب العقار (تقديري)" },
  ins: { en: "Home insurance (est.)", es: "Seguro (aprox.)", ar: "تأمين المنزل (تقديري)" },
  pmi: { en: "PMI (under 20% down)", es: "PMI (menos de 20%)", ar: "تأمين PMI (أقل من 20%)" },
  loanAmt: { en: "Loan amount", es: "Monto del préstamo", ar: "مبلغ القرض" },
  note: {
    en: "Estimates use ~1.4% taxes, ~0.5% insurance, and ~0.6% PMI per year. Your real numbers vary by county and lender — but notice how taxes and insurance can add hundreds a month.",
    es: "Las estimaciones usan ~1.4% de impuestos, ~0.5% de seguro y ~0.6% de PMI al año. Tus números reales varían por condado y prestamista, pero nota cómo impuestos y seguro suman cientos al mes.",
    ar: "تستخدم التقديرات نحو 1.4% ضرائب، و0.5% تأمين، و0.6% تأمين PMI سنوياً. أرقامك الحقيقية تختلف حسب المقاطعة والمُقرض - لكن لاحظ كيف تضيف الضرائب والتأمين مئات شهرياً.",
  },
} satisfies Record<string, L>;

export function MortgageCalculator({ lang }: { lang: LearnLang }) {
  const [price, setPrice] = useState(200000);
  const [downPct, setDownPct] = useState(5);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);

  const money = (n: number) =>
    new Intl.NumberFormat(lang === "es" ? "es-US" : lang === "ar" ? "ar" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.round(n));

  const loan = price * (1 - downPct / 100);
  const r = rate / 100 / 12;
  const n = term * 12;
  const pi = r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;
  const taxes = (price * 0.014) / 12;
  const ins = (price * 0.005) / 12;
  const pmi = downPct < 20 ? (loan * 0.006) / 12 : 0;
  const total = pi + taxes + ins + pmi;

  const rows = [
    { label: T.pi[lang], value: pi, color: "bg-brand-rose" },
    { label: T.taxes[lang], value: taxes, color: "bg-brand-gold" },
    { label: T.ins[lang], value: ins, color: "bg-emerald-500" },
    ...(pmi > 0 ? [{ label: T.pmi[lang], value: pmi, color: "bg-slate-400" }] : []),
  ];

  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">🏦</span>
        <h3 className="font-semibold">{T.title[lang]}</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{T.intro[lang]}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">{T.price[lang]}</span>
          <input type="number" min={0} step={5000} value={price}
            onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">{T.down[lang]}: {downPct}% = {money(price * downPct / 100)}</span>
          <input type="range" min={3} max={25} step={1} value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            className="mt-2 w-full accent-brand-rose" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">{T.rate[lang]}: {rate}%</span>
          <input type="range" min={3} max={10} step={0.125} value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-2 w-full accent-brand-gold" />
        </label>
        <div>
          <span className="text-sm font-medium">{T.term[lang]}</span>
          <div className="mt-1 flex gap-2">
            {[15, 30].map((y) => (
              <button key={y} onClick={() => setTerm(y)}
                className={`rounded-md px-3 py-2 text-sm ${term === y ? "bg-brand-rose text-white" : "border border-input hover:bg-muted"}`}>
                {y} {T.years[lang]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-muted/50 p-4 text-center">
        <p className="text-xs text-muted-foreground">{T.monthly[lang]} · {T.loanAmt[lang]} {money(loan)}</p>
        <p className="font-serif text-3xl font-bold text-brand-rose">{money(total)}/mo</p>
      </div>

      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex justify-between text-sm">
              <span>{row.label}</span>
              <span className="font-semibold">{money(row.value)}</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className={`h-full ${row.color}`} style={{ width: `${(row.value / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{T.note[lang]}</p>
    </Card>
  );
}
