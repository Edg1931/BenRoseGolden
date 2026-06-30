"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Header controls for the learner shell: greeting + sign out, or a sign-in link. */
export function LearnerNav({ firstName }: { firstName?: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    await fetch("/api/learn/auth/signout", { method: "POST" });
    router.push("/welcome");
    router.refresh();
  }

  if (!firstName) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <Link href="/learn" className="text-muted-foreground hover:text-foreground">All classes</Link>
        <Link href="/learn/signin" className="font-medium text-brand-rose hover:underline">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <Link href="/learn" className="text-muted-foreground hover:text-foreground">All classes</Link>
      <span className="hidden text-muted-foreground sm:inline">Hi, {firstName}</span>
      <button onClick={signOut} disabled={busy} className="text-muted-foreground hover:text-foreground disabled:opacity-50">
        Sign out
      </button>
    </div>
  );
}
