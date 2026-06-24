"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import type { LearnLang } from "@/lib/learn/content";

/**
 * Hands-on activity: a realistic sample bank statement the learner sorts line by
 * line into FIXED vs VARIABLE expenses, with instant feedback and a running
 * tally — turning the "classify your expenses" lesson into practice instead of
 * theory. Awards XP when every line is correctly sorted.
 */

type Kind = "fixed" | "variable";

interface Txn {
  label: Localized;
  amount: number;
  kind: Kind;
}
type Localized = Record<LearnLang, string>;

const T = {
  title: {
    en: "Practice: sort a real bank statement",
    es: "Práctica: clasifica un estado de cuenta real",
    ar: "تدريب: صنّف كشف حساب حقيقي",
  },
  intro: {
    en: "Here's one month from a sample checking account. Tap Fixed or Variable for each line — fixed costs stay the same every month; variable ones change.",
    es: "Aquí tienes un mes de una cuenta de muestra. Toca Fijo o Variable en cada línea: los costos fijos son iguales cada mes; los variables cambian.",
    ar: "إليك شهراً من حساب جارٍ نموذجي. اضغط ثابت أو متغيّر لكل بند - التكاليف الثابتة تبقى كما هي كل شهر؛ والمتغيرة تتغير.",
  },
  fixed: { en: "Fixed", es: "Fijo", ar: "ثابت" },
  variable: { en: "Variable", es: "Variable", ar: "متغيّر" },
  fixedTotal: { en: "Fixed total", es: "Total fijo", ar: "إجمالي الثابت" },
  variableTotal: { en: "Variable total", es: "Total variable", ar: "إجمالي المتغير" },
  done: {
    en: "Nicely done — that's exactly how you read a statement. Variable costs are where a budget finds savings.",
    es: "¡Bien hecho! Así se lee un estado de cuenta. Los costos variables son donde el presupuesto encuentra ahorros.",
    ar: "أحسنت - هكذا تماماً تقرأ كشف الحساب. التكاليف المتغيرة هي حيث تجد الميزانية وفوراً.",
  },
} satisfies Record<string, Localized>;

const TXNS: Txn[] = [
  { label: { en: "Rent payment", es: "Pago de renta", ar: "دفعة الإيجار" }, amount: 1100, kind: "fixed" },
  { label: { en: "Grocery store", es: "Supermercado", ar: "متجر بقالة" }, amount: 320, kind: "variable" },
  { label: { en: "Car loan", es: "Préstamo del auto", ar: "قرض السيارة" }, amount: 285, kind: "fixed" },
  { label: { en: "Gas station", es: "Gasolinera", ar: "محطة وقود" }, amount: 140, kind: "variable" },
  { label: { en: "Auto insurance", es: "Seguro del auto", ar: "تأمين السيارة" }, amount: 95, kind: "fixed" },
  { label: { en: "Restaurants & takeout", es: "Restaurantes y comida para llevar", ar: "مطاعم وطعام جاهز" }, amount: 180, kind: "variable" },
  { label: { en: "Phone plan", es: "Plan del teléfono", ar: "خطة الهاتف" }, amount: 60, kind: "fixed" },
  { label: { en: "Electric bill", es: "Factura de luz", ar: "فاتورة الكهرباء" }, amount: 130, kind: "variable" },
];

export function ExpenseClassifier({ lang }: { lang: LearnLang }) {
  const money = useMemo(
    () => (n: number) =>
      new Intl.NumberFormat(lang === "es" ? "es-US" : lang === "ar" ? "ar" : "en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n),
    [lang],
  );

  // answers[i] = chosen kind, once correct it locks.
  const [answers, setAnswers] = useState<Record<number, Kind>>({});

  function choose(i: number, kind: Kind) {
    if (answers[i] === TXNS[i].kind) return; // already correct, locked
    setAnswers((a) => ({ ...a, [i]: kind }));
  }

  const correctCount = TXNS.filter((t, i) => answers[i] === t.kind).length;
  const done = correctCount === TXNS.length;
  const fixedTotal = TXNS.filter((t, i) => answers[i] === "fixed" && t.kind === "fixed").reduce((s, t) => s + t.amount, 0);
  const variableTotal = TXNS.filter((t, i) => answers[i] === "variable" && t.kind === "variable").reduce((s, t) => s + t.amount, 0);

  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">🧾</span>
        <h3 className="font-semibold">{T.title[lang]}</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{T.intro[lang]}</p>

      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        {TXNS.map((t, i) => {
          const chosen = answers[i];
          const isCorrect = chosen === t.kind;
          const isWrong = chosen != null && chosen !== t.kind;
          return (
            <div
              key={i}
              className={`flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2 last:border-b-0 ${
                isCorrect ? "bg-emerald-50" : isWrong ? "bg-red-50" : "bg-white"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">{t.label[lang]}</span>
                <span className="text-xs text-muted-foreground">{money(t.amount)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {(["fixed", "variable"] as Kind[]).map((k) => {
                  const active = chosen === k;
                  return (
                    <button
                      key={k}
                      onClick={() => choose(i, k)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                        active && isCorrect
                          ? "bg-emerald-600 text-white"
                          : active && isWrong
                            ? "bg-red-500 text-white"
                            : "border border-input hover:bg-muted"
                      }`}
                    >
                      {T[k][lang]}
                    </button>
                  );
                })}
                {isCorrect && <span className="text-emerald-600" aria-hidden>✓</span>}
                {isWrong && <span className="text-red-500" aria-hidden>↻</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/60 px-3 py-2 text-sm">
          <span className="text-muted-foreground">{T.fixedTotal[lang]}: </span>
          <span className="font-semibold">{money(fixedTotal)}</span>
        </div>
        <div className="rounded-lg bg-muted/60 px-3 py-2 text-sm">
          <span className="text-muted-foreground">{T.variableTotal[lang]}: </span>
          <span className="font-semibold">{money(variableTotal)}</span>
        </div>
      </div>

      {done && (
        <p className="mt-3 rounded-md bg-emerald-100/70 px-3 py-2 text-sm font-medium text-emerald-800">
          🎉 {T.done[lang]}
        </p>
      )}
    </Card>
  );
}
