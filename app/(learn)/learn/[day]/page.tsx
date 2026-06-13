import { notFound } from "next/navigation";
import { CoursePlayer } from "@/components/learn/course-player";
import { COURSE_DAYS, getDay } from "@/lib/learn/course";
import { dayPublicQuestions } from "@/lib/learn/quiz";

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

  return (
    <CoursePlayer
      daySlug={courseDay.slug}
      sections={courseDay.sections}
      lessons={courseDay.lessons}
      questions={dayPublicQuestions(courseDay.slug)}
    />
  );
}
