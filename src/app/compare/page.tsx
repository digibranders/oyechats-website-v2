import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Brain, Target, Zap } from 'lucide-react';
import { ID, SITE_URL, abs, buildGraph, jsonLd, pageMeta } from '@/lib/seo';
import {
  Accordion,
  Button,
  Card,
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  Reveal,
} from '@/components/ds';
import { COMPETITORS, OYE_POSITION } from '@/lib/compare';
import { APP_LINKS } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'Compare OyeChats: Alternatives & vs Pages',
  description:
    'How OyeChats compares to Chatbase, Intercom, Zoho SalesIQ, LiveChat, Tidio, Crisp and Chatsimple. RAG answers plus BANT lead scoring, side by side.',
  path: '/compare',
});

const HUB_FAQS = [
  {
    q: 'What makes OyeChats different from other AI chatbots?',
    a: 'Most chatbots either answer questions (AI builders) or route human chats (live-chat suites). OyeChats does both and adds BANT lead scoring: every visitor is qualified on Budget, Authority, Need and Timeline before a rep sees them, with RAG-grounded answers and live handoff built in.',
  },
  {
    q: 'Which OyeChats alternative should I compare first?',
    a: 'If you want a pure AI support bot, compare with Chatbase or Chatsimple. If you are replacing a support suite or live-chat tool, compare with Intercom, Zoho SalesIQ, LiveChat, Tidio or Crisp. Each comparison page covers where that tool is the better fit too.',
  },
  {
    q: 'Is OyeChats cheaper than tools like Intercom or LiveChat?',
    a: 'Generally yes for SMBs. OyeChats uses flat monthly tiers with no per-seat pricing and no per-resolution AI fees, so costs stay predictable as conversation volume grows.',
  },
];

const PILLARS = [
  {
    icon: Brain,
    title: 'Grounded RAG answers',
    body: 'Hybrid semantic + keyword retrieval answers from your own content and cites the source, not generic model guesses.',
  },
  {
    icon: Target,
    title: 'BANT lead scoring',
    body: 'Every visitor is qualified on Budget, Authority, Need and Timeline, so reps only spend time on leads worth their time.',
  },
  {
    icon: Zap,
    title: 'Live in five minutes',
    body: 'Add your content, paste one script tag, and go live. Live handoff, analytics and webhooks are included, not add-ons.',
  },
];

const graph = buildGraph({
  path: '/compare',
  name: 'Compare OyeChats',
  description:
    'Compare OyeChats with Chatbase, Intercom, Zoho SalesIQ, LiveChat, Tidio, Crisp and Chatsimple.',
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Compare' }],
  nodes: [
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/compare#list`,
      name: 'OyeChats comparisons',
      itemListElement: COMPETITORS.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: abs(`/compare/${c.slug}`),
        name: `OyeChats vs ${c.name}`,
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/compare#faq`,
      isPartOf: { '@id': ID.webPage('/compare') },
      mainEntity: HUB_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
});

export default function ComparePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(graph) }}
      />

      <section className="relative bg-paper overflow-hidden">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-16 md:pt-20 md:pb-16 text-center">
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            How OyeChats <GradientText>compares</GradientText>
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            {OYE_POSITION} Here is an honest look at how it stacks up against the tools you are
            probably weighing, including where each one is the better pick.
          </p>
          <div className="mt-9 flex justify-center gap-3 flex-wrap">
            <Button href={APP_LINKS.register} external variant="volt" size="lg">
              Start free →
            </Button>
            <Button href="/pricing" variant="ghost" size="lg">
              See pricing
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20 bg-canvas border-t border-line">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title}>
                  <Card padding="lg" className="h-full">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[var(--r-3)] bg-paper border border-line text-volt ring-1 ring-volt/30">
                      <Icon size={20} />
                    </div>
                    <h2 className="type-heading-3 text-ink mt-5">{p.title}</h2>
                    <p className="type-body text-ink-2 mt-2">{p.body}</p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20 bg-paper border-t border-line">
        <Container>
          <Reveal className="max-w-2xl">
            <div className="type-mono-sm text-muted mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-volt" />
              <span>Side-by-side comparisons</span>
            </div>
            <h2 className="type-display-3 text-ink mb-4">
              Pick a tool to compare
            </h2>
            <p className="type-body-lg text-ink-2 mb-2">
              Each page breaks down the features axis by axis, and says plainly when the other
              tool is the better choice.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COMPETITORS.map((c) => (
              <Reveal key={c.slug}>
                <Link
                  href={`/compare/${c.slug}`}
                  className="group block h-full focus:outline-none"
                >
                  <Card padding="lg" className="h-full group-focus-visible:ring-2 group-focus-visible:ring-volt/40">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="flex h-10 w-10 items-center justify-center rounded-[var(--r-2)] bg-paper border border-line font-display font-semibold text-ink"
                      >
                        {c.monogram}
                      </span>
                      <div className="min-w-0">
                        <div className="type-heading-3 text-ink leading-tight">
                          OyeChats vs {c.name}
                        </div>
                        <div className="type-mono-sm text-muted mt-0.5">{c.category}</div>
                      </div>
                    </div>
                    <p className="type-body-sm text-ink-2 mt-4">{c.tagline}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-volt-ink">
                      Compare
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20 bg-canvas border-t border-line">
        <Container>
          <Reveal className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="type-display-3 text-ink mb-4">Questions, answered</h2>
          </Reveal>
          <div className="max-w-3xl mx-auto">
            <Accordion items={HUB_FAQS} />
          </div>
        </Container>
      </section>

      <section className="bg-paper py-24 border-t border-line">
        <Container>
          <Reveal className="max-w-3xl mx-auto text-center">
            <h2 className="type-display-3 text-ink mb-5">
              See it on <GradientText>your own content</GradientText>
            </h2>
            <p className="type-body-lg text-ink-2 mb-8 max-w-xl mx-auto">
              Add your docs, paste one script tag, and watch OyeChats answer and qualify in under
              five minutes. Every plan starts free.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button href={APP_LINKS.register} external variant="volt" size="lg">
                Start free
              </Button>
              <Button href="/features" variant="ghost" size="lg">
                Explore features
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
