import { Container } from '@/components/ds';

/**
 * One conversion, drawn as what it is: a part of a whole.
 *
 * An earlier version drew 286 and 241 as two separate bars, which says "compare
 * these two quantities" when 241 is a SUBSET of 286. That encoding needed three
 * colours to work and still needed a sentence underneath explaining that the
 * grey tail was the 45 requests, and a chart that needs instructions has already
 * failed. One track, two segments, both labelled: the 45 is a visible part of
 * the whole rather than a leftover of the drawing.
 *
 * This is the only proportional chart on the page. At 84.3% the smaller segment
 * is still 174px at desktop and 51px at 375px, so nothing needs a minimum width
 * to stay visible. Everywhere else the ratios are small enough that a bar would
 * have to lie to stay legible, which is why the funnel has none.
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
  const remainder = from.value - to.value;
  const sharePct = (to.value / from.value) * 100;

  return (
    <section
      id={id}
      className="scroll-mt-14 border-b border-line bg-canvas py-20 md:scroll-mt-10 md:py-24"
    >
      <Container>
        <p className="type-mono-sm mb-5 flex items-center gap-2.5 text-muted">
          <span className="h-px w-6 bg-volt" aria-hidden />
          {eyebrow}
        </p>
        <h2 className="type-heading-1 text-balance text-ink">{heading}</h2>

        <div className="mt-12">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <p className="font-display text-[clamp(2.5rem,4vw,3.25rem)] font-semibold leading-none tracking-[-0.04em] text-ink tabular-nums">
              {rate}
            </p>
            <p className="type-body-sm max-w-[46ch] text-ink-2">{rateCaption}</p>
          </div>

          {/* The whole is `from`. Decorative: both segments are named in the
              legend below, with their counts. */}
          <p className="type-mono-sm mt-9 text-muted">
            {from.value.toLocaleString()} {from.label.toLowerCase()}
          </p>
          <div
            aria-hidden
            className="mt-3 flex h-11 overflow-hidden rounded-[var(--r-2)] bg-line"
          >
            <div style={{ width: `${sharePct}%` }} className="h-full bg-volt" />
          </div>

          <div className="mt-3.5 flex flex-wrap items-start justify-between gap-x-8 gap-y-2">
            <p className="flex items-center gap-2.5 text-[13.5px] text-ink">
              <span className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-volt" aria-hidden />
              <span className="font-medium tabular-nums">{to.value.toLocaleString()}</span>
              {to.label.toLowerCase()}
            </p>
            <p className="flex items-center gap-2.5 text-[13.5px] text-muted">
              <span className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-line-2" aria-hidden />
              <span className="font-medium tabular-nums">{remainder.toLocaleString()}</span>
              not shared
            </p>
          </div>
        </div>

        <div className="measure mt-12 space-y-4 border-t border-line pt-9">
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
