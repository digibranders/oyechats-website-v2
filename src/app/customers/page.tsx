import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  Chip,
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  Reveal,
  Section,
} from '@/components/ds';
import { AUDIENCE_PERSONAS, CUSTOMERS } from '@/lib/customers';

export const metadata: Metadata = {
  title: 'Use Cases',
  description:
    'See how e-commerce, SaaS, and agency teams use OyeChats to answer questions from their own docs, qualify leads with BANT scoring, and hand off to a human at the right moment.',
  alternates: { canonical: '/customers' },
};

export default function CustomersPage() {
  return (
    <>
      <section className="relative bg-paper overflow-hidden">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-16 md:pt-32 md:pb-24 text-center">
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            Built for teams that turn chat into <GradientText>pipeline</GradientText>.
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            OyeChats is the chat layer for teams that treat every visitor as a potential customer.
            Here&apos;s how different teams put it to work, from answering questions to qualifying and handing off leads.
          </p>
        </Container>
      </section>

      <Section
        tone="canvas"
        eyebrow="Who it's for"
        heading={<>Three ways teams put OyeChats to work.</>}
        containerSize="wide"
      >
        <div className="grid md:grid-cols-3 gap-4">
          {AUDIENCE_PERSONAS.map((p, i) => (
            <Reveal key={p.audience} delay={i * 80}>
              <div className="bg-canvas border border-line rounded-[var(--r-4)] p-6 h-full flex flex-col hover:border-volt/40 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(162,28,175,0.14)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-[var(--r-3)] bg-volt-tint border border-volt-line flex items-center justify-center text-volt">
                    <p.logo size={20} />
                  </div>
                  <div>
                    <div className="type-heading-3 text-ink">{p.audience}</div>
                    <div className="type-mono-sm text-muted">{p.industry}</div>
                  </div>
                </div>
                <p className="type-body-sm text-ink-2 mb-4 flex-1">{p.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <Chip key={t} variant="soft">
                      {t}
                    </Chip>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        tone="paper"
        eyebrow="Case studies"
        heading={<>Real teams, real outcomes.</>}
        containerSize="wide"
      >
        <div className="grid md:grid-cols-3 gap-4">
          {CUSTOMERS.map((c, i) => (
            <Reveal key={c.slug} delay={i * 80}>
              <Link
                href={`/customers/${c.slug}`}
                className="group bg-canvas border border-line rounded-[var(--r-4)] p-7 shadow-[var(--e-1)] hover:shadow-[0_20px_40px_-16px_rgba(162,28,175,0.14)] hover:-translate-y-1 hover:border-volt/40 transition-all duration-300 flex flex-col no-underline h-full"
              >
                <Chip variant="mono">{c.industry}</Chip>
                <h3 className="type-heading-1 text-ink mt-4 mb-3">{c.company}</h3>
                <p className="type-body-sm text-ink-2 mb-6 flex-1">{c.summary}</p>
                <div className="grid grid-cols-3 gap-3 border-t border-line pt-4">
                  {c.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="font-display font-semibold text-[22px] text-ink tabular-nums tracking-[-0.02em] leading-none">
                        {m.value}
                      </div>
                      <div className="type-mono-sm text-muted mt-1.5 leading-tight">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 inline-flex items-center gap-1 text-[13px] text-volt">
                  Read case study{' '}
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
