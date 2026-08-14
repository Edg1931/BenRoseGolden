"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useLang } from "@/components/i18n/lang-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { t, fillPub } from "@/lib/i18n/public";
import type { LearnLang } from "@/lib/learn/content";
import { OCCUPATION_OPTIONS } from "@/lib/programs/occupations";

interface MatchRow {
  id: string;
  name: string;
  provider: string;
  level: string;
  amount: string;
  assistanceType: string;
  repayment: string | null;
  requiresHomebuyerEd: boolean;
  lastVerified: string;
  reasons: string[];
  caveats: string[];
  unlockedByCertificate: boolean;
  nextStep: string;
  link: string;
}

interface Answers {
  county: string;
  firstTimeBuyer: boolean;
  householdSize: number;
  householdIncome: number;
  estimatedCredit: number;
  occupation: string;
  completedHomebuyerEd: boolean;
}

// Credit bands: stable values, translated labels (by key).
const CREDIT_BANDS: { key: "fCreditUnsure" | "fCreditRebuild" | "fCreditFair" | "fCreditGood" | "fCreditStrong"; value: number }[] = [
  { key: "fCreditUnsure", value: 0 },
  { key: "fCreditRebuild", value: 560 },
  { key: "fCreditFair", value: 610 },
  { key: "fCreditGood", value: 670 },
  { key: "fCreditStrong", value: 720 },
];


/**
 * Public, self-serve down-payment-assistance finder: a short questionnaire,
 * then ranked programs with plain-language "you qualify because…" reasons,
 * verification dates, and clear next steps. The questionnaire and result chrome
 * are trilingual (EN/ES/AR); program names/reasons come from the dataset in
 * English. Staff embed (no language provider) renders in English.
 */
