import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';

/** Intrinsic wordmark aspect ratio (1390×424 source artwork). */
const WORDMARK_RATIO = 1390 / 424;

/**
 * OyeChats brand wordmark — the cursive "Oye", the C chat-bubble mark, and
 * "chats" as one lockup image (the standalone icon + text spans are gone).
 * Two artwork files rather than a CSS filter: the dark wordmark reads on light
 * surfaces, and on ink-invert surfaces (footer) we swap to the white wordmark
 * so the artwork stays crisp instead of being negated.
 *
 * `size` is the rendered height in px; width follows the intrinsic ratio.
 * `alt` carries the brand name so the link keeps an accessible name and the
 * wordmark stays legible to crawlers even though the text is now baked in.
 */
export function Logo({
  className,
  imgClassName,
  invert = false,
  size = 27,
  priority = false,
}: {
  className?: string;
  /** Extra classes for the wordmark image itself — used to override the
   *  intrinsic height responsively (e.g. `md:h-8`); pair with `w-auto` so the
   *  ratio is preserved. `size` should be set to the largest rendered height so
   *  the generated srcset stays crisp at every breakpoint. */
  imgClassName?: string;
  invert?: boolean;
  size?: number;
  /** Only the header instance is above the fold. `priority` was hardcoded, so
   *  the footer logo also loaded eagerly and competed with real LCP resources. */
  priority?: boolean;
}) {
  const width = Math.round(size * WORDMARK_RATIO);
  return (
    <Link href="/" className={cn('inline-flex items-center no-underline', className)}>
      <Image
        src={invert ? '/oyechats-wordmark-light.png' : '/oyechats-wordmark.png'}
        alt="OyeChats"
        width={width}
        height={size}
        className={cn('block', imgClassName)}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
      />
    </Link>
  );
}
