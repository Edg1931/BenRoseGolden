import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { listParticipants } from "@/lib/participants/repository";
import { computeCrmMetrics, formatPct } from "@/lib/participants/metrics";
import { recentActivity, relativeDay } from "@/lib/participants/activity";
import { STAGE_LABELS, PARTICIPANT_STAGES } from "@/lib/participants/schema";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const participants = await listParticipants(user);
  const m = computeCrmMetrics(participants);
  const activity = recentActivity(participants, 7);
  const maxLang = Math.max(1, ...m.byLanguage.map((l) => l.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Benjamin Rose housing programs — participation, outcomes, and where to focus.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Total clients" value={m.total} tone="rose" href="/contacts" />
        <Kpi label="Graduate rate" value={formatPct(m.graduationRate)} tone="gold" />
        <Kpi label="Referred to agents" value={m.referred} />
        <Kpi label="Consented to share" value={m.consentedShare} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pipeline funnel */}
        <Card className="space-y-3 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Pipeline
          </h2>
          <div className="space-y-2">
            {PARTICIPANT_STAGES.map((s) => {
              const count = m.byStage[s];
              const pct = m.total ? Math.round((count / m.total) * 100) : 0;
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className="w-28 text-sm">{STAGE_LABELS[s]}</span>
                  <ProgressBar value={pct} className="flex-1" />
                  <span className="w-8 text-right text-sm text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
            <MiniStat label="At-risk (foreclosure)" value={m.atRisk} />
            <MiniStat label="Need credit repair" value={m.needsCredit} />
            <MiniStat label="Graduates" value={m.graduates} />
            <MiniStat label="Referral rate" value={formatPct(m.referralRate)} />
          </div>
        </Card>

        {/* Languages — the accessibility focus */}
        <Card className="space-y-3 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Languages spoken
          </h2>
          {m.byLanguage.map((l) => (
            <div key={l.language} className="flex items-center gap-2 text-sm">
              <span className="w-16">{l.label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-brand-rose" style={{ width: `${(l.count / maxLang) * 100}%` }} />
              </div>
              <span className="w-6 text-right text-muted-foreground">{l.count}</span>
            </div>
          ))}
          <p className="pt-1 text-xs text-muted-foreground">
            Deliver each module in the language and format people prefer to lift completion and test pass rates.
          </p>
        </Card>
      </div>

      {/* Recent activity + quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Recent learner activity
            </h2>
            <Link href="/contacts" className="text-sm text-brand-rose hover:underline">View all clients</Link>
          </div>
          {activity.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No activity yet — sign-ups and class completions will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {activity.map((e) => (
                <li key={e.id}>
                  <Link href={`/contacts/${e.participantId}`} className="flex items-center gap-3 py-2.5 hover:bg-muted/30">
                    <span className="text-lg" aria-hidden>{e.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="text-sm">
                        <span className="font-medium">{e.name}</span> {e.text}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{relativeDay(e.date)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="space-y-2 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick actions</h2>
          <QuickLink href="/contacts/import" label="Mass import clients" emoji="📥" />
          <QuickLink href="/contacts" label="Browse client CRM" emoji="👥" />
          <QuickLink href="/referrals" label="Referral pipeline" emoji="🔗" />
          <QuickLink href="/dpa-finder" label="Assistance finder" emoji="🏠" />
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value, tone, href }: { label: string; value: number | string; tone?: "rose" | "gold"; href?: string }) {
  const body = (
    <Card className={tone === "gold" ? "border-brand-gold/40 bg-brand-gold/5 p-4" : "p-4"}>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={"mt-1 text-3xl font-semibold " + (tone === "rose" ? "text-brand-rose" : tone === "gold" ? "text-amber-700" : "")}>
        {value}
      </div>
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md bg-muted/40 px-3 py-2">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function QuickLink({ href, label, emoji }: { href: string; label: string; emoji: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted/40">
      <span>{emoji}</span>
      <span>{label}</span>
    </Link>
  );
}
