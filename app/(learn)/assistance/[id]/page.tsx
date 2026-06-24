import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { loadAllPrograms } from "@/lib/programs/sources";
import { ASSISTANCE_TYPE_LABELS, type Program } from "@/lib/programs/schema";
import { isStale, STALE_AFTER_DAYS } from "@/lib/programs/freshness";
import { formatDate } from "@/lib/utils";
import seed from "@/data/programs.seed.json";

export const dynamic = "force-dynamic";

const datasetUpdated = (seed as { meta?: { lastUpdated?: string } }).meta?.lastUpdated;

async function findProgram(id: string): Promise<Program | undefined> {
  const programs = await loadAllPrograms();
  return programs.find((p) => p.id === id);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = await findProgram(id);
  return {
    title: program
      ? `${program.name} — Down-Payment Assistance | Benjamin Rose`
      : "Program — Benjamin Rose",
    description: program?.amount,
  };
}

/** Public detail page for a single assistance program: full eligibility, how to
 *  apply, the official source, and how current the listing is. */
export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = await findProgram(id);
  if (!program) notFound();

  const el = program.eligibility as Record<string, unknown>;
  const geo = program.geography;
  const stale = isStale(program);

  const where = geo.statewide
    ? "All of Ohio (statewide)"
    : [...(geo.counties ?? []).map((c) => `${title(c)} County`), ...(geo.cities ?? []).map(title)].join(", ") ||
      "Ohio";

  const eligibilityRows: { label: string; value: string }[] = [];
  const add = (label: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return;
    eligibilityRows.push({ label, value: String(value) });
  };
  add("First-time buyer", fmtFirstTime(el.firstTimeBuyer));
  add("First-time exceptions", el.firstTimeBuyerExceptions);
  add("Income limit", el.incomeLimit);
  add("Minimum credit score", el.creditMin);
  add("Credit notes", el.creditNote);
  add("Purchase-price limit", el.purchasePriceLimit);
  add("Property type", el.propertyType);
  add("Occupation", el.occupation && el.occupation !== "all" ? el.occupation : undefined);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/assistance" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to the finder
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-blush px-2.5 py-0.5 text-xs font-medium text-brand-rose">
          {ASSISTANCE_TYPE_LABELS[program.assistanceType]}
        </span>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
          {program.level}
        </span>
        {program.requiresHomebuyerEd === true && (
          <span className="rounded-full bg-brand-gold/15 px-2.5 py-0.5 text-xs font-semibold text-brand-gold">
            🎓 Education unlocks this
          </span>
        )}
      </div>

      <h1 className="mt-3 font-serif text-3xl font-bold text-brand-plum">{program.name}</h1>
      <p className="mt-1 text-muted-foreground">{program.provider}</p>

      {/* Benefit */}
      <Card className="mt-6 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">The benefit</p>
        <p className="mt-1 text-lg font-semibold">{program.amount}</p>
        <p className="mt-2 text-sm text-muted-foreground">Available in: {where}</p>
        {program.repayment && (
          <p className="mt-2 text-sm"><span className="font-medium">Repayment:</span> {program.repayment}</p>
        )}
      </Card>

      {/* Who qualifies */}
      {eligibilityRows.length > 0 && (
        <Card className="mt-4 p-5">
          <h2 className="font-semibold">Who qualifies</h2>
          <dl className="mt-3 divide-y divide-border">
            {eligibilityRows.map((r) => (
              <div key={r.label} className="grid grid-cols-3 gap-3 py-2 text-sm">
                <dt className="text-muted-foreground">{r.label}</dt>
                <dd className="col-span-2">{r.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}

      {/* How to apply */}
      <Card className="mt-4 p-5">
        <h2 className="font-semibold">How to apply</h2>
        <p className="mt-2 text-sm">{program.howToApply}</p>
        {program.mustUseApprovedLender === true && program.participatingLenders?.length ? (
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Participating lenders
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {program.participatingLenders.map((l) => (
                <span key={l} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{l}</span>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={program.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-brand-rose px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-plum"
          >
            Official program page ↗
          </a>
          {program.requiresHomebuyerEd === true && (
            <Link
              href="/learn"
              className="rounded-md border border-brand-rose px-5 py-2.5 text-sm font-medium text-brand-rose hover:bg-brand-blush"
            >
              Take the free classes to unlock →
            </Link>
          )}
        </div>
      </Card>

      {program.notes && (
        <Card className="mt-4 p-5">
          <h2 className="font-semibold">Good to know</h2>
          <p className="mt-2 text-sm text-muted-foreground">{program.notes}</p>
        </Card>
      )}

      {/* Verification / trust */}
      <Card className={`mt-4 p-5 ${stale ? "border-brand-gold/50 bg-brand-gold/5" : "bg-brand-blush/40"}`}>
        <h2 className="flex items-center gap-2 font-semibold">
          {stale ? "⏳ Due for a fresh check" : "✓ Verified & kept current"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This listing was last verified against its official source on{" "}
          <span className="font-medium text-foreground">{formatDate(program.lastVerified)}</span>
          {stale && <> — that&apos;s over {STALE_AFTER_DAYS} days ago, so confirm the current terms directly</>}.
          Our team reviews the database{datasetUpdated ? ` (last full update ${formatDate(datasetUpdated)})` : ""}, and an
          automated weekly check re-scans official sources and flags anything that may have changed.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Program funding and rules can change during the year. Always confirm details on the official page above —
          or let a Benjamin Rose counselor verify and help you apply, free: <span className="whitespace-nowrap font-medium text-foreground">216-791-8000</span>.
        </p>
      </Card>
    </main>
  );
}

function title(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtFirstTime(v: unknown): string | undefined {
  if (v === true) return "Required";
  if (v === false) return "Not required (repeat buyers OK)";
  return undefined;
}
