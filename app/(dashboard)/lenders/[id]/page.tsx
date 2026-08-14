import Link from "next/link";
import { notFound } from "next/navigation";
import { getLender } from "@/lib/lenders/repository";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { LANGUAGE_LABELS } from "@/lib/participants/curriculum";
import {
  ASSISTANCE_KIND_LABELS, LENDER_TIER_LABELS, LOAN_TYPE_LABELS,
} from "@/lib/lenders/schema";

export const dynamic = "force-dynamic";

const TIER_TONE = { featured: "rose", preferred: "gold", standard: "muted" } as const;

export default async function LenderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const l = await getLender(id);
  if (!l) notFound();

  return (
    <div className="space-y-6">
      <Link href="/lenders" className="text-sm text-muted-foreground hover:underline">← Back to lenders</Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{l.institutionName}</h1>
            <Badge variant={TIER_TONE[l.tier]}>{LENDER_TIER_LABELS[l.tier]}</Badge>
            {l.advertising && <Badge variant="success">💵 Advertising partner</Badge>}
            {!l.active && <Badge variant="muted">Inactive</Badge>}
          </div>
          {l.contactName && <p className="mt-1 text-sm text-muted-foreground">{l.contactName}{l.title ? ` · ${l.title}` : ""}{l.nmls ? ` · NMLS #${l.nmls}` : ""}</p>}
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {l.email && <span>✉️ {l.email}</span>}
            {l.phone && <span>📞 {l.phone}</span>}
            {l.website && <a href={l.website} target="_blank" rel="noopener noreferrer" className="text-brand-rose underline">🔗 Website</a>}
            {l.address?.city && <span>📍 {l.address.city}{l.address.county ? `, ${l.address.county}` : ""}</span>}
          </div>
        </div>
        <Link href={`/lenders/${l.id}/edit`} className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted">✏️ Edit lender</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {l.marketingBlurb && (
            <Card className="bg-brand-blush/40 p-4">
              <p className="text-sm text-brand-plum">{l.marketingBlurb}</p>
            </Card>
          )}

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Assistance & loan programs</h2>
            {l.programs.length === 0 ? (
              <Card className="p-4 text-sm text-muted-foreground">No programs on file yet.</Card>
            ) : (
              <div className="space-y-2">
                {l.programs.map((p, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{ASSISTANCE_KIND_LABELS[p.kind]}{p.amount ? ` · ${p.amount}` : ""}</div>
                      </div>
                      {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-rose underline">Details ↗</a>}
                    </div>
                    {p.description && <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>}
                  </Card>
                ))}
              </div>
            )}
          </section>

          {l.notes && (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Internal notes</h2>
              <Card className="p-4 text-sm text-foreground/90">{l.notes}</Card>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <Card className="space-y-3 p-4">
            <h3 className="text-sm font-semibold">Languages served</h3>
            <div className="flex flex-wrap gap-1">
              {l.languages.map((lang) => (
                <span key={lang} className="rounded-full bg-brand-blush px-2.5 py-0.5 text-xs text-brand-roseink">🗣 {LANGUAGE_LABELS[lang]}</span>
              ))}
            </div>
          </Card>

          <Card className="space-y-2 p-4">
            <h3 className="text-sm font-semibold">Loan types</h3>
            <div className="flex flex-wrap gap-1">
              {l.loanTypes.length === 0 ? <span className="text-sm text-muted-foreground">—</span> : l.loanTypes.map((lt) => (
                <Badge key={lt} variant="muted">{LOAN_TYPE_LABELS[lt]}</Badge>
              ))}
            </div>
          </Card>

          <Card className="space-y-2 p-4">
            <h3 className="text-sm font-semibold">Partnership</h3>
            <Row label="Tier" value={LENDER_TIER_LABELS[l.tier]} />
            <Row label="Advertising" value={l.advertising ? "Yes" : "No"} />
            {l.monthlyRate != null && <Row label="Monthly sponsorship" value={`$${l.monthlyRate.toLocaleString()}`} />}
            {l.partnerSince && <Row label="Partner since" value={formatDate(l.partnerSince)} />}
            <Row label="Receives referrals" value={l.receivesReferrals ? "Yes" : "No"} />
          </Card>

          {l.serviceCounties.length > 0 && (
            <Card className="space-y-2 p-4">
              <h3 className="text-sm font-semibold">Service area</h3>
              <p className="text-sm text-muted-foreground">{l.serviceCounties.join(", ")} {l.serviceCounties.length ? "County" : ""}</p>
            </Card>
          )}

          <p className="text-xs text-muted-foreground">Last updated {formatDate(l.lastUpdated)}</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
