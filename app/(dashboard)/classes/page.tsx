import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { COURSE_DAYS } from "@/lib/learn/course";
import { dayPublicQuestions } from "@/lib/learn/quiz";
import { episodeForDay } from "@/lib/learn/podcast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

/**
 * Admin view of the learner classes: the live course structure, with a preview
 * link into exactly what clients see (no learner account needed).
 */
export default async function ClassesPage() {
  await getCurrentUser(); // staff-gated by the dashboard layout
  const totalMinutes = COURSE_DAYS.reduce((s, d) => s + d.minutes, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Classes</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          The live HUD-approved homebuyer course clients take — {COURSE_DAYS.length} days,
          ~{Math.round(totalMinutes / 60)} hours. Preview any day exactly as a learner sees it
          (in English, Spanish, or Arabic) to review and improve it.
        </p>
      </div>

      <div className="rounded-md border border-brand-rose/30 bg-brand-blush/40 px-4 py-3 text-sm text-brand-plum">
        💡 Click <span className="font-medium">Preview as learner</span> to open the real class —
        lessons, audio, the interactive podcast, coach, and the test — with no account needed.
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {COURSE_DAYS.map((d, i) => {
          const questions = dayPublicQuestions(d.slug).length;
          const hasPodcast = Boolean(episodeForDay(d.slug));
          const sections = Object.keys(d.sections).length;
          return (
            <Card key={d.slug} className="flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-brand-rose">Day {i + 1}</div>
                  <h2 className="mt-0.5 font-semibold leading-tight">{d.title}</h2>
                </div>
                <Badge variant="muted">{d.minutes} min</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{d.blurb}</p>

              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                <Badge variant="rose">{d.lessons.length} lessons</Badge>
                <Badge variant="muted">{sections} sections</Badge>
                <Badge variant="gold">{questions}-question test</Badge>
                {hasPodcast && <Badge variant="muted">🎙️ Podcast</Badge>}
                {d.pdf && <Badge variant="muted">📄 PDF</Badge>}
                {d.video && <Badge variant="muted">🎬 Video</Badge>}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 pt-1">
                <Link
                  href={`/learn/${d.slug}`}
                  className="rounded-md bg-brand-rose px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-plum"
                >
                  Preview as learner →
                </Link>
                {d.pdf && (
                  <a href={d.pdf} target="_blank" rel="noopener noreferrer" className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted">
                    Open PDF ↗
                  </a>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Lesson content lives in the codebase (<code>lib/learn</code>) and is versioned with the app.
        To change wording or add a lesson, edit there — or ask an engineer. In-app lesson editing is
        on the roadmap.
      </p>
    </div>
  );
}
