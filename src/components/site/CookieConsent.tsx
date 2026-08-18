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
 * Rendered on the inverted (dark) surface. A paper-on-paper card was almost
 * invisible against `--paper`: `--canvas` is #FFFFFF and `--line` is #E7E5DE,
 * roughly a 1.03:1 surface difference, so the card read as a faint smudge. The
 * dark treatment is not decoration, a consent notice nobody notices is not a
 * consent notice. It also matches the footer, which is the design system's
 * other inverted surface.
 *
 * Accept and Decline are deliberately the same `outline-invert` variant. Equal
 * visual weight is a GDPR requirement, a prominent Accept beside a faint
 * Decline is treated as invalid consent, so this is correctness, not styling.
 */
export default function CookieConsent(): React.ReactElement | null {
  const {
    consent,
    effectiveConsent,
    isRestricted,
    isReady,
    isPanelOpen,
    decide,
    openPreferences,
    closePreferences,
  } = useConsent();
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
      className="consent-card fixed bottom-4 left-4 z-40 w-[calc(100vw-2rem)] max-w-[400px] overflow-hidden rounded-[var(--r-4)] border border-white/12 bg-ink-invert text-ink-invert-fg shadow-[0_24px_60px_-12px_rgba(11,16,32,0.45)] outline-none"
    >
      {/* Accent edge: the one piece of volt on the card, used to catch the eye
          rather than to steer the choice between Accept and Decline. */}
      <div aria-hidden className="h-[3px] w-full bg-volt" />

      <div className="p-5">
        <h2 id="cookie-consent-title" className="text-sm font-semibold text-ink-invert-fg">
          Cookies on oyechats.com
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-invert-muted">
          We use analytics cookies to understand which pages help people evaluate OyeChats. Nothing
          here identifies you, and we run no advertising trackers.
        </p>

        {isPanelOpen && (
          <ul className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
            <li className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[13px] font-medium text-ink-invert-fg">Strictly necessary</div>
                <p className="text-[12px] text-ink-invert-muted">
                  Session, security and this consent choice.
                </p>
              </div>
              <span className="shrink-0 rounded-[var(--r-full)] bg-white/10 px-2 py-1 text-[11px] text-ink-invert-muted">
                Always on
              </span>
            </li>
            <li className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[13px] font-medium text-ink-invert-fg">Analytics</div>
                <p className="text-[12px] text-ink-invert-muted">
                  Google Analytics, via Tag Manager.
                </p>
              </div>
              <span
                className={`shrink-0 rounded-[var(--r-full)] px-2 py-1 text-[11px] ${
                  effectiveConsent === 'granted'
                    ? 'bg-volt/25 text-volt-light'
                    : 'bg-white/10 text-ink-invert-muted'
                }`}
              >
                {effectiveConsent === 'granted' ? 'On' : 'Off'}
              </span>
            </li>
          </ul>
        )}

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline-invert"
            size="sm"
            className="flex-1"
            onClick={() => decide('granted')}
          >
            Accept
          </Button>
          <Button
            variant="outline-invert"
            size="sm"
            className="flex-1"
            onClick={() => decide('denied')}
          >
            Decline
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
          {/* Granular consent has to be reachable from the first-visit banner,
              not only from the footer. Otherwise the only options on offer are
              all-or-nothing. */}
          {!isPanelOpen && (
            <button
              type="button"
              onClick={openPreferences}
              className="text-ink-invert-fg underline underline-offset-2 hover:text-volt-light"
            >
              Manage preferences
            </button>
          )}
          <a
            href="/legal/cookies"
            className="text-ink-invert-muted underline underline-offset-2 hover:text-volt-light"
          >
            Cookie Policy
          </a>
        </div>
      </div>
    </div>
  );
}
