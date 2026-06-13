"use client";

import { useState } from "react";
import type { InlineCheck } from "@/lib/learn/content";
import type { LearnLang } from "@/lib/learn/content";

/**
 * Inline, ungraded knowledge check with instant feedback — the "lean-forward"
 * moment inside a lesson. Awards XP (via onCorrect) the first time it's
 * answered correctly.
 */
export function KnowledgeCheck({
  check,
  lang,
  onCorrect,
}: {
  check: InlineCheck;
  lang: LearnLang;
  onCorrect?: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [rewarded, setRewarded] = useState(false);

  function choose(i: number) {
    setPicked(i);
    if (i === check.correctIndex && !rewarded) {
      setRewarded(true);
      onCorrect?.();
    }
  }

  return (
    <div className="mt-6 rounded-xl border-2 border-dashed border-brand-rose/40 bg-brand-blush/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-rose">⚡ {""}</p>
      <p className="mt-1 font-medium">{check.question[lang]}</p>
      <div className="mt-3 space-y-1.5">
        {check.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = i === check.correctIndex;
          const show = picked != null;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={picked === check.correctIndex}
              className={`block w-full rounded-md border px-3 py-2 text-start text-sm transition ${
                show && isPicked && isCorrect
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : show && isPicked
                    ? "border-red-400 bg-red-50 text-red-800"
                    : "border-input bg-white hover:bg-muted/50"
              }`}
            >
              {show && isPicked ? (isCorrect ? "✓ " : "✗ ") : ""}
              {opt[lang]}
            </button>
          );
        })}
      </div>
      {picked === check.correctIndex && (
        <p className="mt-3 rounded-md bg-emerald-100/70 px-3 py-2 text-sm text-emerald-800">
          {check.explain[lang]} {rewarded && <span className="font-semibold">+10 XP</span>}
        </p>
      )}
      {picked != null && picked !== check.correctIndex && (
        <p className="mt-3 text-sm text-muted-foreground">↻</p>
      )}
    </div>
  );
}
