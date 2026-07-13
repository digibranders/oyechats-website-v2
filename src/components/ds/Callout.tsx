import type { ReactNode } from 'react';
import { Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

type Variant = 'info' | 'warn' | 'success' | 'danger';

/**
 * Callout, a quiet inline note.
 * No tinted background, no coloured left-stripe. Just a small icon,
 * a mono-styled title, and body text. Fits the Voltage Paper aesthetic
 * without turning into a boxed alert. Danger variant is the only one
 * that gets any colour beyond the icon.
 */
const styles: Record<
  Variant,
  { Icon: typeof Info; iconColor: string; titleColor: string }
> = {
  info: {
    Icon: Info,
    iconColor: 'text-muted',
    titleColor: 'text-ink',
  },
  warn: {
    Icon: AlertTriangle,
    iconColor: 'text-alert',
    titleColor: 'text-ink',
  },
  success: {
    Icon: CheckCircle2,
    iconColor: 'text-signal',
    titleColor: 'text-ink',
  },
  danger: {
    Icon: XCircle,
    iconColor: 'text-danger',
    titleColor: 'text-danger',
  },
};

export function Callout({
  variant = 'info',
  title,
  children,
  className,
}: {
  variant?: Variant;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const s = styles[variant];
  const { Icon } = s;
  return (
    <div className={cn('flex gap-2.5 items-start py-1', className)}>
      <Icon
        className={cn('shrink-0 mt-[3px]', s.iconColor)}
        size={14}
        strokeWidth={2}
      />
      <div className="min-w-0 flex-1 type-body-sm text-ink-2 leading-relaxed">
        {title && (
          <span className={cn('font-semibold', s.titleColor)}>
            {title}
            {'. '}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}
