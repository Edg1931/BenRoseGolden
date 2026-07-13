/**
 * One-time podcast audio generator (ElevenLabs).
 *
 * The podcast scripts (lib/learn/podcast.ts) are STATIC, so we render them to
 * audio once instead of calling a TTS API on every play. This walks every
 * episode × language × line, synthesizes each line with the right host voice,
 * and writes MP3s the player serves as static files:
 *
 *     public/podcast/<daySlug>/<lang>/<lineIndex>.mp3
 *     public/podcast/manifest.json   (what's available, so the player knows)
 *
 * It's idempotent: existing files are skipped, so you can re-run to fill gaps or
 * regenerate a single language (delete that folder first).
 *
 * Setup:
 *   1. npm i                       (installs tsx)
 *   2. In .env.local set:
 *        ELEVENLABS_API_KEY=...
 *        ELEVENLABS_MAYA_VOICE_ID=...     (a warm female voice)
 *        ELEVENLABS_DEVON_VOICE_ID=...    (a male voice)
 *      (optional) ELEVENLABS_MODEL=eleven_multilingual_v2   ← supports EN/ES/AR
 *   3. npm run gen:podcast
 *
 * Cost: the whole library is a few thousand characters × 3 languages — a one-time
 * generation well within ElevenLabs' free/Starter tier. After that it's $0 to
 * serve (static files).
 */

import { mkdir, writeFile, access } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PODCAST_EPISODES, type Host } from "../lib/learn/podcast";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "podcast");
const LANGS = ["en", "es", "ar"] as const;

// Load .env.local if present (no dependency — tiny parser).
try {
  for (const line of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* no .env.local — rely on the process env */
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
const MODEL = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
const VOICE: Record<Host, string | undefined> = {
  maya: process.env.ELEVENLABS_MAYA_VOICE_ID,
  devon: process.env.ELEVENLABS_DEVON_VOICE_ID,
};

if (!API_KEY || !VOICE.maya || !VOICE.devon) {
  console.error(
    "Missing config. Set ELEVENLABS_API_KEY, ELEVENLABS_MAYA_VOICE_ID and " +
      "ELEVENLABS_DEVON_VOICE_ID in .env.local (see script header).",
  );
  process.exit(1);
}

const exists = (p: string) => access(p).then(() => true).catch(() => false);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function synthesize(text: string, host: Host): Promise<Buffer> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE[host]}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": API_KEY!, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({
        text,
        model_id: MODEL,
        // A touch of style variation makes the two hosts feel distinct.
        voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.15 },
      }),
    },
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const manifest: Record<string, Record<string, number>> = {};
  let made = 0;
  let skipped = 0;

  for (const ep of PODCAST_EPISODES) {
    manifest[ep.daySlug] = {};
    for (const lang of LANGS) {
      const dir = join(OUT, ep.daySlug, lang);
      await mkdir(dir, { recursive: true });
      for (let i = 0; i < ep.lines.length; i++) {
        const file = join(dir, `${i}.mp3`);
        if (await exists(file)) {
          skipped++;
          continue;
        }
        const line = ep.lines[i];
        process.stdout.write(`→ ${ep.daySlug}/${lang}/${i} (${line.speaker})… `);
        const audio = await synthesize(line.text[lang], line.speaker);
        await writeFile(file, audio);
        made++;
        console.log("ok");
        await sleep(250); // be gentle with rate limits
      }
      manifest[ep.daySlug][lang] = ep.lines.length;
    }
  }

  await writeFile(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\nDone. ${made} generated, ${skipped} already present. Manifest written.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
