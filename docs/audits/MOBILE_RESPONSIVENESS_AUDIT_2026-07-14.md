# Mobile Responsiveness Audit — OyeChats Website

**Date:** 2026-07-14
**Auditor role:** Senior UI/UX Engineer
**Stack:** Next.js 16.2 · React 19 · Tailwind CSS v4 (Voltage Paper design system)
**Method:** Static analysis of every page + shared component (exact Tailwind classes),
plus runtime CSS inspection on a live dev build (`localhost:3002`).
**Target viewports:** 360px (small Android), 390px (iPhone 12–15), 414–430px (large phones).

> **Environment note:** the browser MCP window would not constrain the content viewport
> below the host display width (`innerWidth` stayed 1720px), so true device-viewport
> screenshots weren't possible. Findings are therefore based on the **actual responsive
> classes in source** plus **runtime computed-CSS probes** (which don't depend on viewport
> width). Every finding below cites the exact `file:line` and class string so each is
> independently verifiable. Where a claim needed runtime proof (table min-width, tap-target
> heights) it was measured live and is marked **[measured]**.

---

## Executive summary

The site is **fundamentally mobile-sound**: mobile-first Tailwind is used correctly, the
**hamburger nav works** (state, drawer, body-scroll lock, escape-the-blur containing block —
all correct), decorative glow/marquee layers are contained in `overflow-hidden` parents, and
there is **no horizontal document overflow** at any width. This is well above average.

The problems are concentrated in two systemic areas plus a handful of page-level issues:

| # | Issue | Severity | Blast radius |
|---|-------|----------|--------------|
| 1 | Comparison/pricing tables **crush instead of scroll** (`<table>` has no `min-width`) | **P0** (pricing readability) | Pricing, Features |
| 2 | **Tap targets < 44px** — systemic, root-caused in `Button` size map | **P1** | Every page |
| 3 | HeroDemo chat pane `h-[360px] overflow-hidden` **clips** wrapped bubbles | **P1** | Home hero |
| 4 | Oversized **base vertical spacing** (dead scroll on phones) | **P2** | Home, Features, Solutions |
| 5 | BANT section renders **demo above its heading** on mobile | **P2** | Features |
| 6 | Drawer links **tabbable while hidden** (a11y) | **P2** | Global nav |
| 7 | Assorted overflow/wrap/cramping risks | **P2** | Solutions, Integrations, Security, FinalCTA |

No code was changed — this is an audit. Recommended fixes are listed with each item.

---

## P0 — Comparison tables crush instead of scroll  **[measured]**

**Where:** `src/components/ds/Table.tsx:12` (the shared `<table>`), consumed by the pricing
feature-comparison table at `src/app/pricing/PricingClient.tsx:230-251` and feature tables.

**Runtime evidence:** the wrapper (`Table.tsx:8`) correctly resolves to `overflow-x: auto`
(so horizontal scroll *is* available), **but the inner `<table className="w-full">` computes
`min-width: 0px`.** With `w-full` + `border-collapse` and no floor, on a ≤430px viewport the
5-column table (Feature / Free / Starter / Standard / Enterprise) shrinks to fit the container
and **crushes each column to ~60px, wrapping headers mid-word** — instead of triggering the
horizontal scroll the wrapper is ready to provide. This is the single worst readability break
on mobile, and it hits the **pricing page**, the highest-intent page on the site.

**Fix (one line, fixes every table):**
```tsx
// Table.tsx:12
<table className="w-full min-w-[640px] border-collapse text-left">{children}</table>
```
Optionally add `whitespace-nowrap` to the tier header cells (`Th`, line 19). Consider also
splitting the rounded frame from the scroll container so the `overflow-hidden` (rounding) and
`overflow-x-auto` (scroll) aren't fighting on one element — today they resolve correctly to
`auto hidden`, but it's fragile:
```tsx
<div className="border border-line rounded-[var(--r-3)] overflow-hidden bg-canvas">
  <div className="overflow-x-auto">
    <table className="w-full min-w-[640px] border-collapse text-left">{children}</table>
  </div>
</div>
```

---

## P1 — Tap targets below 44px (systemic — single root cause)  **[measured]**

WCAG 2.5.5 / 2.5.8 and the iOS/Android minimum is 44px. **35 interactive elements measured
under 44px on the pricing page alone.** The root cause is the shared button size map:

