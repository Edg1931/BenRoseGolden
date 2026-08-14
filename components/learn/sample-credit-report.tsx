"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { LearnLang } from "@/lib/learn/content";

type L = Record<LearnLang, string>;

/**
 * Annotated sample credit report. Learners see a realistic (fictional) report
 * and tap each section to learn what it means and what to check — turning the
 * abstract "what's in a credit report" lesson into something concrete. All data
 * is invented; account numbers are masked.
 */
const T = {
  title: { en: "Explore a sample credit report", es: "Explora un informe de crédito de ejemplo", ar: "استكشف نموذج تقرير ائتماني" },
  intro: {
    en: "This is a fictional report. Tap any section's “What to check” to learn how to read it — and what a problem looks like.",
    es: "Este es un informe ficticio. Toca “Qué revisar” en cualquier sección para aprender a leerlo y ver cómo luce un problema.",
    ar: "هذا تقرير وهمي. اضغط «ما الذي تتحقق منه» في أي قسم لتتعلّم كيف تقرأه - وكيف تبدو المشكلة.",
  },
  reportTitle: { en: "Consumer Credit Report", es: "Informe de crédito del consumidor", ar: "تقرير ائتمان المستهلك" },
  scoreLabel: { en: "FICO® Score", es: "Puntaje FICO®", ar: "درجة فايكو®" },
  good: { en: "Good", es: "Bueno", ar: "جيد" },
  whatToCheck: { en: "What to check", es: "Qué revisar", ar: "ما الذي تتحقق منه" },
  hide: { en: "Hide", es: "Ocultar", ar: "إخفاء" },

  secIdentity: { en: "Identifying information", es: "Información de identificación", ar: "معلومات التعريف" },
  identityBody: {
    en: "Name, current and past addresses, date of birth, and employers. Make sure it's all yours — wrong names or addresses can mean a mixed file or identity theft.",
    es: "Nombre, direcciones actuales y pasadas, fecha de nacimiento y empleadores. Asegúrate de que todo sea tuyo: nombres o direcciones erróneas pueden indicar un archivo mezclado o robo de identidad.",
    ar: "الاسم والعناوين الحالية والسابقة وتاريخ الميلاد وأصحاب العمل. تأكّد أنها كلها لك - فالأسماء أو العناوين الخاطئة قد تعني ملفاً مختلطاً أو سرقة هوية.",
  },
  secAccounts: { en: "Credit accounts (tradelines)", es: "Cuentas de crédito", ar: "حسابات الائتمان" },
  accountsBody: {
    en: "Each loan and card, with its limit, balance, and payment history. Check the balances are right, the accounts are yours, and any 'late' marks are accurate. Keep card balances well under the limit.",
    es: "Cada préstamo y tarjeta, con su límite, saldo e historial de pagos. Revisa que los saldos sean correctos, que las cuentas sean tuyas y que cualquier marca de 'atraso' sea exacta. Mantén los saldos muy por debajo del límite.",
    ar: "كل قرض وبطاقة، مع حدّها ورصيدها وسجلّ مدفوعاتها. تحقّق من صحة الأرصدة، وأن الحسابات لك، وأن أي علامة 'تأخّر' دقيقة. وأبقِ أرصدة البطاقات أدنى بكثير من الحدّ.",
  },
  secInquiries: { en: "Inquiries", es: "Consultas", ar: "الاستعلامات" },
  inquiriesBody: {
    en: "A 'hard' inquiry is when you apply for credit; it can dip your score a little. A 'soft' inquiry (checking your own credit, pre-approvals) does not. Too many hard inquiries at once is a red flag to lenders.",
    es: "Una consulta 'dura' es cuando solicitas crédito; puede bajar un poco tu puntaje. Una 'suave' (revisar tu propio crédito, preaprobaciones) no. Muchas consultas duras a la vez son una señal de alerta para los prestamistas.",
    ar: "الاستعلام 'الصارم' هو عند تقديمك لطلب ائتمان؛ وقد يخفض درجتك قليلاً. أما 'الميسّر' (فحص ائتمانك، الموافقات المسبقة) فلا. وكثرة الاستعلامات الصارمة دفعةً واحدة إشارة تحذير للمُقرضين.",
  },
  secPublic: { en: "Public records & collections", es: "Registros públicos y cobranzas", ar: "السجلّات العامة وديون التحصيل" },
  publicBody: {
    en: "Bankruptcies, tax liens, and accounts sent to collections appear here and hurt the most. The best report has this section empty — if something's here and it's wrong, dispute it.",
    es: "Las bancarrotas, gravámenes fiscales y cuentas en cobranza aparecen aquí y son lo que más daña. El mejor informe tiene esta sección vacía; si hay algo y está mal, dispútalo.",
    ar: "تظهر هنا حالات الإفلاس والامتيازات الضريبية والحسابات المُحالة للتحصيل، وهي الأكثر ضرراً. وأفضل تقرير تكون فيه هذه الخانة فارغة - وإن وُجد شيء وكان خاطئاً، فاعترض عليه.",
  },
  utilNote: { en: "Using 15% of your limit — nicely low ✓", es: "Usa el 15% del límite — bien bajo ✓", ar: "تستخدم 15% من الحدّ - منخفض جيداً ✓" },
  onTime: { en: "On time", es: "Al día", ar: "في الموعد" },
  open: { en: "Open", es: "Abierta", ar: "مفتوحة" },
  none: { en: "None — great!", es: "Ninguno — ¡excelente!", ar: "لا شيء - ممتاز!" },
} satisfies Record<string, L>;

