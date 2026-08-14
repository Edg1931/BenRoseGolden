import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { DemoLauncher } from "@/components/learn/demo-launcher";
import { DEMO_LEARNER_IDS } from "@/lib/learn/demo";

export const metadata = {
  title: "Walkthrough — Benjamin Rose Housing",
  description:
    "See the platform from both sides: the client taking classes, and the staff supporting them.",
};

/**
 * Presenter's walkthrough: two doors into the same system, so an audience can
 * see the client experience and the staff experience back to back — using the
 * SAME sample people, which is what makes the connection land.
 */
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/welcome">
            <Logo suffix="Housing" />
          </Link>
          <span className="text-sm text-muted-foreground">Walkthrough</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-rose">
          Two sides of the same record
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-brand-plum sm:text-4xl">
          See it as a client, then as the staff
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          When someone signs up for classes, a profile is created for them. Everything they do —
          every class passed, their certificate, the assistance they qualify for — lands on that one
          record. The client sees their side of it; their counselor sees the same record from the
          office. These doors open the same two sample people from both directions.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Client side */}
          <section className="rounded-xl border border-border bg-white p-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>👩🏽</span>
              <h2 className="font-serif text-xl font-semibold text-brand-plum">
                As someone taking classes
              </h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              No typing needed — step straight into a sample client&apos;s account.
            </p>

            <div className="mt-4 space-y-3">
              <DemoLauncher
                persona="in-progress"
                destination="/learn/profile"
                label="Jordan — partway through"
                sublabel="2 of 4 classes passed. Shows progress, saved scores, and what finishing unlocks."
                primary
              />
              <DemoLauncher
                persona="graduate"
                destination="/learn/certificate"
                label="Alicia — finished the course"
                sublabel="Opens the printable Certificate of Completion."
              />
              <Link
                href="/learn/start"
                className="block rounded-lg border border-input px-4 py-3 hover:bg-muted"
              >
                <span className="block text-sm font-semibold">Sign up from scratch</span>
                <span className="block text-xs text-muted-foreground">
                  The real form a new client fills in — creates a live profile.
                </span>
              </Link>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Point out: progress is saved to their profile, not the browser — so they can start on a
              library computer and finish on their phone.
            </p>
          </section>

          {/* Staff side */}
          <section className="rounded-xl border border-border bg-white p-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>🗂️</span>
              <h2 className="font-serif text-xl font-semibold text-brand-plum">
                As the staff supporting them
              </h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              The counselor&apos;s view of those same two people.
            </p>

            <div className="mt-4 space-y-3">
              <DemoLink
                href={`/contacts/${DEMO_LEARNER_IDS["in-progress"]}`}
                label="Jordan's client record"
                sublabel="The same progress the client sees — plus recommendations and next actions."
              />
              <DemoLink
                href={`/contacts/${DEMO_LEARNER_IDS.graduate}`}
                label="Alicia's client record"
                sublabel="Graduated, certificate on file, ready for a referral with consent."
              />
              <DemoLink
                href="/contacts"
                label="The whole client list"
                sublabel="Everyone in the program, with graduation and at-risk counts."
              />
              <DemoLink
                href="/contacts/new"
                label="Add a client by hand"
                sublabel="Intake with live assistance matching as you type."
              />
              <DemoLink
                href="/classes"
                label="Preview any class as a learner"
                sublabel="Staff can see exactly what clients see, without an account."
              />
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Staff pages need a staff sign-in. If a link asks you to log in, do that first, then come
              back here.
            </p>
          </section>
        </div>

        <section className="mt-10 rounded-xl border border-brand-gold/40 bg-brand-gold/5 p-6">
          <h2 className="font-semibold text-brand-plum">Suggested order for a live demo</h2>
          <ol className="mt-3 space-y-2 text-sm text-foreground/90">
            <li>
              <strong>1.</strong> Open <em>Jordan — partway through</em>. Show the profile: classes
              passed, scores, and the “programs unlock when you finish” panel — that&apos;s the reason
              people come back.
            </li>
            <li>
              <strong>2.</strong> Click into a class to show the lessons, audio, and the test.
            </li>
            <li>
              <strong>3.</strong> Open <em>Alicia — finished the course</em> to show the certificate
              that assistance programs ask for.
            </li>
            <li>
              <strong>4.</strong> Switch sides: open <em>Alicia&apos;s client record</em> and point out
              it&apos;s the same information, from the counselor&apos;s desk.
            </li>
            <li>
              <strong>5.</strong> Finish on <em>Add a client by hand</em> — type a county and income
              and let the assistance matches appear live.
            </li>
          </ol>
        </section>

        <p className="mt-8 text-xs text-muted-foreground">
          Jordan and Alicia are fabricated sample records, tagged “demo” in the client list. They
          hold no real personal information.
        </p>
      </main>
    </div>
  );
}

function DemoLink({
  href,
  label,
  sublabel,
}: {
  href: string;
  label: string;
  sublabel: string;
}) {
  return (
    <Link href={href} className="block rounded-lg border border-input px-4 py-3 hover:bg-muted">
      <span className="block text-sm font-semibold">{label}</span>
      <span className="block text-xs text-muted-foreground">{sublabel}</span>
    </Link>
  );
}