**Root cause:** `src/components/ds/Button.tsx:31-35`
```
sm: 'text-[13px] px-3.5 py-2',   // ≈ 29–33px tall  ← under 44
md: 'text-sm px-5 py-3',         // ≈ 40px tall     ← under 44
lg: 'text-[15px] px-6 py-4',     // ≈ 48px          ✓ ok
```
Because `sm` and `md` are used for most CTAs, the whole site inherits sub-44px targets.

**Fix (cascades everywhere):** add a min-height floor to the size map:
```tsx
sm: 'text-[13px] px-3.5 py-2 min-h-9',        // 36px — acceptable for dense/desktop
md: 'text-sm px-5 py-3 min-h-11',             // 44px ✓
lg: 'text-[15px] px-6 py-4 min-h-12',
```
(or gate the floor on mobile: `min-h-11 md:min-h-0`).

**Specific offenders confirmed** (fix the root cause above, then spot-fix the custom controls):

| Element | File:line | Measured / class | Fix |
|---|---|---|---|
| Pricing monthly/annual toggle | `PricingClient.tsx:58-76` | **33px** `px-4 py-1.5 text-[13px]` | `py-2.5 min-h-11` |
| Hamburger button | `Navbar.tsx:176-183` | `p-2` + 20px icon ≈ 36px | `p-2.5 min-h-11 min-w-11` |
| Mobile header "Start free" | `Navbar.tsx:171-175` (`size="sm"`) | ≈ 29px | `size="md"` |
| Integration filter chips | `IntegrationsClient.tsx:101-113` | `py-1.5` ≈ 30px | `py-2 min-h-10` |
| Contact custom-select trigger + options | `ContactClient.tsx:206-219`, `:234` | ≈ 40px | `py-3` / `min-h-11` |
| Form inputs / textarea | `Input.tsx:5` (`py-2.5`) | ≈ 40px | `py-3` in base |
| Hero suggested-question chips | `HeroDemo.tsx:299` (`py-1.5`) | ≈ 26–28px | `py-2.5 min-h-11` |
| Feature-card inline "→" links | `page.tsx:119, 276` | ~18px text link | `inline-flex min-h-11 items-center py-2` |
| Footer links | `Footer.tsx` link grid | **14px** [measured] | add `py-1.5` / row min-height |

---

## P1 — HeroDemo chat pane clips content on narrow screens

**Where:** `src/components/site/HeroDemo.tsx:248`
```
className="p-4 flex flex-col gap-3 h-[360px] overflow-hidden"
```
The conversation area is locked to a fixed `h-[360px]` with `overflow-hidden`. At ≤430px the
answer bubbles wrap to many more lines (the "Grounded RAG?" answer is ~200 chars, plus the
italic context line and the score row). The extra wrapped height exceeds 360px and is
**silently clipped** — the routed/BANT state at the bottom of the demo can disappear, which is
exactly the payoff the hero demo is meant to show.

**Fix:** let the pane grow on mobile — `min-h-[360px]` (or `h-auto sm:h-[360px]`) so content
expands instead of being cut off. If a fixed frame is required, make the inner list
`overflow-y-auto` rather than `overflow-hidden`.

---

## P2 — Oversized base vertical spacing (dead scroll on phones)

Base (mobile) padding is larger than it needs to be in several places, adding long empty
stretches on small screens. All are one-token fixes: add a smaller base and keep the `md:` value.

| File:line | Current | Suggested |
|---|---|---|
| `app/page.tsx:58` (hero) | `pt-12 pb-32 md:pt-32 md:pb-40` | `pb-16 md:pb-40` |
| `app/page.tsx:59` (hero grid gap) | `gap-16` (64px, single-col until `lg`) | `gap-8 lg:gap-16` |
| `app/features/page.tsx:127,179,244,305,386,467` | `py-24 md:py-32` | `py-16 md:py-32` |
| `app/solutions/page.tsx:127` | `py-20 md:py-28` | `py-14 md:py-28` |

> The shared `Section` component (`Section.tsx:39`, `py-16 md:py-32`) and `Container`
> (`px-6 md:px-12`) are already sensible — these are page-level overrides that drifted larger.

---

## P2 — Source-order and wrap issues on mobile

