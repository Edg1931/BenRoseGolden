import { getCurrentUser } from "@/lib/auth/session";
import { listReferrals } from "@/lib/referrals/repository";
import { redactReferrals } from "@/lib/referrals/redaction";
import { computeMetrics } from "@/lib/referrals/metrics";
import { isGoldenSide } from "@/lib/auth/roles";
import { MetricsStrip } from "@/components/referrals/metrics-strip";
import { ReferralBoard } from "@/components/referrals/board";

export const dynamic = "force-dynamic";

export default async function ReferralsPage() {
  const user = await getCurrentUser();
  const referrals = await listReferrals(user);

  // Metrics computed from full (unredacted) rows; the board gets redacted data.
  const metrics = computeMetrics(referrals);
  const redacted = redactReferrals(referrals);
  const canEditStage = isGoldenSide(user);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Referral Pipeline
          </h1>
          <p className="text-sm text-muted-foreground">
            Benjamin Rose / ESOP homebuyer-program graduates referred to The
            Golden Group.
            {!canEditStage &&
              " You can view and update intake details for your organization's referrals."}
          </p>
        </div>
      </div>

      <MetricsStrip metrics={metrics} />
      <ReferralBoard initialReferrals={redacted} canEditStage={canEditStage} />
    </div>
  );
}
