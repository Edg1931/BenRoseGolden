import Link from "next/link";
import { getNewsletterSources } from "@/lib/content/feed";

export const metadata = {
  title: "Housing Resources — Benjamin Rose Housing",
  description:
    "Trusted homebuying, credit, and down-payment-assistance resources from Benjamin Rose, HUD, OHFA, and the CFPB — in one place.",
};

export default async function ResourcesPage() {
  const items = await getNewsletterSources(9);

  return (
    <main>
      <section className="bg-gradient-to-br from-brand-plum via-brand-plum to-brand-rose text-white">
        <div className="mx-auto max-w-3xl px-6 pb-16 pt-14 text-center">
          <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Housing resources you can trust
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Helpful, up-to-date links from Benjamin Rose and trusted partners — for buying a home,
            building credit, and finding down-payment assistance in Ohio.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-xl border border-border bg-white p-5 shadow-sm transition hover:border-brand-rose hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-brand-blush px-2.5 py-0.5 text-xs font-medium text-brand-roseink">
                  {r.source}
                </span>
                {r.date && <span className="text-xs text-muted-foreground">{r.date}</span>}
              </div>
              <h2 className="mt-3 font-semibold text-brand-plum group-hover:text-brand-rose">
                {r.title}
              </h2>
              {r.excerpt && <p className="mt-1 flex-1 text-sm text-muted-foreground">{r.excerpt}</p>}
              <span className="mt-3 text-sm font-medium text-brand-rose">Open ↗</span>
            </a>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Links open on partner sites. Benjamin Rose counselors can help you use any of these — free.
        </p>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="font-serif text-2xl font-bold text-brand-plum">
            Ready to put these to work?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Take the free classes and find the assistance you may qualify for.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/learn"
              className="rounded-md bg-brand-rose px-6 py-3 text-sm font-semibold text-white hover:bg-brand-plum"
            >
              Start the free classes →
            </Link>
            <Link
              href="/assistance"
              className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-rose hover:text-brand-rose"
            >
              See assistance programs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
