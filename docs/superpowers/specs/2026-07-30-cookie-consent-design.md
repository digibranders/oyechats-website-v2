# Cookie Consent + Google Consent Mode v2

**Date:** 2026-07-30
**Status:** Approved, ready for implementation plan
**Scope:** `www.oyechats.com` marketing site only. The dashboard at `app.oyechats.com` and the embeddable widget are separate properties and out of scope.

## Problem

The site has no analytics. Adding Google Tag Manager introduces non-essential cookies,
which creates three obligations at once:

1. EEA/UK/Swiss visitors must give informed opt-in consent *before* any analytics
   cookie is set.
2. The Cookie Policy in `src/lib/legal.ts` currently states we use "a small number
   of strictly-necessary first-party cookies" and run no "cross-site tracking
   pixels". Both sentences become false the moment GA4 fires.
3. The same policy already promises a consent banner and an `oyechats_consent`
   cookie that do not exist yet.

## Identifiers

| Thing | Value | Lives in |
|---|---|---|
| GTM container | `GTM-MLWDW8VR` | Code (`Analytics.tsx`) |
| GA4 measurement ID | `G-E5ZZ461R8T` | **GTM UI only, not in code** |
| Consent cookie | `oyechats_consent` | Browser, 6 months, `SameSite=Lax` |

GA4's measurement ID is deliberately absent from the repo: GTM is the single tag
host, so configuring GA4 in both places would double-count every pageview.
It is recorded here because grepping the codebase will no longer reveal it.

## Decisions

| Decision | Choice | Reasoning |
|---|---|---|
| Consent scope | Region-gated | Strict opt-in for EEA/UK/CH; analytics granted by default elsewhere. Matches what the Cookie Policy already promises and preserves data volume in India and the US. |
| Categories | Necessary + Analytics | We run no ad tags, so the three ad-consent signals are hard-denied permanently. Asking consent for marketing we don't do would be dishonest. |
| Banner form | Bottom-left corner card | Non-blocking; leaves the hero and `HeroDemo` unobstructed. |
| Region detection | Browser timezone | Zero latency, zero network cost, no middleware, pages stay fully static. Comparable accuracy to geo-IP in practice. |
| Tag architecture | GTM owns GA4 | One tag host. Future pixels need no code deploy. |

## Load order

Order is the core correctness property of this design.

| # | What | Where | Strategy | Size |
|---|---|---|---|---|
| 1 | Consent bootstrap | top of `<head>`, inline | blocking | ~700 B |
| 2 | `preconnect` + `dns-prefetch` | `<head>` | — | — |
| 3 | Metadata: charset, viewport, title, canonical, OG, JSON-LD | `<head>` | — | — |
| 4 | GTM container | end of `<head>` | `beforeInteractive` | ~40 KB |
| 5 | GA4 tag | inside GTM | consent-gated | — |
| 6 | Banner UI | React tree | hydration | — |

Step 1 is inline and synchronous, so it cannot be raced. It runs before GTM
exists, which means no tag in the container can set a cookie ahead of a consent
decision. **Step 1 is what makes step 4 safe**: head-loading GTM without the
bootstrap ahead of it is how sites set `_ga` on EEA visitors before the banner
has rendered.

The `preconnect` and `dns-prefetch` hints to `www.googletagmanager.com` start
DNS resolution and the TLS handshake early and in parallel, typically 100-300 ms
that the container would otherwise spend on a cold connection.

GTM loads in `<head>` rather than after hydration. The container snippet is
`async`, so it does not block the parser; the cost is bandwidth contention
during hydration, which is modest and bounded. Metadata still parses first, so
crawlers reach the canonical, OG, and JSON-LD blocks before any third-party
JavaScript. See "Placement research" below for the evidence behind this.

The GTM `<noscript>` iframe is intentionally omitted. It reaches only
JS-disabled visitors, who cannot be meaningfully measured anyway, and it has no
mechanism to check consent state — it would place an ungated tracking iframe in
front of precisely the EEA visitors this system exists to protect.

## Placement research

Investigated 2026-07-30 after the question was raised of whether the tag must be
the first thing in `<head>`.

**Google's official wording** is "paste it as high in the `<head>` tag as
possible" — not "first". The qualifier is deliberate.

**Consent ordering is mandatory**, and is the one hard constraint here: "The
order of the code here is vital. If your consent code is called out of order,
consent defaults won't work."

