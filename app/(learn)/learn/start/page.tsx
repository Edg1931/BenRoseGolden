import { redirect } from "next/navigation";
import { LearnerAuth, type SignupPrefill } from "@/components/learn/learner-auth";
import { LangProvider } from "@/components/i18n/lang-provider";
import { getCurrentLearner } from "@/lib/learn/accounts";
import { LANGUAGES, TRACKS, type LanguageCode, type Track } from "@/lib/participants/curriculum";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create your profile — Benjamin Rose Housing",
  description: "Create a free profile to take the homebuyer classes, track your progress, and see the assistance you may qualify for.",
};

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string;
    from?: string;
    firstName?: string;
    email?: string;
    language?: string;
    track?: string;
  }>;
}) {
  if (await getCurrentLearner()) redirect("/learn");
  const { next, from, firstName, email, language, track } = await searchParams;
  const safeNext = next && next.startsWith("/learn") ? next : "/learn";

  // Details carried over from the welcome-page sign-up, validated against the
  // known lists so nothing arbitrary rides in on a crafted URL.
  const prefill: SignupPrefill | undefined =
    from === "welcome"
      ? {
          firstName: firstName?.slice(0, 80),
          email: email?.slice(0, 254),
          preferredLanguage: (LANGUAGES as readonly string[]).includes(language ?? "")
            ? (language as LanguageCode)
            : undefined,
          track: (TRACKS as readonly string[]).includes(track ?? "")
            ? (track as Track)
            : undefined,
        }
      : undefined;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <LangProvider>
        <LearnerAuth mode="signup" next={safeNext} prefill={prefill} />
      </LangProvider>
    </main>
  );
}
