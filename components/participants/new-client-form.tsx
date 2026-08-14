"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  CREDIT_BAND_ESTIMATE,
  CREDIT_BAND_LABELS,
  PARTICIPANT_STAGES,
  STAGE_LABELS,
  type CreditBand,
  type ParticipantStage,
} from "@/lib/participants/schema";
import { OCCUPATION_OPTIONS } from "@/lib/programs/occupations";

type Channel = "email" | "sms" | "phone" | "mail";
type Source = "class" | "web" | "referral" | "import" | "event" | "partner";

const CHANNELS: Channel[] = ["email", "sms", "phone", "mail"];
const SOURCES: Source[] = ["class", "web", "referral", "event", "partner", "import"];
const SOURCE_LABELS: Record<Source, string> = {
  class: "Attended a class",
  web: "Signed up on the website",
  referral: "Referred by a partner",
  event: "Community event",
  partner: "Partner organization",
  import: "Imported from records",
};

interface PreviewMatch {
  id: string;
  name: string;
  provider: string;
  amount: string;
  assistanceType: string;
  unlockedByCertificate: boolean;
}

const input =
  "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30";
const label = "text-xs font-medium text-muted-foreground";

/**
 * Add ONE client, with every field the assistance-matching engine reads.
 *
 * The right-hand panel runs the same matching engine the client-facing finder
 * uses, live, as the intake is typed — so staff can see whether what they're
 * entering actually opens any doors before they save, and can ask the follow-up
 * question ("do you know your credit range?") while the person is still there.
 */
