import Link from "next/link";
import { Logo } from "@/components/ui/logo";

/**
 * Public, self-serve learner shell for the homebuyer course. Separate from the
 * marketing and staff dashboard shells. Header/footer are hidden when printing
 * so a learner's certificate prints on its own.
 */
export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="border-b border-border bg-white print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/welcome">
            <Logo suffix="Housing" />
          </Link>
          <Link href="/learn" className="text-sm text-muted-foreground hover:text-foreground">
            All classes
          </Link>
        </div>
      </header>
      {children}
      <footer className="border-t border-border bg-white print:hidden">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-muted-foreground">
          <p>Benjamin Rose — free HUD-approved homebuyer education, in your language.</p>
          <p className="mt-1">In partnership with The Golden Group.</p>
        </div>
      </footer>
    </div>
  );
}