1. **BANT section: demo before heading** — `features/page.tsx:181` uses
   `grid lg:grid-cols-[1fr_1.1fr]`; the score ring + criteria block (`:182`) precedes the
   "BANT Scoring" heading/copy (`:209`) in source. Until `lg`, mobile users see the visual
   before any explanation. **Fix:** reorder source, or `order-` utilities so copy leads on mobile.

2. **Solutions outcome metric — non-wrapping row** — `solutions/page.tsx:161-166`,
   `inline-flex items-center gap-4 ... px-5 py-4` with the metric (`:163`) marked
   `whitespace-nowrap` and no `flex-wrap`. A long `outcome.metric` can push past a 430px
   viewport. **Fix:** add `flex-wrap` / `max-w-full`.

3. **Webhook flow diagram** — `IntegrationsClient.tsx:168` + `FlowArrow` (`:222-236`).
   `flex-wrap` prevents overflow (good), but wrapped `flex-1` arrows land alone on a row and
   stretch full-width, breaking the left→right flow metaphor. **Fix:** `flex-col md:flex-row`
   with vertical connectors, or hide arrows below `sm`.

4. **FinalCTA activity feed** — `FinalCTA.tsx:196`, `grid grid-cols-[auto_1fr_auto_auto] gap-3`
   inside `p-6`. On 360–375px the four columns (time · domain · score · route label) are very
   tight; domain relies on `truncate`. **Fix:** `p-4 md:p-6`, or hide the route-label column
   below `sm`, or 2-line layout on mobile.

5. **Security infra card missing `min-w-0`** — `security/page.tsx:176`: the text side of a
   `flex gap-3` card with a `shrink-0` icon lacks `min-w-0` (the sibling Highlights card at
   `:128` has it). Latent overflow risk / inconsistency. **Fix:** add `min-w-0`.

---

## P2 — Accessibility on mobile nav

**Drawer links tabbable while hidden** — `Navbar.tsx:193-209`. The closed drawer uses
`opacity-0 pointer-events-none` but stays in the DOM at full size, so its links remain in the
keyboard tab order (`pointer-events` doesn't remove focusability). Keyboard/screen-reader
users tab into invisible off-screen nav links. **Fix:** add `hidden`/`inert` (or
`visibility:hidden`, or conditionally render) when `!open`.

---

## Verified sound (no action needed)

- **Mobile hamburger nav** — state + toggle (`Navbar.tsx:101,176`), desktop nav hidden
  `hidden lg:flex` (`:133,157`), drawer `fixed inset-x-0 top-16 bottom-0` rendered outside
  `<header>` to escape the backdrop-blur containing block, body-scroll lock (`:111-117`),
  links close on tap (`:204`). Correct and thoughtful.
- **No horizontal document overflow** at desktop or narrow widths — decorative `HeroGlow`,
  `DottedGrid`, `volt-aurora`, footer giant wordmark (`clamp(9rem,20vw,18rem)`) and marquees
  are all contained by `overflow-hidden` parents.
- **Grids collapse correctly** — home bento, story steps, pricing cards, footer link grid
  (`grid-cols-2 md:grid-cols-4`), LogoCloud (`grid-cols-2 sm:grid-cols-3 md:grid-cols-6`),
  security grids, contact name/email pair — all default to 1–2 cols and add columns at `md:`/`lg:`.
- **Scroll containers** — webhook JSON `<pre>`, integration filter row, ScrollSpyToc pills all
  use `overflow-x-auto` correctly.
- **Type scale** — `type-display-*` uses `clamp()` with a `@media(max-width:640px)` override
  (`globals.css:419-423`); no hard-set oversized H1/H2 at base.
- **`prefers-reduced-motion`** honored globally (`globals.css:429-436`).

---

## Recommended fix order

1. **`Table.tsx` `min-w-[640px]`** — one line, fixes the only P0 (pricing readability). *(5 min)*
2. **`Button.tsx` size-map `min-h`** — one change, lifts most tap targets to 44px sitewide. *(10 min)*
3. **`HeroDemo.tsx` `min-h` instead of `h-[360px]`** — stops hero-demo clipping. *(5 min)*
4. Spot-fix the non-Button controls in the P1 table (toggle, chips, custom select, inputs, hamburger).
5. P2 spacing trims and source-order / wrap fixes as polish.

After changes, run the standard gate before shipping: `npm run lint` · `npx tsc --noEmit` ·
`npm run build`, then re-verify the pricing table and hero demo at 375px.
