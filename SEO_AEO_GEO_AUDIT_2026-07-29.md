# Enterprise SEO / AEO / GEO Audit — OyeChats Marketing Site

**Date:** 2026-07-29
**Repository:** `oyechats-website` · branch `development` @ `3f455a5`
**Stack:** Next.js 16.2.1 · React 19.2.4 · App Router · Tailwind CSS v4 · TypeScript strict · Vercel
**Canonical host:** `https://www.oyechats.com`
**Method:** Repository discovery, then four parallel specialist audits (performance/React, accessibility/semantic HTML, structured data/AEO/GEO, information architecture/internal linking), consolidated and independently re-verified against compiled build artifacts.

**Constraint honoured:** No visible page content was changed, and no rewritten copy appears anywhere in this document. Content opportunities are confined to §17.

---

## 0. Evidence standard

Findings are graded by how they were established:

| Grade | Meaning |
|---|---|
| **Verified** | Confirmed against the compiled HTML in `.next/server/app/*.html`, the client chunks in `.next/static/`, or the build manifests. This is what actually ships. |
| **Source-verified** | Confirmed by reading the cited file and line. Behaviour inferred from code, not observed in output. |
| **Requires external evidence** | Cannot be settled from the repository. The specific artifact needed is named. |

Three specialist claims were **corrected** after checking them against build output; each correction is flagged inline and summarised in Appendix B. Nothing here rests on an unverified assertion.

**Route counting convention.** 27 indexable HTML routes (12 top-level + 8 blog posts + 7 legal children). The compiled output contains 29 HTML files — those 27 plus `_not-found` and `_global-error`.

**Build limitation.** `npm run build` was attempted twice in this session and hung both times at ~10 minutes with no compiler output and 0% CPU. Per-route First Load JS figures are therefore unavailable. All build-derived evidence comes from the pre-existing `.next/` artifacts (BUILD_ID stamped 2026-07-23 18:08, built from HEAD `3f455a5`). **Re-run the build in a normal local environment to capture the route table.** The hang is likely environmental — `next/font/google` fetches at build time — not a repo defect, since the committed artifacts prove it builds cleanly.

---

## 1. Executive Summary

### Overall assessment

This is a **well-engineered codebase with a systematically broken metadata layer**. The gap between the two is unusually wide, and it is the most important thing to understand about this audit.

The engineering is genuinely above average. All 27 routes are statically prerendered. There is not a single raw `<img>` tag. The deferred chat-widget loader is better than what `next/script` would provide. `FadeUp` is SSR-safe and bfcache-safe, avoiding the scroll-reveal LCP failure most marketing sites ship. The FAQ accordion keeps every answer in the DOM rather than conditionally rendering — exactly right, and the reason the FAQ structured data does not create a content mismatch. Reduced motion is respected globally *and* independently in five components. The legal suite is thorough. Blog metadata (titles 57–90 chars, descriptions 114–165) is exemplary.

Against that, several defects in the metadata and rendering layer are costing traffic today, and they share one root cause: **nobody has checked what the compiled HTML actually contains.** Every one of the three most severe findings passed lint, typecheck, and build.

### Top findings

1. **18 of 27 indexable routes ship no `og:image` and no `twitter:image`** — every page routed through `pageMeta()`. A code comment asserts the opposite of what ships. *(Verified.)*
2. **`/pricing` serves `$0` for all three paid tiers in its static HTML** while the same page's `Offer` markup declares $9/$19/$39. *(Verified.)*
3. **All INR pricing is absent from served HTML.** `grep -c "₹449"` on the built page returns 0. *(Verified.)*
4. **`public/llms.txt` advertises an Enterprise plan deleted from the product**, in the one file AI answer engines read first and trust most. *(Verified.)*
5. **`/legal` is a true orphan** — zero inbound links across all 29 compiled pages; present only in the sitemap. *(Verified.)*
6. **The contact form's topic dropdown is completely keyboard-inoperable.** *(Source-verified.)*
7. **Money-page titles run 15–24 characters** against a ~60-character budget. `/pricing` ships `Pricing · OyeChats`. *(Verified.)*
8. **`/features` and `/solutions` contain zero `<h3>` elements**, collapsing the densest product pages into 7 and 5 unchunkable passages for AI retrieval. *(Verified.)*

### Top risks

- **Structured-data policy risk.** Visible `$0` alongside `Offer` markup declaring `$9` is precisely the mismatch Google's rich-result policy targets. The only finding here with manual-action exposure.
- **AI-answer poisoning.** `llms.txt` is fetched first and trusted. It currently tells ChatGPT, Claude, and Perplexity that a plan exists which does not, with fabricated pricing. Every AI-sourced Enterprise inquiry is a wasted sales conversation, and the verifiable contradiction against `/pricing` degrades the trust score assigned to the domain.
- **Accessibility exposure.** Two WCAG Level A keyboard failures on a commercial site.
- **Unverified apex/www duplication.** The repo asserts `www` canonicality in 14 places while the transactional email template emits apex URLs. Nothing forces the redirect. Needs a `curl` check before anything else.

### Top wins

Ranked by impact ÷ effort. The first six are hours, not days.

| Win | Effort | Impact |
|---|---|---|
| Add `images` to `pageMeta()` — fixes og:image on 18 routes | ~5 lines | High |
| Remove `NumberTicker` from the price | ~3 lines | Critical |
| Correct `llms.txt`, then generate it from `PRICING_TIERS` | ~30 min | Critical |
| Populate `sameAs` from URLs already in `Footer.tsx` | 1 line | High |
| Add `/legal` to the footer Legal column | 1 line | High |
| `text-volt-fg` → `text-white` on the currency pills | 2 lines | Medium |
| Lengthen 12 money-page titles at the `pageMeta()` call sites | ~30 min | High |

### What is genuinely good — do not "optimise" these

Listed because a refactor could easily destroy them:

- The **Accordion's CSS-collapse** (`grid-rows-[0fr]`, never unmounts). Switching to `{isOpen && <Answer/>}` would silently destroy both the AEO value and FAQ eligibility.
- **`WidgetLoader`'s intent-gated injection.** Do not "simplify" to `next/script strategy="lazyOnload"` — that is strictly worse.
- **`FadeUp`'s `skipAnimation = true` initial state**, which is what prevents `opacity: 0` in server HTML.
- **The `next/font` weight arrays** — they resolve to variable fonts; only 3 files preload.
- **Default filter state** on `/integrations` and `/blog`, which is why all items render server-side.

---

## 2. Repository Architecture Summary

### Routing and rendering

27 indexable routes, all statically prerendered. Confirmed against `.next/prerender-manifest.json` and `.next/app-path-routes-manifest.json`.

```
/                              src/app/page.tsx              static, server
/about /features /solutions /security /changelog /legal      static, server
/docs                          src/app/docs/page.tsx         static + ScrollSpyToc island
/blog                          src/app/blog/page.tsx         static + BlogList island
/blog/[slug]  × 8              generateStaticParams          SSG
/legal/{7 slugs}               LegalDocument                 static
/pricing /contact /integrations                              static shell + full client body
/api/contact                   route.ts                      POST, Brevo mail
/api/status                    route.ts                      GET, cached health proxy
/sitemap.xml /robots.txt /manifest.webmanifest               metadata routes
/opengraph-image, /blog/[slug]/opengraph-image × 8           ImageResponse
```

**Zero dynamic surfaces.** No `cookies()`, `headers()`, `searchParams`, `export const dynamic|revalidate|runtime`, `middleware.ts`, or `unstable_noStore`. The only non-static endpoints are the two route handlers. This is a clean, fast architecture and the reason most crawlability concerns simply do not apply.

### Content layer

No CMS. All content is typed TypeScript under `src/lib/`, which is why the sitemap cannot drift for blog and legal routes — they generate from the same arrays that generate the pages.

| Module | Lines | Contents |
|---|---|---|
| `blog.ts` | 422 | 8 posts as a discriminated-union `BlogBlock[]`, plus `getToc`, `computeHeadingIds`, `getRelatedPosts` |
| `legal.ts` | 420 | 7 documents with `lastUpdated` |
| `pricing.ts` | 250 | 4 tiers, 11 FAQ entries, feature matrix, top-up packs, dual currency |
| `features.ts` | 210 | 10 features, 4 solutions |
| `changelog.ts` | 113 | Dated releases with stable anchor IDs |
| `integrations.tsx` | 80 | 8 integrations + brand icons |
| `site.ts` | 68 | Nav, footer, app links |
| `seo.ts` | 37 | `pageMeta()` helper |

### Component layer

22 design-system primitives in `src/components/ds/`, 14 site components in `src/components/site/`. 14 files carry `'use client'`.

**Important correction to a common assumption:** in App Router, client components still server-render to HTML. `'use client'` does **not** hide content from crawlers. The cost is bundle size and hydration, not invisibility. The one exception is state initialised to a non-content value — which is exactly the `NumberTicker` bug (§5 P-1).

### SEO infrastructure

`metadataBase` + title template in `layout.tsx`; `pageMeta()` for per-page title/description/canonical/OG/Twitter; file-convention `opengraph-image.tsx` at root and per blog post; `sitemap.ts` (27 URLs); `robots.ts` (wildcard allow); `manifest.ts`; 15 hand-written JSON-LD blocks.

### Deployment

Vercel. `vercel.json` is 133 bytes — schema and a preview toggle only. No redirects, headers, `cleanUrls`, or `trailingSlash`. `next.config.ts` sets four security headers, AVIF/WebP, and a Turbopack root pin.

---

## 3. Technical SEO Report

### T-1 · CRITICAL · og:image and twitter:image missing on 18 of 27 routes
**Verified.** `src/lib/seo.ts:19-37`

| Have `og:image` (9) | Missing (18) |
|---|---|
| `/`, 8 × `/blog/*` | `/about` `/features` `/solutions` `/integrations` `/pricing` `/docs` `/blog` `/changelog` `/contact` `/security` `/legal` + 7 × `/legal/*` |

Every page in the right column goes through `pageMeta()`. The mechanism: `pageMeta()` returns an `openGraph` object with no `images` key. In Next.js Metadata a page-level `openGraph` **replaces** the parent's rather than merging, and the file-convention `src/app/opengraph-image.tsx` does not backfill into a page that declares its own `openGraph`.

**The clinching evidence:** `/_not-found` — the one page that declares no metadata at all — **does** receive the root og:image. That is the mechanism proving itself. Declaring `openGraph` is what costs you the image.

The comment at `src/lib/seo.ts:6-8` states *"og:image is inherited from the root `opengraph-image`."* The compiled output disproves this, and the comment is likely why the bug survived review.

**Impact.** Every share of `/pricing`, `/features`, `/docs`, `/integrations` on LinkedIn, X, Slack, WhatsApp, or Teams renders as a bare text link. For a B2B SaaS whose primary distribution is LinkedIn, that is a direct top-of-funnel loss. It also removes the image AI answer engines attach to preview cards.

**Fix.** In `pageMeta()`, add `images: ['/opengraph-image']` to both the `openGraph` and `twitter` objects. Relative URLs resolve against `metadataBase`. Delete the incorrect comment.

---

### T-2 · CRITICAL · Money-page titles are 15–24 characters
**Verified.** Extracted from every compiled `<title>`.

