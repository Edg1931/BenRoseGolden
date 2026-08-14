"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AutomationRunResult } from "@/lib/content/automation";

/** Staff trigger for the monthly segment issues (same run the cron performs). */
export function AutomationRunButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<AutomationRunResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch("/api/content/automation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Run failed");
      setResult(data);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Run failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={run}
        disabled={busy}
        className="w-full rounded-md bg-brand-rose px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {busy ? "Generating this month's issues…" : "▶ Generate this month's issues now"}
      </button>
      {err && <p className="text-xs text-red-700">{err}</p>}
      {result && (
        <ul className="space-y-1 text-xs text-muted-foreground">
          {result.results.map((r) => (
            <li key={r.autoKey}>
              {r.status === "sent" && `✅ ${r.segment}: sent to ${r.sent}`}
              {r.status === "created" && `📝 ${r.segment}: ready for review (reaches ${r.reach ?? "?"})`}
              {r.status === "skipped-existing" && `⏭ ${r.segment}: this month's issue already exists`}
              {r.status === "send-failed" && `⚠️ ${r.segment}: ${r.note ?? "failed"}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
