"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ASSISTANCE_TYPE_LABELS } from "@/lib/programs/schema";
import type { DiffedCandidate } from "@/lib/programs/refresh/diff";
import type { CandidateProgram } from "@/lib/programs/refresh/schema";

interface Summary {
  total: number;
  new: number;
  changed: number;
  unchanged: number;
  invalidDropped: number;
}

export function RefreshPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diffed, setDiffed] = useState<DiffedCandidate[] | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [meta, setMeta] = useState<{ model: string; generatedAt: string } | null>(null);
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [geographyHint, setGeographyHint] = useState("");
  const [applyMsg, setApplyMsg] = useState<string | null>(null);

  async function runRefresh() {
    setLoading(true);
    setError(null);
    setApplyMsg(null);
    setDiffed(null);
    try {
      const res = await fetch("/api/programs/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geographyHint: geographyHint || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Refresh failed");
      setDiffed(data.diffed);
      setSummary(data.summary);
      setMeta({ model: data.model, generatedAt: data.generatedAt });
      // Pre-select new + changed (not unchanged) for convenience.
      setApproved(
        new Set(
          (data.diffed as DiffedCandidate[])
            .filter((d) => d.status !== "unchanged")
            .map((d) => d.id),
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Refresh failed");
    } finally {
      setLoading(false);
    }
  }

  function toggle(id: string) {
    setApproved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function applyApproved() {
    if (!diffed) return;
    setApplyMsg(null);
    const candidates = diffed
      .filter((d) => approved.has(d.id))
      .map((d) => d.candidate);
    if (candidates.length === 0) {
      setApplyMsg("Select at least one program to apply.");
      return;
    }
    const res = await fetch("/api/programs/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidates }),
    });
    const data = await res.json();
    if (!res.ok) {
      setApplyMsg(data.error ?? "Apply failed");
      return;
    }
    if (data.applied) {
      setApplyMsg(`Saved ${data.count} program(s) to the database.`);
    } else {
      downloadJson(data.programs, "programs-approved.json");
      setApplyMsg(
        `Supabase not configured — downloaded ${data.programs.length} program(s) to commit into data/programs.seed.json.`,
      );
    }
  }

  function downloadApproved() {
    if (!diffed) return;
    const candidates = diffed
      .filter((d) => approved.has(d.id))
      .map((d) => d.candidate);
    downloadJson(candidates, "program-candidates.json");
  }

  return (
    <Card className="space-y-4 border-brand-gold/40 bg-brand-gold/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Keep programs up to date with AI</h2>
          <p className="text-sm text-muted-foreground">
            Claude searches the web, reads each program's official page, and reports back with confidence labels.
            Results are <strong>candidates for your review</strong> — nothing is
            saved until you approve it.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={geographyHint}
            onChange={(e) => setGeographyHint(e.target.value)}
            placeholder="Optional: county/city"
            className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
          />
          <button
            onClick={runRefresh}
            disabled={loading}
            className="rounded-md bg-brand-gold px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-60"
          >
            {loading ? "Searching…" : "Refresh with AI"}
          </button>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">
          Researching live sources — this can take a minute.
        </p>
      )}
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {summary && meta && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="success">{summary.new} new</Badge>
          <Badge variant="warning">{summary.changed} changed</Badge>
          <Badge variant="muted">{summary.unchanged} unchanged</Badge>
          {summary.invalidDropped > 0 && (
            <Badge variant="muted">{summary.invalidDropped} dropped (invalid)</Badge>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            {meta.model} · {new Date(meta.generatedAt).toLocaleString()}
          </span>
        </div>
      )}

      {diffed && diffed.length > 0 && (
        <div className="space-y-2">
          {diffed.map((d) => (
            <CandidateRow
              key={d.id}
              diffed={d}
              checked={approved.has(d.id)}
              onToggle={() => toggle(d.id)}
            />
          ))}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={applyApproved}
              className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-white"
            >
              Approve &amp; apply ({approved.size})
            </button>
            <button
              onClick={downloadApproved}
              className="rounded-md border border-input px-3 py-1.5 text-sm"
            >
              Download selected JSON
            </button>
            {applyMsg && (
              <span className="text-sm text-muted-foreground">{applyMsg}</span>
            )}
          </div>
        </div>
      )}

      {diffed && diffed.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No programs returned. Try narrowing the geography or run again.
        </p>
      )}
    </Card>
  );
}

function CandidateRow({
  diffed,
  checked,
  onToggle,
}: {
  diffed: DiffedCandidate;
  checked: boolean;
  onToggle: () => void;
}) {
  const c: CandidateProgram = diffed.candidate;
  const statusVariant =
    diffed.status === "new" ? "success" : diffed.status === "changed" ? "warning" : "muted";
  return (
    <Card className="p-3">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="mt-1"
          aria-label={`Approve ${c.name}`}
        />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{c.name}</span>
            <Badge variant={statusVariant}>{diffed.status}</Badge>
            <Badge variant="muted">{c.level}</Badge>
            <Badge variant="gold">{ASSISTANCE_TYPE_LABELS[c.assistanceType]}</Badge>
            <Badge variant={c.confidence === "high" ? "success" : "muted"}>
              {c.confidence} confidence
            </Badge>
            {c.requiresHomebuyerEd === true && (
              <Badge variant="rose">🎓 requires education</Badge>
            )}
            {c.requiresHomebuyerEd === "verify" && (
              <Badge variant="muted">🎓 education (verify)</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{c.provider}</p>
          {c.amount && <p className="text-sm">{c.amount}</p>}
          {diffed.status === "changed" && diffed.changedFields.length > 0 && (
            <p className="text-xs text-amber-700">
              Changed vs current: {diffed.changedFields.join(", ")}
            </p>
          )}
          {c.reviewerNote && (
            <p className="text-xs italic text-muted-foreground">{c.reviewerNote}</p>
          )}
          <a
            href={c.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-rose underline"
          >
            Source
          </a>
        </div>
      </div>
    </Card>
  );
}

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
