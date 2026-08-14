"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CONTENT_FORMATS,
  CONTENT_FORMAT_LABELS,
  LANGUAGE_LABELS,
  LANGUAGES,
  type ContentFormat,
  type LanguageCode,
} from "@/lib/participants/curriculum";
import type { ContentItem } from "@/lib/content/schema";

/** Where a content item opens: its own asset URL, the class that teaches it, or
 *  the class catalog — so every card is clickable to the real thing. */
function linkFor(item: ContentItem, moduleDay: Record<string, string>): { href: string; external: boolean; label: string } {
  if (item.url) return { href: item.url, external: true, label: "Open asset ↗" };
  const day = item.moduleId ? moduleDay[item.moduleId] : undefined;
  if (day) return { href: `/learn/${day}`, external: false, label: "Open the class →" };
  return { href: "/classes", external: false, label: "View in Classes →" };
}

export function ContentLibrary({ items, moduleDay = {} }: { items: ContentItem[]; moduleDay?: Record<string, string> }) {
  const [format, setFormat] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.toLowerCase().trim();
    return items.filter(
      (it) =>
        (!format || it.format === (format as ContentFormat)) &&
        (!language || it.language === (language as LanguageCode)) &&
        (!needle || it.title.toLowerCase().includes(needle) || it.summary.toLowerCase().includes(needle)),
    );
  }, [items, format, language, q]);

  const select = "rounded-md border border-input bg-background px-2 py-2 text-sm";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search content…" className="w-full min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm sm:w-auto sm:min-w-[14rem]" />
        <select aria-label="Filter by format" className={select} value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="">All formats</option>
          {CONTENT_FORMATS.map((f) => <option key={f} value={f}>{CONTENT_FORMAT_LABELS[f]}</option>)}
        </select>
        <select aria-label="Filter by language" className={select} value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="">All languages</option>
          {LANGUAGES.map((l) => <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>)}
        </select>
        <span className="text-sm text-muted-foreground">{filtered.length} items</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((it) => {
          const link = linkFor(it, moduleDay);
          const inner = (
            <Card className="flex h-full flex-col gap-2 p-4 transition hover:border-brand-rose hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium leading-tight">{it.title}</h3>
                <Badge variant="gold">{CONTENT_FORMAT_LABELS[it.format]}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{it.summary}</p>
              <div className="mt-auto flex flex-wrap items-center gap-1 text-xs">
                <Badge variant="muted">{LANGUAGE_LABELS[it.language]}</Badge>
                {it.durationMin && <Badge variant="muted">{it.durationMin} min</Badge>}
                {it.tags.map((t) => <span key={t} className="text-muted-foreground">#{t}</span>)}
              </div>
              <span className="text-sm font-medium text-brand-rose">{link.label}</span>
            </Card>
          );
          return link.external ? (
            <a key={it.id} href={link.href} target="_blank" rel="noopener noreferrer">{inner}</a>
          ) : (
            <Link key={it.id} href={link.href}>{inner}</Link>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No content matches.</p>
        )}
      </div>
    </div>
  );
}
