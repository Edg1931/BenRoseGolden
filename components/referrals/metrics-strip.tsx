import { Card } from "@/components/ui/card";
import { formatRate, type PipelineMetrics } from "@/lib/referrals/metrics";
import { STAGE_LABELS, REFERRAL_STAGES } from "@/lib/referrals/schema";

export function MetricsStrip({ metrics }: { metrics: PipelineMetrics }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      <Stat label="Total Referrals" value={metrics.total} accent />
      <Stat label="Graduates" value={metrics.graduates} />
      <Stat label="Closed" value={metrics.closedCount} />
      <Stat
        label="Graduate → Close"
        value={formatRate(metrics.graduateToCloseRate)}
        highlight
      />
      <Stat
        label="Referral → Close"
        value={formatRate(metrics.referralToCloseRate)}
      />
      <Stat label="Active" value={activeCount(metrics)} />
    </div>
  );
}

function activeCount(m: PipelineMetrics): number {
  const inactive = m.byStage["closed"] + m.byStage["declined"] + m.byStage["on-hold"];
  return m.total - inactive;
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
    <Card
      className={
        highlight
          ? "border-brand-gold/40 bg-brand-gold/5 px-4 py-3"
          : "px-4 py-3"
      }
    >
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div
        className={
          "mt-1 text-2xl font-semibold " +
          (accent ? "text-brand-rose" : highlight ? "text-amber-700" : "")
        }
      >
        {value}
      </div>
    </Card>
  );
}

/** Re-exported for convenience in the board's per-column counts. */
export { STAGE_LABELS, REFERRAL_STAGES };
