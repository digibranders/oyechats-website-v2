import { Container } from '@/components/ds';
import type { CaseMetric, CaseStudy } from '@/lib/case-studies';
import { stageShare } from '@/lib/case-studies';

/**
 * The three figures the study is judged on, immediately under the hero.
 *
 * Static numerals, no count-up. On a page arguing that its numbers are exact,
 * an animation that walks through values the client never reported is working
 * against the argument, and the shared ticker was rendering negative counts
 * while it did so.
 *
 * Each figure carries its denominator. Three big numbers in a row is a trophy
 * cabinet; the same three with their share of the whole is an argument, and it
 * saves the reader doing the division to find out whether 1,146 is a lot.
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
  if (pct >= 100) return '100% of conversations';
  return `${pct.toFixed(1)}% of conversations`;
}
export function CaseStudyOutcomeStrip({ study }: { study: CaseStudy }) {
  const meta = [
    `${study.client.period} implementation`,
    study.client.industry,
    study.client.market,
    'Client identity withheld',
  ];

  return (
    <section className="border-b border-line bg-canvas py-12 md:py-14">
      <Container>
        <dl className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-3">
          {study.headline.map((m) => {
            const share = shareOfFunnel(m, study);
            const stage = study.funnel.find((s) => s.value === m.value);
            const width = stage ? stageShare(stage, study.funnel) : 0;
            return (
              <div key={m.label}>
                <dd className="font-display text-[clamp(2.25rem,4vw,3rem)] font-semibold leading-none tracking-[-0.04em] text-ink tabular-nums">
                  {m.value.toLocaleString()}
                  {m.suffix}
                </dd>
                <dt className="type-body-sm mt-3 text-ink-2">{m.label}</dt>
                {share && (
                  <>
                    {/* Same true proportion as the hero wedge and the funnel
                        rail, so the three readings of the data agree. */}
                    <div
                      className="mt-3.5 h-[3px] overflow-hidden rounded-[2px] bg-line"
                      aria-hidden
                    >
                      <div className="h-full rounded-[2px] bg-volt" style={{ width: `${width}%` }} />
                    </div>
                    <p className="type-mono-sm mt-2.5 text-muted">{share}</p>
                  </>
                )}
              </div>
            );
          })}
        </dl>

        <p className="type-mono-sm mt-10 border-t border-line pt-5 text-muted">
          {meta.map((part, i) => (
            <span key={part}>
              {i > 0 && <span className="mx-2 text-line-2">&middot;</span>}
              {part}
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
