"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  autoMapHeaders,
  IMPORT_FIELDS,
  parseCsv,
  type ImportField,
} from "@/lib/participants/import";

type Step = "upload" | "map" | "done";

export function ImportWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<number, ImportField | "">>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ inserted: number; failed: number } | null>(null);

  async function onFile(file: File) {
    setError(null);
    const text = await file.text();
    const parsed = parseCsv(text);
    if (parsed.length < 2) {
      setError("CSV needs a header row and at least one data row.");
      return;
    }
    const [head, ...data] = parsed;
    setHeaders(head);
    setRows(data);
    setMapping(autoMapHeaders(head));
    setStep("map");
  }

  async function commit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/participants/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows, mapping }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed");
      setResult({ inserted: data.inserted, failed: data.failed });
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  if (step === "done" && result) {
    return (
      <Card className="space-y-3 p-6 text-center">
        <div className="text-3xl">✅</div>
        <h2 className="text-lg font-semibold">Imported {result.inserted} clients</h2>
        {result.failed > 0 && (
          <p className="text-sm text-amber-700">{result.failed} row(s) had issues and were skipped.</p>
        )}
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => router.push("/contacts")}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-white"
          >
            View clients
          </button>
          <button
            onClick={() => { setStep("upload"); setResult(null); setRows([]); }}
            className="rounded-md border border-input px-4 py-2 text-sm"
          >
            Import another file
          </button>
        </div>
      </Card>
    );
  }

  if (step === "map") {
    return (
      <div className="space-y-4">
        <Card className="space-y-4 p-5">
          <div>
            <h2 className="font-semibold">Match your columns</h2>
            <p className="text-sm text-muted-foreground">
              We auto-matched {headers.length} columns from your file. Adjust any that look off, then import {rows.length.toLocaleString()} clients.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {headers.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-1/2 truncate text-sm font-medium" title={h}>{h || `Column ${i + 1}`}</span>
                <span className="text-muted-foreground">→</span>
                <select
                  className="w-1/2 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                  value={mapping[i] ?? ""}
                  onChange={(e) =>
                    setMapping((m) => ({ ...m, [i]: e.target.value as ImportField | "" }))
                  }
                >
                  <option value="">— Ignore —</option>
                  {IMPORT_FIELDS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-x-auto p-0">
          <div className="border-b border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Preview (first 5 rows)
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>{headers.map((h, i) => <th key={i} className="px-3 py-2">{mapping[i] || h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.slice(0, 5).map((r, ri) => (
                <tr key={ri} className="border-t border-border">
                  {headers.map((_, ci) => <td key={ci} className="px-3 py-1.5">{r[ci]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={commit}
            disabled={busy}
            className="rounded-md bg-brand-rose px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {busy ? "Importing…" : `Import ${rows.length.toLocaleString()} clients`}
          </button>
          <button onClick={() => setStep("upload")} className="rounded-md border border-input px-4 py-2 text-sm">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card className="space-y-4 p-8 text-center">
      <div className="text-3xl">📥</div>
      <div>
        <h2 className="font-semibold">Upload a CSV of existing clients</h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Export your spreadsheet as CSV and drop it here. Columns like name, email, phone, city, language, income, and credit are matched automatically — you can adjust the mapping next.
        </p>
      </div>
      <label className="inline-block cursor-pointer rounded-md bg-foreground px-4 py-2 text-sm font-medium text-white">
        Choose CSV file
        <input
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </Card>
  );
}
