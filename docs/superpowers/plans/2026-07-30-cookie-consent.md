# Cookie Consent + Consent Mode v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a region-gated cookie consent banner with Google Consent Mode v2, loading the GTM container `GTM-MLWDW8VR` from `<head>` without letting any tag set a cookie before consent is resolved.

**Architecture:** One inline `beforeInteractive` script at the top of `<head>` initialises `dataLayer`, emits `gtag('consent','default',…)`, and self-injects the GTM loader only on the canonical host. A React context owns the visitor's choice and drives a bottom-left card that expands in place for preferences. GA4 is configured inside GTM, never in code.

**Tech Stack:** Next.js 16.2.1 (App Router), React 19.2.4, TypeScript strict, Tailwind v4, `next/script`.

**Spec:** `docs/superpowers/specs/2026-07-30-cookie-consent-design.md`

## Global Constraints

- GTM container ID: `GTM-MLWDW8VR`. GA4 ID `G-E5ZZ461R8T` must **never** appear in the codebase — it is configured in the GTM UI only.
- Consent cookie: name `oyechats_consent`, values `granted` | `denied`, max-age 180 days, `SameSite=Lax`, `Path=/`, `Secure`.
- Two categories only. `ad_storage`, `ad_user_data`, `ad_personalization` are permanently `denied`.
- Accept and Decline must render with identical visual weight (`variant="ghost"`). This is a legal requirement, not a style preference.
- GTM loads only when `location.hostname === 'www.oyechats.com'`. The banner renders on every host.
- Unknown/unparseable timezone fails safe to restricted.
- TypeScript strict: explicit return types, no `any`.
- No `<noscript>` GTM iframe.

## Testing note

This repo has **no test runner** — `package.json` defines lint, typecheck, build, and `verify:html`, and adding a runner is out of scope for this work. The test cycle for each task is therefore `npx tsc --noEmit` + `npm run lint`, plus explicit browser verification through the preview. `src/lib/consent.ts` is written as pure functions taking strings so a runner can be added later without refactoring.

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/consent.ts` (create) | Constants, region matching, cookie parse/serialise. Pure. |
| `src/lib/consent-bootstrap.ts` (create) | Builds the inline head script from `consent.ts` constants. |
| `src/components/site/Analytics.tsx` (rewrite) | Renders the head script + preconnect hints. |
| `src/components/site/ConsentProvider.tsx` (create) | Client context: state, persistence, `gtag` update. |
| `src/components/site/CookieConsent.tsx` (create) | The card UI. |
| `src/components/site/Footer.tsx` (modify) | "Cookie preferences" button in the bottom bar. |
| `src/app/layout.tsx` (modify) | Mount `Analytics` and `ConsentProvider`. |
| `src/lib/legal.ts` (modify) | Cookie Policy corrections. |
| `package.json` (modify) | Remove `@next/third-parties`. |

---

### Task 1: Consent core + head bootstrap

**Files:**
- Create: `src/lib/consent.ts`
- Create: `src/lib/consent-bootstrap.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `ConsentValue`, `CONSENT_COOKIE`, `CONSENT_MAX_AGE_SECONDS`, `GTM_CONTAINER_ID`, `ANALYTICS_HOST`, `GTM_ORIGIN`, `isRestrictedZone(tz: string | undefined): boolean`, `readConsentCookie(cookieString: string): ConsentValue | null`, `serializeConsentCookie(value: ConsentValue): string`, `currentTimeZone(): string | undefined`, `consentBootstrapScript(): string`.

- [ ] **Step 1: Create `src/lib/consent.ts`**

```ts
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
  const match = new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=(granted|denied)`).exec(
    cookieString
  );
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
```

- [ ] **Step 2: Create `src/lib/consent-bootstrap.ts`**

The whole ordered sequence lives in one script because ordering *within* a script is guaranteed, whereas the relative order of two `beforeInteractive` tags is not. Written in ES5 so it needs no transpilation, and wrapped in `try/catch` because it runs before everything else — a throw here would blank the page.

```ts
import {
  ANALYTICS_HOST,
  CONSENT_COOKIE,
  GTM_CONTAINER_ID,
  GTM_ORIGIN,
  RESTRICTED_ZONES,
} from './consent';

