"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { COURSE_DAYS } from "@/lib/learn/course";
import { loadProgress, type LearnerProgress } from "@/lib/learn/progress-store";

/**
 * Progress-aware course map for the classes home: per-day status (passed score,
 * in-progress, not started), XP and badges, overall progress, and a celebration
 * card once all four days are passed.
 */
export function CourseMap({ serverPassed }: { serverPassed?: Record<string, number | null> }) {
  const [progress, setProgress] = useState<LearnerProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  // A day counts as passed if THIS device's localStorage says so OR the learner's
  // saved CRM record does — so progress follows them across devices once signed in.
  const isPassed = (slug: string) =>
    Boolean(progress?.passed[slug]) || (serverPassed != null && slug in serverPassed);
  const passedCount = COURSE_DAYS.filter((d) => isPassed(d.slug)).length;
  const allDone = passedCount === COURSE_DAYS.length;

  return (
    <div>
      {/* Progress strip (renders once localStorage has hydrated) */}
      {progress && (progress.xp > 0 || passedCount > 0) && (
        <Card className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brand-gold/15 px-3 py-1 text-sm font-semibold text-brand-goldink">
              ⭐ {progress.xp} XP
            </span>
            <div className="flex items-center gap-1" aria-label="Day badges">
              {COURSE_DAYS.map((d) => (
                <span
                  key={d.slug}
                  title={`${d.title} ${isPassed(d.slug) ? "passed" : "not passed yet"}`}
                  className={`text-xl ${isPassed(d.slug) ? "" : "opacity-25 grayscale"}`}
                >
                  🎓
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-36 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-brand-rose transition-all"
                style={{ width: `${(passedCount / COURSE_DAYS.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {passedCount} / {COURSE_DAYS.length} days passed
            </span>
          </div>
        </Card>
      )}

      {/* All-done celebration + assistance handoff */}
      {allDone && (
        <Card className="mb-6 bg-gradient-to-br from-brand-blush to-brand-gold/10 p-6 text-center">
          <div className="text-4xl">🏆</div>
          <h2 className="mt-2 font-serif text-2xl font-bold text-brand-plum">
            You finished all four days!
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            You&apos;ve passed every class test. Contact a Benjamin Rose counselor to have your full
            HUD Homebuyer Education certificate issued — then find the assistance it unlocks.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              href="/assistance"
              className="rounded-md bg-brand-rose px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-plum"
            >
              Find my down-payment assistance →
            </Link>
          </div>
        </Card>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {COURSE_DAYS.map((d) => {
          const pass = progress?.passed[d.slug];
          const viewedCount = progress?.viewed[d.slug]?.length ?? 0;
          const passed = isPassed(d.slug);
          // Prefer this device's recorded score; fall back to the CRM score if any.
          const passScore = pass?.score ?? serverPassed?.[d.slug] ?? null;
          const status = passed ? "passed" : viewedCount > 0 ? "in-progress" : "new";
          return (
            <Link key={d.slug} href={`/learn/${d.slug}`}>
              <Card className="flex h-full flex-col p-6 transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Day {d.order}
                  </span>
                  {status === "passed" && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      ✓ Passed{passScore != null ? ` · ${passScore}%` : ""}
                    </span>
                  )}
                  {status === "in-progress" && (
                    <span className="rounded-full bg-brand-gold/15 px-2.5 py-0.5 text-xs font-medium text-brand-goldink">
                      In progress
                    </span>
                  )}
                  {status === "new" && (
                    <span className="rounded-full bg-brand-blush px-2.5 py-0.5 text-xs font-medium text-brand-roseink">
                      Start now
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-lg font-semibold">
                  <span className="me-2">{d.icon}</span>
                  {d.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{d.blurb}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>⏱ ~{Math.round(d.minutes / 60)} hr</span>
                  <span>📘 {d.lessons.length} lessons</span>
                </div>
                <span className="mt-3 inline-block text-sm font-medium text-brand-rose">
                  {status === "passed" ? "Review class →" : status === "in-progress" ? "Continue →" : "Start class →"}
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
