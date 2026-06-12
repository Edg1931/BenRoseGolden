import { MODULES } from "./curriculum";
import type { ContentFormat } from "./curriculum";
import type { Participant, UpdateParticipantInput } from "./schema";

/**
 * Shared curriculum-progress rules so the module checklist (manual check-off)
 * and the in-app quiz engine issue certificates and advance stages the same way.
 * Keeping this in one place avoids the two paths drifting apart.
 */

export const PRE_PURCHASE_MODULE_IDS = MODULES.filter(
  (m) => m.phase === "pre-purchase",
).map((m) => m.id);

export const HUD_PRE_PURCHASE_CERT = "HUD Pre-Purchase Homebuyer Education";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Mark a module complete (optionally recording a quiz score / format) and return
 * the patch to persist. When that finishes the pre-purchase phase, auto-issues
 * the HUD certificate and graduates the participant — mirroring the checklist UI.
 */
export function completeModule(
  p: Participant,
  moduleId: string,
  opts: { score?: number; format?: ContentFormat; date?: string } = {},
): UpdateParticipantInput {
  const date = opts.date ?? today();
  const byId = new Map(p.moduleProgress.map((mp) => [mp.moduleId, mp]));
  const prev = byId.get(moduleId);
  byId.set(moduleId, {
    moduleId,
    status: "completed",
    completedDate: prev?.completedDate ?? date,
    score: opts.score ?? prev?.score,
    format: opts.format ?? prev?.format,
  });
  const moduleProgress = [...byId.values()];
  const patch: UpdateParticipantInput = { moduleProgress };

  const completed = new Set(
    moduleProgress.filter((mp) => mp.status === "completed").map((mp) => mp.moduleId),
  );
  const prePurchaseDone = PRE_PURCHASE_MODULE_IDS.every((id) => completed.has(id));
  const hasCert = p.certificates.some((c) => c.phase === "pre-purchase");
  if (prePurchaseDone && !hasCert) {
    patch.certificates = [
      ...p.certificates,
      { name: HUD_PRE_PURCHASE_CERT, issuedDate: date, phase: "pre-purchase" },
    ];
    if (p.stage === "enrolled" || p.stage === "in-progress" || p.stage === "lead") {
      patch.stage = "graduated";
    }
  }
  return patch;
}

/**
 * Record a failed/partial quiz attempt without completing the module: keep the
 * latest score and nudge the module to in-progress (never downgrade a completed one).
 */
export function recordAttempt(
  p: Participant,
  moduleId: string,
  score: number,
): UpdateParticipantInput {
  const byId = new Map(p.moduleProgress.map((mp) => [mp.moduleId, mp]));
  const prev = byId.get(moduleId);
  byId.set(moduleId, {
    moduleId,
    status: prev?.status === "completed" ? "completed" : "in-progress",
    completedDate: prev?.completedDate,
    score,
    format: prev?.format,
  });
  return { moduleProgress: [...byId.values()] };
}
