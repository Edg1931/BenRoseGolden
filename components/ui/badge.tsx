import { cn } from "@/lib/utils";

type Variant = "default" | "rose" | "gold" | "muted" | "success" | "warning";

const variants: Record<Variant, string> = {
  default: "bg-foreground/90 text-white",
  rose: "bg-brand-rose/10 text-brand-roseink ring-1 ring-brand-rose/20",
  gold: "bg-brand-gold/10 text-brand-goldink ring-1 ring-brand-gold/30",
  muted: "bg-muted text-muted-foreground ring-1 ring-border",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  warning: "bg-amber-50 text-brand-goldink ring-1 ring-amber-200",
};

export function Badge({
  variant = "default",
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
