"use client";

/**
 * Catastrophic error boundary — replaces the root layout if it (or something very
 * high in the tree) throws. Must render its own <html>/<body>. Styles are inline
 * since globals.css may not have loaded.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#faf6f1",
          color: "#5b1f3b",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Something went wrong</h1>
        <p style={{ maxWidth: 420, color: "#6b6b6b" }}>
          We hit an unexpected problem. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "1.25rem",
            padding: "0.65rem 1.25rem",
            borderRadius: "0.375rem",
            border: "none",
            background: "#b5305f",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
