import type { FunnelStage } from '@/lib/case-studies';

/**
 * Three transformations, each with the reported count that backs it.
 *
 * This was the only section on the page making claims without numbers. Every
 * other section is evidence; this one asserted three things and asked to be
 * taken on faith, on a page whose whole argument is that you can check the
 * arithmetic. Each claim already had its figure sitting in the funnel above, so
 * it now cites it.
 *
 * The figure is resolved from the funnel by stage id rather than typed into the
 * copy, so it cannot drift from the chart and cannot be invented: a claim with
 * no reported count behind it renders without one.
 *
 * The 01/02/03 markers that used to hold the left column are gone. They cost
 * ~80px of dead space, and these are three facets of one change rather than a
 * sequence, so numbering them encoded nothing true.
 */
export function ImpactTransformations({
  items,
  stages,
}: {
  items: { was?: string; title: string; body: string; evidence?: string }[];
  stages: FunnelStage[];
}) {
  return (
    <ol className="m-0 list-none p-0">
      {items.map((item) => {
        const stage = item.evidence ? stages.find((s) => s.id === item.evidence) : undefined;

        return (
          /* Two columns, not three. Three split the evidence from the claim it
             supports and, because grid stretches every child to the tallest of
             them, left the number block with about 100px of visible emptiness
             beneath it in every row at 1024px. Pairing the figure with its
             claim balances the two sides and gives the title enough width to
             stay on one line, which it did not have at 357px. */
          <li
            key={item.title}
            className="grid gap-x-12 gap-y-6 border-t border-line py-10 lg:grid-cols-2"
          >
            <div>
              {stage && (
                <div className="mb-7">
                  <p className="font-display text-[clamp(1.875rem,3vw,2.5rem)] font-semibold leading-none tracking-[-0.04em] text-ink tabular-nums">
                    {stage.value.toLocaleString()}
                  </p>
                  <p className="type-mono-sm mt-2.5 text-muted">{stage.label}</p>
                </div>
              )}

              {item.was && (
                <>
                  <p className="font-mono text-[13px] leading-relaxed text-muted">{item.was}</p>
                  {/* The hinge. A short rule reads as "this turned into that"
                      without an icon doing the talking. */}
                  <span className="mt-2.5 mb-3 block h-px w-7 bg-volt" aria-hidden />
                </>
              )}
              <h3 className="type-heading-2 text-balance text-ink">{item.title}</h3>
            </div>

            <p className="type-body text-ink-2 lg:pt-1">{item.body}</p>
          </li>
        );
      })}
    </ol>
  );
}
