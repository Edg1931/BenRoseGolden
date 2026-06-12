import Link from "next/link";

/** Public marketing shell — no auth, no dashboard nav. */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/welcome" className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-brand-rose" />
            <span className="h-3 w-3 -ml-1.5 rounded-full bg-brand-gold" />
            <span className="ml-1 font-semibold tracking-tight">Benjamin Rose Housing</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Staff sign in →
          </Link>
        </div>
      </header>
      {children}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
          <p>Benjamin Rose — a nonprofit helping Ohioans reach and keep stable housing.</p>
          <p className="mt-1">In partnership with The Golden Group. HUD-approved housing counseling.</p>
        </div>
      </footer>
    </div>
  );
}
