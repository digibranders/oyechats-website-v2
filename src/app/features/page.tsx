import type { Metadata } from 'next';
import Link from 'next/link';
import { ScrollSpyToc } from '@/components/site/ScrollSpyToc';
import {
  FileText,
  Scissors,
  Brain,
  Search,
  Zap,
  MessageCircle,
  BarChart3,
  ArrowRight,
  Check,
} from 'lucide-react';
import {
  BantScoreRing,
  Button,
  Callout,
  ChatBubble,
  ChatStack,
  Chip,
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  Section,
} from '@/components/ds';
import { APP_LINKS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Every OyeChats feature: hybrid RAG, BANT scoring, live handoff, analytics, webhooks, integrations. One AI chatbot with full sales intelligence.',
  alternates: { canonical: '/features' },
};

const NAV = [
  { id: 'rag', label: 'Grounded answers' },
  { id: 'bant', label: 'Lead scoring' },
  { id: 'live-chat', label: 'Live chat' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'integrations', label: 'Integrations' },
];

const RAG_STEPS = [
  { icon: FileText, label: 'Add your content', desc: 'PDFs, Word files, URLs, or a full website crawl, any content you own.' },
  { icon: Scissors, label: 'Prepare it', desc: 'We split your content into clean, searchable pieces and remove duplicates.' },
  { icon: Brain, label: 'Understand it', desc: 'Turns your content into a form the AI can search by meaning, not just exact words.' },
  { icon: Search, label: 'Smart search', desc: 'Meaning-based and keyword search work together, so the right answer surfaces every time.' },
  { icon: Zap, label: 'Write the answer', desc: 'Writes a reply from the right sources, with citations back to your docs.' },
  { icon: MessageCircle, label: 'Reply in real time', desc: 'The answer streams back word by word as it is written, no waiting.' },
];

const BANT_CRITERIA = [
  { key: 'B', label: 'Budget', score: 85, desc: 'Reads budget fit from what the visitor says.' },
  { key: 'A', label: 'Authority', score: 72, desc: 'Spots who the decision-maker is.' },
  { key: 'N', label: 'Need', score: 91, desc: 'Picks up on pain points and urgency.' },
  { key: 'T', label: 'Timeline', score: 68, desc: 'Catches when they plan to buy.' },
];

const BANT_TIMELINE = [
  { time: '0:12', event: 'Visitor asks about pricing.', tier: null },
  { time: '0:45', event: 'Mentions "Q2 budget approval".', tier: 'Budget signal detected ↑' },
  { time: '1:20', event: '"We need to deploy for 50 agents".', tier: 'Need signal strong ↑' },
  { time: '2:05', event: '"I am the VP of Sales here".', tier: 'Authority confirmed ↑' },
  { time: '2:40', event: 'BANT score reaches 84, webhook fired.', tier: 'Hot Lead' },
];

const ANALYTICS_METRICS = [
  { label: 'Conversations today', value: 342, trend: '+18%' },
  { label: 'Avg BANT score', value: 73, trend: '+4' },
  { label: 'Handoffs to sales', value: 47, trend: '+9' },
  { label: 'CSAT (1 to 5)', value: 4.7, trend: '+0.1' },
];

