'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Chip, Reveal } from '@/components/ds';
import { CaseStudyCover } from './CaseStudyCover';
import type { CaseStudy } from '@/lib/case-studies';
import { cn } from '@/lib/cn';

/**
 * Case study library: one wide featured card, then a two-up grid.
 *
 * The featured slot is what keeps the layout honest at every corpus size. With
 * a single study a plain two-column grid leaves half the row empty; with twenty
 * it gives the newest study somewhere to breathe.
 *
 * Filtering hides cards with a class rather than removing them from the tree,
 * so every study stays in the server-rendered HTML for crawlers and answer
 * engines regardless of the active filter. The filter rail itself only appears
 * once the corpus spans more than one industry: at n=1 a segmentation control
 * is noise, not navigation.
 */
export function CaseStudyLibrary({ studies }: { studies: CaseStudy[] }) {
  const industries = [...new Set(studies.map((s) => s.client.industry))].sort();
  const [active, setActive] = useState<string>('All');
  const showFilter = industries.length > 1;

  const [featured, ...rest] = studies;
  const matches = (s: CaseStudy) => active === 'All' || s.client.industry === active;

  return (
    <>
      {showFilter && (
        <div
          className="mb-10 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter case studies by industry"
        >
          {['All', ...industries].map((label) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(label)}
                className={cn(
                  'inline-flex min-h-11 items-center rounded-full border px-4 text-[13px] font-medium transition-colors duration-200',
                  isActive
                    ? 'border-volt bg-volt text-volt-fg'
                    : 'border-line-2 bg-canvas text-ink-2 hover:border-ink hover:text-ink',
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {featured && (
        <Reveal className={cn('block', matches(featured) ? 'mb-6 lg:mb-8' : 'hidden')}>
          <CaseStudyCard study={featured} wide />
        </Reveal>
      )}

      {rest.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {rest.map((study, i) => (
            <Reveal
              key={study.slug}
              delay={i * 70}
              className={matches(study) ? undefined : 'hidden'}
            >
              <CaseStudyCard study={study} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}

/**
 * One library card. The headline metrics are on the card on purpose: a reader
 * should be able to judge relevance without opening the study. `wide` switches
 * to a side-by-side layout for the featured slot.
 */
export function CaseStudyCard({ study, wide = false }: { study: CaseStudy; wide?: boolean }) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className={cn(
        'group no-underline overflow-hidden rounded-[var(--r-4)] border border-line bg-canvas shadow-[var(--e-1)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-volt/40 hover:shadow-[0_24px_48px_-20px_rgba(162,28,175,0.2)]',
        wide ? 'grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]' : 'flex h-full flex-col',
      )}
    >
      <CaseStudyCover
        study={study}
        variant="card"
        className={cn(
          'rounded-none border-0',
          wide ? 'lg:h-full lg:aspect-auto border-b lg:border-b-0 lg:border-r border-line' : 'border-b border-line',
        )}
      />

      <div className={cn('flex flex-1 flex-col', wide ? 'p-7 md:p-10' : 'p-6 md:p-7')}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Chip variant="soft">{study.client.industry}</Chip>
          <Chip variant="outline">{study.client.market}</Chip>
          <Chip variant="outline">{study.client.period}</Chip>
        </div>

        <h3
          className={cn(
            'text-ink transition-colors duration-200 group-hover:text-volt-ink',
            wide ? 'type-heading-1' : 'type-heading-2',
          )}
        >
          {study.title}
        </h3>
        <p className={cn('text-ink-2 mt-3 mb-6', wide ? 'type-body' : 'type-body-sm')}>
          {study.description}
        </p>

        {/* The featured slot sits directly under the hero, which already
            states these three figures. Repeating them one scroll later reads
            as padding, so only the browsing cards carry them. */}
        {!wide && (
        <dl className="mt-auto grid grid-cols-3 gap-4 border-t border-line pt-5">
          {study.headline.map((m) => (
            <div key={m.label}>
              <dt className="sr-only">{m.label}</dt>
              <dd>
                <span
                  className={cn(
                    'block font-display font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums',
                    wide ? 'text-[28px]' : 'text-[22px]',
                  )}
                >
                  {m.value.toLocaleString()}
                  {m.suffix}
                </span>
                <span className="mt-2 block type-mono-sm text-muted" aria-hidden>
                  {m.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        )}

        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-[13px] font-medium text-volt',
            wide ? 'mt-auto pt-6' : 'mt-6',
          )}
        >
          Read the case study
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
