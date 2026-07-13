import { NextResponse } from "next/server";

/**
 * On-demand text-to-speech for DYNAMIC text (the AI Coach's answers, a "Listen"
 * button on arbitrary content). Proxies ElevenLabs server-side so the API key is
 * never exposed. Static podcast audio does NOT use this route — it's
 * pre-generated (scripts/generate-podcast-audio.ts) to avoid per-play cost.
 *
 * Returns 503 when TTS isn't configured; the client falls back to the browser's
 * speech synthesizer, so the feature degrades gracefully.
 */

export const runtime = "nodejs";

const MODEL = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
// Reuse Maya's voice as the default narrator unless a dedicated one is set.
const VOICE = process.env.ELEVENLABS_NARRATOR_VOICE_ID || process.env.ELEVENLABS_MAYA_VOICE_ID;

export async function POST(request: Request) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key || !VOICE) {
    return NextResponse.json({ error: "TTS not configured" }, { status: 503 });
  }

  let text: unknown;
  try {
    ({ text } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
      // Cap length to bound cost/latency on a single request.
      body: JSON.stringify({ text: text.slice(0, 2500), model_id: MODEL }),
    },
  );

  if (!res.ok || !res.body) {
    return NextResponse.json({ error: "TTS upstream failed" }, { status: 502 });
  }

  return new Response(res.body, {
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "private, max-age=86400" },
  });
}