export function AssistanceFinder({ counties, staff = false }: { counties: string[]; staff?: boolean }) {
  const router = useRouter();
  const { lang } = useLang();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    county: "",
    firstTimeBuyer: true,
    householdSize: 2,
    householdIncome: 0,
    estimatedCredit: 0,
    occupation: "",
    completedHomebuyerEd: false,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [results, setResults] = useState<{ totalPrograms: number; matches: MatchRow[] } | null>(null);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setAnswers((a) => ({ ...a, [k]: v }));

  async function search() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/learn/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, county: answers.county || undefined, occupation: answers.occupation || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t(lang, "somethingWrong"));
      setResults(data);
      setStep(4);
    } catch (e) {
      setErr(e instanceof Error ? e.message : t(lang, "somethingWrong"));
    } finally {
      setBusy(false);
    }
  }

  const steps = [t(lang, "fStepWhere"), t(lang, "fStepHousehold"), t(lang, "fStepMoney"), t(lang, "fStepAbout")];

  return (
    <div className="mx-auto max-w-2xl">
      {!staff && (
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher />
        </div>
      )}

      {/* Step indicator */}
      {step < 4 && (
        <ol className="mb-6 flex items-center gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  i < step ? "bg-brand-rose text-white" : i === step ? "border-2 border-brand-rose text-brand-rose" : "border border-border text-muted-foreground"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span className={`hidden text-xs sm:block ${i === step ? "font-semibold" : "text-muted-foreground"}`}>{s}</span>
              {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
            </li>
          ))}
        </ol>
      )}

      {/* Step 0 — location */}
      {step === 0 && (
        <Card className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">{t(lang, "fWhereTitle")}</h2>
          <label className="block">
            <span className="text-sm font-medium">{t(lang, "fCounty")}</span>
            <select value={answers.county} onChange={(e) => set("county", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2.5 text-sm">
              <option value="">{t(lang, "fCountyAny")}</option>
              {counties.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)} {t(lang, "fCountySuffix")}
                </option>
              ))}
            </select>
          </label>
          <p className="text-xs text-muted-foreground">{t(lang, "fWhereHelp")}</p>
          <WizardNav lang={lang} onNext={() => setStep(1)} />
        </Card>
      )}

      {/* Step 1 — household */}
      {step === 1 && (
        <Card className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">{t(lang, "fHouseholdTitle")}</h2>
          <label className="block">
            <span className="text-sm font-medium">{t(lang, "fPeople")}</span>
            <input
              type="number" min={1} max={8} value={answers.householdSize}
              onChange={(e) => set("householdSize", Math.min(8, Math.max(1, Number(e.target.value) || 1)))}
              className="mt-1 w-28 rounded-md border border-input px-3 py-2.5 text-sm"
            />
          </label>
          <div>
            <span className="text-sm font-medium">{t(lang, "fFirstHomeQ")}</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {[{ label: t(lang, "fFirstYes"), v: true }, { label: t(lang, "fFirstNo"), v: false }].map((o) => (
                <button key={o.label} onClick={() => set("firstTimeBuyer", o.v)}
                  className={`rounded-md px-4 py-2 text-sm ${answers.firstTimeBuyer === o.v ? "bg-brand-rose text-white" : "border border-input hover:bg-muted"}`}>
                  {o.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{t(lang, "fFirstTip")}</p>
          </div>
          <WizardNav lang={lang} onBack={() => setStep(0)} onNext={() => setStep(2)} />
        </Card>
      )}

      {/* Step 2 — money */}
      {step === 2 && (
        <Card className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">{t(lang, "fMoneyTitle")}</h2>
          <label className="block">
            <span className="text-sm font-medium">{t(lang, "fIncomeLabel")}</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-muted-foreground">$</span>
              <input type="number" min={0} step={1000} value={answers.householdIncome || ""} placeholder="e.g. 52000"
                onChange={(e) => set("householdIncome", Math.max(0, Number(e.target.value) || 0))}
                className="w-40 rounded-md border border-input px-3 py-2.5 text-sm" />
              <span className="text-sm text-muted-foreground">{t(lang, "fPerYear")}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{t(lang, "fIncomeHelp")}</p>
          </label>
          <div>
            <span className="text-sm font-medium">{t(lang, "fCreditQ")}</span>
            <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {CREDIT_BANDS.map((b) => (
                <button key={b.key} onClick={() => set("estimatedCredit", b.value)}
                  className={`rounded-md px-3 py-2 text-start text-sm ${answers.estimatedCredit === b.value ? "bg-brand-rose text-white" : "border border-input hover:bg-muted"}`}>
                  {t(lang, b.key)}
                </button>
              ))}
            </div>
          </div>
          <WizardNav lang={lang} onBack={() => setStep(1)} onNext={() => setStep(3)} />
        </Card>
      )}

      {/* Step 3 — about you */}
      {step === 3 && (
        <Card className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">{t(lang, "fAboutTitle")}</h2>
          <label className="block">
            <span className="text-sm font-medium">{t(lang, "fOccQ")}</span>
            <select value={answers.occupation} onChange={(e) => set("occupation", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2.5 text-sm">
              {OCCUPATION_OPTIONS.map((o) => (
                <option key={o} value={o}>{o || t(lang, "fOccNone")}</option>
              ))}
            </select>
          </label>
          <div>
            <span className="text-sm font-medium">{t(lang, "fEdQ")}</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {[{ label: t(lang, "fEdYes"), v: true }, { label: t(lang, "fEdNo"), v: false }].map((o) => (
                <button key={o.label} onClick={() => set("completedHomebuyerEd", o.v)}
                  className={`rounded-md px-4 py-2 text-sm ${answers.completedHomebuyerEd === o.v ? "bg-brand-rose text-white" : "border border-input hover:bg-muted"}`}>
                  {o.label}
                </button>
              ))}
            </div>
            {!answers.completedHomebuyerEd && (
              <p className="mt-2 rounded-md bg-brand-blush px-3 py-2 text-xs text-brand-plum">
                {t(lang, "fEdNote")}{" "}
                <Link href="/learn" className="font-semibold underline">{t(lang, "fEdNoteLink")}</Link>{" "}
                {t(lang, "fEdNoteAfter")}
              </p>
            )}
          </div>
          {err && <p className="text-sm text-red-700">{err}</p>}
          <WizardNav lang={lang} onBack={() => setStep(2)} onNext={search} nextLabel={busy ? t(lang, "fSearching") : t(lang, "fFindBtn")} nextDisabled={busy} />
        </Card>
      )}

      {/* Results */}
      {step === 4 && results && (
        <div className="space-y-4">
          <div className="text-center print:hidden">
            <h2 className="font-serif text-2xl font-bold text-brand-plum">
              {results.matches.length} {t(lang, "fResultsTitle")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {fillPub(t(lang, "fScreenedFrom"), { x: results.totalPrograms })}{" "}
              <button onClick={() => setStep(0)} className="font-medium text-brand-rose underline">{t(lang, "fChangeAnswers")}</button>
            </p>
            {staff && (
              <button onClick={() => window.print()} className="mt-3 inline-flex items-center gap-2 rounded-md border border-brand-rose px-4 py-2 text-sm font-medium text-brand-rose hover:bg-brand-blush">
                {t(lang, "fStaffPrint")}
              </button>
            )}
          </div>

          {/* Print-only client-scenario sheet (staff) */}
          <div className="hidden print:block">
            <h2 className="font-serif text-xl font-bold text-brand-plum">Benjamin Rose Housing — Down-Payment Assistance Scenario</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Prepared {formatDate(new Date().toISOString())} · {results.matches.length} of {results.totalPrograms} tracked Ohio programs matched · estimates only, verify before applying.
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <div className="flex justify-between border-b border-border py-1"><dt className="text-muted-foreground">County</dt><dd className="font-medium">{answers.county ? `${answers.county.charAt(0).toUpperCase()}${answers.county.slice(1)} County` : "Statewide / unsure"}</dd></div>
              <div className="flex justify-between border-b border-border py-1"><dt className="text-muted-foreground">First-time buyer</dt><dd className="font-medium">{answers.firstTimeBuyer ? "Yes" : "No"}</dd></div>
              <div className="flex justify-between border-b border-border py-1"><dt className="text-muted-foreground">Household size</dt><dd className="font-medium">{answers.householdSize}</dd></div>
              <div className="flex justify-between border-b border-border py-1"><dt className="text-muted-foreground">Household income</dt><dd className="font-medium">{answers.householdIncome ? `$${answers.householdIncome.toLocaleString()}/yr` : "Not given"}</dd></div>
              <div className="flex justify-between border-b border-border py-1"><dt className="text-muted-foreground">Credit (estimated)</dt><dd className="font-medium">{CREDIT_BANDS.find((b) => b.value === answers.estimatedCredit) ? t("en", CREDIT_BANDS.find((b) => b.value === answers.estimatedCredit)!.key) : "—"}</dd></div>
              <div className="flex justify-between border-b border-border py-1"><dt className="text-muted-foreground">Occupation</dt><dd className="font-medium">{answers.occupation || "—"}</dd></div>
              <div className="flex justify-between border-b border-border py-1"><dt className="text-muted-foreground">Homebuyer ed complete</dt><dd className="font-medium">{answers.completedHomebuyerEd ? "Yes (certificate)" : "Not yet"}</dd></div>
            </dl>
          </div>

          {results.matches.length === 0 && (
            <Card className="p-6 text-center text-sm text-muted-foreground">{t(lang, "fNoMatch")}</Card>
          )}

          {results.matches.map((m, i) => (
            <Card key={m.id} onClick={() => router.push(`/assistance/${m.id}`)}
              className={`cursor-pointer p-5 transition hover:border-brand-rose hover:shadow-md print:break-inside-avoid print:shadow-none print:transition-none ${m.unlockedByCertificate ? "ring-2 ring-brand-gold" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {i === 0 && <span className="rounded-full bg-brand-rose px-2 py-0.5 text-[11px] font-semibold text-white">{t(lang, "fBestMatch")}</span>}
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{m.assistanceType}</span>
                    {m.unlockedByCertificate && <span className="rounded-full bg-brand-gold/15 px-2 py-0.5 text-[11px] font-semibold text-brand-goldink">{t(lang, "fUnlocked")}</span>}
                  </div>
                  <Link href={`/assistance/${m.id}`} onClick={(e) => e.stopPropagation()} className="mt-1.5 block font-semibold text-brand-plum hover:text-brand-rose hover:underline">{m.name}</Link>
                  <p className="text-xs text-muted-foreground">{m.provider}</p>
                </div>
                <div className="text-end">
                  <div className="font-serif text-lg font-bold text-brand-rose">{m.amount}</div>
                  <div className="text-[11px] text-muted-foreground">{t(lang, "fVerified")} {formatDate(m.lastVerified)}</div>
                </div>
              </div>

              {m.reasons.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {m.reasons.map((r) => (
                    <li key={r} className="flex gap-2 text-sm text-emerald-700"><span aria-hidden>✓</span><span>{t(lang, "fQualifyBecause")} {r}.</span></li>
                  ))}
                </ul>
              )}
              {m.caveats.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {m.caveats.map((c) => (
                    <li key={c} className="flex gap-2 text-sm text-brand-goldink"><span aria-hidden>⚠</span><span>{t(lang, "fCheck")} {c}.</span></li>
                  ))}
                </ul>
              )}

              {m.repayment && <p className="mt-2 text-xs text-muted-foreground">{t(lang, "fRepayment")} {m.repayment}</p>}

              <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
                <span className="text-sm"><span className="font-medium">{t(lang, "fNextStep")}</span> {m.nextStep}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 print:hidden">
                <Link href={`/assistance/${m.id}`} className="rounded-md bg-brand-rose px-4 py-2 text-sm font-medium text-white hover:bg-brand-plum">{t(lang, "fViewDetails")}</Link>
                <a href={m.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted">{t(lang, "fOfficialPage")}</a>
                {m.requiresHomebuyerEd && !m.unlockedByCertificate && (
                  <Link href="/learn" onClick={(e) => e.stopPropagation()} className="rounded-md border border-brand-rose px-4 py-2 text-sm font-medium text-brand-rose hover:bg-brand-blush">{t(lang, "fTakeToUnlock")}</Link>
                )}
              </div>
              <p className="mt-2 hidden break-all text-xs text-muted-foreground print:block">
                Official program page: {m.link}
                {m.requiresHomebuyerEd && !m.unlockedByCertificate ? " · Requires HUD-approved homebuyer education (free classes at benrose.org)." : ""}
              </p>
            </Card>
          ))}

          <Card className="bg-brand-blush p-5 text-sm text-brand-plum">
            <p className="font-semibold">{t(lang, "fVerifyTitle")}</p>
            <p className="mt-1">{t(lang, "fVerifyBody")}</p>
          </Card>
        </div>
      )}
    </div>
  );
}

function WizardNav({
  lang,
  onBack,
  onNext,
  nextLabel,
  nextDisabled = false,
}: {
  lang: LearnLang;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      {onBack ? (
        <button onClick={onBack} className="rounded-md border border-input px-4 py-2 text-sm hover:bg-muted">{t(lang, "fBack")}</button>
      ) : (
        <span />
      )}
      <button onClick={onNext} disabled={nextDisabled} className="rounded-md bg-brand-rose px-5 py-2 text-sm font-medium text-white hover:bg-brand-plum disabled:opacity-50">
        {nextLabel ?? t(lang, "fNext")}
      </button>
    </div>
  );
}
