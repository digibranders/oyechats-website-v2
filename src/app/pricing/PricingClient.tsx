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
  PricingPrice,
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
  TAX_NOTE,
  formatPrice,
  isCurrencyText,
  type Currency,
  type PricingFeatureCategory,
  type PricingFeatureValue,
} from '@/lib/pricing';

const CATEGORIES: PricingFeatureCategory[] = ['usage', 'features', 'security'];

function renderCell(v: PricingFeatureValue, currency: Currency) {
  // lucide icons carry no ARIA of their own, so a bare Check/X left every
  // boolean cell in all three comparison tables completely unannounced, the
  // icon was the only carrier of meaning (WCAG 1.1.1). sr-only text is
  // invisible and changes nothing on screen.
  if (v === true)
    return (
      <>
        <Check size={16} aria-hidden="true" className="text-signal inline" />
        <span className="sr-only">Included</span>
      </>
    );
  if (v === false)
    return (
      <>
        <X size={16} aria-hidden="true" className="text-muted-2 inline" />
        <span className="sr-only">Not included</span>
      </>
    );
  if (isCurrencyText(v)) return <span className="type-body-sm text-ink-2">{v[currency]}</span>;
  return <span className="type-body-sm text-ink-2">{v}</span>;
}

function perThousand(price: number, credits: number, currency: Currency) {
  const value = (price / credits) * 1000;
  return currency === 'USD'
    ? `$${value.toFixed(2)}`
    : `₹${Math.round(value).toLocaleString('en-IN')}`;
}

/**
 * `currency` is resolved before render and never changes on the client. There
 * is no manual switch and no post-mount correction: `src/proxy.ts` routes
 * Indian traffic to the INR variant, so the price in the static HTML is already
 * the right one. Nothing here should reintroduce a client-side currency swap:
 * that would put the flicker back.
 */