**Next.js** defaults `GoogleTagManager` to loading after hydration, and
separately recommends configuring GA4 inside GTM rather than as a second
component — independent confirmation of the tag architecture chosen above.

**Reference implementation.** `theseocentral.com`, cited as a well-built
technical-SEO site, places its GTM snippet 1,955 characters into a 2,961
character `<head>` — 66% of the way through, after charset, viewport,
stylesheet, title, meta description, canonical, robots, six OG/Twitter tags, two
JSON-LD blocks, and the RSS link. Its actual pattern is metadata first, tags
last in head. It also runs GTM and a direct `gtag.js` config simultaneously, and
contains no consent or cookie handling at all, so it is not a reference for the
consent portion of this work.

**The realtime claim is unfounded.** GA4's Realtime report covers the last 30
minutes; tag position cannot move a visitor in or out of that window. The
legitimate adjacent concern is capturing visitors who bounce before the script
executes, which head placement does help.

Sources:
- <https://support.google.com/tagmanager/answer/14847097>
- <https://developers.google.com/tag-platform/security/guides/consent>
- <https://nextjs.org/docs/app/guides/third-party-libraries>

## Consent resolution

Evaluated synchronously in the head bootstrap:

```
stored cookie present?  -> use it
GPC signal present?     -> denied (the signal is the choice)
restricted region?      -> denied, show banner
otherwise               -> granted
```

Emitted as:

```js
gtag('consent', 'default', {
  analytics_storage: <granted|denied>,
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500,
});
```

`wait_for_update: 500` holds pings briefly so an immediate Accept is not lost.
Ad signals are hard-denied and never change.

### Behaviour matrix

| Visitor | Default | Banner shown |
|---|---|---|
| EEA/UK/CH, no prior choice | denied | Yes |
| GPC present, any region | denied | No |
| Rest of world, no prior choice | granted | No (footer link only) |
| Returning visitor, any region | stored value | No |

An unknown or unparseable timezone fails safe to the restricted path.
Honouring GPC is not optional here: the Cookie Policy already commits to it
under CCPA/CPRA.

### Defining "restricted region"

Every `Europe/*` timezone is treated as restricted, plus the EEA outermost and
associated zones that fall outside that prefix: `Atlantic/Reykjavik`,
`Atlantic/Canary`, `Atlantic/Madeira`, `Atlantic/Azores`, `Atlantic/Faroe`,
`Indian/Reunion`, `Indian/Mayotte`, and `America/Cayenne`.

Blanket-matching `Europe/*` over-includes non-EEA countries such as Russia,
Türkiye, Ukraine, and Serbia. This over-inclusion is deliberate: it costs a
small amount of analytics data from markets that are not core to OyeChats, and
in exchange avoids maintaining an exact country-to-timezone table that would
drift as zones are added or renamed. Showing a consent banner to someone who
did not legally require one is harmless; the reverse is not.

## Modules

- **`src/lib/consent.ts`** — restricted-region timezone set, cookie read/write,
  and pure resolution logic. No React; no DOM access beyond `document.cookie`.
  Written pure so it is unit-testable if a runner is added later.
- **`src/lib/consent-bootstrap.ts`** — builds the inline head script as a string
  from the same timezone constant `consent.ts` uses. The head script cannot
  import from the bundle, so without a shared constant the region list would be
  duplicated and would silently drift.
- **`src/components/site/ConsentProvider.tsx`** — client context holding consent
  state and exposing `openPreferences()` for the footer link.
- **`src/components/site/CookieConsent.tsx`** — the corner card. Preferences
  expand the card in place rather than opening a modal, avoiding a layer stacked
  over an already-floating surface.
- **`src/components/site/Analytics.tsx`** — renders a single `next/script`
  with `strategy="beforeInteractive"` plus the `preconnect` hints.

### Why not `@next/third-parties`

The package was installed during exploration and is **removed** by this work.
Its `GoogleTagManager` component wraps `next/script` with no `strategy` prop, so
it is permanently `afterInteractive` and cannot produce head placement. Its only
other contribution, `sendGTMEvent`, is a one-line `dataLayer.push`. Keeping a
dependency that cannot do the thing it was added for would be dead weight in a
repo with an otherwise minimal dependency list.

### The bootstrap is a single script

Everything that must be ordered lives in **one** inline script, because ordering
within a script is guaranteed by definition, whereas the relative order of two
separate `beforeInteractive` tags is not something to stake correctness on:

