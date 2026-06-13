"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { UI } from "@/lib/learn/strings";
import { episodeForDay, HOST_LABELS, type Host } from "@/lib/learn/podcast";
import type { LearnLang } from "@/lib/learn/content";

const SPEECH_LANG: Record<LearnLang, string> = { en: "en-US", es: "es-ES", ar: "ar-SA" };

/**
 * NotebookLM-style interactive podcast, now trilingual: two hosts read the
 * day's scripted conversation in the learner's language using the browser's
 * speech synthesizer (two distinct voices where available), and the learner can
 * pause at any line to ask the AI Coach.
 */
export function PodcastPlayer({
  daySlug,
  lang,
  onAsk,
}: {
  daySlug: string;
  lang: LearnLang;
  onAsk: () => void;
}) {
  const t = (k: string) => UI[k]?.[lang] ?? UI[k]?.en ?? k;
  const [line, setLine] = useState(0);
  const [playing, setPlaying] = useState(false);
  const voicesRef = useRef<Partial<Record<Host, SpeechSynthesisVoice>>>({});

  const episode = episodeForDay(daySlug);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const playingRef = useRef(false);
  const lineRef = useRef(0);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  useEffect(() => {
    lineRef.current = line;
  }, [line]);

  // Pick two distinct voices for the selected language once available.
  useEffect(() => {
    if (!supported) return;
    const prefix = SPEECH_LANG[lang].slice(0, 2);
    const load = () => {
      const all = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith(prefix));
      if (all.length === 0) {
        voicesRef.current = {};
        return;
      }
      const female = all.find((v) =>
        /female|samantha|victoria|zira|paulina|monica|laila|google/i.test(v.name),
      );
      const male = all.find(
        (v) => /male|daniel|alex|david|mark|diego|jorge|tarik|maged/i.test(v.name) && v !== female,
      );
      voicesRef.current = { maya: female ?? all[0], devon: male ?? all[1] ?? all[0] };
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [supported, lang]);

  function stop() {
    if (supported) window.speechSynthesis.cancel();
    setPlaying(false);
  }

  // Reset when language changes mid-episode.
  useEffect(() => {
    stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!episode) return null;

  function speakFrom(start: number) {
    if (!supported || !episode) return;
    window.speechSynthesis.cancel();
    const lines = episode.lines;
    const speakAt = (i: number) => {
      if (!playingRef.current || i >= lines.length) {
        if (i >= lines.length) {
          setPlaying(false);
          setLine(0);
        }
        return;
      }
      setLine(i);
      const ln = lines[i];
      const utter = new SpeechSynthesisUtterance(ln.text[lang]);
      utter.lang = SPEECH_LANG[lang];
      const v = voicesRef.current[ln.speaker];
      if (v) utter.voice = v;
      utter.pitch = ln.speaker === "maya" ? 1.15 : 0.85;
      utter.rate = 1.0;
      utter.onend = () => speakAt(i + 1);
      utter.onerror = () => setPlaying(false);
      window.speechSynthesis.speak(utter);
    };
    speakAt(start);
  }

  function togglePlay() {
    if (playing) {
      stop();
    } else {
      setPlaying(true);
      playingRef.current = true;
      speakFrom(lineRef.current);
    }
  }

  function restart() {
    stop();
    setLine(0);
    setTimeout(() => {
      setPlaying(true);
      playingRef.current = true;
      speakFrom(0);
    }, 50);
  }

  function askAndPause() {
    stop();
    onAsk();
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎙️</span>
        <div>
          <h2 className="font-semibold leading-tight">{t("podcastTitle")}</h2>
          <p className="text-xs text-muted-foreground">{t("podcastIntro")}</p>
        </div>
      </div>

      <p className="mt-3 rounded-md bg-brand-blush px-3 py-2 text-sm font-medium text-brand-plum">
        {episode.title[lang]}
      </p>

      {!supported ? (
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Audio isn&apos;t supported in this browser. Try the Lessons tab (with the Listen button) or
          a recent version of Chrome, Edge, or Safari.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={togglePlay}
              className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-white"
            >
              {playing ? `⏸ ${t("pause")}` : `▶ ${t("play")}`}
            </button>
            <button
              onClick={restart}
              className="rounded-full border border-input px-4 py-2 text-sm hover:bg-muted"
            >
              ↺ {t("restart")}
            </button>
            <button
              onClick={askAndPause}
              className="rounded-full border border-brand-rose px-4 py-2 text-sm font-medium text-brand-rose hover:bg-brand-blush"
            >
              💬 {t("askCoachBtn")}
            </button>
          </div>

          {/* Transcript with current-line highlight; tap a line to jump */}
          <div className="mt-4 max-h-80 space-y-2 overflow-y-auto rounded-lg bg-muted/40 p-3">
            {episode.lines.map((ln, i) => (
              <p
                key={i}
                onClick={() => {
                  setLine(i);
                  if (playing) speakFrom(i);
                }}
                className={`cursor-pointer rounded-md px-2 py-1 text-sm transition ${
                  i === line ? "bg-brand-gold/20 font-medium" : "hover:bg-white/60"
                }`}
              >
                <span className={ln.speaker === "maya" ? "text-brand-rose" : "text-brand-gold"}>
                  {HOST_LABELS[ln.speaker]}:
                </span>{" "}
                {ln.text[lang]}
              </p>
            ))}
          </div>

          <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
            {lang === "es"
              ? "La calidad de las voces depende de tu navegador; algunas no tienen voces en español."
              : lang === "ar"
                ? "تعتمد جودة الأصوات على متصفحك؛ بعض المتصفحات لا توفر أصواتاً عربية."
                : "Voice quality depends on your browser's built-in voices."}
          </p>
        </>
      )}
    </Card>
  );
}
