import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Role = 'visitor' | 'agent' | 'operator';

const styles: Record<Role, string> = {
  visitor:
    'bg-canvas border border-line rounded-[var(--r-3)] rounded-br-[var(--r-1)] text-ink self-end',
  agent:
    'bg-volt-tint border border-volt-line rounded-[var(--r-3)] rounded-bl-[var(--r-1)] text-volt-ink self-start',
  operator:
    'bg-ink-invert text-ink-invert-fg rounded-[var(--r-3)] rounded-bl-[var(--r-1)] font-mono self-start',
};

export function ChatBubble({
  role,
  children,
  className,
}: {
  role: Role;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col max-w-[85%]', role === 'visitor' ? 'items-end' : 'items-start', className)}>
      <span className="type-mono-sm opacity-60 mb-1">{role}</span>
      <div className={cn('px-4 py-3 text-[14px] leading-[1.5]', styles[role])}>{children}</div>
    </div>
  );
}

export function ChatStack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3 max-w-[520px]', className)}>{children}</div>
  );
}
