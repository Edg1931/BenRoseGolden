import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { StaffSignInForm } from "@/components/auth/staff-signin-form";
import { isStaffPasscodeEnabled } from "@/lib/auth/staff-session";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = { title: "Staff sign-in — Benjamin Rose × The Golden Group" };

/**
 * Staff sign-in for deployments running on sample data. When Supabase is
 * configured, staff identity comes from the database instead and this page has
 * nothing to do, so it sends you to the dashboard.
 */
export default function StaffSignInPage() {
  if (isSupabaseConfigured()) redirect("/dashboard");

  const gated = isStaffPasscodeEnabled();

  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/welcome">
            <Logo suffix="× Golden Group" />
          </Link>
          <Link href="/welcome" className="text-sm text-muted-foreground hover:underline">
            Back to the public site
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <h1 className="font-serif text-2xl font-bold text-brand-plum">Staff sign-in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The client records behind this screen belong to families in the program. Sign in to
          continue.
        </p>

        {gated ? (
          <StaffSignInForm />
        ) : (
          <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-gold/5 p-5">
            <p className="text-sm font-semibold text-brand-goldink">
              No passcode is set on this deployment
            </p>
            <p className="mt-1 text-sm text-foreground/90">
              Anyone with the link can open the staff area. Set a{" "}
              <code className="rounded bg-white px-1 py-0.5 text-xs">STAFF_PASSCODE</code>{" "}
              environment variable to turn on sign-in.
            </p>
            <Link
              href="/dashboard"
              className="mt-3 inline-block rounded-md bg-foreground px-4 py-2 text-sm font-medium text-white"
            >
              Continue to the dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
