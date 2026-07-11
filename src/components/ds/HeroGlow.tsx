import { cn } from '@/lib/cn';

/**
 * Ambient Volt aurora glow, sits behind hero content on paper sections.
 * Very subtle (0.16 opacity, 80px blur, animated on 12s drift). Reads as
 * premium not neon.
 */
export function HeroGlow({
  size = 'lg',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'volt-aurora',
        size === 'sm' && 'volt-aurora-sm',
        className
      )}
      aria-hidden
    />
  );
}
