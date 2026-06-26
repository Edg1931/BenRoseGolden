"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { LearnLang } from "@/lib/learn/content";

type L = Record<LearnLang, string>;

/**
 * Closing-cost estimator. Buyers are often surprised that closing costs run
 * ~2–5% of the price ON TOP of the down payment. This breaks a price into the
 * typical line items (lender, third-party, and prepaids/escrow) and shows the
 * "cash to close" total so people can save for the real number. Rough national
 * averages — actual costs vary by lender, county, and loan; in Ohio many of
 * these can be negotiated as seller-paid concessions.
 */
const T = {
  title: { en: "Try it: closing-cost estimator", es: "Pruébalo: estimador de costos de cierre", ar: "جرّبها: حاسبة تكاليف الإغلاق" },
  intro: {
    en: "Closing costs are the fees to finalize your loan — usually 2–5% of the price, paid on top of your down payment. Here's roughly where the money goes and the total cash you'll need at the table.",
    es: "Los costos de cierre son las tarifas para finalizar tu préstamo, normalmente 2–5% del precio, además de tu pago inicial. Aquí ves a dónde va el dinero y el total que necesitarás al cerrar.",
    ar: "تكاليف الإغلاق هي رسوم إتمام قرضك - عادةً 2–5% من السعر، تُدفع فوق دفعتك الأولى. إليك إلى أين يذهب المال والمبلغ النقدي الإجمالي الذي ستحتاجه عند الإغلاق.",
  },
  price: { en: "Home price", es: "Precio de la casa", ar: "سعر المنزل" },
  down: { en: "Down payment", es: "Pago inicial", ar: "الدفعة الأولى" },
  lender: { en: "Lender fees (origination, points)", es: "Tarifas del prestamista (originación, puntos)", ar: "رسوم المُقرض (الإصدار والنقاط)" },
  thirdParty: { en: "Appraisal, title, inspection, attorney", es: "Avalúo, título, inspección, abogado", ar: "التقييم، سند الملكية، الفحص، المحاماة" },
  prepaids: { en: "Prepaids & escrow (taxes, insurance)", es: "Pagos anticipados y depósito (impuestos, seguro)", ar: "المدفوعات المسبقة والضمان (الضرائب، التأمين)" },
  govt: { en: "Recording & transfer taxes", es: "Registro e impuestos de transferencia", ar: "التسجيل وضرائب النقل" },
  totalClosing: { en: "Estimated closing costs", es: "Costos de cierre estimados", ar: "تكاليف الإغلاق المقدّرة" },
  cashToClose: { en: "Total cash to close", es: "Efectivo total para cerrar", ar: "إجمالي النقد للإغلاق" },
  cashHint: { en: "Down payment + closing costs", es: "Pago inicial + costos de cierre", ar: "الدفعة الأولى + تكاليف الإغلاق" },
  pctOfPrice: { en: "of home price", es: "del precio", ar: "من سعر المنزل" },
  note: {
    en: "Tip: ask your lender for a Loan Estimate — it lists these exact costs. In Ohio, you can often negotiate seller-paid 'concessions' (commonly up to 3–6%) to cover much of this, and some assistance programs help with closing costs too.",
    es: "Consejo: pide a tu prestamista una Estimación del Préstamo (Loan Estimate): enumera estos costos exactos. En Ohio, a menudo puedes negociar 'concesiones' pagadas por el vendedor (comúnmente hasta 3–6%) para cubrir gran parte, y algunos programas de ayuda también cubren costos de cierre.",
    ar: "نصيحة: اطلب من المُقرض 'تقدير القرض' (Loan Estimate) - فهو يسرد هذه التكاليف بدقة. في أوهايو، يمكنك غالباً التفاوض على 'تنازلات' يدفعها البائع (عادةً حتى 3–6%) لتغطية جزء كبير منها، وبعض برامج المساعدة تغطي تكاليف الإغلاق أيضاً.",
  },
} satisfies Record<string, L>;

export function ClosingCostEstimator({ lang }: { lang: LearnLang }) {
  const [price, setPrice] = useState(200000);
  const [downPct, setDownPct] = useState(5);

  const money = (n: number) =>
    new Intl.NumberFormat(lang === "es" ? "es-US" : lang === "ar" ? "ar" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.round(n));

  // Rough national averages as a share of price.
  const lender = price * 0.01;
  const thirdParty = price * 0.0075;
  const prepaids = price * 0.0125;
  const govt = price * 0.005;
  const closing = lender + thirdParty + prepaids + govt;
  const down = price * (downPct / 100);
  const cashToClose = down + closing;
  const closingPct = price > 0 ? (closing / price) * 100 : 0;

  const rows = [
    { label: T.lender[lang], value: lender, color: "bg-brand-rose" },
    { label: T.thirdParty[lang], value: thirdParty, color: "bg-brand-gold" },
    { label: T.prepaids[lang], value: prepaids, color: "bg-emerald-500" },
    { label: T.govt[lang], value: govt, color: "bg-slate-400" },
  ];

  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">🧾</span>
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
          <span className="text-sm font-medium">{T.down[lang]}: {downPct}% = {money(down)}</span>
          <input type="range" min={3} max={25} step={1} value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            className="mt-2 w-full accent-brand-rose" />
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            {T.totalClosing[lang]} · {closingPct.toFixed(1)}% {T.pctOfPrice[lang]}
          </p>
          <p className="font-serif text-2xl font-bold text-brand-plum">{money(closing)}</p>
        </div>
        <div className="rounded-lg bg-brand-blush/40 p-4 text-center">
          <p className="text-xs text-muted-foreground">{T.cashToClose[lang]} · {T.cashHint[lang]}</p>
          <p className="font-serif text-2xl font-bold text-brand-rose">{money(cashToClose)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex justify-between text-sm">
              <span>{row.label}</span>
              <span className="font-semibold">{money(row.value)}</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className={`h-full ${row.color}`} style={{ width: `${(row.value / closing) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{T.note[lang]}</p>
    </Card>
  );
}
