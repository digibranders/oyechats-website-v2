import type { FunnelStage } from '@/lib/case-studies';
import { stepRate } from '@/lib/case-studies';
import { cn } from '@/lib/cn';

/**
 * The conversation funnel, as a vertical stage progression.
 *
 * This replaces a horizontal proportional bar chart that was quietly lying.
 * Its bars carried `minWidth: 12px`, which on a 205px mobile track drew the
 * bottom three stages (2.3%, 1.5% and 1.3%) at an identical 5.85%, so the
 * chart showed no attrition at all across exactly the stages this study is
 * about. There is no minimum-width floor here and no proportional bar to need
 * one: every quantity is a written numeral, and rank is carried by order.
 *
 * SSR contract: this is a server component. Nothing is gated on an observer or
 * on hydration, so the full sequence is in the static HTML for a non-JS
 * crawler, and there is no render path that can strand a stage unpainted. The
 * previous version needed a visibility guard and a 4s observer backstop purely
 * to protect an entrance animation; removing the animation removed the risk.
 */

/** The stage the study turns on. Emphasised, but never scaled. */
const FOCAL_STAGE_ID = 'leads';

/** Stage after which the qualification filter annotation is shown. */
const FILTER_AFTER_ID = 'validated';

/**
 * Lowercases only the first character, so a label reads naturally mid-sentence
 * without flattening acronyms. A plain `toLowerCase()` turned "Potential B2B
 * leads identified" into "potential b2b leads identified".
 */
function lowerFirst(label: string): string {
  return label.charAt(0).toLowerCase() + label.slice(1);
}

export function CaseStudyFunnel({
  stages,
  className,
}: {
  stages: FunnelStage[];
  className?: string;
}) {
  return (
    <ol className={cn('relative', className)}>
      {stages.map((stage, i) => {
        const prev = i === 0 ? null : stages[i - 1];
        const rate = prev ? stepRate(prev.value, stage.value) : null;
        const dropped = prev ? prev.value - stage.value : 0;
        const isFocal = stage.id === FOCAL_STAGE_ID;
        const isFilter = prev?.id === FILTER_AFTER_ID;

        return (
          <li key={stage.id}>
            {prev && (
              <Transition
                rate={rate}
                dropped={dropped}
                qualification={isFilter}
                continuedInto={isFilter ? lowerFirst(stage.label) : null}
              />
            )}

            <div
              className={cn(
                'flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t py-5',
                isFocal ? 'border-volt-line' : 'border-line',
              )}
            >
              <span
                className={cn(
                  'w-8 shrink-0 font-mono text-[11px] font-semibold tabular-nums',
                  isFocal ? 'text-volt' : 'text-muted',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* The count leads the row. It is the evidence; the label names
                  it. Keeping them on one baseline stops the number orphaning
                  onto its own line at 375px, which the previous layout did. */}
              <span
                className={cn(
                  'font-display font-semibold leading-none tabular-nums tracking-[-0.03em]',
                  isFocal
                    ? 'text-[clamp(2rem,4vw,2.75rem)] text-volt-ink'
                    : 'text-[clamp(1.375rem,2.2vw,1.75rem)] text-ink',
                )}
              >
                {stage.value.toLocaleString()}
              </span>

              <span
                className={cn(
                  'min-w-0 flex-1',
                  isFocal ? 'type-body font-medium text-ink' : 'type-body text-ink-2',
                )}
              >
                {stage.label}
              </span>

              {stage.note && (
                <span className="type-body-sm w-full pl-8 text-muted sm:pl-[3.25rem]">
                  {stage.note}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * The step between two stages.
 *
 * Every figure here is real text in the accessible tree. The previous
 * implementation wrapped this entire block in `aria-hidden`, which removed all
 * seven drop-offs and the biggest-drop callout from assistive technology, on a
 * page whose whole argument is the attrition. Only the connector rule and the
 * arrow glyph are decorative.
 */
function Transition({
  rate,
  dropped,
  qualification,
  continuedInto,
}: {
  rate: number | null;
  dropped: number;
  qualification: boolean;
  continuedInto: string | null;
}) {
  if (rate === null) return null;

  return (
    <div className="flex items-stretch gap-4 pl-3">
      <span className="w-px shrink-0 bg-line-2" aria-hidden />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-3">
        {qualification ? (
          <>
            {/* Named for what it is. This step is the chatbot doing its job,
                not a leak, so "biggest drop" would have been the wrong word. */}
            <span className="type-mono-sm rounded-[var(--r-1)] border border-volt-line bg-volt-tint px-2.5 py-1.5 text-volt-ink">
              Qualification filter
            </span>
            <span className="type-body-sm text-ink-2">
              {rate}% continued to {continuedInto}
            </span>
          </>
        ) : (
          <span className="type-body-sm text-ink-2">{rate}% continued</span>
        )}
        <span className="type-body-sm text-muted">
          {dropped.toLocaleString()} did not continue
        </span>
      </div>
    </div>
  );
}
