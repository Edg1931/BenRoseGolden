"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { LearnLang } from "@/lib/learn/content";

type L = Record<LearnLang, string>;

/**
 * Loan Type Matcher (Day 2). A few tap questions suggest which loan type tends
 * to fit — VA, USDA, FHA, or Conventional — with a plain-language reason. It's
 * an educational starting point, not a pre-approval; learners confirm with a
 * lender or counselor.
 */
const T = {
  title: { en: "Try it: which loan might fit you?", es: "Pruébalo: ¿qué préstamo podría servirte?", ar: "جرّبها: أي قرض قد يناسبك؟" },
  intro: {
    en: "Answer a few questions for a starting suggestion. A lender or Benjamin Rose counselor confirms what you actually qualify for.",
    es: "Responde unas preguntas para una sugerencia inicial. Un prestamista o asesor de Benjamin Rose confirma para qué calificas.",
    ar: "أجب عن أسئلة قليلة لاقتراح مبدئي. ويؤكّد مُقرض أو مستشار من Benjamin Rose ما تتأهل له فعلاً.",
  },
  q_vet: { en: "Are you a veteran or active-duty military?", es: "¿Eres veterano o militar en servicio?", ar: "هل أنت محارب قديم أو في الخدمة العسكرية؟" },
  q_rural: { en: "Is the home in a rural or small-town area?", es: "¿La casa está en zona rural o pueblo pequeño?", ar: "هل المنزل في منطقة ريفية أو بلدة صغيرة؟" },
  q_credit: { en: "Your credit score, roughly", es: "Tu puntaje de crédito, aproximado", ar: "درجتك الائتمانية تقريباً" },
  q_down: { en: "Down payment you can manage", es: "Pago inicial que puedes manejar", ar: "الدفعة الأولى التي تستطيعها" },
  yes: { en: "Yes", es: "Sí", ar: "نعم" },
  no: { en: "No / not sure", es: "No / no estoy seguro", ar: "لا / غير متأكد" },
  cLow: { en: "Under 620", es: "Menos de 620", ar: "أقل من 620" },
  cMid: { en: "620–679", es: "620–679", ar: "620–679" },
  cHigh: { en: "680+", es: "680+", ar: "680+" },
  dLow: { en: "Under 3.5%", es: "Menos de 3.5%", ar: "أقل من 3.5%" },
  dMid: { en: "3.5%–5%", es: "3.5%–5%", ar: "3.5%–5%" },
  dHigh: { en: "5%+", es: "5%+", ar: "5%+" },
  result: { en: "A good loan type to ask about:", es: "Un buen tipo de préstamo para preguntar:", ar: "نوع قرض جيد للسؤال عنه:" },
  disclaimer: { en: "This is educational, not a pre-approval. Always confirm with a lender or a HUD-approved counselor (216-791-8000).", es: "Esto es educativo, no una preaprobación. Confirma siempre con un prestamista o asesor aprobado por HUD (216-791-8000).", ar: "هذا تثقيفي وليس موافقة مبدئية. تأكّد دائماً مع مُقرض أو مستشار معتمد من HUD (216-791-8000)." },
  va: { en: "VA loan", es: "Préstamo VA", ar: "قرض VA" },
  vaWhy: { en: "Veterans and service members often get 0% down and no monthly mortgage insurance — usually the best deal if you qualify.", es: "Veteranos y militares suelen obtener 0% inicial y sin seguro hipotecario mensual — normalmente la mejor opción si calificas.", ar: "غالباً يحصل المحاربون والعسكريون على دفعة 0% وبلا تأمين رهن شهري - عادةً أفضل خيار إن تأهّلت." },
  usda: { en: "USDA loan", es: "Préstamo USDA", ar: "قرض USDA" },
  usdaWhy: { en: "In eligible rural and some suburban areas, USDA allows 0% down with income limits — great if the location qualifies.", es: "En zonas rurales y algunas suburbanas elegibles, USDA permite 0% inicial con límites de ingreso — ideal si el lugar califica.", ar: "في المناطق الريفية وبعض الضواحي المؤهلة، يسمح USDA بدفعة 0% بحدود دخل - رائع إن تأهّل الموقع." },
  fha: { en: "FHA loan", es: "Préstamo FHA", ar: "قرض FHA" },
  fhaWhy: { en: "FHA is flexible on credit and allows 3.5% down — a common fit when credit is still building or the down payment is small.", es: "FHA es flexible con el crédito y permite 3.5% inicial — común cuando el crédito aún crece o el inicial es pequeño.", ar: "FHA مرن مع الائتمان ويسمح بدفعة 3.5% - مناسب شائع عندما يكون الائتمان قيد البناء أو الدفعة صغيرة." },
  conv: { en: "Conventional loan", es: "Préstamo convencional", ar: "قرض تقليدي" },
  convWhy: { en: "With solid credit you can use a conventional loan with as little as 3% down, and drop PMI once you reach 20% equity.", es: "Con buen crédito puedes usar un préstamo convencional con tan poco como 3% inicial, y quitar el PMI al llegar al 20% de plusvalía.", ar: "بائتمان جيد يمكنك استخدام قرض تقليدي بدفعة لا تقل عن 3%، وإلغاء تأمين PMI عند بلوغ 20% من الملكية." },
} satisfies Record<string, L>;

