"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Send button for a newsletter campaign. Posts to the send endpoint and reports
 * how many recipients were reached — or, when no email provider is configured,
 * tells staff exactly what to set to enable sending.
 */
export function SendCampaign({
  campaignId,
  emailable,
}: {
  campaignId: string;
  emailable: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [tone, setTone] = useState<"ok" | "warn" | "err">("ok");
  const [confirming, setConfirming] = useState(false);

  async function send() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/send`, { method: "POST" });
      const data = await res.json();
      if (res.status === 422) {
        setTone("warn");
        setMsg(`Would reach ${data.wouldReach}. ${data.error}`);
      } else if (!res.ok) {
        setTone("err");
        setMsg(data.error ?? "Send failed");
      } else {
        setTone("ok");
        setMsg(`Sent to ${data.sent}${data.failed ? ` · ${data.failed} failed` : ""}.`);
        router.refresh();
      }
    } catch (e) {
      setTone("err");
      setMsg(e instanceof Error ? e.message : "Send failed");
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  const toneClass =
    tone === "ok" ? "text-emerald-700" : tone === "warn" ? "text-amber-700" : "text-red-700";

  return (
    <div className="space-y-1.5">
      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          disabled={busy}
          className="rounded-md bg-brand-gold px-3 py-1.5 text-xs font-medium text-foreground disabled:opacity-60"
        >
          ✉️ Send newsletter
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={send}
            disabled={busy}
            className="rounded-md bg-brand-gold px-3 py-1.5 text-xs font-medium text-foreground disabled:opacity-60"
          >
            {busy ? "Sending…" : `Send to ${emailable}`}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={busy}
            className="rounded-md border border-input px-3 py-1.5 text-xs"
          >
            Cancel
          </button>
        </div>
      )}
      {msg && <p className={`text-xs ${toneClass}`}>{msg}</p>}
    </div>
  );
}
