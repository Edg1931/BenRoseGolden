/** Lightweight skeleton while a learner route's server data loads. */
export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl animate-pulse px-6 py-12" aria-busy="true" aria-label="Loading">
      <div className="h-4 w-56 rounded bg-muted" />
      <div className="mt-4 h-9 w-2/3 rounded bg-muted" />
      <div className="mt-3 h-4 w-full max-w-xl rounded bg-muted" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 rounded-xl border border-border bg-muted/40" />
        ))}
      </div>
    </main>
  );
}
