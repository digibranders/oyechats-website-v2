import { cn } from '@/lib/cn';

/** BANT score ring, 88px SVG by default, ink track, volt fill. */
export function BantScoreRing({
  value = 87,
  size = 120,
  label = 'BANT',
  className,
}: {
  value?: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const circumference = 314; // 2 * PI * 50
  const dashOffset = circumference - (clamped / 100) * circumference;

  const numberSize = Math.round(size / 3.5);
  const labelSize = Math.max(9, Math.round(size / 13));

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="var(--line-2)"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="var(--volt)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 1.4s cubic-bezier(.16, 1, .3, 1)',
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span
          className="font-display font-semibold text-ink tabular-nums"
          style={{ fontSize: numberSize, letterSpacing: '-0.02em' }}
        >
          {clamped}
        </span>
        <span
          className="font-mono font-medium text-muted uppercase mt-1 tracking-[0.1em]"
          style={{ fontSize: labelSize }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
