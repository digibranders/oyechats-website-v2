import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  Button,
  Chip,
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  Reveal,
} from '@/components/ds';
import { SOLUTIONS, type Solution } from '@/lib/features';

export const metadata: Metadata = {
  title: 'Solutions',
  description:
    'Solutions for the teams and workflows OyeChats was built for. Customer support, sales lead gen, docs assistants, and live chat handoff.',
  alternates: { canonical: '/solutions' },
};

const ACCENT: Record<
  Solution['accent'],
  { pill: string; dot: string; text: string; ring: string }
> = {
  blue: {
    pill: 'bg-[#FDF4FF] border-[#F0ABFC] text-[#A21CAF]',
    dot: 'bg-[#A21CAF]',
    text: 'text-[#A21CAF]',
    ring: 'ring-[#A21CAF]/30',
  },
  violet: {
    pill: 'bg-volt-tint border-volt-line text-volt-ink',
    dot: 'bg-volt',
    text: 'text-volt-ink',
    ring: 'ring-volt/30',
  },
  emerald: {
    pill: 'bg-signal-tint border-[#A6E4C1] text-signal',
    dot: 'bg-signal',
    text: 'text-signal',
    ring: 'ring-signal/30',
  },
  amber: {
    pill: 'bg-alert-tint border-[#F4CD8A] text-alert',
    dot: 'bg-alert',
    text: 'text-alert',
    ring: 'ring-alert/30',
  },
  rose: {
    pill: 'bg-danger-tint border-[#F4B0B0] text-danger',
    dot: 'bg-danger',
    text: 'text-danger',
    ring: 'ring-danger/30',
  },
};

export default function SolutionsPage() {
  return (
    <>
      <section className="relative bg-paper overflow-hidden">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-16 md:pt-32 md:pb-24 text-center">
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            Built for support, sales, and <GradientText>everything</GradientText> between.
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            Pick what you need (support, sales, docs, or live chat) and OyeChats handles the
            conversations that matter.
          </p>
          <div className="mt-9 flex justify-center gap-3 flex-wrap">
            <Button href="/pricing" variant="volt" size="lg">
              See pricing →
            </Button>
            <Button href="/contact" variant="ghost" size="lg">
              Talk to sales
            </Button>
          </div>

          <div className="mt-16">
            <div className="type-mono-sm text-muted mb-4 flex items-center gap-2 justify-center">
              <span className="w-6 h-px bg-line-2" />
              <span>Jump to a solution</span>
              <span className="w-6 h-px bg-line-2" />
            </div>
            <nav
              aria-label="Workflow anchor navigation"
              className="inline-flex flex-col sm:flex-row overflow-hidden rounded-[var(--r-full)] border border-line bg-canvas shadow-[var(--e-1)]"
            >
              {SOLUTIONS.map((s, i) => {
                const a = ACCENT[s.accent];
                const Icon = s.icon;
                return (
                  <Link
                    key={s.slug}
                    href={`#${s.slug}`}
                    className={`group flex items-center gap-2.5 px-5 py-3 text-[13px] font-medium text-ink-2 hover:text-ink transition-colors whitespace-nowrap ${
                      i > 0 ? 'border-t sm:border-t-0 sm:border-l border-line' : ''
                    }`}
                  >
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border border-line bg-paper ring-1 group-hover:scale-110 transition-transform ${a.ring} ${a.text}`}
                    >
                      <Icon size={14} />
                    </span>
                    <span>{s.category}</span>
                    <ArrowRight
                      size={13}
                      className="text-muted-2 group-hover:translate-x-0.5 group-hover:text-ink transition-all"
                    />
                  </Link>
                );
              })}
            </nav>
          </div>
        </Container>
      </section>

      {SOLUTIONS.map((s, index) => {
        const a = ACCENT[s.accent];
        const Icon = s.icon;
        const isEven = index % 2 === 0;
        return (
          <section
            key={s.slug}
            id={s.slug}
            className={`scroll-mt-24 py-14 md:py-28 border-t border-line ${
              isEven ? 'bg-canvas' : 'bg-paper'
            }`}
          >
            <Container>
              <Reveal className="max-w-3xl">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-[var(--r-3)] bg-canvas border border-line ring-1 ${a.ring} ${a.text}`}
                  >
                    <Icon size={20} />
                  </div>
                  <Chip variant="soft" className={a.pill}>
                    {s.category}
                  </Chip>
                </div>
                <h2 className="type-display-3 text-ink mb-5">{s.title}</h2>
                <p className="type-body-lg text-ink-2 mb-4">{s.intro}</p>
                {s.body.map((p, i) => (
                  <p key={i} className="type-body text-ink-2 mb-4">
                    {p}
                  </p>
                ))}
                <ul className="mt-6 space-y-2.5">
                  {s.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3 type-body text-ink-2 items-start">
                      <span
                        className={`mt-2 h-1.5 w-1.5 rounded-full shrink-0 ${a.dot}`}
                        aria-hidden
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[var(--r-3)] border border-line bg-canvas px-5 py-4 shadow-[var(--e-1)]">
                  <div
                    className={`font-display font-semibold text-2xl tracking-tight whitespace-nowrap ${a.text}`}
                  >
                    {s.outcome.metric}
                  </div>
                  <div className="h-8 w-px bg-line" aria-hidden />
                  <div className="type-body-sm text-ink-2 leading-tight">
                    {s.outcome.label}
                  </div>
                </div>
              </Reveal>
            </Container>
          </section>
        );
      })}

      <section className="bg-canvas py-24 border-t border-line">
        <Container>
          <Reveal className="max-w-3xl mx-auto text-center">
            <div className="type-mono-sm text-muted mb-4 flex items-center gap-2 justify-center">
              <span className="w-6 h-px bg-volt" />
              <span>Get started</span>
            </div>
            <h2 className="type-display-3 text-ink mb-5">
              Pick a solution, <GradientText>go live</GradientText> this week.
            </h2>
            <p className="type-body-lg text-ink-2 mb-8 max-w-xl mx-auto">
              Every OyeChats bot starts free. Add your docs, paste one script tag, and go live in under five minutes.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button href="/pricing" variant="volt" size="lg">
                See pricing
              </Button>
              <Button href="/docs" variant="ghost" size="lg">
                Read the docs
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
