"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LANGUAGES, LANGUAGE_LABELS, type LanguageCode } from "@/lib/participants/curriculum";
import { LENDER_TIER_LABELS, LOAN_TYPE_LABELS, type Lender } from "@/lib/lenders/schema";

const TIER_TONE = { featured: "rose", preferred: "gold", standard: "muted" } as const;

export function LendersDirectory({ lenders }: { lenders: Lender[] }) {
  const [q, setQ] = useState("");
  const [language, setLanguage] = useState("");
  const [tier, setTier] = useState("");

  const filtered = useMemo(() => {
    const needle = q.toLowerCase().trim();
    return lenders.filter((l) => {
      const matchesQ =
        !needle ||
        l.institutionName.toLowerCase().includes(needle) ||
        (l.contactName ?? "").toLowerCase().includes(needle) ||
        (l.address?.city ?? "").toLowerCase().includes(needle);
      const matchesLang = !language || l.languages.includes(language as LanguageCode);
      const matchesTier = !tier || l.tier === tier;
      return matchesQ && matchesLang && matchesTier;
    });
  }, [lenders, q, language, tier]);

  const sel = "rounded-md border border-input bg-background px-2 py-2 text-sm";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search institution, officer, city…"
          className="w-full min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm sm:w-auto sm:min-w-[16rem]"
        />
        <select className={sel} value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="">Any language</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>
          ))}
        </select>
        <select className={sel} value={tier} onChange={(e) => setTier(e.target.value)}>
          <option value="">All tiers</option>
          {Object.entries(LENDER_TIER_LABELS).map(([v, label]) => (
            <option key={v} value={v}>{label}</option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">{filtered.length} of {lenders.length}</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((l) => (
          <Link key={l.id} href={`/lenders/${l.id}`} className="block">
            <Card className="h-full space-y-2 p-4 transition hover:border-brand-rose hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-medium leading-tight">{l.institutionName}</h3>
                  {l.contactName && <p className="text-xs text-muted-foreground">{l.contactName}{l.title ? ` · ${l.title}` : ""}</p>}
                </div>
                <Badge variant={TIER_TONE[l.tier]}>{LENDER_TIER_LABELS[l.tier]}</Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {l.languages.map((lang) => (
                  <span key={lang} className="rounded-full bg-brand-blush px-2 py-0.5 text-[11px] text-brand-roseink">
                    🗣 {LANGUAGE_LABELS[lang]}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 text-[11px] text-muted-foreground">
                {l.loanTypes.map((lt) => (
                  <span key={lt} className="rounded bg-muted px-1.5 py-0.5">{LOAN_TYPE_LABELS[lt]}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {l.address?.city ?? "—"} · {l.programs.length} program{l.programs.length === 1 ? "" : "s"}
                {l.advertising ? " · 💵 advertising" : ""}
                {!l.active ? " · inactive" : ""}
              </p>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">No lenders match your filters.</p>
        )}
      </div>
    </div>
  );
}
