import { redirect } from "next/navigation";
import { LearnerAuth } from "@/components/learn/learner-auth";
import { getCurrentLearner } from "@/lib/learn/accounts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create your profile — Benjamin Rose Housing",
  description: "Create a free profile to take the homebuyer classes, track your progress, and see the assistance you may qualify for.",
};

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await getCurrentLearner()) redirect("/learn");
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/learn") ? next : "/learn";
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <LearnerAuth mode="signup" next={safeNext} />
    </main>
  );
}