/**
 * The inline `<head>` script, in execution order:
 *
 *   1. initialise dataLayer and define gtag()
 *   2. resolve consent and emit gtag('consent','default', …)
 *   3. on the canonical host only, inject the GTM loader
 *
 * Step 2 must precede step 3: Google's Consent Mode documentation states that
 * defaults called out of order simply do not apply, which would let GTM set
 * `_ga` before the banner has rendered.
 *
 * Step 3 also reconciles host gating (needs `location`, client-side) with
 * `beforeInteractive` (renders server-side) by doing the check at runtime.
 */
export function consentBootstrapScript(): string {
  return `(function(w,d,host,name,zones,id,origin){try{
w.dataLayer=w.dataLayer||[];
function gtag(){w.dataLayer.push(arguments);}
w.gtag=w.gtag||gtag;
var m=new RegExp('(?:^|;\\\\s*)'+name+'=(granted|denied)').exec(d.cookie);
var a;
if(m){a=m[1]==='granted';}
else if(w.navigator&&w.navigator.globalPrivacyControl){a=false;}
else{var tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch(e){}
a=!(!tz||tz.indexOf('Europe/')===0||zones.indexOf(tz)>-1);}
gtag('consent','default',{analytics_storage:a?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
if(w.location.hostname===host){
w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var s=d.createElement('script');s.async=true;s.src=origin+'/gtm.js?id='+id;
var f=d.getElementsByTagName('script')[0];
if(f&&f.parentNode){f.parentNode.insertBefore(s,f);}else{d.head.appendChild(s);}
}}catch(e){}})(window,document,${JSON.stringify(ANALYTICS_HOST)},${JSON.stringify(
    CONSENT_COOKIE
  )},${JSON.stringify(RESTRICTED_ZONES)},${JSON.stringify(
    GTM_CONTAINER_ID
  )},${JSON.stringify(GTM_ORIGIN)});`;
}
```

- [ ] **Step 3: Verify types and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: both clean, no output from tsc.

- [ ] **Step 4: Sanity-check the generated script parses**

Run:
```bash
npx tsx -e "import('./src/lib/consent-bootstrap.ts').then(m=>{const s=m.consentBootstrapScript();new Function(s);console.log('parsed OK,',s.length,'bytes')})" 2>/dev/null || node --input-type=module -e "console.log('skip if tsx unavailable')"
```
Expected: `parsed OK, <n> bytes` where n is roughly 750–950. If `tsx` is unavailable, instead paste the built string into a browser console inside `new Function(...)` and confirm no SyntaxError.

- [ ] **Step 5: Commit**

```bash
git add src/lib/consent.ts src/lib/consent-bootstrap.ts
git commit -m "feat(consent): region matching, cookie helpers, head bootstrap"
```

---

### Task 2: Head placement + remove `@next/third-parties`

**Files:**
- Rewrite: `src/components/site/Analytics.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `package.json`

**Interfaces:**
- Consumes: `consentBootstrapScript()` from Task 1, `GTM_ORIGIN` from Task 1.
- Produces: default export `Analytics` (server component, no props).

- [ ] **Step 1: Remove the dependency**

It was installed while exploring. Its `GoogleTagManager` wraps `next/script` with no `strategy` prop, so it is permanently `afterInteractive` and cannot produce head placement.

```bash
npm uninstall @next/third-parties
```

- [ ] **Step 2: Rewrite `src/components/site/Analytics.tsx`**

```tsx
import Script from 'next/script';
import { GTM_ORIGIN } from '@/lib/consent';
import { consentBootstrapScript } from '@/lib/consent-bootstrap';

/**
 * Consent defaults and the GTM container, both in `<head>`.
 *
 * `beforeInteractive` puts this in the served HTML ahead of hydration, which is
 * what Google's "as high in the <head> as possible" guidance asks for. The
 * container snippet the bootstrap injects is `async`, so it never blocks the
 * parser.
 *
 * Ordering is the correctness property: the bootstrap resolves consent before
 * it injects GTM, so no tag can set a cookie ahead of the banner. Head
 * placement without that ordering is exactly how sites end up tracking EEA
 * visitors pre-consent.
 *
 * The preconnect pair warms DNS + TLS for the container origin, typically
 * 100-300ms that would otherwise be spent on a cold connection.
 */
export default function Analytics(): React.ReactElement {
  return (
    <>
      <link rel="preconnect" href={GTM_ORIGIN} crossOrigin="anonymous" />
      <link rel="dns-prefetch" href={GTM_ORIGIN} />
      <Script
        id="consent-bootstrap"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: consentBootstrapScript() }}
      />
    </>
  );
}
```

