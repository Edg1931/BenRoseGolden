"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LANGUAGES, LANGUAGE_LABELS, type LanguageCode } from "@/lib/participants/curriculum";
import { isCourseLanguage, languageSupportNotice } from "@/lib/learn/language-support";
import { CREDIT_BANDS, CREDIT_BAND_LABELS } from "@/lib/participants/schema";
import { useLang } from "@/components/i18n/lang-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { t } from "@/lib/i18n/public";

/**
 * Learner sign-up / sign-in. Creating a profile is how someone enters the
 * Benjamin Rose database — so the classes, progress, and the financial snapshot
 * that drives assistance matching are all tracked. Trilingual (EN/ES/AR) with a
 * language switcher, so the front door speaks the visitor's language. Financial
 * fields are optional so we capture data without losing anyone.
 */
export function LearnerAuth({ mode, next = "/learn" }: { mode: "signup" | "signin"; next?: string }) {
  const { lang } = useLang();
  const isSignup = mode === "signup";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>("en");
  const langNotice = languageSupportNotice(preferredLanguage);
  const [langTouched, setLangTouched] = useState(false);

  // Default the profile language to the funnel language they chose (until they
  // explicitly pick a different one).
  useEffect(() => {
    if (!langTouched) setPreferredLanguage(lang as LanguageCode);
  }, [lang, langTouched]);

  const [showMatch, setShowMatch] = useState(false);
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [creditBand, setCreditBand] = useState<(typeof CREDIT_BANDS)[number]>("unknown");
  const [firstTimeBuyer, setFirstTimeBuyer] = useState<boolean | undefined>(undefined);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const url = isSignup ? "/api/learn/auth/signup" : "/api/learn/auth/signin";
      const payload = isSignup
        ? {
            firstName, lastName, email, password, phone, preferredLanguage,
            city, county, householdSize, annualIncome, creditBand, firstTimeBuyer,
          }
        : { email, password };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t(lang, "somethingWrong"));
      // Hard navigation so the freshly-set session cookie is used to render the hub.
      window.location.assign(next);
    } catch (e) {
      setErr(e instanceof Error ? e.message : t(lang, "somethingWrong"));
      setBusy(false);
    }
  }

  const field = "mt-1 w-full rounded-md border border-input bg-white px-3 py-2 text-sm";
  const label = "text-sm font-medium";

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher />
        </div>
        <h1 className="font-serif text-2xl font-bold text-brand-plum">
          {isSignup ? t(lang, "authSignupTitle") : t(lang, "authSigninTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isSignup ? t(lang, "authSignupSub") : t(lang, "authSigninSub")}
        </p>

        <form onSubmit={submit} className="mt-5 space-y-4">
          {isSignup && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={label}>{t(lang, "firstName")}</span>
                <input className={field} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </label>
              <label className="block">
                <span className={label}>{t(lang, "lastName")}</span>
                <input className={field} value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </label>
            </div>
          )}
          <label className="block">
            <span className={label}>{t(lang, "email")}</span>
            <input type="email" autoComplete="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="block">
            <span className={label}>{t(lang, "password")}</span>
            <input
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              className={field}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isSignup ? 8 : undefined}
            />
            {isSignup && <span className="mt-1 block text-xs text-muted-foreground">{t(lang, "passwordHint")}</span>}
          </label>

          {isSignup && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className={label}>{t(lang, "phone")} <span className="font-normal text-muted-foreground">{t(lang, "optional")}</span></span>
                  <input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>
                <label className="block">
                  <span className={label}>{t(lang, "language")}</span>
                  <select
                    className={field}
                    value={preferredLanguage}
                    onChange={(e) => { setLangTouched(true); setPreferredLanguage(e.target.value as LanguageCode); }}
                  >
                    {/* Group the list so nobody picks a language expecting
                        translated lessons that don't exist yet. */}
                    <optgroup label="Classes available online">
                      {LANGUAGES.filter(isCourseLanguage).map((l) => (
                        <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Interpreter & printed materials">
                      {LANGUAGES.filter((l) => !isCourseLanguage(l)).map((l) => (
                        <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>
                      ))}
                    </optgroup>
                  </select>
                  {langNotice && (
                    <span className="mt-1 block rounded-md bg-brand-blush px-2.5 py-2 text-xs text-brand-plum">
                      {langNotice.body}
                    </span>
                  )}
                </label>
              </div>

              {/* Optional financial snapshot */}
              <div className="rounded-lg border border-dashed border-brand-rose/40 bg-brand-blush/30 p-3">
                <button
                  type="button"
                  onClick={() => setShowMatch((v) => !v)}
                  className="flex w-full items-center justify-between gap-2 text-start text-sm font-semibold text-brand-plum"
                >
                  <span>🏠 {t(lang, "unlockMatches")}</span>
                  <span className="text-brand-rose">{showMatch ? "–" : "+"}</span>
                </button>
                <p className="mt-1 text-xs text-muted-foreground">{t(lang, "unlockHelp")}</p>
                {showMatch && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className={label}>{t(lang, "city")}</span>
                      <input className={field} value={city} onChange={(e) => setCity(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className={label}>{t(lang, "county")}</span>
                      <input className={field} value={county} onChange={(e) => setCounty(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className={label}>{t(lang, "householdSize")}</span>
                      <input type="number" min={1} className={field} value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className={label}>{t(lang, "annualIncome")}</span>
                      <input type="number" min={0} step={1000} className={field} value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className={label}>{t(lang, "creditEstimate")}</span>
                      <select className={field} value={creditBand} onChange={(e) => setCreditBand(e.target.value as typeof creditBand)}>
                        {CREDIT_BANDS.map((c) => <option key={c} value={c}>{CREDIT_BAND_LABELS[c]}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className={label}>{t(lang, "firstTimeBuyerQ")}</span>
                      <select
                        className={field}
                        value={firstTimeBuyer === undefined ? "" : firstTimeBuyer ? "yes" : "no"}
                        onChange={(e) => setFirstTimeBuyer(e.target.value === "" ? undefined : e.target.value === "yes")}
                      >
                        <option value="">{t(lang, "notSure")}</option>
                        <option value="yes">{t(lang, "yes")}</option>
                        <option value="no">{t(lang, "no")}</option>
                      </select>
                    </label>
                  </div>
                )}
              </div>
            </>
          )}

          {err && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-brand-rose px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-plum disabled:opacity-60"
          >
            {busy ? t(lang, "pleaseWait") : isSignup ? t(lang, "createStart") : t(lang, "signInBtn")}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isSignup ? (
            <>{t(lang, "haveProfile")} <Link href="/learn/signin" className="font-medium text-brand-rose hover:underline">{t(lang, "signInLink")}</Link></>
          ) : (
            <>{t(lang, "newHere")} <Link href="/learn/start" className="font-medium text-brand-rose hover:underline">{t(lang, "createLink")}</Link></>
          )}
        </p>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">{t(lang, "nonprofitNote")}</p>
    </div>
  );
}
