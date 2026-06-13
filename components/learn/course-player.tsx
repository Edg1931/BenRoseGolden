"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { CoachPanel } from "@/components/learn/coach-panel";
import { PodcastPlayer } from "@/components/learn/podcast-player";
import { BudgetCalculator } from "@/components/learn/budget-calculator";
import {
  DAY1_LESSONS,
  DAY1_SECTIONS,
  LEARN_LANGS,
  LEARN_LANG_LABELS,
  dirFor,
  type LearnLang,
} from "@/lib/learn/content";
import { UI, fill } from "@/lib/learn/strings";
import { DAY1_QUIZ_I18N } from "@/lib/learn/quiz";
import type { PublicQuizQuestion } from "@/lib/participants/quiz";

type Tab = "lessons" | "podcast" | "coach";
type Phase = "lessons" | "testIntro" | "test" | "done";

interface Outcome {
  result: { score: number; correct: number; total: number; passed: boolean };
  certificateId: string | null;
}

const SPEECH_LANG: Record<LearnLang, string> = { en: "en-US", es: "es-ES", ar: "ar-SA" };

/** A small illustrative icon per lesson, for visual interest. */
const LESSON_ICON: Record<string, string> = {
  "budgeting-spending-plan": "📋",
  "budgeting-know-expenses": "🧾",
  "budgeting-good-habits": "🌱",
  "budgeting-money-tight": "⚖️",
  "credit-what-is-report": "📄",
  "credit-whats-in-report": "🔍",
  "credit-score-factors": "📊",
  "credit-build-protect": "🛡️",
};

