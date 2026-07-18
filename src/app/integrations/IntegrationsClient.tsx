'use client';

import { useId, useMemo, useState } from 'react';
import { Search, MessageSquare, ArrowRight, Zap } from 'lucide-react';
import { PillHighlight, useCenteredTabs } from '@/components/site/pill-tabs';
import {
  Callout,
  Chip,
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  Input,
  Reveal,
  Section,
} from '@/components/ds';
import {
  INTEGRATIONS,
  INTEGRATION_CATEGORIES,
  type IntegrationCategory,
} from '@/lib/integrations';

const WEBHOOK_STEPS = [
  {
    n: '01',
    title: 'Add a webhook URL',
    desc: 'In your OyeChats dashboard under Settings → Webhooks, paste the endpoint on your side that should receive events. HMAC secret is generated automatically.',
  },
  {
    n: '02',
    title: 'Choose your events',
    desc: 'Pick from five event types: tier_transition, lead_captured, handoff_requested, meeting_booked, chat_closed. Each fires once per business fact.',
  },
  {
    n: '03',
    title: 'Verify the signature',
    desc: 'Every request carries an X-OyeChats-Signature header (HMAC-SHA256 over the raw body). Reject anything that fails verification or is older than 5 minutes.',
  },
];

const WEBHOOK_PAYLOAD = `{
  "event": "tier_transition",
  "bot_id": 42,
  "timestamp": "2026-04-11T14:23:05Z",
  "data": {
    "session_id": "conv_8f3a2b1c",
    "lead": {
      "name": "Sarah Chen",
      "email": "sarah@acme.com"
    },
    "bant": {
      "budget": 82,
      "authority": 91,
      "need": 74,
      "timeline": 68,
      "composite": 79,
      "tier": "hot"
    }
  }
}`;

