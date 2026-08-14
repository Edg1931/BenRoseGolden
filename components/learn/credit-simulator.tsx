"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { LearnLang } from "@/lib/learn/content";

type L = Record<LearnLang, string>;

/**
 * Credit Score Simulator — move the five factors Benjamin Rose teaches and watch
 * an estimated FICO-style score (300–850) and risk band move. Weights follow the
 * standard FICO model so the *direction* and relative weight are accurate; it's
 * a teaching estimate, not a real score. Highlights the ~620–640 line many
 * down-payment programs require.
 */

const DPA_LINE = 640;

const T = {
  title: { en: "Try it: credit score simulator", es: "Pruébalo: simulador de puntaje", ar: "جرّبها: محاكي الدرجة الائتمانية" },
  intro: {
    en: "These are the five things that move your score. Slide them and watch what happens — payment history and how much of your credit you use matter most.",
    es: "Estas son las cinco cosas que mueven tu puntaje. Deslízalas y observa: el historial de pagos y cuánto crédito usas son lo que más importa.",
    ar: "هذه هي الأشياء الخمسة التي تحرّك درجتك. حرّكها وراقب ما يحدث - سجل المدفوعات ونسبة استخدامك للائتمان هما الأهم.",
  },
  payment: { en: "On-time payments", es: "Pagos a tiempo", ar: "المدفوعات في موعدها" },
  util: { en: "Credit used (utilization)", es: "Crédito usado (utilización)", ar: "الائتمان المُستخدَم" },
  age: { en: "Average account age (years)", es: "Antigüedad media de cuentas (años)", ar: "متوسط عمر الحسابات (سنوات)" },
  mix: { en: "Types of credit", es: "Tipos de crédito", ar: "أنواع الائتمان" },
  inquiries: { en: "New applications (last year)", es: "Solicitudes nuevas (último año)", ar: "طلبات جديدة (العام الماضي)" },
  estimated: { en: "Estimated score", es: "Puntaje estimado", ar: "الدرجة المقدّرة" },
  dpaNote: {
    en: "Many down-payment-assistance programs look for about 620–640+. The biggest lever is simple: pay on time and keep balances low.",
    es: "Muchos programas de ayuda buscan alrededor de 620–640 o más. La palanca más grande es simple: paga a tiempo y mantén bajos los saldos.",
    ar: "تبحث كثير من برامج الدعم عن نحو 620–640 أو أكثر. وأكبر وسيلة بسيطة: ادفع في الموعد وأبقِ الأرصدة منخفضة.",
  },
  bands: {
    poor: { en: "Poor", es: "Pobre", ar: "ضعيف" },
    fair: { en: "Fair", es: "Regular", ar: "مقبول" },
    good: { en: "Good", es: "Bueno", ar: "جيد" },
    veryGood: { en: "Very good", es: "Muy bueno", ar: "جيد جداً" },
    excellent: { en: "Excellent", es: "Excelente", ar: "ممتاز" },
  },
} satisfies Record<string, unknown>;

function band(score: number): { key: keyof typeof T.bands; color: string } {
  if (score >= 800) return { key: "excellent", color: "text-emerald-600" };
  if (score >= 740) return { key: "veryGood", color: "text-emerald-600" };
  if (score >= 670) return { key: "good", color: "text-lime-600" };
  if (score >= 580) return { key: "fair", color: "text-brand-goldink" };
  return { key: "poor", color: "text-red-600" };
}

export function CreditSimulator({ lang }: { lang: LearnLang }) {
  const [onTime, setOnTime] = useState(95); // %
  const [util, setUtil] = useState(30); // %
  const [age, setAge] = useState(7); // years
  const [mix, setMix] = useState(2); // count of types
  const [inquiries, setInquiries] = useState(1); // last 12 mo

  // FICO-style weighting on a 300–850 range (teaching estimate).
  const paymentScore = (onTime / 100) ** 1.4; // 35%
  const utilScore = Math.max(0, 1 - util / 100) ** 0.9; // 30%
  const ageScore = Math.min(1, age / 10); // 15%
  const mixScore = Math.min(1, mix / 4); // 10%
  const inqScore = Math.max(0, 1 - inquiries / 6); // 10%
  const composite =
    paymentScore * 0.35 + utilScore * 0.3 + ageScore * 0.15 + mixScore * 0.1 + inqScore * 0.1;
  const score = Math.round(300 + composite * 550);
  const b = band(score);
  const pct = ((score - 300) / 550) * 100;

  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">📊</span>
        <h3 className="font-semibold">{T.title[lang]}</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{T.intro[lang]}</p>

      {/* Gauge */}
      <div className="mt-4 text-center">
        <div className={`font-serif text-4xl font-bold ${b.color}`}>{score}</div>
        <div className={`text-sm font-medium ${b.color}`}>
          {T.estimated[lang]} · {T.bands[b.key][lang]}
        </div>
        <div className="relative mt-3 h-3 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500">
          <div
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-foreground shadow"
            style={{ left: `${pct}%` }}
          />
          {/* DPA threshold marker */}
          <div
            className="absolute -top-1 h-5 w-0.5 bg-foreground/60"
            style={{ left: `${((DPA_LINE - 300) / 550) * 100}%` }}
            title={`${DPA_LINE}`}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>300</span>
          <span>← ~640 helps unlock assistance</span>
          <span>850</span>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <Slider label={`${T.payment[lang]}: ${onTime}%`} min={50} max={100} value={onTime} onChange={setOnTime} accent />
        <Slider label={`${T.util[lang]}: ${util}%`} min={0} max={100} value={util} onChange={setUtil} accent invertHint />
        <Slider label={`${T.age[lang]}: ${age}`} min={0} max={20} value={age} onChange={setAge} />
        <Slider label={`${T.mix[lang]}: ${mix}`} min={1} max={4} value={mix} onChange={setMix} />
        <Slider label={`${T.inquiries[lang]}: ${inquiries}`} min={0} max={6} value={inquiries} onChange={setInquiries} />
      </div>

      <p className="mt-4 rounded-md bg-brand-blush px-3 py-2 text-xs text-brand-plum">{T.dpaNote[lang]}</p>
    </Card>
  );
}

function Slider({
  label,
  min,
  max,
  value,
  onChange,
  accent,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (n: number) => void;
  accent?: boolean;
  invertHint?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`mt-1 w-full ${accent ? "accent-brand-rose" : "accent-brand-gold"}`}
      />
    </label>
  );
}
