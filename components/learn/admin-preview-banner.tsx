import Link from "next/link";

/**
 * Shown at the top of a class when a staff member is previewing it without a
 * learner account. Makes it obvious this is exactly what clients see, and that
 * nothing is being tracked to a learner record.
 */
export function AdminPreviewBanner() {
  return (
    <div className="border-b border-brand-plum/20 bg-brand-plum text-white print:hidden">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-2 text-sm">
        <span>
          👀 <span className="font-semibold">Admin preview</span> — this is exactly what learners
          see. Progress isn&apos;t saved.
        </span>
        <Link href="/classes" className="rounded-md bg-white/15 px-3 py-1 font-medium hover:bg-white/25">
          ← Back to Classes
        </Link>
      </div>
    </div>
  );
}
