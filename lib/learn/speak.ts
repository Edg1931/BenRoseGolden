import type { LearnLang } from "./content";

/**
 * Speak arbitrary text aloud, preferring the good ElevenLabs voice (via
 * /api/learn/tts) and falling back to the browser's speech synthesizer when TTS
 * isn't configured or the request fails. Returns a handle to stop playback.
 */

const SPEECH_LANG: Record<LearnLang, string> = { en: "en-US", es: "es-ES", ar: "ar-SA" };

export interface Speaking {
  stop: () => void;
}

function speakViaBrowser(text: string, lang: LearnLang, onEnd?: () => void): Speaking {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return { stop: () => {} };
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = SPEECH_LANG[lang];
  u.rate = 0.98;
  u.onend = () => onEnd?.();
  window.speechSynthesis.speak(u);
  return { stop: () => window.speechSynthesis.cancel() };
}

export async function speakText(text: string, lang: LearnLang, onEnd?: () => void): Promise<Speaking> {
  try {
    const res = await fetch("/api/learn/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    });
    if (res.ok) {
      const url = URL.createObjectURL(await res.blob());
      const audio = new Audio(url);
      const cleanup = () => URL.revokeObjectURL(url);
      audio.onended = () => { cleanup(); onEnd?.(); };
      audio.onerror = () => { cleanup(); onEnd?.(); };
      await audio.play();
      return { stop: () => { audio.pause(); cleanup(); } };
    }
  } catch {
    /* fall through to the browser voice */
  }
  return speakViaBrowser(text, lang, onEnd);
}
