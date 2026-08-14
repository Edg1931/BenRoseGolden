import Link from "next/link";
import { redirect } from "next/navigation";
import { CourseMap } from "@/components/learn/course-map";
import { LearnerProfilePanel } from "@/components/learn/learner-profile-panel";
import { getCurrentLearner } from "@/lib/learn/accounts";
import { tryGetCurrentUser } from "@/lib/auth/session";
import { buildTailoring } from "@/lib/learn/tailoring";
import { COURSE_DAYS } from "@/lib/learn/course";
import { matchedPrograms } from "@/lib/participants/eligibility";
import { loadAllPrograms } from "@/lib/programs/sources";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Homebuyer Classes — Benjamin Rose Housing",
  description:
    "Your personalized HUD-approved homebuyer education — progress, certificates, and the down-payment assistance you may qualify for.",
};

export default async function LearnHome() {
  // Classes are gated behind a learner profile so progress and eligibility are tracked.
  // Signed-in staff without a learner account go to the admin Classes overview,
  // where they can preview any day exactly as clients see it.
  const learner = await getCurrentLearner();
  if (!learner) {
    const staff = await tryGetCurrentUser();
    redirect(staff ? "/classes" : "/learn/start");
  }

  const tailoring = buildTailoring(learner);
  const programs = await loadAllPrograms();
  const matches = matchedPrograms(learner, programs);

  // Days this learner has passed per their saved record (so progress follows
  // them across devices, not just this browser's localStorage).
  const serverPassed: Record<string, number | null> = {};
  for (const c of learner.certificates) {
    if (c.phase && /^day-\d$/.test(c.phase)) serverPassed[c.phase] = null;
  }

  // The next class to take: first day not yet passed (or all done).
  const nextDay = COURSE_DAYS.find((d) => !(d.slug in serverPassed));
  const started = Object.keys(serverPassed).length > 0;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-rose">
        Free • HUD-Approved Homebuyer Education
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-brand-plum sm:text-4xl">
        Welcome, {learner.firstName} — let&apos;s get you to the front door
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Your progress is saved to your profile. Finish all four classes to earn your certificate and
        unlock the down-payment assistance you may qualify for.
      </p>

      {/* Primary next-step CTA */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {nextDay ? (
          <Link
            href={`/learn/${nextDay.slug}`}
            className="rounded-md bg-brand-rose px-6 py-3 text-sm font-semibold text-white hover:bg-brand-plum"
          >
            {started ? `Continue: ${nextDay.title} →` : `Start Day 1: ${nextDay.title} →`}
          </Link>
        ) : (
          <Link
            href="/assistance"
            className="rounded-md bg-brand-rose px-6 py-3 text-sm font-semibold text-white hover:bg-brand-plum"
          >
            🎉 You finished — find your assistance →
          </Link>
        )}
        <Link
          href="/learn/profile"
          className="rounded-md border border-brand-rose px-5 py-3 text-sm font-semibold text-brand-rose hover:bg-brand-blush"
        >
          Your profile &amp; certificate
        </Link>
        <span className="text-sm text-muted-foreground">
          {Object.keys(serverPassed).length} / {COURSE_DAYS.length} classes passed
        </span>
      </div>

      {/* Personalized tips from their profile */}
      {tailoring.tips.length > 0 && (
        <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-gold/5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-plum">
            Tailored to your situation
          </h2>
          <ul className="mt-2 space-y-1.5">
            {tailoring.tips.map((tip) => (
              <li key={tip.id} className="flex gap-2 text-sm text-foreground/90">
                <span aria-hidden>{tip.icon}</span>
                <span>{tip.text.en}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CourseMap serverPassed={serverPassed} />
        </div>

        <div className="space-y-4">
          {/* Assistance teaser from their profile */}
          <div className="rounded-xl border border-border bg-white p-5">
            <h2 className="font-semibold text-brand-plum">Your assistance matches</h2>
            {matches.length > 0 ? (
              <>
                <p className="mt-1 text-sm text-muted-foreground">
                  Based on your profile, you may qualify for{" "}
                  <span className="font-semibold text-brand-rose">{matches.length}</span> Ohio program
                  {matches.length === 1 ? "" : "s"}.
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {matches.slice(0, 3).map((m) => (
                    <li key={m.program.id} className="text-foreground/90">• {m.program.name}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                Add your income, location, and credit below to see the help you may qualify for.
              </p>
            )}
            <Link
              href="/assistance"
              className="mt-3 inline-block text-sm font-medium text-brand-rose hover:underline"
            >
              Explore assistance programs →
            </Link>
          </div>

          <LearnerProfilePanel learner={learner} startOpen={tailoring.needsProfile} />
        </div>
      </div>
    </main>
  );
}
