import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function DataFlowLine({
  nodes,
  className,
}: {
  nodes: { label?: string; icon?: ReactNode }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-6 py-5 border border-dashed border-line rounded-[var(--r-3)] bg-canvas max-w-[640px]',
        className
      )}
    >
      {nodes.map((node, i) => (
        <div key={i} className="flex items-center gap-3 flex-1 last:flex-none">
          <div
            className="w-11 h-11 rounded-[var(--r-3)] bg-canvas border border-line shadow-[var(--e-1)] flex items-center justify-center font-mono text-[11px] text-volt font-medium shrink-0"
            title={node.label}
          >
            {node.icon ?? node.label?.[0] ?? '·'}
          </div>
          {i < nodes.length - 1 && (
            <div
              className="flex-1 h-0.5 relative"
              style={{
                backgroundImage: 'linear-gradient(90deg, var(--volt) 50%, transparent 50%)',
                backgroundSize: '12px 2px',
              }}
            >
              <span
                className="absolute -top-[3px] w-2 h-2 rounded-full bg-volt shadow-[0_0_12px_rgba(162,28,175,0.4)] animate-flow"
                style={{ animationDelay: `${i * 0.5}s` }}
                aria-hidden
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
