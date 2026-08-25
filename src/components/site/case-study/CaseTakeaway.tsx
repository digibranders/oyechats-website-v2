import { Container } from '@/components/ds';

/**
 * The study's authored conclusion.
 *
 * Explicitly NOT a blockquote. The source presents this line unattributed, and
 * an earlier version set it as a large serif italic inside quotation marks with
 * an oversized opening quote mark, which reads as the client speaking. There is
 * no customer to attribute it to, so it is set as what it is: the writer's
 * closing statement.
 *
 * The lower half is one grid, not two stacked blocks. Previously the recap sat
 * under a 626px rule and the closing figure under a 1104px one, so neither rule
 * matched its own content and 422px of the second had nothing beneath it at
 * all. One rule now spans one grid: the recap reads left, the figure closes on
 * the right, and on mobile the figure stacks last so it keeps the final word.
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
  const showFigure = Boolean(rate && closing);

  return (
    <section id={id} className="scroll-mt-14 border-b border-line bg-paper py-20 md:scroll-mt-10 md:py-24">
      <Container>
        <p className="type-mono-sm mb-5 flex items-center gap-2.5 text-muted">
          <span className="h-px w-6 bg-volt" aria-hidden />
          {eyebrow}
        </p>

        {/* A couplet: the claim, then what it resolves to. Equal size, because
            they are one thought; the tone shift carries the beat instead.
            The claim is left unconstrained: it fits one line at every width the
            container allows, and forcing a cap broke it after "replace". Only
            the longer second line takes a measure. Note that the `measure-narrow`
            class that used to sit here did nothing at all, since `ch` scales with
            font size and 52ch at display size is wider than the container. */}
        <h2 className="font-display text-[clamp(1.875rem,2.8vw+1.2rem,3.5rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-balance text-ink">
          {heading}
        </h2>
        <p className="mt-1.5 max-w-[26ch] font-display text-[clamp(1.875rem,2.8vw+1.2rem,3.5rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-balance text-muted">
          {conclusion}
        </p>

        <div className="mt-14 grid gap-x-14 gap-y-10 border-t border-line pt-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            {body.map((p, i) => (
              <p key={i} className={i === 0 ? 'type-body-lg text-ink' : 'type-body text-ink-2'}>
                {p}
              </p>
            ))}
          </div>

          {showFigure && (
            <div className="lg:col-span-5 lg:border-l lg:border-line lg:pl-14">
              <p className="font-display text-[clamp(3rem,6vw,4rem)] font-semibold leading-none tracking-[-0.045em] text-volt tabular-nums">
                {rate}
              </p>
              <p className="type-body-sm mt-4 text-ink-2">{closing}</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
