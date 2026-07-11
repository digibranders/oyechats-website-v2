import { cn } from '@/lib/cn';

export function LogoCloud({
  logos,
  className,
}: {
  logos: { name: string; wordmark?: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-8 gap-y-6 items-center',
        className
      )}
    >
      {logos.map((logo) => (
        <div
          key={logo.name}
          className="flex items-center justify-center h-10 grayscale opacity-55 hover:opacity-100 hover:grayscale-0 transition-[opacity,filter] duration-200"
          title={logo.name}
        >
          <span className="font-display font-semibold text-[15px] text-ink tracking-tight">
            {logo.wordmark ?? logo.name}
          </span>
        </div>
      ))}
    </div>
  );
}
