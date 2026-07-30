'use client';

import { useEffect } from 'react';
import { Button, Chip, Container, DottedGrid, GradientText, HeroGlow } from '@/components/ds';

/**
 * Route-level error boundary.
 *
 * Without one, any runtime throw in a client component — HeroDemo's async
 * script runner, SystemStatus's fetch, ScrollSpyToc's DOM reads — unwinds to
 * Next's default error page and blanks the whole route. On a marketing site
 * that is a lost conversion, not a stack trace.
 *
 * Deliberately no loading.tsx alongside this: every route is statically
 * prerendered, so there is no streaming gap to fill and one would only add a
 * flash. Styling mirrors not-found.tsx so the site keeps its own chrome.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative bg-paper overflow-hidden min-h-[70vh] flex items-center">
      <HeroGlow />
      <DottedGrid />
      <Container className="relative text-center">
        <Chip variant="mono">error</Chip>
        <h1 className="type-display-1 text-ink mt-6">
          Something <GradientText>broke</GradientText>.
        </h1>
        <p className="type-body-lg text-ink-2 mt-6 max-w-md mx-auto">
          That one is on us. Try again, or head back home.
        </p>
        <div className="mt-9 flex justify-center gap-3 flex-wrap">
          <Button onClick={reset} variant="volt" size="lg">
            Try again
          </Button>
          <Button href="/" variant="ghost" size="lg">
            Back home
          </Button>
        </div>
      </Container>
    </section>
  );
}
