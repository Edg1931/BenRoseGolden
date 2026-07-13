"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  BLOCKER_REASONS,
  BLOCKER_REASON_LABELS,
  DEFAULT_GIVEBACK_RATE,
  PROGRAM_TYPE_LABELS,
  REFERRAL_STAGES,
  SOURCE_LABELS,
  STAGE_LABELS,
  type BlockerReason,
  type ReferralStage,
} from "@/lib/referrals/schema";
import type { RedactedReferral } from "@/lib/referrals/redaction";

const money = (n?: number) =>
  n == null ? "—" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export function ReferralCard({
  referral,
  canEditStage,
  onMove,
  pending,
}: {
  referral: RedactedReferral;
  canEditStage: boolean;
  onMove: (id: string, stage: ReferralStage) => void;
  pending: boolean;
}) {
  const showDeal = referral.stage === "under-contract" || referral.stage === "closed";
  const stalled = referral.stage === "on-hold" || referral.stage === "declined";

  return (
    <Card className="space-y-2 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="font-medium">
          {referral.firstName} {referral.lastInitial}.
        </div>
        <Badge variant={referral.source === "benjamin-rose" ? "rose" : "gold"}>
          {SOURCE_LABELS[referral.source]}
        </Badge>
      </div>

      <div className="text-xs text-muted-foreground">
        {PROGRAM_TYPE_LABELS[referral.programType]}
      </div>

      <div className="flex flex-wrap gap-1">
        {referral.certificateCompleted && (
          <Badge variant="success">🎓 Certificate</Badge>
        )}
        {!referral.consentToShare && (
          <Badge variant="warning">No consent to share</Badge>
        )}
      </div>

      {/* Contact only present when consent is given (stripped server-side otherwise). */}
      {referral.consentToShare && referral.contact ? (
        <div className="text-xs text-foreground/80">
          {referral.contact.email && <div>{referral.contact.email}</div>}
          {referral.contact.phone && <div>{referral.contact.phone}</div>}
        </div>
      ) : referral.contactWithheld ? (
        <div className="text-xs italic text-muted-foreground">
          Contact hidden until consent recorded
        </div>
      ) : null}

      {/* Deal + give-back summary (visible to both orgs for transparency) */}
      {showDeal && referral.deal && (referral.deal.salePrice != null || referral.deal.benjaminRoseContribution != null) && (
        <div className="rounded-md bg-brand-blush/50 px-2 py-1.5 text-xs text-brand-plum">
          <div className="flex justify-between"><span>Sale price</span><span className="font-medium">{money(referral.deal.salePrice)}</span></div>
          <div className="flex justify-between">
            <span>To Benjamin Rose</span>
            <span className="font-semibold text-brand-rose">
              {money(referral.deal.benjaminRoseContribution)} {referral.deal.benjaminRoseContribution != null && (referral.deal.contributionPaid ? "· paid" : "· pledged")}
            </span>
          </div>
        </div>
      )}

      {stalled && referral.blockerReason && (
        <div className="text-xs text-muted-foreground">⛔ {BLOCKER_REASON_LABELS[referral.blockerReason]}</div>
      )}

      <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
        <span>{referral.assignedAgent ?? "Unassigned"}</span>
        <span>Ref. {formatDate(referral.dateReferred)}</span>
      </div>

      {canEditStage ? (
        <>
          <select
            aria-label="Move stage"
            disabled={pending}
            value={referral.stage}
            onChange={(e) => onMove(referral.id, e.target.value as ReferralStage)}
            className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs disabled:opacity-50"
          >
            {REFERRAL_STAGES.map((s) => (
              <option key={s} value={s}>
                Move to: {STAGE_LABELS[s]}
              </option>
            ))}
          </select>
          {(showDeal || stalled) && <DealEditor referral={referral} showDeal={showDeal} stalled={stalled} />}
        </>
      ) : null}
    </Card>
  );
}

