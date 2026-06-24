"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { LearnLang } from "@/lib/learn/content";

type L = Record<LearnLang, string>;

/**
 * Interactive Budget Planner — the Benjamin Rose "Monthly Expenses Worksheet"
 * turned into a live tool. Enter take-home pay and category amounts; see total
 * expenses, money left over (or short), savings rate, and a housing-30% check
 * update in real time. This is the hands-on heart of the budgeting lesson.
 */

const T = {
  title: { en: "Build your monthly budget", es: "Arma tu presupuesto mensual", ar: "ابنِ ميزانيتك الشهرية" },
  intro: {
    en: "Enter your numbers (or try the sample) and watch your plan balance. Net income is your take-home pay, after taxes.",
    es: "Escribe tus números (o prueba el ejemplo) y mira cómo se equilibra tu plan. El ingreso neto es lo que recibes después de impuestos.",
    ar: "أدخل أرقامك (أو جرّب المثال) وراقب توازن خطتك. الدخل الصافي هو ما تستلمه بعد الضرائب.",
  },
  income: { en: "Net monthly income (take-home)", es: "Ingreso mensual neto", ar: "الدخل الشهري الصافي" },
  expenses: { en: "Monthly expenses", es: "Gastos mensuales", ar: "المصروفات الشهرية" },
  totalExp: { en: "Total expenses", es: "Gastos totales", ar: "إجمالي المصروفات" },
  leftover: { en: "Left to save", es: "Queda para ahorrar", ar: "المتبقّي للادخار" },
  short: { en: "Short this month", es: "Falta este mes", ar: "العجز هذا الشهر" },
  savingsRate: { en: "Savings rate", es: "Tasa de ahorro", ar: "نسبة الادخار" },
  housingCheck: { en: "Housing is", es: "La vivienda es el", ar: "السكن يمثّل" },
  housingOk: { en: "of income — at or under the 30% guideline ✓", es: "del ingreso — dentro de la guía del 30% ✓", ar: "من الدخل - ضمن قاعدة 30% ✓" },
  housingHigh: { en: "of income — above the 30% guideline ⚠", es: "del ingreso — por encima del 30% ⚠", ar: "من الدخل - أعلى من قاعدة 30% ⚠" },
  surplusMsg: {
    en: "You've got a surplus — give it a job: emergency fund first, then your down-payment savings.",
    es: "Tienes un excedente: dale una tarea —primero el fondo de emergencia, luego el ahorro para el pago inicial.",
    ar: "لديك فائض - أعطه مهمة: صندوق الطوارئ أولاً، ثم ادخار الدفعة الأولى.",
  },
  deficitMsg: {
    en: "You're spending more than you earn. Look at the variable lines first — that's the fastest place to cut.",
    es: "Estás gastando más de lo que ganas. Mira primero las líneas variables: es lo más rápido de recortar.",
    ar: "أنت تُنفق أكثر مما تكسب. انظر إلى البنود المتغيرة أولاً - فهي الأسرع في التقليص.",
  },
  sample: { en: "Load sample", es: "Cargar ejemplo", ar: "تحميل مثال" },
  clear: { en: "Clear", es: "Limpiar", ar: "مسح" },
} satisfies Record<string, L>;

interface Line { key: string; label: L; housing?: boolean; sample: number }

const LINES: Line[] = [
  { key: "rent", label: { en: "Rent / mortgage", es: "Renta / hipoteca", ar: "الإيجار / الرهن" }, housing: true, sample: 1100 },
  { key: "utilities", label: { en: "Utilities (gas, electric, water)", es: "Servicios (gas, luz, agua)", ar: "الخدمات (غاز، كهرباء، ماء)" }, housing: true, sample: 220 },
  { key: "food", label: { en: "Groceries", es: "Comida", ar: "البقالة" }, sample: 400 },
  { key: "transport", label: { en: "Car payment & gas", es: "Auto y gasolina", ar: "السيارة والوقود" }, sample: 430 },
  { key: "insurance", label: { en: "Insurance (health, auto)", es: "Seguros (salud, auto)", ar: "التأمين (صحة، سيارة)" }, sample: 180 },
  { key: "phone", label: { en: "Phone & internet", es: "Teléfono e internet", ar: "الهاتف والإنترنت" }, sample: 130 },
  { key: "debt", label: { en: "Debt payments (cards, loans)", es: "Pagos de deudas", ar: "أقساط الديون" }, sample: 250 },
  { key: "personal", label: { en: "Personal, childcare & other", es: "Personal, cuidado de niños y otros", ar: "شخصي، رعاية أطفال وأخرى" }, sample: 300 },
];

