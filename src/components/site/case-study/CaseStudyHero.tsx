import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button, Container, DottedGrid, HeroGlow } from '@/components/ds';
import type { CaseStudy } from '@/lib/case-studies';
import { APP_LINKS } from '@/lib/site';
import { QualificationFlow } from './QualificationFlow';

/**
 * Case study hero. Seven columns of argument, five of evidence.
 *
 * `HeroGlow` and `DottedGrid` stay: they are the established OyeChats hero
 * treatment on every other route, and the body below carries none of it.
 */
export function CaseStudyHero({ study }: { study: CaseStudy }) {
  const meta = [
    'Case study',
    study.client.industry,
    study.client.market,
    study.client.period,
  ];

  return (
    <header id="overview" className="relative overflow-hidden border-b border-line bg-paper">
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

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {/* One metadata line, not four chips. */}
            <p className="type-mono-sm mb-6 text-muted">
              {meta.map((part, i) => (
                <span key={part}>
                  {i > 0 && <span className="mx-2 text-line-2">&middot;</span>}
                  {part}
                </span>
              ))}
            </p>

            {/* The display scale's own size, not the `type-display-2` class.
                That class floors at 44px under 640px and tops out at 72px,
                either side of this page's 38-42px / 60-68px target, and it is
                shared with routes that should keep those sizes. Family, weight
                and tracking still come from the same scale. */}
            <h1 className="font-display text-[clamp(2.375rem,4.2vw+1.1rem,4.25rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-ink">
              {study.heroHeadline.map((seg, i) =>
                seg.accent ? (
                  <span key={i} className="text-volt">
                    {seg.text}
                  </span>
                ) : (
                  <span key={i}>{seg.text}</span>
                ),
              )}
            </h1>

            <p className="type-body-lg measure mt-7 text-ink-2">{study.summary}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href={APP_LINKS.register} external variant="volt" size="md">
                Start free <ArrowRight size={16} aria-hidden />
              </Button>
              <Button href="#results" variant="ghost" size="md">
                See the 90 day funnel
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <QualificationFlow />
          </div>
        </div>
      </Container>
    </header>
  );
}
