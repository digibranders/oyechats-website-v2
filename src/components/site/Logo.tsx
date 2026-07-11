import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';

/**
 * OyeChats brand, the navy chat-bubble mark + wordmark.
 * The PNG is a dark navy circle with a white chat glyph; on ink-invert
 * surfaces we flip it to a light circle with dark glyph via `invert(1)`.
 */
export function Logo({
  className,
  subtitle,
  invert = false,
  size = 28,
}: {
  className?: string;
  subtitle?: string;
  invert?: boolean;
  size?: number;
}) {
  return (
    <Link href="/" className={cn('flex items-center gap-2.5 no-underline', className)}>
      <span
        className="relative inline-flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <Image
          src="/oyechats-mark.png"
          alt=""
          width={size * 2}
          height={size * 2}
          className={cn(
            'block h-full w-full',
            invert && 'invert brightness-110'
          )}
          priority
        />
      </span>
      <span
        className={cn(
          'font-display font-semibold text-[16px] tracking-[-0.01em]',
          invert ? 'text-paper' : 'text-ink'
        )}
      >
        OyeChats
      </span>
      {subtitle && (
        <span
          className={cn(
            'font-mono text-[12px] font-medium ml-1.5 hidden sm:inline',
            invert ? 'text-ink-invert-muted' : 'text-muted'
          )}
        >
          {subtitle}
        </span>
      )}
    </Link>
  );
}
