"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { UI } from "@/lib/learn/strings";
import { speakText, type Speaking } from "@/lib/learn/speak";
import type { LearnLang } from "@/lib/learn/content";

const LISTEN_LABEL: Record<LearnLang, string> = { en: "Listen", es: "Escuchar", ar: "استماع" };
const STOP_LABEL: Record<LearnLang, string> = { en: "Stop", es: "Detener", ar: "إيقاف" };

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED: Record<LearnLang, string[]> = {
  en: [
    "What's the difference between fixed and variable expenses?",
    "Why is payment history so important for my credit score?",
    "How do I keep my credit utilization low?",
  ],
  es: [
    "¿Cuál es la diferencia entre gastos fijos y variables?",
    "¿Por qué es tan importante el historial de pagos para mi crédito?",
    "¿Cómo mantengo bajo el uso de mi crédito?",
  ],
  ar: [
    "ما الفرق بين المصروفات الثابتة والمتغيّرة؟",
    "لماذا يُعدّ سجلّ المدفوعات مهماً جداً لدرجتي الائتمانية؟",
    "كيف أُبقي معدّل استخدام ائتماني منخفضاً؟",
  ],
};

/** Grounded chat with the Day 1 AI Coach. Reusable from the Coach tab and the
 *  podcast "pause & ask" flow. */
export function CoachPanel({ lang }: { lang: LearnLang }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const speakingRef = useRef<Speaking | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = (k: string) => UI[k]?.[lang] ?? UI[k]?.en ?? k;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  // Stop any narration on unmount.
  useEffect(() => () => speakingRef.current?.stop(), []);

  async function toggleSpeak(i: number, text: string) {
    speakingRef.current?.stop();
    if (speakingIdx === i) { setSpeakingIdx(null); return; }
    setSpeakingIdx(i);
    speakingRef.current = await speakText(text, lang, () => setSpeakingIdx((cur) => (cur === i ? null : cur)));
  }

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    setErr(null);
    const history = messages;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/learn/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Coach is unavailable.");
      setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Coach is unavailable.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="flex h-[32rem] flex-col p-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <span className="text-2xl">🤖</span>
        <div>
          <h2 className="font-semibold leading-tight">{t("coachTitle")}</h2>
          <p className="text-xs text-muted-foreground">{t("coachIntro")}</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto py-3">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("suggested")}
            </p>
            {SUGGESTED[lang].map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="block w-full rounded-md border border-input px-3 py-2 text-start text-sm hover:bg-muted/50"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm ${
                m.role === "user"
                  ? "bg-brand-rose text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.content}
            </div>
            {m.role === "assistant" && (
              <button
                onClick={() => toggleSpeak(i, m.content)}
                aria-pressed={speakingIdx === i}
                className="ml-1 text-xs font-medium text-brand-rose hover:underline"
              >
                {speakingIdx === i ? `⏹ ${STOP_LABEL[lang]}` : `🔊 ${LISTEN_LABEL[lang]}`}
              </button>
            )}
          </div>
        ))}

        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-muted px-3.5 py-2 text-sm text-muted-foreground">
              {t("coachThinking")}
            </div>
          </div>
        )}
        {err && <p className="text-sm text-red-700">{err}</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2 border-t border-border pt-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("coachPlaceholder")}
          className="flex-1 rounded-md border border-input px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {t("send")}
        </button>
      </form>
      <p className="mt-2 text-[11px] leading-snug text-muted-foreground">{t("coachDisclaimer")}</p>
    </Card>
  );
}
