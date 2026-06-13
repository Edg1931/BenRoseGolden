"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { LearnLang } from "@/lib/learn/content";

const T = {
  title: {
    en: "Try it: What can YOU afford? (the lender's math)",
    es: "Pruébalo: ¿cuánto puedes pagar TÚ? (el cálculo del prestamista)",
    ar: "جرّبها: ما الذي تستطيع أنت تحمّله؟ (حساب المُقرض)",
  },
  income: {
    en: "Gross monthly household income",
    es: "Ingreso mensual bruto del hogar",
    ar: "دخل الأسرة الشهري الإجمالي",
  },
  debts: {
    en: "Monthly debt payments (cars, cards, loans)",
    es: "Pagos mensuales de deudas (autos, tarjetas, préstamos)",
    ar: "أقساط الديون الشهرية (سيارات، بطاقات، قروض)",
  },
  housingMax: {
    en: "Max housing payment (29% rule)",
    es: "Pago máximo de vivienda (regla del 29%)",
    ar: "أقصى دفعة سكن (قاعدة 29%)",
  },
  dtiMax: {
    en: "Max for housing + all debts (41% rule)",
    es: "Máximo para vivienda + deudas (regla del 41%)",
    ar: "الأقصى للسكن + كل الديون (قاعدة 41%)",
  },
  yourCeiling: {
    en: "Your realistic monthly housing ceiling",
    es: "Tu techo mensual realista de vivienda",
    ar: "سقفك الشهري الواقعي للسكن",
  },
  note: {
    en: "Your ceiling is the LOWER of the two rules — that's what a lender will check. (PITI: principal, interest, taxes, insurance.)",
    es: "Tu techo es el MENOR de las dos reglas: eso revisará el prestamista. (PITI: principal, interés, impuestos, seguro.)",
    ar: "سقفك هو الأقل بين القاعدتين - وهذا ما سيتحقق منه المُقرض. (PITI: أصل القرض والفائدة والضرائب والتأمين.)",
  },
} as const;

/** Day 2 interactive block: the 29% housing / 41% DTI rules, live. */
export function AffordabilityCalculator({ lang }: { lang: LearnLang }) {
  const [income, setIncome] = useState(4200);
  const [debts, setDebts] = useState(450);

  const money = (n: number) =>
    new Intl.NumberFormat(lang === "es" ? "es-US" : lang === "ar" ? "ar" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.max(0, n));

  const housingCap = income * 0.29;
  const dtiCap = income * 0.41 - debts;
  const ceiling = Math.min(housingCap, dtiCap);

  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">🧮</span>
        <h3 className="font-semibold">{T.title[lang]}</h3>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">{T.income[lang]}</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-muted-foreground">$</span>
            <input
              type="number"
              min={0}
              step={100}
              value={income}
              onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
              className="w-32 rounded-md border border-input px-3 py-2 text-sm"
            />
          </div>
          <input
            type="range"
            min={1000}
            max={12000}
            step={100}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="mt-2 w-full accent-brand-rose"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">{T.debts[lang]}</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-muted-foreground">$</span>
            <input
              type="number"
              min={0}
              step={25}
              value={debts}
              onChange={(e) => setDebts(Math.max(0, Number(e.target.value) || 0))}
              className="w-32 rounded-md border border-input px-3 py-2 text-sm"
            />
          </div>
          <input
            type="range"
            min={0}
            max={4000}
            step={25}
            value={debts}
            onChange={(e) => setDebts(Number(e.target.value))}
            className="mt-2 w-full accent-brand-gold"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-muted/60 px-4 py-3">
          <p className="text-xs text-muted-foreground">{T.housingMax[lang]}</p>
          <p className="font-serif text-xl font-bold">{money(housingCap)}</p>
        </div>
        <div className="rounded-lg bg-muted/60 px-4 py-3">
          <p className="text-xs text-muted-foreground">{T.dtiMax[lang]}</p>
          <p className="font-serif text-xl font-bold">{money(dtiCap)}</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-brand-blush px-4 py-3">
        <p className="text-xs font-semibold text-brand-plum">{T.yourCeiling[lang]}</p>
        <p className="font-serif text-2xl font-bold text-brand-rose">{money(ceiling)} / mo</p>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{T.note[lang]}</p>
    </Card>
  );
}
