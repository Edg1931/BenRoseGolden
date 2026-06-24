"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { LearnLang } from "@/lib/learn/content";

type L = Record<LearnLang, string>;

/**
 * Rent vs. Buy comparison (Day 2). Compares current rent to the estimated
 * monthly cost of owning (PITI + PMI), and reminds learners that part of an
 * owner's payment builds equity while rent builds none. A teaching estimate.
 */
const T = {
  title: { en: "Try it: rent vs. buy", es: "Pruébalo: alquilar vs. comprar", ar: "جرّبها: الإيجار مقابل الشراء" },
  intro: {
    en: "Renting and buying cost differently — but a big part of an owner's payment builds equity you keep, while rent builds none.",
    es: "Alquilar y comprar cuestan distinto, pero gran parte del pago del dueño construye plusvalía que conservas, mientras el alquiler no construye nada.",
    ar: "الإيجار والشراء يختلفان في التكلفة - لكن جزءاً كبيراً من دفعة المالك يبني ملكية تحتفظ بها، بينما الإيجار لا يبني شيئاً.",
  },
  rent: { en: "Your current monthly rent", es: "Tu alquiler mensual actual", ar: "إيجارك الشهري الحالي" },
  price: { en: "Home price", es: "Precio de la casa", ar: "سعر المنزل" },
  down: { en: "Down payment", es: "Pago inicial", ar: "الدفعة الأولى" },
  rate: { en: "Interest rate", es: "Tasa de interés", ar: "سعر الفائدة" },
  rentCost: { en: "Renting", es: "Alquilar", ar: "الإيجار" },
  buyCost: { en: "Owning (est.)", es: "Ser dueño (aprox.)", ar: "التملّك (تقديري)" },
  perMonth: { en: "/mo", es: "/mes", ar: "/شهر" },
  equityNote: {
    en: "Of that owning cost, about {eq}/mo goes to principal in year one — money that becomes YOUR equity, not your landlord's.",
    es: "De ese costo de ser dueño, unos {eq}/mes van al capital el primer año: dinero que se vuelve TU plusvalía, no la de tu casero.",
    ar: "من تكلفة التملّك تلك، نحو {eq}/شهر يذهب لأصل القرض في السنة الأولى - مال يصبح ملكيتك أنت، لا مالك العقار.",
  },
  cheaperBuy: { en: "Owning looks cheaper monthly here — and it builds equity too.", es: "Aquí ser dueño parece más barato al mes, y además construye plusvalía.", ar: "هنا يبدو التملّك أرخص شهرياً - وهو يبني ملكية أيضاً." },
  cheaperRent: { en: "Renting is cheaper monthly here, but remember owning builds equity and rent doesn't. Down-payment help can close the gap.", es: "Aquí alquilar es más barato al mes, pero recuerda que ser dueño construye plusvalía y el alquiler no. La ayuda para el pago inicial puede cerrar la brecha.", ar: "هنا الإيجار أرخص شهرياً، لكن تذكّر أن التملّك يبني ملكية والإيجار لا. ودعم الدفعة الأولى قد يسدّ الفجوة." },
} satisfies Record<string, L>;

export function RentVsBuy({ lang }: { lang: LearnLang }) {
  const [rent, setRent] = useState(1150);
  const [price, setPrice] = useState(190000);
  const [downPct, setDownPct] = useState(5);
  const [rate, setRate] = useState(6.5);

  const money = (n: number) =>
    new Intl.NumberFormat(lang === "es" ? "es-US" : lang === "ar" ? "ar" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.max(0, Math.round(n)));

  const loan = price * (1 - downPct / 100);
  const r = rate / 100 / 12;
  const n = 360;
  const pi = r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;
  const taxes = (price * 0.014) / 12;
  const ins = (price * 0.005) / 12;
  const pmi = downPct < 20 ? (loan * 0.006) / 12 : 0;
  const own = pi + taxes + ins + pmi;
  // First-month principal portion ≈ payment minus interest.
  const firstInterest = loan * r;
  const firstPrincipal = Math.max(0, pi - firstInterest);

  const ownCheaper = own <= rent;
  const max = Math.max(rent, own, 1);

  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚖️</span>
        <h3 className="font-semibold">{T.title[lang]}</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{T.intro[lang]}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">{T.rent[lang]}</span>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-muted-foreground">$</span>
            <input type="number" min={0} step={25} value={rent}
              onChange={(e) => setRent(Math.max(0, Number(e.target.value) || 0))}
              className="w-32 rounded-md border border-input px-3 py-2 text-sm" />
          </div>
        </label>
        <label className="block">
          <span className="text-sm font-medium">{T.price[lang]}</span>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-muted-foreground">$</span>
            <input type="number" min={0} step={5000} value={price}
              onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
              className="w-32 rounded-md border border-input px-3 py-2 text-sm" />
          </div>
        </label>
        <label className="block">
          <span className="text-sm font-medium">{T.down[lang]}: {downPct}%</span>
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
      </div>

      <div className="mt-5 space-y-3">
        {[
          { label: T.rentCost[lang], val: rent, color: "bg-slate-400" },
          { label: T.buyCost[lang], val: own, color: "bg-brand-rose" },
        ].map((row) => (
          <div key={row.label}>
            <div className="flex justify-between text-sm">
              <span className="font-medium">{row.label}</span>
              <span className="font-serif font-bold">{money(row.val)}{T.perMonth[lang]}</span>
            </div>
            <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-muted">
              <div className={`h-full ${row.color}`} style={{ width: `${(row.val / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 rounded-md bg-brand-blush px-3 py-2 text-sm text-brand-plum">
        {ownCheaper ? T.cheaperBuy[lang] : T.cheaperRent[lang]}{" "}
        {T.equityNote[lang].replace("{eq}", money(firstPrincipal))}
      </p>
    </Card>
  );
}