export function LoanTypeMatcher({ lang }: { lang: LearnLang }) {
  const [vet, setVet] = useState<boolean | null>(null);
  const [rural, setRural] = useState<boolean | null>(null);
  const [credit, setCredit] = useState<"low" | "mid" | "high" | null>(null);
  const [down, setDown] = useState<"low" | "mid" | "high" | null>(null);

  const ready = vet !== null && rural !== null && credit !== null && down !== null;

  let key: "va" | "usda" | "fha" | "conv" = "conv";
  if (ready) {
    if (vet) key = "va";
    else if (rural) key = "usda";
    else if (credit === "low" || credit === "mid" || down === "low") key = "fha";
    else key = "conv";
  }

  const Toggle = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-2 text-sm ${on ? "bg-brand-rose text-white" : "border border-input hover:bg-muted"}`}
    >
      {children}
    </button>
  );

  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">🧭</span>
        <h3 className="font-semibold">{T.title[lang]}</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{T.intro[lang]}</p>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-sm font-medium">{T.q_vet[lang]}</p>
          <div className="mt-1.5 flex gap-2">
            <Toggle on={vet === true} onClick={() => setVet(true)}>{T.yes[lang]}</Toggle>
            <Toggle on={vet === false} onClick={() => setVet(false)}>{T.no[lang]}</Toggle>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">{T.q_rural[lang]}</p>
          <div className="mt-1.5 flex gap-2">
            <Toggle on={rural === true} onClick={() => setRural(true)}>{T.yes[lang]}</Toggle>
            <Toggle on={rural === false} onClick={() => setRural(false)}>{T.no[lang]}</Toggle>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">{T.q_credit[lang]}</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <Toggle on={credit === "low"} onClick={() => setCredit("low")}>{T.cLow[lang]}</Toggle>
            <Toggle on={credit === "mid"} onClick={() => setCredit("mid")}>{T.cMid[lang]}</Toggle>
            <Toggle on={credit === "high"} onClick={() => setCredit("high")}>{T.cHigh[lang]}</Toggle>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">{T.q_down[lang]}</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <Toggle on={down === "low"} onClick={() => setDown("low")}>{T.dLow[lang]}</Toggle>
            <Toggle on={down === "mid"} onClick={() => setDown("mid")}>{T.dMid[lang]}</Toggle>
            <Toggle on={down === "high"} onClick={() => setDown("high")}>{T.dHigh[lang]}</Toggle>
          </div>
        </div>
      </div>

      {ready && (
        <div className="mt-5 rounded-lg bg-brand-blush p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-rose">{T.result[lang]}</p>
          <p className="mt-1 font-serif text-xl font-bold text-brand-plum">{T[key][lang]}</p>
          <p className="mt-1 text-sm text-brand-plum">{T[`${key}Why` as keyof typeof T][lang]}</p>
        </div>
      )}

      <p className="mt-3 text-xs text-muted-foreground">{T.disclaimer[lang]}</p>
    </Card>
  );
}
