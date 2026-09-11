import { describe, expect, it } from 'vitest';
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_SECONDS,
  expiredHostOnlyConsentCookie,
  readConsentCookie,
  serializeConsentCookie,
} from './consent';

describe('serializeConsentCookie', () => {
  it('shares the choice with the dashboard on the production domain', () => {
    // app.oyechats.com runs the same GTM container and reads this same cookie,
    // but has no banner of its own. Host-only, a choice made here never
    // reached it.
    expect(serializeConsentCookie('granted', 'www.oyechats.com')).toContain('; Domain=oyechats.com');
    expect(serializeConsentCookie('denied', 'oyechats.com')).toContain('; Domain=oyechats.com');
  });

  it('stays host-only anywhere else', () => {
    expect(serializeConsentCookie('granted', 'localhost')).not.toContain('Domain=');
    expect(serializeConsentCookie('granted', 'oyechats-website.vercel.app')).not.toContain('Domain=');
  });

  it('is not fooled by a lookalike host', () => {
    expect(serializeConsentCookie('granted', 'notoyechats.com')).not.toContain('Domain=');
    expect(serializeConsentCookie('granted', 'oyechats.com.example.test')).not.toContain('Domain=');
  });

  it('keeps the six-month lifetime the Cookie Policy promises', () => {
    const cookie = serializeConsentCookie('denied', 'www.oyechats.com');

    expect(cookie.startsWith(`${CONSENT_COOKIE}=denied;`)).toBe(true);
    expect(cookie).toContain(`Max-Age=${CONSENT_MAX_AGE_SECONDS}`);
    expect(cookie).toContain('Path=/');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toContain('Secure');
  });
});

describe('expiredHostOnlyConsentCookie', () => {
  it('expires the earlier host-only cookie without naming a domain', () => {
    // Left in place, the older host-only copy is listed first in
    // `document.cookie` and would shadow the shared one on www.
    const cookie = expiredHostOnlyConsentCookie();

    expect(cookie.startsWith(`${CONSENT_COOKIE}=;`)).toBe(true);
    expect(cookie).toContain('Max-Age=0');
    expect(cookie).toContain('Path=/');
    expect(cookie).not.toContain('Domain=');
  });
});

describe('readConsentCookie', () => {
  it('reads a stored choice from among other cookies', () => {
    expect(readConsentCookie(`_ga=GA1.1.1; ${CONSENT_COOKIE}=granted; other=1`)).toBe('granted');
    expect(readConsentCookie('_ga=GA1.1.1')).toBeNull();
  });
});
