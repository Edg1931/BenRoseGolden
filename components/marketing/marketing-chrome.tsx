"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useLang } from "@/components/i18n/lang-provider";
import { t } from "@/lib/i18n/public";

export function MarketingHeader() {
  const { lang } = useLang();
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3.5">
        <Link href="/welcome">
          <Logo suffix="Housing" />
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-4">
          <LanguageSwitcher />
          <Link href="/resources" className="hidden text-muted-foreground hover:text-foreground sm:inline">
            {t(lang, "navResources")}
          </Link>
          <Link
            href="/learn"
            className="rounded-md bg-brand-rose px-4 py-1.5 font-medium text-white hover:bg-brand-plum"
          >
            {t(lang, "navTakeClasses")}
          </Link>
          <Link href="/dashboard" className="hidden text-muted-foreground hover:text-foreground sm:inline">
            {t(lang, "navStaff")}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  const { lang } = useLang();
  return (
    <footer className="border-t border-border bg-brand-plum text-white/80">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 sm:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-bold text-white">Benjamin Rose</p>
          <p className="mt-2 text-sm">{t(lang, "footerBlurb")}</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold uppercase tracking-wide text-white/60">{t(lang, "footerPrograms")}</p>
          <ul className="mt-2 space-y-1.5">
            <li><Link href="/learn" className="hover:text-white">{t(lang, "footerProgEd")}</Link></li>
            <li><Link href="/assistance" className="hover:text-white">{t(lang, "footerProgDpa")}</Link></li>
            <li><Link href="/resources" className="hover:text-white">{t(lang, "footerProgResources")}</Link></li>
            <li><Link href="/reviews" className="hover:text-white">{t(lang, "footerProgReviews")}</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold uppercase tracking-wide text-white/60">{t(lang, "footerPartnership")}</p>
          <p className="mt-2">{t(lang, "footerPartnershipBody")}</p>
          <p className="mt-2">
            <a href="https://www.benrose.org" className="underline hover:text-white">benrose.org</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
