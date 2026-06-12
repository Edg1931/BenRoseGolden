"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { ProgressBar } from "@/components/ui/progress";
import {
  LANGUAGE_LABELS,
  MODULES,
  TRACK_LABELS,
} from "@/lib/participants/curriculum";
import {
  PARTICIPANT_STAGES,
  STAGE_LABELS,
  type Participant,
  type ParticipantStage,
} from "@/lib/participants/schema";

const DAY = 1000 * 60 * 60 * 24;

function daysInStage(p: Participant): number {
  const since = p.stageSince ?? p.dateAdded;
  const t = new Date(since).getTime();
  if (Number.isNaN(t)) return 0;
  return Math.max(0, Math.floor((Date.now() - t) / DAY));
}

function durationLabel(days: number): string {
  if (days < 1) return "today";
  if (days === 1) return "1 day";
  if (days < 30) return `${days} days`;
  const months = Math.round(days / 30);
  return months === 1 ? "1 mo" : `${months} mos`;
}

function progressPercent(p: Participant): number {
  const completed = p.moduleProgress.filter((m) => m.status === "completed").length;
  return Math.round((completed / MODULES.length) * 100);
}

function fullName(p: Participant): string {
  return [p.firstName, p.lastName].filter(Boolean).join(" ");
}

export function ParticipantBoard({ participants }: { participants: Participant[] }) {
  const [items, setItems] = useState(participants);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function move(id: string, stage: ParticipantStage) {
    const prev = items;
    setItems((list) =>
      list.map((p) =>
        p.id === id ? { ...p, stage, stageSince: new Date().toISOString() } : p,
      ),
    );
    setPendingId(id);
    try {
      const res = await fetch(`/api/participants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      if (!res.ok) throw new Error(await res.text());
    } catch {
      startTransition(() => setItems(prev)); // rollback
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {PARTICIPANT_STAGES.map((stage) => {
        const column = items.filter((p) => p.stage === stage);
        const avg =
          column.length === 0
            ? 0
            : Math.round(column.reduce((s, p) => s + daysInStage(p), 0) / column.length);
        return (
          <div key={stage} className="w-72 shrink-0">
            <div className="mb-2 flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold">{STAGE_LABELS[stage]}</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {column.length}
              </span>
            </div>
            {column.length > 0 && (
              <div className="mb-2 px-1 text-xs text-muted-foreground">
                avg {durationLabel(avg)} in stage
              </div>
            )}
            <div className="space-y-2 rounded-lg bg-muted/50 p-2">
              {column.length === 0 ? (
                <p className="px-1 py-6 text-center text-xs text-muted-foreground">None</p>
              ) : (
                column.map((p) => {
                  const days = daysInStage(p);
                  const stale = days >= 60;
                  return (
                    <div key={p.id} className="space-y-2 rounded-lg border border-border bg-background p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Avatar name={fullName(p)} size="sm" />
                        <Link href={`/contacts/${p.id}`} className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium hover:underline">{fullName(p)}</span>
                          <span className="block text-xs text-muted-foreground">
                            {LANGUAGE_LABELS[p.preferredLanguage]} · {p.address?.city ?? "—"}
                          </span>
                        </Link>
                      </div>

                      <div className="flex items-center gap-2">
                        <ProgressBar value={progressPercent(p)} className="flex-1" />
                        <span className="text-xs text-muted-foreground">{progressPercent(p)}%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={"text-xs " + (stale ? "font-medium text-amber-700" : "text-muted-foreground")}>
                          {stale ? "⏳ " : ""}{durationLabel(days)} here
                        </span>
                        {p.tracks[0] && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            {TRACK_LABELS[p.tracks[0]]}
                          </span>
                        )}
                      </div>

                      <select
                        aria-label={`Move ${fullName(p)} to another stage`}
                        disabled={pendingId === p.id}
                        value={p.stage}
                        onChange={(e) => move(p.id, e.target.value as ParticipantStage)}
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs disabled:opacity-50"
                      >
                        {PARTICIPANT_STAGES.map((s) => (
                          <option key={s} value={s}>Move to: {STAGE_LABELS[s]}</option>
                        ))}
                      </select>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
