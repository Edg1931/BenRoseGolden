"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { MODULES, PHASES } from "@/lib/participants/curriculum";
import { hasQuiz } from "@/lib/participants/quiz";
import { HUD_PRE_PURCHASE_CERT, PRE_PURCHASE_MODULE_IDS } from "@/lib/participants/progress";
import type {
  Certificate,
  ModuleProgress,
  ModuleStatus,
  Participant,
} from "@/lib/participants/schema";

/** Editable curriculum checklist. Marking modules complete auto-issues the HUD
 *  pre-purchase certificate once that phase is finished. */
export function ModuleChecklist({ participant: p }: { participant: Participant }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [progress, setProgress] = useState<Record<string, ModuleStatus>>(() => {
    const map: Record<string, ModuleStatus> = {};
    for (const m of MODULES) map[m.id] = "not-started";
    for (const mp of p.moduleProgress) map[mp.moduleId] = mp.status;
    return map;
  });

  function cycle(id: string) {
    setProgress((prev) => {
      const order: ModuleStatus[] = ["not-started", "in-progress", "completed"];
      const next = order[(order.indexOf(prev[id]) + 1) % order.length];
      return { ...prev, [id]: next };
    });
    setDirty(true);
  }

  async function save() {
    setBusy(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const existing = new Map(p.moduleProgress.map((mp) => [mp.moduleId, mp]));
      const moduleProgress: ModuleProgress[] = MODULES.filter(
        (m) => progress[m.id] !== "not-started",
      ).map((m) => {
        const prev = existing.get(m.id);
        const status = progress[m.id];
        return {
          moduleId: m.id,
          status,
          completedDate: status === "completed" ? prev?.completedDate ?? today : undefined,
          score: prev?.score,
          format: prev?.format,
        };
      });

      // Auto-issue the HUD certificate when pre-purchase is fully complete.
      const prePurchaseDone = PRE_PURCHASE_MODULE_IDS.every((id) => progress[id] === "completed");
      const hasCert = p.certificates.some((c) => c.phase === "pre-purchase");
      const certificates: Certificate[] = [...p.certificates];
      const patch: Record<string, unknown> = { moduleProgress };
      if (prePurchaseDone && !hasCert) {
        certificates.push({
          name: HUD_PRE_PURCHASE_CERT,
          issuedDate: today,
          phase: "pre-purchase",
        });
        patch.certificates = certificates;
        if (p.stage === "enrolled" || p.stage === "in-progress" || p.stage === "lead") {
          patch.stage = "graduated";
        }
      }

      const res = await fetch(`/api/participants/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Save failed");
      setDirty(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Program progress
        </h2>
        {dirty && (
          <button onClick={save} disabled={busy} className="rounded-md bg-brand-gold px-3 py-1 text-xs font-medium text-foreground disabled:opacity-60">
            {busy ? "Saving…" : "Save progress"}
          </button>
        )}
      </div>
      <div className="space-y-3">
        {PHASES.map((phase) => {
          const mods = MODULES.filter((m) => m.phase === phase.id);
          const completed = mods.filter((m) => progress[m.id] === "completed").length;
          const pct = Math.round((completed / mods.length) * 100);
          return (
            <Card key={phase.id} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-medium">{phase.name}</div>
                <span className="text-xs text-muted-foreground">{completed}/{mods.length} modules</span>
              </div>
              <ProgressBar value={pct} tone={pct === 100 ? "emerald" : "gold"} />
              <ul className="mt-3 space-y-1">
                {mods.map((m) => {
                  const st = progress[m.id];
                  const mp = p.moduleProgress.find((x) => x.moduleId === m.id);
                  return (
                    <li key={m.id} className="flex items-center gap-2">
                      <button onClick={() => cycle(m.id)} className="flex flex-1 items-center gap-2 rounded px-1 py-0.5 text-left text-sm hover:bg-muted/40">
                        <span>{st === "completed" ? "✅" : st === "in-progress" ? "🟡" : "⬜"}</span>
                        <span className={st === "completed" ? "" : "text-muted-foreground"}>{m.name}</span>
                        {mp?.score != null && <span className="text-xs text-muted-foreground">· {mp.score}%</span>}
                        <span className="ml-auto text-xs text-muted-foreground">{st === "not-started" ? "click to start" : st}</span>
                      </button>
                      {hasQuiz(m.id) && (
                        <Link
                          href={`/contacts/${p.id}/module/${m.id}/quiz`}
                          className="shrink-0 rounded border border-input px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted"
                        >
                          📝 Test
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Tip: click a module to cycle not-started → in-progress → completed.</p>
    </section>
  );
}
