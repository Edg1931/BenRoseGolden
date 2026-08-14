"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { LearnLang } from "@/lib/learn/content";

type L = Record<LearnLang, string>;

/**
 * Debt-payoff calculator. Enter a balance, APR, and monthly payment; see how
 * many months to be debt-free and the total interest — and how adding a little
 * extra each month shortens it. Pairs with the snowball-vs-avalanche lesson.
 */
const T = {
  title: { en: "Try it: debt payoff calculator", es: "Pruébalo: calculadora de pago de deudas", ar: "جرّبها: حاسبة سداد الديون" },
  intro: {
    en: "See how fast you can be debt-free — and how much interest you'll pay. Then try adding $25 more a month.",
    es: "Mira qué tan rápido puedes quedar libre de deudas y cuánto interés pagarás. Luego prueba agregar $25 más al mes.",
    ar: "شاهد كم تستطيع أن تتحرّر من الديون بسرعة، وكم ستدفع فائدة. ثم جرّب إضافة 25 دولاراً شهرياً.",
  },
  balance: { en: "Total balance", es: "Saldo total", ar: "إجمالي الرصيد" },
  apr: { en: "Interest rate (APR)", es: "Tasa de interés (APR)", ar: "سعر الفائدة (APR)" },
  payment: { en: "Monthly payment", es: "Pago mensual", ar: "الدفعة الشهرية" },
  payoff: { en: "Debt-free in", es: "Libre de deudas en", ar: "خالٍ من الديون خلال" },
  months: { en: "months", es: "meses", ar: "شهراً" },
  interest: { en: "Total interest paid", es: "Interés total pagado", ar: "إجمالي الفائدة المدفوعة" },
  tooLow: {
    en: "That payment barely covers the interest — raise it a little and the balance starts to fall.",
    es: "Ese pago apenas cubre el interés; súbelo un poco y el saldo empezará a bajar.",
    ar: "هذه الدفعة بالكاد تغطّي الفائدة - ارفعها قليلاً ويبدأ الرصيد بالانخفاض.",
  },
  tip: {
    en: "Two proven methods: the avalanche (pay highest-interest debt first) saves the most money; the snowball (smallest balance first) gives quick wins that keep you motivated. Either beats doing nothing.",
    es: "Dos métodos probados: la avalancha (paga primero la deuda de mayor interés) ahorra más dinero; la bola de nieve (saldo más pequeño primero) da victorias rápidas que te motivan. Cualquiera vence a no hacer nada.",
    ar: "طريقتان مُثبتتان: الانهيار الجليدي (سدّد الأعلى فائدة أولاً) يوفّر أكثر؛ وكرة الثلج (الأصغر رصيداً أولاً) تمنحك انتصارات سريعة تُبقيك متحمساً. وكلتاهما أفضل من لا شيء.",
  },
} satisfies Record<string, L>;

function payoff(balance: number, apr: number, payment: number) {
  const r = apr / 100 / 12;
  let bal = balance;
  let interest = 0;
  let months = 0;
  // Cap at 600 months; if payment can't cover interest, it never pays off.
  while (bal > 0 && months < 600) {
    const i = bal * r;
    const principal = payment - i;
    if (principal <= 0) return { months: null as number | null, interest: null as number | null };
    interest += i;
    bal -= principal;
    months++;
  }
  return { months, interest: Math.round(interest) };
}

export function DebtPayoffCalculator({ lang }: { lang: LearnLang }) {
  const [balance, setBalance] = useState(4000);
  const [apr, setApr] = useState(22);
  const [payment, setPayment] = useState(150);

  const money = (n: number) =>
    new Intl.NumberFormat(lang === "es" ? "es-US" : lang === "ar" ? "ar" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.round(n));

  const result = payoff(balance, apr, payment);

  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">💳</span>
        <h3 className="font-semibold">{T.title[lang]}</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{T.intro[lang]}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium">{T.balance[lang]}</span>
          <input type="number" min={0} step={100} value={balance}
            onChange={(e) => setBalance(Math.max(0, Number(e.target.value) || 0))}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">{T.apr[lang]}: {apr}%</span>
          <input type="range" min={0} max={36} step={1} value={apr}
            onChange={(e) => setApr(Number(e.target.value))}
            className="mt-2 w-full accent-brand-gold" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">{T.payment[lang]}</span>
          <input type="number" min={0} step={25} value={payment}
            onChange={(e) => setPayment(Math.max(0, Number(e.target.value) || 0))}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm" />
        </label>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/50 px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">{T.payoff[lang]}</p>
          <p className="font-serif text-2xl font-bold text-brand-rose">
            {result.months == null ? "—" : `${result.months} ${T.months[lang]}`}
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">{T.interest[lang]}</p>
          <p className="font-serif text-2xl font-bold text-brand-goldink">
            {result.interest == null ? "—" : money(result.interest)}
          </p>
        </div>
      </div>

      {result.months == null && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{T.tooLow[lang]}</p>
      )}
      <p className="mt-3 rounded-md bg-brand-blush px-3 py-2 text-xs text-brand-plum">{T.tip[lang]}</p>
    </Card>
  );
}
