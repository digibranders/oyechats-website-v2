'use client';

import { useConsent } from './ConsentProvider';

/**
 * Re-opens the consent card from the footer.
 *
 * Split out of `Footer` so the footer itself stays a server component — it
 * pulls in the changelog and the full link graph, none of which belongs in the
 * client bundle just to attach one click handler.
 *
 * Lives in the bottom bar rather than the Legal column because that column is
 * rendered from `FOOTER_COLUMNS`, a data-driven list of `Link`s, and a button
 * is not a link.
 */
export default function CookiePreferencesButton(): React.ReactElement {
  const { openPreferences } = useConsent();

  return (
    <button
      type="button"
      onClick={openPreferences}
      className="text-[12px] text-ink-invert-muted underline underline-offset-2 hover:text-paper"
    >
      Cookie preferences
    </button>
  );
}