- [ ] **Step 3: Mount it in `src/app/layout.tsx`**

Add the import alongside the existing component imports:

```tsx
import Analytics from '@/components/site/Analytics';
```

Then render it as the first child of `<html>`, before `<body>`, so it is hoisted into `<head>` ahead of the body content:

```tsx
    <html
      lang="en"
      className={`${inter.variable} ${geist.variable} ${geistMono.variable} ${fraunces.variable}`}
    >
      <Analytics />
      <body>
```

- [ ] **Step 4: Verify types, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all clean. The build must not warn about `beforeInteractive` outside the root layout.

- [ ] **Step 5: Verify the script is in the served head**

Run: `npm run dev` (via the preview tooling, not a raw shell), then:

```bash
curl -s http://localhost:3000/ | python3 -c "
import re,sys
h=sys.stdin.read()
head=re.search(r'<head[^>]*>(.*?)</head>',h,re.S).group(1)
i=head.find('consent-bootstrap' if 'consent-bootstrap' in head else 'gtm.js')
print('bootstrap present:', 'gtag' in head and 'consent' in head)
print('preconnect present:', 'googletagmanager' in head and 'preconnect' in head)
print('position in head: %d of %d chars' % (i, len(head)))
"
```
Expected: `bootstrap present: True`, `preconnect present: True`, and a position comfortably inside the head.

On localhost the bootstrap runs but must **not** inject GTM. Confirm in the browser console:
```js
document.querySelectorAll('script[src*="googletagmanager"]').length  // expect 0
window.dataLayer                                                      // expect an array with the consent default
```

- [ ] **Step 6: Commit**

```bash
git add src/components/site/Analytics.tsx src/app/layout.tsx package.json package-lock.json
git commit -m "feat(analytics): load consent defaults and GTM from head

Drops @next/third-parties: GoogleTagManager hardcodes afterInteractive
and cannot do head placement."
```

---

### Task 3: Consent state provider

**Files:**
- Create: `src/components/site/ConsentProvider.tsx`

**Interfaces:**
- Consumes: `ConsentValue`, `readConsentCookie`, `serializeConsentCookie`, `currentTimeZone`, `isRestrictedZone` from Task 1.
- Produces: `ConsentProvider` (default export, props `{ children: React.ReactNode }`) and `useConsent(): ConsentContextValue` where

```ts
type ConsentContextValue = {
  consent: ConsentValue | null;   // null = undecided
  isRestricted: boolean;
  isReady: boolean;               // false until the mount effect resolves
  isPanelOpen: boolean;
  decide: (value: ConsentValue) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};
```

- [ ] **Step 1: Create `src/components/site/ConsentProvider.tsx`**

```tsx
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
  consent: ConsentValue | null;
  isRestricted: boolean;
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

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      isRestricted,
      isReady,
      isPanelOpen,
      decide,
      openPreferences,
      closePreferences,
    }),
    [consent, isRestricted, isReady, isPanelOpen, decide, openPreferences, closePreferences]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}
```

- [ ] **Step 2: Verify types and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/site/ConsentProvider.tsx
git commit -m "feat(consent): client context for consent state and preferences panel"
```

---

### Task 4: The consent card

**Files:**
- Create: `src/components/site/CookieConsent.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `useConsent()` from Task 3, `Button` from `@/components/ds`.
- Produces: default export `CookieConsent` (no props).

- [ ] **Step 1: Create `src/components/site/CookieConsent.tsx`**

Visible when the visitor is undecided **and** restricted, or whenever the panel is opened from the footer. Accept and Decline are both `variant="ghost"` — identical weight is a legal requirement, so do not "improve" this by making Accept `volt`.

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ds';
import { useConsent } from './ConsentProvider';

