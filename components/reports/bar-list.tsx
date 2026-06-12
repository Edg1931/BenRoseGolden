import { Card } from "@/components/ui/card";
import type { Bar } from "@/lib/reports/metrics";

export function BarList({
  title,
  bars,
  showRate,
  tone = "gold",
}: {
  title: string;
  bars: Bar[];
  showRate?: boolean;
  tone?: "gold" | "rose" | "emerald";
}) {
  const max = Math.max(1, ...bars.map((b) => (showRate && b.total ? b.total : b.value)));
  const fill = tone === "rose" ? "bg-brand-rose" : tone === "emerald" ? "bg-emerald-500" : "bg-brand-gold";
  return (
    <Card className="p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <div className="space-y-2">
        {bars.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
        {bars.map((b) => {
          const denom = showRate && b.total ? b.total : max;
          const pct = Math.round((b.value / denom) * 100);
          const ratePct = b.total ? Math.round((b.value / b.total) * 100) : null;
          return (
            <div key={b.key} className="flex items-center gap-3 text-sm">
              <span className="w-44 truncate" title={b.label}>{b.label}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${fill}`} style={{ width: `${pct}%` }} />
              </div>
              <span className="w-16 text-right text-muted-foreground">
                {b.value}{ratePct != null && showRate ? ` · ${ratePct}%` : ""}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
