"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLES, type Role } from "@/lib/auth/roles";

const ROLE_LABELS: Record<Role, string> = {
  admin: "Master Admin — sees everything",
  "golden-agent": "Golden Group Agent",
  "benjamin-rose": "Benjamin Rose Staff",
};

/**
 * Passcode sign-in. The role picker isn't decoration: the two organizations see
 * different slices of the same client list, and choosing a role here is how you
 * demonstrate that without maintaining separate accounts.
 */
export function StaffSignInForm() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [role, setRole] = useState<Role>("admin");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/staff/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, role }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Sign-in failed.");
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign-in failed.");
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-md border border-input bg-white px-3 py-2.5 text-sm focus:border-brand-rose focus:outline-none";

  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border border-border bg-white p-6">
      <label className="block">
        <span className="text-sm font-medium">Passcode</span>
        <input
          className={field + " mt-1"}
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          autoFocus
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Sign in as</span>
        <select
          className={field + " mt-1"}
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </label>

      {err && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </p>
      )}

      <button
        disabled={busy || !passcode}
        className="w-full rounded-md bg-brand-rose px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-plum disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