export function CoursePlayer({ questions }: { questions: PublicQuizQuestion[] }) {
  const [lang, setLang] = useState<LearnLang>("en");
  const [tab, setTab] = useState<Tab>("lessons");
  const [phase, setPhase] = useState<Phase>("lessons");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [name, setName] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  const dir = dirFor(lang);
  const t = (key: string) => UI[key]?.[lang] ?? UI[key]?.en ?? key;

  const lessons = DAY1_LESSONS;
  const lesson = lessons[index];

  const stopAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  };
  useEffect(() => stopAudio(), [lang, index, phase, tab]);
  useEffect(() => () => stopAudio(), []);

  // Track read lessons for XP.
  useEffect(() => {
    if (tab === "lessons" && phase === "lessons" && lesson) {
      setViewed((v) => (v.has(lesson.id) ? v : new Set(v).add(lesson.id)));
    }
  }, [tab, phase, lesson]);

  const xp = viewed.size * 10 + (outcome?.result.passed ? 50 : 0);

  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  function toggleAudio() {
    if (!speechSupported || !lesson) return;
    if (speaking) {
      stopAudio();
      return;
    }
    const parts = [
      lesson.title[lang],
      ...lesson.body.map((p) => p[lang]),
      UI.whyItMatters[lang],
      lesson.whyItMatters[lang],
    ];
    const utter = new SpeechSynthesisUtterance(parts.join(". "));
    utter.lang = SPEECH_LANG[lang];
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  }

  async function submitTest() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/learn/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not submit test");
      setOutcome(data as Outcome);
      setPhase("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not submit test");
    } finally {
      setBusy(false);
    }
  }

  function retake() {
    setOutcome(null);
    setAnswers({});
    setPhase("test");
  }

  const allAnswered = questions.every((q) => answers[q.id] != null);
  const todayStr = useMemo(
    () => new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
    [],
  );

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "lessons", label: t("tabLessons"), icon: "📖" },
    { id: "podcast", label: t("tabPodcast"), icon: "🎙️" },
    { id: "coach", label: t("tabCoach"), icon: "🤖" },
  ];

  return (
    <div dir={dir} className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Top bar: back + XP + language switcher */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/learn" className="text-sm text-muted-foreground hover:text-foreground">
          ← {t("continueLater")}
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-gold/15 px-2.5 py-1 text-xs font-semibold text-brand-gold">
            ⭐ {xp} {t("xp")}
          </span>
          <div className="flex items-center gap-1.5">
            {LEARN_LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-md px-2.5 py-1 text-sm ${
                  l === lang ? "bg-brand-rose text-white" : "border border-input hover:bg-muted"
                }`}
              >
                {LEARN_LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-lg bg-muted p-1 print:hidden">
        {TABS.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
              tab === tb.id ? "bg-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="me-1">{tb.icon}</span>
            {tb.label}
          </button>
        ))}
      </div>

      {/* ── PODCAST TAB ─────────────────────────────────────────────────── */}
      {tab === "podcast" && <PodcastPlayer lang={lang} onAsk={() => setTab("coach")} />}

      {/* ── COACH TAB ───────────────────────────────────────────────────── */}
      {tab === "coach" && <CoachPanel lang={lang} />}

      {/* ── LESSONS TAB ─────────────────────────────────────────────────── */}
      {tab === "lessons" && (
        <>
          {phase === "lessons" && lesson && (
            <div>
              <Progress current={index + 1} total={lessons.length} />
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-rose">
                {DAY1_SECTIONS[lesson.section][lang]}
              </p>
              <div className="mt-1 flex items-start justify-between gap-3">
                <h1 className="text-2xl font-bold">
                  <span className="me-2">{LESSON_ICON[lesson.id]}</span>
                  {lesson.title[lang]}
                </h1>
                {speechSupported && (
                  <button
                    onClick={toggleAudio}
                    className="shrink-0 rounded-full border border-input px-3 py-1.5 text-sm hover:bg-muted"
                    aria-pressed={speaking}
                  >
                    {speaking ? `⏹ ${t("stop")}` : `🔊 ${t("listen")}`}
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-4 text-[17px] leading-relaxed">
                {lesson.body.map((p, i) => (
                  <p key={i}>{p[lang]}</p>
                ))}
              </div>

              {lesson.keyTerms.length > 0 && (
                <Card className="mt-6 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("keyTerms")}
                  </p>
                  <dl className="mt-2 space-y-2">
                    {lesson.keyTerms.map((kt, i) => (
                      <div key={i}>
                        <dt className="font-semibold">{kt.term[lang]}</dt>
                        <dd className="text-sm text-muted-foreground">{kt.def[lang]}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              )}

              {/* Interactive block: budget calculator on the budgeting wrap-up lesson */}
              {lesson.id === "budgeting-money-tight" && <BudgetCalculator lang={lang} />}

              <div className="mt-4 rounded-lg border-s-4 border-brand-gold bg-brand-gold/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                  {t("whyItMatters")}
                </p>
                <p className="mt-1">{lesson.whyItMatters[lang]}</p>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {fill(UI.lessonProgress[lang], { n: index + 1, total: lessons.length })}
              </p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <button
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  disabled={index === 0}
                  className="rounded-md border border-input px-4 py-2 text-sm hover:bg-muted disabled:opacity-40"
                >
                  ← {t("back")}
                </button>
                {index < lessons.length - 1 ? (
                  <button
                    onClick={() => setIndex((i) => i + 1)}
                    className="rounded-md bg-foreground px-5 py-2 text-sm font-medium text-white"
                  >
                    {t("next")} →
                  </button>
                ) : (
                  <button
                    onClick={() => setPhase("testIntro")}
                    className="rounded-md bg-brand-rose px-5 py-2 text-sm font-medium text-white"
                  >
                    {t("startTest")} →
                  </button>
                )}
              </div>
            </div>
          )}

          {phase === "testIntro" && (
            <Card className="space-y-4 p-6 text-center">
              <div className="text-4xl">📝</div>
              <h1 className="text-2xl font-bold">{t("testTitle")}</h1>
              <p className="mx-auto max-w-md text-muted-foreground">{t("testIntro")}</p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setPhase("lessons");
                    setIndex(0);
                  }}
                  className="rounded-md border border-input px-4 py-2 text-sm hover:bg-muted"
                >
                  {t("reviewLessons")}
                </button>
                <button
                  onClick={() => setTab("coach")}
                  className="rounded-md border border-brand-rose px-4 py-2 text-sm font-medium text-brand-rose hover:bg-brand-rose/10"
                >
                  🤖 {t("tabCoach")}
                </button>
                <button
                  onClick={() => setPhase("test")}
                  className="rounded-md bg-brand-rose px-5 py-2 text-sm font-medium text-white"
                >
                  {t("startTest")} →
                </button>
              </div>
            </Card>
          )}

          {phase === "test" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{t("testTitle")}</h1>
              {questions.map((q, qi) => {
                const tr = DAY1_QUIZ_I18N[q.id];
                const qText = tr ? tr.question[lang] : q.text;
                return (
                  <Card key={q.id} className="space-y-3 p-4">
                    <div className="font-medium">
                      {qi + 1}. {qText}
                    </div>
                    <div className="space-y-1.5">
                      {q.options.map((opt, oi) => {
                        const label = tr ? tr.options[oi]?.[lang] ?? opt : opt;
                        const checked = answers[q.id] === oi;
                        return (
                          <label
                            key={oi}
                            className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                              checked
                                ? "border-brand-rose bg-brand-rose/10"
                                : "border-input hover:bg-muted/50"
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={checked}
                              onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                            />
                            <span>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}

              {err && <p className="text-sm text-red-700">{err}</p>}

              <button
                onClick={submitTest}
                disabled={!allAnswered || busy}
                className="w-full rounded-md bg-foreground px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {busy ? t("scoring") : allAnswered ? t("submitTest") : t("answerAll")}
              </button>
            </div>
          )}

          {phase === "done" && outcome && (
            <div className="space-y-6">
              {outcome.result.passed ? (
                <>
                  <Card className="space-y-3 p-6 text-center print:hidden">
                    <div className="text-4xl">🎓</div>
                    <h1 className="text-2xl font-bold text-emerald-700">{t("passed")}</h1>
                    <p className="text-sm text-muted-foreground">
                      {fill(UI.correctOf[lang], {
                        correct: outcome.result.correct,
                        total: outcome.result.total,
                      })}{" "}
                      · {outcome.result.score}% · ⭐ +50 {t("xp")}
                    </p>
                    <label className="mx-auto block max-w-sm text-start">
                      <span className="text-sm font-medium">{t("certNamePrompt")}</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("certNamePlaceholder")}
                        className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
                      />
                    </label>
                  </Card>

                  <Certificate
                    name={name || t("certNamePlaceholder")}
                    date={todayStr}
                    certId={outcome.certificateId ?? "—"}
                    lang={lang}
                    dir={dir}
                  />

                  <div className="flex flex-wrap justify-center gap-2 print:hidden">
                    <button
                      onClick={() => window.print()}
                      className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-white"
                    >
                      🖨 {t("print")}
                    </button>
                  </div>

                  <Card className="space-y-3 bg-gradient-to-br from-brand-rose/10 to-brand-gold/10 p-6 print:hidden">
                    <h2 className="text-lg font-bold">{t("nextStepTitle")}</h2>
                    <p className="text-sm text-muted-foreground">{t("nextStepBody")}</p>
                    <Link
                      href="/welcome#assistance"
                      className="inline-block rounded-md bg-brand-rose px-5 py-2.5 text-sm font-medium text-white"
                    >
                      {t("findAssistance")} →
                    </Link>
                  </Card>
                </>
              ) : (
                <Card className="space-y-3 p-6 text-center">
                  <div className="text-4xl">📚</div>
                  <h1 className="text-2xl font-bold text-brand-gold">{t("notPassed")}</h1>
                  <p className="text-sm text-muted-foreground">
                    {fill(UI.correctOf[lang], {
                      correct: outcome.result.correct,
                      total: outcome.result.total,
                    })}{" "}
                    · {outcome.result.score}%
                  </p>
                  <p className="mx-auto max-w-md text-sm">{t("notPassedHelp")}</p>
                  <div className="flex flex-wrap justify-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setPhase("lessons");
                        setIndex(0);
                        setOutcome(null);
                      }}
                      className="rounded-md border border-input px-4 py-2 text-sm hover:bg-muted"
                    >
                      {t("reviewLessons")}
                    </button>
                    <button
                      onClick={() => setTab("coach")}
                      className="rounded-md border border-brand-rose px-4 py-2 text-sm font-medium text-brand-rose hover:bg-brand-rose/10"
                    >
                      🤖 {t("tabCoach")}
                    </button>
                    <button
                      onClick={retake}
                      className="rounded-md bg-brand-rose px-5 py-2 text-sm font-medium text-white"
                    >
                      {t("retake")}
                    </button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Progress({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-brand-rose transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

function Certificate({
  name,
  date,
  certId,
  lang,
  dir,
}: {
  name: string;
  date: string;
  certId: string;
  lang: LearnLang;
  dir: "ltr" | "rtl";
}) {
  const t = (key: string) => UI[key]?.[lang] ?? UI[key]?.en ?? key;
  return (
    <div
      dir={dir}
      className="rounded-xl border-4 border-brand-gold bg-white p-8 text-center shadow-sm print:border-brand-gold print:shadow-none"
    >
      <div className="flex items-center justify-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-brand-rose" />
        <span className="-ml-1.5 h-3 w-3 rounded-full bg-brand-gold" />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-rose">
        {t("certHeading")}
      </p>
      <p className="mt-6 text-sm text-muted-foreground">{t("certPresentedTo")}</p>
      <p className="mt-1 text-3xl font-bold">{name}</p>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t("certCompleted")}</p>
      <p className="mt-6 text-sm font-medium">{t("certProgram")}</p>
      <div className="mt-6 flex items-center justify-center gap-8 text-xs text-muted-foreground">
        <span>
          {t("certDate")}: {date}
        </span>
        <span>
          {t("certId")}: {certId}
        </span>
      </div>
      <p className="mx-auto mt-6 max-w-lg text-[11px] leading-relaxed text-muted-foreground">
        {t("certFootnote")}
      </p>
    </div>
  );
}
