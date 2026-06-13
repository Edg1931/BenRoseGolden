"use client";

import { useMemo, useState } from "react";
import type { SorterBlock, LearnLang } from "@/lib/learn/content";

/** Deterministic-enough shuffle that never returns the solved order. */
function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // If we accidentally shuffled into the correct order, rotate once.
  if (a.every((v, i) => v === arr[i])) a.push(a.shift() as T);
  return a;
}

/**
 * Put-the-steps-in-order activity (tap-based, mobile-friendly): tap a step to
 * select it, tap another to swap. Solved state celebrates and awards XP once.
 */
export function StepSorter({
  sorter,
  lang,
  onSolved,
}: {
  sorter: SorterBlock;
  lang: LearnLang;
  onSolved?: () => void;
}) {
  // Work on indices into sorter.steps; correct order = 0..n-1.
  const initial = useMemo(() => shuffled(sorter.steps.map((_, i) => i)), [sorter]);
  const [order, setOrder] = useState<number[]>(initial);
  const [selected, setSelected] = useState<number | null>(null);
  const [rewarded, setRewarded] = useState(false);

  const solved = order.every((v, i) => v === i);

  function tap(pos: number) {
    if (solved) return;
    if (selected === null) {
      setSelected(pos);
      return;
    }
    if (selected === pos) {
      setSelected(null);
      return;
    }
    const next = [...order];
    [next[selected], next[pos]] = [next[pos], next[selected]];
    setOrder(next);
    setSelected(null);
    if (next.every((v, i) => v === i) && !rewarded) {
      setRewarded(true);
      onSolved?.();
    }
  }

  return (
    <div className="mt-6 rounded-xl border-2 border-dashed border-brand-gold/50 bg-brand-gold/5 p-4">
      <p className="font-medium">🧩 {sorter.title[lang]}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {lang === "es"
          ? "Toca dos pasos para intercambiarlos hasta que el orden sea correcto."
          : lang === "ar"
            ? "اضغط على خطوتين لتبديلهما حتى يصبح الترتيب صحيحاً."
            : "Tap two steps to swap them until the order is right."}
      </p>
      <ol className="mt-3 space-y-1.5">
        {order.map((stepIdx, pos) => {
          const correct = stepIdx === pos;
          return (
            <li key={stepIdx}>
              <button
                onClick={() => tap(pos)}
                className={`flex w-full items-center gap-3 rounded-md border px-3 py-2 text-start text-sm transition ${
                  solved
                    ? "border-emerald-400 bg-emerald-50"
                    : selected === pos
                      ? "border-brand-rose bg-brand-blush"
                      : correct
                        ? "border-emerald-300 bg-emerald-50/60"
                        : "border-input bg-white hover:bg-muted/50"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    correct ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {pos + 1}
                </span>
                <span>{sorter.steps[stepIdx][lang]}</span>
              </button>
            </li>
          );
        })}
      </ol>
      {solved && (
        <p className="mt-3 rounded-md bg-emerald-100/70 px-3 py-2 text-sm font-medium text-emerald-800">
          🎉 {lang === "es" ? "¡Orden perfecto!" : lang === "ar" ? "ترتيب مثالي!" : "Perfect order!"}{" "}
          {rewarded && <span className="font-semibold">+15 XP</span>}
        </p>
      )}
    </div>
  );
}
