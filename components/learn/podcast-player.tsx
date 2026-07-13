"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { UI } from "@/lib/learn/strings";
import { episodeForDay, HOST_LABELS, type Host } from "@/lib/learn/podcast";
import type { LearnLang } from "@/lib/learn/content";

const SPEECH_LANG: Record<LearnLang, string> = { en: "en-US", es: "es-ES", ar: "ar-SA" };

type PodcastManifest = Record<string, Record<string, number>>;

/**
 * NotebookLM-style interactive podcast. When pre-generated ElevenLabs audio is
 * present (public/podcast/<day>/<lang>/<i>.mp3, listed in manifest.json) the two
 * hosts play back in studio-quality voices — consistent across English, Spanish,
 * and Arabic. When it isn't, we fall back to the browser's speech synthesizer so
 * the feature always works. Either way the learner can pause at any line to ask
 * the AI Coach.
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
  const [useFiles, setUseFiles] = useState(false);
  const voicesRef = useRef<Partial<Record<Host, SpeechSynthesisVoice>>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const useFilesRef = useRef(false);

  const episode = episodeForDay(daySlug);
  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  const playingRef = useRef(false);
  const lineRef = useRef(0);
  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { lineRef.current = line; }, [line]);
  useEffect(() => { useFilesRef.current = useFiles; }, [useFiles]);

  // One reusable audio element for file playback.
  useEffect(() => {
    audioRef.current = typeof Audio !== "undefined" ? new Audio() : null;
    return () => audioRef.current?.pause();
  }, []);

  // Is pre-generated audio available for this day + language? (manifest is
  // written by scripts/generate-podcast-audio.ts; absent until it's run.)
  useEffect(() => {
    let cancelled = false;
    setUseFiles(false);
    if (!episode) return;
    fetch("/podcast/manifest.json", { cache: "force-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((m: PodcastManifest | null) => {
        if (!cancelled && m && m[daySlug]?.[lang] === episode.lines.length) setUseFiles(true);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [daySlug, lang, episode]);

  // Pick two distinct voices for the browser-speech fallback.
  useEffect(() => {
    if (!speechSupported) return;
    const prefix = SPEECH_LANG[lang].slice(0, 2);
    const load = () => {
      const all = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith(prefix));
      if (all.length === 0) { voicesRef.current = {}; return; }
      const quality = (v: SpeechSynthesisVoice) =>
        /natural|neural|google|premium|enhanced|siri|samantha|aaron|allison|ava|zoe/i.test(v.name) ? 1 : 0;
      const ranked = [...all].sort((a, b) => quality(b) - quality(a));
      const female = ranked.find((v) =>
        /female|samantha|victoria|zira|paulina|monica|laila|ava|allison|zoe|joanna|aria/i.test(v.name));
      const male = ranked.find((v) =>
        /male|daniel|alex|aaron|david|mark|diego|jorge|tarik|maged|guy|matthew/i.test(v.name) && v !== female);
      voicesRef.current = {
        maya: female ?? ranked[0],
        devon: male ?? ranked.find((v) => v !== (female ?? ranked[0])) ?? ranked[0],
      };
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [speechSupported, lang]);

  function stop() {
    if (speechSupported) window.speechSynthesis.cancel();
    audioRef.current?.pause();
    setPlaying(false);
  }

  useEffect(() => { stop(); /* reset on language change */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);
  useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const canPlay = useFiles || speechSupported;
  if (!episode) return null;

  function speakLineViaSpeech(i: number, done: () => void) {
    if (!speechSupported || !episode) { done(); return; }
    const ln = episode.lines[i];
    const utter = new SpeechSynthesisUtterance(ln.text[lang]);
    utter.lang = SPEECH_LANG[lang];
    const v = voicesRef.current[ln.speaker];
    if (v) utter.voice = v;
    utter.pitch = ln.speaker === "maya" ? 1.08 : 0.92;
    utter.rate = 0.96;
    utter.onend = () => { if (playingRef.current) done(); };
    utter.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utter);
  }

  function speakFrom(start: number) {
    if (!episode) return;
    if (speechSupported) window.speechSynthesis.cancel();
    audioRef.current?.pause();
    const lines = episode.lines;

    const step = (i: number) => {
      if (!playingRef.current || i >= lines.length) {
        if (i >= lines.length) { setPlaying(false); setLine(0); }
        return;
      }
      setLine(i);
      const prev = i > 0 ? lines[i - 1] : null;
      const gap = prev && prev.speaker !== lines[i].speaker ? 260 : 90;
      const next = () => { if (playingRef.current) window.setTimeout(() => step(i + 1), gap); };

      if (useFilesRef.current && audioRef.current) {
        const a = audioRef.current;
        a.src = `/podcast/${daySlug}/${lang}/${i}.mp3`;
        a.onended = next;
        // If a clip is missing/unplayable, fall back to speech for that line.
        a.onerror = () => speakLineViaSpeech(i, next);
        a.play().catch(() => speakLineViaSpeech(i, next));
      } else {
        speakLineViaSpeech(i, next);
      }
    };
    step(start);
  }

  function togglePlay() {
    if (playing) { stop(); return; }
    setPlaying(true);
    playingRef.current = true;
    speakFrom(lineRef.current);
  }

  function restart() {
    stop();
    setLine(0);
    setTimeout(() => { setPlaying(true); playingRef.current = true; speakFrom(0); }, 50);
  }

  function askAndPause() { stop(); onAsk(); }

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

      {!canPlay ? (
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Audio isn&apos;t supported in this browser. Try a recent version of Chrome, Edge, or Safari.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button onClick={togglePlay} className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-white">
              {playing ? `⏸ ${t("pause")}` : `▶ ${t("play")}`}
            </button>
            <button onClick={restart} className="rounded-full border border-input px-4 py-2 text-sm hover:bg-muted">
              ↺ {t("restart")}
            </button>
            <button onClick={askAndPause} className="rounded-full border border-brand-rose px-4 py-2 text-sm font-medium text-brand-rose hover:bg-brand-blush">
              💬 {t("askCoachBtn")}
            </button>
            {useFiles && <span className="text-[11px] text-muted-foreground">🎧 Studio voices</span>}
          </div>

          <div className="mt-4 max-h-80 space-y-2 overflow-y-auto rounded-lg bg-muted/40 p-3">
            {episode.lines.map((ln, i) => (
              <p
                key={i}
                onClick={() => { setLine(i); if (playing) speakFrom(i); }}
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

          {!useFiles && (
            <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
              {lang === "es"
                ? "La calidad de las voces depende de tu navegador; algunas no tienen voces en español."
                : lang === "ar"
                  ? "تعتمد جودة الأصوات على متصفحك؛ بعض المتصفحات لا توفر أصواتاً عربية."
                  : "Voice quality depends on your browser's built-in voices."}
            </p>
          )}
        </>
      )}
    </Card>
  );
}
