"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

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

const CREDIT_BANDS = [
  { label: "I'm not sure yet", value: 0 },
  { label: "Below 580 (rebuilding)", value: 560 },
  { label: "580–639 (fair)", value: 610 },
  { label: "640–699 (good)", value: 670 },
  { label: "700+ (strong)", value: 720 },
];

const OCCUPATIONS = [
  "",
  "Teacher / educator",
  "Police officer",
  "Firefighter / EMT",
  "Healthcare worker",
  "Veteran / active military",
  "Other",
];

/**
 * Public, self-serve down-payment-assistance finder: a short questionnaire,
 * then ranked programs with plain-language "you qualify because…" reasons,
 * verification dates, and clear next steps. Programs that require homebuyer
 * education link straight to the free classes.
 */
export function AssistanceFinder({ counties, staff = false }: { counties: string[]; staff?: boolean }) {
  const router = useRouter();
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

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setAnswers((a) => ({ ...a, [k]: v }));

  async function search() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/learn/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          county: answers.county || undefined,
          occupation: answers.occupation || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setResults(data);
      setStep(4);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Search failed");
    } finally {
      setBusy(false);
    }
  }

  const steps = ["Where", "Household", "Money", "About you"];

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      {step < 4 && (
        <ol className="mb-6 flex items-center gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  i < step
                    ? "bg-brand-rose text-white"
                    : i === step
                      ? "border-2 border-brand-rose text-brand-rose"
                      : "border border-border text-muted-foreground"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span className={`hidden text-xs sm:block ${i === step ? "font-semibold" : "text-muted-foreground"}`}>
                {s}
              </span>
              {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
            </li>
          ))}
        </ol>
      )}

      {/* Step 0 — location */}
      {step === 0 && (
        <Card className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">Where are you looking to buy?</h2>
          <label className="block">
            <span className="text-sm font-medium">Ohio county</span>
            <select
              value={answers.county}
              onChange={(e) => set("county", e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2.5 text-sm"
            >
              <option value="">I&apos;m not sure yet / another county</option>
              {counties.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)} County
                </option>
              ))}
            </select>
          </label>
          <p className="text-xs text-muted-foreground">
            Statewide programs apply everywhere in Ohio — picking your county also surfaces local
            city and county programs, which are often the most generous.
          </p>
          <WizardNav onNext={() => setStep(1)} />
        </Card>
      )}

      {/* Step 1 — household */}
      {step === 1 && (
        <Card className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">Tell us about your household</h2>
          <label className="block">
            <span className="text-sm font-medium">People in your household</span>
            <input
              type="number"
              min={1}
              max={8}
              value={answers.householdSize}
              onChange={(e) => set("householdSize", Math.min(8, Math.max(1, Number(e.target.value) || 1)))}
              className="mt-1 w-28 rounded-md border border-input px-3 py-2.5 text-sm"
            />
          </label>
          <div>
            <span className="text-sm font-medium">Is this your first home?</span>
            <div className="mt-2 flex gap-2">
              {[
                { label: "Yes — first-time buyer", v: true },
                { label: "No, I've owned before", v: false },
              ].map((o) => (
                <button
                  key={o.label}
                  onClick={() => set("firstTimeBuyer", o.v)}
                  className={`rounded-md px-4 py-2 text-sm ${
                    answers.firstTimeBuyer === o.v
                      ? "bg-brand-rose text-white"
                      : "border border-input hover:bg-muted"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Tip: HUD counts you as “first-time” if you haven&apos;t owned a home in the last 3 years.
            </p>
          </div>
          <WizardNav onBack={() => setStep(0)} onNext={() => setStep(2)} />
        </Card>
      )}

      {/* Step 2 — money */}
      {step === 2 && (
        <Card className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">Income &amp; credit</h2>
          <label className="block">
            <span className="text-sm font-medium">Total household income (per year, before taxes)</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-muted-foreground">$</span>
              <input
                type="number"
                min={0}
                step={1000}
                value={answers.householdIncome || ""}
                placeholder="e.g. 52000"
                onChange={(e) => set("householdIncome", Math.max(0, Number(e.target.value) || 0))}
                className="w-40 rounded-md border border-input px-3 py-2.5 text-sm"
              />
              <span className="text-sm text-muted-foreground">/ year</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Leave blank if unsure — we&apos;ll show income limits to check instead of filtering you out.
            </p>
          </label>
          <div>
            <span className="text-sm font-medium">Your credit score, roughly</span>
            <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {CREDIT_BANDS.map((b) => (
                <button
                  key={b.label}
                  onClick={() => set("estimatedCredit", b.value)}
                  className={`rounded-md px-3 py-2 text-start text-sm ${
                    answers.estimatedCredit === b.value
                      ? "bg-brand-rose text-white"
                      : "border border-input hover:bg-muted"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
          <WizardNav onBack={() => setStep(1)} onNext={() => setStep(3)} />
        </Card>
      )}

      {/* Step 3 — about you */}
      {step === 3 && (
        <Card className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">Last two questions</h2>
          <label className="block">
            <span className="text-sm font-medium">Do you work in one of these roles? (some programs give extra help)</span>
            <select
              value={answers.occupation}
              onChange={(e) => set("occupation", e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2.5 text-sm"
            >
              {OCCUPATIONS.map((o) => (
                <option key={o} value={o}>
                  {o || "No / prefer not to say"}
                </option>
              ))}
            </select>
          </label>
          <div>
            <span className="text-sm font-medium">
              Have you completed a HUD-approved homebuyer education course?
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { label: "Yes — I have my certificate", v: true },
                { label: "Not yet", v: false },
              ].map((o) => (
                <button
                  key={o.label}
                  onClick={() => set("completedHomebuyerEd", o.v)}
                  className={`rounded-md px-4 py-2 text-sm ${
                    answers.completedHomebuyerEd === o.v
                      ? "bg-brand-rose text-white"
                      : "border border-input hover:bg-muted"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {!answers.completedHomebuyerEd && (
              <p className="mt-2 rounded-md bg-brand-blush px-3 py-2 text-xs text-brand-plum">
                Most programs require it — and our classes are free.{" "}
                <Link href="/learn" className="font-semibold underline">
                  Start Day 1
                </Link>{" "}
                while you explore.
              </p>
            )}
          </div>
          {err && <p className="text-sm text-red-700">{err}</p>}
          <WizardNav
            onBack={() => setStep(2)}
            onNext={search}
            nextLabel={busy ? "Searching…" : "Find my programs →"}
            nextDisabled={busy}
          />
        </Card>
      )}

      {/* Results */}
      {step === 4 && results && (
        <div className="space-y-4">
          <div className="text-center print:hidden">
            <h2 className="font-serif text-2xl font-bold text-brand-plum">
              {results.matches.length} program{results.matches.length === 1 ? "" : "s"} you may
              qualify for
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Screened from {results.totalPrograms} tracked Ohio programs · ranked by fit.{" "}
              <button onClick={() => setStep(0)} className="font-medium text-brand-rose underline">
                Change my answers
              </button>
            </p>
            {staff && (
              <button
                onClick={() => window.print()}
                className="mt-3 inline-flex items-center gap-2 rounded-md border border-brand-rose px-4 py-2 text-sm font-medium text-brand-rose hover:bg-brand-blush"
              >
                🖨 Print client scenario
              </button>
            )}
          </div>

          {/* Print-only header: a clean client-scenario sheet for staff/clients to keep */}
          <div className="hidden print:block">
            <h2 className="font-serif text-xl font-bold text-brand-plum">
              Benjamin Rose Housing — Down-Payment Assistance Scenario
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Prepared {formatDate(new Date().toISOString())} · {results.matches.length} of{" "}
              {results.totalPrograms} tracked Ohio programs matched · estimates only, verify before applying.
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <div className="flex justify-between border-b border-border py-1">
                <dt className="text-muted-foreground">County</dt>
                <dd className="font-medium">{answers.county ? `${answers.county.charAt(0).toUpperCase()}${answers.county.slice(1)} County` : "Statewide / unsure"}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-1">
                <dt className="text-muted-foreground">First-time buyer</dt>
                <dd className="font-medium">{answers.firstTimeBuyer ? "Yes" : "No"}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-1">
                <dt className="text-muted-foreground">Household size</dt>
                <dd className="font-medium">{answers.householdSize}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-1">
                <dt className="text-muted-foreground">Household income</dt>
                <dd className="font-medium">{answers.householdIncome ? `$${answers.householdIncome.toLocaleString()}/yr` : "Not given"}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-1">
                <dt className="text-muted-foreground">Credit (estimated)</dt>
                <dd className="font-medium">{CREDIT_BANDS.find((b) => b.value === answers.estimatedCredit)?.label ?? "—"}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-1">
                <dt className="text-muted-foreground">Occupation</dt>
                <dd className="font-medium">{answers.occupation || "—"}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-1">
                <dt className="text-muted-foreground">Homebuyer ed complete</dt>
                <dd className="font-medium">{answers.completedHomebuyerEd ? "Yes (certificate)" : "Not yet"}</dd>
              </div>
            </dl>
          </div>

          {results.matches.length === 0 && (
            <Card className="p-6 text-center text-sm text-muted-foreground">
              No automatic matches with these answers — that doesn&apos;t mean nothing exists. A
              Benjamin Rose counselor can review programs with flexible or case-by-case terms with
              you, free.
            </Card>
          )}

          {results.matches.map((m, i) => (
            <Card
              key={m.id}
              onClick={() => router.push(`/assistance/${m.id}`)}
              className={`cursor-pointer p-5 transition hover:border-brand-rose hover:shadow-md print:break-inside-avoid print:shadow-none print:transition-none ${m.unlockedByCertificate ? "ring-2 ring-brand-gold" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {i === 0 && (
                      <span className="rounded-full bg-brand-rose px-2 py-0.5 text-[11px] font-semibold text-white">
                        Best match
                      </span>
                    )}
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {m.assistanceType}
                    </span>
                    {m.unlockedByCertificate && (
                      <span className="rounded-full bg-brand-gold/15 px-2 py-0.5 text-[11px] font-semibold text-brand-gold">
                        🎓 Unlocked by your certificate
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/assistance/${m.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1.5 block font-semibold text-brand-plum hover:text-brand-rose hover:underline"
                  >
                    {m.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{m.provider}</p>
                </div>
                <div className="text-end">
                  <div className="font-serif text-lg font-bold text-brand-rose">{m.amount}</div>
                  <div className="text-[11px] text-muted-foreground">
                    Verified {formatDate(m.lastVerified)}
                  </div>
                </div>
              </div>

              {m.reasons.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {m.reasons.map((r) => (
                    <li key={r} className="flex gap-2 text-sm text-emerald-700">
                      <span aria-hidden>✓</span>
                      <span>You qualify because {r}.</span>
                    </li>
                  ))}
                </ul>
              )}
              {m.caveats.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {m.caveats.map((c) => (
                    <li key={c} className="flex gap-2 text-sm text-brand-gold">
                      <span aria-hidden>⚠</span>
                      <span>Check: {c}.</span>
                    </li>
                  ))}
                </ul>
              )}

              {m.repayment && (
                <p className="mt-2 text-xs text-muted-foreground">Repayment: {m.repayment}</p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
                <span className="text-sm">
                  <span className="font-medium">Next step:</span> {m.nextStep}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 print:hidden">
                <Link
                  href={`/assistance/${m.id}`}
                  className="rounded-md bg-brand-rose px-4 py-2 text-sm font-medium text-white hover:bg-brand-plum"
                >
                  View details & how to apply →
                </Link>
                <a
                  href={m.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Official page ↗
                </a>
                {m.requiresHomebuyerEd && !m.unlockedByCertificate && (
                  <Link
                    href="/learn"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-md border border-brand-rose px-4 py-2 text-sm font-medium text-brand-rose hover:bg-brand-blush"
                  >
                    Take the free classes to unlock →
                  </Link>
                )}
              </div>
              <p className="mt-2 hidden break-all text-xs text-muted-foreground print:block">
                Official program page: {m.link}
                {m.requiresHomebuyerEd && !m.unlockedByCertificate
                  ? " · Requires HUD-approved homebuyer education (free classes at benrose.org)."
                  : ""}
              </p>
            </Card>
          ))}

          <Card className="bg-brand-blush p-5 text-sm text-brand-plum">
            <p className="font-semibold">Always verify before you count on funds.</p>
            <p className="mt-1">
              Program terms and funding change during the year — the dates above show when each was
              last verified by our team. A Benjamin Rose counselor can confirm current availability
              and help you apply, free of charge.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}

function WizardNav({
  onBack,
  onNext,
  nextLabel = "Next →",
  nextDisabled = false,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      {onBack ? (
        <button onClick={onBack} className="rounded-md border border-input px-4 py-2 text-sm hover:bg-muted">
          ← Back
        </button>
      ) : (
        <span />
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="rounded-md bg-brand-rose px-5 py-2 text-sm font-medium text-white hover:bg-brand-plum disabled:opacity-50"
      >
        {nextLabel}
      </button>
    </div>
  );
}
