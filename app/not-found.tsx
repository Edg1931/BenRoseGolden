import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-rose">
        Benjamin Rose Housing
      </p>
      <h1 className="mt-3 font-serif text-5xl font-bold text-brand-plum">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you&apos;re looking for moved or never existed. Let&apos;s get you back on track.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/welcome"
          className="rounded-md bg-brand-rose px-6 py-3 text-sm font-semibold text-white hover:bg-brand-plum"
        >
          Go to homepage
        </Link>
        <Link
          href="/learn"
          className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-rose hover:text-brand-rose"
        >
          Browse the classes
        </Link>
      </div>
    </main>
  );
}
