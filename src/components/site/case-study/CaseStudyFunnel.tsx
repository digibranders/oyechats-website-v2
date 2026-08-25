import type { FunnelStage } from '@/lib/case-studies';
import { stageShare, stepRate } from '@/lib/case-studies';
import { cn } from '@/lib/cn';

/**
 * The conversation funnel: one row per stage, eight rows, nothing between them.
 *
 * The rail on each row is drawn at the stage's true share of the top of funnel,
 * with NO minimum width. That distinction is the whole point. An earlier
 * version floored widths at 12px, which on a 205px mobile track drew the bottom
 * three stages (2.3%, 1.5% and 1.3%) at an identical 5.85%, so it showed no
 * attrition at all across exactly the stages this study is about. Drawn
 * honestly, 241 is a two pixel thread. If the smallest rail ever feels too
 * small, widen the rail; never floor the value.
 *
 * The step reads on the row it departs FROM, rather than in a band of its own
 * between two rows. Those bands cost 46px each and made an annotation look like
 * a peer of the stage it annotates: seven of them, 31% of the list's height,
 * for connective tissue. Inline, they also line up into a single scannable
 * column of rates, which is the more useful reading anyway. "18,742 handled, of
 * which 66.6% continued" is how the sentence runs out loud, so the screen
 * reader order is right too.
 *
 * Server component. Nothing is gated on an observer or on hydration, so the
 * full sequence is in the static HTML and no render path can strand a stage.
 */

/** The stage the study turns on. Emphasised, but never scaled. */
const FOCAL_STAGE_ID = 'leads';

/** The step out of this stage is the qualification filter, not a leak. */
const FILTER_FROM_ID = 'validated';

export function CaseStudyFunnel({
  stages,
  className,
}: {
  stages: FunnelStage[];
  className?: string;
}) {
  return (
    <ol className={cn('m-0 max-w-4xl list-none p-0', className)}>
      {stages.map((stage, i) => {
        const next = stages[i + 1];
        const rate = next ? stepRate(stage.value, next.value) : null;
        const dropped = next ? stage.value - next.value : 0;
        const isFocal = stage.id === FOCAL_STAGE_ID;
        const isFilter = stage.id === FILTER_FROM_ID;

        return (
          <li
            key={stage.id}
            className={cn(
              'grid items-center gap-x-5 gap-y-2.5 border-t py-4',
              'grid-cols-[1.75rem_auto_1fr] md:grid-cols-[1.75rem_8.5rem_5.5rem_1fr_11rem]',
              isFocal ? 'border-volt-line' : 'border-line',
            )}
          >
            <span
              className={cn(
                'font-mono text-[11px] font-semibold tabular-nums',
                isFocal ? 'text-volt' : 'text-muted',
              )}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* True proportion, no floor. Order-last on mobile so the count and
                label lead; a full-width rail there is also more precise than
                the desktop one, not less. */}
            <span
              aria-hidden
              className="order-last col-span-3 h-2.5 overflow-hidden rounded-[2px] bg-line md:order-none md:col-span-1 md:h-3"
            >
              <span
                className="block h-full rounded-[2px]"
                style={{
                  width: `${stageShare(stage, stages)}%`,
                  background: 'linear-gradient(90deg, var(--volt) 0%, var(--volt-light) 100%)',
                }}
              />
            </span>

            <span
              className={cn(
                'font-display font-semibold leading-none tabular-nums tracking-[-0.03em] md:text-right',
                isFocal
                  ? 'text-[clamp(1.75rem,3vw,2.125rem)] text-volt-ink'
                  : 'text-[clamp(1.25rem,2vw,1.5rem)] text-ink',
              )}
            >
              {stage.value.toLocaleString()}
            </span>

            <span
              className={cn(
                'min-w-0 text-[15px] leading-snug',
                isFocal ? 'font-medium text-ink' : 'text-ink-2',
              )}
            >
              {stage.label}
            </span>

            {/* Stacked on purpose rather than left to wrap. Two short lines at
                a controlled leading are shorter than one line that breaks
                unpredictably, and the rate and the loss each line up into their
                own scannable column down the table. */}
            {rate !== null && (
              <span className="col-span-3 flex flex-row flex-wrap items-baseline gap-x-3 gap-y-1 md:col-span-1 md:flex-col md:items-end md:gap-0.5 md:text-right">
                {isFilter && (
                  <span className="type-mono-sm mb-1 rounded-[var(--r-1)] border border-volt-line bg-volt-tint px-2 py-1 text-volt-ink">
                    Qualification filter
                  </span>
                )}
                <span
                  className={cn(
                    'text-[13px] leading-tight tabular-nums',
                    isFilter ? 'font-medium text-volt-ink' : 'text-ink-2',
                  )}
                >
                  {rate}% continued
                </span>
                <span className="text-[12px] leading-tight tabular-nums text-muted">
                  {dropped.toLocaleString()} did not continue
                </span>
              </span>
            )}

            {stage.note && (
              <span className="col-span-3 text-[13px] text-muted md:col-span-3 md:col-start-3">
                {stage.note}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
