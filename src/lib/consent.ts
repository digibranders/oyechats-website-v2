/**
 * Cookie consent primitives, shared by the inline head bootstrap and the React
 * UI. Every function here is pure and takes plain strings so the logic can be
 * exercised without a DOM.
 */

export type ConsentValue = 'granted' | 'denied';

/** Documented in the Cookie Policy; changing either breaks that promise. */
export const CONSENT_COOKIE = 'oyechats_consent';
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export const GTM_CONTAINER_ID = 'GTM-MLWDW8VR';
export const GTM_ORIGIN = 'https://www.googletagmanager.com';

/**
 * The container loads only here. Keeps local dev, local production builds and
 * every *.vercel.app preview out of the analytics property. The banner itself
 * renders everywhere so its behaviour stays testable off-production.
 */
export const ANALYTICS_HOST = 'www.oyechats.com';

/**
 * EEA/UK/CH zones that do not carry the `Europe/` prefix. The prefix check
 * covers the rest.
 */
export const RESTRICTED_ZONES: readonly string[] = [
  'Atlantic/Reykjavik',
  'Atlantic/Canary',
  'Atlantic/Madeira',
  'Atlantic/Azores',
  'Atlantic/Faroe',
  'Indian/Reunion',
  'Indian/Mayotte',
  'America/Cayenne',
];

/**
 * Blanket-matching `Europe/` over-includes non-EEA countries (Russia, Türkiye,
 * Ukraine, Serbia). That is deliberate: showing a banner to someone who did not
 * legally need one is harmless, the reverse is not, and an exact
 * country-to-timezone table would drift as zones are renamed.
 *
 * An absent or unparseable zone is treated as restricted.
 */
export function isRestrictedZone(tz: string | undefined): boolean {
  if (!tz) return true;
  return tz.startsWith('Europe/') || RESTRICTED_ZONES.includes(tz);
}

/** Reads the stored choice out of a `document.cookie` string. */
export function readConsentCookie(cookieString: string): ConsentValue | null {
  const match = new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=(granted|denied)`).exec(cookieString);
  if (!match) return null;
  return match[1] === 'granted' ? 'granted' : 'denied';
}

export function serializeConsentCookie(value: ConsentValue): string {
  return `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax; Secure`;
}

/** Resolved IANA zone, or undefined where Intl is unavailable or throws. */
export function currentTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}
