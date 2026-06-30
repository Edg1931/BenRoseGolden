"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LANGUAGES, LANGUAGE_LABELS, type LanguageCode } from "@/lib/participants/curriculum";
import { CREDIT_BANDS, CREDIT_BAND_LABELS } from "@/lib/participants/schema";

/**
 * Learner sign-up / sign-in. Creating a profile is how someone enters the
 * Benjamin Rose database — so the classes, progress, and the financial snapshot
 * that drives assistance matching are all tracked. Financial fields are optional
 * (framed as "unlock your matches") so we capture data without losing anyone.
 */
export function LearnerAuth({ mode, next = "/learn" }: { mode: "signup" | "signin"; next?: string }) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>("en");

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
            city, county, householdSize, annualIncome,
            creditBand, firstTimeBuyer,
          }
        : { email, password };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      router.push(next);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  }

  const field = "mt-1 w-full rounded-md border border-input bg-white px-3 py-2 text-sm";
  const label = "text-sm font-medium";

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <h1 className="font-serif text-2xl font-bold text-brand-plum">
          {isSignup ? "Create your free profile" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isSignup
            ? "Save your progress across all four classes, earn your certificate, and see the down-payment assistance you may qualify for."
            : "Sign in to pick up your classes where you left off."}
        </p>

        <form onSubmit={submit} className="mt-5 space-y-4">
          {isSignup && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={label}>First name</span>
                <input className={field} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </label>
              <label className="block">
                <span className={label}>Last name</span>
                <input className={field} value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </label>
            </div>
          )}
          <label className="block">
            <span className={label}>Email</span>
            <input type="email" autoComplete="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="block">
            <span className={label}>Password</span>
            <input
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              className={field}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isSignup ? 8 : undefined}
            />
            {isSignup && <span className="mt-1 block text-xs text-muted-foreground">At least 8 characters.</span>}
          </label>

          {isSignup && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className={label}>Phone <span className="font-normal text-muted-foreground">(optional)</span></span>
                  <input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>
                <label className="block">
                  <span className={label}>Language</span>
                  <select className={field} value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value as LanguageCode)}>
                    {LANGUAGES.map((l) => <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>)}
                  </select>
                </label>
              </div>

              {/* Optional financial snapshot */}
              <div className="rounded-lg border border-dashed border-brand-rose/40 bg-brand-blush/30 p-3">
                <button
                  type="button"
                  onClick={() => setShowMatch((v) => !v)}
                  className="flex w-full items-center justify-between text-left text-sm font-semibold text-brand-plum"
                >
                  <span>🏠 Unlock your assistance matches (optional)</span>
                  <span className="text-brand-rose">{showMatch ? "–" : "+"}</span>
                </button>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tell us a little and we&apos;ll show the down-payment help you may qualify for. You can add this later, too.
                </p>
                {showMatch && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className={label}>City</span>
                      <input className={field} value={city} onChange={(e) => setCity(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className={label}>County</span>
                      <input className={field} value={county} onChange={(e) => setCounty(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className={label}>Household size</span>
                      <input type="number" min={1} className={field} value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className={label}>Annual income</span>
                      <input type="number" min={0} step={1000} className={field} value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className={label}>Credit (estimate)</span>
                      <select className={field} value={creditBand} onChange={(e) => setCreditBand(e.target.value as typeof creditBand)}>
                        {CREDIT_BANDS.map((c) => <option key={c} value={c}>{CREDIT_BAND_LABELS[c]}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className={label}>First-time buyer?</span>
                      <select
                        className={field}
                        value={firstTimeBuyer === undefined ? "" : firstTimeBuyer ? "yes" : "no"}
                        onChange={(e) => setFirstTimeBuyer(e.target.value === "" ? undefined : e.target.value === "yes")}
                      >
                        <option value="">Not sure</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
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
            {busy ? "Please wait…" : isSignup ? "Create profile & start →" : "Sign in →"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isSignup ? (
            <>Already have a profile? <Link href="/learn/signin" className="font-medium text-brand-rose hover:underline">Sign in</Link></>
          ) : (
            <>New here? <Link href="/learn/start" className="font-medium text-brand-rose hover:underline">Create your free profile</Link></>
          )}
        </p>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Benjamin Rose is a nonprofit. Your information is used to support your housing goals — never sold.
      </p>
    </div>
  );
}
