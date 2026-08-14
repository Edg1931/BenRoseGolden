import Link from "next/link";
import { redirect } from "next/navigation";
import { tryGetCurrentUser } from "@/lib/auth/session";
import { isStaffAreaUnprotected } from "@/lib/auth/staff-session";
import { StaffSignOut } from "@/components/auth/staff-signout";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { SkipLink } from "@/components/ui/skip-link";

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
  // No staff session on a gated deployment -> sign in first.
  const user = await tryGetCurrentUser();
  if (!user) redirect("/staff/signin");
  const unprotected = isStaffAreaUnprotected();

  const roleLabel =
    user.role === "golden-agent"
      ? "Golden Group Agent"
      : user.role === "benjamin-rose"
        ? `Benjamin Rose Staff${user.org ? ` · ${user.org}` : ""}`
        : "Admin";

  return (
    <div className="min-h-screen">
      <SkipLink />
      <header className="border-b border-border bg-background print:hidden">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="shrink-0">
              <Logo suffix="× Golden Group" imgClassName="h-9" />
            </Link>
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <Badge variant={user.role === "benjamin-rose" ? "rose" : "gold"}>
                {roleLabel}
              </Badge>
              <span className="hidden truncate text-muted-foreground sm:inline">{user.email}</span>
              <StaffSignOut />
            </div>
          </div>
          {/* Nav scrolls horizontally on small screens instead of overflowing. */}
          <nav className="-mx-4 mt-2 flex items-center gap-1 overflow-x-auto px-4 text-sm [scrollbar-width:none] sm:mx-0 sm:mt-3 sm:px-0">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/contacts">Clients</NavLink>
            <NavLink href="/content">Content</NavLink>
            <NavLink href="/referrals">Referrals</NavLink>
            <NavLink href="/partnership">Partnership</NavLink>
            <NavLink href="/lenders">Lenders</NavLink>
            <NavLink href="/dpa-finder">Assistance</NavLink>
            <NavLink href="/reports">Reports</NavLink>
            <NavLink href="/classes">Classes</NavLink>
          </nav>
        </div>
      </header>
      {unprotected && (
        <div className="border-b border-brand-gold/40 bg-brand-gold/10 px-4 py-2 text-center text-xs text-brand-goldink sm:px-6">
          <strong>This staff area is open to anyone with the link.</strong> Set a{" "}
          <code className="rounded bg-white/70 px-1">STAFF_PASSCODE</code> environment variable to
          require sign-in.
        </div>
      )}
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
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
