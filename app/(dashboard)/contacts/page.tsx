import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { listParticipants } from "@/lib/participants/repository";
import { computeCrmMetrics, formatPct } from "@/lib/participants/metrics";
import { Card } from "@/components/ui/card";
import { ClientsWorkspace } from "@/components/participants/clients-workspace";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const user = await getCurrentUser();
  const participants = await listParticipants(user);
  const metrics = computeCrmMetrics(participants);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground">
            Benjamin Rose program participants — progress, eligibility, and communications.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/contacts/new"
            className="rounded-md bg-brand-rose px-3 py-2 text-sm font-medium text-white"
          >
            + Add client
          </Link>
          <Link
            href="/contacts/import"
            className="rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Mass import
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <Stat label="Total clients" value={metrics.total} accent />
        <Stat label="Graduates" value={metrics.graduates} />
        <Stat label="Grad rate" value={formatPct(metrics.graduationRate)} highlight />
        <Stat label="Referred" value={metrics.referred} />
        <Stat label="At-risk" value={metrics.atRisk} />
        <Stat label="Need credit" value={metrics.needsCredit} />
      </div>

      <ClientsWorkspace participants={participants} />
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  highlight,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-brand-gold/40 bg-brand-gold/5 px-4 py-3" : "px-4 py-3"}>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={"mt-1 text-2xl font-semibold " + (accent ? "text-brand-rose" : highlight ? "text-amber-700" : "")}>
        {value}
      </div>
    </Card>
  );
}
