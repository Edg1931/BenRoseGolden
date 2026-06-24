import { cn } from "@/lib/utils";

/**
 * Benjamin Rose brand lockup, shared by every shell (marketing, learner,
 * dashboard). Uses the official logo asset at /public/brand. To update the
 * brand, replace that file — this component is the only place the logo lives.
 */

export function Logo({
  suffix,
  className,
  imgClassName,
}: {
  /** Optional program label shown beside the logo, e.g. "Housing". */
  suffix?: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/benjamin-rose-logo.jpg"
        alt="Benjamin Rose"
        width={397}
        height={254}
        className={cn("h-11 w-auto", imgClassName)}
      />
      {suffix && (
        <span className="border-s border-border ps-2.5 text-sm font-semibold tracking-tight text-brand-plum">
          {suffix}
        </span>
      )}
    </span>
  );
}

/** Standalone red spiral-rose mark (e.g. for compact spots / favicons). */
export function RoseMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("h-9 w-9", className)}>
      <circle cx="24" cy="24" r="22" fill="hsl(349 80% 47%)" />
      <path
        d="M24 9 C32.3 9 39 15.7 39 24 C39 31.2 33.2 37 26 37 C19.9 37 15 32.1 15 26
           C15 20.8 19.2 16.6 24.4 16.6 C28.8 16.6 32.4 20.2 32.4 24.6
           C32.4 28.3 29.4 31.3 25.7 31.3 C22.6 31.3 20.1 28.8 20.1 25.7"
        fill="none"
        stroke="white"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