| Route | Title | Chars | Desc |
|---|---|---:|---:|
| `/` | `OyeChats. You only talk to buyers.` | 34 | 151 |
| `/blog` | `Blog · OyeChats` | **15** | 145 |
| `/legal` | `Legal · OyeChats` | **16** | 72 |
| `/pricing` | `Pricing · OyeChats` | **18** | **179** |
| `/contact` | `Contact · OyeChats` | **18** | 134 |
| `/about` | `About Us · OyeChats` | **19** | 150 |
| `/features` | `Features · OyeChats` | **19** | 143 |
| `/security` | `Security · OyeChats` | **19** | 153 |
| `/solutions` | `Solutions · OyeChats` | **20** | 135 |
| `/changelog` | `Changelog · OyeChats` | **20** | 95 |
| `/integrations` | `Integrations · OyeChats` | 23 | **198** |
| `/docs` | `Documentation · OyeChats` | 24 | 108 |
| `/_not-found` | `OyeChats. You only talk to buyers.` | 34 | 151 |
| blog posts | — | 57–90 ✅ | 114–165 ✅ |

Titles are the highest-weight on-page ranking element. `Pricing · OyeChats` uses 30% of the available budget and contains no head term — not "AI chatbot", not "lead qualification". A searcher scanning a SERP for "ai chatbot pricing" sees a title matching on one generic word.

The homepage title contains no product-category term at all, so the site's strongest URL is not competing for its own category.

**Note:** titles and descriptions are metadata, not visible page content — changing them does not touch the no-content-change constraint.

**Also:** `/_not-found` inherits the homepage title *and* description verbatim. `/integrations` (198) and `/pricing` (179) exceed the ~160-char truncation point. `/legal/cookies` (51) is thin.

That blog metadata is excellent while money-page metadata is not suggests oversight rather than a capability gap.

**Fix.** Extend the `pageMeta()` call sites. The `%s · OyeChats` template appends 11 chars, so target ~45 in the `title` argument.

---

### T-3 · HIGH · No AI-crawler policy in `robots.ts`
**Verified.** Compiled output is exactly:
```
User-Agent: *
Allow: /

Sitemap: https://www.oyechats.com/sitemap.xml
```

Access is not *broken* — the wildcard permits everything. The problem is that the policy is implicit and unmanaged: no decision has been made, so none can be defended, and a future blanket AI block could land without a conversation.

**Recommendation for this specific business: allow, deliberately and explicitly.** OyeChats is a low-ACV, self-serve, product-led B2B SaaS. There is no content moat — the entire site *is* the marketing. Being the cited answer to "best AI chatbot for Indian SMBs" is worth far more than protecting marketing copy from training corpora. That calculus would differ for a paywalled research business.

Explicit `allow`: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-User`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`. Explicit `disallow`: `Bytespider`, `Amazonbot`, `Diffbot`, `Omgili` (aggressive, zero citation value). Plus `disallow: /api/` for all, and a `host` directive.

One clarification worth stating to stakeholders: **`Google-Extended` does not affect classic Search ranking.** It gates Gemini and AI Overviews grounding. Blocking it removes you from the highest-volume AI surface while gaining nothing in blue links.

---

### T-4 · MEDIUM · Sitemap `lastModified` is stale and undifferentiated
**Verified.** `src/app/sitemap.ts:8` pins `LAST_BUILD = new Date('2026-07-14')`. Compiled `sitemap.xml` shows that date for all 12 static routes, all `changefreq: weekly`, all `priority: 0.7`. Five commits have landed since, touching `/pricing`, `/features`, and JSON-LD sitewide.

The stable-constant approach is a deliberate, well-commented choice to avoid claiming everything changed on every build — that instinct is right; the execution needs tiers. Legal and blog entries are correctly derived from real data.

**Fix.** Tier the statics by real change frequency; derive `/changelog` from `CHANGELOG[0].dateISO` (already imported by `Footer.tsx:15`); differentiate `priority`. The 12 hand-listed paths at `sitemap.ts:11-24` are also a drift risk — a new top-level route will silently not appear.

---

### T-5 · MEDIUM · `/openapi.json` is 486 KB, crawlable, and unaudited
**Verified.** 486,026 bytes. Linked once, from `src/app/docs/page.tsx:333`. Not in the sitemap, `llms.txt`, or robots.

- **Crawl cost.** Half a megabyte of JSON with no useful snippet, revalidated every visit (Vercel serves `public/` with `max-age=0, must-revalidate`).
- **Unaudited exposure.** A 486 KB spec on a marketing site is very likely a full backend dump; `/docs` documents 6 endpoints. **Review its contents before promoting discoverability.** An OpenAPI spec is genuinely one of the best GEO assets a developer-facing product can publish — but auditing comes first.

---

### T-6 · Requires external evidence · apex vs www is unenforced
**Source-verified as absent.** No `redirects()` in `next.config.ts`, no `middleware.ts`, no rules in `vercel.json`. Confirmed in `.next/routes-manifest.json`: the only redirect is Next's internal trailing-slash 308.

The repo asserts `www` in 14 places (`metadataBase`, `sitemap.ts:5`, `robots.ts:6`, 11 hard-coded JSON-LD `url` values). Meanwhile `src/app/api/contact/route.ts:121,135` emits `https://oyechats.com` — apex — in transactional emails, so apex URLs are being actively distributed to users.

**Evidence needed:**
```bash
curl -sI https://oyechats.com/ | head -3              # expect 308 → https://www.oyechats.com/
curl -sI https://www.oyechats.com/pricing/ | head -3  # expect 308 → /pricing
curl -sI https://www.oyechats.com/Pricing | head -3   # expect 404
```
Plus GSC Coverage filtered to *Duplicate without user-selected canonical*, and top 404s over 90 days. The Enterprise removal (`e8f7042`) and the BANT "Timing"→"Timeline" rename (`2edd439`) are both candidates for broken deep links.

---

### T-7 · MEDIUM · Missing CSP and Permissions-Policy
**Source-verified.** `next.config.ts:22-40` sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and a 2-year HSTS with `includeSubDomains; preload`. Plus `poweredByHeader: false`. A sound baseline.

Absent: `Content-Security-Policy` (which supersedes `X-Frame-Options` via `frame-ancestors`), `Permissions-Policy`, `Cross-Origin-Opener-Policy`. Not a ranking factor, but CSP is a standard enterprise procurement checklist item for a product that injects a third-party script onto customer sites — and `/security` invites exactly that scrutiny. CSP will need `script-src` allowances for `cdn.oyechats.com` and the inline JSON-LD (nonce, or fix the escaping first — see §6 S-8).

---

### T-8 · LOW · Icon assets oversized and inconsistently declared
**Verified.** `src/app/icon.png` and `src/app/apple-icon.png` are **242,008 bytes each at 512×512** — roughly 10× what that resolution needs. Meanwhile `public/favicon.png`, `public/apple-icon.png`, and `public/logo.png` are 1024×1024 at ~8.5 KB.

`src/app/manifest.ts:14-15` declares `/favicon.png` at `sizes: '512x512'` and again at `'180x180'` with `purpose: 'maskable'` — but the file is 1024×1024, and a maskable icon needs safe-zone padding a standard logo lacks. No `favicon.ico` exists, which some older crawlers and Bing still request.

---

### Already correct — technical SEO

Canonicals on all 27 routes, absolute and `www`. `metadataBase` set. `robots: { index: true, follow: true }`. Trailing-slash 308 present. Exactly one `<h1>` per page. **Sitemap diff is clean** — zero routes missing, zero phantom entries. All 15 JSON-LD blocks render and parse as valid JSON.

---

## 4. Accessibility Report (WCAG 2.2 AA)

### F-1 · CRITICAL · Contact topic dropdown is keyboard-inoperable
**Source-verified.** `src/app/contact/ContactClient.tsx:150-194`

Options are `<li role="option" onClick={...}>` — not focusable, no `onKeyDown`, no arrow/Enter/Space/Home/End/Escape handling anywhere in the file. The trigger is a real `<button>` with `aria-haspopup="listbox"`, so a keyboard user **can open the menu and can never select a value**. Closes only on outside `mousedown`. The `<ul role="listbox">` has no accessible name; the trigger has no `role="combobox"`, `aria-controls`, or `aria-activedescendant`. The `<Label>` at `:151` has no `htmlFor` and describes a `<button>`, producing a label bound to nothing.

**WCAG 2.1.1 Keyboard (A)**, **4.1.2 (A)**, **3.3.2 (A)**. Also a lead-capture conversion bug.

**Fix.** Replace with a native `<select>` styled with the existing `Input` classes plus a chevron background. Native provides keyboard support, mobile pickers, and typeahead for free, and removes ~45 lines.

---

### F-2 · CRITICAL · Pricing tables convey include/exclude via icon only
**Verified.** `src/app/pricing/PricingClient.tsx:38-43` returns a bare `<Check>` or `<X>`. The compiled `/pricing` HTML contains **113 lucide SVGs, 0 with `aria-hidden`, 0 with an accessible name** — `lucide-react`'s `defaultAttributes` contains no ARIA at all.

A screen-reader user hears nothing for every boolean cell across all three comparison tables. **WCAG 1.1.1 (A).**

**Fix.** Return `<><Check aria-hidden="true" /><span className="sr-only">Included</span></>` and the equivalent for `X`. Note Tailwind v4 under `@theme inline` does not ship `sr-only` — add the utility.

---

### F-3 · HIGH · Resources mega menu is hover-only
**Source-verified.** `src/components/site/Navbar.tsx:96` binds opening to `onMouseEnter`; `:87` binds closing to the header's `onMouseLeave`. The trigger is a `<Link>` with no `aria-expanded`, `aria-haspopup`, `onKeyDown`, or `onFocus`.

Keyboard and touch users cannot reach Documentation / Changelog / Blog / Security from the header. The panel is also conditionally rendered, so those four links are absent from the compiled HTML — the header contributes zero link equity to Resources content. They survive only because the footer links them.

**Fix.** Render the panel unconditionally with CSS + `inert` — the pattern already proven in this same file for the mobile drawer at `:153-161` — and make the trigger a `<button>` with proper ARIA. **This single change fixes the a11y failure and the crawlability gap together.**

---

### F-4 · HIGH · Mobile drawer has no focus management
**Source-verified.** `Navbar.tsx:135-183`. The `inert={!open}` on the closed state is genuinely good and correctly commented. But when open: focus stays on the toggle; nothing else is inert, so `<header>`, `<main>`, and `<footer>` remain tabbable *behind* an opaque overlay; no Escape handler; focus not restored on close. Because the drawer is a sibling after `</header>`, the first Tab exits into content hidden under the overlay. **WCAG 2.4.3 (A)**, **2.4.11 (AA)**.

---

### F-5 · HIGH · Focus indicator is 2.23:1 and vanishes in forced-colors
**Source-verified with computed ratios.** `src/app/globals.css:248-252`
```css
:focus-visible { outline: none; box-shadow: var(--e-focus); border-radius: var(--r-2); }
/* --e-focus: 0 0 0 3px rgba(124,58,237,.5) */
```
Four problems: composited over `--paper` the ring is ≈`#BB9AF2` → **2.23:1** (WCAG **1.4.11** requires ≥3:1); `outline: none` + `box-shadow` means the indicator **disappears entirely** under `forced-colors: active`; `box-shadow` is clipped by `overflow` ancestors (live at `IntegrationsClient.tsx:113`, `ScrollSpyToc.tsx:79`, `Table.tsx:8`); and the blanket `border-radius` makes `rounded-full` pills visibly square off on focus.

