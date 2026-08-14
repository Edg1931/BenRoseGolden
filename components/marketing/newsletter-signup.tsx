"use client";

import { useState } from "react";
import { LANGUAGES, LANGUAGE_LABELS, type LanguageCode } from "@/lib/participants/curriculum";

const INTERESTS = [
  { value: "first-time-buyer", label: "Buying my first home" },
  { value: "foreclosure-prevention", label: "Keeping my home / foreclosure help" },
  { value: "credit-repair", label: "Improving my credit" },
  { value: "general", label: "Just keep me informed" },
];

export function NewsletterSignup() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [interest, setInterest] = useState("general");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, language, interest }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Something went wrong");
      // Signing up is the start of their profile, not the end of a mailing-list
      // form — carry what they just told us into account creation, where the
      // only thing left to add is a password. (Stay `busy` through navigation.)
      const params = new URLSearchParams({ from: "welcome", firstName, email });
      if (language) params.set("language", language);
      if (interest && interest !== "general") params.set("track", interest);
      window.location.assign(`/learn/start?${params.toString()}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  }

  const field = "w-full rounded-md border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/60 focus:border-white focus:outline-none";

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl bg-white/10 p-6 backdrop-blur">
      <p className="font-semibold">Sign up once — free classes, your certificate, and housing help in your inbox</p>
      <label className="block">
        <span className="sr-only">First name</span>
        <input className={field} placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      </label>
      <label className="block">
        <span className="sr-only">Email address</span>
        <input className={field} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="block">
        <span className="sr-only">What are you interested in?</span>
        <select className={field} value={interest} onChange={(e) => setInterest(e.target.value)}>
          {INTERESTS.map((i) => <option key={i.value} value={i.value} className="text-foreground">{i.label}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="sr-only">Preferred language</span>
        <select className={field} value={language} onChange={(e) => setLanguage(e.target.value as LanguageCode)}>
          {LANGUAGES.map((l) => <option key={l} value={l} className="text-foreground">{LANGUAGE_LABELS[l]}</option>)}
        </select>
      </label>
      {err && <p className="text-sm text-amber-200">{err}</p>}
      <button disabled={busy} className="w-full rounded-md bg-brand-gold px-4 py-2.5 font-semibold text-foreground disabled:opacity-60">
        {busy ? "Setting up your classes…" : "Sign me up — it's free"}
      </button>
      <p className="text-center text-xs text-white/80">Benjamin Rose is a nonprofit. No spam, ever.</p>
    </form>
  );
}
