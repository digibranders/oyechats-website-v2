---
target: oyechats-website
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 4
timestamp: 2026-08-13T14-05-07Z
slug: src-app-page-tsx
---
# Critique — OyeChats marketing site

Method: dual-agent (A: design review · B: detector + browser evidence), both isolated. All P0/P1 claims independently verified by the orchestrator.

## Design Health Score: 25/40 (Acceptable)

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | SystemStatus exemplary; nothing states which currency is shown or why |
| 2 | Match System / Real World | 3 | BANT glossed; StatBand answers with spec integers where a payoff belongs |
| 3 | User Control and Freedom | 2 | No currency override; hero auto-advances ~30s, no pause (WCAG 2.2.2 A) |
| 4 | Consistency and Standards | 2 | "Recommended" vs "Most Popular" same tier; blog covers 5-hue off-system palette |
| 5 | Error Prevention | 2 | Pricing sells three capabilities the product lacks |
| 6 | Recognition Rather Than Recall | 2 | 640px comparison tables in 325px scrollers, no sticky row label |
| 7 | Flexibility and Efficiency | 2 | Comparison pages built for the evaluation path are unreachable |
| 8 | Aesthetic and Minimalist | 3 | Restrained; homepage duplicates all four pricing tiers at partial fidelity |
| 9 | Error Recovery | 3 | error.tsx / not-found.tsx on-brand with a route out |
| 10 | Help and Documentation | 3 | Complete diligence surface; hero secondary CTA sends non-engineers to docs |
| **Total** | | **25/40** | Acceptable |

Heuristics 7 and 10 scored rather than n/a: real docs exist and the buyer is explicitly comparison-shopping.

## Design Specificity Verdict

One outstanding screen, five pages of template. HeroDemo (typed question -> streamed answer -> BANT ring to 87 -> routed to sales) could only belong to this product. BantScoreRing, ChatBubble, TerminalCard are a real signature vocabulary. But /features, /pricing, /compare, /blog all open with the identical centered headline + one gradient word + HeroGlow + DottedGrid. README names the four signature components as THE hero; they appear on one page.

Deterministic scan: 4 findings, all in globals.css, zero in components. gradient-text :350 and :358 genuine. side-tab :506 false positive (.prose blockquote). codex-grid-background :318 false positive (6%-alpha radial dot field, not hairline grid).

Contrast: 197-304 elements checked per page across 6 pages, ZERO failures. Tightest passing pair --muted on --paper = 4.62:1.

## What's Working

1. SystemStatus is the brand argument made structural — pill only greens when /api/status reports healthy; falsifiable by any visitor. This is the answer to the open evidence question in PRODUCT.md.
2. Accessibility baseline genuinely earned: zero contrast failures, thoughtful focus rings with forced-colors fallback, zero horizontal overflow at 375px, one h1 per page with no skipped levels, global reduced-motion.
3. Type system holds across seven page types including 8,000px legal documents.

## Priority Issues

### [P0] Three hard product boundaries sold as paid features
pricing.ts:143, :232, :260 sell "MEDDIC / CHAMP / custom frameworks". pricing.ts:124, :235 sell "Webhooks + REST API + CLI". pricing.ts:76, :224 and compare.ts:363, 409, 428 claim answers are "cited". PRODUCT.md lists all three as hard boundaries and explicitly says the citation claim was already corrected once and must not return.
ALSO: legal.ts:53 and :107 reference MEDDIC inside the privacy policy and DPA — describing processing the product does not perform.
Fix: strike MEDDIC bullet + comparison row, swap Professional's differentiator for something shipping (white-label domain, audit logs, 1-year retention); strike "+ CLI"; "cited" -> "grounded"; correct both legal strings; add all five strings to the verify:html gate.
Command: /impeccable clarify src/lib

### [P1] Signature accent renders as a rendering bug on every page
.gradient-volt = linear-gradient(120deg, var(--ink) 30%, var(--volt) 100%) — first ~40% of each accent word paints as plain ink. Live: "buyers", "pricing", "compares", "converts" all half-black. /features additionally uses a two-word span (README rule 3 violation) and inline-block orphans the trailing period at 1280px. No forced-colors fallback: accent word vanishes in Windows High Contrast.
Fix: start gradient at var(--volt); single word on /features; add forced-colors fallback.
Command: /impeccable polish src/app/globals.css

