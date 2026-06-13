import Link from "next/link";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Homebuyer Classes — Benjamin Rose Housing",
  description:
    "Free, self-paced HUD-approved homebuyer education in English, Spanish, and Arabic. Read or listen, pass the test, and earn your certificate.",
};

/** The four-day course. Day 1 is live; the rest follow the same pattern. */
const DAYS = [
  {
    n: 1,
    href: "/learn/day-1",
    live: true,
    title: "Money Management & Understanding Credit",
    blurb: "Build a budget, understand your expenses, and learn how credit reports and scores really work.",
  },
  {
    n: 2,
    href: "#",
    live: false,
    title: "Obtaining a Mortgage & Know Your Rights",
    blurb: "How mortgages work, what you can afford, the homebuying team, and your rights as a borrower.",
  },
  {
    n: 3,
    href: "#",
    live: false,
    title: "Shopping for a Home & Home Inspection",
    blurb: "Making an offer, escrow, and what a home inspection protects you from.",
  },
  {
    n: 4,
    href: "#",
    live: false,
    title: "Home Insurance Basics & Home Maintenance",
    blurb: "Protect your investment with the right insurance and a simple home-maintenance routine.",
  },
];

export default function LearnHome() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-rose">
        Free • HUD-Approved Homebuyer Education
      </p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
        Homebuyer Education — learn at your own pace
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Four short classes take you from managing money to closing on your home. Read it, or press
        <span className="font-medium"> Listen </span>
        and follow along. Pass the test to earn your certificate.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-brand-rose/10 px-3 py-1 text-brand-rose">English</span>
        <span className="rounded-full bg-brand-rose/10 px-3 py-1 text-brand-rose">Español</span>
        <span className="rounded-full bg-brand-rose/10 px-3 py-1 text-brand-rose">العربية</span>
        <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-brand-gold">🔊 Audio</span>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {DAYS.map((d) => {
          const inner = (
            <Card
              className={`flex h-full flex-col p-6 ${
                d.live ? "transition hover:shadow-md" : "opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Day {d.n}
                </span>
                {d.live ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    Start now
                  </span>
                ) : (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Coming soon
                  </span>
                )}
              </div>
              <h2 className="mt-3 text-lg font-semibold">{d.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{d.blurb}</p>
              {d.live && (
                <span className="mt-4 inline-block text-sm font-medium text-brand-rose">
                  Start class →
                </span>
              )}
            </Card>
          );
          return d.live ? (
            <Link key={d.n} href={d.href}>
              {inner}
            </Link>
          ) : (
            <div key={d.n}>{inner}</div>
          );
        })}
      </div>
    </main>
  );
}
