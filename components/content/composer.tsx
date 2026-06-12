"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "./markdown";
import {
  LANGUAGES,
  LANGUAGE_LABELS,
  TRACKS,
  TRACK_LABELS,
  type LanguageCode,
  type Track,
} from "@/lib/participants/curriculum";
import {
  PARTICIPANT_STAGES,
  STAGE_LABELS,
  type ParticipantStage,
} from "@/lib/participants/schema";
import { CAMPAIGN_TYPES, type CampaignType } from "@/lib/content/schema";

export function Composer() {
  const router = useRouter();
  const [type, setType] = useState<CampaignType>("newsletter");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [stages, setStages] = useState<ParticipantStage[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [highlights, setHighlights] = useState("");
  const [instructions, setInstructions] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [source, setSource] = useState<"ai" | "template" | null>(null);
  const [drafting, setDrafting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function toggle<T>(list: T[], v: T, set: (x: T[]) => void) {
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  }

  async function draft() {
    if (!topic.trim()) { setMsg("Give it a topic first."); return; }
    setDrafting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/content/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          topic,
          language,
          audience: { stages, tracks, language },
          highlights: highlights.split("\n").map((h) => h.trim()).filter(Boolean),
          instructions: instructions || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Draft failed");
      setBody(data.bodyMarkdown);
      if (data.subject) setSubject(data.subject);
      setSource(data.source);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Draft failed");
    } finally {
      setDrafting(false);
    }
  }

  async function save(status: "draft" | "ready") {
    if (!body.trim()) { setMsg("Draft some content first."); return; }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title: topic || "Untitled",
          subject: subject || undefined,
          audience: { stages, tracks, language },
          language,
          bodyMarkdown: body,
          status,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      router.push("/content");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  }

  const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Controls */}
      <div className="space-y-4">
        <Card className="space-y-3 p-4">
          <div className="flex gap-2">
            {CAMPAIGN_TYPES.map((t) => (
              <button key={t} onClick={() => setType(t)}
                className={`rounded-md px-3 py-1.5 text-sm capitalize ring-1 ${type === t ? "bg-brand-rose/10 text-brand-rose ring-brand-rose/30" : "ring-border text-muted-foreground"}`}>
                {t}
              </button>
            ))}
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">Topic</div>
            <input className={input} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={type === "flyer" ? "e.g. Free Homebuyer Class — Saturdays in Cleveland" : "e.g. June housing newsletter"} />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">Language</div>
            <select className={input} value={language} onChange={(e) => setLanguage(e.target.value as LanguageCode)}>
              {LANGUAGES.map((l) => <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>)}
            </select>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">Audience — stages</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {PARTICIPANT_STAGES.map((s) => (
                <button key={s} onClick={() => toggle(stages, s, setStages)}
                  className={`rounded-full px-2 py-1 text-xs ring-1 ${stages.includes(s) ? "bg-brand-gold/10 text-amber-700 ring-brand-gold/30" : "ring-border text-muted-foreground"}`}>
                  {STAGE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">Audience — needs</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {TRACKS.map((t) => (
                <button key={t} onClick={() => toggle(tracks, t, setTracks)}
                  className={`rounded-full px-2 py-1 text-xs ring-1 ${tracks.includes(t) ? "bg-brand-gold/10 text-amber-700 ring-brand-gold/30" : "ring-border text-muted-foreground"}`}>
                  {TRACK_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">Highlights (one per line)</div>
            <textarea className={input} rows={3} value={highlights} onChange={(e) => setHighlights(e.target.value)} placeholder={"Free HUD-approved class\nChildcare provided\nRegister online"} />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">Extra instructions (optional)</div>
            <input className={input} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Tone, length, anything specific…" />
          </div>
          <button onClick={draft} disabled={drafting} className="w-full rounded-md bg-brand-rose px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
            {drafting ? "Drafting with Claude…" : "✨ Draft with AI"}
          </button>
        </Card>
      </div>

      {/* Editor + preview */}
      <div className="space-y-4">
        <Card className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Draft</h3>
            {source && <Badge variant={source === "ai" ? "success" : "muted"}>{source === "ai" ? "AI-drafted" : "template"}</Badge>}
          </div>
          {type === "newsletter" && (
            <input className={input} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject line" />
          )}
          <textarea className={`${input} font-mono`} rows={12} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Your content appears here — edit freely. Markdown supported." />
          {msg && <p className="text-sm text-amber-700">{msg}</p>}
          <div className="flex gap-2">
            <button onClick={() => save("ready")} disabled={saving} className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              {saving ? "Saving…" : "Save as ready"}
            </button>
            <button onClick={() => save("draft")} disabled={saving} className="rounded-md border border-input px-4 py-2 text-sm">
              Save draft
            </button>
          </div>
        </Card>

        {body && (
          <Card className="p-5">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Preview</div>
            <Markdown source={body} />
          </Card>
        )}
      </div>
    </div>
  );
}
