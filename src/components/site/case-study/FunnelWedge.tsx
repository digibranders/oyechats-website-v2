import type { FunnelStage } from '@/lib/case-studies';
import { stageShare } from '@/lib/case-studies';
import { cn } from '@/lib/cn';

/**
 * The study's funnel as a single silhouette: one band per stage, each drawn at
 * its true share of the top of funnel.
 *
 * There is no minimum width, and there must never be one. At the ~420px this
 * renders at on desktop the smallest stage is 5.4px, which reads perfectly
 * well, and the reason it looks like almost nothing is that 1.29% is almost
 * nothing. An earlier bar treatment on this page carried a 12px floor that drew
 * that same stage at 5.85%, four and a half times its real size.
 *
 * Decorative: every figure it encodes is written out as text elsewhere on the
 * page, so it carries no accessible name.
 */
export function FunnelWedge({
  stages,
  className,
}: {
  stages: FunnelStage[];
  className?: string;
}) {
  const first = stages[0];
  const last = stages[stages.length - 1];
  if (!first || !last) return null;

  return (
    <figure className={cn('m-0', className)}>
      <figcaption className="type-mono-sm mb-5 flex items-center gap-2.5 text-muted">
        <span className="h-px w-6 bg-volt" aria-hidden />
        The 90 day funnel, to scale
      </figcaption>

      <div className="flex flex-col gap-[5px]" aria-hidden>
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="mx-auto h-[26px] rounded-[2px] md:h-[30px]"
            style={{
              width: `${stageShare(stage, stages)}%`,
              background: 'linear-gradient(90deg, var(--volt) 0%, var(--volt-light) 100%)',
            }}
          />
        ))}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <span className="type-mono-sm text-muted">
          {first.value.toLocaleString()} conversations
        </span>
        <span className="type-mono-sm text-muted">
          {last.value.toLocaleString()} quotations
        </span>
      </div>
    </figure>
  );
}
