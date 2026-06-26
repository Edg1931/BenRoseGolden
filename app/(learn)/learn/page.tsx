import Link from "next/link";
import { CourseMap } from "@/components/learn/course-map";

export const metadata = {
  title: "Homebuyer Classes — Benjamin Rose Housing",
  description:
    "Free, self-paced HUD-approved homebuyer education in English, Spanish, and Arabic. Lessons, interactive podcast, AI coach, quizzes, and certificates.",
};

export default function LearnHome() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-rose">
        Free • HUD-Approved Homebuyer Education
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-brand-plum sm:text-4xl">
        Homebuyer Education — learn at your own pace
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Four short classes take you from managing money to protecting your new home. Read the
        lessons, listen to the podcast, ask the AI coach anything — then pass each test to earn
        your certificates.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-brand-blush px-3 py-1 text-brand-rose">English</span>
        <span className="rounded-full bg-brand-blush px-3 py-1 text-brand-rose">Español</span>
        <span className="rounded-full bg-brand-blush px-3 py-1 text-brand-rose">العربية</span>
        <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-brand-gold">🎙️ Podcast</span>
        <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-brand-gold">🤖 AI coach</span>
        <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-brand-gold">🔊 Audio</span>
        <span className="rounded-full bg-brand-blush px-3 py-1 text-brand-rose">⏱ ~8 hours total · ~2 hr per class</span>
      </div>

      <div className="mt-8">
        <CourseMap />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-white p-5 text-sm text-muted-foreground">
        Done learning?{" "}
        <Link href="/assistance" className="font-medium text-brand-rose underline">
          See which Ohio down-payment-assistance programs you may qualify for →
        </Link>
      </div>
    </main>
  );
}
