"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { LANGUAGES, LANGUAGE_LABELS, type LanguageCode } from "@/lib/participants/curriculum";
import {
  ASSISTANCE_KINDS, ASSISTANCE_KIND_LABELS,
  LENDER_TIERS, LENDER_TIER_LABELS,
  LOAN_TYPES, LOAN_TYPE_LABELS,
  type AssistanceKind, type Lender, type LenderProgram, type LenderTier, type LoanType,
} from "@/lib/lenders/schema";

/** Create or edit a preferred-lender profile. */
export function LenderForm({ lender }: { lender?: Lender }) {
  const router = useRouter();
  const editing = Boolean(lender);

  const [institutionName, setInstitutionName] = useState(lender?.institutionName ?? "");
  const [contactName, setContactName] = useState(lender?.contactName ?? "");
  const [title, setTitle] = useState(lender?.title ?? "");
  const [email, setEmail] = useState(lender?.email ?? "");
  const [phone, setPhone] = useState(lender?.phone ?? "");
  const [website, setWebsite] = useState(lender?.website ?? "");
  const [nmls, setNmls] = useState(lender?.nmls ?? "");
  const [city, setCity] = useState(lender?.address?.city ?? "");
  const [county, setCounty] = useState(lender?.address?.county ?? "");
  const [serviceCounties, setServiceCounties] = useState((lender?.serviceCounties ?? []).join(", "));
  const [languages, setLanguages] = useState<LanguageCode[]>(lender?.languages ?? ["en"]);
  const [loanTypes, setLoanTypes] = useState<LoanType[]>(lender?.loanTypes ?? []);
  const [programs, setPrograms] = useState<LenderProgram[]>(lender?.programs ?? []);
  const [marketingBlurb, setMarketingBlurb] = useState(lender?.marketingBlurb ?? "");
  const [tier, setTier] = useState<LenderTier>(lender?.tier ?? "standard");
  const [advertising, setAdvertising] = useState(lender?.advertising ?? false);
  const [monthlyRate, setMonthlyRate] = useState(lender?.monthlyRate?.toString() ?? "");
  const [partnerSince, setPartnerSince] = useState(lender?.partnerSince ?? "");
  const [receivesReferrals, setReceivesReferrals] = useState(lender?.receivesReferrals ?? true);
  const [active, setActive] = useState(lender?.active ?? true);
  const [notes, setNotes] = useState(lender?.notes ?? "");

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function toggle<T>(list: T[], v: T, set: (x: T[]) => void) {
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  }
  function setProgram(i: number, patch: Partial<LenderProgram>) {
    setPrograms((ps) => ps.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  }

  async function save() {
    if (!institutionName.trim()) { setErr("Institution name is required."); return; }
    setBusy(true);
    setErr(null);
    try {
      const payload = {
        institutionName, contactName: contactName || undefined, title: title || undefined,
        email: email || undefined, phone: phone || undefined, website: website || undefined,
        nmls: nmls || undefined,
        address: { city: city || undefined, county: county || undefined, state: "OH" },
        serviceCounties: serviceCounties.split(",").map((s) => s.trim()).filter(Boolean),
        languages, loanTypes,
        programs: programs.filter((p) => p.name.trim()),
        marketingBlurb: marketingBlurb || undefined,
        tier, advertising,
        monthlyRate: monthlyRate ? Number(monthlyRate) : undefined,
        partnerSince: partnerSince || undefined,
        receivesReferrals, active, notes: notes || undefined,
      };
      const res = await fetch(editing ? `/api/lenders/${lender!.id}` : "/api/lenders", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push(`/lenders/${data.id}`);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
      setBusy(false);
    }
  }

  const input = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
  const label = "text-xs font-medium text-muted-foreground";

  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-5">
        <h2 className="text-sm font-semibold">Institution & loan officer</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block"><span className={label}>Institution name *</span><input className={input} value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} /></label>
          <label className="block"><span className={label}>Loan officer</span><input className={input} value={contactName} onChange={(e) => setContactName(e.target.value)} /></label>
          <label className="block"><span className={label}>Title</span><input className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Senior Loan Officer" /></label>
          <label className="block"><span className={label}>NMLS #</span><input className={input} value={nmls} onChange={(e) => setNmls(e.target.value)} /></label>
          <label className="block"><span className={label}>Email</span><input className={input} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="block"><span className={label}>Phone</span><input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          <label className="block sm:col-span-2"><span className={label}>Website</span><input className={input} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" /></label>
          <label className="block"><span className={label}>City</span><input className={input} value={city} onChange={(e) => setCity(e.target.value)} /></label>
          <label className="block"><span className={label}>County</span><input className={input} value={county} onChange={(e) => setCounty(e.target.value)} /></label>
          <label className="block sm:col-span-2"><span className={label}>Service counties (comma-separated)</span><input className={input} value={serviceCounties} onChange={(e) => setServiceCounties(e.target.value)} placeholder="Cuyahoga, Summit, Lorain" /></label>
        </div>
      </Card>

      <Card className="space-y-4 p-5">
        <div>
          <span className={label}>Languages served (used to match non-English clients)</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {LANGUAGES.map((l) => (
              <button key={l} type="button" onClick={() => toggle(languages, l, setLanguages)}
                className={`rounded-full px-2.5 py-1 text-xs ring-1 ${languages.includes(l) ? "bg-brand-blush text-brand-rose ring-brand-rose/30" : "text-muted-foreground ring-border"}`}>
                {LANGUAGE_LABELS[l]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className={label}>Loan types</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {LOAN_TYPES.map((lt) => (
              <button key={lt} type="button" onClick={() => toggle(loanTypes, lt, setLoanTypes)}
                className={`rounded-full px-2.5 py-1 text-xs ring-1 ${loanTypes.includes(lt) ? "bg-brand-gold/10 text-amber-700 ring-brand-gold/30" : "text-muted-foreground ring-border"}`}>
                {LOAN_TYPE_LABELS[lt]}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Assistance & loan programs</h2>
          <button type="button" onClick={() => setPrograms((ps) => [...ps, { name: "", kind: "dpa" }])} className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted">+ Add program</button>
        </div>
        {programs.length === 0 && <p className="text-sm text-muted-foreground">No programs yet. Add the assistance or loan programs this lender offers — they show in the assistance area.</p>}
        {programs.map((p, i) => (
          <div key={i} className="rounded-md border border-border p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="block"><span className={label}>Program name</span><input className={input} value={p.name} onChange={(e) => setProgram(i, { name: e.target.value })} /></label>
              <label className="block"><span className={label}>Type</span>
                <select className={input} value={p.kind} onChange={(e) => setProgram(i, { kind: e.target.value as AssistanceKind })}>
                  {ASSISTANCE_KINDS.map((k) => <option key={k} value={k}>{ASSISTANCE_KIND_LABELS[k]}</option>)}
                </select>
              </label>
              <label className="block"><span className={label}>Amount</span><input className={input} value={p.amount ?? ""} onChange={(e) => setProgram(i, { amount: e.target.value })} placeholder="Up to $7,500" /></label>
              <label className="block"><span className={label}>Link</span><input className={input} value={p.link ?? ""} onChange={(e) => setProgram(i, { link: e.target.value || undefined })} placeholder="https://…" /></label>
              <label className="block sm:col-span-2"><span className={label}>Description</span><input className={input} value={p.description ?? ""} onChange={(e) => setProgram(i, { description: e.target.value })} /></label>
            </div>
            <button type="button" onClick={() => setPrograms((ps) => ps.filter((_, j) => j !== i))} className="mt-2 text-xs text-red-700 hover:underline">Remove</button>
          </div>
        ))}
      </Card>

      <Card className="space-y-4 p-5">
        <h2 className="text-sm font-semibold">Partnership & marketing</h2>
        <label className="block"><span className={label}>Marketing blurb (for newsletters & flyers)</span>
          <textarea className={input} rows={2} value={marketingBlurb} onChange={(e) => setMarketingBlurb(e.target.value)} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block"><span className={label}>Partnership tier</span>
            <select className={input} value={tier} onChange={(e) => setTier(e.target.value as LenderTier)}>
              {LENDER_TIERS.map((tt) => <option key={tt} value={tt}>{LENDER_TIER_LABELS[tt]}</option>)}
            </select>
          </label>
          <label className="block"><span className={label}>Monthly sponsorship ($)</span><input type="number" min={0} className={input} value={monthlyRate} onChange={(e) => setMonthlyRate(e.target.value)} placeholder="e.g. 150" /></label>
          <label className="block"><span className={label}>Partner since</span><input type="date" className={input} value={partnerSince} onChange={(e) => setPartnerSince(e.target.value)} /></label>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" className="accent-brand-rose" checked={advertising} onChange={(e) => setAdvertising(e.target.checked)} /> Advertises with us</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="accent-brand-rose" checked={receivesReferrals} onChange={(e) => setReceivesReferrals(e.target.checked)} /> Receives our referrals</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="accent-brand-rose" checked={active} onChange={(e) => setActive(e.target.checked)} /> Active</label>
        </div>
        <label className="block"><span className={label}>Internal notes</span><textarea className={input} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
      </Card>

      {err && <p className="text-sm text-red-700">{err}</p>}
      <div className="flex gap-2">
        <button onClick={save} disabled={busy} className="rounded-md bg-brand-rose px-5 py-2 text-sm font-medium text-white hover:bg-brand-plum disabled:opacity-60">
          {busy ? "Saving…" : editing ? "Save changes" : "Create lender"}
        </button>
        <button onClick={() => router.back()} className="rounded-md border border-input px-4 py-2 text-sm">Cancel</button>
      </div>
    </div>
  );
}
