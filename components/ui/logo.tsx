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
      {/* Outer petals */}
      <g>
        {[0, 72, 144, 216, 288].map((rot) => (
          <ellipse
            key={rot}
            cx="24"
            cy="13.5"
            rx="7.5"
            ry="11"
            transform={`rotate(${rot} 24 24)`}
            fill="hsl(338 65% 46%)"
            opacity="0.55"
          />
        ))}
      </g>
      {/* Inner petals, offset for bloom depth */}
      <g>
        {[36, 108, 180, 252, 324].map((rot) => (
          <ellipse
            key={rot}
            cx="24"
            cy="17.5"
            rx="5"
            ry="7.5"
            transform={`rotate(${rot} 24 24)`}
            fill="hsl(331 48% 30%)"
            opacity="0.75"
          />
        ))}
      </g>
      {/* Bud */}
      <circle cx="24" cy="24" r="5" fill="hsl(331 48% 22%)" />
      <circle cx="24" cy="24" r="2.2" fill="hsl(42 80% 55%)" />
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
