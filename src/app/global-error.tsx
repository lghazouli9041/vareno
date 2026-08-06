"use client";

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
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#FAFAF8",
          color: "#111111",
          fontFamily:
            "Manrope, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#C9A14A",
            }}
          >
            VARENO
          </p>
          <h1
            style={{
              margin: "1rem 0 0.75rem",
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: "2.5rem",
              fontWeight: 500,
            }}
          >
            Something went wrong
          </h1>
          <p style={{ margin: 0, color: "#6B6B6B", fontSize: 14 }}>
            {error.digest
              ? `Reference ${error.digest}`
              : "Please try again in a moment."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "1.75rem",
              border: "1px solid #111111",
              background: "#111111",
              color: "#FAFAF8",
              padding: "0.85rem 1.4rem",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
