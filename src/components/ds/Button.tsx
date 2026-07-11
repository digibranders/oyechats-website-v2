import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'volt' | 'ghost' | 'link' | 'outline-invert' | 'ghost-invert';
type Size = 'sm' | 'md' | 'lg';

const base =
  'press relative inline-flex items-center justify-center gap-2 font-medium leading-none rounded-[var(--r-2)] transition-[background,transform,box-shadow,border-color,color] duration-200 ease-[var(--ease-inout)] no-underline whitespace-nowrap select-none';

const variants: Record<Variant, string> = {
  // Primary, ink fill with subtle inner highlight
  primary:
    'bg-ink text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(11,16,32,0.14)] hover:bg-[#1F1F22] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_6px_16px_-4px_rgba(11,16,32,0.28)]',
  // Volt, bright accent with soft violet glow baked in. Label ALWAYS white.
  volt:
    '!text-white bg-volt shadow-[0_0_0_1px_rgba(134,25,143,0.5),0_10px_28px_-8px_rgba(162,28,175,0.60),inset_0_1px_0_rgba(255,255,255,0.20)] hover:bg-volt-2 hover:shadow-[0_0_0_1px_rgba(112,26,117,0.65),0_16px_36px_-8px_rgba(162,28,175,0.75),inset_0_1px_0_rgba(255,255,255,0.25)]',
  // Ghost, sits on canvas so it always reads; darker border, tinted hover
  ghost:
    'bg-canvas text-ink border border-line-2 shadow-[0_1px_2px_rgba(11,16,32,0.04)] hover:bg-paper hover:border-ink hover:text-ink hover:shadow-[0_4px_12px_-2px_rgba(11,16,32,0.08)]',
  // Link, inline underlined volt
  link: 'bg-transparent text-volt underline underline-offset-4 decoration-[1.5px] hover:decoration-[2.5px] px-1 py-1',
  // Outline invert, for use on ink-invert / dark backgrounds
  'outline-invert':
    '!text-white bg-white/8 border border-white/25 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] hover:bg-white/14 hover:border-white/45',
  // Ghost invert, quieter dark-bg button
  'ghost-invert':
    '!text-white bg-transparent border border-white/15 hover:bg-white/8 hover:border-white/30',
};

const sizes: Record<Size, string> = {
  sm: 'text-[13px] px-3.5 py-2',
  md: 'text-sm px-5 py-3',
  lg: 'text-[15px] px-6 py-4',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & { href: string; external?: boolean } & Omit<ComponentProps<typeof Link>, 'href' | 'children' | 'className'>;
type ButtonAsButton = CommonProps & { href?: undefined } & Omit<ComponentProps<'button'>, 'children' | 'className'>;

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = 'primary', size = 'md', className, children } = props;
  const classes = cn(base, sizes[size], variants[variant], className);

  if ('href' in props && props.href) {
    const { href, external, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    void _v; void _s; void _c; void _ch;
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...(rest as ComponentProps<'a'>)}
        >
          <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...btnRest } = props as ButtonAsButton;
  void _v; void _s; void _c; void _ch;
  return (
    <button className={classes} {...btnRest}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
