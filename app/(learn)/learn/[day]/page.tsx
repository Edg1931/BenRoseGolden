import { notFound, redirect } from "next/navigation";
import { CoursePlayer } from "@/components/learn/course-player";
import { AdminPreviewBanner } from "@/components/learn/admin-preview-banner";
import { COURSE_DAYS, getDay } from "@/lib/learn/course";
import { dayPublicQuestions } from "@/lib/learn/quiz";
import { getCurrentLearner } from "@/lib/learn/accounts";
import { tryGetCurrentUser } from "@/lib/auth/session";
import { buildTailoring } from "@/lib/learn/tailoring";

// Reads the learner session (cookies), so it renders per-request.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return COURSE_DAYS.map((d) => ({ day: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const courseDay = getDay(day);
  return {
    title: courseDay
      ? `${courseDay.title} — Benjamin Rose Housing`
      : "Homebuyer Classes — Benjamin Rose Housing",
    description: courseDay?.blurb,
  };
}

/**
 * A day of the learner course. The server assembles the day's lessons and the
 * answer-key-free test questions; the client player handles language, audio,
 * podcast, AI coach, interactives, the test, and the certificate.
 */
export default async function DayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const courseDay = getDay(day);
  if (!courseDay) notFound();

  // Classes are gated behind a learner profile so progress is tracked to the CRM.
  // A signed-in staff member (e.g. master admin) may PREVIEW without an account —
  // no learner record, no progress saved.
  const learner = await getCurrentLearner();
  const preview = !learner && (await tryGetCurrentUser()) !== null;
  if (!learner && !preview) redirect(`/learn/start?next=/learn/${day}`);

  return (
    <>
      {preview && <AdminPreviewBanner />}
      <CoursePlayer
        daySlug={courseDay.slug}
        sections={courseDay.sections}
        lessons={courseDay.lessons}
        questions={dayPublicQuestions(courseDay.slug)}
        pdf={courseDay.pdf}
        video={courseDay.video}
        minutes={courseDay.minutes}
        tailoring={learner ? buildTailoring(learner) : undefined}
      />
    </>
  );
}
