'use client';

/**
 * Root error boundary — catches failures in the root layout itself, which the
 * route-level error.tsx cannot. It REPLACES the layout, so it must render its
 * own <html> and <body> and cannot rely on globals.css, the font variables, or
 * any design-system component. Hence the inline styles: they mirror the brand
 * tokens (--paper, --ink, --ink-2, --volt) rather than importing them.
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
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAFAF7',
          color: '#0A0A0A',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: 34, margin: 0, letterSpacing: '-0.02em' }}>Something broke.</h1>
          <p style={{ color: '#3F3F46', marginTop: 12, fontSize: 16, lineHeight: 1.6 }}>
            Reload the page, or come back in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 28,
              padding: '13px 26px',
              borderRadius: 8,
              border: 0,
              background: '#7C3AED',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          {error.digest ? (
            <p style={{ color: '#71717A', marginTop: 20, fontSize: 12 }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
