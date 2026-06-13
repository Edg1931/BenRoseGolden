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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/dashboard">
              <Logo suffix="× Golden Group" markClassName="h-7 w-7" />
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/contacts">Clients</NavLink>
              <NavLink href="/content">Content</NavLink>
              <NavLink href="/referrals">Referrals</NavLink>
              <NavLink href="/dpa-finder">Assistance</NavLink>
              <NavLink href="/reports">Reports</NavLink>
              <NavLink href="/learn">Classes ↗</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Badge variant={user.role === "benjamin-rose" ? "rose" : "gold"}>
              {roleLabel}
            </Badge>
            <span className="text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-foreground/80 hover:bg-muted hover:text-foreground"
    >
      {children}
    </Link>
  );
}
