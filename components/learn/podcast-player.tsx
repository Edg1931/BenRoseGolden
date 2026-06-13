"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { UI } from "@/lib/learn/strings";
import { DAY1_PODCAST, HOST_LABELS, type Host } from "@/lib/learn/podcast";
import type { LearnLang } from "@/lib/learn/content";

/**
 * NotebookLM-style interactive podcast: two hosts read a scripted conversation
 * using the browser's speech synthesizer (two distinct voices), and the learner
 * can pause at any line to ask the AI Coach. Audio is English; `lang` is only
 * used for the surrounding UI labels.
 */
export function PodcastPlayer({ lang, onAsk }: { lang: LearnLang; onAsk: () => void }) {
  const t = (k: string) => UI[k]?.[lang] ?? UI[k]?.en ?? k;
  const [epIndex, setEpIndex] = useState(0);
  const [line, setLine] = useState(0);
  const [playing, setPlaying] = useState(false);
  const voicesRef = useRef<Partial<Record<Host, SpeechSynthesisVoice>>>({});

  const episode = DAY1_PODCAST[epIndex];
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const playingRef = useRef(false);
  const lineRef = useRef(0);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  useEffect(() => {
    lineRef.current = line;
  }, [line]);

  // Pick two distinct English voices once they're available.
  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
      if (all.length === 0) return;
      const female = all.find((v) => /female|samantha|victoria|zira|google us english/i.test(v.name));
      const male = all.find((v) => /male|daniel|alex|david|mark/i.test(v.name) && v !== female);
      voicesRef.current = {
        maya: female ?? all[0],
        devon: male ?? all[1] ?? all[0],
      };
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [supported]);

  function stop() {
    if (supported) window.speechSynthesis.cancel();
    setPlaying(false);
  }

  // Reset when switching episodes.
  useEffect(() => {
    stop();
    setLine(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epIndex]);

  // Cleanup on unmount.
  useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  function speakFrom(start: number) {
    if (!supported) return;
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
      const utter = new SpeechSynthesisUtterance(ln.text);
      utter.lang = "en-US";
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

      {/* Episode picker */}
      <div className="mt-4 flex flex-wrap gap-2">
        {DAY1_PODCAST.map((ep, i) => (
          <button
            key={ep.section}
            onClick={() => setEpIndex(i)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              i === epIndex ? "bg-brand-rose text-white" : "border border-input hover:bg-muted"
            }`}
          >
            {ep.title}
          </button>
        ))}
      </div>

      {!supported ? (
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Audio isn&apos;t supported in this browser. Try the Lessons tab (with the Listen button) or
          a recent version of Chrome, Edge, or Safari.
        </p>
      ) : (
        <>
          {/* Controls */}
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
              className="rounded-full border border-brand-rose px-4 py-2 text-sm font-medium text-brand-rose hover:bg-brand-rose/10"
            >
              💬 {t("askCoachBtn")}
            </button>
          </div>

          {/* Transcript with current-line highlight */}
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
                {ln.text}
              </p>
            ))}
          </div>
        </>
      )}

      <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
        {t("podcastEnglishNote")}
      </p>
    </Card>
  );
}
