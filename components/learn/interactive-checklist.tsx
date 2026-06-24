"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { LearnLang } from "@/lib/learn/content";

type L = Record<LearnLang, string>;
interface Group { label: L; items: L[] }

function Shell({
  lang,
  icon,
  title,
  intro,
  groups,
  done,
}: {
  lang: LearnLang;
  icon: string;
  title: L;
  intro: L;
  groups: Group[];
  done: L;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const total = groups.reduce((s, g) => s + g.items.length, 0);
  const count = Object.values(checked).filter(Boolean).length;
  const allDone = count === total;

  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h3 className="font-semibold">{title[lang]}</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{intro[lang]}</p>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-brand-rose transition-all" style={{ width: `${(count / total) * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground">{count}/{total}</span>
      </div>

      <div className="mt-4 space-y-4">
        {groups.map((g, gi) => (
          <div key={gi}>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-plum">{g.label[lang]}</p>
            <div className="mt-1.5 space-y-1">
              {g.items.map((it, ii) => {
                const key = `${gi}-${ii}`;
                const on = !!checked[key];
                return (
                  <label key={key} className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2 text-sm ${on ? "border-emerald-300 bg-emerald-50" : "border-input hover:bg-muted/50"}`}>
                    <input type="checkbox" checked={on} onChange={() => setChecked((c) => ({ ...c, [key]: !c[key] }))} className="accent-brand-rose" />
                    <span className={on ? "text-emerald-800 line-through decoration-emerald-400" : ""}>{it[lang]}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {allDone && (
        <p className="mt-4 rounded-md bg-emerald-100/70 px-3 py-2 text-sm font-medium text-emerald-800">🎉 {done[lang]}</p>
      )}
    </Card>
  );
}

// ── Day 3: home inspection checklist ────────────────────────────────────────
const INSPECTION: Group[] = [
  {
    label: { en: "Structure & exterior", es: "Estructura y exterior", ar: "الهيكل والخارج" },
    items: [
      { en: "Roof age & condition, gutters", es: "Edad y estado del techo, canaletas", ar: "عمر السقف وحالته، المزاريب" },
      { en: "Foundation cracks & grading", es: "Grietas en cimientos y desnivel", ar: "شقوق الأساسات والتدرّج" },
      { en: "Siding, windows & doors", es: "Revestimiento, ventanas y puertas", ar: "الكسوة والنوافذ والأبواب" },
      { en: "Water drains away from the house", es: "El agua drena lejos de la casa", ar: "تصريف الماء بعيداً عن المنزل" },
    ],
  },
  {
    label: { en: "Major systems", es: "Sistemas principales", ar: "الأنظمة الرئيسية" },
    items: [
      { en: "Electrical panel & outlets", es: "Panel eléctrico y enchufes", ar: "اللوحة الكهربائية والمنافذ" },
      { en: "Plumbing & water pressure", es: "Plomería y presión de agua", ar: "السباكة وضغط الماء" },
      { en: "Heating & cooling (age)", es: "Calefacción y aire (edad)", ar: "التدفئة والتبريد (العمر)" },
      { en: "Water heater condition", es: "Estado del calentador de agua", ar: "حالة سخّان الماء" },
    ],
  },
  {
    label: { en: "Inside & safety", es: "Interior y seguridad", ar: "الداخل والسلامة" },
    items: [
      { en: "Signs of moisture or mold", es: "Señales de humedad o moho", ar: "علامات الرطوبة أو العفن" },
      { en: "Attic & insulation", es: "Ático y aislamiento", ar: "العلّية والعزل" },
      { en: "Smoke & CO detectors", es: "Detectores de humo y CO", ar: "أجهزة كشف الدخان وأول أكسيد الكربون" },
      { en: "Appliances that stay", es: "Electrodomésticos incluidos", ar: "الأجهزة المتبقية" },
    ],
  },
];

export function InspectionChecklist({ lang }: { lang: LearnLang }) {
  return (
    <Shell
      lang={lang}
      icon="🔍"
      title={{ en: "Home inspection checklist", es: "Lista de inspección", ar: "قائمة فحص المنزل" }}
      intro={{
        en: "Bring this to the inspection (and attend if you can). Tick each item as the inspector covers it.",
        es: "Lleva esto a la inspección (y asiste si puedes). Marca cada punto cuando el inspector lo revise.",
        ar: "اصطحب هذه إلى الفحص (واحضر إن استطعت). علّم كل بند عندما يفحصه المختص.",
      }}
      groups={INSPECTION}
      done={{
        en: "That's the full sweep — review the report and use any problems to renegotiate.",
        es: "Eso es todo el recorrido: revisa el informe y usa cualquier problema para renegociar.",
        ar: "هذه الجولة كاملة - راجع التقرير واستخدم أي مشاكل لإعادة التفاوض.",
      }}
    />
  );
}

// ── Day 4: seasonal maintenance planner ─────────────────────────────────────
const MAINTENANCE: Group[] = [
  {
    label: { en: "🌷 Spring", es: "🌷 Primavera", ar: "🌷 الربيع" },
    items: [
      { en: "Inspect roof & clean gutters", es: "Revisar techo y limpiar canaletas", ar: "فحص السقف وتنظيف المزاريب" },
      { en: "Check drainage & grading", es: "Revisar drenaje y desnivel", ar: "فحص التصريف والتدرّج" },
      { en: "Service the AC before summer", es: "Dar servicio al aire antes del verano", ar: "صيانة المكيّف قبل الصيف" },
      { en: "Test the sump pump", es: "Probar la bomba de sumidero", ar: "اختبار مضخة التصريف" },
    ],
  },
  {
    label: { en: "☀️ Summer", es: "☀️ Verano", ar: "☀️ الصيف" },
    items: [
      { en: "Seal decks, siding & gaps", es: "Sellar terrazas, revestimiento y grietas", ar: "سدّ الأسطح والكسوة والفجوات" },
      { en: "Watch for pests", es: "Vigilar plagas", ar: "مراقبة الآفات" },
      { en: "Clean the dryer vent", es: "Limpiar el ducto de la secadora", ar: "تنظيف فتحة النشّافة" },
    ],
  },
  {
    label: { en: "🍂 Fall", es: "🍂 Otoño", ar: "🍂 الخريف" },
    items: [
      { en: "Clean gutters again", es: "Limpiar canaletas otra vez", ar: "تنظيف المزاريب مجدداً" },
      { en: "Service the furnace", es: "Dar servicio a la calefacción", ar: "صيانة المدفأة" },
      { en: "Weatherstrip doors & windows", es: "Sellar puertas y ventanas", ar: "عزل الأبواب والنوافذ" },
      { en: "Drain outdoor faucets", es: "Vaciar llaves exteriores", ar: "تفريغ الحنفيات الخارجية" },
    ],
  },
  {
    label: { en: "❄️ Winter", es: "❄️ Invierno", ar: "❄️ الشتاء" },
    items: [
      { en: "Watch for ice dams", es: "Vigilar presas de hielo", ar: "مراقبة السدود الجليدية" },
      { en: "Keep pipes from freezing", es: "Evitar que las tuberías se congelen", ar: "حماية الأنابيب من التجمّد" },
      { en: "Test smoke & CO detectors", es: "Probar detectores de humo y CO", ar: "اختبار كواشف الدخان وأول أكسيد الكربون" },
      { en: "Change HVAC filters", es: "Cambiar filtros del sistema", ar: "تغيير فلاتر التكييف" },
    ],
  },
];

export function MaintenancePlanner({ lang }: { lang: LearnLang }) {
  return (
    <Shell
      lang={lang}
      icon="🔄"
      title={{ en: "Seasonal maintenance planner", es: "Plan de mantenimiento por temporada", ar: "مخطّط الصيانة الموسمية" }}
      intro={{
        en: "Home maintenance runs in a yearly cycle. Tick tasks as you go — small upkeep prevents big repairs.",
        es: "El mantenimiento sigue un ciclo anual. Marca tareas a tu paso: el cuidado pequeño evita reparaciones grandes.",
        ar: "تسير صيانة المنزل في دورة سنوية. علّم المهام أولاً بأول - فالعناية الصغيرة تمنع الإصلاحات الكبيرة.",
      }}
      groups={MAINTENANCE}
      done={{
        en: "A full year covered — this rhythm is how owners protect their equity.",
        es: "Un año completo cubierto: este ritmo es como los dueños protegen su plusvalía.",
        ar: "عام كامل مغطّى - هذا الإيقاع هو كيف يحمي الملّاك قيمة منازلهم.",
      }}
    />
  );
}
