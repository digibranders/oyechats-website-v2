'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { API_URL, APP_ORIGIN } from '@/lib/site';

/**
 * Carries `?ref=` and `?code=` from a shared link through to signup.
 *
 * Affiliates were handed `https://www.oyechats.com/?ref=CODE` by the console
 * and nothing on this site had ever been taught to catch it: no middleware, no
 * query capture, and a "Get started" button pointing at a bare
 * `app.oyechats.com/register`. The visitor arrived at signup with no code, the
 * account was created unattributed, and the partner earned nothing. The console
 * page that generates those links even warns about this exact failure, which is
 * that the link is right and the landing site drops it.
 *
 * Progressive enhancement, deliberately. Every page here is a server component
 * and the CTAs are plain anchors, which is what keeps this site fast and
 * indexable; rewriting thirty-three of them into client components to thread a
 * query parameter would trade that away. So the links render exactly as before
 * and this decorates them once React is running. With JavaScript off the button
 * still works, unattributed, which is what happens today anyway.
 *
 * The code is stored in a cookie rather than `sessionStorage` because
 * attribution has to survive the visitor reading the blog for a week and coming
 * back, and because first-touch means the FIRST code seen is the one that
 * counts.
 */

/** How long a click keeps its claim. Matches the usual affiliate window. */
const ATTRIBUTION_DAYS = 30;

const REF_COOKIE = 'oyechats_ref';
const CODE_COOKIE = 'oyechats_code';
/** Set once a click has been reported, so a reload is not a second click. */
const CLICK_REPORTED_COOKIE = 'oyechats_ref_click';

/** A code as it may appear in a URL. Anything else is not ours to forward. */
const CODE_PATTERN = /^[A-Za-z0-9._-]{1,64}$/;

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 86_400_000).toUTCString();
  // Lax, not None: the value is only ever read on our own origin, and the
  // signup hop is a top-level navigation, which Lax allows.
  document.cookie =
    `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax` +
    (location.protocol === 'https:' ? '; Secure' : '');
}

/** First-touch: an existing claim is never overwritten by a later link. */
function captureFirstTouch(name: string, incoming: string | null): string | null {
  const existing = readCookie(name);
  if (existing) return existing;
  if (!incoming || !CODE_PATTERN.test(incoming)) return null;
  writeCookie(name, incoming, ATTRIBUTION_DAYS);
  return incoming;
}

/**
 * Tell the platform a referral link was opened.
 *
 * `POST /affiliates/click` existed and had never been called from anywhere, so
 * every affiliate dashboard reported zero clicks no matter how well a link did.
 * Fire-and-forget: a partner's analytics must never be able to break a page.
 */
function reportClick(code: string): void {
  if (readCookie(CLICK_REPORTED_COOKIE) === code) return;
  writeCookie(CLICK_REPORTED_COOKIE, code, 1);
  // `/affiliates/click`, plural. Verified against the running API: the
  // singular spelling 404s.
  void fetch(`${API_URL}/affiliates/click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      // The endpoint takes the referrer from the body and the IP and
      // user-agent from the request headers, so those cannot be spoofed.
      ...(document.referrer.startsWith('http') ? { referrer: document.referrer } : {}),
    }),
    keepalive: true,
  }).catch(() => {
    /* An unreachable API must not cost the visitor anything. */
  });
}

/** Append the stored codes to every anchor that leaves for the app. */
function decorateAppLinks(ref: string | null, code: string | null): void {
  if (!ref && !code) return;
  for (const anchor of Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))) {
    const raw = anchor.getAttribute('href');
    if (!raw || !raw.startsWith(APP_ORIGIN)) continue;
    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      continue;
    }
    // Never overwrite a parameter the page set on purpose, such as the
    // `?plan=starter` the pricing CTAs carry.
    if (ref && !url.searchParams.has('ref')) url.searchParams.set('ref', ref);
    if (code && !url.searchParams.has('code')) url.searchParams.set('code', code);
    anchor.setAttribute('href', url.toString());
  }
}

export default function AttributionCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = captureFirstTouch(REF_COOKIE, searchParams.get('ref'));
    const code = captureFirstTouch(CODE_COOKIE, searchParams.get('code'));
    if (ref) reportClick(ref);
    // Re-run per navigation: the App Router swaps the tree client-side, so
    // links on a page reached without a reload would otherwise stay bare.
    decorateAppLinks(ref, code);
  }, [pathname, searchParams]);

  return null;
}
