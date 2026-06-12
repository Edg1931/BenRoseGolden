import Link from "next/link";
import { NewsletterSignup } from "@/components/marketing/newsletter-signup";

export const metadata = {
  title: "Benjamin Rose Housing — Free help to buy, keep, and afford your home",
  description:
    "Free HUD-approved homebuyer education, foreclosure prevention, and credit coaching in Ohio — in your language and the format that works for you.",
};

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

const FORMATS = ["In-person classes", "Audiobooks", "Podcasts", "PDF guides", "Videos", "Interactive slideshows", "Large print"];
const LANGS = ["English", "Spanish", "Somali", "Arabic", "Nepali", "French", "Swahili", "Chinese"];

export default function WelcomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-rose to-amber-600 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide">
              Free • Nonprofit • HUD-approved
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              A stable home is within reach — and we'll help you get there.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/90">
              Benjamin Rose gives Ohioans the education, coaching, and connections to buy a home,
              keep the one they have, and build lasting financial stability — in your language and the
              way you learn best.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/15 px-3 py-1">✓ Free classes</span>
              <span className="rounded-full bg-white/15 px-3 py-1">✓ Unlock down-payment help</span>
              <span className="rounded-full bg-white/15 px-3 py-1">✓ One-on-one counseling</span>
            </div>
            <div className="mt-6">
              <Link
                href="/learn"
                className="inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-rose shadow-sm hover:bg-white/90"
              >
                Start free classes →
              </Link>
            </div>
          </div>
          <div className="lg:pl-8">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold">Why thousands of families start with Benjamin Rose</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-xl border border-border p-5">
              <div className="text-3xl">{b.icon}</div>
              <h3 className="mt-3 font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tracks */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold">Wherever you're starting, there's a path</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {TRACKS.map((t) => (
              <div key={t.title} className="rounded-xl border border-border bg-background p-6">
                <div className="text-3xl">{t.icon}</div>
                <h3 className="mt-3 text-lg font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold">Learn the way that works for you</h2>
            <p className="mt-3 text-muted-foreground">
              Everyone deserves housing information they can actually use. We deliver every module in
              multiple languages and formats — so you can listen, watch, read, or attend in person and
              pass each step with confidence.
            </p>
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Formats</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {FORMATS.map((f) => <span key={f} className="rounded-full bg-brand-gold/10 px-3 py-1 text-sm text-amber-700">{f}</span>)}
              </div>
            </div>
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Languages</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {LANGS.map((l) => <span key={l} className="rounded-full bg-brand-rose/10 px-3 py-1 text-sm text-brand-rose">{l}</span>)}
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-brand-rose/10 to-brand-gold/10 p-8">
            <blockquote className="text-lg font-medium">
              "I took the class in Spanish, on audio, while I worked. I passed every module and bought
              my first home with help I didn't know existed."
            </blockquote>
            <p className="mt-3 text-sm text-muted-foreground">— A Benjamin Rose graduate</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="assistance" className="bg-foreground text-white">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="text-2xl font-bold">Ready to take the first step?</h2>
          <p className="mt-2 text-white/80">Join our newsletter for class schedules, tips, and the assistance you may qualify for.</p>
          <div className="mx-auto mt-6 max-w-md">
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </main>
  );
}
