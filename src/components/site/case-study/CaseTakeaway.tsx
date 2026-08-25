import { Container } from '@/components/ds';

/**
 * The study's authored conclusion.
 *
 * Explicitly NOT a blockquote. The source presents this line unattributed, and
 * the previous implementation rendered it as a large serif italic inside
 * quotation marks with an oversized opening quote mark, which reads as the
 * client speaking. There is no customer to attribute it to, so it is set as
 * what it is: the writer's closing statement.
 */
export function CaseTakeaway({
  id,
  eyebrow,
  heading,
  conclusion,
  body,
  closing,
  endToEnd,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  conclusion: string;
  body: string[];
  closing?: string;
  /** First and last funnel stage, so the closing rate is derived, not typed. */
  endToEnd?: { first: number; last: number };
}) {
  // The page opens on the top of funnel. Closing on what survived it gives the
  // argument an ending instead of a stop, and the rate is computed from the two
  // counts so it can never drift from the funnel above it.
  const rate =
    endToEnd && endToEnd.first > 0
      ? `${((endToEnd.last / endToEnd.first) * 100).toFixed(1)}%`
      : null;
  return (
    <section id={id} className="scroll-mt-14 md:scroll-mt-10 border-b border-line bg-paper py-20 md:py-24">
      <Container>
        <p className="type-mono-sm mb-5 flex items-center gap-2.5 text-muted">
          <span className="h-px w-6 bg-volt" aria-hidden />
          {eyebrow}
        </p>

        <h2 className="type-display-3 measure-narrow text-ink">{heading}</h2>
        <p className="type-display-3 measure-narrow mt-1 text-muted">{conclusion}</p>

        <div className="measure mt-10 space-y-4 border-t border-line pt-8">
          {body.map((p, i) => (
            <p key={i} className={i === 0 ? 'type-body-lg text-ink' : 'type-body text-ink-2'}>
              {p}
            </p>
          ))}
        </div>

        {rate && closing && (
          <div className="mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-3 border-t border-line pt-8">
            <p className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-semibold leading-none tracking-[-0.045em] text-volt tabular-nums">
              {rate}
            </p>
            <p className="type-body-sm measure-narrow text-ink-2">{closing}</p>
          </div>
        )}
      </Container>
    </section>
  );
}
