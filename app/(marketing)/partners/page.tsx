import Link from "next/link";
import { listLenders } from "@/lib/lenders/repository";
import { LANGUAGE_LABELS } from "@/lib/participants/curriculum";
import { ASSISTANCE_KIND_LABELS, LOAN_TYPE_LABELS } from "@/lib/lenders/schema";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trusted Lending Partners — Benjamin Rose Housing",
  description:
    "Our preferred Northeast Ohio lenders — the loan officers and assistance programs we connect homebuyers with, including officers who speak your language.",
};

const TIER_ORDER = { featured: 0, preferred: 1, standard: 2 } as const;

export default async function PartnersPage() {
  const lenders = (await listLenders())
    .filter((l) => l.active)
    .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.institutionName.localeCompare(b.institutionName));

  return (
    <main>
      <section className="bg-gradient-to-br from-brand-plum via-brand-plum to-brand-rose text-white">
        <div className="mx-auto max-w-3xl px-6 pb-16 pt-14 text-center">
          <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">Trusted lending partners</h1>
          <p className="mt-4 text-lg text-white/90">
            When you finish your classes, these Northeast Ohio lenders can help you get to closing —
            with real assistance programs and loan officers who speak your language.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {lenders.map((l) => (
            <div key={l.id} className="flex h-full flex-col rounded-xl border border-border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-serif text-lg font-bold text-brand-plum">{l.institutionName}</h2>
                  {l.contactName && <p className="text-sm text-muted-foreground">{l.contactName}{l.title ? ` · ${l.title}` : ""}</p>}
                </div>
                {l.tier === "featured" && (
                  <span className="rounded-full bg-brand-gold/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700">★ Featured</span>
                )}
              </div>

              {l.marketingBlurb && <p className="mt-2 text-sm text-muted-foreground">{l.marketingBlurb}</p>}

              <div className="mt-3 flex flex-wrap gap-1">
                {l.languages.map((lang) => (
                  <span key={lang} className="rounded-full bg-brand-blush px-2.5 py-0.5 text-xs text-brand-rose">🗣 {LANGUAGE_LABELS[lang]}</span>
                ))}
              </div>

              {l.loanTypes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-muted-foreground">
                  {l.loanTypes.map((lt) => <span key={lt} className="rounded bg-muted px-1.5 py-0.5">{LOAN_TYPE_LABELS[lt]}</span>)}
                </div>
              )}

              {l.programs.length > 0 && (
                <div className="mt-3 border-t border-border pt-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assistance programs</div>
                  <ul className="mt-1 space-y-1">
                    {l.programs.map((p, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-medium text-brand-plum">{p.name}</span>
                        <span className="text-muted-foreground"> — {ASSISTANCE_KIND_LABELS[p.kind]}{p.amount ? `, ${p.amount}` : ""}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                {l.website && <a href={l.website} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-rose hover:underline">Visit website ↗</a>}
                {l.phone && <span className="text-muted-foreground">📞 {l.phone}</span>}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Benjamin Rose is a nonprofit and does not endorse a specific loan. Compare offers, and a
          counselor can help you weigh your options — free.
        </p>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="font-serif text-2xl font-bold text-brand-plum">Not sure where to start?</h2>
          <p className="mt-2 text-muted-foreground">Take the free classes and see the assistance you may qualify for.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/learn" className="rounded-md bg-brand-rose px-6 py-3 text-sm font-semibold text-white hover:bg-brand-plum">Start the free classes →</Link>
            <Link href="/assistance" className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-rose hover:text-brand-rose">See assistance programs</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
