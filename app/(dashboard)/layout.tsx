import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";

/**
 * Shared app shell for both modules: top nav, brand, and the signed-in user's
 * role. Auth resolution happens here; with Supabase configured an unauthenticated
 * user throws and should be redirected to sign-in by middleware (added later).
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const roleLabel =
    user.role === "golden-agent"
      ? "Golden Group Agent"
      : user.role === "benjamin-rose"
        ? `Benjamin Rose Staff${user.org ? ` · ${user.org}` : ""}`
        : "Admin";

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="shrink-0">
              <Logo suffix="× Golden Group" markClassName="h-7 w-7" />
            </Link>
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <Badge variant={user.role === "benjamin-rose" ? "rose" : "gold"}>
                {roleLabel}
              </Badge>
              <span className="hidden truncate text-muted-foreground sm:inline">{user.email}</span>
            </div>
          </div>
          {/* Nav scrolls horizontally on small screens instead of overflowing. */}
          <nav className="-mx-4 mt-2 flex items-center gap-1 overflow-x-auto px-4 text-sm [scrollbar-width:none] sm:mx-0 sm:mt-3 sm:px-0">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/contacts">Clients</NavLink>
            <NavLink href="/content">Content</NavLink>
            <NavLink href="/referrals">Referrals</NavLink>
            <NavLink href="/dpa-finder">Assistance</NavLink>
            <NavLink href="/reports">Reports</NavLink>
            <NavLink href="/learn">Classes ↗</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap rounded-md px-3 py-1.5 text-foreground/80 hover:bg-muted hover:text-foreground"
    >
      {children}
    </Link>
  );
}
