import { Container } from '@/components/ds';

/**
 * The one intentional dark band on the page. Uses the existing inverse tokens,
 * which measure 12.20:1 for body text and 7.05:1 for muted against the plum
 * black, so nothing here needs a bespoke palette.
 *
 * The figure carries its denominator as text. An earlier version drew the share
 * as a tick on a full-width scale, which put a 2px mark 10px along a 423px line:
 * that reads as a dot at the start of a rule, not as 2.3%. It was the same
 * mistake the outcome strip made with its proportional rules, and it goes for
 * the same reason. Small shares belong in words; the funnel is where this page
 * draws proportion, at a width that survives it.
 *
 * The triggers sit in a band of their own rather than stacked under the prose,
 * because as a third item in the right column they made it 373px against the
 * figure's 141px, leaving 232px of empty dark under the number.
 */
export function SalesHandoffSection({
  id,
  eyebrow,
  heading,
  stat,
  body,
  itemsLabel,
  items,
  ofTotal,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  stat: { value: number; suffix?: string; caption: string };
  body: string[];
  itemsLabel?: string;
  items?: string[];
  /** Top of funnel, so the figure can be anchored to what it is a share of. */
  ofTotal?: number;
}) {
  // A large number on a dark ground is impressive but unmoored. Against its
  // denominator it becomes an argument about restraint: almost nobody needed a
  // person, which is what this section is actually claiming.
  const share =
    ofTotal && ofTotal > 0 && !stat.suffix ? (stat.value / ofTotal) * 100 : null;

  return (
    <section
      id={id}
      className="scroll-mt-14 bg-ink-invert py-20 text-ink-invert-fg md:scroll-mt-10 md:py-24"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="type-mono-sm mb-5 flex items-center gap-2.5 text-ink-invert-muted">
              <span className="h-px w-6 bg-volt-light" aria-hidden />
              {eyebrow}
            </p>
            <p className="font-display text-[clamp(4rem,7vw,6rem)] font-semibold leading-none tracking-[-0.045em] text-ink-invert-fg tabular-nums">
              {stat.value.toLocaleString()}
              {stat.suffix}
            </p>
            <p className="type-body-sm mt-4 text-ink-invert-fg">{stat.caption}</p>
            {share !== null && (
              <p className="type-mono-sm mt-2.5 text-ink-invert-muted">
                {share.toFixed(1)}% of all {ofTotal?.toLocaleString()} conversations
              </p>
            )}
          </div>

          <div className="lg:col-span-7">
            <h2 className="type-heading-1 text-balance text-ink-invert-fg">{heading}</h2>
            <div className="measure mt-6 space-y-4">
              {body.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0 ? 'type-body text-ink-invert-fg' : 'type-body text-ink-invert-muted'
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        {items && items.length > 0 && (
          <div className="mt-16 border-t border-white/15 pt-8">
            <h3 className="type-mono-sm mb-6 text-ink-invert-muted">
              {itemsLabel ?? 'Supporting detail'}
            </h3>
            <ul className="m-0 grid list-none gap-x-8 gap-y-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[14px] leading-snug text-ink-invert-fg/90"
                >
                  <span
                    aria-hidden
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-volt-light"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
