import { getCurrentUser } from "@/lib/auth/session";
import { listParticipants } from "@/lib/participants/repository";
import { listCampaigns } from "@/lib/content/store";
import { computeReports, moduleCompletionCsv } from "@/lib/reports/metrics";
import { Card } from "@/components/ui/card";
import { BarList } from "@/components/reports/bar-list";
import { ExportButton } from "@/components/reports/export-button";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const user = await getCurrentUser();
  const participants = await listParticipants(user);
  const report = computeReports(participants, listCampaigns());
  const csv = moduleCompletionCsv(report);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Participation, outcomes, content distribution, and feedback across {report.totalParticipants} clients.
          </p>
        </div>
        <ExportButton csv={csv} filename="module-completion.csv" />
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Mini label="Clients" value={report.totalParticipants} />
        <Mini label="Avg test score" value={report.feedback.avgScore == null ? "—" : `${report.feedback.avgScore}`} />
        <Mini label="Tests scored" value={report.feedback.scored} />
        <Mini label="Campaigns" value={report.campaigns.total} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BarList title="Outcomes funnel" bars={report.funnel} showRate tone="rose" />
        <BarList title="Phase completion" bars={report.phaseCompletion} showRate tone="emerald" />
        <BarList title="Module completion" bars={report.moduleCompletion} showRate />
        <BarList title="How content is consumed (format)" bars={report.formatUsage} tone="gold" />
        <BarList title="Language reach" bars={report.languageReach} tone="rose" />
        <BarList title="Needs / tracks" bars={report.needs} tone="gold" />
      </div>

      <Card className="p-5">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Content distribution</h2>
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">By status</div>
            {Object.entries(report.campaigns.byStatus).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6"><span className="capitalize">{k}</span><span>{v}</span></div>
            ))}
          </div>
          <div>
            <div className="text-xs text-muted-foreground">By type</div>
            {Object.entries(report.campaigns.byType).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6"><span className="capitalize">{k}</span><span>{v}</span></div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </Card>
  );
}
