import type { Metadata } from 'next';
import { Package, KeyRound, Brain, Zap, Lightbulb, ExternalLink } from 'lucide-react';
import {
  Button,
  Callout,
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  Reveal,
  Table,
  Th,
  Td,
} from '@/components/ds';
import { ScrollSpyToc } from '@/components/site/ScrollSpyToc';

export const metadata: Metadata = {
  title: 'Documentation',
  description:
    'Everything you need to add and configure OyeChats on your website. Install, configure, and connect webhooks.',
  alternates: { canonical: '/docs' },
};

const QUICK_START = [
  { icon: Package, step: '1', title: 'Install the widget', desc: 'Add a single script tag to your site and the chat widget appears instantly.', anchor: '#widget' },
  { icon: KeyRound, step: '2', title: 'Get your bot key', desc: 'Find your unique bot key in the dashboard under Settings, Widget.', anchor: '#widget' },
  { icon: Brain, step: '3', title: 'Upload your docs', desc: 'Upload PDFs, paste URLs, or connect a sitemap. OyeChats reads and indexes the rest.', anchor: '#api' },
  { icon: Zap, step: '4', title: 'Configure webhooks', desc: 'Push lead events, BANT scores, and chat transcripts to your own backend.', anchor: '#webhooks' },
];

const WIDGET_ATTRS = [
  { attr: 'data-bot-key', type: 'string', required: true, desc: 'Your unique bot key from the dashboard (Settings, Widget).' },
];

const WEBHOOK_EVENTS = [
  { event: 'tier_transition', desc: 'Fires when a visitor crosses a qualification tier, e.g. becomes a hot lead.' },
  { event: 'lead_captured', desc: 'Fires when a visitor submits name and email via the lead form.' },
  { event: 'handoff_requested', desc: 'Fires when the visitor asks to speak with a human operator.' },
  { event: 'meeting_booked', desc: 'Fires when a visitor books a meeting via Calendly or Zcal.' },
  { event: 'chat_closed', desc: 'Fires when a chat session is closed.' },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/bots', desc: 'List all bots for your account.' },
  { method: 'GET', path: '/leads', desc: 'List captured leads with BANT scores.' },
  { method: 'GET', path: '/leads/export', desc: 'Export captured leads as CSV.' },
  { method: 'POST', path: '/ingest', desc: 'Upload a document (PDF, DOCX, TXT) to the knowledge base.' },
  { method: 'DELETE', path: '/documents/{name}', desc: 'Remove a document and its embeddings.' },
  { method: 'GET', path: '/analytics/dashboard', desc: 'Get conversation and lead metrics for a date range.' },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-signal-tint text-signal border-signal/40',
  POST: 'bg-volt-tint text-volt-ink border-volt-line',
  DELETE: 'bg-danger-tint text-danger border-danger/40',
};

const TOC = [
  { anchor: '#quick-start', label: 'Quick start' },
  { anchor: '#widget', label: 'Widget setup' },
  { anchor: '#webhooks', label: 'Webhooks' },
  { anchor: '#api', label: 'REST API' },
];

