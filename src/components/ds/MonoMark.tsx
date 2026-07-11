import { Chip } from './Chip';

/** Recurring mono-badge texture, ~/oyechats, v4.2.0, POST /qualify, etc. */
export function MonoMark({ children }: { children: React.ReactNode }) {
  return <Chip variant="mono">{children}</Chip>;
}
