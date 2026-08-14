"use client";

/** Prints the current page — used for the learner's certificate. */
export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-md bg-brand-rose px-4 py-2 text-sm font-semibold text-white hover:bg-brand-plum"
    >
      🖨 Print / save as PDF
    </button>
  );
}
