"use client";

import { useMemo, useState, useTransition } from "react";
import {
  PROGRAM_TYPES,
  PROGRAM_TYPE_LABELS,
  REFERRAL_SOURCES,
  REFERRAL_STAGES,
  SOURCE_LABELS,
  STAGE_LABELS,
  type ReferralStage,
} from "@/lib/referrals/schema";
import type { RedactedReferral } from "@/lib/referrals/redaction";
import { ReferralCard } from "./referral-card";

interface Filters {
  source: string;
  agent: string;
  program: string;
}

export function ReferralBoard({
  initialReferrals,
  canEditStage,
}: {
  initialReferrals: RedactedReferral[];
  canEditStage: boolean;
}) {
  const [referrals, setReferrals] = useState(initialReferrals);
  const [filters, setFilters] = useState<Filters>({
    source: "",
    agent: "",
    program: "",
  });
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const agents = useMemo(
    () =>
      Array.from(
        new Set(referrals.map((r) => r.assignedAgent).filter(Boolean) as string[]),
      ).sort(),
    [referrals],
  );

  const filtered = useMemo(
    () =>
      referrals.filter(
        (r) =>
          (!filters.source || r.source === filters.source) &&
          (!filters.agent || r.assignedAgent === filters.agent) &&
          (!filters.program || r.programType === filters.program),
      ),
    [referrals, filters],
  );

  async function moveStage(id: string, stage: ReferralStage) {
    const previous = referrals;
    // Optimistic update.
    setReferrals((rs) => rs.map((r) => (r.id === id ? { ...r, stage } : r)));
    setPendingId(id);
    try {
      const res = await fetch(`/api/referrals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      if (!res.ok) throw new Error(await res.text());
    } catch {
      startTransition(() => setReferrals(previous)); // rollback on failure
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <FilterBar
        filters={filters}
        agents={agents}
        onChange={setFilters}
        resultCount={filtered.length}
        total={referrals.length}
      />

      <div className="flex gap-3 overflow-x-auto pb-4">
        {REFERRAL_STAGES.map((stage) => {
          const column = filtered.filter((r) => r.stage === stage);
          return (
            <div key={stage} className="w-72 shrink-0">
              <div className="mb-2 flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold">{STAGE_LABELS[stage]}</h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {column.length}
                </span>
              </div>
              <div className="space-y-2 rounded-lg bg-muted/50 p-2">
                {column.length === 0 ? (
                  <p className="px-1 py-6 text-center text-xs text-muted-foreground">
                    None
                  </p>
                ) : (
                  column.map((r) => (
                    <ReferralCard
                      key={r.id}
                      referral={r}
                      canEditStage={canEditStage}
                      onMove={moveStage}
                      pending={pendingId === r.id}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilterBar({
  filters,
  agents,
  onChange,
  resultCount,
  total,
}: {
  filters: Filters;
  agents: string[];
  onChange: (f: Filters) => void;
  resultCount: number;
  total: number;
}) {
  const selectClass =
    "rounded-md border border-input bg-background px-2 py-1.5 text-sm";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Filter by source"
        className={selectClass}
        value={filters.source}
        onChange={(e) => onChange({ ...filters, source: e.target.value })}
      >
        <option value="">All sources</option>
        {REFERRAL_SOURCES.map((s) => (
          <option key={s} value={s}>
            {SOURCE_LABELS[s]}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by agent"
        className={selectClass}
        value={filters.agent}
        onChange={(e) => onChange({ ...filters, agent: e.target.value })}
      >
        <option value="">All agents</option>
        {agents.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by program"
        className={selectClass}
        value={filters.program}
        onChange={(e) => onChange({ ...filters, program: e.target.value })}
      >
        <option value="">All programs</option>
        {PROGRAM_TYPES.map((p) => (
          <option key={p} value={p}>
            {PROGRAM_TYPE_LABELS[p]}
          </option>
        ))}
      </select>

      {(filters.source || filters.agent || filters.program) && (
        <button
          onClick={() => onChange({ source: "", agent: "", program: "" })}
          className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted"
        >
          Clear
        </button>
      )}

      <span className="ml-auto text-sm text-muted-foreground">
        Showing {resultCount} of {total}
      </span>
    </div>
  );
}
