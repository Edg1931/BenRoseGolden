"use client";

/** Print / save the current report as a PDF via the browser print dialog. */
export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-md border border-input px-3 py-2 text-sm hover:bg-muted print:hidden"
    >
      🖨 Print / PDF
    </button>
  );
}
