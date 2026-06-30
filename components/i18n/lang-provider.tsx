"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LEARN_LANGS, dirFor, type LearnLang } from "@/lib/learn/content";

/**
 * Public-funnel language state (English / Spanish / Arabic), shared across the
 * marketing pages, the learner sign-up/sign-in, and the assistance finder — so a
 * non-English speaker can pick their language at the front door, not just inside
 * the lessons. Persisted to localStorage + a cookie; sets `dir` for Arabic RTL.
 */

export const PUBLIC_LANG_LABELS: Record<LearnLang, string> = {
  en: "English",
  es: "Español",
  ar: "العربية",
};

interface LangContext {
  lang: LearnLang;
  setLang: (l: LearnLang) => void;
  dir: "ltr" | "rtl";
}

const Ctx = createContext<LangContext>({ lang: "en", setLang: () => {}, dir: "ltr" });

export function useLang() {
  return useContext(Ctx);
}

const STORAGE_KEY = "br_lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LearnLang>("en");

  // Hydrate from a prior choice (localStorage), after mount to avoid SSR mismatch.
  useEffect(() => {
    const saved = (typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY)) as
      | LearnLang
      | null;
    if (saved && (LEARN_LANGS as readonly string[]).includes(saved)) setLangState(saved);
  }, []);

  function setLang(l: LearnLang) {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
      document.cookie = `${STORAGE_KEY}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    } catch {
      /* ignore */
    }
  }

  const dir = dirFor(lang);

  return (
    <Ctx.Provider value={{ lang, setLang, dir }}>
      <div dir={dir} lang={lang}>
        {children}
      </div>
    </Ctx.Provider>
  );
}
