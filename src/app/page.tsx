import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FinalCTA } from '@/components/site/FinalCTA';
import {
  Button,
  Card,
  Container,
  GradientText,
  HeroGlow,
  NumberTicker,
  Reveal,
  Section,
  TerminalCard,
  TermCmd,
  TermK,
  TermS,
  TermCmt,
  ChatBubble,
  ChatStack,
  BantScoreRing,
  DottedGrid,
  DataFlowLine,
} from '@/components/ds';
import { FEATURES } from '@/lib/features';
import { PRICING_TIERS } from '@/lib/pricing';
import { INTEGRATIONS } from '@/lib/integrations';
import { APP_LINKS } from '@/lib/site';

export default function Home() {
  return (
    <>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative bg-paper overflow-hidden">
        <HeroGlow />
        <DottedGrid />
        <Container className="relative pt-24 pb-32 md:pt-32 md:pb-40">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-16 items-center">
            <div>
              <Reveal delay={80}>
                <h1 className="type-display-1 text-ink">
                  You only talk to <GradientText>buyers</GradientText>.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="type-body-lg text-ink-2 mt-6 max-w-[520px]">
                  OyeChats qualifies every visitor with BANT scoring, grounded in your docs,
                  streamed in real time, before your sales reps ever see them.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex gap-3 mt-9 flex-wrap items-center">
                  <Button href={APP_LINKS.register} external variant="volt" size="lg">
                    Start free <ArrowRight size={16} />
                  </Button>
                  <Button href="/docs" variant="link" size="lg">
                    Read the docs →
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200} className="lg:pl-8">
              <ChatStack>
                <ChatBubble role="visitor">
                  Hey, do you support SOC2 and self-hosted deployments?
                </ChatBubble>
                <ChatBubble role="agent">
                  Yes to SOC2 (Type II). Self-hosted is on Enterprise. Team size?
                </ChatBubble>
                <ChatBubble role="visitor">Around 40 seats, launching next quarter.</ChatBubble>
                <ChatBubble role="operator">
                  [Handoff] Hi, Priya from sales. I saw your questions. Book 15 min?
                </ChatBubble>
              </ChatStack>

              <div className="mt-8 flex items-center gap-6 justify-end">
                <BantScoreRing value={87} size={104} />
                <div className="max-w-[180px]">
                  <div className="type-mono-sm text-muted mb-1">Live score</div>
                  <div className="type-heading-3 text-ink">Enterprise, high-intent</div>
                  <div className="type-body-sm text-muted mt-1">
                    Routed to sales in 12 seconds.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════ STATS BAND ═══════════════════════ */}
      <Section tone="canvas" className="py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 max-w-4xl mx-auto text-center md:divide-x divide-line">
          <StatBand k="BANT range" v="0–100" />
          <StatBand k="Setup time" v="< 10 min" />
          <StatBand k="Webhook events" v="5 types" />
          <StatBand k="Uptime SLA" v="99.9%" />
        </div>
      </Section>

      {/* ═══════════════════════ FEATURE BENTO ═══════════════════════ */}
      <Section
        tone="paper"
        eyebrow="02 · Product"
        heading={<>Every feature. One workflow.</>}
        sub="From the first message to the closed deal, everything happens in the same thread."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.slice(0, 6).map((f, i) => (
            <Reveal key={f.slug} delay={i * 60}>
              <Card>
                <div className="w-10 h-10 rounded-[var(--r-2)] bg-volt-tint text-volt flex items-center justify-center mb-4">
                  <f.icon size={20} />
                </div>
                <h3 className="type-heading-3 text-ink mb-1">{f.title}</h3>
                <p className="type-body text-ink-2">{f.description}</p>
                <Link
                  href={`/features#${f.slug}`}
                  className="inline-flex items-center gap-1 mt-4 text-[13px] text-volt no-underline hover:underline hover:decoration-2 underline-offset-4"
                >
                  Learn more <ArrowRight size={13} />
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════ SCROLL STORY ═══════════════════════ */}
      <Section
        tone="canvas"
        eyebrow="03 · How it works"
        heading={<>Visitor lands. AI qualifies. Rep closes.</>}
        sub="Three steps, all inside a single conversation. No forms. No handoff loss."
      >
        <div className="grid md:grid-cols-3 gap-4">
          <Reveal>
            <StoryStep
              n="01"
              title="Ingest"
              body="OyeChats crawls your docs, help center, and pricing page. Hybrid semantic + keyword index built in minutes."
              demo={
                <TerminalCard title="~/oyechats · ingest" showCursor={false}>
                  <TermCmd>
                    npx <TermK>oyechats</TermK> init
                  </TermCmd>
                  <TermCmt>// crawls docs.acme.com · builds vector index · deploys</TermCmt>
                  <div className="mt-3 text-white/60">
                    → indexed <TermS>1,247</TermS> passages
                  </div>
                </TerminalCard>
              }
            />
          </Reveal>
          <Reveal delay={120}>
            <StoryStep
              n="02"
              title="Qualify"
              body="Every conversation is scored across Budget, Authority, Need, Timeline. Inferred from natural chat, no form ever."
              demo={
                <div className="bg-paper border border-line rounded-[var(--r-4)] p-6 flex flex-col gap-4 items-center">
                  <BantScoreRing value={87} size={120} />
                  <DataFlowLine
                    nodes={[
                      { label: 'chat', icon: '💬' },
                      { label: 'score', icon: '◐' },
                      { label: 'route', icon: '→' },
                    ]}
                    className="w-full"
                  />
                </div>
              }
            />
          </Reveal>
          <Reveal delay={240}>
            <StoryStep
              n="03"
              title="Route"
              body="At your threshold, we hand off to a human operator with the full transcript. Sales opens with context; the visitor never repeats themselves."
              demo={
                <ChatStack className="mt-2">
                  <ChatBubble role="operator">
                    [Handoff] Hi, Priya from sales. BANT 87. Let&apos;s book 15 min?
                  </ChatBubble>
                  <ChatBubble role="visitor">Yes, tomorrow AM?</ChatBubble>
                </ChatStack>
              }
            />
          </Reveal>
        </div>
      </Section>

      {/* ═══════════════════════ LIVE STATS ═══════════════════════ */}
      <section className="bg-ink-invert text-ink-invert-fg py-24 md:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(162,28,175,0.24), transparent 45%), radial-gradient(circle at 85% 70%, rgba(162,28,175,0.18), transparent 40%)',
          }}
          aria-hidden
        />
        <Container className="relative">
          <div className="text-center mb-14">
            <div className="type-mono-sm text-ink-invert-muted mb-4 flex items-center gap-2 justify-center">
              <span className="eyebrow-line" />
              <span>Live from the platform</span>
            </div>
            <h2 className="type-display-3 text-ink-invert-fg">
              Numbers that <GradientText variant="volt-only">move</GradientText>.
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 md:gap-12">
            <BigStat n={87} suffix="%" k="Rep meetings with qualified buyers" />
            <BigStat n={3} suffix="×" k="Fewer unqualified meetings" />
            <BigStat n={2} suffix=" min" prefix="<" k="Time to qualified handoff" />
            <BigStat n={10} suffix=" min" k="Average setup time" />
          </div>
        </Container>
      </section>

      {/* ═══════════════════════ INTEGRATIONS PREVIEW ═══════════════════════ */}
      <Section
        tone="paper"
        eyebrow="04 · Integrations"
        heading={<>Ships to 30+ platforms.</>}
        sub="One script tag installs everywhere. Push to any CRM. Automate with Zapier or Make."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INTEGRATIONS.slice(0, 12).map((i, idx) => (
            <Reveal key={i.id} delay={idx * 30}>
              <div className="bg-canvas border border-line rounded-[var(--r-3)] p-4 flex flex-col items-start hover:border-volt/40 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(162,28,175,0.18)] transition-all duration-300 h-full">
                <div className="w-10 h-10 rounded-[var(--r-2)] bg-paper border border-line flex items-center justify-center mb-3">
                  {i.icon}
                </div>
                <div className="type-body-sm text-ink font-medium">{i.name}</div>
                <div className="type-mono-sm text-muted mt-0.5">{i.install}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-8">
          <Button href="/integrations" variant="ghost">
            See all integrations →
          </Button>
        </div>
      </Section>

      {/* ═══════════════════════ PRICING PREVIEW ═══════════════════════ */}
      <Section
        tone="canvas"
        eyebrow="05 · Pricing"
        heading={<>Simple, credit-based pricing.</>}
        sub="Start free. Scale credits as you grow. Cancel anytime."
      >
        <div className="grid md:grid-cols-3 gap-4">
          {PRICING_TIERS.filter((t) => t.id !== 'enterprise').map((tier, idx) => (
            <Reveal key={tier.id} delay={idx * 100}>
              <div
                className={`bg-canvas rounded-[var(--r-4)] p-7 shadow-[var(--e-1)] flex flex-col relative h-full ${
                  tier.featured
                    ? 'border-[1.5px] border-volt border-beam'
                    : 'border border-line'
                }`}
              >
                {tier.featured && (
                  <span className="absolute top-4 right-4 font-mono text-[10px] font-medium text-volt-ink bg-volt-tint px-2 py-1 rounded-[var(--r-1)] border border-volt-line animate-badge-glow">
                    Recommended
                  </span>
                )}
                <div className="type-mono-sm text-muted mb-3">{tier.name}</div>
                <div className="font-display font-semibold text-[44px] leading-none text-ink tabular-nums mb-1 tracking-[-0.03em]">
                  {tier.monthlyPrice === null
                    ? 'Custom'
                    : tier.monthlyPrice === 0
                    ? 'Free'
                    : `$${tier.monthlyPrice}`}
                  {tier.monthlyPrice && tier.monthlyPrice > 0 && (
                    <span className="text-[14px] text-muted font-normal ml-1">/mo</span>
                  )}
                </div>
                <p className="type-body-sm text-muted mb-6">{tier.tagline}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.slice(0, 5).map((f) => (
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
          ))}
        </div>
        <div className="mt-8">
          <Button href="/pricing" variant="link">
            See full pricing comparison →
          </Button>
        </div>
      </Section>

      {/* ═══════════════════════ FINAL CTA: Live Console ═══════════════════════ */}
      <FinalCTA />
    </>
  );
}

function StatBand({ k, v }: { k: string; v: string }) {
  return (
    <div className="px-2">
      <div className="font-display font-semibold text-[32px] md:text-[38px] leading-none text-ink tracking-[-0.02em]">
        {v}
      </div>
      <div className="type-mono-sm text-muted mt-2">{k}</div>
    </div>
  );
}

function StoryStep({
  n,
  title,
  body,
  demo,
}: {
  n: string;
  title: string;
  body: string;
  demo: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="type-mono-sm text-volt">{n}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <h3 className="type-heading-1 text-ink">{title}</h3>
      <p className="type-body text-ink-2 max-w-md">{body}</p>
      <div className="mt-2">{demo}</div>
    </div>
  );
}

function BigStat({
  n,
  suffix,
  prefix,
  k,
}: {
  n: number;
  suffix?: string;
  prefix?: string;
  k: string;
}) {
  return (
    <div>
      <div className="font-display font-semibold text-[clamp(2.5rem,3vw+1rem,4rem)] leading-none text-ink-invert-fg tabular-nums tracking-[-0.04em]">
        <NumberTicker value={n} suffix={suffix} prefix={prefix} />
      </div>
      <div className="type-mono-sm text-ink-invert-muted mt-3">{k}</div>
    </div>
  );
}
