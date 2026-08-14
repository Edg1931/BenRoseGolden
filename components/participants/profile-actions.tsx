"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  CONTENT_FORMATS,
  CONTENT_FORMAT_LABELS,
  LANGUAGES,
  LANGUAGE_LABELS,
  TRACKS,
  TRACK_LABELS,
  type ContentFormat,
  type LanguageCode,
  type Track,
} from "@/lib/participants/curriculum";
import {
  CREDIT_BANDS,
  CREDIT_BAND_LABELS,
  PARTICIPANT_STAGES,
  STAGE_LABELS,
  type Communication,
  type Participant,
} from "@/lib/participants/schema";
import { OCCUPATION_OPTIONS } from "@/lib/programs/occupations";
import type { RankedContent } from "@/lib/content/delivery";

async function patch(id: string, body: unknown) {
  const res = await fetch(`/api/participants/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
}

export function ProfileActions({
  participant: p,
  content = [],
}: {
  participant: Participant;
  content?: RankedContent[];
}) {
  const [open, setOpen] = useState<"none" | "edit" | "log" | "send">("none");
  return (
    <div>
      <div className="flex gap-2">
        <button
          onClick={() => setOpen(open === "edit" ? "none" : "edit")}
          className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
        >
          ✏️ Edit details
        </button>
        <button
          onClick={() => setOpen(open === "send" ? "none" : "send")}
          className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
        >
          📤 Send content
        </button>
        <button
          onClick={() => setOpen(open === "log" ? "none" : "log")}
          className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
        >
          💬 Log communication
        </button>
      </div>
      {open === "edit" && <EditForm p={p} onClose={() => setOpen("none")} />}
      {open === "send" && <SendContentForm p={p} content={content} onClose={() => setOpen("none")} />}
      {open === "log" && <LogForm p={p} onClose={() => setOpen("none")} />}
    </div>
  );
}

function SendContentForm({
  p,
  content,
  onClose,
}: {
  p: Participant;
  content: RankedContent[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [contentId, setContentId] = useState(content[0]?.item.id ?? "");
  const channelOptions: Communication["channel"][] = ["email", "sms", "phone", "mail", "in-person"];
  const defaultChannel: Communication["channel"] =
    p.contactChannels.includes("email") && p.email ? "email" : p.contactChannels[0] ?? "email";
  const [channel, setChannel] = useState<Communication["channel"]>(defaultChannel);

  const selected = content.find((c) => c.item.id === contentId);

  async function send() {
    setBusy(true);
    setErr(null);
    setNote(null);
    try {
      const res = await fetch(`/api/participants/${p.id}/send-content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId, channel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Send failed");
      if (data.emailed) {
        setNote("Emailed and logged to their timeline.");
      } else if (channel === "email") {
        setNote("Logged to their timeline. Add RESEND_API_KEY to email automatically.");
      } else {
        setNote(`Logged as ${channel} to their timeline.`);
      }
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Send failed");
    } finally {
      setBusy(false);
    }
  }

  const input = "w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm";
  const label = "text-xs font-medium text-muted-foreground";

  return (
    <Card className="mt-3 space-y-3 p-4">
      <p className="text-sm text-muted-foreground">
        Suggestions are ranked for {p.firstName}&apos;s preferred language and format.
      </p>
      <div>
        <div className={label}>Content asset</div>
        <select className={input} value={contentId} onChange={(e) => setContentId(e.target.value)}>
          {content.map(({ item }) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
        {selected && selected.reasons.length > 0 && (
          <p className="mt-1 text-xs text-emerald-700">Good fit: {selected.reasons.join(", ")}.</p>
        )}
      </div>
      <div>
        <div className={label}>Deliver via</div>
        <select className={input} value={channel} onChange={(e) => setChannel(e.target.value as Communication["channel"])}>
          {channelOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {channel === "email" && !p.email && (
          <p className="mt-1 text-xs text-amber-700">No email on file — it will be logged, not sent.</p>
        )}
      </div>
      {err && <p className="text-sm text-red-700">{err}</p>}
      {note && <p className="text-sm text-emerald-700">{note}</p>}
      <div className="flex gap-2">
        <button
          onClick={send}
          disabled={busy || !contentId}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send content"}
        </button>
        <button onClick={onClose} className="rounded-md border border-input px-4 py-2 text-sm">Close</button>
      </div>
    </Card>
  );
}

function EditForm({ p, onClose }: { p: Participant; onClose: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [stage, setStage] = useState(p.stage);
  const [counselor, setCounselor] = useState(p.assignedCounselor ?? "");
  const [language, setLanguage] = useState<LanguageCode>(p.preferredLanguage);
  const [formats, setFormats] = useState<ContentFormat[]>(p.preferredFormats);
  const [tracks, setTracks] = useState<Track[]>(p.tracks);
  const [consent, setConsent] = useState(p.consentToShare);
  const [email, setEmail] = useState(p.email ?? "");
  const [phone, setPhone] = useState(p.phone ?? "");
  const [city, setCity] = useState(p.address?.city ?? "");
  const [county, setCounty] = useState(p.address?.county ?? "");
  const [zip, setZip] = useState(p.address?.zip ?? "");
  const [size, setSize] = useState(p.household.size?.toString() ?? "");
  const [income, setIncome] = useState(p.household.annualIncome?.toString() ?? "");
  const [ami, setAmi] = useState(p.household.amiPercent?.toString() ?? "");
  const [creditBand, setCreditBand] = useState(p.household.creditBand);
  const [fthb, setFthb] = useState<string>(p.household.firstTimeBuyer == null ? "" : String(p.household.firstTimeBuyer));
  const [price, setPrice] = useState(p.household.targetPurchasePrice?.toString() ?? "");
  const [savings, setSavings] = useState(p.household.savingsAvailable?.toString() ?? "");
  const [monthlyDebt, setMonthlyDebt] = useState(p.household.monthlyDebt?.toString() ?? "");
  const [occupation, setOccupation] = useState(p.household.occupation ?? "");
  const [veteran, setVeteran] = useState(p.household.veteran ?? false);
  const [tags, setTags] = useState(p.tags.join(", "));
  const [notes, setNotes] = useState(p.notes ?? "");

  function toggle<T>(list: T[], value: T, set: (v: T[]) => void) {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      const num = (s: string) => (s.trim() === "" ? undefined : Number(s));
      await patch(p.id, {
        stage,
        assignedCounselor: counselor || undefined,
        preferredLanguage: language,
        preferredFormats: formats,
        tracks,
        consentToShare: consent,
        consentDate: consent ? (p.consentDate ?? new Date().toISOString().slice(0, 10)) : undefined,
        email: email || undefined,
        phone: phone || undefined,
        address: { city: city || undefined, county: county || undefined, zip: zip || undefined, state: "OH" },
        household: {
          size: num(size),
          annualIncome: num(income),
          amiPercent: num(ami),
          creditBand,
          firstTimeBuyer: fthb === "" ? undefined : fthb === "true",
          targetPurchasePrice: num(price),
          savingsAvailable: num(savings),
          monthlyDebt: num(monthlyDebt),
          occupation: occupation || undefined,
          veteran: veteran || undefined,
        },
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        notes: notes || undefined,
      });
      router.refresh();
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const input = "w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm";
  const label = "text-xs font-medium text-muted-foreground";

  return (
    <Card className="mt-3 space-y-4 p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div><div className={label}>Stage</div>
          <select className={input} value={stage} onChange={(e) => setStage(e.target.value as typeof stage)}>
            {PARTICIPANT_STAGES.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
          </select>
        </div>
        <div><div className={label}>Counselor</div><input className={input} value={counselor} onChange={(e) => setCounselor(e.target.value)} /></div>
        <div><div className={label}>Language</div>
          <select className={input} value={language} onChange={(e) => setLanguage(e.target.value as LanguageCode)}>
            {LANGUAGES.map((l) => <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>)}
          </select>
        </div>
        <div><div className={label}>Email</div><input className={input} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><div className={label}>Phone</div><input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        <div><div className={label}>City</div><input className={input} value={city} onChange={(e) => setCity(e.target.value)} /></div>
        <div><div className={label}>County</div><input className={input} value={county} onChange={(e) => setCounty(e.target.value)} /></div>
        <div><div className={label}>ZIP</div><input className={input} value={zip} onChange={(e) => setZip(e.target.value)} /></div>
        <div><div className={label}>Household size</div><input className={input} value={size} onChange={(e) => setSize(e.target.value)} /></div>
        <div><div className={label}>Annual income</div><input className={input} value={income} onChange={(e) => setIncome(e.target.value)} /></div>
        <div><div className={label}>% of AMI <span className="font-normal">(blank = auto)</span></div><input className={input} placeholder="auto" value={ami} onChange={(e) => setAmi(e.target.value)} /></div>
        <div><div className={label}>Credit band</div>
          <select className={input} value={creditBand} onChange={(e) => setCreditBand(e.target.value as typeof creditBand)}>
            {CREDIT_BANDS.map((c) => <option key={c} value={c}>{CREDIT_BAND_LABELS[c]}</option>)}
          </select>
        </div>
        <div><div className={label}>First-time buyer</div>
          <select className={input} value={fthb} onChange={(e) => setFthb(e.target.value)}>
            <option value="">Unknown</option><option value="true">Yes</option><option value="false">No</option>
          </select>
        </div>
        <div><div className={label}>Target price</div><input className={input} value={price} onChange={(e) => setPrice(e.target.value)} /></div>
        <div><div className={label}>Savings available</div><input className={input} value={savings} onChange={(e) => setSavings(e.target.value)} /></div>
        <div><div className={label}>Monthly debt</div><input className={input} value={monthlyDebt} onChange={(e) => setMonthlyDebt(e.target.value)} /></div>
        <div><div className={label}>Occupation</div>
          <select className={input} value={occupation} onChange={(e) => setOccupation(e.target.value)}>
            {OCCUPATION_OPTIONS.map((o) => <option key={o} value={o}>{o || "—"}</option>)}
          </select>
        </div>
        <label className="flex items-end gap-2 pb-1.5 text-sm">
          <input type="checkbox" checked={veteran} onChange={(e) => setVeteran(e.target.checked)} />
          Veteran / military
        </label>
      </div>

      <div>
        <div className={label}>Needs / tracks</div>
        <div className="mt-1 flex flex-wrap gap-2">
          {TRACKS.map((t) => (
            <button key={t} type="button" onClick={() => toggle(tracks, t, setTracks)}
              className={`rounded-full px-2 py-1 text-xs ring-1 ${tracks.includes(t) ? "bg-brand-rose/10 text-brand-roseink ring-brand-rose/30" : "ring-border text-muted-foreground"}`}>
              {TRACK_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className={label}>Preferred content formats</div>
        <div className="mt-1 flex flex-wrap gap-2">
          {CONTENT_FORMATS.map((f) => (
            <button key={f} type="button" onClick={() => toggle(formats, f, setFormats)}
              className={`rounded-full px-2 py-1 text-xs ring-1 ${formats.includes(f) ? "bg-brand-gold/10 text-amber-700 ring-brand-gold/30" : "ring-border text-muted-foreground"}`}>
              {CONTENT_FORMAT_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div><div className={label}>Tags (comma-separated)</div><input className={input} value={tags} onChange={(e) => setTags(e.target.value)} /></div>
      <div><div className={label}>Notes</div><textarea className={input} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        Consent to share with The Golden Group
      </label>

      {err && <p className="text-sm text-red-700">{err}</p>}
      <div className="flex gap-2">
        <button onClick={save} disabled={busy} className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {busy ? "Saving…" : "Save changes"}
        </button>
        <button onClick={onClose} className="rounded-md border border-input px-4 py-2 text-sm">Cancel</button>
      </div>
    </Card>
  );
}

function LogForm({ p, onClose }: { p: Participant; onClose: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [channel, setChannel] = useState<Communication["channel"]>("phone");
  const [direction, setDirection] = useState<Communication["direction"]>("outbound");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      const entry: Communication = {
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
        channel,
        direction,
        subject: subject || undefined,
        body: body || undefined,
      };
      await patch(p.id, { communications: [...p.communications, entry] });
      router.refresh();
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const input = "w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm";
  return (
    <Card className="mt-3 space-y-3 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <select className={input} value={channel} onChange={(e) => setChannel(e.target.value as Communication["channel"])}>
          {["email", "sms", "phone", "in-person", "mail", "note"].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className={input} value={direction} onChange={(e) => setDirection(e.target.value as Communication["direction"])}>
          {["outbound", "inbound", "internal"].map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <input className={input} placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <textarea className={input} rows={3} placeholder="What was discussed?" value={body} onChange={(e) => setBody(e.target.value)} />
      {err && <p className="text-sm text-red-700">{err}</p>}
      <div className="flex gap-2">
        <button onClick={save} disabled={busy} className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {busy ? "Saving…" : "Log it"}
        </button>
        <button onClick={onClose} className="rounded-md border border-input px-4 py-2 text-sm">Cancel</button>
      </div>
    </Card>
  );
}
