"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  PROGRAM_TYPE_LABELS,
  REFERRAL_STAGES,
  SOURCE_LABELS,
  STAGE_LABELS,
  type ReferralStage,
} from "@/lib/referrals/schema";
import type { RedactedReferral } from "@/lib/referrals/redaction";

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

      <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
        <span>{referral.assignedAgent ?? "Unassigned"}</span>
        <span>Ref. {formatDate(referral.dateReferred)}</span>
      </div>

      {canEditStage ? (
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
      ) : null}
    </Card>
  );
}
