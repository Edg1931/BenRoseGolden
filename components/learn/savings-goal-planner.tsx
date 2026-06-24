"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { LearnLang } from "@/lib/learn/content";

type L = Record<LearnLang, string>;

/**
 * Down-payment savings-goal planner. Enter a home price + down-payment percent
 * (or a goal directly), what you've saved, and what you can set aside monthly;
 * see how long it takes and your finish date. Reinforces "emergency fund first,
 * then the home goal" and the real 3.5%–20% down range from the class.
 */
const T = {
  title: { en: "Plan your down-payment goal", es: "Planea tu meta de pago inicial", ar: "خطّط لهدف دفعتك الأولى" },
  intro: {
    en: "See how a steady monthly amount gets you to a down payment. Most loans need 3.5%–20% down — and assistance programs can shrink that.",
    es: "Mira cómo una cantidad mensual constante te lleva al pago inicial. La mayoría de los préstamos piden 3.5%–20%, y la ayuda puede reducirlo.",
    ar: "شاهد كيف يوصلك مبلغ شهري ثابت إلى الدفعة الأولى. تتطلّب معظم القروض 3.5%–20% - وبرامج الدعم تُقلّل ذلك.",
  },
  price: { en: "Home price", es: "Precio de la casa", ar: "سعر المنزل" },
  pct: { en: "Down payment", es: "Pago inicial", ar: "الدفعة الأولى" },
  goal: { en: "Down-payment goal", es: "Meta de pago inicial", ar: "هدف الدفعة الأولى" },
  saved: { en: "Saved so far", es: "Ahorrado hasta ahora", ar: "ما ادّخرته حتى الآن" },
  monthly: { en: "I can save monthly", es: "Puedo ahorrar al mes", ar: "أستطيع ادّخار شهرياً" },
  timeToGoal: { en: "Time to reach your goal", es: "Tiempo para tu meta", ar: "الوقت لبلوغ هدفك" },
  months: { en: "months", es: "meses", ar: "شهراً" },
  reached: { en: "You're already there! 🎉", es: "¡Ya llegaste! 🎉", ar: "لقد وصلت بالفعل! 🎉" },
  needMonthly: { en: "Add a monthly amount to see your timeline.", es: "Agrega un monto mensual para ver tu plazo.", ar: "أضِف مبلغاً شهرياً لرؤية جدولك الزمني." },
  tip: {
    en: "Smart order: build a small emergency fund (even $1,000) first, then pour savings into the home goal. Down-payment assistance can cover much of this.",
    es: "Orden inteligente: primero un pequeño fondo de emergencia (aunque sea $1,000), luego vuelca el ahorro a la meta de casa. La ayuda puede cubrir gran parte.",
    ar: "ترتيب ذكي: ابنِ صندوق طوارئ صغيراً (حتى 1,000 دولار) أولاً، ثم وجّه ادّخارك لهدف المنزل. ويمكن للدعم أن يغطّي جزءاً كبيراً.",
  },
} satisfies Record<string, L>;

export function SavingsGoalPlanner({ lang }: { lang: LearnLang }) {
  const [price, setPrice] = useState(180000);
  const [pct, setPct] = useState(5);
  const [saved, setSaved] = useState(2000);
  const [monthly, setMonthly] = useState(250);

  const money = (n: number) =>
    new Intl.NumberFormat(lang === "es" ? "es-US" : lang === "ar" ? "ar" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.round(n));

  const goal = Math.round((price * pct) / 100);
  const remaining = Math.max(0, goal - saved);
  const monthsNeeded = monthly > 0 ? Math.ceil(remaining / monthly) : null;
  const years = monthsNeeded != null ? Math.floor(monthsNeeded / 12) : 0;
  const remMonths = monthsNeeded != null ? monthsNeeded % 12 : 0;
  const progress = goal > 0 ? Math.min(100, Math.round((saved / goal) * 100)) : 0;

  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">🎯</span>
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
          <span className="text-sm font-medium">{T.pct[lang]}: {pct}% = {money(goal)}</span>
          <input type="range" min={3.5} max={20} step={0.5} value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
            className="mt-2 w-full accent-brand-rose" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">{T.saved[lang]}</span>
          <input type="number" min={0} step={500} value={saved}
            onChange={(e) => setSaved(Math.max(0, Number(e.target.value) || 0))}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">{T.monthly[lang]}</span>
          <input type="number" min={0} step={25} value={monthly}
            onChange={(e) => setMonthly(Math.max(0, Number(e.target.value) || 0))}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm" />
        </label>
      </div>

      <div className="mt-4 rounded-lg bg-muted/50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{T.goal[lang]}</span>
          <span className="font-semibold">{money(goal)}</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-brand-rose" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-center">
          {remaining === 0 ? (
            <span className="font-semibold text-emerald-700">{T.reached[lang]}</span>
          ) : monthsNeeded == null ? (
            <span className="text-sm text-muted-foreground">{T.needMonthly[lang]}</span>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">{T.timeToGoal[lang]}: </span>
              <span className="font-serif text-xl font-bold text-brand-rose">
                {years > 0 ? `${years}y ` : ""}{remMonths} {T.months[lang]}
              </span>
            </>
          )}
        </p>
      </div>

      <p className="mt-3 rounded-md bg-brand-blush px-3 py-2 text-xs text-brand-plum">{T.tip[lang]}</p>
    </Card>
  );
}
