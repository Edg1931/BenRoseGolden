/** Lightweight skeleton while a dashboard route's server data loads. */
export default function Loading() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading">
      <div className="h-6 w-48 rounded bg-muted" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl border border-border bg-muted/40" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-64 rounded-xl border border-border bg-muted/40 lg:col-span-2" />
        <div className="h-64 rounded-xl border border-border bg-muted/40" />
      </div>
    </div>
  );
}
