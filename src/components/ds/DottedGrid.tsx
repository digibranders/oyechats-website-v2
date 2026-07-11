import { cn } from '@/lib/cn';

/** Ambient hero background, dotted grid with a radial fade mask. */
export function DottedGrid({
  className,
  intensity = 'medium',
}: {
  className?: string;
  intensity?: 'faint' | 'medium' | 'strong';
}) {
  const opacity = intensity === 'faint' ? '.04' : intensity === 'strong' ? '.09' : '.06';
  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_60%_70%_at_40%_40%,black,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_60%_70%_at_40%_40%,black,transparent_75%)]',
        className
      )}
      style={{
        backgroundImage: `radial-gradient(rgba(10,10,10,${opacity}) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
      aria-hidden
    />
  );
}
