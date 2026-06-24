"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { LearnLang } from "@/lib/learn/content";

type L = Record<LearnLang, string>;

/**
 * Credit Utilization Calculator (Day 1). Enter total card balances and total
 * limits to see your utilization % — the second-biggest factor in a credit
 * score — with color-coded guidance to keep it under 30% (ideally under 10%).
 */
const T = {
  title: { en: "Try it: credit utilization calculator", es: "Pruébalo: calculadora de uso de crédito", ar: "جرّبها: حاسبة استخدام الائتمان" },
  intro: {
    en: "Utilization is how much of your available credit you're using. It's the second-biggest factor in your score — and one of the fastest to improve.",
    es: "La utilización es cuánto de tu crédito disponible estás usando. Es el segundo factor más importante de tu puntaje y uno de los más rápidos de mejorar.",
    ar: "معدّل الاستخدام هو مقدار ما تستعمله من ائتمانك المتاح. وهو ثاني أكبر عامل في درجتك، ومن أسرعها تحسّناً.",
  },
  balances: { en: "Total card balances", es: "Saldos totales de tarjetas", ar: "إجمالي أرصدة البطاقات" },
  limits: { en: "Total credit limits", es: "Límites de crédito totales", ar: "إجمالي حدود الائتمان" },
  yourUtil: { en: "Your utilization", es: "Tu uso de crédito", ar: "معدّل استخدامك" },
  toReach: { en: "To reach 30%, pay down to", es: "Para llegar al 30%, baja a", ar: "للوصول إلى 30%، اخفض إلى" },
  great: { en: "Excellent — under 10%. This helps your score the most.", es: "Excelente — menos del 10%. Esto ayuda más a tu puntaje.", ar: "ممتاز - أقل من 10%. هذا يفيد درجتك أكثر شيء." },
  good: { en: "Good — under 30%, the common guideline.", es: "Bien — menos del 30%, la guía común.", ar: "جيد - أقل من 30%، وهي القاعدة الشائعة." },
  fair: { en: "Getting high — aim to pay this below 30%.", es: "Algo alto — intenta bajarlo del 30%.", ar: "مرتفع نسبياً - حاول خفضه دون 30%." },
  high: { en: "High — this is likely dragging your score down. Paying it down is one of the fastest wins.", es: "Alto — probablemente baja tu puntaje. Reducirlo es una de las victorias más rápidas.", ar: "مرتفع - الأرجح أنه يخفض درجتك. وخفضه من أسرع المكاسب." },
} satisfies Record<string, L>;

export function CreditUtilizationCalculator({ lang }: { lang: LearnLang }) {
  const [balances, setBalances] = useState(900);
  const [limits, setLimits] = useState(3000);

  const money = (n: number) =>
    new Intl.NumberFormat(lang === "es" ? "es-US" : lang === "ar" ? "ar" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.max(0, Math.round(n)));

  const util = limits > 0 ? Math.round((balances / limits) * 100) : 0;
  const target30 = Math.floor(limits * 0.3);

  const band =
    util < 10
      ? { msg: T.great[lang], color: "text-emerald-600", bar: "bg-emerald-500" }
      : util < 30
        ? { msg: T.good[lang], color: "text-lime-600", bar: "bg-lime-500" }
        : util < 50
          ? { msg: T.fair[lang], color: "text-brand-gold", bar: "bg-brand-gold" }
          : { msg: T.high[lang], color: "text-red-600", bar: "bg-red-500" };

  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">💳</span>
        <h3 className="font-semibold">{T.title[lang]}</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{T.intro[lang]}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">{T.balances[lang]}</span>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-muted-foreground">$</span>
            <input type="number" min={0} step={50} value={balances}
              onChange={(e) => setBalances(Math.max(0, Number(e.target.value) || 0))}
              className="w-32 rounded-md border border-input px-3 py-2 text-sm" />
          </div>
        </label>
        <label className="block">
          <span className="text-sm font-medium">{T.limits[lang]}</span>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-muted-foreground">$</span>
            <input type="number" min={0} step={100} value={limits}
              onChange={(e) => setLimits(Math.max(0, Number(e.target.value) || 0))}
              className="w-32 rounded-md border border-input px-3 py-2 text-sm" />
          </div>
        </label>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">{T.yourUtil[lang]}</p>
        <p className={`font-serif text-4xl font-bold ${band.color}`}>{util}%</p>
        <div className="relative mt-2 h-3 w-full overflow-hidden rounded-full bg-muted">
          <div className={`h-full ${band.bar}`} style={{ width: `${Math.min(100, util)}%` }} />
          {/* 30% marker */}
          <div className="absolute top-0 h-3 w-0.5 bg-foreground/50" style={{ left: "30%" }} title="30%" />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>0%</span><span>← keep under 30%</span><span>100%</span>
        </div>
      </div>

      <p className={`mt-3 rounded-md px-3 py-2 text-sm ${util < 30 ? "bg-emerald-50 text-emerald-800" : "bg-brand-blush text-brand-plum"}`}>
        {band.msg}
        {util >= 30 && limits > 0 && <> {T.toReach[lang]} {money(target30)}.</>}
      </p>
    </Card>
  );
}
