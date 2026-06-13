"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { UI } from "@/lib/learn/strings";
import type { LearnLang } from "@/lib/learn/content";

/** A "lean-forward" interactive block: enter income, see budget targets
 *  (the 30% housing rule + a 50/30/20 split) update live. */
export function BudgetCalculator({ lang }: { lang: LearnLang }) {
  const t = (k: string) => UI[k]?.[lang] ?? UI[k]?.en ?? k;
  const [income, setIncome] = useState(3000);

  const money = (n: number) =>
    new Intl.NumberFormat(lang === "es" ? "es-US" : lang === "ar" ? "ar" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  const rows = [
    { key: "calcNeeds", pct: 50, color: "bg-brand-rose" },
    { key: "calcWants", pct: 30, color: "bg-brand-gold" },
    { key: "calcSavings", pct: 20, color: "bg-emerald-500" },
  ];

  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">🧮</span>
        <h3 className="font-semibold">{t("calcTitle")}</h3>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium">{t("calcIncome")}</span>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-muted-foreground">$</span>
          <input
            type="number"
            min={0}
            step={100}
            value={income}
            onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
            className="w-40 rounded-md border border-input px-3 py-2 text-sm"
          />
          <span className="text-sm text-muted-foreground">/ mo</span>
        </div>
      </label>

      <input
        type="range"
        min={1000}
        max={12000}
        step={100}
        value={income}
        onChange={(e) => setIncome(Number(e.target.value))}
        className="mt-3 w-full accent-brand-rose"
      />

      <div className="mt-4 rounded-lg bg-brand-rose/5 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t("calcHousing")}</span>
          <span className="text-lg font-bold text-brand-rose">{money(income * 0.3)}</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r.key}>
            <div className="flex items-center justify-between text-sm">
              <span>{t(r.key)}</span>
              <span className="font-semibold">{money((income * r.pct) / 100)}</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className={`h-full ${r.color}`} style={{ width: `${r.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{t("calcHint")}</p>
    </Card>
  );
}
