import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  tone = "gold",
}: {
  value: number; // 0–100
  className?: string;
  tone?: "gold" | "rose" | "emerald";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const bar =
    tone === "rose" ? "bg-brand-rose" : tone === "emerald" ? "bg-emerald-500" : "bg-brand-gold";
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className={cn("h-full rounded-full transition-all", bar)} style={{ width: `${clamped}%` }} />
    </div>
  );
}
