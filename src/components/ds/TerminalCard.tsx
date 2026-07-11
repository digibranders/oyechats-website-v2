import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function TerminalCard({
  title = '~/oyechats · v4.2.0',
  children,
  className,
  showCursor = true,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  showCursor?: boolean;
}) {
  return (
    <div
      className={cn(
        'bg-ink-invert text-ink-invert-fg rounded-[var(--r-4)] overflow-hidden shadow-[var(--e-2)]',
        className
      )}
    >
      <div className="h-9 px-4 flex items-center justify-between border-b border-white/5">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840] inline-block" />
        </div>
        <div className="font-mono text-[11px] text-white/50 tracking-wide">{title}</div>
      </div>
      <div className="p-6 font-mono text-[13px] leading-[1.7]">
        {children}
        {showCursor && (
          <span
            className="inline-block w-2 h-3.5 bg-volt align-[-2px] ml-1 animate-blink"
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}

/** Helpers for terminal syntax highlighting */
export function TermCmd({ children }: { children: ReactNode }) {
  return <div className="before:content-['$_'] before:text-white/40">{children}</div>;
}
export function TermK({ children }: { children: ReactNode }) {
  return <span className="text-[#E879F9]">{children}</span>;
}
export function TermS({ children }: { children: ReactNode }) {
  return <span className="text-[#98F0BF]">{children}</span>;
}
export function TermCmt({ children }: { children: ReactNode }) {
  return <span className="text-white/35">{children}</span>;
}
