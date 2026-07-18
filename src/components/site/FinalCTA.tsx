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

export function FinalCTA() {
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
          <span>Go live in 10 minutes · every minute a lead</span>
        </div>

        {/* Headline */}
        <h2 className="type-display-2 text-ink-invert-fg text-center max-w-4xl mx-auto">
          <span>Never lose a </span>
          <span className="gradient-volt-only">buyer</span>
          <span> again.</span>
        </h2>

        <p className="text-center type-body-lg text-ink-invert-muted max-w-[680px] mx-auto mt-6">
          Add OyeChats to your site in under 10 minutes. Your first qualified lead can land the same
          hour, every visitor scored, routed, and reported.
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
            href="/contact"
            variant="outline-invert"
            size="lg"
            className="px-5 py-2.5 min-h-11"
          >
            Talk to sales
          </Button>
        </div>
      </Container>
    </section>
  );
}