export default function CookieConsent(): React.ReactElement | null {
  const { consent, isRestricted, isReady, isPanelOpen, decide, closePreferences } =
    useConsent();
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
      className="fixed bottom-4 left-4 z-40 w-[calc(100vw-2rem)] max-w-[380px] rounded-[var(--r-4)] border border-line bg-canvas p-5 shadow-[var(--e-3)] outline-none motion-safe:animate-[consent-in_240ms_var(--ease-out)]"
    >
      <h2 id="cookie-consent-title" className="text-sm font-semibold text-ink">
        Cookies on oyechats.com
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
        We use analytics cookies to understand which pages help people evaluate
        OyeChats. Nothing here identifies you, and we run no advertising trackers.
      </p>

      {isPanelOpen && (
        <ul className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
          <li className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[13px] font-medium text-ink">Strictly necessary</div>
              <p className="text-[12px] text-muted">
                Session, security and this consent choice.
              </p>
            </div>
            <span className="shrink-0 rounded-[var(--r-full)] bg-paper px-2 py-1 text-[11px] text-muted">
              Always on
            </span>
          </li>
          <li className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[13px] font-medium text-ink">Analytics</div>
              <p className="text-[12px] text-muted">
                Google Analytics, via Tag Manager.
              </p>
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
```

- [ ] **Step 2: Add the entry animation to `src/app/globals.css`**

Append near the other keyframes. The global `prefers-reduced-motion` block already neutralises animation duration, and `motion-safe:` gates it a second time.

```css
@keyframes consent-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 3: Wrap the tree in `src/app/layout.tsx`**

Add imports:

```tsx
import ConsentProvider from '@/components/site/ConsentProvider';
import CookieConsent from '@/components/site/CookieConsent';
```

Wrap the existing body content. `CookieConsent` renders last so it sits above the footer in DOM order, and `z-40` keeps it under the chat widget:

```tsx
      <body>
        <ConsentProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Navbar />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd(siteSchema) }}
          />

          <WidgetLoader />
          <CookieConsent />
        </ConsentProvider>
      </body>
```

- [ ] **Step 4: Verify types, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 5: Verify in the browser**

With the dev server running, in the console:

```js
// Force the restricted path regardless of your real timezone:
document.cookie = 'oyechats_consent=; Path=/; Max-Age=0';
location.reload();
```

Confirm:
1. The card appears bottom-left only if your timezone is `Europe/*`. To test from a non-EEA machine, launch a browser profile with `TZ=Europe/Berlin` or temporarily set the OS timezone.
2. `Tab` reaches Accept and Decline; both have a visible focus ring.
3. `Esc` dismisses the card and `document.cookie` then contains `oyechats_consent=denied`.
4. Clicking Accept sets `oyechats_consent=granted` and the card disappears.
5. Reloading does not bring the card back.

- [ ] **Step 6: Commit**

```bash
git add src/components/site/CookieConsent.tsx src/app/layout.tsx src/app/globals.css
git commit -m "feat(consent): bottom-left consent card with in-place preferences"
```

---

### Task 5: Footer entry point + Cookie Policy corrections

**Files:**
- Modify: `src/components/site/Footer.tsx`
- Modify: `src/lib/legal.ts`

**Interfaces:**
- Consumes: `useConsent()` from Task 3.
- Produces: nothing consumed downstream.

- [ ] **Step 1: Add the preferences button to `src/components/site/Footer.tsx`**

The `FOOTER_COLUMNS` nav is a data-driven list of `Link`s, so a button does not belong there. Put it in the bottom bar beside the copyright instead. `Footer` must become a client component for this; add `'use client';` at the top of the file if it is not already there, and import:

```tsx
import { useConsent } from './ConsentProvider';
```

Inside the component body:

```tsx
  const { openPreferences } = useConsent();
```

Then in the bottom bar `div` (currently `className="mt-16 pt-6 border-t border-white/10 …"`), add:

```tsx
        <button
          type="button"
          onClick={openPreferences}
          className="text-[12px] text-ink-invert-muted underline underline-offset-2 hover:text-paper"
        >
          Cookie preferences
        </button>
```

- [ ] **Step 2: Correct the Cookie Policy in `src/lib/legal.ts`**

In the `cookies` page, `cookies-we-use` section, replace the body array. The current first line claims only strictly-necessary cookies and no tracking, both of which stop being true once GTM ships.

```ts
      { id: 'cookies-we-use', heading: 'Cookies on our marketing site and dashboard', body: [
        'We use a small number of strictly-necessary first-party cookies, plus one analytics category that runs only with your permission where consent is required. We do not run advertising cookies or cross-site advertising pixels on our own properties.',
        '- oyechats_session: Keeps you signed in to the customer dashboard between page loads and protects against session fixation. (Session, cleared on logout)',
        '- oyechats_csrf: Protects state-changing requests from cross-site request forgery attacks. (Session)',
        '- oyechats_consent: Remembers your cookie banner choice on the marketing site. (6 months)',
        'Analytics cookies, set by Google Analytics via Google Tag Manager on oyechats.com only:',
        '- _ga: Distinguishes one browser from another so we can count returning visitors. (2 years)',
        '- _ga_E5ZZ461R8T: Holds the session state for our Google Analytics property. (2 years)',
        'Visitors in the EEA, the UK and Switzerland are asked to consent before either analytics cookie is set, and neither is set if you decline. Elsewhere they are set by default and you can turn them off at any time from "Cookie preferences" in the footer. We also honour the Global Privacy Control signal as a decline.',
      ]},
```

- [ ] **Step 3: Bump `lastUpdated` on the Cookie Policy**

Change `lastUpdated: '2026-04-16',` on the `cookies` page to the actual ship date in `YYYY-MM-DD` form.

- [ ] **Step 4: Verify types, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 5: Verify the footer button works**

Load any page, scroll to the footer, click "Cookie preferences". The card must appear with the two category rows visible, regardless of region or prior choice.

- [ ] **Step 6: Commit**

```bash
git add src/components/site/Footer.tsx src/lib/legal.ts
git commit -m "feat(consent): footer preferences entry; document analytics cookies

The policy claimed strictly-necessary cookies only, which stops being
true once GTM ships."
```

---

### Task 6: Full verification + GTM container configuration

**Files:** none modified.

- [ ] **Step 1: Run the repo's own gate**

Run: `npm run verify`
Expected: lint, typecheck, build and `verify:html` all pass. Fix anything that fails before continuing.

- [ ] **Step 2: Confirm the GA4 ID is absent from source**

Run: `grep -rn "G-E5ZZ461R8T" src/ || echo "absent, as intended"`
Expected: `absent, as intended`. The measurement ID belongs in the GTM UI only; finding it in `src/` means GA4 is configured twice and every pageview will be double-counted.

- [ ] **Step 3: Configure the container (GTM UI, not code)**

The container serves nothing until published.

1. Tags → New → **Google Analytics: GA4 Configuration**, Measurement ID `G-E5ZZ461R8T`, trigger **Initialization – All Pages**.
2. That tag → Advanced Settings → **Consent Settings** → *Require additional consent* → `analytics_storage`. **Skipping this silently defeats the banner.**
3. Admin → Container Settings → enable **Consent Overview**.
4. Accept the **Data Processing Terms** in both Analytics (Admin → Account Settings) and Tag Manager, if not already done.
5. **Submit and publish.**

- [ ] **Step 4: Verify against production after deploy**

1. GTM **Preview** mode: the GA4 tag shows as blocked by consent before acceptance, firing after.
2. GA4 **DebugView**: a declined session produces no `page_view`; an accepted one does.
3. Application → Cookies on `www.oyechats.com`: no `_ga` until Accept is clicked.
4. Confirm the container script appears in `<head>` of the served HTML.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "chore(consent): verification fixes"
```

---

## Self-Review

**Spec coverage.** Load order → Task 2. Consent resolution and region definition → Task 1. Behaviour matrix → Tasks 1 and 3. Modules → Tasks 1–5. Visual treatment and accessibility → Task 4. Failure modes → `try/catch` in Tasks 1 and 3, ad-blocker fallback in Task 3. Legal copy → Task 5. Host gating → Task 1 constant, applied in Task 1's bootstrap. Manual GTM configuration and verification → Task 6. Prerequisite (Data Processing Terms) → Task 6 Step 3.5.

**Placeholders.** None. Every code step carries complete code; the only deliberately deferred value is the ship date in Task 5 Step 3, which cannot be known until the day of.

**Type consistency.** `ConsentValue`, `readConsentCookie`, `serializeConsentCookie`, `currentTimeZone`, `isRestrictedZone`, `GTM_ORIGIN` are defined in Task 1 and used with matching signatures in Tasks 2–4. `useConsent()`'s returned shape is declared once in Task 3 and every field consumed in Tasks 4 and 5 exists on it.

**Known gap.** There is no automated test for `isRestrictedZone` or `readConsentCookie` because the repo has no runner. Both are pure and take strings, so adding `vitest` later requires no refactor. Flagged rather than silently skipped.
