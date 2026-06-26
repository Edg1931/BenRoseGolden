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

/** Stages where a client is active and silence means they may be slipping away. */
const ACTIVE_STAGES: ParticipantStage[] = ["lead", "enrolled", "in-progress"];
const FOLLOW_UP_DAYS = 30;

/** Most recent communication date (ISO), or null if never contacted. */
function lastContactISO(p: Participant): string | null {
  if (!p.communications.length) return null;
  return p.communications.reduce((max, c) => (c.date > max ? c.date : max), p.communications[0].date);
}

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

/** Active client we haven't talked to in a while (or ever) — surface for follow-up. */
function needsFollowUp(p: Participant): boolean {
  if (!ACTIVE_STAGES.includes(p.stage)) return false;
  const last = lastContactISO(p);
  return last == null || daysSince(last) > FOLLOW_UP_DAYS;
}

function lastContactLabel(p: Participant): string {
  const last = lastContactISO(p);
  if (last == null) return "No contact yet";
  const d = daysSince(last);
  if (d <= 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.round(d / 30)}mo ago`;
  return `${Math.round(d / 365)}y ago`;
}

type SortKey = "updated" | "name" | "follow-up";

export function CrmTable({ participants }: { participants: Participant[] }) {
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("");
  const [track, setTrack] = useState("");
  const [sort, setSort] = useState<SortKey>("updated");
  const [onlyFollowUp, setOnlyFollowUp] = useState(false);

  const followUpCount = useMemo(
    () => participants.filter(needsFollowUp).length,
    [participants],
  );

  const filtered = useMemo(() => {
    const needle = q.toLowerCase().trim();
    const rows = participants.filter((p) => {
      const matchesQ =
        !needle ||
        fullName(p).toLowerCase().includes(needle) ||
        (p.email ?? "").toLowerCase().includes(needle) ||
        (p.phone ?? "").includes(needle) ||
        (p.address?.city ?? "").toLowerCase().includes(needle) ||
        p.tags.some((t) => t.toLowerCase().includes(needle));
      const matchesStage = !stage || p.stage === stage;
      const matchesTrack = !track || p.tracks.includes(track as Track);
      const matchesFollowUp = !onlyFollowUp || needsFollowUp(p);
      return matchesQ && matchesStage && matchesTrack && matchesFollowUp;
    });

    const staleness = (p: Participant) => {
      const last = lastContactISO(p);
      return last == null ? Infinity : daysSince(last); // never-contacted first
    };
    return [...rows].sort((a, b) => {
      if (sort === "name") return fullName(a).localeCompare(fullName(b));
      if (sort === "follow-up") {
        // Active clients needing follow-up first, stalest at the top.
        const fa = needsFollowUp(a) ? 1 : 0;
        const fb = needsFollowUp(b) ? 1 : 0;
        if (fa !== fb) return fb - fa;
        return staleness(b) - staleness(a);
      }
      return b.lastUpdated.localeCompare(a.lastUpdated); // "updated" (default)
    });
  }, [participants, q, stage, track, sort, onlyFollowUp]);

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
        <select className={selectClass} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          <option value="updated">Sort: Recently updated</option>
          <option value="follow-up">Sort: Needs follow-up</option>
          <option value="name">Sort: Name (A–Z)</option>
        </select>
        {followUpCount > 0 && (
          <button
            onClick={() => setOnlyFollowUp((v) => !v)}
            className={`rounded-md px-3 py-2 text-sm font-medium ring-1 ${
              onlyFollowUp
                ? "bg-brand-gold/15 text-amber-700 ring-brand-gold/40"
                : "text-muted-foreground ring-border hover:bg-muted"
            }`}
            title={`${followUpCount} active client(s) not contacted in ${FOLLOW_UP_DAYS}+ days`}
          >
            ⏰ Needs follow-up · {followUpCount}
          </button>
        )}
        <span className="text-sm text-muted-foreground">
          {filtered.length} of {participants.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-background">
        <table className="w-full min-w-[52rem] text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Client</th>
              <th className="px-4 py-2 font-medium">Stage</th>
              <th className="px-4 py-2 font-medium">Needs</th>
              <th className="px-4 py-2 font-medium">Language</th>
              <th className="px-4 py-2 font-medium">Location</th>
              <th className="px-4 py-2 font-medium">Last contact</th>
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
                  <span className="text-muted-foreground">{lastContactLabel(p)}</span>
                  {needsFollowUp(p) && (
                    <span className="ml-2 whitespace-nowrap rounded-full bg-brand-gold/15 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">
                      follow up
                    </span>
                  )}
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
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
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
