import type { ReactNode } from 'react';
import { Zap } from 'lucide-react';
import { Button, Container } from '@/components/ds';
import { APP_LINKS } from '@/lib/site';

/** World-map style constellation of ping nodes; positions are hand-picked. */
const NODES = [
  { x: 12, y: 30, size: 5, delay: 0 },
  { x: 24, y: 55, size: 4, delay: 0.6 },
  { x: 42, y: 20, size: 4, delay: 1.2 },
  { x: 58, y: 45, size: 5, delay: 0.3 },
  { x: 76, y: 30, size: 4, delay: 0.9 },
  { x: 88, y: 60, size: 5, delay: 1.5 },
  { x: 18, y: 75, size: 3, delay: 0.4 },
  { x: 68, y: 78, size: 4, delay: 1.0 },
];

/**
 * Site-wide closing CTA. Every prop is optional and defaults to the copy this
 * component has always shipped, so existing callers render byte-identically.
 * The props exist so a route with its own argument (the case study) can supply
 * its own heading without cloning the section's markup and background, which is
 * how the two versions drifted apart in the first place.
 */
export function FinalCTA({
  eyebrow = 'Go live in 10 minutes \u00b7 every minute a lead',
  heading,
  body = 'Add OyeChats to your site in under 10 minutes. Your first qualified lead can land the same hour, every visitor scored, routed, and reported.',
  secondaryLabel = 'Talk to sales',
  secondaryHref = '/contact',
}: {
  eyebrow?: string;
  heading?: ReactNode;
  body?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
} = {}) {
  return (
    <section className="relative bg-ink-invert text-ink-invert-fg overflow-hidden py-24 md:py-20">
      {/* Background: grid + aurora + constellation */}
      <div className="absolute inset-0 console-grid opacity-70" aria-hidden />
      <div className="console-aurora" aria-hidden />

      {/* World-map style constellation of pings */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {NODES.map((n, i) => (
          <span
            key={i}
            className="absolute rounded-full node-ping"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              width: n.size,
              height: n.size,
              background: 'var(--volt)',
              animationDelay: `${n.delay}s`,
              boxShadow: '0 0 12px rgba(162,28,175,0.6)',
            }}
          />
        ))}
      </div>

      <Container className="relative">
        {/* Eyebrow */}
        <div className="text-center type-mono-sm text-ink-invert-muted mb-5 flex items-center gap-2 justify-center">
          <span className="eyebrow-line" />
          <span>{eyebrow}</span>
        </div>

        {/* Headline */}
        <h2 className="type-display-2 text-ink-invert-fg text-center max-w-4xl mx-auto">
          {heading ?? (
            <>
              <span>Never lose a </span>
              <span className="gradient-volt-only">buyer</span>
              <span> again.</span>
            </>
          )}
        </h2>

        <p className="text-center type-body-lg text-ink-invert-muted max-w-[680px] mx-auto mt-6">
          {body}
        </p>

        <div className="flex justify-center gap-3 flex-wrap mt-9">
          <Button
            href={APP_LINKS.register}
            external
            variant="volt"
            size="lg"
            className="px-5 py-2.5 min-h-11"
          >
            Start free <Zap size={15} />
          </Button>
          <Button
            href={secondaryHref}
            variant="outline-invert"
            size="lg"
            className="px-5 py-2.5 min-h-11"
          >
            {secondaryLabel}
          </Button>
        </div>

        {/* Mirrors the hero reassurance line. `--ink-invert-muted` rather than
            `--muted`: this sits on the plum-black section, where the paper-tuned
            gray would drop under AA. */}
        <p className="type-mono-sm text-ink-invert-muted text-center mt-5 text-balance">
          No credit card · Free plan forever · One script tag
        </p>
      </Container>
    </section>
  );
}