function Section({
  title,
  body,
  lang,
  children,
}: {
  title: string;
  body: string;
  lang: LearnLang;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const t = (k: string) => T[k as keyof typeof T][lang];
  return (
    <div className="border-b border-border last:border-b-0">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-plum">{title}</span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="shrink-0 rounded-full border border-brand-rose px-2.5 py-0.5 text-[11px] font-medium text-brand-rose hover:bg-brand-blush"
        >
          {open ? t("hide") : `ⓘ ${t("whatToCheck")}`}
        </button>
      </div>
      <div className="px-3 pb-3">{children}</div>
      {open && (
        <p className="mx-3 mb-3 rounded-md bg-brand-blush px-3 py-2 text-xs leading-relaxed text-brand-plum">
          {body}
        </p>
      )}
    </div>
  );
}

export function SampleCreditReport({ lang }: { lang: LearnLang }) {
  const t = (k: string) => T[k as keyof typeof T][lang];

  return (
    <Card className="mt-6 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">📄</span>
        <h3 className="font-semibold">{t("title")}</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{t("intro")}</p>

      {/* The mock report */}
      <div className="mt-4 overflow-hidden rounded-lg border-2 border-border">
        {/* Report header */}
        <div className="flex items-center justify-between gap-3 bg-brand-plum px-4 py-3 text-white">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/70">{t("reportTitle")}</p>
            <p className="font-semibold">Jordan A. Sample</p>
          </div>
          <div className="text-end">
            <p className="text-[10px] uppercase tracking-wide text-white/70">{t("scoreLabel")}</p>
            <p className="font-serif text-2xl font-bold leading-none">720</p>
            <p className="text-[11px] font-medium text-emerald-300">{t("good")}</p>
          </div>
        </div>

        <Section title={t("secIdentity")} body={t("identityBody")} lang={lang}>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div><dt className="text-muted-foreground">Name</dt><dd>Jordan A. Sample</dd></div>
            <div><dt className="text-muted-foreground">SSN</dt><dd>•••-••-4821</dd></div>
            <div><dt className="text-muted-foreground">Address</dt><dd>Cleveland, OH</dd></div>
            <div><dt className="text-muted-foreground">Employer</dt><dd>Lincoln Metals</dd></div>
          </dl>
        </Section>

        <Section title={t("secAccounts")} body={t("accountsBody")} lang={lang}>
          <div className="space-y-2">
            <div className="rounded-md border border-border p-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">Rose Bank Visa ••4502</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] text-emerald-700">{t("onTime")}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                <span>Credit card</span>
                <span>Limit $3,000</span>
                <span>Balance $450</span>
                <span>{t("open")}</span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-700">{t("utilNote")}</p>
            </div>
            <div className="rounded-md border border-border p-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">Auto Finance Co ••7731</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] text-emerald-700">{t("onTime")}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                <span>Auto loan</span>
                <span>Original $18,000</span>
                <span>Balance $9,200</span>
                <span>{t("open")}</span>
              </div>
            </div>
          </div>
        </Section>

        <Section title={t("secInquiries")} body={t("inquiriesBody")} lang={lang}>
          <div className="text-sm">
            <div className="flex items-center justify-between">
              <span>Greater Cleveland Mortgage</span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-brand-goldink">Hard · 03/2026</span>
            </div>
          </div>
        </Section>

        <Section title={t("secPublic")} body={t("publicBody")} lang={lang}>
          <p className="text-sm text-emerald-700">{t("none")}</p>
        </Section>
      </div>
    </Card>
  );
}
