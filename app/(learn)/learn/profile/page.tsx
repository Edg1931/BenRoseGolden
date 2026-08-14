import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentLearner } from "@/lib/learn/accounts";
import { buildTranscript } from "@/lib/learn/transcript";
import { LearnerProfilePanel } from "@/components/learn/learner-profile-panel";
import { matchedPrograms, programsPendingCertificate } from "@/lib/participants/eligibility";
import { loadAllPrograms } from "@/lib/programs/sources";
import { CREDIT_BAND_LABELS } from "@/lib/participants/schema";
import { TRACK_LABELS } from "@/lib/participants/curriculum";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Profile — Benjamin Rose Housing",
  description:
    "Your homebuyer education record: classes completed, your certificate, and the assistance programs you may qualify for.",
};

/**
 * The learner's own profile: everything the program holds about them in one
 * place — classes taken, scores, certificate, and the assistance their record
 * qualifies them for. It's the same underlying record their counselor sees.
 */
export default async function LearnerProfilePage() {
  const learner = await getCurrentLearner();
  if (!learner) redirect("/learn/start");

  const t = buildTranscript(learner);
  const programs = await loadAllPrograms();
  const matches = matchedPrograms(learner, programs);
  const pending = programsPendingCertificate(learner, programs);

  const fullName = [learner.firstName, learner.lastName].filter(Boolean).join(" ");
  const hours = Math.round((t.minutesCompleted / 60) * 10) / 10;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-rose">Your profile</p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-brand-plum">{fullName}</h1>
      <p className="mt-2 text-muted-foreground">
        {learner.email && <>{learner.email} · </>}Joined {formatDate(learner.dateAdded)} ·{" "}
        {hours} of 8 education hours complete
      </p>

      {/* Progress banner */}
      <div className="mt-6 rounded-xl border border-border bg-white p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-semibold text-brand-plum">
              {t.graduated ? "🎓 You finished the course" : "Your progress"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t.passedCount} of {t.totalDays} classes passed
              {t.graduated && t.graduationDate && <> · completed {formatDate(t.graduationDate)}</>}
            </p>
          </div>
          {t.graduated ? (
            <Link
              href="/learn/certificate"
              className="rounded-md bg-brand-rose px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-plum"
            >
              View your certificate →
            </Link>
          ) : t.nextDay ? (
            <Link
              href={`/learn/${t.nextDay.slug}`}
              className="rounded-md bg-brand-rose px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-plum"
            >
              {t.passedCount === 0 ? "Start Day 1" : "Continue"}: {t.nextDay.title} →
            </Link>
          ) : null}
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-brand-blush">
          <div
            className="h-full rounded-full bg-brand-rose transition-all"
            style={{ width: `${t.percent}%` }}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Classes taken */}
          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="font-semibold text-brand-plum">Classes you&apos;ve taken</h2>
            <ul className="mt-3 divide-y divide-border">
              {t.days.map((d) => (
                <li key={d.day.slug} className="flex flex-wrap items-center gap-3 py-3">
                  <span className="text-xl" aria-hidden>
                    {d.passed ? "✅" : d.day.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium leading-tight text-foreground">
                      Day {d.day.order}: {d.day.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {d.lessonCount} lessons · {d.minutes} min
                      {d.passed && d.passedDate && <> · passed {formatDate(d.passedDate)}</>}
                      {d.passed && typeof d.score === "number" && <> · scored {d.score}%</>}
                    </div>
                  </div>
                  {d.passed ? (
                    <Link
                      href={`/learn/${d.day.slug}`}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Review
                    </Link>
                  ) : (
                    <Link
                      href={`/learn/${d.day.slug}`}
                      className="rounded-md border border-brand-rose px-3 py-1.5 text-sm font-medium text-brand-rose hover:bg-brand-blush"
                    >
                      Take this class
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Certificates */}
          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="font-semibold text-brand-plum">Your certificates</h2>
            {t.passedCount === 0 ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Pass your first class test and your certificate will appear here.
              </p>
            ) : (
              <>
                <ul className="mt-3 space-y-2">
                  {t.days
                    .filter((d) => d.passed)
                    .map((d) => (
                      <li
                        key={d.day.slug}
                        className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                      >
                        <span>Day {d.day.order} — {d.day.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {d.passedDate && formatDate(d.passedDate)}
                        </span>
                      </li>
                    ))}
                </ul>
                {t.graduated ? (
                  <div className="mt-4 rounded-lg border border-brand-gold/40 bg-brand-gold/5 p-4">
                    <p className="text-sm font-semibold text-brand-plum">
                      🎓 Certificate of Completion — Pre-Purchase Homebuyer Education
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This is the certificate most down-payment-assistance programs ask for.
                    </p>
                    <Link
                      href="/learn/certificate"
                      className="mt-2 inline-block text-sm font-medium text-brand-rose hover:underline"
                    >
                      View &amp; print it →
                    </Link>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Finish all {t.totalDays} classes to earn your full Certificate of Completion —{" "}
                    {t.totalDays - t.passedCount} to go.
                  </p>
                )}
              </>
            )}
          </section>

          {/* Assistance */}
          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="font-semibold text-brand-plum">Assistance you may qualify for</h2>
            {matches.length === 0 ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Add your county, household size, and income in “Your details” so we can match you to
                Ohio programs.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {matches.slice(0, 5).map((m) => (
                  <li key={m.program.id} className="rounded-md border border-border p-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-medium text-foreground">{m.program.name}</span>
                      <span className="text-sm text-brand-rose">{m.program.amount}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{m.program.provider}</div>
                    {m.reasons.length > 0 && (
                      <p className="mt-1 text-xs text-emerald-700">
                        Why you: {m.reasons.slice(0, 2).join("; ")}.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {pending.length > 0 && (
              <div className="mt-4 rounded-lg border border-brand-rose/30 bg-brand-blush/50 p-4">
                <p className="text-sm font-semibold text-brand-plum">
                  🔓 {pending.length} more program{pending.length === 1 ? "" : "s"} unlock when you
                  finish
                </p>
                <ul className="mt-1.5 space-y-1 text-sm text-foreground/90">
                  {pending.slice(0, 4).map((m) => (
                    <li key={m.program.id}>
                      • {m.program.name} — <span className="text-brand-rose">{m.program.amount}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  These require a homebuyer-education certificate. Finishing the course is what
                  unlocks them.
                </p>
              </div>
            )}

            <Link
              href="/assistance"
              className="mt-3 inline-block text-sm font-medium text-brand-rose hover:underline"
            >
              Explore all assistance programs →
            </Link>
          </section>
        </div>

        {/* Sidebar: their own details */}
        <div className="space-y-4">
          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="text-sm font-semibold text-brand-plum">Your snapshot</h2>
            <dl className="mt-2 space-y-1.5 text-sm">
              <Row label="Household size" value={learner.household.size ?? "—"} />
              <Row
                label="Annual income"
                value={
                  learner.household.annualIncome
                    ? `$${learner.household.annualIncome.toLocaleString()}`
                    : "—"
                }
              />
              <Row
                label="% of area median"
                value={learner.household.amiPercent ? `${learner.household.amiPercent}%` : "—"}
              />
              <Row label="Credit range" value={CREDIT_BAND_LABELS[learner.household.creditBand]} />
              <Row label="County" value={learner.address?.county ?? "—"} />
            </dl>
            {learner.tracks.length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Focus: {learner.tracks.map((tr) => TRACK_LABELS[tr]).join(", ")}
              </p>
            )}
          </section>

          <LearnerProfilePanel learner={learner} />

          <p className="px-1 text-xs text-muted-foreground">
            Your counselor at Benjamin Rose can see this record to help you. It is only shared with a
            real-estate agent if you give consent.
          </p>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