export default function DocsPage() {
  return (
    <>
      <section className="relative bg-paper overflow-hidden border-b border-line">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-16 md:pt-20 md:pb-20 text-center">
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            Everything you need to <GradientText>go live</GradientText>.
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            From a one-line embed to full webhook setups. Get OyeChats running in minutes, not days.
          </p>
        </Container>
      </section>

      <div className="bg-canvas py-16 md:py-16">
        <Container className="max-w-[1200px]">
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <ScrollSpyToc
                  label="On this page"
                  items={TOC.map((item) => ({ id: item.anchor.replace(/^#/, ''), label: item.label }))}
                />
              </div>
            </aside>

            <div className="min-w-0 space-y-24">
              <Reveal delay={80}>
              <section id="quick-start" className="scroll-mt-28">
                <div className="type-mono-sm text-volt mb-3">Getting started</div>
                <h2 className="type-heading-1 text-ink mb-3">Quick start</h2>
                <p className="type-body text-ink-2 mb-8 max-w-2xl">
                  Four steps from signup to a working chat widget. The whole flow takes about five minutes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {QUICK_START.map((s, i) => (
                    <Reveal key={s.step} delay={i * 60}>
                    <a
                      href={s.anchor}
                      className="group bg-canvas border border-line rounded-[var(--r-3)] p-5 hover:border-volt/40 hover:shadow-[0_12px_28px_-12px_rgba(162,28,175,0.18)] hover:-translate-y-0.5 transition-all no-underline block h-full"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-[var(--r-2)] border border-line bg-volt-tint text-volt flex items-center justify-center">
                          <s.icon size={16} />
                        </div>
                        <span className="type-mono-sm text-muted">Step {s.step}</span>
                      </div>
                      <p className="type-heading-3 text-ink mb-1 group-hover:text-volt transition-colors">
                        {s.title}
                      </p>
                      <p className="type-body-sm text-ink-2">{s.desc}</p>
                    </a>
                    </Reveal>
                  ))}
                </div>
              </section>
              </Reveal>

              <Reveal delay={160}>
              <section id="widget" className="scroll-mt-28">
                <div className="type-mono-sm text-volt mb-3">Widget setup</div>
                <h2 className="type-heading-1 text-ink mb-3">Add the chat widget</h2>
                <p className="type-body text-ink-2 mb-8 max-w-2xl">
                  Paste the script tag before the closing{' '}
                  <code className="font-mono text-[13px] text-volt bg-volt-tint border border-volt-line px-1.5 py-0.5 rounded-[var(--r-1)]">
                    &lt;/body&gt;
                  </code>{' '}
                  tag on any HTML page.
                </p>

                <div className="rounded-[var(--r-4)] border border-white/8 overflow-hidden mb-10 bg-ink-invert">
                  <div className="border-b border-white/8 px-5 py-3 flex items-center justify-between">
                    <span className="font-mono text-[12px] text-white/50">HTML</span>
                    <span className="font-mono text-[11px] text-white/40">Paste before &lt;/body&gt;</span>
                  </div>
                  <pre className="p-5 text-[13px] font-mono text-white/80 overflow-x-auto leading-relaxed">
                    <span className="text-white/35">{`<!-- OyeChats Widget -->`}</span>{'\n'}
                    <span className="text-[#E879F9]">{`<script`}</span>{'\n'}
                    {'  '}<span className="text-white/50">src</span>
                    <span className="text-white/40">=</span>
                    <span className="text-[#FFD494]">{`"https://cdn.oyechats.com/oyechats-widget.js"`}</span>{'\n'}
                    {'  '}<span className="text-white/50">data-bot-key</span>
                    <span className="text-white/40">=</span>
                    <span className="text-[#FFD494]">{`"YOUR_BOT_KEY"`}</span>{'\n'}
                    {'  '}<span className="text-white/50">defer</span>{'\n'}
                    <span className="text-[#E879F9]">{`></script>`}</span>
                  </pre>
                </div>

                <h3 className="type-heading-3 text-ink mb-2">Configuration attributes</h3>
                <p className="type-body-sm text-ink-2 mb-5 max-w-2xl">
                  The script tag only needs{' '}
                  <code className="font-mono text-[13px] text-volt bg-volt-tint border border-volt-line px-1.5 py-0.5 rounded-[var(--r-1)]">
                    data-bot-key
                  </code>
                  . Everything else, launcher position, colors, auto-open, and branding removal (Standard and above), is configured per bot in your dashboard.
                </p>

                <Table>
                  <thead>
                    <tr>
                      <Th>Attribute</Th>
                      <Th>Type</Th>
                      <Th>Required</Th>
                      <Th>Description</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {WIDGET_ATTRS.map((a) => (
                      <tr key={a.attr}>
                        <Td>
                          <code className="font-mono text-[12px] text-volt">{a.attr}</code>
                        </Td>
                        <Td>
                          <span className="font-mono text-[12px] text-muted">{a.type}</span>
                        </Td>
                        <Td>
                          {a.required ? (
                            <span className="text-signal font-semibold text-[12px]">Required</span>
                          ) : (
                            <span className="text-muted text-[12px]">Optional</span>
                          )}
                        </Td>
                        <Td>{a.desc}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </section>
              </Reveal>

              <Reveal delay={240}>
              <section id="webhooks" className="scroll-mt-28">
                <div className="type-mono-sm text-volt mb-3">Webhooks</div>
                <h2 className="type-heading-1 text-ink mb-3">Receive real-time events</h2>
                <p className="type-body text-ink-2 mb-8 max-w-2xl">
                  Configure a webhook URL in your dashboard and OyeChats will POST a signed JSON payload to your endpoint whenever these events occur.
                </p>

                <div className="space-y-2.5 mb-10">
                  {WEBHOOK_EVENTS.map((e, i) => (
                    <Reveal key={e.event} delay={i * 60}>
                    <div
                      className="flex items-start gap-4 bg-canvas border border-line rounded-[var(--r-3)] px-5 py-4"
                    >
                      <code className="font-mono text-[12px] text-volt bg-volt-tint border border-volt-line px-2.5 py-1 rounded-[var(--r-2)] shrink-0">
                        {e.event}
                      </code>
                      <p className="type-body-sm text-ink-2">{e.desc}</p>
                    </div>
                    </Reveal>
                  ))}
                </div>

                <h3 className="type-heading-3 text-ink mb-3">
                  Example payload for{' '}
                  <code className="font-mono text-[16px] text-volt">tier_transition</code>
                </h3>
                <div className="rounded-[var(--r-4)] border border-white/8 overflow-hidden bg-ink-invert">
                  <div className="border-b border-white/8 px-5 py-3">
                    <span className="font-mono text-[12px] text-white/50">JSON</span>
                  </div>
                  <pre className="p-5 text-[12px] font-mono text-white/75 overflow-x-auto leading-loose">{`{
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
}`}</pre>
                </div>

                <div className="mt-5">
                  <Callout variant="info" title="Signature verification">
                    Every webhook request includes an{' '}
                    <code className="font-mono text-[12px] text-volt bg-volt-tint border border-volt-line px-1.5 py-0.5 rounded-[var(--r-1)]">
                      X-OyeChats-Signature
                    </code>{' '}
                    header (HMAC-SHA256). Verify it in your handler before processing.
                  </Callout>
                </div>
              </section>
              </Reveal>

              <Reveal delay={320}>
              <section id="api" className="scroll-mt-28">
                <div className="type-mono-sm text-volt mb-3">REST API</div>
                <h2 className="type-heading-1 text-ink mb-3">Endpoints</h2>
                <p className="type-body text-ink-2 mb-2 max-w-2xl">
                  Base URL:{' '}
                  <code className="font-mono text-[13px] text-volt bg-volt-tint border border-volt-line px-1.5 py-0.5 rounded-[var(--r-1)]">
                    https://api.oyechats.com
                  </code>
                </p>
                <p className="type-body-sm text-ink-2 mb-8 max-w-2xl">
                  Authenticate with your API key in the{' '}
                  <code className="font-mono text-[13px] text-volt bg-volt-tint border border-volt-line px-1.5 py-0.5 rounded-[var(--r-1)]">
                    X-API-Key: &lt;key&gt;
                  </code>{' '}
                  header.
                </p>

                <Table>
                  <thead>
                    <tr>
                      <Th>Method</Th>
                      <Th>Endpoint</Th>
                      <Th>Description</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {API_ENDPOINTS.map((ep) => (
                      <tr key={ep.path}>
                        <Td>
                          <span
                            className={`inline-block font-mono text-[11px] font-semibold border px-2 py-0.5 rounded-[var(--r-1)] ${METHOD_COLORS[ep.method]}`}
                          >
                            {ep.method}
                          </span>
                        </Td>
                        <Td>
                          <code className="font-mono text-[12px] text-ink">{ep.path}</code>
                        </Td>
                        <Td>{ep.desc}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="mt-6">
                  <Callout variant="info" title="Full OpenAPI spec">
                    <span className="inline-flex items-center gap-2 flex-wrap">
                      <Lightbulb size={14} className="text-volt shrink-0" />
                      Need the full spec?{' '}
                      <a
                        href="/openapi.json"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-volt hover:underline underline-offset-2 inline-flex items-center gap-1"
                      >
                        Download openapi.json <ExternalLink size={12} />
                      </a>{' '}
                      and drop it into Postman, Insomnia, or any OpenAPI-compatible tool.
                    </span>
                  </Callout>
                </div>
              </section>
              </Reveal>
            </div>
          </div>
        </Container>
      </div>

      <section className="bg-paper py-16 border-t border-line">
        <Container>
          <Reveal>
          <div className="bg-canvas border border-line rounded-[var(--r-4)] px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[var(--e-1)]">
            <div>
              <div className="type-heading-2 text-ink mb-1">Need help integrating?</div>
              <div className="type-body-sm text-ink-2">
                Our team typically responds within one business day.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button href="/contact" variant="volt">
                Contact support →
              </Button>
              <Button href="mailto:support@oyechats.com" variant="ghost" external>
                Email us
              </Button>
            </div>
          </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
