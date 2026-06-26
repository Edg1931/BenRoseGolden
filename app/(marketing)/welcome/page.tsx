import Link from "next/link";
import { NewsletterSignup } from "@/components/marketing/newsletter-signup";
import { ReviewsSection } from "@/components/marketing/reviews-section";
import seed from "@/data/programs.seed.json";

export const metadata = {
  title: "Benjamin Rose Housing — Free help to buy, keep, and afford your home",
  description:
    "Free HUD-approved homebuyer education, foreclosure prevention, and credit coaching in Ohio — in your language and the format that works for you.",
};

/** Live numbers from the curated Ohio assistance dataset, so the page's proof
 *  points stay current as the dataset grows. */
interface SeedProgram {
  requiresHomebuyerEd?: boolean;
  amountStructured?: { maxDollar?: number | null } | null;
}
const programs = (seed as unknown as { programs: SeedProgram[] }).programs;
const PROGRAM_COUNT = programs.length;
const MAX_ASSISTANCE = programs.reduce((mx, p) => {
  const v = p.amountStructured?.maxDollar;
  return typeof v === "number" && v > mx && v < 300000 ? v : mx;
}, 0);
const ED_REQUIRED = programs.filter((p) => p.requiresHomebuyerEd).length;

const STATS = [
  { value: `${PROGRAM_COUNT}`, label: "Ohio assistance programs we track for you" },
  { value: `$${MAX_ASSISTANCE.toLocaleString()}`, label: "in down-payment help available" },
  { value: `${ED_REQUIRED} of ${PROGRAM_COUNT}`, label: "programs require homebuyer education — our classes are the key" },
  { value: "1908", label: "serving the community ever since" },
];

const STEPS = [
  {
    n: "1",
    icon: "📖",
    title: "Take the free classes",
    body: "Four short, self-paced classes — read or listen, in English, Spanish, or Arabic — with an AI coach to help you prepare.",
  },
  {
    n: "2",
    icon: "🎓",
    title: "Earn your certificate",
    body: "Pass each class quiz to earn your homebuyer education certificate — the document assistance programs ask for.",
  },
  {
    n: "3",
    icon: "🏡",
    title: "Unlock assistance & buy",
    body: `Get matched to the Ohio down-payment programs you qualify for — up to $${MAX_ASSISTANCE.toLocaleString()} — and connect with a trusted agent.`,
  },
];

const BENEFITS = [
  { icon: "🎓", title: "Free homebuyer education", body: "HUD-approved classes that unlock down-payment assistance worth thousands." },
  { icon: "🛟", title: "Foreclosure prevention", body: "One-on-one counseling and a plan to keep you in your home." },
  { icon: "📈", title: "Credit & financial coaching", body: "Practical steps to raise your score and build savings toward a home." },
  { icon: "🤝", title: "A trusted partner", body: "Graduate and get matched with a Golden Group agent ready to help you buy." },
];

const TRACKS = [
  { icon: "🏡", title: "I want to buy my first home", body: "Learn the whole process — budgeting, credit, mortgages, and closing — then get matched with assistance programs and an agent." },
  { icon: "⚠️", title: "I'm worried about losing my home", body: "Talk to a counselor today. We'll review your options with your servicer and build a plan to stay housed." },
  { icon: "💳", title: "I need to fix my credit first", body: "A coach helps you raise your score step by step, until you're ready to qualify for a mortgage and DPA." },
];

const FORMATS = ["In-person classes", "Audiobooks", "Interactive podcast", "AI coach", "PDF guides", "Large print"];
const LANGS = ["English", "Español", "العربية", "Somali", "Nepali", "French", "Swahili", "Chinese"];

export default function WelcomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-plum via-brand-plum to-brand-rose text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-24 pt-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide">
              Free • Nonprofit • HUD-approved
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
              A stable home is within reach — and we&apos;ll help you get there.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/90">
              Benjamin Rose gives Ohioans the education, coaching, and connections to buy a home,
              keep the one they have, and build lasting financial stability — in your language and
              the way you learn best.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/learn"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-plum shadow-sm hover:bg-white/90"
              >
                Start the free classes →
              </Link>
              <Link
                href="/assistance"
                className="rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                See assistance programs
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/15 px-3 py-1">✓ Free classes</span>
              <span className="rounded-full bg-white/15 px-3 py-1">✓ Unlock down-payment help</span>
              <span className="rounded-full bg-white/15 px-3 py-1">✓ One-on-one counseling</span>
            </div>
          </div>
          <div className="lg:pl-8">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Stats band — real numbers from the program dataset */}
      <section className="mx-auto -mt-12 max-w-6xl px-6">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white px-6 py-5 text-center">
              <div className="font-serif text-3xl font-bold text-brand-rose">{s.value}</div>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — the funnel, in 3 steps */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center font-serif text-3xl font-bold text-brand-plum">
          Your path to the front door
        </h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-xl border border-border bg-white p-6 shadow-sm">
              <span className="absolute -top-4 start-6 flex h-8 w-8 items-center justify-center rounded-full bg-brand-rose font-serif font-bold text-white">
                {s.n}
              </span>
              <div className="mt-2 text-3xl">{s.icon}</div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/learn"
            className="inline-block rounded-md bg-brand-rose px-6 py-3 text-sm font-semibold text-white hover:bg-brand-plum"
          >
            Begin Day 1 — it&apos;s free →
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center font-serif text-3xl font-bold text-brand-plum">
            Why thousands of families start with Benjamin Rose
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-xl border border-border bg-brand-cream p-5">
                <div className="text-3xl">{b.icon}</div>
                <h3 className="mt-3 font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center font-serif text-3xl font-bold text-brand-plum">
          Wherever you&apos;re starting, there&apos;s a path
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {TRACKS.map((t) => (
            <div key={t.title} className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <div className="text-3xl">{t.icon}</div>
              <h3 className="mt-3 text-lg font-semibold">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accessibility */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold text-brand-plum">
                Learn the way that works for you
              </h2>
              <p className="mt-3 text-muted-foreground">
                Everyone deserves housing information they can actually use. We deliver every module
                in multiple languages and formats — so you can listen, watch, read, or attend in
                person and pass each step with confidence.
              </p>
              <div className="mt-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Formats</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {FORMATS.map((f) => <span key={f} className="rounded-full bg-brand-gold/10 px-3 py-1 text-sm text-brand-gold">{f}</span>)}
                </div>
              </div>
              <div className="mt-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Languages</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {LANGS.map((l) => <span key={l} className="rounded-full bg-brand-blush px-3 py-1 text-sm text-brand-rose">{l}</span>)}
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-brand-blush to-brand-gold/10 p-8">
              <blockquote className="font-serif text-xl font-medium text-brand-plum">
                &ldquo;I took the class in Spanish, on audio, while I worked. I passed every module
                and bought my first home with help I didn&apos;t know existed.&rdquo;
              </blockquote>
              <p className="mt-3 text-sm text-muted-foreground">— A Benjamin Rose graduate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews — live Google when configured, platform CTAs otherwise */}
      <section className="bg-white">
        <ReviewsSection variant="compact" />
      </section>

      {/* CTA */}
      <section id="assistance" className="bg-brand-plum text-white">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="font-serif text-3xl font-bold">Ready to take the first step?</h2>
          <p className="mt-2 text-white/80">
            {PROGRAM_COUNT} Ohio assistance programs are waiting — and every one starts with the
            education you can begin today. Join our newsletter for class schedules and the
            assistance you may qualify for.
          </p>
          <div className="mx-auto mt-6 max-w-md">
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </main>
  );
}