export default function PricingClient({ currency }: { currency: Currency }) {
  const [annual, setAnnual] = useState(false);

  // Single shared "open FAQ" across both columns so only one is open at a time.
  const [openFaq, setOpenFaq] = useState<string | null>(PRICING_FAQ[0]?.q ?? null);
  const toggleFaq = (q: string) => setOpenFaq((prev) => (prev === q ? null : q));
  // Enterprise is pulled out of the four-up grid and rendered as a full-width
  // horizontal card below it: five equal columns read as cramped and waste
  // vertical space, and Enterprise is a contact-sales motion that does not
  // belong in the self-serve row anyway.
  const selfServeTiers = PRICING_TIERS.filter((t) => t.id !== 'enterprise');
  const enterpriseTier = PRICING_TIERS.find((t) => t.id === 'enterprise');

  return (
    <>
      <section className="relative bg-paper overflow-hidden">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-16 md:pt-20 md:pb-16 text-center">
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            Simple, credit-based <GradientText>pricing</GradientText>.
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            Start free. Scale as you grow. Cancel anytime.
          </p>

          <div className="mt-10 flex justify-center">
            {/* Selection was signalled by background colour alone (WCAG 1.4.1)
                and exposed no state to assistive tech. role/aria are invisible. */}
            <div
              role="group"
              aria-label="Billing period"
              className="inline-flex items-center gap-1 p-1 rounded-[var(--r-full)] border border-line bg-canvas shadow-[var(--e-1)]"
            >
              <button
                type="button"
                aria-pressed={!annual}
                onClick={() => setAnnual(false)}
                className={`px-4 py-2.5 min-h-11 inline-flex items-center justify-center rounded-[var(--r-full)] text-[13px] font-medium transition-colors ${
                  !annual ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                aria-pressed={annual}
                onClick={() => setAnnual(true)}
                className={`px-4 py-2.5 min-h-11 rounded-[var(--r-full)] text-[13px] font-medium transition-colors inline-flex items-center justify-center gap-2 ${
                  annual ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
                }`}
              >
                Annual
                <span className="text-[10px] font-mono text-signal">save 20%</span>
              </button>
            </div>
          </div>

          {/* Universal-trial reassurance. Every signup lands on the same 14-day
              trial regardless of the plan chosen, so it is stated once here,
              where the eye lands before the cards, rather than as a badge
              repeated on all four. */}
          <div className="mt-6 flex justify-center">
            <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-[var(--r-full)] border border-line bg-canvas px-4 py-2 type-body-sm text-ink-2 shadow-[var(--e-1)]">
              <Check size={15} className="text-signal shrink-0" aria-hidden />
              <span className="font-medium text-ink">14-day free trial on every plan</span>
              <span className="text-muted-2" aria-hidden>
                ·
              </span>
              <span>No credit card required</span>
            </p>
          </div>
        </Container>
      </section>

      <Section tone="canvas" containerSize="wide">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {selfServeTiers.map((tier, i) => {
            const money = annual ? tier.annualMonthly : tier.monthly;
            const price = money ? money[currency] : null;
            const annualTotal = tier.annualTotal ? tier.annualTotal[currency] : null;
            return (
              <Reveal key={tier.id} delay={i * 80} className="h-full">
                <div
                  className={`group relative h-full flex flex-col rounded-[var(--r-4)] p-7 bg-canvas transition-[transform,box-shadow,border-color] duration-300 ${
                    tier.featured
                      ? 'border-[1.5px] border-volt shadow-[0_24px_70px_-28px_rgba(162,28,175,0.45)] hover:shadow-[0_30px_80px_-24px_rgba(162,28,175,0.55)] hover:-translate-y-1.5'
                      : 'border border-line shadow-[var(--e-1)] hover:border-line-2 hover:shadow-[var(--e-2)] hover:-translate-y-1'
                  }`}
                >
                  {tier.featured && tier.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--r-full)] bg-volt text-white font-mono text-[10px] font-semibold tracking-wide whitespace-nowrap shadow-[0_8px_20px_-6px_rgba(162,28,175,0.7)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />
                      {tier.badge}
                    </span>
                  )}

                  <div className="type-mono-sm text-muted mb-3">{tier.name}</div>

                  <div className="flex items-baseline gap-1.5 mb-1 min-h-[42px]">
                    <span className="font-display font-semibold text-[40px] leading-none text-ink tabular-nums tracking-[-0.03em]">
                      {price === null ? (
                        'Custom'
                      ) : price === 0 ? (
                        'Free'
                      ) : (
                        <PricingPrice
                          key={`${annual ? 'annual' : 'monthly'}-${currency}`}
                          value={price}
                          currency={currency}
                        />
                      )}
                    </span>
                    {price !== null && price > 0 && (
                      <span className="text-[13px] text-muted font-normal">/mo</span>
                    )}
                  </div>

                  {annual && annualTotal !== null && annualTotal > 0 ? (
                    <div className="type-mono-sm text-muted mb-1">
                      Billed {formatPrice(annualTotal, currency)}/yr
                    </div>
                  ) : null}

                  <p className="type-body-sm text-muted mb-6 mt-1">{tier.tagline}</p>

                  <ul className="space-y-2.5 mb-7 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="type-body-sm text-ink-2 flex items-start gap-2.5">
                        <span className="mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-signal-tint text-signal shrink-0">
                          <Check size={11} strokeWidth={3} />
                        </span>
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

        {enterpriseTier &&
          (() => {
            const money = annual ? enterpriseTier.annualMonthly : enterpriseTier.monthly;
            const price = money ? money[currency] : null;
            const annualTotal = enterpriseTier.annualTotal
              ? enterpriseTier.annualTotal[currency]
              : null;
            return (
              <Reveal className="mt-4">
                <div className="relative overflow-hidden rounded-[var(--r-4)] border border-line-2 bg-canvas p-7 md:p-8">
                  <div className="grid gap-7 lg:grid-cols-[minmax(0,300px)_1fr] lg:items-center lg:gap-12">
                    {/* Identity, price and CTA */}
                    <div>
                      <div className="type-mono-sm text-muted mb-3">{enterpriseTier.name}</div>
                      <div className="mb-1 flex items-baseline gap-1.5">
                        <span className="font-display font-semibold text-[36px] leading-none text-ink tabular-nums tracking-[-0.03em]">
                          {price === null ? (
                            'Custom'
                          ) : (
                            <PricingPrice
                              key={`ent-${annual ? 'annual' : 'monthly'}-${currency}`}
                              value={price}
                              currency={currency}
                            />
                          )}
                        </span>
                        {price !== null && price > 0 && (
                          <span className="text-[13px] text-muted font-normal">/mo</span>
                        )}
                      </div>
                      {annual && annualTotal !== null && annualTotal > 0 ? (
                        <div className="type-mono-sm text-muted mb-1">
                          Billed {formatPrice(annualTotal, currency)}/yr
                        </div>
                      ) : null}
                      <p className="type-body-sm text-muted mt-2">{enterpriseTier.tagline}</p>
                      <Button
                        href={enterpriseTier.ctaHref}
                        external={enterpriseTier.ctaHref.startsWith('http')}
                        variant="ghost"
                        className="mt-6 w-full lg:w-auto"
                      >
                        {enterpriseTier.cta} →
                      </Button>
                    </div>

                    {/* Features, laid out horizontally so the card reads wide, not tall */}
                    <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:border-l lg:border-line lg:pl-12">
                      {enterpriseTier.features.map((f) => (
                        <li key={f} className="type-body-sm text-ink-2 flex items-start gap-2.5">
                          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-signal-tint text-signal">
                            <Check size={11} strokeWidth={3} />
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })()}

        <p className="type-body-sm text-muted mt-6">{TAX_NOTE[currency]}</p>
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
              {TOPUP_PACKS.map((p) => {
                const price = p.price[currency];
                return (
                  <div
                    key={price}
                    className={`flex items-center justify-between bg-canvas rounded-[var(--r-3)] px-5 py-4 ${
                      p.badge ? 'border-[1.5px] border-volt' : 'border border-line'
                    }`}
                  >
                    <div>
                      <div className="font-display font-semibold text-ink text-[18px] tabular-nums">
                        {formatPrice(price, currency)}
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
                        {perThousand(price, p.credits, currency)}
                      </div>
                      {p.badge && (
                        <Chip variant="soft" className="mt-1.5">
                          {p.badge}
                        </Chip>
                      )}
                    </div>
                  </div>
                );
              })}
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
                    <Th>Professional</Th>
                    <Th>Enterprise</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label}>
                      <Th scope="row">{r.label}</Th>
                      <Td>{renderCell(r.free, currency)}</Td>
                      <Td>{renderCell(r.starter, currency)}</Td>
                      <Td>{renderCell(r.standard, currency)}</Td>
                      <Td>{renderCell(r.professional, currency)}</Td>
                      <Td>{renderCell(r.enterprise, currency)}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          );
        })}
      </Section>

      <Section tone="paper" eyebrow="FAQ" heading={<>Common questions.</>} containerSize="wide">
        <div className="grid md:grid-cols-2 gap-x-10 items-start">
          <Accordion
            items={PRICING_FAQ.slice(0, Math.ceil(PRICING_FAQ.length / 2))}
            activeKey={openFaq}
            onToggle={toggleFaq}
          />
          <Accordion
            items={PRICING_FAQ.slice(Math.ceil(PRICING_FAQ.length / 2))}
            activeKey={openFaq}
            onToggle={toggleFaq}
          />
        </div>
      </Section>
    </>
  );
}
