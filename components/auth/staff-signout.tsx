"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Ends the staff session (no-Supabase deployments). */
export function StaffSignOut() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    await fetch("/api/staff/auth", { method: "DELETE" });
    router.push("/staff/signin");
    router.refresh();
  }

  return (
    <button
      onClick={signOut}
      disabled={busy}
      className="whitespace-nowrap text-muted-foreground hover:text-foreground disabled:opacity-50"
    >
      Sign out
    </button>
  );
}