export function BudgetPlanner({ lang }: { lang: LearnLang }) {
  const [income, setIncome] = useState(0);
  const [vals, setVals] = useState<Record<string, number>>({});

  const money = (n: number) =>
    new Intl.NumberFormat(lang === "es" ? "es-US" : lang === "ar" ? "ar" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.round(n));

  const totalExp = LINES.reduce((s, l) => s + (vals[l.key] || 0), 0);
  const housing = LINES.filter((l) => l.housing).reduce((s, l) => s + (vals[l.key] || 0), 0);
  const leftover = income - totalExp;
  const savingsRate = income > 0 ? Math.max(0, Math.round((leftover / income) * 100)) : 0;
  const housingPct = income > 0 ? Math.round((housing / income) * 100) : 0;

  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">📒</span>
        <h3 className="font-semibold">{T.title[lang]}</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{T.intro[lang]}</p>

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <label className="block">
          <span className="text-sm font-medium">{T.income[lang]}</span>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-muted-foreground">$</span>
            <input
              type="number"
              min={0}
              value={income || ""}
              onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
              className="w-32 rounded-md border border-input px-3 py-2 text-sm"
            />
          </div>
        </label>
        <button
          onClick={() => {
            setIncome(3200);
            setVals(Object.fromEntries(LINES.map((l) => [l.key, l.sample])));
          }}
          className="rounded-md border border-input px-3 py-2 text-xs hover:bg-muted"
        >
          {T.sample[lang]}
        </button>
        <button
          onClick={() => {
            setIncome(0);
            setVals({});
          }}
          className="rounded-md border border-input px-3 py-2 text-xs hover:bg-muted"
        >
          {T.clear[lang]}
        </button>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {T.expenses[lang]}
      </p>
      <div className="mt-2 space-y-1.5">
        {LINES.map((l) => (
          <label key={l.key} className="flex items-center justify-between gap-3">
            <span className="text-sm">{l.label[lang]}</span>
            <span className="flex items-center gap-1">
              <span className="text-muted-foreground">$</span>
              <input
                type="number"
                min={0}
                value={vals[l.key] || ""}
                onChange={(e) =>
                  setVals((v) => ({ ...v, [l.key]: Math.max(0, Number(e.target.value) || 0) }))
                }
                className="w-24 rounded-md border border-input px-2 py-1.5 text-end text-sm"
              />
            </span>
          </label>
        ))}
      </div>

      {/* Live results */}
      <div className="mt-4 space-y-2 rounded-lg bg-muted/50 p-4">
        <Row label={T.totalExp[lang]} value={money(totalExp)} />
        <Row
          label={leftover >= 0 ? T.leftover[lang] : T.short[lang]}
          value={money(Math.abs(leftover))}
          tone={leftover >= 0 ? "good" : "bad"}
        />
        {income > 0 && (
          <>
            <Row label={T.savingsRate[lang]} value={`${savingsRate}%`} />
            <p className={`text-xs ${housingPct <= 30 ? "text-emerald-700" : "text-brand-gold"}`}>
              {T.housingCheck[lang]} {housingPct}% {housingPct <= 30 ? T.housingOk[lang] : T.housingHigh[lang]}
            </p>
          </>
        )}
      </div>

      {income > 0 && (
        <p
          className={`mt-3 rounded-md px-3 py-2 text-sm ${
            leftover >= 0 ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
          }`}
        >
          {leftover >= 0 ? T.surplusMsg[lang] : T.deficitMsg[lang]}
        </p>
      )}
    </Card>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`font-semibold ${
          tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-red-700" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
