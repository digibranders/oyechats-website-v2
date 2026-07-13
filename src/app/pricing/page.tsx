'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import {
  Accordion,
  Button,
  Callout,
  Chip,
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  Reveal,
  Section,
  Table,
  Td,
  Th,
} from '@/components/ds';
import {
  PRICING_TIERS,
  PRICING_FAQ,
  FEATURE_ROWS,
  CREDIT_COSTS,
  TOPUP_PACKS,
  CATEGORY_LABELS,
  type PricingFeatureCategory,
  type PricingFeatureValue,
} from '@/lib/pricing';
import { APP_LINKS } from '@/lib/site';

const CATEGORIES: PricingFeatureCategory[] = ['usage', 'features', 'security'];

function renderCell(v: PricingFeatureValue) {
  if (v === true) return <Check size={16} className="text-signal inline" />;
  if (v === false) return <X size={16} className="text-muted-2 inline" />;
  return <span className="type-body-sm text-ink-2">{v}</span>;
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <section className="relative bg-paper overflow-hidden">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-16 md:pt-32 md:pb-24 text-center">
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            Simple, credit-based <GradientText>pricing</GradientText>.
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            Start free. Scale as you grow. Cancel anytime.
          </p>

          <div className="mt-10 inline-flex items-center gap-1 p-1 rounded-[var(--r-full)] border border-line bg-canvas shadow-[var(--e-1)]">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-[var(--r-full)] text-[13px] font-medium transition-colors ${
                !annual ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-[var(--r-full)] text-[13px] font-medium transition-colors inline-flex items-center gap-2 ${
                annual ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
              }`}
            >
              Annual
              <span className="text-[10px] font-mono text-signal">save 20%</span>
            </button>
          </div>
        </Container>
      </section>

      <Section tone="canvas" containerSize="wide">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRICING_TIERS.map((tier, i) => {
            const price = annual ? tier.annualPrice : tier.monthlyPrice;
            return (
              <Reveal key={tier.id} delay={i * 80}>
                <div
                  className={`bg-canvas rounded-[var(--r-4)] p-7 shadow-[var(--e-1)] flex flex-col relative h-full ${
                    tier.featured ? 'border-[1.5px] border-volt border-beam' : 'border border-line'
                  }`}
                >
                  {tier.featured && tier.badge && (
                    <span className="absolute top-4 right-4 font-mono text-[10px] font-medium text-volt-ink bg-volt-tint px-2 py-1 rounded-[var(--r-1)] border border-volt-line animate-badge-glow">
                      {tier.badge}
                    </span>
                  )}
                  <div className="type-mono-sm text-muted mb-3">{tier.name}</div>
                  <div className="font-display font-semibold text-[36px] leading-none text-ink tabular-nums mb-1 tracking-[-0.03em]">
                    {price === null ? 'Custom' : price === 0 ? 'Free' : `$${price}`}
                    {price !== null && price > 0 && (
                      <span className="text-[13px] text-muted font-normal ml-1">/mo</span>
                    )}
                  </div>
                  {annual && tier.annualTotal !== null && tier.annualTotal > 0 && (
                    <div className="type-mono-sm text-muted mb-1">
                      Billed ${tier.annualTotal}/yr
                    </div>
                  )}
                  <p className="type-body-sm text-muted mb-5">{tier.tagline}</p>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="type-body-sm text-ink-2 flex items-start gap-2">
                        <span className="font-mono text-signal font-semibold mt-0.5">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    href={tier.ctaHref}
                    external={tier.ctaHref.startsWith('http')}
                    variant={tier.featured ? 'volt' : 'ghost'}
                    className="w-full"
                  >
                    {tier.cta} →
                  </Button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section
        tone="paper"
        eyebrow="How credits work"
        heading={<>Pay for what you use.</>}
        containerSize="wide"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="type-heading-2 text-ink mb-4">Credit costs</h3>
            <div className="space-y-3">
              {CREDIT_COSTS.map((c) => (
                <div
                  key={c.action}
                  className="flex items-center justify-between bg-canvas border border-line rounded-[var(--r-3)] px-5 py-4"
                >
                  <div className="type-body text-ink-2">{c.action}</div>
                  <Chip variant="soft">
                    <span className="font-mono">
                      {c.credits} credit{c.credits === 1 ? '' : 's'}
                    </span>
                  </Chip>
                </div>
              ))}
            </div>
            <Callout variant="info" className="mt-5">
              System emails (password resets, operator notifications) and live-chat operator
              messages are always free. Visitors never see &quot;credits&quot;.
            </Callout>
          </div>

          <div>
            <h3 className="type-heading-2 text-ink mb-4">Top-up packs</h3>
            <div className="space-y-3">
              {TOPUP_PACKS.map((p) => (
                <div
                  key={p.usd}
                  className={`flex items-center justify-between bg-canvas rounded-[var(--r-3)] px-5 py-4 ${
                    p.badge ? 'border-[1.5px] border-volt' : 'border border-line'
                  }`}
                >
                  <div>
                    <div className="font-display font-semibold text-ink text-[18px] tabular-nums">
                      ${p.usd}
                    </div>
                    <div className="type-mono-sm text-muted">
                      {p.credits.toLocaleString()} credits
                      {p.bonusPct > 0 && (
                        <span className="text-signal"> · +{p.bonusPct}% bonus</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="type-mono-sm text-muted">per 1k credits</div>
                    <div className="font-mono text-[13px] text-ink tabular-nums">
                      ${p.perThousandUsd.toFixed(2)}
                    </div>
                    {p.badge && (
                      <Chip variant="soft" className="mt-1.5">
                        {p.badge}
                      </Chip>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        tone="canvas"
        eyebrow="Compare"
        heading={<>Feature by feature.</>}
        containerSize="wide"
      >
        {CATEGORIES.map((cat) => {
          const rows = FEATURE_ROWS.filter((r) => r.category === cat);
          return (
            <div key={cat} className="mb-8">
              <h3 className="type-heading-3 text-ink mb-3">{CATEGORY_LABELS[cat]}</h3>
              <Table>
                <thead>
                  <tr>
                    <Th>Feature</Th>
                    <Th>Free</Th>
                    <Th>Starter</Th>
                    <Th>Standard</Th>
                    <Th>Enterprise</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label}>
                      <Td>{r.label}</Td>
                      <Td>{renderCell(r.free)}</Td>
                      <Td>{renderCell(r.starter)}</Td>
                      <Td>{renderCell(r.standard)}</Td>
                      <Td>{renderCell(r.enterprise)}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          );
        })}
      </Section>

      <Section tone="ink-invert" containerSize="wide">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <div className="type-mono-sm text-ink-invert-muted mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-volt" />
              <span>Enterprise</span>
            </div>
            <h2 className="type-display-3 text-ink-invert-fg mb-4">
              Custom volume. <span className="text-volt">Dedicated CSM.</span>
            </h2>
            <p className="type-body-lg text-ink-invert-muted max-w-lg">
              Unlimited chatbots, unlimited seats, custom SLA, and a dedicated account manager.
              Everything you need for a company-wide rollout.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[var(--r-4)] p-6">
            <div className="flex flex-col gap-3">
              <Button href="/contact?intent=enterprise" variant="volt">
                Contact sales →
              </Button>
              <Button href={APP_LINKS.register} external variant="outline-invert">
                Or start free
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper" eyebrow="FAQ" heading={<>Common questions.</>} containerSize="wide">
        <div className="max-w-3xl">
          <Accordion items={PRICING_FAQ} />
        </div>
      </Section>
    </>
  );
}
