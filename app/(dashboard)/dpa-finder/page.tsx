import { loadAllPrograms } from "@/lib/programs/sources";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ASSISTANCE_TYPE_LABELS } from "@/lib/programs/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { isGoldenSide } from "@/lib/auth/roles";
import { RefreshPanel } from "@/components/programs/refresh-panel";
import { datasetFreshness, isStale, STALE_AFTER_DAYS } from "@/lib/programs/freshness";
import { latestPendingRun } from "@/lib/programs/refresh/store";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Staff view of the Module 2 program database: dataset freshness, the weekly
 * scheduled-refresh review queue, the manual AI-refresh panel, and the program
 * cards (the public buyer-facing finder lives at /assistance).
 */
export default async function DpaFinderPage() {
  const [programs, user] = await Promise.all([loadAllPrograms(), getCurrentUser()]);
  const canManage = isGoldenSide(user);
  const freshness = datasetFreshness(programs);
  const pendingRun = canManage ? await latestPendingRun() : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Down Payment Assistance &amp; Grant Finder
        </h1>
        <p className="text-sm text-muted-foreground">
          {programs.length} Ohio programs · most recent verification{" "}
          {freshness.newestVerified ? formatDate(freshness.newestVerified) : "—"}
          {freshness.staleCount > 0 && (
            <> · <span className="font-medium text-brand-gold">{freshness.staleCount} due for re-check</span> (over {STALE_AFTER_DAYS} days)</>
          )}
          . The public finder is at <code>/assistance</code>.
        </p>
      </div>

      {canManage && pendingRun && (
        <Card className="flex flex-wrap items-center justify-between gap-3 border-brand-rose/30 bg-brand-blush/50 p-4">
          <div className="text-sm">
            <span className="font-semibold">🔄 Scheduled AI refresh ran {formatDate(pendingRun.created_at)}.</span>{" "}
            {pendingRun.summary.new} new · {pendingRun.summary.changed} changed program(s) are
            waiting for your review.
          </div>
          <span className="text-xs text-muted-foreground">Run “Refresh with AI” below to review &amp; approve.</span>
        </Card>
      )}

      {canManage && <RefreshPanel />}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((p) => (
          <Card key={p.id} className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium leading-tight">{p.name}</h3>
              <Badge variant="muted">{p.level}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{p.provider}</p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="gold">
                {ASSISTANCE_TYPE_LABELS[p.assistanceType]}
              </Badge>
              {p.requiresHomebuyerEd === true && (
                <Badge variant="success">🎓 Education unlocks</Badge>
              )}
              {p.requiresHomebuyerEd === "verify" && (
                <Badge variant="muted">🎓 Education (verify)</Badge>
              )}
              {isStale(p) && <Badge variant="warning">⏳ Re-verify</Badge>}
            </div>
            <p className="text-sm">{p.amount}</p>
            <p className="text-xs text-muted-foreground">
              {p.geography.statewide
                ? "Statewide"
                : [...(p.geography.counties ?? []), ...(p.geography.cities ?? [])].join(
                    ", ",
                  )}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
