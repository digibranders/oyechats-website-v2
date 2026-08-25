import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button, Container, DottedGrid, HeroGlow } from '@/components/ds';
import type { CaseStudy } from '@/lib/case-studies';
import { APP_LINKS } from '@/lib/site';
import { FunnelWedge } from './FunnelWedge';

/**
 * Case study hero. Seven columns of argument, five of evidence.
 *
 * `HeroGlow` and `DottedGrid` stay: they are the established OyeChats hero
 * treatment on every other route, and the body below carries none of it.
 */
export function CaseStudyHero({ study }: { study: CaseStudy }) {
  const meta = [
    study.client.industry,
    study.client.market,
    study.client.period,
    study.client.name,
  ];

  return (
    <header
      id="overview"
      className="relative scroll-mt-26 overflow-hidden border-b border-line bg-paper md:scroll-mt-24"
    >
      <HeroGlow />
      <DottedGrid />

      <Container className="relative pt-8 pb-16 md:pt-10 md:pb-20">
        {/* min-h-11 keeps this at a real target. It was a 139x14px hit area,
            and it is the only route from a study back to the library. */}
        <Link
          href="/case-studies"
          className="type-mono-sm -ml-2 mb-6 inline-flex min-h-11 items-center gap-1.5 px-2 text-muted no-underline transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} aria-hidden /> All case studies
        </Link>

        {/* One metadata line, not four chips. It ends on the anonymisation,
            because "whose numbers are these?" is the first question an unnamed
            case study raises and leaving it to a strip further down lets the
            reader sit with it. */}
        <p className="type-mono-sm mb-6 text-muted">
          {meta.map((part, i) => (
            <span key={part}>
              {i > 0 && <span className="mx-2 text-line-2">&middot;</span>}
              {part}
            </span>
          ))}
        </p>

        <h1 className="mb-12 font-display text-[clamp(2.375rem,4.6vw+1rem,4.25rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink">
          {study.heroHeadline.map((line, li) => (
            <span key={li} className="block">
              {line.map((seg, si) =>
                seg.accent ? (
                  <span key={si} className="text-volt">
                    {seg.text}
                  </span>
                ) : (
                  <span key={si}>{seg.text}</span>
                ),
              )}
            </span>
          ))}
        </h1>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="type-body-lg measure text-ink-2">{study.summary}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href={APP_LINKS.register} external variant="volt" size="md">
                Start free <ArrowRight size={16} aria-hidden />
              </Button>
              <Button href="#results" variant="ghost" size="md">
                See the 90 day funnel
              </Button>
            </div>
          </div>

          {/* The wedge, not a feature list. It states the thesis before any
              body copy, it cannot be faked, and no competitor can draw it
              without having the same numbers. */}
          <div className="lg:col-span-6">
            <FunnelWedge stages={study.funnel} />
          </div>
        </div>
      </Container>
    </header>
  );
}
