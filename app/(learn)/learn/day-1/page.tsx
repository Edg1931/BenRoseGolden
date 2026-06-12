import { CoursePlayer } from "@/components/learn/course-player";
import { day1PublicQuestions } from "@/lib/learn/quiz";

export const metadata = {
  title: "Day 1: Money Management & Credit — Benjamin Rose Housing",
  description:
    "Day 1 of the HUD-approved homebuyer course: budgeting and understanding credit, in English, Spanish, or Arabic, with audio and a certificate.",
};

/**
 * Day 1 learner experience. The page (server) assembles the answer-key-free
 * questions; the client player handles language, audio, lessons, the test, and
 * the certificate.
 */
export default function Day1Page() {
  const questions = day1PublicQuestions();
  return <CoursePlayer questions={questions} />;
}
