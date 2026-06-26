"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Route-level error boundary. Catches render/data errors in a segment and shows
 * a friendly, on-brand recovery screen instead of Next's raw error overlay.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for server logs / monitoring without exposing details to the user.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="text-4xl">🛠️</div>
      <h1 className="mt-3 font-serif text-3xl font-bold text-brand-plum">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        We hit an unexpected problem loading this page. You can try again, or head back home.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-brand-rose px-6 py-3 text-sm font-semibold text-white hover:bg-brand-plum"
        >
          Try again
        </button>
        <Link
          href="/welcome"
          className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-rose hover:text-brand-rose"
        >
          Go to homepage
        </Link>
      </div>
      {error.digest && (
        <p className="mt-4 text-xs text-muted-foreground">Reference: {error.digest}</p>
      )}
    </main>
  );
}
