import Link from "next/link";
import { Logo } from "@/components/ui/logo";

/** Public marketing shell — no auth, no dashboard nav. */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/welcome">
            <Logo suffix="Housing" />
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/reviews" className="hidden text-muted-foreground hover:text-foreground sm:inline">
              Reviews
            </Link>
            <Link
              href="/learn"
              className="rounded-md bg-brand-rose px-4 py-1.5 font-medium text-white hover:bg-brand-plum"
            >
              Take the classes
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              Staff sign in →
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-border bg-brand-plum text-white/80">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 sm:grid-cols-3">
          <div>
            <p className="font-serif text-lg font-bold text-white">Benjamin Rose</p>
            <p className="mt-2 text-sm">
              A nonprofit helping Ohioans reach and keep stable housing — serving the community
              since 1908.
            </p>
          </div>
          <div className="text-sm">
            <p className="font-semibold uppercase tracking-wide text-white/60">Programs</p>
            <ul className="mt-2 space-y-1.5">
              <li><Link href="/learn" className="hover:text-white">Homebuyer education</Link></li>
              <li><Link href="/assistance" className="hover:text-white">Down-payment assistance</Link></li>
              <li><Link href="/welcome" className="hover:text-white">Foreclosure prevention</Link></li>
              <li><Link href="/welcome" className="hover:text-white">Credit &amp; financial coaching</Link></li>
              <li><Link href="/reviews" className="hover:text-white">Reviews</Link></li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="font-semibold uppercase tracking-wide text-white/60">Partnership</p>
            <p className="mt-2">
              In partnership with The Golden Group. HUD-approved housing counseling.
            </p>
            <p className="mt-2">
              <a href="https://www.benrose.org" className="underline hover:text-white">
                benrose.org
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
