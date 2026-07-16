import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container } from './Container';

type Tone = 'paper' | 'canvas' | 'ink-invert';

const tones: Record<Tone, string> = {
  paper: 'bg-paper text-ink',
  canvas: 'bg-canvas text-ink',
  'ink-invert': 'bg-ink-invert text-ink-invert-fg',
};

export function Section({
  tone = 'paper',
  eyebrow,
  heading,
  sub,
  actions,
  className,
  containerSize,
  children,
  id,
}: {
  tone?: Tone;
  eyebrow?: string;
  heading?: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
  className?: string;
  containerSize?: 'default' | 'prose' | 'narrow' | 'wide';
  children?: ReactNode;
  id?: string;
}) {
  const isInvert = tone === 'ink-invert';
  return (
    <section
      id={id}
      className={cn(
        'py-16 md:py-20 border-b',
        tone === 'ink-invert' ? 'border-transparent' : 'border-line',
        tones[tone],
        className
      )}
    >
      <Container size={containerSize}>
        {(eyebrow || heading || sub || actions) && (
          <div className="mb-8 md:mb-12 max-w-3xl">
            {eyebrow && (
              <div
                className={cn(
                  'type-mono-sm flex items-center gap-2.5 mb-4',
                  isInvert ? 'text-ink-invert-muted' : 'text-muted'
                )}
              >
                <span className="w-6 h-px bg-volt" />
                <span>{eyebrow}</span>
              </div>
            )}
            {heading && (
              <h2 className={cn('type-display-3', isInvert ? 'text-ink-invert-fg' : 'text-ink')}>
                {heading}
              </h2>
            )}
            {sub && (
              <p
                className={cn(
                  'type-body-lg mt-4 max-w-[540px]',
                  isInvert ? 'text-ink-invert-muted' : 'text-ink-2'
                )}
              >
                {sub}
              </p>
            )}
            {actions && <div className="mt-8 flex gap-3 flex-wrap">{actions}</div>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
