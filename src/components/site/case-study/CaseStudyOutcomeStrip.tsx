import { Container } from '@/components/ds';
import type { CaseMetric, CaseStudy } from '@/lib/case-studies';
import { stageShare } from '@/lib/case-studies';
import { cn } from '@/lib/cn';

/**
 * The three figures the study is judged on, immediately under the hero.
 *
 * Static numerals, no count-up. On a page arguing that its numbers are exact,
 * an animation that walks through values the client never reported works
 * against the argument, and the shared ticker was rendering negative counts
 * while it did it.
 *
 * Each figure carries its denominator, because three big numbers in a row is a
 * trophy cabinet and the same three with their share of the whole is an
 * argument. An earlier version drew that share as a proportional rule under
 * each figure, matching the hero wedge and the funnel rail. It had to go: at
 * this width 1.3% is a four pixel dot on a thousand pixel line, which does not
 * read as "1.3%", it reads as a rendering fault. The funnel draws proportion
 * properly, at a size where it survives; here the share is text.
 */

/**
 * Share of the top of funnel, but ONLY when the metric is itself a funnel
 * stage. A headline figure that is not a conversation count (a multiple, a
 * duration) has no share of the funnel, and inventing one would be the kind of
 * derived nonsense this page exists to avoid.
 */
function shareOfFunnel(metric: CaseMetric, study: CaseStudy): string | null {
  if (metric.suffix) return null;
  const stage = study.funnel.find((s) => s.value === metric.value);
  if (!stage) return null;
  const pct = stageShare(stage, study.funnel);
  if (pct >= 100) return 'Every conversation';
  return `${pct.toFixed(1)}% of conversations`;
}

export function CaseStudyOutcomeStrip({ study }: { study: CaseStudy }) {
  const last = study.headline.length - 1;

  return (
    <section className="border-b border-line bg-canvas py-14 md:py-16">
      <Container>
        <dl className="grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-y-0 sm:divide-x sm:divide-line">
          {study.headline.map((m, i) => {
            const share = shareOfFunnel(m, study);
            return (
              /* `flex-col-reverse` paints the figure above its label while
                 keeping the dt before the dd in the DOM, which is what a
                 definition list requires. */
              <div
                key={m.label}
                className={cn(
                  'flex flex-col-reverse gap-3',
                  i === 0 ? 'sm:pr-8' : i === last ? 'sm:pl-8' : 'sm:px-8',
                )}
              >
                <dt className="min-w-0">
                  <span className="block text-[15px] font-medium leading-snug text-ink">
                    {m.label}
                  </span>
                  {share && (
                    <span className="type-mono-sm mt-2 block text-muted">{share}</span>
                  )}
                </dt>
                <dd className="font-display text-[clamp(2.75rem,5.5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-ink tabular-nums">
                  {m.value.toLocaleString()}
                  {m.suffix}
                </dd>
              </div>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}
