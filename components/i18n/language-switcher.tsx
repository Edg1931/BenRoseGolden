"use client";

import { LEARN_LANGS } from "@/lib/learn/content";
import { PUBLIC_LANG_LABELS, useLang } from "./lang-provider";

/** Compact EN / ES / العربية selector for the public funnel header. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-md border border-border p-0.5 text-xs ${className ?? ""}`}
      role="group"
      aria-label="Choose language"
    >
      {LEARN_LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={PUBLIC_LANG_LABELS[l]}
          className={`rounded px-2 py-1 font-medium transition ${
            lang === l ? "bg-brand-rose text-white" : "text-muted-foreground hover:bg-muted"
          }`}
          title={PUBLIC_LANG_LABELS[l]}
        >
          {l === "en" ? "EN" : l === "es" ? "ES" : "ع"}
        </button>
      ))}
    </div>
  );
}
