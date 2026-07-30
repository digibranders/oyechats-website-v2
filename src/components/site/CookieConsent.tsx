'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ds';
import { useConsent } from './ConsentProvider';

/**
 * The consent card.
 *
 * Shown when a restricted-region visitor has not decided, or whenever the
 * footer opens the preferences panel. Preferences expand the card in place
 * rather than opening a modal, so nothing is ever layered over an
 * already-floating surface.
 *
 * Accept and Decline are deliberately the same `ghost` variant. Equal visual
 * weight is a GDPR requirement — a prominent Accept beside a faint Decline is
 * treated as invalid consent — so this is correctness, not styling.
 */
export default function CookieConsent(): React.ReactElement | null {
  const { consent, isRestricted, isReady, isPanelOpen, decide, closePreferences } = useConsent();
  const cardRef = useRef<HTMLDivElement>(null);

  const needsDecision = isReady && consent === null && isRestricted;
  const isVisible = needsDecision || isPanelOpen;

  useEffect(() => {
    if (!isVisible) return;
    cardRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      if (isPanelOpen) closePreferences();
      else decide('denied');
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isVisible, isPanelOpen, closePreferences, decide]);

  if (!isVisible) return null;

  return (
    <div
      ref={cardRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      tabIndex={-1}
      className="consent-card fixed bottom-4 left-4 z-40 w-[calc(100vw-2rem)] max-w-[380px] rounded-[var(--r-4)] border border-line bg-canvas p-5 shadow-[var(--e-3)] outline-none"
    >
      <h2 id="cookie-consent-title" className="text-sm font-semibold text-ink">
        Cookies on oyechats.com
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
        We use analytics cookies to understand which pages help people evaluate OyeChats. Nothing
        here identifies you, and we run no advertising trackers.
      </p>

      {isPanelOpen && (
        <ul className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
          <li className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[13px] font-medium text-ink">Strictly necessary</div>
              <p className="text-[12px] text-muted">Session, security and this consent choice.</p>
            </div>
            <span className="shrink-0 rounded-[var(--r-full)] bg-paper px-2 py-1 text-[11px] text-muted">
              Always on
            </span>
          </li>
          <li className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[13px] font-medium text-ink">Analytics</div>
              <p className="text-[12px] text-muted">Google Analytics, via Tag Manager.</p>
            </div>
            <span className="shrink-0 rounded-[var(--r-full)] bg-paper px-2 py-1 text-[11px] text-muted">
              {consent === 'granted' ? 'On' : 'Off'}
            </span>
          </li>
        </ul>
      )}

      <div className="mt-4 flex gap-2">
        <Button variant="ghost" size="sm" className="flex-1" onClick={() => decide('granted')}>
          Accept
        </Button>
        <Button variant="ghost" size="sm" className="flex-1" onClick={() => decide('denied')}>
          Decline
        </Button>
      </div>

      <p className="mt-3 text-[12px] text-muted">
        See our{' '}
        <a href="/legal/cookies" className="text-volt underline underline-offset-2">
          Cookie Policy
        </a>
        .
      </p>
    </div>
  );
}
