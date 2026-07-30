'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  currentTimeZone,
  isRestrictedZone,
  readConsentCookie,
  serializeConsentCookie,
  type ConsentValue,
} from '@/lib/consent';

type ConsentContextValue = {
  /** The visitor's explicit choice. `null` means they have not made one. */
  consent: ConsentValue | null;
  /**
   * What analytics is actually doing right now, which is NOT the same as
   * `consent`: outside the restricted regions the bootstrap grants analytics by
   * default, so an undecided visitor is being measured. Any UI reporting state
   * to the visitor must read this, never `consent` — showing "Off" while GA is
   * running misrepresents the processing.
   */
  effectiveConsent: ConsentValue;
  isRestricted: boolean;
  /** False until the mount effect has read cookie, GPC and timezone. */
  isReady: boolean;
  isPanelOpen: boolean;
  decide: (value: ConsentValue) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const value = useContext(ConsentContext);
  if (!value) throw new Error('useConsent must be used within ConsentProvider');
  return value;
}

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

/**
 * Mirrors a decision into Google's consent API. Falls back to a raw dataLayer
 * push when `gtag` is missing, which happens when an ad blocker has removed it
 * or the host gate skipped the container — the choice must still persist.
 */
function pushConsentUpdate(value: ConsentValue): void {
  const w = window as GtagWindow;
  if (typeof w.gtag === 'function') {
    w.gtag('consent', 'update', { analytics_storage: value });
    return;
  }
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(['consent', 'update', { analytics_storage: value }]);
}

export default function ConsentProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const [isRestricted, setIsRestricted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Resolved after mount: cookies, GPC and timezone are all client-only, and
  // reading them during render would desync hydration.
  useEffect(() => {
    let stored: ConsentValue | null = null;
    try {
      stored = readConsentCookie(document.cookie);
    } catch {
      stored = null;
    }

    const gpc = Boolean(
      (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl
    );

    if (stored) {
      setConsent(stored);
    } else if (gpc) {
      // The signal is the choice; honouring it is promised in the Cookie Policy.
      setConsent('denied');
    }

    setIsRestricted(isRestrictedZone(currentTimeZone()));
    setIsReady(true);
  }, []);

  const decide = useCallback((value: ConsentValue): void => {
    setConsent(value);
    setIsPanelOpen(false);
    try {
      document.cookie = serializeConsentCookie(value);
    } catch {
      // Storage blocked; the in-memory choice still suppresses the banner for
      // this page view and the default stays denied on the next one.
    }
    pushConsentUpdate(value);
  }, []);

  const openPreferences = useCallback((): void => setIsPanelOpen(true), []);
  const closePreferences = useCallback((): void => setIsPanelOpen(false), []);

  // Mirrors the bootstrap's own resolution: an explicit choice wins, otherwise
  // restricted regions are denied and everyone else is granted by default. This
  // must stay in step with `consent-bootstrap.ts` — if the two disagree, the
  // banner reports one thing while GA does another.
  const effectiveConsent: ConsentValue = consent ?? (isRestricted ? 'denied' : 'granted');

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      effectiveConsent,
      isRestricted,
      isReady,
      isPanelOpen,
      decide,
      openPreferences,
      closePreferences,
    }),
    [
      consent,
      effectiveConsent,
      isRestricted,
      isReady,
      isPanelOpen,
      decide,
      openPreferences,
      closePreferences,
    ]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}
