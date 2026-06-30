"use client";

import { useLang } from "@/components/i18n/lang-provider";
import { t, fillPub } from "@/lib/i18n/public";

/** Translated heading for the public assistance finder page. */
export function AssistanceIntro({ programCount, newestVerified }: { programCount: number; newestVerified?: string }) {
  const { lang } = useLang();
  return (
    <div className="mx-auto mb-6 max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-rose">{t(lang, "aKicker")}</p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-brand-plum sm:text-4xl">{t(lang, "aTitle")}</h1>
      <p className="mt-3 text-muted-foreground">{fillPub(t(lang, "aSubtitle"), { n: programCount })}</p>
      {newestVerified && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-blush px-3 py-1 text-xs font-medium text-brand-plum">
          <span aria-hidden>🔄</span>
          {fillPub(t(lang, "aReviewed"), { date: newestVerified })}
        </p>
      )}
    </div>
  );
}
