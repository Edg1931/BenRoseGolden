"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DemoPersona } from "@/lib/learn/demo";

/**
 * Enters the client experience as a sample learner and lands on the page that
 * best makes the point — mid-course learners on their profile, graduates on
 * their certificate.
 */
export function DemoLauncher({
  persona,
  destination,
  label,
  sublabel,
  primary,
}: {
  persona: DemoPersona;
  destination: string;
  label: string;
  sublabel: string;
  primary?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function go() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/demo/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Could not start the demo.");
      router.push(destination);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not start the demo.");
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        onClick={go}
        disabled={busy}
        className={
          "w-full rounded-lg px-4 py-3 text-left transition disabled:opacity-60 " +
          (primary
            ? "bg-brand-rose text-white hover:bg-brand-plum"
            : "border border-input hover:bg-muted")
        }
      >
        <span className="block text-sm font-semibold">{busy ? "Opening…" : label}</span>
        <span className={"block text-xs " + (primary ? "text-white" : "text-muted-foreground")}>
          {sublabel}
        </span>
      </button>
      {err && <p className="mt-1 text-xs text-red-700">{err}</p>}
    </div>
  );
}
