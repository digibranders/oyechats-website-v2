import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ds';

/**
 * One conversion, stated as a conversion.
 *
 * Both source counts sit beside the rate so the arithmetic is checkable on the
 * page rather than asserted. No proportional bar: two numbers this close do not
 * need a chart to be understood, and adding one would reintroduce the
 * minimum-width question the funnel rewrite just removed.
 */
export function QuotationConversion({
  id,
  eyebrow,
  heading,
  from,
  to,
  rate,
  rateCaption,
  body,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  from: { value: number; label: string };
  to: { value: number; label: string };
  rate: string;
  rateCaption: string;
  body: string[];
}) {
  return (
    <section id={id} className="scroll-mt-32 border-b border-line bg-canvas py-20 md:py-24">
      <Container>
        <p className="type-mono-sm mb-5 flex items-center gap-2.5 text-muted">
          <span className="h-px w-6 bg-volt" aria-hidden />
          {eyebrow}
        </p>
        <h2 className="type-heading-1 measure-narrow text-ink">{heading}</h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <dl className="flex flex-wrap items-center gap-x-8 gap-y-6 lg:col-span-7">
            <div>
              <dd className="font-display text-[clamp(3rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.045em] text-ink tabular-nums">
                {from.value.toLocaleString()}
              </dd>
              <dt className="type-body-sm mt-3 text-muted">{from.label}</dt>
            </div>

            <ArrowRight
              size={28}
              aria-hidden
              className="shrink-0 self-start text-line-2"
              style={{ marginTop: '0.6em' }}
            />

            <div>
              <dd className="font-display text-[clamp(3rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.045em] text-volt-ink tabular-nums">
                {to.value.toLocaleString()}
              </dd>
              <dt className="type-body-sm mt-3 text-muted">{to.label}</dt>
            </div>
          </dl>

          <div className="lg:col-span-5">
            <p className="font-display text-[clamp(2.5rem,4vw,3.25rem)] font-semibold leading-none tracking-[-0.04em] text-ink tabular-nums">
              {rate}
            </p>
            <p className="type-body-sm measure-narrow mt-3 text-ink-2">{rateCaption}</p>
          </div>
        </div>

        <div className="measure mt-12 space-y-4 border-t border-line pt-8">
          {body.map((p, i) => (
            <p key={i} className="type-body text-ink-2">
              {p}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
