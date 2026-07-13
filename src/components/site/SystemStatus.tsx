'use client';

import { useEffect, useState } from 'react';
import { Chip } from '@/components/ds';
import type { SystemStatusValue } from '@/app/api/status/route';

type Chrome = { variant: 'signal' | 'alert' | 'danger' | 'mono'; label: string };

/**
 * Live platform status pill for the footer. Polls the same-origin `/api/status`
 * proxy (which reads api.oyechats.com/health) and reflects the real state.
 * Before the first check resolves, or if the platform can't be reached, it
 * shows a neutral, non-committal label. It only turns green when the platform
 * actually reports healthy, so the footer can never falsely claim "operational".
 */

const CHROME: Record<SystemStatusValue | 'loading', Chrome> = {
  loading: { variant: 'mono', label: 'Checking status…' },
  operational: { variant: 'signal', label: 'All systems operational' },
  degraded: { variant: 'alert', label: 'Partial degradation' },
  down: { variant: 'danger', label: 'Service disruption' },
  unknown: { variant: 'mono', label: 'Status unavailable' },
};

const POLL_MS = 60_000;

export function SystemStatus() {
  const [status, setStatus] = useState<SystemStatusValue | 'loading'>('loading');
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        const data = (await res.json()) as { status?: SystemStatusValue; checkedAt?: string };
        if (!active) return;
        setStatus(data.status ?? 'unknown');
        setCheckedAt(data.checkedAt ?? null);
      } catch {
        if (active) setStatus('unknown');
      }
    };

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const { variant, label } = CHROME[status];
  const title = checkedAt
    ? `Last checked ${new Date(checkedAt).toLocaleTimeString()}`
    : 'Live platform status';

  return (
    <span aria-live="polite" title={title}>
      <Chip variant={variant}>{label}</Chip>
    </span>
  );
}
