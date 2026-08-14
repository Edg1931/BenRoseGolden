import { getCurrentUser } from "@/lib/auth/session";
import { listParticipants } from "@/lib/participants/repository";
import { listReferrals } from "@/lib/referrals/repository";
import {
  computePartnershipReport,
  formatMoney,
  formatPct,
  sponsorshipCsv,
  type GivebackGroup,
} from "@/lib/partnership/metrics";
import { STAGE_LABELS } from "@/lib/referrals/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "@/components/reports/print-button";
import { ExportButton } from "@/components/reports/export-button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PartnershipPage() {
  const user = await getCurrentUser();
  const [participants, referrals] = await Promise.all([listParticipants(user), listReferrals(user)]);
  const report = computePartnershipReport(participants, referrals);
  const { funnel, money, obstacles } = report;

  const topCount = funnel[0]?.count || 1;
  const deals = referrals
    .filter((r) => r.deal && (r.stage === "closed" || r.stage === "under-contract"))
    .sort((a, b) => (b.deal?.salePrice ?? 0) - (a.deal?.salePrice ?? 0));
  const maxObstacle = Math.max(1, ...obstacles.map((o) => o.count));
  const csv = sponsorshipCsv(referrals);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Partnership Impact</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            The full journey — from a Benjamin Rose class sign-up, through counseling and graduation,
            to a Golden Group agent and closing — with the money generated and the give-back to
            Benjamin Rose. Built for board-level transparency between both partners.
          </p>
        </div>
        <div className="flex gap-2">
          <PrintButton />
          <ExportButton csv={csv} filename="benjamin-rose-giveback-statement.csv" />
        </div>
      </div>

      {/* Headline KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Clients captured" value={funnel[0]?.count ?? 0} sub="signed up" accent />
        <Kpi label="Graduated" value={report.funnel.find((f) => f.key === "graduated")?.count ?? 0} sub={`${formatPct(report.funnel.find((f) => f.key === "graduated")?.fromTop ?? null)} of sign-ups`} />
        <Kpi label="Closed homes" value={money.closes} sub={`${formatPct(report.signUpToClose)} sign-up→close`} />
        <Kpi label="Given back to Benjamin Rose" value={formatMoney(money.brContributionTotal)} sub={`${formatMoney(money.brContributionPaid)} received`} accent />
      </div>

      {/* End-to-end funnel */}
      <Card className="p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">End-to-end funnel</h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-brand-rose" /> Benjamin Rose</span>
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-brand-gold" /> Golden Group</span>
          </div>
        </div>
        <div className="space-y-2">
          {funnel.map((step) => {
            const widthPct = Math.max(4, Math.round((step.count / topCount) * 100));
            const isBR = step.owner === "benjamin-rose";
            return (
              <div key={step.key} className="flex items-center gap-3">
                <div className="w-48 shrink-0 text-sm">{step.label}</div>
                <div className="flex-1">
                  {/* Full-opacity fills: the tinted versions put the count label
                      below the AA contrast threshold. Gold carries dark text. */}
                  <div className={`flex h-8 items-center rounded-md ${isBR ? "bg-brand-rose" : "bg-brand-gold"} px-2`} style={{ width: `${widthPct}%`, minWidth: "3rem" }}>
                    <span className={`text-sm font-semibold ${isBR ? "text-white" : "text-foreground"}`}>{step.count}</span>
                  </div>
                </div>
                <div className="w-28 shrink-0 text-right text-xs text-muted-foreground">
                  {step.fromPrev != null && <span title="conversion from previous step">{formatPct(step.fromPrev)} of prev</span>}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Steps 1–3 are tracked by Benjamin Rose (classes); steps 4–7 by The Golden Group (referral pipeline).
          Each bar is sized against total sign-ups.
        </p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Money generated */}
        <Card className="p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Money generated</h2>
          <dl className="space-y-2 text-sm">
            <MoneyRow label="Closed home sale volume" value={formatMoney(money.totalSaleVolume)} />
            <MoneyRow label="Golden Group commission (GCI)" value={formatMoney(money.totalCommission)} />
            <div className="my-2 border-t border-border" />
            <MoneyRow label="Give-back received by Benjamin Rose" value={formatMoney(money.brContributionPaid)} strong />
            <MoneyRow label="Give-back pledged (not yet remitted)" value={formatMoney(money.brContributionPledged)} muted />
            <MoneyRow label="Total give-back to Benjamin Rose" value={formatMoney(money.brContributionTotal)} strong accent />
            <MoneyRow label="Avg give-back per close" value={formatMoney(money.avgContributionPerClose)} muted />
          </dl>
          {(money.pipelineVolume > 0 || money.pipelineBrContribution > 0) && (
            <div className="mt-3 rounded-md bg-brand-blush/50 p-3 text-sm text-brand-plum">
              <span className="font-semibold">In the pipeline:</span> {formatMoney(money.pipelineVolume)} in homes under contract,
              with {formatMoney(money.pipelineBrContribution)} of give-back expected at closing.
            </div>
          )}
        </Card>

        {/* Obstacles */}
        <Card className="p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Where people fall out (obstacles)</h2>
          {obstacles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No stalls recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {obstacles.map((o) => (
                <div key={o.key} className="flex items-center gap-3">
                  <div className="w-52 shrink-0 text-sm">{o.label}</div>
                  <div className="flex-1">
                    <div className="h-6 rounded bg-brand-plum/70" style={{ width: `${Math.round((o.count / maxObstacle) * 100)}%`, minWidth: "1.5rem" }} />
                  </div>
                  <div className="w-8 text-right text-sm font-medium">{o.count}</div>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">Shows both class-side drop-off and why referrals stall — so you can target the biggest barriers.</p>
        </Card>
      </div>

      {/* Give-back ledger */}
      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Give-back ledger</h2>
        {deals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No deals with financials recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4">Client</th>
                  <th className="py-2 pr-4">Stage</th>
                  <th className="py-2 pr-4 text-right">Sale price</th>
                  <th className="py-2 pr-4 text-right">Commission</th>
                  <th className="py-2 pr-4 text-right">To Benjamin Rose</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((r) => (
                  <tr key={r.id} className="border-b border-border/60">
                    <td className="py-2 pr-4 font-medium">{r.firstName} {r.lastInitial}.</td>
                    <td className="py-2 pr-4"><Badge variant={r.stage === "closed" ? "success" : "gold"}>{STAGE_LABELS[r.stage]}</Badge></td>
                    <td className="py-2 pr-4 text-right">{r.deal?.salePrice != null ? formatMoney(r.deal.salePrice) : "—"}</td>
                    <td className="py-2 pr-4 text-right">{r.deal?.commissionAmount != null ? formatMoney(r.deal.commissionAmount) : "—"}</td>
                    <td className="py-2 pr-4 text-right font-semibold text-brand-rose">{r.deal?.benjaminRoseContribution != null ? formatMoney(r.deal.benjaminRoseContribution) : "—"}</td>
                    <td className="py-2 pr-4">{r.deal?.contributionPaid ? <Badge variant="success">Paid</Badge> : <Badge variant="warning">Pledged</Badge>}</td>
                    <td className="py-2 text-xs text-muted-foreground">{r.deal?.closedDate ? formatDate(r.deal.closedDate) : r.deal?.expectedCloseDate ? `est. ${formatDate(r.deal.expectedCloseDate)}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Give-back rolled up for sponsorship statements */}
      <div className="grid gap-6 lg:grid-cols-2">
        <GivebackTable title="Give-back by agent" firstCol="Agent" groups={report.byAgent} showCommission />
        <GivebackTable title="Give-back by quarter" firstCol="Quarter" groups={report.byQuarter} />
      </div>
    </div>
  );
}

function GivebackTable({ title, firstCol, groups, showCommission }: { title: string; firstCol: string; groups: GivebackGroup[]; showCommission?: boolean }) {
  const totalBr = groups.reduce((s, g) => s + g.brContribution, 0);
  return (
    <Card className="p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">No closed deals yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3">{firstCol}</th>
                <th className="py-2 pr-3 text-right">Closes</th>
                <th className="py-2 pr-3 text-right">Volume</th>
                {showCommission && <th className="py-2 pr-3 text-right">Commission</th>}
                <th className="py-2 text-right">To Benjamin Rose</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.key} className="border-b border-border/60">
                  <td className="py-2 pr-3 font-medium">{g.label}</td>
                  <td className="py-2 pr-3 text-right">{g.closes}</td>
                  <td className="py-2 pr-3 text-right">{formatMoney(g.volume)}</td>
                  {showCommission && <td className="py-2 pr-3 text-right">{formatMoney(g.commission)}</td>}
                  <td className="py-2 text-right font-semibold text-brand-rose">
                    {formatMoney(g.brContribution)}
                    {g.brPaid < g.brContribution && <span className="ml-1 text-xs font-normal text-muted-foreground">({formatMoney(g.brPaid)} paid)</span>}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border font-semibold">
                <td className="py-2 pr-3">Total</td>
                <td className="py-2 pr-3 text-right">{groups.reduce((s, g) => s + g.closes, 0)}</td>
                <td className="py-2 pr-3 text-right">{formatMoney(groups.reduce((s, g) => s + g.volume, 0))}</td>
                {showCommission && <td className="py-2 pr-3 text-right">{formatMoney(groups.reduce((s, g) => s + g.commission, 0))}</td>}
                <td className="py-2 text-right text-brand-rose">{formatMoney(totalBr)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </Card>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: number | string; sub?: string; accent?: boolean }) {
  return (
    <Card className="px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={"mt-1 text-2xl font-semibold " + (accent ? "text-brand-rose" : "")}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </Card>
  );
}

function MoneyRow({ label, value, strong, muted, accent }: { label: string; value: string; strong?: boolean; muted?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={muted ? "text-muted-foreground" : ""}>{label}</dt>
      <dd className={(strong ? "font-semibold " : "") + (accent ? "text-brand-rose" : muted ? "text-muted-foreground" : "")}>{value}</dd>
    </div>
  );
}
