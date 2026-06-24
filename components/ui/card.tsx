import { cn } from "@/lib/utils";

/**
 * Basic surface. Forwards standard div props (onClick, role, etc.) so cards can
 * be made interactive (e.g. clickable result cards) without a separate wrapper.
 */
export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