const WEBHOOK_EVENTS = [
  { event: 'tier_transition', desc: 'Visitor crosses a qualification tier (warm to hot, etc.).' },
  { event: 'lead_captured', desc: 'Visitor submitted name and email via the lead form.' },
  { event: 'handoff_requested', desc: 'Visitor asked to speak with a human operator.' },
  { event: 'meeting_booked', desc: 'Visitor booked a meeting via Calendly or Zcal.' },
  { event: 'chat_closed', desc: 'Chat session ended with optional rating.' },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="relative bg-paper overflow-hidden">
        <HeroGlow />
        <DottedGrid />
        <Container className="relative pt-24 pb-16 md:pt-32 md:pb-20 text-center">
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            Everything you need, <GradientText>built in</GradientText>.
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            Grounded answers. Lead scoring. Live chat. Analytics. Webhooks. Integrations. Each one
            is deep, and they all work together, no bolt-ons.
          </p>
        </Container>
      </section>

      <div className="sticky top-16 z-30 bg-canvas/90 backdrop-blur-md border-y border-line">
        <Container>
          <ScrollSpyToc
            variant="pills"
            className="py-4"
            items={NAV.map((n) => ({ id: `feature-${n.id}`, label: n.label }))}
          />
        </Container>
      </div>

      <section id="feature-rag" className="scroll-mt-32 py-24 md:py-32 bg-paper border-t border-line">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="type-mono-sm text-volt mb-3">Grounded answers</div>
              <h2 className="type-display-3 text-ink mb-5">
                Answers that actually <GradientText>understand</GradientText> the question.
              </h2>
              <p className="type-body text-ink-2 mb-6">
                OyeChats does not just search your documents, it understands them. Hybrid AI search
                combines semantic understanding with keyword precision so visitors get accurate,
                grounded answers backed by citations to your own content.
              </p>
              <ul className="space-y-3">
                {[
                  'Supports PDFs, Word docs, plain text, URLs, and full website crawls',
                  'Production-grade vector storage built for scale',
                  'Custom AI instructions per bot with citation grounding',
                  'Automatic re-indexing when you add or remove documents',
                  'Optional reranking and relevance filtering for precise answers',
                ].map((it) => (
                  <li key={it} className="flex items-start gap-2.5 type-body-sm text-ink-2">
                    <Check size={14} className="text-signal shrink-0 mt-1" strokeWidth={3} />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              {RAG_STEPS.map((s, i) => (
                <div
                  key={s.label}
                  className="flex items-center gap-4 bg-canvas border border-line rounded-[var(--r-3)] p-4 shadow-[var(--e-1)] group hover:border-volt/40 transition-colors"
                >
                  <div className="w-11 h-11 rounded-[var(--r-2)] bg-volt-tint text-volt flex items-center justify-center shrink-0 group-hover:bg-volt group-hover:text-white transition-colors">
                    <s.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="type-body-sm text-ink font-semibold">
                      <span className="text-volt font-mono text-[11px] mr-2">{String(i + 1).padStart(2, '0')}</span>
                      {s.label}
                    </div>
                    <div className="type-mono-sm text-muted mt-0.5">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="feature-bant" className="scroll-mt-32 py-24 md:py-32 bg-canvas border-t border-line">
        <Container>
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-start">
            <div className="flex flex-col items-center gap-8">
              <div className="bg-paper border border-line rounded-[var(--r-4)] p-8 w-full flex flex-col items-center shadow-[var(--e-1)]">
                <BantScoreRing value={84} size={160} label="BANT" />
                <p className="mt-4 type-mono-sm text-muted">Composite BANT Score</p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                {BANT_CRITERIA.map((c) => (
                  <div key={c.key} className="bg-canvas border border-line rounded-[var(--r-3)] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="type-mono-sm text-muted font-semibold">{c.label}</span>
                      <span className="font-display font-semibold text-ink tabular-nums">
                        {c.score}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-line overflow-hidden">
                      <div
                        className="h-full rounded-full bg-volt transition-all"
                        style={{ width: `${c.score}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-ink-2 mt-2 leading-tight">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="type-mono-sm text-volt mb-3">BANT Scoring</div>
              <h2 className="type-display-3 text-ink mb-5">
                Qualify every lead <GradientText>automatically</GradientText>.
              </h2>
              <p className="type-body text-ink-2 mb-8">
                BANT (Budget, Authority, Need, Timeline) is the gold standard in B2B sales
                qualification. OyeChats analyzes every conversation and scores all four dimensions
                into a composite 0 to 100 lead score, firing webhooks the moment a visitor becomes a
                hot lead.
              </p>

              <div className="type-mono-sm text-muted mb-4">Live conversation timeline</div>
              <div className="space-y-3">
                {BANT_TIMELINE.map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="font-mono text-[11px] text-muted mt-0.5 w-10 shrink-0 tabular-nums">
                      {e.time}
                    </span>
                    <div className="flex-1">
                      <p className="type-body-sm text-ink-2">{e.event}</p>
                      {e.tier && (
                        <Chip variant={e.tier.includes('Hot') ? 'alert' : 'soft'} className="mt-1">
                          {e.tier}
                        </Chip>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="feature-live-chat" className="scroll-mt-32 py-24 md:py-32 bg-paper border-t border-line">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="type-mono-sm text-volt mb-3">Live Chat</div>
              <h2 className="type-display-3 text-ink mb-5">
                A real human, exactly <GradientText>when</GradientText> it matters.
              </h2>
              <p className="type-body text-ink-2 mb-6">
                Bot first, human second. When a visitor wants to talk to someone, OyeChats routes
                them to the right department in seconds, with the full transcript, visitor profile,
                and BANT score handed over.
              </p>
              <ul className="space-y-3">
                {[
                  'One-click bot-to-human handoff, with transcript context',
                  'Department routing and load balancing across operators',
                  'Canned responses with keyboard shortcuts like /hello',
                  'Real-time typing indicators over WebSocket',
                  'Post-chat rating from 1 to 5 stars, stored per session',
                ].map((it) => (
                  <li key={it} className="flex items-start gap-2.5 type-body-sm text-ink-2">
                    <Check size={14} className="text-signal shrink-0 mt-1" strokeWidth={3} />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-canvas border border-line rounded-[var(--r-4)] p-6 shadow-[var(--e-1)]">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-line">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-volt-tint border border-volt-line flex items-center justify-center font-mono font-semibold text-[12px] text-volt-ink">
                    PM
                  </div>
                  <div>
                    <div className="type-body-sm text-ink font-semibold">Priya M</div>
                    <div className="type-mono-sm text-signal flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-signal signal-dot-pulse inline-block" />
                      Online · Sales
                    </div>
                  </div>
                </div>
                <Chip variant="soft">BANT · 87</Chip>
              </div>
              <ChatStack>
                <ChatBubble role="visitor">How do you handle our data?</ChatBubble>
                <ChatBubble role="agent">
                  Encrypted in transit and at rest, GDPR-aligned, and we never train models on your
                  data. Want the details?
                </ChatBubble>
                <ChatBubble role="visitor">Yes, we&apos;re rolling out to ~40 seats in Q3.</ChatBubble>
                <ChatBubble role="operator">
                  [Handoff, BANT 87] Priya here. I have your context. 15 min tomorrow?
                </ChatBubble>
              </ChatStack>
            </div>
          </div>
        </Container>
      </section>

      <section id="feature-analytics" className="scroll-mt-32 py-24 md:py-32 bg-canvas border-t border-line">
        <Container>
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
            <div className="bg-paper border border-line rounded-[var(--r-4)] p-6 shadow-[var(--e-1)]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-line">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-volt" />
                  <span className="type-mono-sm text-muted">/analytics/dashboard</span>
                </div>
                <Chip variant="soft">Sample</Chip>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {ANALYTICS_METRICS.map((m) => (
                  <div key={m.label} className="bg-canvas border border-line rounded-[var(--r-3)] p-4">
                    <div className="type-mono-sm text-muted mb-1">{m.label}</div>
                    <div className="flex items-baseline gap-2">
                      <div className="font-display font-semibold text-[26px] text-ink tabular-nums tracking-[-0.02em] leading-none">
                        {m.value}
                      </div>
                      <div className="type-mono-sm text-signal">{m.trend}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-line">
                <div className="flex items-center justify-between type-mono-sm text-muted mb-2">
                  <span>Conversations · last 7 days</span>
                  <span className="text-signal">+22%</span>
                </div>
                <svg viewBox="0 0 100 30" className="w-full h-10" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="a" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--volt)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--volt)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,20 L14,17 L28,18 L42,12 L56,15 L70,8 L84,10 L100,4 L100,30 L0,30 Z"
                    fill="url(#a)"
                  />
                  <path
                    d="M0,20 L14,17 L28,18 L42,12 L56,15 L70,8 L84,10 L100,4"
                    fill="none"
                    stroke="var(--volt)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <div>
              <div className="type-mono-sm text-volt mb-3">Analytics</div>
              <h2 className="type-display-3 text-ink mb-5">
                See what actually <GradientText>converts</GradientText>.
              </h2>
              <p className="type-body text-ink-2 mb-6">
                Live dashboards, lead qualification funnels, top-question reports, and post-chat
                CSAT ratings. Filter by date, campaign, UTM, and visitor cohort.
              </p>
              <ul className="space-y-3">
                {[
                  'Conversation, lead, and message counters updated in real time',
                  'Top asked questions grouped by intent',
                  'Lead qualification funnel with drop-off analysis',
                  'BANT score distribution across visitor cohorts',
                  'CSAT ratings per operator and bot',
                ].map((it) => (
                  <li key={it} className="flex items-start gap-2.5 type-body-sm text-ink-2">
                    <Check size={14} className="text-signal shrink-0 mt-1" strokeWidth={3} />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section id="feature-webhooks" className="scroll-mt-32 py-24 md:py-32 bg-paper border-t border-line">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="type-mono-sm text-volt mb-3">Webhooks and REST API</div>
              <h2 className="type-display-3 text-ink mb-5">
                Send every event to your own <GradientText>tools</GradientText>.
              </h2>
              <p className="type-body text-ink-2 mb-6">
                Five signed webhook events plus a full REST API. Send leads to your CRM, ping your
                team on Slack, trigger a Zap, or build your own automation.
              </p>

              <div className="space-y-2.5">
                {WEBHOOK_EVENTS.map((e) => (
                  <div
                    key={e.event}
                    className="flex items-start gap-4 bg-canvas border border-line rounded-[var(--r-3)] px-4 py-3"
                  >
                    <code className="font-mono text-[12px] text-volt bg-volt-tint border border-volt-line px-2 py-0.5 rounded-[var(--r-1)] shrink-0">
                      {e.event}
                    </code>
                    <p className="type-body-sm text-ink-2">{e.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Callout variant="info" title="HMAC-signed">
                  Every request carries an{' '}
                  <code className="font-mono text-[12px]">X-OyeChats-Signature</code> header. Verify
                  before processing to block replay attacks.
                </Callout>
              </div>
            </div>

            <div>
              <div className="rounded-[var(--r-4)] border border-white/8 overflow-hidden bg-ink-invert shadow-[var(--e-2)]">
                <div className="h-9 px-4 flex items-center justify-between border-b border-white/8">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="font-mono text-[11px] text-white/50">webhook · tier_transition</div>
                </div>
                <pre className="p-5 text-[12px] font-mono text-white/75 overflow-x-auto leading-loose">
{`POST https://your.app/hooks/oyechats
X-OyeChats-Signature: v1=8f2a1c...
X-OyeChats-Timestamp: 1739299200
Content-Type: application/json

{
  "event": "tier_transition",
  "bot_id": 42,
  "data": {
    "lead": {
      "name": "Sarah Chen",
      "email": "sarah@acme.com"
    },
    "bant": {
      "composite": 79,
      "tier": "hot"
    }
  }
}`}
                </pre>
              </div>
              <div className="mt-4">
                <Link
                  href="/docs#webhooks"
                  className="type-mono-md text-volt hover:underline no-underline inline-flex items-center gap-1"
                >
                  Full webhook docs <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="feature-integrations" className="scroll-mt-32 py-24 md:py-32 bg-canvas border-t border-line">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="type-mono-sm text-volt mb-3">Integrations</div>
              <h2 className="type-display-3 text-ink mb-5">
                Fits your existing <GradientText>tools</GradientText>.
              </h2>
              <p className="type-body text-ink-2 mb-6">
                WordPress, Shopify, Webflow, Next.js, React, Vue, HTML, and Framer. Booking via
                Calendly. Automation via Zapier and Make, plus 5 signed webhook events and a full
                REST API.
              </p>
              <Button href="/integrations" variant="ghost">
                Browse all integrations →
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {['WP', 'Sh', 'Wf', 'Nx', 'Vu', 'Re', 'Fr', 'Br', 'Ca', 'La', 'Se', 'Za'].map((sym) => (
                <div
                  key={sym}
                  className="aspect-square bg-canvas border border-line rounded-[var(--r-3)] flex items-center justify-center shadow-[var(--e-1)]"
                >
                  <span className="font-display font-semibold text-[15px] text-ink tracking-tight">
                    {sym}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Section
        tone="paper"
        eyebrow="Ready to go live?"
        heading={<>Try every feature. <GradientText>Free.</GradientText></>}
        sub="Every OyeChats bot starts free. Add your docs, paste one script tag, and go live in under five minutes."
        actions={
          <>
            <Button href={APP_LINKS.register} external variant="volt" size="lg">
              Start free →
            </Button>
            <Button href="/pricing" variant="ghost" size="lg">
              See pricing
            </Button>
          </>
        }
      />
    </>
  );
}
