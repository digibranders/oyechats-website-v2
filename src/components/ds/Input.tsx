import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

// py-3 keeps single-line inputs at/above the 44px touch-target floor
// (WCAG 2.5.5 / iOS). Textarea grows past that via rows, so it's unaffected.
const base =
  'block w-full bg-canvas border border-line rounded-[var(--r-2)] px-3.5 py-3 text-sm text-ink leading-[1.5] transition-[border-color,box-shadow] duration-200 ease-[var(--ease-inout)] placeholder:text-muted focus:outline-none focus:border-volt focus:shadow-[var(--e-focus)]';

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, className)} {...rest} />;
}

export function Textarea({
  className,
  rows = 4,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, className)} rows={rows} {...rest} />;
}

export function Label({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block type-body-sm text-muted mb-1.5', className)}
    >
      {children}
    </label>
  );
}
