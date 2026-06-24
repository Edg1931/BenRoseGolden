"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import {
  LANGUAGE_LABELS,
  MODULES,
  TRACK_LABELS,
  type Track,
} from "@/lib/participants/curriculum";
import {
  STAGE_LABELS,
  type Participant,
  type ParticipantStage,
} from "@/lib/participants/schema";

const STAGE_TONE: Record<ParticipantStage, "muted" | "rose" | "gold" | "success" | "warning"> = {
  lead: "muted",
  enrolled: "gold",
  "in-progress": "gold",
  graduated: "success",
  referred: "rose",
  inactive: "muted",
};

function progressPercent(p: Participant): number {
  const completed = p.moduleProgress.filter((m) => m.status === "completed").length;
  return Math.round((completed / MODULES.length) * 100);
}

function fullName(p: Participant): string {
  return [p.firstName, p.lastName].filter(Boolean).join(" ");
}

export function CrmTable({ participants }: { participants: Participant[] }) {
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("");
  const [track, setTrack] = useState("");

  const filtered = useMemo(() => {
    const needle = q.toLowerCase().trim();
    return participants.filter((p) => {
      const matchesQ =
        !needle ||
        fullName(p).toLowerCase().includes(needle) ||
        (p.email ?? "").toLowerCase().includes(needle) ||
        (p.phone ?? "").includes(needle) ||
        (p.address?.city ?? "").toLowerCase().includes(needle) ||
        p.tags.some((t) => t.toLowerCase().includes(needle));
      const matchesStage = !stage || p.stage === stage;
      const matchesTrack = !track || p.tracks.includes(track as Track);
      return matchesQ && matchesStage && matchesTrack;
    });
  }, [participants, q, stage, track]);

  const selectClass = "rounded-md border border-input bg-background px-2 py-2 text-sm";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, phone, city, tag…"
          className="w-full min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm sm:w-auto sm:min-w-[16rem]"
        />
        <select className={selectClass} value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="">All stages</option>
          {Object.entries(STAGE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select className={selectClass} value={track} onChange={(e) => setTrack(e.target.value)}>
          <option value="">All needs</option>
          {Object.entries(TRACK_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">
          {filtered.length} of {participants.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-background">
        <table className="w-full min-w-[44rem] text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Client</th>
              <th className="px-4 py-2 font-medium">Stage</th>
              <th className="px-4 py-2 font-medium">Needs</th>
              <th className="px-4 py-2 font-medium">Language</th>
              <th className="px-4 py-2 font-medium">Location</th>
              <th className="px-4 py-2 font-medium">Progress</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link href={`/contacts/${p.id}`} className="flex items-center gap-3">
                    <Avatar name={fullName(p)} size="sm" />
                    <span>
                      <span className="font-medium text-foreground hover:underline">
                        {fullName(p)}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {p.email ?? p.phone ?? "—"}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STAGE_TONE[p.stage]}>{STAGE_LABELS[p.stage]}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.tracks.length === 0 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      p.tracks.map((t) => (
                        <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-xs">
                          {TRACK_LABELS[t]}
                        </span>
                      ))
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {LANGUAGE_LABELS[p.preferredLanguage]}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.address?.city ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={progressPercent(p)} className="w-24" />
                    <span className="text-xs text-muted-foreground">{progressPercent(p)}%</span>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No clients match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
