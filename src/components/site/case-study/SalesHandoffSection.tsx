import { Container } from '@/components/ds';

/**
 * The one intentional dark band on the page. Uses the existing inverse tokens,
 * which measure 12.20:1 for body text and 7.05:1 for muted against the plum
 * black, so nothing here needs a bespoke palette.
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
  // A large number on a dark ground is impressive but unmoored. Against a
  // full-width scale it becomes an argument about restraint: almost nobody
  // needed a person, which is what this section is actually claiming.
  const share =
    ofTotal && ofTotal > 0 && !stat.suffix ? (stat.value / ofTotal) * 100 : null;
  return (
    <section
      id={id}
      className="scroll-mt-32 bg-ink-invert py-20 text-ink-invert-fg md:py-24"
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
            <p className="type-body-sm mt-4 text-ink-invert-muted">{stat.caption}</p>

            {share !== null && (
              <>
                <div className="relative mt-7 h-px w-full bg-white/20" aria-hidden>
                  <span
                    className="absolute -top-[5px] h-[11px] w-[2px] bg-volt-light"
                    style={{ left: `${share}%` }}
                  />
                </div>
                <p className="type-mono-sm mt-3 text-ink-invert-muted">
                  {share.toFixed(1)}% of all {ofTotal?.toLocaleString()} conversations
                </p>
              </>
            )}
          </div>

          <div className="lg:col-span-7">
            <h2 className="type-heading-1 text-ink-invert-fg">{heading}</h2>
            <div className="measure mt-6 space-y-4">
              {body.map((p, i) => (
                <p
                  key={i}
                  className={i === 0 ? 'type-body text-ink-invert-fg' : 'type-body text-ink-invert-muted'}
                >
                  {p}
                </p>
              ))}
            </div>

            {items && items.length > 0 && (
              <>
                <h3 className="type-mono-sm mb-4 mt-10 text-ink-invert-muted">
                  {itemsLabel ?? 'Supporting detail'}
                </h3>
                <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="type-body-sm flex items-start gap-2.5 text-ink-invert-fg/90"
                    >
                      <span
                        aria-hidden
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-volt-light"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
