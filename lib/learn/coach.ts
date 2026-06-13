import Anthropic from "@anthropic-ai/sdk";
import { LEARN_LANG_LABELS } from "./content";
import type { LearnLang, Lesson } from "./content";
import { COURSE_DAYS } from "./course";

/**
 * "Ask AI Coach" for the learner course — a friendly tutor grounded ONLY in the
 * 4-day course material, to help learners understand concepts and prepare for
 * the day tests. Mirrors lib/content/agent.ts: uses Claude when
 * ANTHROPIC_API_KEY is set, and falls back to a local retrieval answer so the
 * feature always works.
 */

const ALL_LESSONS: { lesson: Lesson; sectionTitle: string }[] = COURSE_DAYS.flatMap((d) =>
  d.lessons.map((lesson) => ({
    lesson,
    sectionTitle: d.sections[lesson.section]?.en ?? d.title,
  })),
);

const MODEL = "claude-sonnet-4-6";

export function isCoachConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CoachReply {
  answer: string;
  source: "ai" | "local";
}

/** Plain-text knowledge base built from all course lessons (English source). */
function knowledgeBase(): string {
  return ALL_LESSONS.map(({ lesson: l, sectionTitle }) => {
    const terms = l.keyTerms.map((k) => `${k.term.en}: ${k.def.en}`).join("; ");
    return [
      `## ${sectionTitle} — ${l.title.en}`,
      l.body.map((p) => p.en).join(" "),
      terms ? `Key terms: ${terms}` : "",
      `Why it matters: ${l.whyItMatters.en}`,
    ]
      .filter(Boolean)
      .join("\n");
  }).join("\n\n");
}

function systemPrompt(lang: LearnLang): string {
  const langName = LEARN_LANG_LABELS[lang];
  return `You are "Coach," a warm, patient tutor for Benjamin Rose's free HUD-approved homebuyer education course. You help learners understand the 4-day curriculum (money management & credit; mortgages & rights; shopping & inspection; insurance & maintenance) and prepare for the day tests.

Rules:
- Answer ONLY using the course material below. If a question falls outside it (e.g., specific legal, tax, or personal financial advice), gently say it's beyond the class and point them to a Benjamin Rose counselor.
- Use plain, encouraging language. Short paragraphs. Many learners are first-time buyers or reading in a second language.
- Do NOT give away quiz answers verbatim or tell them exactly which option to pick. Instead, teach the underlying concept so they can answer confidently themselves.
- Reply in ${langName}.
- Keep replies concise (usually under 120 words) unless asked to explain more.

DAY 1 COURSE MATERIAL:
${knowledgeBase()}`;
}

export async function askCoach(
  question: string,
  history: CoachMessage[],
  lang: LearnLang,
): Promise<CoachReply> {
  if (!isCoachConfigured()) {
    return { answer: localAnswer(question, lang), source: "local" };
  }

  const client = new Anthropic();
  const messages: Anthropic.MessageParam[] = [
    ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: question },
  ];

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    system: systemPrompt(lang),
    messages,
  });

  const answer = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  return { answer: answer || localAnswer(question, lang), source: "ai" };
}

/**
 * Local fallback: pick the most relevant course lesson by keyword overlap and
 * answer from it. Not as fluid as the AI, but always grounded and on-topic.
 */
function localAnswer(question: string, lang: LearnLang): string {
  const q = question.toLowerCase();
  const words = new Set(q.match(/[a-z]{4,}/g) ?? []);
  let best = ALL_LESSONS[0].lesson;
  let bestScore = -1;
  for (const { lesson } of ALL_LESSONS) {
    const hay = (
      lesson.title.en +
      " " +
      lesson.body.map((p) => p.en).join(" ") +
      " " +
      lesson.keyTerms.map((k) => k.term.en + " " + k.def.en).join(" ")
    ).toLowerCase();
    let score = 0;
    for (const w of words) if (hay.includes(w)) score++;
    if (score > bestScore) {
      bestScore = score;
      best = lesson;
    }
  }
  const body = best.body.map((p) => p[lang]).join(" ");
  const prefix: Record<LearnLang, string> = {
    en: `Here's what the course covers on "${best.title.en}":`,
    es: `Esto es lo que el curso explica sobre "${best.title.es}":`,
    ar: `إليك ما يشرحه الكورس حول «${best.title.ar}»:`,
  };
  const suffix: Record<LearnLang, string> = {
    en: "\n\n(Add an ANTHROPIC_API_KEY to enable the full AI Coach for personalized answers.)",
    es: "\n\n(Agrega una ANTHROPIC_API_KEY para activar el Coach de IA completo con respuestas personalizadas.)",
    ar: "\n\n(أضِف ANTHROPIC_API_KEY لتفعيل مدرّب الذكاء الاصطناعي الكامل للحصول على إجابات مخصّصة.)",
  };
  return `${prefix[lang]} ${body}${suffix[lang]}`;
}
