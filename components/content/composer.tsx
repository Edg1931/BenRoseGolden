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
import type { NewsletterDoc } from "@/lib/content/newsletter";
import {
  ARTICLE_TOPICS,
  ARTICLE_TOPIC_LABELS,
  type ArticleTopic,
} from "@/lib/content/article-topics";
import type { FeedItem } from "@/lib/content/feed";

export interface SponsorOption {
  id: string;
  name: string;
  tierLabel: string;
  featured: boolean;
}

export function Composer({
  sources = [],
  sponsors = [],
}: {
  sources?: FeedItem[];
  sponsors?: SponsorOption[];
}) {
  const router = useRouter();
  const [type, setType] = useState<CampaignType>("newsletter");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [stages, setStages] = useState<ParticipantStage[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [highlights, setHighlights] = useState("");
  const [instructions, setInstructions] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [source, setSource] = useState<"ai" | "template" | null>(null);
  const [design, setDesign] = useState<NewsletterDoc | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [sponsorIds, setSponsorIds] = useState<string[]>([]);
  const [topics, setTopics] = useState<ArticleTopic[]>([]);
  const [found, setFound] = useState<FeedItem[]>([]);
  const [finding, setFinding] = useState(false);
  const [findNote, setFindNote] = useState<string | null>(null);
  const [drafting, setDrafting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function toggle<T>(list: T[], v: T, set: (x: T[]) => void) {
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  }

  const allSources = [
    ...found,
    ...sources.filter((s) => !found.some((f) => f.url === s.url)),
  ];
  const pickedSources = allSources.filter((s) => picked.includes(s.url));

  async function findFresh() {
    setFinding(true);
    setFindNote(null);
    try {
      const res = await fetch("/api/content/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Article search failed");
      setFound(data.articles ?? []);
      // Pre-check fresh finds so one click carries them into the draft.
      setPicked((prev) => [
        ...new Set([...prev, ...(data.articles ?? []).map((a: FeedItem) => a.url)]),
      ]);
      setFindNote(
        data.source === "ai"
          ? `Found ${data.articles.length} current articles with AI web search.`
          : `Loaded ${data.articles.length} trusted resources (set ANTHROPIC_API_KEY for live search).`,
      );
    } catch (e) {
      setFindNote(e instanceof Error ? e.message : "Article search failed");
    } finally {
      setFinding(false);
    }
  }

  /** Append the chosen Benjamin Rose links to the draft as a Markdown section. */
  function insertLinks() {
    if (!pickedSources.length) { setMsg("Pick an article to insert first."); return; }
    const section =
      "\n\n## More from Benjamin Rose\n\n" +
      pickedSources
        .map((s) => `- [${s.title}](${s.url})${s.excerpt ? ` — ${s.excerpt}` : ""}`)
        .join("\n");
    setBody((b) => (b.trim() ? b.trimEnd() + section : section.trimStart()));
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
          sources: pickedSources.length ? pickedSources : undefined,
          sponsorIds: sponsorIds.length ? sponsorIds : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Draft failed");
      setBody(data.bodyMarkdown);
      if (data.subject) setSubject(data.subject);
      setSource(data.source);
      setDesign(data.design ?? null);
      setHtml(data.html ?? null);
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
          design: design ?? undefined,
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
                className={`rounded-md px-3 py-1.5 text-sm capitalize ring-1 ${type === t ? "bg-brand-rose/10 text-brand-roseink ring-brand-rose/30" : "ring-border text-muted-foreground"}`}>
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
            <select aria-label="Newsletter language" className={input} value={language} onChange={(e) => setLanguage(e.target.value as LanguageCode)}>
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

        {type === "newsletter" && sponsors.length > 0 && (
          <Card className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">🤝 Promote partners</h3>
              {sponsorIds.length > 0 && <Badge variant="gold">{sponsorIds.length} in this issue</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">
              Each selected partner gets a clearly-labeled spotlight with their real offers from the
              lender directory — names and amounts are never invented. A partner disclosure is added
              to the footer automatically.
            </p>
            <ul className="space-y-1.5">
              {sponsors.map((sp) => {
                const on = sponsorIds.includes(sp.id);
                return (
                  <li key={sp.id}>
                    <label className={`flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm ${on ? "border-brand-gold bg-brand-gold/5" : "border-border hover:bg-muted/50"}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(sponsorIds, sp.id, setSponsorIds)}
                        className="accent-brand-gold"
                      />
                      <span className="min-w-0 flex-1 font-medium">{sp.name}</span>
                      <Badge variant={sp.featured ? "gold" : "muted"}>{sp.tierLabel}</Badge>
                    </label>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}

        {(sources.length > 0 || true) && (
          <Card className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">📰 Articles &amp; reading</h3>
              {picked.length > 0 && <Badge variant="muted">{picked.length} selected</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">
              Selected items become a “Worth your time” section in the issue (and the AI can link
              them inline). Find fresh articles by topic, or use the trusted library below.
            </p>
            <div className="flex flex-wrap gap-1">
              {ARTICLE_TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggle(topics, t, setTopics)}
                  className={`rounded-full px-2 py-1 text-xs ring-1 ${topics.includes(t) ? "bg-brand-rose/10 text-brand-roseink ring-brand-rose/30" : "ring-border text-muted-foreground"}`}
                >
                  {ARTICLE_TOPIC_LABELS[t]}
                </button>
              ))}
            </div>
            <button
              onClick={findFresh}
              disabled={finding}
              className="w-full rounded-md border border-brand-rose px-4 py-2 text-sm font-medium text-brand-rose hover:bg-brand-blush disabled:opacity-60"
            >
              {finding ? "Searching…" : "🔎 Find fresh articles"}
            </button>
            {findNote && <p className="text-xs text-muted-foreground">{findNote}</p>}
            <ul className="space-y-2">
              {allSources.map((s) => {
                const on = picked.includes(s.url);
                return (
                  <li key={s.url}>
                    <label className={`flex cursor-pointer gap-2 rounded-md border p-2 text-sm ${on ? "border-brand-rose bg-brand-rose/5" : "border-border hover:bg-muted/50"}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(picked, s.url, setPicked)}
                        className="mt-0.5 accent-brand-rose"
                      />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-1.5">
                          <span className="font-medium">{s.title}</span>
                          <Badge variant="muted">{s.source}</Badge>
                        </span>
                        {s.excerpt && <span className="mt-0.5 block text-xs text-muted-foreground">{s.excerpt}</span>}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={insertLinks}
              disabled={picked.length === 0}
              className="w-full rounded-md border border-input px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              Insert {picked.length || ""} as links ↓
            </button>
          </Card>
        )}
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
          <textarea className={`${input} font-mono`} rows={design ? 8 : 12} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Your content appears here — edit freely. Markdown supported." />
          {design && (
            <p className="text-xs text-muted-foreground">
              This issue is a designed email (preview below). The text here is the plain-text
              version sent alongside it — regenerate to change the design.
            </p>
          )}
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

        {html ? (
          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email preview — exactly what clients receive
              </span>
              <Badge variant="rose">designed</Badge>
            </div>
            <iframe
              title="Newsletter preview"
              srcDoc={html}
              sandbox=""
              className="h-[640px] w-full border-0 bg-white"
            />
          </Card>
        ) : body ? (
          <Card className="p-5">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Preview</div>
            <Markdown source={body} />
          </Card>
        ) : null}
      </div>
    </div>
  );
}
