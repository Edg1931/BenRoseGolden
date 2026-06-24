import { cn } from "@/lib/utils";

/**
 * Benjamin Rose brand mark + wordmark, shared by every shell (marketing,
 * learner, dashboard) so the brand renders identically everywhere.
 *
 * The rose is an original SVG drawn in the spirit of the Benjamin Rose bloom
 * (their site assets are not hot-linkable). To use the official mark, drop the
 * provided SVG/PNG into /public and swap the <RoseMark/> below for an <Image/>
 * — this component is the only place the logo lives.
 */

export function RoseMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={cn("h-9 w-9", className)}
    >
      {/* Benjamin Rose-style spiral rose: an unfurling swirl in brand red. */}
      <circle cx="24" cy="24" r="22" fill="hsl(349 80% 47%)" />
      <path
        d="M24 9
           C32.3 9 39 15.7 39 24
           C39 31.2 33.2 37 26 37
           C19.9 37 15 32.1 15 26
           C15 20.8 19.2 16.6 24.4 16.6
           C28.8 16.6 32.4 20.2 32.4 24.6
           C32.4 28.3 29.4 31.3 25.7 31.3
           C22.6 31.3 20.1 28.8 20.1 25.7"
        fill="none"
        stroke="white"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* Leaf accent */}
      <path d="M33 33 C36 33 38 35 38 38 C35 38 33 36 33 33 Z" fill="white" opacity="0.9" />
    </svg>
  );
}

export function Logo({
  suffix,
  className,
  markClassName,
}: {
  /** Optional second line under the wordmark, e.g. "Housing" or "× Golden Group". */
  suffix?: string;
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <RoseMark className={markClassName} />
      <span className="leading-none">
        <span className="block font-serif text-lg font-bold tracking-tight text-brand-plum">
          Benjamin Rose
        </span>
        {suffix && (
          <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold">
            {suffix}
          </span>
        )}
      </span>
    </span>
  );
}
