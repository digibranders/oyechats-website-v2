import { Container } from '@/components/ds';

/**
 * One conversion, stated as a conversion.
 *
 * Both source counts sit beside the rate so the arithmetic is checkable on the
 * page rather than asserted.
 *
 * This is the one place on the page where a proportional bar is safe. 84.3% is
 * a large fraction, so the smaller bar is 84% of the larger one and no minimum
 * width is needed to keep it visible. The unfilled remainder IS the 45 requests
 * that did not convert, which is a shape a sentence cannot give you. Everywhere
 * else on this page the ratios are small enough that a bar would have to lie to
 * stay legible, which is why there are none.
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
    <section id={id} className="scroll-mt-14 md:scroll-mt-10 border-b border-line bg-canvas py-20 md:py-24">
      <Container>
        <p className="type-mono-sm mb-5 flex items-center gap-2.5 text-muted">
          <span className="h-px w-6 bg-volt" aria-hidden />
          {eyebrow}
        </p>
        <h2 className="type-heading-1 measure-narrow text-ink">{heading}</h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <dl className="m-0 flex flex-col gap-5 lg:col-span-7">
            <div className="grid items-center gap-x-6 gap-y-2 sm:grid-cols-[9rem_1fr]">
              <div>
                <dd className="font-display text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-none tracking-[-0.04em] text-ink tabular-nums">
                  {from.value.toLocaleString()}
                </dd>
                <dt className="type-mono-sm mt-2 text-muted">{from.label}</dt>
              </div>
              <span className="h-8 overflow-hidden rounded-[3px] bg-line" aria-hidden>
                <span className="block h-full w-full rounded-[3px] bg-volt-line" />
              </span>
            </div>

            <div className="grid items-center gap-x-6 gap-y-2 sm:grid-cols-[9rem_1fr]">
              <div>
                <dd className="font-display text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-none tracking-[-0.04em] text-volt-ink tabular-nums">
                  {to.value.toLocaleString()}
                </dd>
                <dt className="type-mono-sm mt-2 text-muted">{to.label}</dt>
              </div>
              <span className="h-8 overflow-hidden rounded-[3px] bg-line" aria-hidden>
                <span
                  className="block h-full rounded-[3px] bg-volt"
                  style={{ width: `${(to.value / from.value) * 100}%` }}
                />
              </span>
            </div>

            <p className="type-body-sm measure text-muted">
              The {(from.value - to.value).toLocaleString()} request gap is the unfilled
              remainder above.
            </p>
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
