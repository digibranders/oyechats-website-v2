import type { Metadata } from 'next';
import { MessagesSquare, Target, Headphones, MapPin, type LucideIcon } from 'lucide-react';
import {
  Chip,
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  PullQuote,
  Reveal,
  Section,
} from '@/components/ds';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'OyeChats is the RAG-powered AI chat platform for support, sales, and live conversations. Meet the team defining how businesses answer their customers.',
  alternates: { canonical: '/about' },
};

const HERO_STATS = [
  { value: '1', label: 'Script tag to embed' },
  { value: '5 min', label: 'From signup to live bot' },
  { value: '24/7', label: 'Answers from your knowledge base' },
  { value: 'Grounded', label: 'Every answer from your docs, not training data' },
];

type VisionBlock = {
  icon: LucideIcon;
  title: string;
  desc: string;
  status?: 'live' | 'soon';
};

const VISION_BLOCKS: VisionBlock[] = [
  {
    icon: MessagesSquare,
    title: 'OyeChats for Support',
    desc: 'Answer questions from your docs, PDFs, and website in real time. Hybrid RAG search picks the right chunk and answers are grounded in your content.',
    status: 'live',
  },
  {
    icon: Target,
    title: 'OyeChats for Sales',
    desc: 'Every conversation is a qualification opportunity. BANT tracking, lead capture, and CRM handoff, built into the same widget your visitors already trust.',
    status: 'live',
  },
  {
    icon: Headphones,
    title: 'OyeChats for Live Chat',
    desc: 'When the bot hits its limit, hand off to a human operator in the same thread. Real-time WebSocket messaging, department routing, canned replies.',
    status: 'live',
  },
];

const OFFICES = [
  {
    city: 'Thane',
    region: 'India, HQ',
    detail: 'Product, engineering, and design all under one roof.',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative bg-paper overflow-hidden">
        <HeroGlow />
        <DottedGrid />
        <Container className="relative pt-24 pb-24 md:pt-32 md:pb-32 text-center">
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            We help teams answer every visitor, and{' '}
            <GradientText>qualify</GradientText> the ones worth calling.
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            OyeChats turns your knowledge base into a chat assistant that answers questions from your
            own content, scores each visitor as they chat, and hands the hot ones to your team, all
            in one conversation.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14">
            {HERO_STATS.map((s) => (
              <div
                key={s.label}
                className="bg-canvas border border-line rounded-[var(--r-4)] px-5 py-6 text-left shadow-[var(--e-1)]"
              >
                <p className="font-display text-[28px] md:text-[32px] font-semibold text-ink leading-none mb-2 tabular-nums tracking-[-0.02em]">
                  {s.value}
                </p>
                <p className="type-mono-sm text-muted leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Section
        tone="canvas"
        eyebrow="Our vision"
        heading={<>One assistant, every customer moment.</>}
        sub="One assistant that carries full context across the whole customer journey, from the first question, to the qualified lead, to the paying customer."
        containerSize="wide"
      >
        <div className="grid md:grid-cols-2 gap-4">
          {VISION_BLOCKS.map((block, i) => (
            <Reveal key={block.title} delay={i * 60}>
              <div className="bg-canvas border border-line rounded-[var(--r-4)] p-8 hover:border-volt/40 hover:shadow-[0_20px_40px_-16px_rgba(162,28,175,0.14)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-11 h-11 rounded-[var(--r-3)] border border-line bg-volt-tint text-volt flex items-center justify-center">
                  <block.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="type-heading-3 text-ink">{block.title}</h3>
                    {block.status === 'soon' && (
                      <Chip variant="soft" className="text-[10px]">
                        Soon
                      </Chip>
                    )}
                    {block.status === 'live' && (
                      <Chip variant="signal" className="text-[10px]">
                        Live
                      </Chip>
                    )}
                  </div>
                  <p className="type-body-sm text-ink-2">{block.desc}</p>
                </div>
              </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <Reveal>
          <PullQuote
            quote="Every visitor is trying to tell you something. Forms interrupt the message. Chat, done right, listens for it."
            cite="OyeChats Team"
          />
        </Reveal>
      </Section>

      <Section
        tone="canvas"
        eyebrow="Where we work"
        heading={<>Built remotely. Shipped often.</>}
        sub="A small, remote-first team. We make product decisions in the code, not in meetings. If that's how you work best, we'd love to hear from you."
        containerSize="wide"
      >
        <div className="grid grid-cols-1 gap-5 max-w-md mx-auto">
          {OFFICES.map((office, i) => (
            <Reveal key={office.city} delay={i * 60}>
              <div className="bg-canvas border border-line rounded-[var(--r-4)] p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0 w-10 h-10 rounded-[var(--r-2)] border border-line bg-volt-tint text-volt flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="type-heading-3 text-ink mb-1">{office.city}</p>
                  <p className="type-mono-sm text-muted">{office.region}</p>
                </div>
              </div>
              <p className="type-body-sm text-ink-2">{office.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