/** Golden-side capture of deal financials, the Benjamin Rose give-back, and a stall reason. */
function DealEditor({ referral, showDeal, stalled }: { referral: RedactedReferral; showDeal: boolean; stalled: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const d = referral.deal;
  const [salePrice, setSalePrice] = useState(d?.salePrice?.toString() ?? "");
  const [commission, setCommission] = useState(d?.commissionAmount?.toString() ?? "");
  const [giveback, setGiveback] = useState(d?.benjaminRoseContribution?.toString() ?? "");
  const [paid, setPaid] = useState(d?.contributionPaid ?? false);
  const [date, setDate] = useState((d?.closedDate ?? d?.expectedCloseDate ?? "").slice(0, 10));
  const [blocker, setBlocker] = useState<BlockerReason | "">(referral.blockerReason ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const isClosed = referral.stage === "closed";

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      const num = (s: string) => (s.trim() === "" ? undefined : Math.max(0, Number(s)));
      const iso = date ? new Date(`${date}T00:00:00.000Z`).toISOString() : undefined;
      const payload: Record<string, unknown> = {};
      if (showDeal) {
        payload.deal = {
          salePrice: num(salePrice),
          commissionAmount: num(commission),
          benjaminRoseContribution: num(giveback),
          contributionPaid: paid,
          ...(isClosed ? { closedDate: iso } : { expectedCloseDate: iso }),
        };
      }
      if (stalled) payload.blockerReason = blocker || undefined;
      const res = await fetch(`/api/referrals/${referral.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      setOpen(false);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="w-full rounded-md border border-dashed border-brand-rose/40 px-2 py-1 text-xs text-brand-rose hover:bg-brand-blush/40">
        {showDeal ? "💵 Edit deal & give-back" : "⛔ Set stall reason"}
      </button>
    );
  }

  const field = "w-full rounded-md border border-input bg-background px-2 py-1 text-xs";
  return (
    <div className="space-y-1.5 rounded-md border border-border p-2">
      {showDeal && (
        <>
          <label className="block"><span className="text-[11px] text-muted-foreground">Sale price</span>
            <input type="number" min={0} className={field} value={salePrice} onChange={(e) => setSalePrice(e.target.value)} /></label>
          <label className="block"><span className="text-[11px] text-muted-foreground">Commission (GCI)</span>
            <input type="number" min={0} className={field} value={commission} onChange={(e) => {
              setCommission(e.target.value);
              if (!giveback && e.target.value) setGiveback(String(Math.round(Number(e.target.value) * DEFAULT_GIVEBACK_RATE)));
            }} /></label>
          <label className="block"><span className="text-[11px] text-muted-foreground">Give-back to Benjamin Rose</span>
            <input type="number" min={0} className={field} value={giveback} onChange={(e) => setGiveback(e.target.value)} /></label>
          <label className="flex items-center gap-1.5 text-[11px]">
            <input type="checkbox" className="accent-brand-rose" checked={paid} onChange={(e) => setPaid(e.target.checked)} /> Give-back remitted to Benjamin Rose
          </label>
          <label className="block"><span className="text-[11px] text-muted-foreground">{isClosed ? "Closed date" : "Expected close"}</span>
            <input type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} /></label>
        </>
      )}
      {stalled && (
        <label className="block"><span className="text-[11px] text-muted-foreground">Stall reason</span>
          <select className={field} value={blocker} onChange={(e) => setBlocker(e.target.value as BlockerReason | "")}>
            <option value="">— select —</option>
            {BLOCKER_REASONS.map((b) => <option key={b} value={b}>{BLOCKER_REASON_LABELS[b]}</option>)}
          </select></label>
      )}
      {err && <p className="text-[11px] text-red-700">{err}</p>}
      <div className="flex gap-1.5">
        <button onClick={save} disabled={busy} className="flex-1 rounded-md bg-brand-rose px-2 py-1 text-xs font-medium text-white disabled:opacity-60">{busy ? "Saving…" : "Save"}</button>
        <button onClick={() => setOpen(false)} className="rounded-md border border-input px-2 py-1 text-xs">Cancel</button>
      </div>
    </div>
  );
}