export default function IntegrationsClient() {
  const [cat, setCat] = useState<IntegrationCategory | 'all'>('all');
  const [q, setQ] = useState('');
  const highlightId = useId();
  const tabsRef = useCenteredTabs<HTMLDivElement>(cat);

  // Only show categories that actually have integrations (plus "All"), so an
  // empty filter can never be selected.
  const categories = useMemo(
    () =>
      INTEGRATION_CATEGORIES.filter(
        (c) => c.id === 'all' || INTEGRATIONS.some((i) => i.category === c.id)
      ),
    []
  );

  const filtered = useMemo(() => {
    return INTEGRATIONS.filter((i) => {
      if (cat !== 'all' && i.category !== cat) return false;
      if (q && !i.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [cat, q]);

  return (
    <>
      <section className="relative bg-paper overflow-hidden">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-16 md:pt-20 md:pb-20 text-center">
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            Works with your whole <GradientText>setup</GradientText>.
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            One script tag installs everywhere. Every event is sent straight to your CRM, automation
            tool, or analytics platform.
          </p>
          <div className="mt-8 max-w-md mx-auto relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-2" aria-hidden />
            <Input
              placeholder="Search integrations…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-11"
            />
          </div>
        </Container>
      </section>

      <div className="border-b border-line bg-canvas">
        <Container>
          <div ref={tabsRef} className="flex gap-2 py-4 overflow-x-auto">
            {categories.map((c) => {
              const active = cat === c.id;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  data-active={active || undefined}
                  aria-pressed={active}
                  className={`relative shrink-0 inline-flex items-center px-3.5 py-2 min-h-10 rounded-[var(--r-full)] type-mono-sm border transition-colors ${
                    active
                      ? 'text-paper border-transparent'
                      : 'bg-canvas text-muted border-line hover:border-line-2 hover:text-ink'
                  }`}
                >
                  {active && <PillHighlight layoutId={highlightId} />}
                  <span className="relative z-10">{c.label}</span>
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      <Section tone="paper" containerSize="wide">
        {filtered.length === 0 ? (
          <div className="type-body text-muted text-center py-16">
            No integrations match your search yet. Try a different name, or clear the filters to see
            everything. Every event also ships to any tool via signed webhooks.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((i, idx) => (
              <Reveal
                key={i.id}
                delay={idx * 60}
                className="bg-canvas border border-line rounded-[var(--r-3)] p-5 flex flex-col items-start hover:border-volt/40 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(162,28,175,0.18)] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-[var(--r-2)] bg-paper border border-line flex items-center justify-center mb-4">
                  {i.icon}
                </div>
                <div className="type-heading-3 text-ink mb-1">{i.name}</div>
                <div className="type-body-sm text-ink-2 mb-3">{i.description}</div>
                <div className="mt-auto flex gap-2 items-center flex-wrap">
                  <Chip variant="mono">{i.install}</Chip>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      {/* Webhook setup section */}
      <Section
        tone="canvas"
        eyebrow="Push events"
        heading={<>Webhook setup in three steps.</>}
        sub="OyeChats POSTs a signed JSON payload to your endpoint whenever a business event fires."
        containerSize="wide"
      >
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {WEBHOOK_STEPS.map((s, idx) => (
            <Reveal
              key={s.n}
              delay={idx * 60}
              className="bg-canvas border border-line rounded-[var(--r-4)] p-6 shadow-[var(--e-1)]"
            >
              <div className="type-mono-sm text-volt mb-3">{s.n}</div>
              <h3 className="type-heading-3 text-ink mb-2">{s.title}</h3>
              <p className="type-body-sm text-ink-2">{s.desc}</p>
            </Reveal>
          ))}
        </div>

        {/* Data flow diagram */}
        <div className="mb-10 bg-canvas border border-line rounded-[var(--r-4)] p-8 shadow-[var(--e-1)]">
          {/* Stacks vertically on mobile — the connecting arrows are row-only
              (flex-1 horizontal rules) so they're hidden below md. */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <FlowNode icon={<MessageSquare size={18} />} label="Chat event" />
            <FlowArrow />
            <FlowNode icon={<Zap size={18} />} label="OyeChats API" />
            <FlowArrow />
            <FlowNode
              icon={<span className="font-mono text-[10px]">HMAC</span>}
              label="Signed payload"
            />
            <FlowArrow />
            <FlowNode icon={<ArrowRight size={18} />} label="Your endpoint" />
          </div>
        </div>

        {/* Example payload */}
        <h3 className="type-heading-3 text-ink mb-3">Example payload</h3>
        <div className="rounded-[var(--r-4)] border border-white/8 overflow-hidden bg-ink-invert">
          <div className="border-b border-white/8 px-5 py-3 flex items-center justify-between">
            <span className="font-mono text-[12px] text-white/50">JSON</span>
            <span className="font-mono text-[11px] text-white/40">tier_transition</span>
          </div>
          <pre className="p-5 text-[12px] font-mono text-white/75 overflow-x-auto leading-loose">
            {WEBHOOK_PAYLOAD}
          </pre>
        </div>

        <div className="mt-5">
          <Callout variant="info" title="Signature verification">
            Every webhook request includes an{' '}
            <code className="font-mono text-[12px] text-volt bg-volt-tint border border-volt-line px-1.5 py-0.5 rounded-[var(--r-1)]">
              X-OyeChats-Signature
            </code>{' '}
            header (HMAC-SHA256 over the raw body). Verify it in your handler before processing.
            Reject any request more than 5 minutes old to block replay attacks.
          </Callout>
        </div>
      </Section>
    </>
  );
}

function FlowNode({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <div className="w-11 h-11 rounded-[var(--r-3)] bg-canvas border border-line shadow-[var(--e-1)] flex items-center justify-center text-volt">
        {icon}
      </div>
      <div className="type-mono-sm text-muted text-center max-w-[100px] leading-tight">
        {label}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div
      className="hidden md:block flex-1 h-0.5 relative min-w-[24px]"
      style={{
        backgroundImage: 'linear-gradient(90deg, var(--volt) 50%, transparent 50%)',
        backgroundSize: '10px 2px',
      }}
    >
      <span
        className="absolute -top-[3px] w-2 h-2 rounded-full bg-volt animate-flow"
        aria-hidden
      />
    </div>
  );
}
