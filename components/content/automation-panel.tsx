"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SegmentRunResult } from "@/lib/content/automation";

export interface SegmentOption {
  track: string;
  label: string;
  emoji: string;
}

type Row = { label: string; state: "pending" | "running" | "done"; text?: string };

/**
 * Staff trigger for the monthly segment issues. Generates ONE segment per
 * request, sequentially, with live progress — a single request that generates
 * everything can outlive serverless time limits and die as "Failed to fetch",
 * so the browser drives the loop instead. Idempotent server-side: finished
 * segments are kept, and pressing again only retries what's missing.
 */
export function AutomationRunButton({ segments }: { segments: SegmentOption[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);

  function describe(r: SegmentRunResult): string {
    switch (r.status) {
      case "sent":
        return `✅ sent to ${r.sent}`;
      case "created":
        return `📝 ready for review${r.reach != null ? ` (reaches ${r.reach})` : ""}`;
      case "skipped-existing":
        return "⏭ already exists for this month";
      default:
        return `⚠️ ${r.note ?? "failed"}`;
    }
  }

  async function run() {
    setBusy(true);
    setErr(null);
    setRows(segments.map((s) => ({ label: `${s.emoji} ${s.label}`, state: "pending" })));

    for (let i = 0; i < segments.length; i++) {
      setRows((prev) => prev.map((r, j) => (j === i ? { ...r, state: "running" } : r)));
      let text: string;
      try {
        const res = await fetch("/api/content/automation/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ track: segments[i].track }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Request failed (${res.status})`);
        }
        const data = await res.json();
        const result: SegmentRunResult | undefined = data.results?.[0];
        text = result ? describe(result) : "⚠️ no result returned";
      } catch (e) {
        // A dropped connection here is the platform cutting a long request off.
        text =
          e instanceof TypeError
            ? "⚠️ took too long — press the button again to retry just this one"
            : `⚠️ ${e instanceof Error ? e.message : "failed"}`;
      }
      setRows((prev) => prev.map((r, j) => (j === i ? { ...r, state: "done", text } : r)));
    }

    setBusy(false);
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <button
        onClick={run}
        disabled={busy}
        className="w-full rounded-md bg-brand-rose px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {busy ? "Generating…" : "▶ Generate this month's issues now"}
      </button>
      {err && <p className="text-xs text-red-700">{err}</p>}
      {rows.length > 0 && (
        <ul className="space-y-1 text-xs text-muted-foreground">
          {rows.map((r) => (
            <li key={r.label}>
              {r.label}:{" "}
              {r.state === "pending" ? "…" : r.state === "running" ? "generating…" : r.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