**Fix.** `:focus-visible { outline: 3px solid var(--volt-2); outline-offset: 2px; }` — `--volt-2` (#6D28D9) is **7.10:1**, `outline` is not clipped, and it survives forced-colors. Drop the `border-radius` line. `Input.tsx:7` and `ContactClient.tsx:155` need the same treatment.

---

### F-6 · HIGH · `text-volt-fg` is a phantom class → 3.47:1 label
**Verified.** `PricingClient.tsx:118,127` apply `bg-volt text-volt-fg`. The `@theme inline` block at `globals.css:75-80` defines `--color-volt`, `-2`, `-light`, `-tint`, `-line`, `-ink` — **there is no `-fg`**, and Tailwind v4 is CSS-first with no config file.

Confirmed: the literal string `text-volt-fg` appears in the compiled HTML and in **no compiled CSS file**. The class matches nothing, so the 12px label inherits `body { color: var(--ink) }` → `#0A0A0A` on `#7C3AED` = **3.47:1**.

The sibling Monthly/Annual toggle correctly uses `bg-ink text-paper` (18.93:1), so this is an isolated typo, not a systemic problem. **Fix:** `text-white` (5.70:1), matching `Button.tsx:17`.

---

### F-7 · HIGH · `--signal` fails AA at every small-text size used
**Computed from tokens.** `--signal` = `#0F9D58`.

| Context | Ratio | AA 4.5:1 |
|---|---:|---|
| on `--canvas` | 3.51 | ❌ |
| on `--paper` | 3.36 | ❌ |
| on `--signal-tint` | 3.18 | ❌ |

Live at 10–12px in `Chip.tsx:12` (which is what `SystemStatus` renders), `PricingClient.tsx:109,268`, `features/page.tsx:286,330,339`, `docs/page.tsx:67,204`, `page.tsx:273`, `security/page.tsx:158`, `solutions/page.tsx:66`.

**Fix.** Darken to ≈`#0B7A45` (≈4.9:1 on canvas) and keep `#0F9D58` as a separate `--signal-graphic` for dots, rings, and borders where 3:1 suffices. `--alert` at 4.58:1 passes with almost no margin — check it in the same pass.

---

### F-8 · HIGH · No skip link; `<main>` has no id
**Source-verified.** `layout.tsx:101`. Every page forces keyboard users through logo + 6 nav links + 2 CTAs before content. **WCAG 2.4.1 (A).**

---

### F-9 · HIGH · Accordion collapsed answers stay in the accessibility tree
**Source-verified.** `Accordion.tsx:50-59`. The `grid-rows-[0fr]` + `overflow-hidden` collapse is exactly right for SEO/AEO — but the content is not `display:none`, so screen readers announce every answer regardless of state and find-in-page matches invisible text, contradicting `aria-expanded` at `:39`.

**This is the one finding where the a11y fix and the AEO benefit are in tension, and the resolution matters.** Do **not** switch to conditional rendering or `display:none` — that removes the answers from the HTML and breaks both the AEO value and FAQ eligibility. Use `inert={!isOpen}` + `aria-hidden={!isOpen}` on the inner wrapper: text stays in the DOM for crawlers (which ignore `aria-hidden`) while being correctly hidden from assistive tech.

---

### F-10 · HIGH · `BlogList` declares the tabs pattern without implementing it
**Source-verified.** `BlogList.tsx:73-93` sets `role="tablist"` / `role="tab"` / `aria-selected` with no `tabpanel`, `aria-controls`, ids, roving tabIndex, or arrow-key handler. **Fix:** `aria-pressed` inside `<div role="group">` — the pattern already used correctly in `IntegrationsClient.tsx:122` and `HeroDemo.tsx:300`.

---

### F-11 · HIGH · Contact form has no status announcement
**Source-verified.** `ContactClient.tsx:44-64, 88-97, 209-215`. Success swaps the form for a card with focus left on a removed button — nothing announced. The error `Callout` has no `role="alert"`. `loading` changes only the button label; no `aria-busy`, and the button is never `disabled`, so double-submission posts twice. **WCAG 4.1.3 (AA)**, **3.3.1 (A)**.

---

### F-12 · MEDIUM · Heading hierarchy — verified counts
**Verified against compiled HTML.** A specialist attributed the h2→h4 skip to `/features`; the counts are right but the framing needed correction — the `<h4>`s come from the footer and appear on **all** pages, making this sitewide.

| Route | h1 | h2 | h3 | h4 | `<dl>` | `<table>` |
|---|---:|---:|---:|---:|---:|---:|
| `/features` | 1 | 7 | **0** | 4 | 0 | **0** |
| `/solutions` | 1 | 5 | **0** | 4 | 0 | 0 |
| `/security` | 1 | **1** | 5 | 4 | 0 | 0 |
| `/pricing` | 1 | 3 | 5 | 4 | 0 | 3 |
| `/docs` | 1 | 4 | 2 | 4 | 0 | 2 |
| `/about` | 1 | 2 | 3 | 4 | 0 | 0 |
| `/` | 1 | 5 | 9 | 4 | 0 | 0 |

The 4 `<h4>`s are `Footer.tsx:74` column titles. On `/features` and `/solutions` (zero h3) this produces a literal **h2 → h4 skip on every page**. `/security` inverts the problem: one h2 and five h3, with `security/page.tsx:171` an `<h3>` styled `type-heading-2` while functioning as an h2 peer.

**Fix.** Change `Footer.tsx:74` to a non-heading `<div>` and wrap the columns in `<nav aria-label="Footer">`. Then add real `<h3>`s inside `/features` and `/solutions` — see §7 A-2, the biggest AEO win available.

---

### F-13 · MEDIUM · Visual headings that are not headings
**Source-verified.** `docs/page.tsx:133` (`<p className="type-heading-3">` × 4 quick-start steps), `docs/page.tsx:356` (`<div className="type-heading-2">`), `about/page.tsx:180` (a `<p>` where the sibling at `:134` correctly uses `<h3>`), `IntegrationsClient.tsx:155` (a `<div>` where `:182` correctly uses `<h3>`), `Accordion.tsx:41` (FAQ questions as `<span>`).

Both a 1.3.1 failure and an AEO loss — heading text is the primary passage-boundary signal for AI retrieval. The inconsistency within the same files suggests drift.

---

### F-14 · MEDIUM · `/blog` skips h1 → h3 when filtered
**Source-verified.** `BlogList.tsx:66-68` gates the featured post on `active === ALL`, so selecting any category removes the page's only `<h2>`.

---

### F-15 · MEDIUM · Structural gaps

- Primary `<nav>` unlabelled (`Navbar.tsx:92`) while `/solutions` has a labelled one — the ambiguous one is the primary.
- Scrollable regions not keyboard-reachable (`Table.tsx:16`, the `<pre>` blocks, pill scrollers) — **WCAG 2.1.1**.
- `<th>` ships with no `scope`; `PricingClient.tsx:315` uses `<Td>` where `<Th scope="row">` belongs. Also degrades AI table extraction.
- Card grids are `<div>` grids, not `<ul>`/`<li>` — no item count for screen readers.
- No `<time datetime>` anywhere despite `dateISO` throughout the data layer.
- No `autocomplete` on any contact input (**1.3.5 AA**).
- Integrations search input has only a placeholder, no label.
- Pricing toggles signal selection through background colour only — no `aria-pressed` (**1.4.1**, **4.1.2**).

---

### Already correct — accessibility

`<html lang="en">`. Single `main`/`header`/`footer`, no duplicate landmarks. `inert` on the closed drawer with a comment explaining why `pointer-events` is insufficient. Touch targets floor at 44px with comments citing WCAG 2.5.5. Comprehensive `prefers-reduced-motion` block that also neutralises smooth scroll, plus independent JS checks in five components. Every toggle is a real `<button type="button">` with `aria-expanded` — no div-as-button anywhere. Logo correctly decorative with adjacent text. Social links have `aria-label` and `rel="noopener noreferrer"`. `aria-live="polite"` on `SystemStatus`. Honeypot correctly `tabIndex={-1}` + `aria-hidden` + `display:none`. `<blockquote>` + `<cite>` in `PullQuote`. Links keep underlines — not colour-only.

**Contrast passes:** `--ink` on `--paper` 18.93 · `--ink-2` 9.99 · `--muted` 4.62 · `--volt` on `--paper` 5.45 · white on `--volt` 5.70 · `--volt-ink` on tint 8.37 · all dark-footer pairs ≥6.87.

---

## 5. Performance Report

**No field data.** No CrUX, no RUM, no Lighthouse run. Core Web Vitals cannot be scored empirically — what follows is code-level risk analysis. **Required:** PSI field data for `/`, `/pricing`, `/features`; GSC Core Web Vitals; a Lighthouse trace on throttled mobile.

### P-1 · CRITICAL · `/pricing` static HTML contains `$0` for every paid tier
**Verified.** `src/components/ds/NumberTicker.tsx:23` initialises `useState(0)` and renders `{prefix}{display.toLocaleString()}{suffix}`. The count-up runs only in a `useEffect` + `IntersectionObserver`.

`PricingClient.tsx:172-177` routes every tier price through it. The compiled HTML contains `class="tabular-nums">$<!-- -->0</span>` **three times** — Starter, Standard, Professional. The same page emits `AggregateOffer` JSON-LD with per-tier prices of 9/19/39.

**Two compounding failures:**
1. **Structured-data mismatch.** Visible `$0` vs markup `$9` — the precise condition Google's rich-result policy targets, and the only finding here with manual-action exposure.
2. **AI crawlers read `$0` as fact.** GPTBot, ClaudeBot, PerplexityBot, and CCBot do not execute JavaScript. Every one currently believes OyeChats Starter costs $0.

`NumberTicker` is used **only** here — `/` renders prices statically and correctly (verified: `$9` present in `index.html`). One page, one component.

**Fix.** Remove `NumberTicker` from the price; render `formatPrice(price, currency)` directly. A count-up on the single most important string on the page is a net negative even ignoring SEO. If the animation must stay, seed with `useState(() => value)` and replay from 0 only post-mount when motion is allowed.

---

### P-2 · CRITICAL · All INR pricing absent from served HTML
**Verified.** `grep -c "₹449" .next/server/app/pricing.html` → **0**.

`src/app/pricing/page.tsx:67` hardcodes `initialCurrency="USD"`. The INR switch happens only in `PricingClient.tsx:60-69`, in a `useEffect` reading `Intl.DateTimeFormat().resolvedOptions().timeZone` — client-side, post-hydration.

**Compounding context:**
- `src/lib/pricing.ts:1-9` documents *"The currency is resolved server-side from the request's IP country (see `app/pricing/page.tsx`)"*. **That comment is false.** Worth correcting regardless of SEO.
- `public/llms.txt` explicitly tells AI engines INR pricing exists. When an engine fetches `/pricing` to verify, it finds only USD. A verifiable contradiction is worse than silence.
- The `best-ai-chatbot-india` post argues rupee pricing is the #1 buying criterion for the target market, then links to a page from which no crawler can read a rupee.
- Timezone detection also fails for Indian users on VPNs or with non-IST clocks.

**Also a CLS risk:** for Indian visitors the above-the-fold price changes after hydration. With P-1 the sequence is `$0` → `$9` → `₹449`.

**Fix.** Cheapest high-value step: emit **both** currencies in the `Offer` JSON-LD with `eligibleRegion`, fixing the AI-citation half immediately. Proper fix: resolve server-side from `x-vercel-ip-country`, pass as `initialCurrency`, and render both values in the DOM with CSS toggling.

---

### P-3 · MEDIUM · `simple-icons` — build cost, **not** a shipped-bundle cost
**Verified — this corrects a specialist finding.** A specialist graded this HIGH, reasoning that a 5.2 MB barrel would be "catastrophic for First Load JS." I tested that against the compiled chunks and **it is not what happens.**

Facts: `node_modules/simple-icons/index.mjs` is **5,236,695 bytes** in one ES module. `exports["./icons/*"]` maps only to raw `.svg` files (3,447 of them), so the usual deep-import escape hatch genuinely does not exist. `src/lib/integrations.tsx:2-12` imports 8 named icons from the root barrel, and that module reaches the client graph via `IntegrationsClient.tsx`.

**Tree-shaking test on the compiled chunks:**

| Used brands found in client JS | Unrelated brands found |
|---|---|
| WordPress ✓ Webflow ✓ Next.js ✓ HTML5 ✓ Vue.js ✓ React ✓ Framer ✓ Calendly ✓ | Adobe ✗ Shopify ✗ Salesforce ✗ Fortran ✗ Zomato ✗ |

Only the 8 used brands ship; zero leakage. **Turbopack shakes this correctly and the runtime bundle impact is nil.**

The real cost is build time — parsing a 5 MB module on every cold build, plausibly a contributor to the hangs observed twice this session. That is a developer-experience issue, not a user-facing one.

**Revised: LOW priority.** Inlining the 8 paths (each is `{title, hex, path}`) removes a 5 MB dependency and likely speeds builds. Cleanup pass, not a performance fix.

**Total client JS: 1.0 MB uncompressed across 18 chunks** (largest 222 KB) — reasonable for this scope.

---

### P-4 · MEDIUM · `motion` full bundle defeats `LazyMotion` on 8+ routes
**Source-verified.** `src/components/ui/FadeUp.tsx:3-9` correctly uses `LazyMotion` + `domAnimation` + `m` — whose entire purpose is keeping the full feature set out of the bundle. But `src/components/site/pill-tabs.tsx:4` imports the full `motion` proxy and uses `motion.span` with `layoutId`, re-adding everything plus the layout-projection code `domAnimation` deliberately excludes.

Affected: `/integrations` directly, plus `/features`, `/docs`, `/blog/[slug]`, and all 7 `/legal/*` via `ScrollSpyToc`. `PillHighlight` is a purely decorative sliding background.

**Fix.** CSS-only indicator — an absolutely-positioned span whose `transform: translateX()` and `width` are set from the active pill's offsets in the existing `useCenteredTabs` effect. That deletes the `motion` import entirely.

---

### P-5 · MEDIUM · `ScrollSpyToc` forces synchronous layout per item per frame
**Source-verified.** `ScrollSpyToc.tsx:39-61`. Every rAF frame: re-runs `document.getElementById` for every item, reads `document.documentElement.scrollHeight` (forces layout), then calls `getBoundingClientRect()` in a loop over every item (forces layout per item), then `setActiveId` re-renders.

On `/docs` and `/blog/[slug]` this is N forced reflows at 60 Hz during scroll — amplified by `html { scroll-behavior: smooth }` (`globals.css:194`), so a single TOC click produces ~40 frames of it. The handler *is* correctly rAF-throttled and passive; the problem is what runs inside.

**Fix.** Resolve elements once into a ref; replace the rect loop with one `IntersectionObserver` using `rootMargin: -${offsetTop}px 0px -70% 0px`; cache `scrollHeight`. This removes the scroll listener entirely.

---

### P-6 · MEDIUM · `HeroDemo` performs ~200 React commits during the LCP window
**Source-verified.** `HeroDemo.tsx:141-165`: `setTypedQ` per character (~29 @ 20ms), `setTypedA` per character (up to ~180 @ 15ms), `setScore` 22 times — then auto-advances through four scripts. Starts when the hero intersects, which for the homepage is immediately.

Already correctly mitigated: IntersectionObserver pauses off-screen, reduced-motion renders the final state, auto-advance is capped rather than looping.

**Fix.** Drive typing via a ref + `node.textContent` inside the existing sleep loop, keeping state for coarse phase transitions only — 5 commits instead of 200. Gate the first `play()` behind `requestIdleCallback`.

---

### P-7 · MEDIUM · `FadeUp` does a forced layout read per instance at hydration
**Source-verified.** `FadeUp.tsx:88-102` — each instance runs a `useLayoutEffect` calling `getBoundingClientRect()` + `window.innerHeight`, then `setState`. `/integrations` instantiates 13+, `/docs` ~10, all interleaved in one commit. **Fix:** one module-scope `IntersectionObserver` reporting `isAboveFold` to subscribers.

---

### P-8 · MEDIUM · Whole-page client boundaries on three high-intent routes
**Source-verified.** `/pricing` (345 lines), `/contact` (226), `/integrations` (261) are entirely client components.

**Precisely what is and is not broken:** these pages **are** server-rendered and **are** crawlable (P-1 is the sole content exception). The cost is bundle size and hydration, not invisibility. Roughly 60% of `/integrations` (the webhook section) and the entire `/pricing` comparison table are static markup shipped and hydrated for nothing.

`/features`, `/docs`, `/blog/[slug]`, and `/legal/*` already demonstrate the right pattern. The `currency` dependence in the pricing table is the one genuine blocker; a small context provider or rendering both variants resolves it — and P-2 wants both rendered anyway.

---

### P-9 · LOW-MEDIUM · Mobile CLS in `HeroDemo`
**Source-verified.** `HeroDemo.tsx:251` uses `min-h-[360px] sm:h-[360px]`. Desktop is correctly pinned and commented. Below `sm`, `min-h` lets the pane grow as text types in and the qualification block mounts, pushing content down. CLS on the homepage in the initial mobile viewport.

---

### P-10 · LOW · Footer logo carries `priority` — corrected scope
**Verified — this corrects a specialist claim.** A specialist reported that the two `Logo` instances request different widths and emit **two** high-priority image preloads. The compiled HTML contains **exactly one**: Navbar (`size=28` → `width=56`) and Footer (`size=32` → `width=64`) both round to the same `w=64` bucket, so they resolve to one URL and Next deduplicates.

The residual issue is real but minor: `Logo.tsx:37` hardcodes `priority`, so the below-the-fold footer instance loads eagerly. Add a `priority?: boolean` defaulting to `false`. Three font files preload (~101 KB) — correct.

---

### P-11 · MEDIUM · No `error.tsx` or `global-error.tsx`
**Source-verified.** No `error.tsx`, `global-error.tsx`, `loading.tsx`, `template.tsx`, `<Suspense>`, or `next/dynamic` anywhere. Any runtime throw in a client component — `HeroDemo`'s async runner, `SystemStatus`'s fetch, `ScrollSpyToc`'s DOM reads — unwinds to Next's default error page and blanks the route.

`loading.tsx` is genuinely unnecessary here: all routes are static, so there is no streaming gap to fill and adding one would only introduce a flash.

---

### P-12 · LOW · Cache-Control for `public/`
**Source-verified.** `next.config.ts` sets no caching directives. On Vercel this is **correct for `/_next/static/*`**, served `immutable` automatically — adding your own rule would be redundant or harmful. The gap is `public/`, served `max-age=0, must-revalidate` with no content hash; notably `openapi.json` (486 KB) revalidates every visit.

---

### Already correct — performance

`WidgetLoader` is genuinely excellent: renders `null`, injects the CDN script only on first user intent (`scroll`/`pointerdown`/`touchstart`/`keydown`, all `{ once: true, passive: true }`) or `requestIdleCallback` with a 4s timeout, guards double-injection, sets `async`, cleans up fully. **It should not use `next/script`** — `strategy="lazyOnload"` fires unconditionally at window load with no intent signal and would be strictly worse.

`FadeUp` initialises `skipAnimation = true`, so no render path paints `opacity: 0` in server HTML. The `pageshow`/`persisted` store plus `useSyncExternalStore` correctly handles the IntersectionObserver-reattach bug that leaves reveal content stuck invisible on back-navigation — a sophisticated solution to a bug most sites never diagnose.

Every route statically generatable. `/api/status` is well designed — `next: { revalidate: 30 }` plus `s-maxage=30, stale-while-revalidate=300` means a DB-touching endpoint is hit once per 30s globally, not per visitor; the client poll is below-the-fold with a stable placeholder, so no CLS and no waterfall. `ReadingProgress` is textbook: rAF-coalesced, passive, `transform: scaleX()` on `origin-left` — compositor-only. Zero raw `<img>`. `BlogCover` generates cover art as inline SVG — no image requests at all. AVIF/WebP enabled. Fonts resolve to variable files with `display: swap` and correct selective preloading.

---

## 6. Structured Data Report

### Inventory

| Route | File:line | `@type` | Status |
|---|---|---|---|
| all | `layout.tsx:104` | `@graph` → `Organization` + `WebSite` | No `@id`, `sameAs: []` |
| `/` | `page.tsx:64` | `SoftwareApplication` | Conflicts with `/features` |
| `/features` | `features/page.tsx:102` | `SoftwareApplication` | Different `url`, no offers |
| `/pricing` | `pricing/page.tsx:59` | `FAQPage` | Valid, visibility-compliant |
| `/pricing` | `pricing/page.tsx:63` | `Product` + `AggregateOffer` | 3rd commercial entity; contradicts rendered HTML |
| `/about` | `about/page.tsx:83` | `AboutPage` → `Organization` | 3rd Organization |
| `/contact` | `contact/page.tsx:32` | `ContactPage` → `ContactPoint` | Wrong `mainEntity` nesting |
| `/docs` | `docs/page.tsx:82` | `TechArticle` | No dates, image, or publisher |
| `/solutions` | `solutions/page.tsx:88` | `Service` + `OfferCatalog` | 4th Organization |
| `/integrations` | `integrations/page.tsx:33` | `ItemList` | Invalid — no `item`, no `url` |
| `/blog` | `blog/page.tsx:49,53` | `CollectionPage` + `BreadcrumbList` | Enumerates nothing |
| `/blog/[slug]` | `blog/[slug]/page.tsx:123,127,131` | `BlogPosting` + `BreadcrumbList` + conditional `FAQPage` | `dateModified === datePublished` |
| `/security` `/changelog` `/legal` `/legal/*` | — | **none** | 10 routes with layout graph only |

All 15 blocks render and parse as valid JSON — verified by extracting and parsing every block from all 29 compiled files.

### S-1 · CRITICAL · `sameAs: []` while four real profile URLs sit in the repo
**Verified.** `layout.tsx:82` vs `Footer.tsx:9-13` (LinkedIn, Instagram, Twitter, GitHub).

An empty array is worse than omitting the property — it explicitly asserts the entity has no external identity. This is the strongest entity-reconciliation signal available, and the disambiguation need is real: there are unrelated "OyeChat" apps and "oye" is a common Hindi word.

**Fix.** Move `SOCIAL_LINKS` to `src/lib/site.ts` and import in both places so they cannot drift. Note the GitHub org is `digibranders`, not `oyechats` — a business decision on whether that belongs in `sameAs` or as `parentOrganization`.

### S-2 · CRITICAL · Zero `@id` values — the graph is disconnected islands
**Verified.** `layout.tsx:73-90` emits an `@graph` — the construct designed to carry `@id` — with no `@id` on either node.

The site emits **five** `Organization` nodes, **two** `SoftwareApplication` nodes, and **one** `Product`, none referencing each other. Two Organizations (`blog` publisher, `docs` author) have no `url`, so Google has nothing to string-match on.

**Recommended scheme** (fragment-on-canonical, the convention Google's own examples use):
```
https://www.oyechats.com/#organization | #website | #logo | #software
https://www.oyechats.com/<path>#webpage | #breadcrumb | #faq
https://www.oyechats.com/blog/<slug>#article
```
Cleanest implementation: a `buildGraph()` helper in `src/lib/seo.ts` beside `pageMeta()`, returning one `@graph` per page and replacing the 15 ad-hoc objects. That structurally prevents the Organization drift.

### S-3 · HIGH · Duplicate conflicting `SoftwareApplication`
**Verified.** `/` declares `url: "https://www.oyechats.com"` with offers and description but no `featureList`. `/features` declares `url: ".../features"` with `featureList` but no offers and no description. Same name, no `@id`. Google reads two different products both called OyeChats — one priced, one free-of-charge-unknown — splitting every signal.

**Fix.** One canonical `#software` node referenced by `@id`. Add `offers.url` and `availability`, and express price as `UnitPriceSpecification` with `unitCode: "MON"` — currently `price: "9"` reads as a one-time purchase.

**On `aggregateRating`: do not add it.** Exhaustive grep for `testimonial`, `aggregateRating`, `reviewCount`, `G2`, `Capterra`, `Trustpilot` returns zero matches. Fabricating reviews is a spam-policy violation with manual-action risk. **Consequence to state plainly:** Google's Software App rich result requires `aggregateRating` or `review`, so **stars in the SERP are unattainable until real first-party reviews exist on-page.** The markup remains worth having for entity understanding and AI engines.

### S-4 · HIGH · `Product` on `/pricing` is a third conflicting commercial entity
`pricing/page.tsx:34-54`. No `availability`. `lowPrice: "0"` includes the free tier, so AI engines will quote "OyeChats starts at $0" — which, with P-1, is currently also what the visible page says. Google has been narrowing `Product` rich results to shoppable goods; `SoftwareApplication` + `Offer` is better supported for SaaS.

### S-5 · HIGH · `BlogPosting` freshness and authorship
`blog/[slug]/page.tsx:76-77` sets `dateModified: post.dateISO` — identical to `datePublished`, always. `src/lib/blog.ts` has no `updatedISO` field. Posts dated 2026-05-03 read as stale forever.

`author` is an Organization named "OyeChats Team", "AI Team", "Growth Team", or "Platform Team". A byline reading **"AI Team"** is actively counterproductive with a quality rater. **No Person entity can be created from this repo** — no real names exist, and fabricating them would be schema spam. Organizational decision, not technical.

### S-6 · HIGH · `TechArticle` on `/docs` has no dates or provenance
`docs/page.tsx:25-36` emits only `headline`, `description`, `url`, `author`. Missing `datePublished`, `dateModified` (effectively required for the Article family), `image`, `publisher`, `mainEntityOfPage`, `inLanguage`. Undated, unattributed technical content is systematically deprioritised in citation ranking — and this is the highest-intent technical page on the site.

### S-7 · MEDIUM · Smaller schema defects
- `ItemList` on `/integrations` has no `item` and no `url` per `ListItem` → invalid. Verified there are no per-integration routes, so the all-in-one-page form (`item` as nested Thing) is correct.
- `CollectionPage` on `/blog` enumerates none of its 8 posts.
- `ContactPage.mainEntity` is a `ContactPoint` — should be the Organization.
- No `WebPage` node on any route, so nothing anchors `breadcrumb`, `isPartOf`, or `dateModified`.
- `BreadcrumbList` on only 2 of 27 routes; the `/legal/*` cluster — the one genuine 3-level hierarchy — has none.

### S-8 · MEDIUM · JSON-LD escaping — a lit fuse, not a live exploit
**Verified with an important nuance.** All 15 call sites use `JSON.stringify(schema)` into `dangerouslySetInnerHTML`. `JSON.stringify` does not escape `<`, `>`, or `&`. Next.js's own documentation shows `.replace(/</g, '\\u003c')` for exactly this reason.

**Current state: not exploitable.** Every emitted block across all 29 compiled files was parsed — none contains a raw `<` or `>`, and every schema input traces to a static TypeScript module. No user input, CMS, API response, or route param reaches any schema field.

**But the fuse is lit.** `src/lib/blog.ts:163` contains, in authored content:
```
{ type: 'code', lang: 'html', text: '<script src="https://cdn.oyechats.com/widget.js" ...></script>' }
```
That literal `</script>` sits in `post.content`. Today only a `wordCount` **number** is derived from it. The moment anyone adds `articleBody` or `abstract` sourced from `post.content` — a natural AEO improvement — every blog post's JSON-LD breaks out of its script tag and injects a `<script src>`. Same if content moves to a CMS.

**Fix.** One shared `jsonLd()` helper escaping `<`, `>`, `&`, U+2028, U+2029. The `<` form is valid JSON and parses identically, so no semantics change.

### Placement note
Schemas render in `<body>`. This is the pattern Next.js officially documents, and Google parses `ld+json` from anywhere in the document. **Not a defect.**

---

## 7. AEO Report (Answer Engine Optimization)

### A-1 · The good news, verified

The most important AEO question — *what content requires JavaScript?* — has a better answer here than expected, because App Router server-renders client components.

| Content | In static HTML? |
|---|---|
| 11 pricing FAQ answers | ✅ Verified |
| Full comparison matrix (28 rows × 4 tiers) | ✅ Verified, 3 real `<table>` |
| Annual USD pricing | ✅ Verified |
| All 8 integrations | ✅ Verified (default filter `'all'`) |
| Blog FAQ answers | ✅ Verified |
| All 8 posts on `/blog` | ✅ Verified (default `'All'`) |
| **INR pricing** | ❌ **Absent** (§5 P-2) |
| **Paid tier prices** | ❌ **Render as `$0`** (§5 P-1) |

The Accordion's CSS-collapse is why FAQ answers survive. **Preserve it.**

### A-2 · HIGH · `/features` and `/solutions` have zero `<h3>` — the biggest AEO gap
**Verified.** `/features`: 1 h1, 7 h2, **0 h3**. `/solutions`: 1 h1, 5 h2, **0 h3**.

`/features` is the longest, densest product page, with six sections each containing multiple distinct sub-topics: RAG pipeline stages, BANT dimensions, webhook events, analytics metrics. Every sub-topic is a `<div className="type-heading-3">` rather than a real heading.

Semantic chunkers — how every AI engine segments a page for passage retrieval — split on heading boundaries. With 7 h2s on a very long page, `/features` chunks into **7 enormous multi-topic passages instead of ~25 focused, self-contained ones.** Focused chunks are what get cited.

**Fix.** Change the existing heading-styled `div`s to `<h3>`, keeping the `type-heading-3` class so nothing moves visually. A tag swap with zero copy change, zero visual change — and the highest-leverage AEO action available.

### A-3 · HIGH · Zero `<dl>` site-wide; key definitions live in div grids
**Verified.** `<dl>` count across all 29 compiled pages: **0**. `<table>` only on `/pricing` (3) and `/docs` (2).

The most citation-worthy content is in decorative divs:
- **Webhook events** — 5 event names with definitions. Textbook `<dl>`.
- **BANT criteria** — B/A/N/T with labels, scores, descriptions. A 4-row table describing the core differentiator.
- **RAG steps** (6-step process) and **BANT timeline** (5 timestamped events) — both `<ol>` candidates rendered as unordered grids.
- **`/docs` quick start** — 4 numbered steps with "1/2/3/4" as decorative strings.
- **`/integrations` webhook steps** — `'01'/'02'/'03'` as decorative strings.

AI engines extract tables and definition lists far more reliably than visually-tabular divs. **Markup-element swap only — no copy changes.**

`/docs` does correctly use real `<table>` for widget attributes and API endpoints.

### A-4 · Blog content model is genuinely strong
`/blog/ai-chatbot-cost` compiles to 1 h1, 9 h2, 6 h3. The `BlogBlock` union maps `h2`/`h3` to real headings with stable deduped IDs. Many h2s are phrased as literal questions with a self-contained answer immediately following — exactly the answer-first pattern AI Overviews extract. Real `<ul>`/`<ol>`. `renderRichText` produces real `<a>` elements. Outbound citations to primary sources (a Gartner press release, an IMARC market report) as real anchors — outbound citation to authoritative primaries measurably increases AI-engine trust scoring.

**This is the model to extend to the product pages, not to change.**

### A-5 · MEDIUM · Citation-readiness gaps
- **No "last updated" stamp anywhere** — not on posts (S-5), `/docs`, `/features`, `/pricing`, or `/security`. For an API-documenting page, absent freshness is a direct citation-ranking penalty.
- **No original data.** Headline stats on `/` are product specifications, not research findings. The `/features` analytics figures ("Conversations today 342", "CSAT 4.7") are illustrative mock data — correctly *not* marked up as claims, and they must never be.
- **No `<time datetime>`** despite `dateISO` throughout the data layer.
- **Only 3 of 8 posts have `faq` entries**, though the other 5 have question-phrased h2s in the body.

### A-6 · FAQPage eligibility — calibrate expectations
Since August 2023 Google restricts FAQ rich results to authoritative government and health sites. **A B2B SaaS will not get FAQ accordions in the SERP from this markup.** That is not a reason to remove it — `FAQPage` remains one of the most reliably parsed structures for AI Overviews, ChatGPT search, and Perplexity passage extraction. **An AEO asset, not a rich-result asset.** Stated explicitly so nobody measures it against the wrong outcome.

Verified: only `/pricing` and blog posts have visible accordions, so adding `FAQPage` to `/features`, `/security`, or `/docs` would be a visibility violation. Nothing to add.

---

## 8. GEO Report (Generative Engine Optimization)

### G-1 · CRITICAL · `public/llms.txt` contradicts the live product
**Verified.** The file is well written — correct format, good `>` summary, useful Details section. It is also wrong.

- *"Free, Starter, Standard, Professional, and Enterprise plans"* — Enterprise was removed in `e8f7042`. `src/lib/pricing.ts:50-138` has exactly four tiers.
- *"...Professional ($39/mo), and Enterprise (custom)"* — a fabricated structure for a nonexistent plan.
- Key pages omits `/solutions`, `/about`, `/changelog`, `/legal`.
- No individual blog post is listed — all 8 are invisible to an agent reading only this file.

`llms.txt` is the **first** file an AI agent reads. It currently tells ChatGPT, Claude, and Perplexity that OyeChats sells a plan that does not exist.

**The structural fix matters more than the content fix.** This is a hand-maintained static file duplicating facts that already live in typed source. It drifted within days of a pricing change and will drift again. **Generate it** as `src/app/llms.txt/route.ts` importing from `PRICING_TIERS`, `BLOG_POSTS`, `FEATURES`, `LEGAL_PAGES` — exactly as `sitemap.ts` already does. Then delete `public/llms.txt` (a static file shadows a route of the same path).

### G-2 · HIGH · No `llms-full.txt`
Absent. Recommended as a second generated route emitting the full text of all 8 posts, `/docs` content, `PRICING_FAQ`, `FEATURE_ROWS`, and `LEGAL_PAGES` as flat markdown from the same modules. `BlogBlock[]` → markdown is a ~20-line serializer.

**The highest-ROI GEO asset available to this codebase**, precisely because the content already exists in a clean structured form.

### G-3 · MEDIUM · Neither `llms.txt` nor `openapi.json` is discoverable
`grep -rn "llms.txt"` across `src/`, `next.config.ts`, `vercel.json` → zero hits. Add a `# LLM guidance:` line to the robots output, a footer link, and an `## API` section in `llms.txt` (after the T-5 audit).

### G-4 · HIGH · Entity signals are largely absent

| Signal | Status |
|---|---|
| `sameAs` | ❌ Empty despite 4 real URLs (S-1) |
| LinkedIn / Instagram / Twitter / GitHub | ✅ Exist, in footer, absent from schema |
| `twitter:site` / `twitter:creator` | ❌ Absent though the handle is known — free addition |
| G2 / Capterra / Product Hunt | ❌ Zero references. **For B2B SaaS these are the highest-weight external entity signals** and the primary source AI engines cite for "best X" comparisons. Their absence is why OyeChats will not appear in AI-generated vendor shortlists. |
| Crunchbase / Wikidata | ❌ Absent |
| NAP | ⚠️ Only `Thane` + `India, HQ` (`about/page.tsx:72-78`) and `support@oyechats.com`. No street address, postal code, or phone in the repo. |
| `foundingDate`, legal entity, CIN/GSTIN | ❌ Not in repo — **cannot be added without inventing facts** |
| Founder / team Persons | ❌ `/about`'s meta description promises "Meet the team"; the page has no team section and names no individuals |

**Fixable today with zero fabrication:** populate `sameAs`; add `contactPoint` with `support@oyechats.com`; add `PostalAddress` with `addressLocality: "Thane"`, `addressCountry: "IN"` (the source says "India, HQ", not a state — do **not** add `addressRegion`); add `twitter:site`.

**Requires business action, not code:** claim G2/Capterra/Product Hunt, create a Crunchbase profile, name real authors. These are the signals that actually move AI-citation likelihood; no amount of JSON-LD substitutes.

### G-5 · LOW · `Footer.tsx:11` uses the legacy `twitter.com` domain; `x.com` is current.

---

## 9. Internal Linking Report

### L-1 · CRITICAL · `/legal` is a true orphan
**Verified twice** — `grep 'href="/legal"'` returns zero matches in source *and* in all 29 compiled HTML files.

The route exists (47 lines), aggregates 7 documents with descriptions and dates, and is in the sitemap. The footer's Legal column lists the 7 children and skips the parent; `LegalDocument.tsx:74-84` links only siblings.

Google treats sitemap-only URLs as low-priority and frequently leaves them in *Discovered – currently not indexed*. Link-graph-traversing AI crawlers never reach it. **Fix:** one entry in `FOOTER_COLUMNS`.

### L-2 · HIGH · Four blog posts have exactly one inbound page each
**Verified by counting inbound links across all compiled HTML:**

| Post | Inbound pages |
|---|---:|
| `train-ai-chatbot-website` | 8 |
| `ai-chatbot-cost` | 8 |
| `best-ai-chatbot-india` | 8 |
| `bant-scoring-ai-chatbot` | 4 |
| `rag-vs-fine-tuning` | **1** |
| `hybrid-search-explained` | **1** |
| `behavioral-tracking-lead-gen` | **1** |
| `webhook-best-practices` | **1** |

**Root cause, verified.** `src/lib/blog.ts:415-422`:
```ts
const sameCategory = others.filter(p => p.category === current.category);
const rest = others.filter(p => p.category !== current.category);
return [...sameCategory, ...rest].slice(0, limit);
```
`rest` preserves declaration order. With 7 distinct categories across 8 posts (only "Buyer Guide" is shared), six posts deterministically surface the same first three entries. Posts at indices 4–7 are never selected. A rich-get-richer link sink.

**Fix.** Order `rest` by tag overlap with the current post, tie-broken by `dateISO` descending. Raises every post to ≥3 inbound links with no UI change.

### L-3 · HIGH · Six pages are internal-link dead ends
`/integrations` (261 lines, zero `href`), `/pricing` (external register links only), `/contact`, `/about` (192 lines, zero `href`), `/security` (`mailto:` only), `/changelog` (self-anchors only). `/pricing` is the highest-inbound page on the site (12 in-body sources) and passes nothing onward.

### L-4 · MEDIUM · Zero product-page → blog links
No page under `/features`, `/solutions`, `/pricing`, or `/integrations` links to any `/blog/*` URL, while 3 blog posts link *into* product pages. Strictly one-directional, so no topic clusters exist. Both Google's topical-authority model and AI retrieval reward reciprocal hub↔spoke structures.

### L-5 · MEDIUM · Legal cross-references are plain text
`src/lib/legal.ts` contains ~10 sentences naming sibling documents — *"maintained on our Subprocessors List page"*, *"see our Cookie Policy"*, *"available at oyechats.com/legal/dpa"* — rendered as plain text. `LegalDocument.tsx:26-33` has no inline-link parsing, though `src/lib/richtext.tsx` already implements exactly this for blog content.

**Fix.** Reuse `renderRichText` in `LegalDocument`, then wrap the existing phrases in `[…](/legal/…)` markers. **No new copy** — the sentences already name their destinations.

### L-6 · MEDIUM · `/docs` is a 375-line monolith covering four topics
Sections `#quick-start`, `#widget`, `#webhooks`, `#api` share one URL, one title, one canonical, one `TechArticle`, for four separately-searched intents. `/features:461` already links `/docs#webhooks`, treating the fragment as a destination — but a fragment cannot rank independently, carries no own title/meta, and **AI answer engines cite URLs, not fragments**, so a citation for the webhook payload resolves to a page whose first 200 lines are about installing a script tag.

**Recommendation: split** into `/docs` + `/docs/widget` + `/docs/webhooks` + `/docs/api`. Highest-leverage IA change: 1 rankable URL becomes 4.

### L-7 · MEDIUM · `/solutions` should split; `/features` should not
`/solutions`' four sections map onto four different buyer segments with different search intent. Each `SOLUTIONS` entry already carries `title`, `intro`, `body[]`, `bullets[]`, `outcome` — enough for `/solutions/[slug]` with `generateStaticParams`, the pattern already proven for `/blog/[slug]`. 1 URL becomes 5, zero new copy.

`/features` should **stay one page**: its six sections are facets of a single product argument, not independent reference topics, and the `SoftwareApplication` schema legitimately covers all six via `featureList`. Splitting would create six thin pages competing on the same brand+feature queries.

### L-8 · MEDIUM · Breadcrumbs
`BreadcrumbList` exists on `/blog` and `/blog/[slug]` but **no page has visible breadcrumb UI**. Google's guidelines require markup to reflect visible content. Conversely the `/legal/*` cluster — the one genuine 3-level hierarchy — has neither markup nor UI.

### L-9 · LOW · Anchor text and dead code
- `src/app/page.tsx:132-137` emits `See how it works →` **six times**, and three resolve to the same `#feature-rag` target. Fix by wrapping the whole card in the `<Link>` (the pattern already used in `BlogList.tsx:38-51` and `docs/page.tsx:123-137`), so the existing `<h3>{f.title}</h3>` becomes the anchor text automatically.
- `NAV_LINKS` in `src/lib/site.ts:20-26` is **dead code** — verified never imported — and diverges from the live navbar (says `Product → /features`; the navbar says `Features`). Any future audit reading the obvious constant gets a false picture.
- Navbar label "Resources" points at `/docs` — a weak anchor for that destination.

### Route/sitemap diff: clean
**Verified.** Routes missing from sitemap: **none**. Sitemap entries with no route: **none**. Blog and legal entries generate from the same arrays as the pages, so they cannot drift. Only the 12 hand-listed statics are a drift risk.

---

## 10. Next.js SEO Review

**Correct:** App Router with `metadataBase` and a title template; `pageMeta()` centralising per-page metadata; `generateMetadata` with awaited `params` (correct for Next 15+); `generateStaticParams` on both the blog route and its OG image route; metadata routes for sitemap/robots/manifest; file-convention `opengraph-image`; `next/font/google` with variable fonts, `display: swap`, selective preload; AVIF/WebP; server components with narrow client islands on 4 of 7 content routes; every route statically generatable.

**Defects:**
- **`pageMeta()` drops `images`** — the highest-impact Next-specific bug here (T-1). The mental model that a page-level `openGraph` merges with the parent's, and that a root `opengraph-image` backfills, is wrong on both counts.
- No `error.tsx` / `global-error.tsx` (P-11).
- No `redirects()` for apex → www (T-6).
- `experimental.optimizePackageImports` unset — low priority given tree-shaking works (P-3).
- Dead `remotePatterns` entry for `images.unsplash.com` — `grep -rn unsplash src/` returns nothing.
- Three routes use whole-page client boundaries where the codebase's own better pattern exists (P-8).

---

## 11. React Rendering Review

**Correct:** React 19.2.4 with `reactStrictMode`. Client components correctly SSR — no hydration-invisible content except the `NumberTicker` case. `FadeUp` is SSR-safe and bfcache-safe by construction. Default filter state renders full content. rAF-coalesced scroll handlers with passive listeners. Proper effect cleanup throughout, including `active` flags guarding post-unmount `setState` in `SystemStatus`.

**Defects:**
- **`NumberTicker`'s `useState(0)` is a true SSR/CSR content mismatch** (P-1) — the server renders a value that is not the data. The only place in the codebase where initial state is not the content, and it happens to be the price.
- `HeroDemo` ~200 state commits during the LCP window (P-6).
- `FadeUp` N forced layout reads at hydration (P-7).
- `ScrollSpyToc` forces layout per item per frame (P-5).
- `pill-tabs` imports full `motion`, defeating `LazyMotion` (P-4).
- No error boundaries (P-11).
- `react-hooks/set-state-in-effect` is downgraded to a warning in `eslint.config.mjs`, with a comment deferring it to "a dedicated animation refactor". A reasonable call — but P-1, P-6, and P-7 are all instances of the pattern it flags, so that refactor is now overdue.

---

## 12. Prioritized Action Plan

Effort: **S** ≤1h · **M** ≤1d · **L** multi-day. Impact scored separately for classic and AI search, since they diverge sharply here.

### CRITICAL

| ID | Finding | Effort | SEO | AI |
|---|---|---|---|---|
| P-1 | `/pricing` serves `$0`; contradicts Offer schema | S | ●●● | ●●● |
| T-1 | og:image missing on 18 routes | S | ●● | ●● |
| G-1 | `llms.txt` advertises removed plan | S | ○ | ●●● |
| P-2 | INR pricing absent from HTML | M | ●● | ●●● |
| S-1 | `sameAs: []` | S | ●● | ●●● |
| L-1 | `/legal` orphan | S | ●● | ● |
| T-2 | Money-page titles 15–24 chars | M | ●●● | ● |
| F-1 | Contact dropdown keyboard-inoperable | M | ○ | ○ |
| F-2 | Pricing ✓/✗ no text alternative | S | ○ | ● |

### HIGH

| ID | Finding | Effort | SEO | AI |
|---|---|---|---|---|
| A-2 | `/features` + `/solutions` zero `<h3>` | M | ● | ●●● |
| S-2 | No `@id` — disconnected entity graph | M | ●● | ●●● |
| S-3 | Duplicate `SoftwareApplication` | S | ●● | ●● |
| L-2 | 4 near-orphan posts | S | ●● | ●● |
| A-3 | Zero `<dl>`; definitions in div grids | M | ● | ●●● |
| F-3 | Mega menu hover-only (a11y + crawl) | M | ● | ● |
| F-5 | Focus indicator 2.23:1 | S | ○ | ○ |
| F-6 | `text-volt-fg` phantom class | S | ○ | ○ |
| F-7 | `--signal` fails AA | S | ○ | ○ |
| T-3 | No AI-crawler policy | S | ○ | ●● |
| G-2 | No `llms-full.txt` | M | ○ | ●●● |
| S-5 | `dateModified === datePublished` | S | ●● | ●● |
| S-6 | `TechArticle` no dates/publisher | S | ● | ●● |
| L-3/L-4 | 6 dead-end pages; no product→blog links | M | ●● | ●● |
| G-4 | No G2/Capterra/Crunchbase | L | ●● | ●●● |
| P-4 | `motion` defeats `LazyMotion` | M | ● | ○ |
| P-5 | `ScrollSpyToc` per-frame layout | M | ● | ○ |
| F-4 | Mobile drawer focus management | M | ○ | ○ |
| F-8 | No skip link | S | ○ | ○ |
| F-9 | Accordion `aria-hidden` (keep DOM text) | S | ○ | ○ |
| F-11 | Contact form no status announcement | S | ○ | ○ |

### MEDIUM

T-4 sitemap lastmod · T-5 openapi audit + caching · T-7 CSP · S-4 `Product` conflict · S-7 ItemList/CollectionPage/ContactPage/WebPage · S-8 JSON-LD escaping · L-5 legal cross-links · L-6 split `/docs` (L) · L-7 split `/solutions` (L) · L-8 breadcrumbs · F-12/13/14 heading semantics · F-15 tables/lists/`<time>`/autocomplete · P-6 HeroDemo commits · P-7 FadeUp layout reads · P-8 client boundaries · P-9 mobile CLS · P-11 error boundaries · A-5 last-updated stamps

### LOW

T-6 apex/www *(blocked on evidence)* · T-8 icon assets · P-3 simple-icons inline · P-10 footer logo priority · P-12 public/ caching · L-9 anchor text + `NAV_LINKS` dead code · G-3 discoverability · G-5 x.com · dead `remotePatterns` · dead `.border-beam` CSS · `Button` default `type` · Fraunces italic fallback

---

## 13. Implementation Roadmap

### Phase 0 — Evidence (blocking, ~1 hour)
1. The three `curl` checks in T-6.
2. Re-run `npm run build` locally; capture the route table and First Load JS.
3. GSC: Coverage, top 404s over 90 days, Core Web Vitals.
4. PSI field data for `/`, `/pricing`, `/features`.
5. Audit `public/openapi.json` before promoting it.

### Phase 1 — Critical fixes (1–2 days)
Independent, low-regression-risk, addressing every Critical finding.
1. P-1 — remove `NumberTicker` from the price *(first; it is the policy-risk item)*
2. T-1 — add `images` to `pageMeta()`
3. G-1 — correct `llms.txt`
4. S-1 — populate `sameAs` from a shared `SOCIAL_LINKS`
5. L-1 — add `/legal` to the footer
6. F-2, F-6 — pricing icon alternatives and the `text-white` fix
7. F-1 — replace the contact dropdown with a native `<select>`
8. T-2 — rewrite the 12 money-page titles; trim the 2 over-long descriptions

**Verify by grepping the compiled HTML**, not by assuming — see §15.

### Phase 2 — High-value improvements (3–5 days)
Depends on Phase 1's `pageMeta()` change.
1. S-2/S-3/S-4 — `buildGraph()` in `src/lib/seo.ts`; adopt `@id`; one `SoftwareApplication`; fold `Product` in
2. S-8 — `jsonLd()` escaping *(same pass; both touch all 15 sites)*
3. S-5/S-6 — `updatedISO` on `BlogPost`; complete `TechArticle`
4. L-2 — tag-overlap ordering in `getRelatedPosts`
5. L-3/L-4 — contextual links out of the 6 dead-end pages
6. F-3 — mega menu keyboard + unconditional render *(a11y and crawlability together)*
7. F-4, F-5, F-7, F-8, F-9, F-11 — the a11y cluster

### Phase 3 — Performance (3–4 days)
1. P-4 CSS-only `PillHighlight` · 2. P-5 `IntersectionObserver` · 3. P-6 ref-based typing · 4. P-7 shared observer · 5. P-11 error boundaries · 6. P-8 push client boundaries down · 7. P-9 mobile CLS · 8. P-2 server-side currency *(depends on P-8)*

### Phase 4 — AI search (2–3 days)
Depends on Phase 2's heading and schema work.
1. G-1 generated `llms.txt` · 2. G-2 `llms-full.txt` · 3. T-3 AI-crawler policy · 4. A-2 add `<h3>` · 5. A-3 element swaps · 6. A-5 last-updated + `<time>` · 7. G-3 discoverability · 8. T-5 publish the audited spec

### Phase 5 — Long-term (multi-week; needs product/marketing input)
1. L-6 split `/docs` · 2. L-7 split `/solutions` · 3. L-8 breadcrumbs sitewide · 4. G-4 claim G2/Capterra/Product Hunt · 5. S-5 name real authors *(business decision)* · 6. T-7 CSP · 7. Original benchmark data *(highest AEO ceiling)* · 8. T-6 legacy redirect map once GSC data is in

---

## 14. File-by-File Recommendations

| File | Line | Issue | Recommendation |
|---|---|---|---|
| `src/lib/seo.ts` | 19-37 | No `images`; comment at 6-8 is false | Add `images: ['/opengraph-image']` to `openGraph` + `twitter`; delete comment; add `jsonLd()` and `buildGraph()` helpers here |
| `src/components/ds/NumberTicker.tsx` | 23 | `useState(0)` renders `$0` server-side | Remove from the price path, or `useState(() => value)` with post-mount replay |
| `src/app/pricing/PricingClient.tsx` | 172-177 | Price via `NumberTicker` | `formatPrice(price, currency)` directly |
| ” | 118,127 | `text-volt-fg` matches no CSS → 3.47:1 | `text-white` |
| ” | 38-43 | Icon-only ✓/✗ | `aria-hidden` + `sr-only` text |
| ” | 60-69 | Client-only INR switch | Server-resolve from `x-vercel-ip-country`; render both currencies |
| ” | 92-131 | Toggles no `aria-pressed`, no group label | `role="group"` + `aria-pressed` |
| ” | 315 | Feature-name cell is `<Td>` | `<Th scope="row">` |
| `src/app/pricing/page.tsx` | 34-54 | 3rd commercial entity; `lowPrice: "0"` | Fold into `#software`; add `availability`; both currencies |
| `src/app/layout.tsx` | 82 | `sameAs: []` | Populate from shared `SOCIAL_LINKS` |
| ” | 73-90 | `@graph` with no `@id` | Adopt `#organization`/`#website`/`#logo`; add `contactPoint`, `PostalAddress` (locality + country only) |
| ” | 101 | No `<main>` id, no skip link | `<main id="main" tabIndex={-1}>` + skip link |
| `public/llms.txt` | 11, 26 | Enterprise plan does not exist | Correct now; replace with `src/app/llms.txt/route.ts` |
| `src/lib/site.ts` | 20-26 | `NAV_LINKS` dead + divergent | Delete, or have `Navbar` consume it |
| ” | 56-67 | Legal column omits `/legal` | Add `{ label: 'Legal', href: '/legal' }` |
| `src/lib/blog.ts` | 415-422 | `rest` uses array order | Order by tag overlap, then `dateISO` desc |
| ” | 12-28 | No `updatedISO` | Add optional field, fall back to `dateISO` |
| ” | 163 | Literal `</script>` in content | Safe today; makes `jsonLd()` mandatory before any `articleBody` |
| `src/app/blog/[slug]/page.tsx` | 76-77 | `dateModified === datePublished` | `updatedISO ?? dateISO` |
| ” | 88 | `author` is Organization | Business decision — do not fabricate a Person |
| `src/components/site/Navbar.tsx` | 96,107 | Hover-only, conditionally rendered menu | `<button>` + always render + CSS/`inert`, mirroring `:153-161` |
| ” | 92 | `<nav>` unlabelled | `aria-label="Primary"` |
| ” | 135-183 | No focus trap/restore/Escape | Focus first link, `inert` siblings, Escape handler |
| `src/components/site/Footer.tsx` | 74 | `<h4>` creates sitewide h2→h4 skip | Non-heading `<div>`; wrap in `<nav aria-label="Footer">` |
| ” | 9-13 | `SOCIAL_LINKS` local; legacy `twitter.com` | Move to `site.ts`; use `x.com` |
| `src/components/ds/Accordion.tsx` | 50-59 | Collapsed text in a11y tree | `inert` + `aria-hidden` — **keep text in the DOM** |
| ” | 41 | Questions are `<span>` | Optional `headingLevel`; wrap button in a heading |
| `src/components/site/ScrollSpyToc.tsx` | 39-61 | Per-frame layout thrash | `IntersectionObserver`; cache elements + `scrollHeight` |
| ” | 104-129 | Not a `<nav>` | `<nav aria-label>` |
| `src/components/site/pill-tabs.tsx` | 4,53-58 | Full `motion` defeats `LazyMotion` | CSS-only sliding indicator |
| `src/components/site/HeroDemo.tsx` | 141-165 | ~200 commits in the LCP window | Ref + `textContent`; gate on `requestIdleCallback` |
| ” | 251 | Mobile `min-h` allows growth | Fixed height on mobile |
| `src/components/ui/FadeUp.tsx` | 88-102 | N forced layout reads | Shared module-scope observer |
| `src/components/site/Logo.tsx` | 37 | `priority` hardcoded, incl. footer | `priority?: boolean` defaulting false |
| `src/components/site/BlogList.tsx` | 73-93 | `role="tablist"` without the pattern | `aria-pressed` + `role="group"` |
| ” | 66-68,111 | h1→h3 skip when filtered | Always render a grid heading |
| `src/app/features/page.tsx` | throughout | Zero `<h3>`; no `<dl>`/`<ol>` | Heading-styled divs → `<h3>`; webhook events → `<dl>`; RAG steps → `<ol>` |
| `src/app/solutions/page.tsx` | throughout | Zero `<h3>` | Same |
| `src/app/security/page.tsx` | 171 | `<h3>` styled and functioning as h2 | `<h2>` |
| `src/app/docs/page.tsx` | 25-36 | `TechArticle` no dates/publisher/image | Add all; wire dates to a real constant |
| ” | 133,356 | Heading-styled `<p>`/`<div>` | `<h3>` / `<h2>` |
| ” | 333 | 486 KB spec, uncached, unaudited | Audit; then cache + list in `llms.txt` |
| `src/app/integrations/page.tsx` | 22-27 | `ItemList` invalid | Nest `item` as `SoftwareApplication`; add `numberOfItems` |
| `src/app/integrations/IntegrationsClient.tsx` | 101-106 | Search input unlabelled | `aria-label` + `type="search"` + live count |
| ” | 155 | Heading-styled `<div>` | `<h3>` |
| `src/app/contact/ContactClient.tsx` | 150-194 | Keyboard-inoperable dropdown | Native `<select>` |
| ” | 116,127,142 | No `autocomplete` | `name` / `email` / `organization` |
| ” | 209-215 | No status announcement; not disabled | `role="alert"`, `aria-busy`, `disabled={loading}` |
| `src/app/contact/page.tsx` | 21-26 | `mainEntity` is a `ContactPoint` | Point at `#organization` |
| `src/app/blog/page.tsx` | 16-23 | `CollectionPage` enumerates nothing | Add `mainEntity` `ItemList` of 8 posts |
| `src/lib/legal.ts` | 23,57,92,143,167,182,205,262,342,398 | ~10 plain-text cross-references | Wrap existing phrases in `[…](/legal/…)` |
| `src/components/site/LegalDocument.tsx` | 26-33 | No inline link parsing | Use `renderRichText` |
| `src/app/robots.ts` | 3-8 | No AI policy, no `host`, `/api/` crawlable | Explicit allow/disallow; `disallow: /api/`; add `host` |
| `src/app/sitemap.ts` | 8,11-24 | Stale flat `lastModified`; hand-listed statics | Tier by change frequency; derive `/changelog` from `CHANGELOG[0]` |
| `src/app/manifest.ts` | 14-15 | Declared sizes ≠ actual; maskable lacks safe zone | Correct sizes; real maskable icon |
| `src/app/icon.png`, `apple-icon.png` | — | 242 KB each at 512×512 | Recompress; add `favicon.ico` |
| `next.config.ts` | 19 | Dead `unsplash` remotePattern | Remove |
| ” | 22-40 | No CSP/`Permissions-Policy`; no `public/` caching | Add; keep `/(.*)` free of `Cache-Control` |
| ” | — | No `redirects()` | Add apex→www **after** the `curl` check |
| `src/app/globals.css` | 248-252 | Focus 2.23:1, forced-colors invisible, clipped | `outline: 3px solid var(--volt-2); outline-offset: 2px` |
| ” | 35 | `--signal` fails AA | Darken to ≈`#0B7A45`; keep original as `--signal-graphic` |
| ” | 75-80 | No `--color-volt-fg` | Add it, or use `text-white` at the call sites |
| ” | 356-361,370-393 | `will-change` on unrendered marquee; dead `.border-beam` | Remove both |
| `src/lib/pricing.ts` | 1-9 | Docstring claims server-side currency | Correct the comment (or make it true) |
| `src/lib/integrations.tsx` | 2-12 | 5 MB barrel (build cost only) | Inline the 8 paths during cleanup |
| `src/app/api/contact/route.ts` | 121,135 | Emits apex URLs | Use `www` |
| — | — | No `error.tsx` / `global-error.tsx` | Add both |

---

## 15. Implementation Plan — execution order and dependencies

**Grouping principle:** batch changes touching the same file so each is reviewed once, and order so no change invalidates a later one.

```
Phase 0 (evidence) ──────────────┐
                                 ├──► T-6 apex/www      [BLOCKED until curl + GSC]
                                 └──► T-5 openapi       [BLOCKED until content audit]

Group A · src/lib/seo.ts         → T-1 images · jsonLd() · buildGraph() · T-2 titles
   └─► Group B · all 15 schema sites  [DEPENDS ON A]
         → S-2 @id · S-3 dedupe · S-4 Product · S-6 TechArticle · S-7 · S-8

Group C · pricing               → P-1 $0 · F-2 icons · F-6 contrast · S-4
   └─► P-2 INR                  [DEPENDS ON C and on P-8's refactor]

Group D · navigation            → F-3 mega menu · F-4 drawer · F-12 footer h4 · L-1 /legal
                                  (F-3 fixes a11y AND crawlability in one change)

Group E · globals.css           → F-5 focus · F-7 signal · dead CSS
                                  (one file, one review, no dependencies)

Group F · content data          → L-2 related posts · S-5 updatedISO · L-5 legal links
                                  (src/lib only, zero UI risk)

Group G · headings & semantics  → A-2 h3 · A-3 dl/ol/table · F-13 · F-14 · F-15
   └─► G-2 llms-full.txt        [BENEFITS FROM G — better chunk boundaries]

Group H · performance           → P-4 · P-5 · P-6 · P-7 · P-11
   └─► P-8 client boundaries    [DO LAST in group — largest diff]

Group I · GEO assets            → G-1 generated llms.txt · T-3 robots · G-3 links
                                  [DEPENDS ON F for generated content]

Phase 5 (route splits)          → L-6 /docs · L-7 /solutions · L-8 breadcrumbs
                                  [DO LAST — invalidates sitemap, llms.txt, internal links]
```

**Hard dependencies:**
- Group B **must** follow A — the helpers are what the 15 sites migrate onto. Doing B first means touching all 15 files twice.
- P-2 **must** follow P-8's `/pricing` refactor — server-side currency requires `page.tsx` to own it.
- Group I **must** follow F — a generated `llms.txt` reads from the corrected data modules.
- Phase 5 **must** be last. Splitting `/docs` and `/solutions` changes the route inventory, invalidating `sitemap.ts`, `llms.txt`, and every internal link built in D and F.

**Regression-risk ranking (lowest first):** E (one CSS file) → F (data only) → A (one helper) → B (mechanical, schema-only) → G (tag swaps, no copy, no layout) → C (small, high-value) → D (interaction logic) → H (rendering behaviour) → Phase 5 (architectural).

### Verification gate — the durable fix for this whole class of bug

After every group: `npm run lint`, `npx tsc --noEmit`, `npm run build` — **then grep the compiled HTML** for the specific string the change was meant to produce.

The three most severe findings in this audit (missing og:image, `$0` prices, a phantom CSS class) **all passed lint, typecheck, and build.** Only reading the output catches them.

```bash
grep -c 'property="og:image"' .next/server/app/pricing.html        # expect 1
grep -c 'tabular-nums">\$<!-- -->0' .next/server/app/pricing.html  # expect 0
grep -l 'href="/legal"' .next/server/app/*.html                    # expect ≥1
grep -c '<h3' .next/server/app/features.html                       # expect >0
grep -rl 'volt-fg' .next/static/css/                               # expect a match
```

Commit these as a CI smoke test.

---

## 16. Final Scorecard

Scores reflect the code as it ships today. Where field data is absent, the score is provisional and the missing evidence is named.

| Dimension | Score | Basis |
|---|---:|---|
| Technical SEO | **68** | Static SSG, canonicals everywhere, clean sitemap diff, trailing-slash 308. Lost on og:image, stale lastmod, unverified apex/www, no AI policy. |
| On-page SEO | **55** | One h1 per page, strong blog metadata. Lost on 15–24-char money titles, zero h3 on two key pages, 2 over-long descriptions. |
| Crawlability | **84** | All static, real anchors, no JS-gated content except the mega menu. |
| Indexability | **80** | All indexable, correct canonicals, no accidental noindex. `/legal` orphan is the deduction. |
| Metadata | **48** | og:image on 9 of 27; 404 inherits homepage metadata; no `twitter:site`; no hreflang. |
| Schema | **58** | Broad coverage, all valid JSON, FAQ visibility-compliant. Lost on zero `@id`, duplicate SoftwareApplication, empty `sameAs`, invalid ItemList, 10 routes with no page-level schema. |
| Performance | **72** *(provisional)* | Excellent widget deferral, all-static, SVG-only imagery, 1.0 MB total JS. Lost on `motion` leak, per-frame layout, ~200 HeroDemo commits. **Needs Lighthouse + CrUX.** |
| Accessibility | **52** | Strong foundations (inert drawer, 44px targets, reduced motion, real buttons). Two Level A keyboard failures, 2.23:1 focus ring, 113 unlabelled icons, `--signal` fails AA. |
| Core Web Vitals | **—** | **Cannot score. No field data.** Code-level risks: `$0`→`$9`→`₹449` shift, mobile CLS in `HeroDemo`, hydration layout thrash. Requires CrUX + GSC. |
| Internal Linking | **48** | Orphaned hub, 4 single-inbound posts, 6 dead-end pages, zero product→blog links. Legal sibling rail and blog related-posts are the bright spots. |
| AEO Readiness | **58** | Accordions in DOM, answer-first blog structure, real tables on `/docs` and `/pricing`. Lost on zero h3 across two key pages, zero `<dl>`, invisible INR. |
| GEO Readiness | **45** | `llms.txt` exists and is well-formed — but factually wrong. No `llms-full.txt`, no AI policy, undiscoverable assets. |
| AI Discoverability | **55** | Fully static HTML is ideal for non-JS crawlers; undermined by wrong `llms.txt` and the `$0`/INR gaps. |
| Entity Optimization | **32** | `sameAs` empty, no G2/Capterra/Crunchbase/Wikidata, no consolidated entity. |
| Knowledge Graph Readiness | **30** | No `@id`, five disconnected Organizations, no `contactPoint`, no `address`. |
| Citation Readiness | **45** | Visible dates, bylines, real outbound citations to primaries. Lost on no `dateModified`, "AI Team" bylines, no original data. |
| Trust Signals | **60** | Excellent legal suite, security page, live status. No reviews, no named humans, no address, no certifications. |
| E-E-A-T | **42** | Experience/Expertise asserted but unattributable. "AI Team" byline is a net negative. `/about` promises a team it does not show. |
| Next.js SEO | **70** | Idiomatic Metadata API, correct `generateStaticParams`, good font strategy. Lost on the `pageMeta` images bug and missing error boundaries. |
| React SEO | **65** | Client components SSR correctly; sophisticated bfcache handling. Lost on the one true SSR/CSR content mismatch — which happens to be the price. |

### Headline scores

| | Score | Reading |
|---|---:|---|
| **Overall SEO** | **62 / 100** | Strong foundations, systematically broken metadata layer. Most of the gap closes in Phases 1–2. |
| **Overall AI Search Readiness** | **48 / 100** | The infrastructure is right (static HTML, structured content); the *facts* being served are wrong. Highest-leverage area. |
| **Production Readiness** | **70 / 100** | Ships and performs well. Two WCAG Level A failures and one structured-data policy risk should gate the next release. |

**Why AI readiness scores lower than SEO despite better fundamentals:** Google renders JavaScript and will eventually see the correct prices; AI crawlers largely do not. So `$0`, missing INR, and a wrong `llms.txt` cost roughly double in AI surfaces. Conversely, the fully-static architecture means the AI score can climb faster than the SEO score once the facts are corrected — the hard part (server-rendered HTML) is already done.

---

## 17. Optional Future Content Improvements (Out of Scope)

Opportunities only, per the engagement constraint. **No rewritten copy is proposed and none should be inferred.** Each requires a content decision.

1. **Named authors with real bios.** The highest-impact E-E-A-T change available. Currently blocked — no real names exist in the repo, and fabricating them would be schema spam.
2. **A team section on `/about`.** Its own meta description promises "Meet the team"; the page has none.
3. **Original benchmark data.** Median BANT scores across N conversations, RAG answer accuracy, time-to-first-response. The highest-ceiling AEO investment: proprietary data is what AI engines cite and competitors cannot copy.
4. **Real testimonials or reviews.** Currently zero. Until these exist on-page, the Software App rich result is unattainable and `aggregateRating` must not be added.
5. **G2 / Capterra / Product Hunt listings.** Business action. The primary source AI engines cite for "best X" comparisons.
6. **FAQ blocks for the 5 posts without them**, several of which already have question-phrased h2s in the body.
7. **Registered entity details** — legal name, address, founding date — which would unlock a materially richer `Organization` node.
8. **Per-integration detail pages**, making the `ItemList` a summary-page list with real URLs.
9. **A first-party site search**, which would make `SearchAction` legitimate. *(Do **not** add `SearchAction` before this exists — the target URL would 404, and Google deprecated the sitelinks-searchbox rich result in November 2024 anyway.)*

---

## Appendix A — What could not be verified from the repository

| Question | Evidence needed |
|---|---|
| Does apex redirect to www? | `curl -sI https://oyechats.com/` |
| Trailing-slash and case behaviour in production | `curl -sI` on `/pricing/` and `/Pricing` |
| Real Core Web Vitals | CrUX / PSI field data; GSC CWV report |
| Per-route First Load JS | A successful `npm run build` outside this environment |
| Existing indexation and duplicate-canonical states | GSC Coverage report |
| Legacy 404s needing redirects | GSC / server logs, 90 days |
| Whether `openapi.json` exposes internal endpoints | Manual review of the 486 KB file |
| Founding date, legal entity, address, phone | Business — **not in the repo, must not be invented** |
| Relationship between the `digibranders` GitHub org and OyeChats | Business |
| Whether any real reviews or testimonials exist | Business |

---

## Appendix B — Corrections made to specialist findings

Three claims were revised after checking them against build output. Recorded so the reasoning is auditable.

1. **`simple-icons` bundle impact.** Reported HIGH ("catastrophic for First Load JS"). Testing the compiled client chunks showed all 8 used brands present and zero unrelated brands leaked — Turbopack tree-shakes the 5 MB barrel correctly. **Downgraded to LOW**; the real cost is build time, not bundle size.
2. **Duplicate logo preload.** Reported as two `<link rel="preload" as="image">` tags arising from differing widths. The compiled HTML contains exactly one — both call sites round to the same `w=64` bucket and Next deduplicates. **Downgraded to LOW**; the residual issue is only that the footer instance loads eagerly.
3. **`h2 → h4` skip attributed to `/features`.** The `<h4>`s come from the footer and appear on all pages, making this a sitewide issue with `/features` and `/solutions` as the worst cases. **Reframed**, and the fix moved to `Footer.tsx`.

A fourth item is worth recording as a self-correction: an initial `grep -c` of `application/ld+json` suggested JSON-LD blocks were being dropped. That was an artifact of counting *lines* in minified HTML. Extracting and parsing every block confirmed **all 15 render correctly**. No finding was raised.
