/** Keyboard skip-to-content link — visually hidden until focused. */
export function SkipLink({ label = "Skip to main content" }: { label?: string }) {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-rose focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
    >
      {label}
    </a>
  );
}
