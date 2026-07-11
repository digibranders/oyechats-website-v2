import Link from 'next/link';
import { Button, Chip, Container, DottedGrid, GradientText, HeroGlow } from '@/components/ds';

export default function NotFound() {
  return (
    <section className="relative bg-paper overflow-hidden min-h-[70vh] flex items-center">
      <HeroGlow />
      <DottedGrid />
      <Container className="relative text-center">
        <Chip variant="mono">404 · not found</Chip>
        <h1 className="type-display-1 text-ink mt-6">
          Nothing <GradientText>here</GradientText>.
        </h1>
        <p className="type-body-lg text-ink-2 mt-6 max-w-md mx-auto">
          The page you&apos;re looking for moved, was renamed, or never existed.
        </p>
        <div className="mt-9 flex justify-center gap-3 flex-wrap">
          <Button href="/" variant="volt" size="lg">
            Back home
          </Button>
          <Button href="/docs" variant="ghost" size="lg">
            Read the docs
          </Button>
        </div>
      </Container>
    </section>
  );
}