export function NewClientForm({ counties }: { counties: string[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Identity
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [stage, setStage] = useState<ParticipantStage>("lead");
  const [source, setSource] = useState<Source>("class");
  const [counselor, setCounselor] = useState("");

  // Contact
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [channels, setChannels] = useState<Channel[]>(["email"]);
  const [doNotContact, setDoNotContact] = useState(false);

  // Address
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [zip, setZip] = useState("");

  // Household / finances
  const [size, setSize] = useState("");
  const [income, setIncome] = useState("");
  const [amiOverride, setAmiOverride] = useState("");
  const [creditBand, setCreditBand] = useState<CreditBand>("unknown");
  const [fthb, setFthb] = useState("");
  const [price, setPrice] = useState("");
  const [savings, setSavings] = useState("");
  const [monthlyDebt, setMonthlyDebt] = useState("");
  const [occupation, setOccupation] = useState("");
  const [veteran, setVeteran] = useState(false);

  // Needs
  const [tracks, setTracks] = useState<Track[]>([]);
  const [formats, setFormats] = useState<ContentFormat[]>([]);
  const [completedEd, setCompletedEd] = useState(false);

  // Consent / misc
  const [consent, setConsent] = useState(false);
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");

  const num = (s: string) => {
    const n = Number(s.replace(/[$,\s]/g, ""));
    return s.trim() === "" || Number.isNaN(n) ? undefined : n;
  };

  function toggle<T>(list: T[], value: T, set: (v: T[]) => void) {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  /* ── Live eligibility preview ──────────────────────────────────────────── */
  const buyer = useMemo(
    () => ({
      county: county.trim().toLowerCase() || undefined,
      city: city.trim().toLowerCase() || undefined,
      firstTimeBuyer: fthb === "" ? tracks.includes("first-time-buyer") : fthb === "true",
      householdSize: num(size) ?? 1,
      householdIncome: num(income) ?? 0,
      occupation:
        [occupation, veteran ? "Veteran / active military" : ""].filter(Boolean).join(", ") ||
        undefined,
      estimatedCredit: CREDIT_BAND_ESTIMATE[creditBand],
      completedHomebuyerEd: completedEd,
      targetPurchasePrice: num(price),
    }),
    [county, city, fthb, tracks, size, income, occupation, veteran, creditBand, completedEd, price],
  );

  const [preview, setPreview] = useState<{ matches: PreviewMatch[]; total: number } | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const ready = !!buyer.county && buyer.householdIncome > 0;
  const buyerKey = JSON.stringify(buyer);

  useEffect(() => {
    if (!ready) {
      setPreview(null);
      return;
    }
    let cancelled = false;
    setPreviewing(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/learn/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: buyerKey,
        });
        const data = await res.json();
        if (!cancelled && res.ok) {
          setPreview({ matches: data.matches ?? [], total: data.totalPrograms ?? 0 });
        }
      } catch {
        /* preview is advisory — never block intake on it */
      } finally {
        if (!cancelled) setPreviewing(false);
      }
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [buyerKey, ready]);

  /* ── Save ──────────────────────────────────────────────────────────────── */
  async function save(andAnother: boolean) {
    setBusy(true);
    setErr(null);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const body = {
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        preferredName: preferredName.trim() || undefined,
        email: email.trim().toLowerCase() || undefined,
        phone: phone.trim() || undefined,
        address: {
          line1: line1.trim() || undefined,
          city: city.trim() || undefined,
          county: county.trim() || undefined,
          state: "OH",
          zip: zip.trim() || undefined,
        },
        preferredLanguage: language,
        preferredFormats: formats,
        contactChannels: channels,
        doNotContact,
        household: {
          size: num(size),
          annualIncome: num(income),
          amiPercent: num(amiOverride),
          creditBand,
          firstTimeBuyer: fthb === "" ? undefined : fthb === "true",
          targetPurchasePrice: num(price),
          savingsAvailable: num(savings),
          monthlyDebt: num(monthlyDebt),
          occupation: occupation || undefined,
          veteran: veteran || undefined,
        },
        tracks,
        stage,
        assignedCounselor: counselor.trim() || undefined,
        source,
        consentToShare: consent,
        consentDate: consent ? today : undefined,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        notes: notes.trim() || undefined,
      };

      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save this client");

      if (andAnother) {
        window.location.href = "/contacts/new?added=" + encodeURIComponent(body.firstName);
      } else {
        router.push(`/contacts/${data.participant.id}`);
        router.refresh();
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save this client");
      setBusy(false);
    }
  }

  const canSave = firstName.trim().length > 0 && !busy;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-5">
        <Section title="Who they are" hint="Only a first name is required — you can fill in the rest later.">
          <Field label="First name *">
            <input className={input} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoFocus />
          </Field>
          <Field label="Last name">
            <input className={input} value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Field>
          <Field label="Goes by">
            <input className={input} value={preferredName} onChange={(e) => setPreferredName(e.target.value)} />
          </Field>
          <Field label="Stage">
            <select className={input} value={stage} onChange={(e) => setStage(e.target.value as ParticipantStage)}>
              {PARTICIPANT_STAGES.map((s) => (
                <option key={s} value={s}>{STAGE_LABELS[s]}</option>
              ))}
            </select>
          </Field>
          <Field label="How they came to us">
            <select className={input} value={source} onChange={(e) => setSource(e.target.value as Source)}>
              {SOURCES.map((s) => (
                <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
              ))}
            </select>
          </Field>
          <Field label="Assigned counselor">
            <input className={input} value={counselor} onChange={(e) => setCounselor(e.target.value)} />
          </Field>
        </Section>

        <Section title="How to reach them">
          <Field label="Email">
            <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <Field label="Preferred language">
            <select className={input} value={language} onChange={(e) => setLanguage(e.target.value as LanguageCode)}>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-3">
            <div className={label}>Contact by</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {CHANNELS.map((c) => (
                <Chip key={c} on={channels.includes(c)} onClick={() => toggle(channels, c, setChannels)}>
                  {c}
                </Chip>
              ))}
              <label className="ml-2 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={doNotContact} onChange={(e) => setDoNotContact(e.target.checked)} />
                Do not contact
              </label>
            </div>
          </div>
        </Section>

        <Section
          title="Where they live"
          hint="County drives the AMI income limits and which local programs apply — it matters more than the street address."
        >
          <Field label="Street">
            <input className={input} value={line1} onChange={(e) => setLine1(e.target.value)} />
          </Field>
          <Field label="City">
            <input className={input} value={city} onChange={(e) => setCity(e.target.value)} />
          </Field>
          <Field label="County">
            <input
              className={input}
              list="ami-counties"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              placeholder="e.g. Cuyahoga"
            />
            <datalist id="ami-counties">
              {counties.map((c) => (
                <option key={c} value={c[0].toUpperCase() + c.slice(1)} />
              ))}
            </datalist>
          </Field>
          <Field label="ZIP">
            <input className={input} value={zip} onChange={(e) => setZip(e.target.value)} />
          </Field>
        </Section>

        <Section
          title="Household &amp; finances"
          hint="This is what the assistance matching runs on. The more of it you have, the fewer “verify this” caveats come back."
        >
          <Field label="Household size">
            <input className={input} inputMode="numeric" value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. 3" />
          </Field>
          <Field label="Annual household income">
            <input className={input} inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="e.g. 52000" />
          </Field>
          <Field label="% of AMI" hint="Leave blank — calculated from county, size &amp; income.">
            <input className={input} inputMode="numeric" value={amiOverride} onChange={(e) => setAmiOverride(e.target.value)} placeholder="auto" />
          </Field>
          <Field label="Credit range">
            <select className={input} value={creditBand} onChange={(e) => setCreditBand(e.target.value as CreditBand)}>
              {CREDIT_BANDS.map((c) => (
                <option key={c} value={c}>{CREDIT_BAND_LABELS[c]}</option>
              ))}
            </select>
          </Field>
          <Field label="First-time buyer">
            <select className={input} value={fthb} onChange={(e) => setFthb(e.target.value)}>
              <option value="">Unknown</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </Field>
          <Field label="Target purchase price">
            <input className={input} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 180000" />
          </Field>
          <Field label="Savings toward purchase">
            <input className={input} inputMode="numeric" value={savings} onChange={(e) => setSavings(e.target.value)} />
          </Field>
          <Field label="Monthly debt payments">
            <input className={input} inputMode="numeric" value={monthlyDebt} onChange={(e) => setMonthlyDebt(e.target.value)} />
          </Field>
          <Field label="Occupation" hint="Some programs are teacher / first-responder only.">
            <select className={input} value={occupation} onChange={(e) => setOccupation(e.target.value)}>
              {OCCUPATION_OPTIONS.map((o) => (
                <option key={o} value={o}>{o || "—"}</option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-3 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={veteran} onChange={(e) => setVeteran(e.target.checked)} />
              Veteran / active military
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={completedEd} onChange={(e) => setCompletedEd(e.target.checked)} />
              Already completed homebuyer education elsewhere
            </label>
          </div>
        </Section>

        <Section title="What they need">
          <div className="sm:col-span-3">
            <div className={label}>Situation / track</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {TRACKS.map((t) => (
                <Chip key={t} on={tracks.includes(t)} onClick={() => toggle(tracks, t, setTracks)} tone="rose">
                  {TRACK_LABELS[t]}
                </Chip>
              ))}
            </div>
          </div>
          <div className="sm:col-span-3">
            <div className={label}>How they want content delivered</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {CONTENT_FORMATS.map((f) => (
                <Chip key={f} on={formats.includes(f)} onClick={() => toggle(formats, f, setFormats)} tone="gold">
                  {CONTENT_FORMAT_LABELS[f]}
                </Chip>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Consent &amp; notes">
          <div className="sm:col-span-3 space-y-3">
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                They consent to being referred to The Golden Group.
                <span className="block text-xs text-muted-foreground">
                  Only tick this if they actually said yes — it is what allows their information to
                  cross to an agent.
                </span>
              </span>
            </label>
            <div>
              <div className={label}>Tags (comma-separated)</div>
              <input className={input} value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            <div>
              <div className={label}>Notes</div>
              <textarea className={input} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
        </Section>

        {err && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>
        )}

        <div className="flex flex-wrap gap-2 pb-8">
          <button
            onClick={() => save(false)}
            disabled={!canSave}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save client"}
          </button>
          <button
            onClick={() => save(true)}
            disabled={!canSave}
            className="rounded-md border border-input px-4 py-2 text-sm disabled:opacity-60"
          >
            Save &amp; add another
          </button>
          <Link href="/contacts" className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:underline">
            Cancel
          </Link>
        </div>
      </div>

      {/* Live eligibility preview */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <Card className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Assistance preview</h3>
            {previewing && <span className="text-xs text-muted-foreground">checking…</span>}
          </div>

          {!ready ? (
            <p className="text-sm text-muted-foreground">
              Enter a <strong>county</strong> and <strong>annual income</strong> and this will show
              the programs they look eligible for — before you even save.
            </p>
          ) : preview == null ? (
            <p className="text-sm text-muted-foreground">Matching…</p>
          ) : preview.matches.length === 0 ? (
            <p className="text-sm text-amber-700">
              No programs match yet out of {preview.total}. Check the county spelling, or the income
              may be above the local limits.
            </p>
          ) : (
            <>
              <p className="text-sm">
                <span className="text-2xl font-semibold text-brand-rose">{preview.matches.length}</span>{" "}
                <span className="text-muted-foreground">of {preview.total} programs may fit.</span>
              </p>
              <ul className="space-y-2">
                {preview.matches.slice(0, 4).map((m) => (
                  <li key={m.id} className="rounded-md border border-border p-2">
                    <div className="text-sm font-medium leading-tight">{m.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {m.provider} · {m.assistanceType} · {m.amount}
                    </div>
                    {m.unlockedByCertificate && (
                      <div className="mt-1 text-xs text-emerald-700">
                        ✓ unlocked by their education certificate
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              {preview.matches.length > 4 && (
                <p className="text-xs text-muted-foreground">
                  + {preview.matches.length - 4} more — the full ranked list is on their profile once
                  you save.
                </p>
              )}
            </>
          )}

          <p className="border-t border-border pt-2 text-xs text-muted-foreground">
            Preview only. Saving runs the same match against their saved record and keeps it up to
            date as their situation changes.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </Card>
  );
}

function Field({
  label: text,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className={label}>{text}</div>
      {children}
      {hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Chip({
  on,
  onClick,
  tone = "neutral",
  children,
}: {
  on: boolean;
  onClick: () => void;
  tone?: "neutral" | "rose" | "gold";
  children: React.ReactNode;
}) {
  const active =
    tone === "rose"
      ? "bg-brand-rose/10 text-brand-rose ring-brand-rose/30"
      : tone === "gold"
        ? "bg-brand-gold/10 text-amber-700 ring-brand-gold/30"
        : "bg-foreground text-white ring-foreground";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-xs ring-1 ${on ? active : "text-muted-foreground ring-border"}`}
    >
      {children}
    </button>
  );
}
