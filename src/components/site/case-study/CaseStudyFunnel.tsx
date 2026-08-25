import type { FunnelStage } from '@/lib/case-studies';
import { stageShare, stepRate } from '@/lib/case-studies';
import { cn } from '@/lib/cn';

/**
 * The conversation funnel, as a vertical stage progression.
 *
 * The rail on each row is drawn at the stage's true share of the top of
 * funnel, with NO minimum width. That distinction is the whole point. An
 * earlier version of this chart carried `minWidth: 12px`, which on a 205px
 * mobile track drew the bottom three stages (2.3%, 1.5% and 1.3%) at an
 * identical 5.85%, so it showed no attrition at all across exactly the stages
 * this study is about.
 *
 * Drawn honestly, 241 is a two pixel thread at the desktop rail width. That
 * thread lands harder than the inflated block ever did, because 1.29% really
 * is almost nothing. If a future change makes the smallest rail feel too
 * small, widen the rail; never floor the value.
 *
 * The rail is decorative. Every quantity it encodes is a written numeral in
 * the same row, and rank is carried by order, so the section reads identically
 * with the rails absent.
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
                'grid items-center gap-x-5 gap-y-2.5 border-t py-5',
                'grid-cols-[auto_1fr] md:grid-cols-[2rem_10.5rem_1fr]',
                isFocal ? 'border-volt-line' : 'border-line',
              )}
            >
              <span
                className={cn(
                  'shrink-0 font-mono text-[11px] font-semibold tabular-nums',
                  isFocal ? 'text-volt' : 'text-muted',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* True proportion, no floor. See the note above. */}
              <span
                aria-hidden
                className="order-last col-span-2 h-3 overflow-hidden rounded-[2px] bg-line md:order-none md:col-span-1 md:h-3.5"
              >
                <span
                  className="block h-full rounded-[2px]"
                  style={{
                    width: `${stageShare(stage, stages)}%`,
                    background:
                      'linear-gradient(90deg, var(--volt) 0%, var(--volt-light) 100%)',
                  }}
                />
              </span>

              <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">

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
                  'min-w-0',
                  isFocal ? 'type-body font-medium text-ink' : 'type-body text-ink-2',
                )}
              >
                {stage.label}
              </span>
              </span>

              {stage.note && (
                <span className="type-body-sm col-span-2 text-muted md:col-span-3">
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
