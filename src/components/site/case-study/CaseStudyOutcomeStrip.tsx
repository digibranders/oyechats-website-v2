import { Container } from '@/components/ds';
import type { CaseStudy } from '@/lib/case-studies';

/**
 * The three figures the study is judged on, immediately under the hero.
 *
 * Static numerals, no count-up. On a page arguing that its numbers are exact,
 * an animation that walks through values the client never reported is working
 * against the argument, and the shared ticker was rendering negative counts
 * while it did so.
 */
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
          {study.headline.map((m) => (
            <div key={m.label}>
              <dd className="font-display text-[clamp(2.25rem,4vw,3rem)] font-semibold leading-none tracking-[-0.04em] text-ink tabular-nums">
                {m.value.toLocaleString()}
                {m.suffix}
              </dd>
              <dt className="type-body-sm mt-3 text-muted">{m.label}</dt>
            </div>
          ))}
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
