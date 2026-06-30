import { redirect } from "next/navigation";
import { LearnerAuth } from "@/components/learn/learner-auth";
import { getCurrentLearner } from "@/lib/learn/accounts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in — Benjamin Rose Housing",
  description: "Sign in to continue your homebuyer classes.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await getCurrentLearner()) redirect("/learn");
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/learn") ? next : "/learn";
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <LearnerAuth mode="signin" next={safeNext} />
    </main>
  );
}