### [P1] Seven competitor comparison pages unreachable
/compare and all seven /compare/oyechats-vs-* have zero inbound links from nav, footer, or site.ts — AND are absent from sitemap.ts (sitemap.xml contains zero matches). Not navigable, not crawlable. PRODUCT.md says these exist because comparison is part of the real evaluation path.
Fix: add to Resources menu + Product footer column, link from end of /pricing comparison section, add routes to sitemap.ts.
Command: /impeccable layout src/components/site

### [P1] Zero reassurance at the signup decision across eight CTAs
"No credit card required" appears once, in pricing.ts:255, inside a collapsed accordion. Every "Start free" is an off-domain jump to app.oyechats.com with no field count, time estimate, or card statement.
Fix: type-mono-sm line under primary CTAs: "No credit card · Free plan forever · Live in 10 minutes". All three already substantiated on site.
Command: /impeccable clarify src/components/site/FinalCTA.tsx

### [P1] Three React hydration errors on every page load
"Cannot render a sync or defer <script> outside the main document", a hydration error, and a nested-<script> error — identical on all six pages. Root cause layout.tsx:102 renders <Analytics /> as direct child of <html> with no <head>; Analytics.tsx:33 carries an eslint-disable suppressing the rule that flags it. Sits on the consent-gating path that decides whether GTM fires before consent.
Command: /impeccable harden src/app/layout.tsx

## Persona Red Flags

Jordan (first-timer, non-engineer): hero's only alternative to signup is "Read the docs ->". First factual content is "BANT range 0-100 · Webhook events 5 types" — BANT explained 800px later, webhooks never. Pricing appears twice with different feature counts (5 vs 8) and different badges on the same tier.

Riley (stress tester): three console errors every page. Resources trigger is an <a href="/docs"> with aria-expanded but no aria-haspopup — Enter navigates away instead of opening the menu. Monthly->Annual rewrites 8 prices with no announcement. Footer "What's new" link 199x14.3px, below WCAG 2.2 SC 2.5.8 (24x24). No pause control on auto-advancing hero.

Casey (mobile, one thumb): hero pane min-h-[360px] near-empty while typing at 20ms/char; BANT payoff ~8s in. /pricing 8,296px tall at 375px with recommended tier at y=1,603. Primary CTA top-right in header, no sticky bottom bar. 28 sub-44px tap targets in chrome; smallest "DPA" at 25.7x32.8.

Arjun (Bangalore founder, INR buyer on VPN): sees $9/$19/$39 with no way to switch to INR — middleware.ts decides on x-vercel-ip-country, no toggle, no discovery link. FAQ on the USD page reads "Extra seats are Rs499 (or $5 for international customers)" — verified as the ONLY rupee figure on the USD page. For two co-primary markets, that one string ranks them.

## Minor Observations

- WidgetLoader.tsx:29 early-returns on localhost — Product Principle #1 ("the widget on this site is the demo") is untestable in dev; nobody on the team sees the site as the visitor does.
- /features renders 6 pill-tabs above 6 sections that all render anyway — anchors dressed as a filter.
- Footer duplicates Blog and Changelog across two columns each; 20 links at 13px in 33px rows on mobile.
- HeroDemo.tsx:39, 55 open two scripts with a closing curly quote used as an opening quote.
- Wordmark requests w=384, serves 256px into a 131px slot.
- .type-display-1 letter-spacing -0.045em, past the -0.04em collision floor.
- Cognitive load: 6 of 8 checks fail. Nine decision points exceed four visible options (nav 8, mobile drawer 9, footer 20, pricing 8 prices).

## Questions to Consider

1. Why is the product simulating itself while running on the page? Delete the 300 lines of scripted animation; open the real widget inline, seeded with the four suggested questions, answering from OyeChats' own docs, showing the real BANT score of the real conversation. The one chatbot demo that cannot be faked.
2. If honesty is the differentiator, where is the page saying what OyeChats cannot do? Published on /compare, the hard boundaries become the most credible content on the site and fix the orphaning in the same move.
3. What is the StatBand for? Four spec integers immediately after the emotional peak of the site.
