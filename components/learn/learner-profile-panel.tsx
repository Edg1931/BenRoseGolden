"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { CREDIT_BANDS, CREDIT_BAND_LABELS, type Participant } from "@/lib/participants/schema";

/**
 * Lets a signed-in learner add or update the financial snapshot on their own
 * profile. This is what powers their assistance matches and the tailored class
 * tips — and keeps their CRM record current as their situation changes.
 */
export function LearnerProfilePanel({ learner, startOpen = false }: { learner: Participant; startOpen?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(startOpen);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [city, setCity] = useState(learner.address?.city ?? "");
  const [county, setCounty] = useState(learner.address?.county ?? "");
  const [householdSize, setHouseholdSize] = useState(learner.household.size?.toString() ?? "");
  const [annualIncome, setAnnualIncome] = useState(learner.household.annualIncome?.toString() ?? "");
  const [creditBand, setCreditBand] = useState(learner.household.creditBand);
  const [firstTimeBuyer, setFirstTimeBuyer] = useState<boolean | undefined>(learner.household.firstTimeBuyer);

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/learn/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, county, householdSize, annualIncome, creditBand, firstTimeBuyer }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Could not save");
      setMsg("Saved — your matches and class tips are updated.");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  const field = "mt-1 w-full rounded-md border border-input bg-white px-3 py-2 text-sm";
  const label = "text-sm font-medium";

  return (
    <Card className="p-5">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left">
        <span className="font-semibold text-brand-plum">🏠 Your assistance profile</span>
        <span className="text-sm text-brand-rose">{open ? "Hide" : "Add / edit"}</span>
      </button>
      <p className="mt-1 text-sm text-muted-foreground">
        Optional — the more you share, the better we can match you to down-payment help and tailor your classes.
      </p>

      {open && (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block"><span className={label}>City</span>
              <input className={field} value={city} onChange={(e) => setCity(e.target.value)} /></label>
            <label className="block"><span className={label}>County</span>
              <input className={field} value={county} onChange={(e) => setCounty(e.target.value)} /></label>
            <label className="block"><span className={label}>Household size</span>
              <input type="number" min={1} className={field} value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)} /></label>
            <label className="block"><span className={label}>Annual income</span>
              <input type="number" min={0} step={1000} className={field} value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} /></label>
            <label className="block"><span className={label}>Credit (estimate)</span>
              <select className={field} value={creditBand} onChange={(e) => setCreditBand(e.target.value as typeof creditBand)}>
                {CREDIT_BANDS.map((c) => <option key={c} value={c}>{CREDIT_BAND_LABELS[c]}</option>)}
              </select></label>
            <label className="block"><span className={label}>First-time buyer?</span>
              <select className={field} value={firstTimeBuyer === undefined ? "" : firstTimeBuyer ? "yes" : "no"}
                onChange={(e) => setFirstTimeBuyer(e.target.value === "" ? undefined : e.target.value === "yes")}>
                <option value="">Not sure</option><option value="yes">Yes</option><option value="no">No</option>
              </select></label>
          </div>
          {msg && <p className="text-sm text-emerald-700">{msg}</p>}
          <button onClick={save} disabled={busy} className="rounded-md bg-brand-rose px-4 py-2 text-sm font-medium text-white hover:bg-brand-plum disabled:opacity-60">
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      )}
    </Card>
  );
}