1. initialise `dataLayer` and define `gtag()`
2. resolve consent and emit `gtag('consent', 'default', …)`
3. check `location.hostname`, and only then inject the `gtm.js` loader

Step 3 also resolves what would otherwise be a contradiction: host gating needs
`location.hostname`, which is client-side, while `beforeInteractive` renders on
the server. Self-gating inside the script satisfies both — and the stock GTM
snippet already works by injecting its own `<script>` tag, so this is the
snippet's native shape rather than a workaround.
- **`src/components/site/Footer.tsx`** — adds "Cookie preferences" to the Legal
  column.
- **`src/lib/legal.ts`** — Cookie Policy corrections (see below).

## Visual treatment

Bottom-left, `max-w-[380px]`, `--canvas` surface, `--e-3` elevation, `1px --line`
border, `--r-4` radius. Rises 12px over 240ms with `--ease-out`;
`prefers-reduced-motion` reduces this to a fade.

Accept and Decline are **both** `variant="ghost"` — identical visual weight.
GDPR enforcement treats a prominent Accept beside a faint Decline as invalid
consent, so this is a correctness requirement, not a stylistic one. The violet
accent is spent on the mark and the focus ring, never on steering the choice.

Expanded state shows two rows: "Strictly necessary — Always on" (disabled) and
"Analytics" (switch).

### Accessibility

`role="dialog"` with `aria-modal="false"`, labelled by its heading. Focus moves
to the card on mount and returns to `document.body` on dismiss. `Esc` dismisses
as decline. Renders below the chat widget's z-index so the two never fight.

## Failure modes

| Failure | Behaviour |
|---|---|
| `document.cookie` blocked or throws | Treated as no consent; banner shows; nothing breaks |
| Bootstrap throws | `try/catch` falls back to all-denied — fails closed |
| GTM blocked by an ad blocker | `gtag` calls no-op against the stub `dataLayer`; banner still records the choice |

The bootstrap runs before everything else, so a bug in it could blank the page.
It is wrapped in `try/catch` for that reason.

## Legal copy changes (`src/lib/legal.ts`)

In the Cookie Policy, `cookies-we-use` section:

- Replace "We use a small number of strictly-necessary first-party cookies" —
  it is no longer true.
- Remove or qualify "We do not run advertising cookies or cross-site tracking
  pixels on our own properties." GA4 is analytics, not advertising, so a
  narrowed claim is still accurate and worth keeping.
- Add an Analytics category documenting `_ga` (2 years) and
  `_ga_E5ZZ461R8T` (2 years), stating they are set only after consent in the
  EEA/UK/CH.
- Bump `lastUpdated` from `2026-04-16` to the ship date.

## Manual GTM configuration

Outside the repo; performed once in the GTM UI. **The container serves nothing
until it is published.**

1. Tags → New → Google Analytics: GA4 Configuration, Measurement ID
   `G-E5ZZ461R8T`, trigger *Initialization – All Pages*.
2. That tag → Advanced Settings → Consent Settings → *Require additional
   consent* → `analytics_storage`. **Skipping this silently defeats the banner.**
3. Admin → Container Settings → enable Consent Overview.
4. Submit and publish.

## Verification

No test runner exists in this repo, so there is no unit suite for this work.

- `npm run verify` (lint → typecheck → build → verify-html) must pass.
- GA4 **DebugView**: a declined session sends no `page_view`; an accepted one does.
- Application → Cookies: `_ga` is absent until Accept is clicked.
- GTM Preview mode: the GA4 tag shows as blocked by consent before acceptance.

## Host gating

The two concerns are gated separately, at different boundaries:

- **The GTM container** loads only on `www.oyechats.com`. This keeps local
  development, local production builds, and every `*.vercel.app` preview out of
  the analytics property.
- **The consent banner** renders on *every* host.

Splitting them resolves what would otherwise be a testing dead end. The banner
is pure UI — region logic, expand/collapse, focus handling, cookie persistence
— and all of it can be exercised fully on localhost and on preview deployments
without sending a single hit anywhere. Only tag firing needs the real host, and
that is verified in production via GA4 DebugView and GTM Preview mode.

## Prerequisite

Google's Data Processing Terms must be accepted on both the Analytics account
and the GTM account before EEA traffic is sent. This is the Article 28 processor
agreement; the consent banner does not substitute for it. Accepting it is a
one-time action in each product's Admin → Account Settings and can be done at
any point before launch.
