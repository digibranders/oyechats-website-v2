# OyeChats Website v2 — Product Design Audit & Claims Review

**Date:** 2026-07-13
**Scope:** `oyechats-website-v2/` (the "Voltage Paper" rebuild) — full product design critique **plus** a cross-check of every marketing claim against the real platform codebase (`oye-chats-platform`, `oyechats-admin`).
**Reviewer lens:** Not a code review. This is the audit a Series-A investor's design partner would run — "Does this feel like a real company, and is what it says true?"
**Verdict in one line:** **A genuinely premium, hand-built shell wrapped around a product that is shown entirely in simulation and described with several claims the codebase proves false.** Fix the truth problem first; the craft is already there.

---

## ⟳ RE-AUDIT #2 — 2026-07-13 (later same day)

**The truth problem is essentially solved.** A re-scan of the current source shows nearly every false/misleading claim from the table in §15 has been removed or reframed — most by follow-up edits after the first audit. **The verdict flips from "premium shell, false core" to "premium shell, honest core — now finish the craft and add real screenshots."**

**Resolved since the first pass (verified in source):**
- 🔴 **SOC 2 Type II** — gone from the hero *and* features page (grep: zero `soc2` hits site-wide).
- 🔴 **Self-hosted**, 🔴 **"handoff across 5 channels"**, 🔴 **"30+ platforms"**, 🔴 **`npx oyechats init` CLI**, 🔴 **"connected · 12 regions"** — all gone.
- 🟠 **Blanket "99.9% SLA"** → *"Uptime target."* 🟠 **Announcement bar** fully rewritten to 6 true claims (auto-recrawl, BANT-per-conversation, same-thread handoff, 5 signed webhooks, any-site-one-tag, live-in-minutes) + internal "Voltage Paper v1.0" jargon removed.
- 🟡 **Fabricated homepage metrics** (87%/3×/<2min) → verifiable stack specs. 🟡 **Fabricated solutions metrics** (60%/3.4x/<5s/<25s) → honest qualitative facts (24/7, 0 form fields, 1 click).
- 🟠 **Live console** → explicit `SAMPLE` / *"illustrative — not live customer data."*
- **Footer "/ voltage-paper" codename leak** — gone. **Fabricated changelog personas** ("Steve · Ingestion", "Priya") → honest team attribution. **Broken feature-card anchors** — fixed.
- ⭐ **Hero upgraded** from a static illustration to an interactive, honestly-labeled **`HeroDemo`** ("demo") whose every scripted line is code-true (5 HMAC webhook types, cited hybrid retrieval, one-tag/5-min setup, same-thread handoff). This is the biggest single authenticity gain — it now *demonstrates* real capability instead of describing an invented one.

**Still open (one remains):**
- ✅ ~~Static "All systems operational" chip~~ — **FIXED 2026-07-13.** Replaced with a live `<SystemStatus />` component that polls a same-origin `/api/status` proxy → real platform `GET api.oyechats.com/health`. Maps `healthy`→green "All systems operational", `degraded`→amber "Partial degradation", `503/unhealthy`→red "Service disruption", unreachable→neutral "Status unavailable" (never falsely green). Server-side proxy is CDN-cached 30s so per-visitor polling never touches the platform DB. Verified live: endpoint returns `{"status":"healthy"}` / 200.
- 🔺 **No real product screenshots** — `public/images/` is *still empty*. `HeroDemo` softens this a lot (it shows the real arc), but there is still not one actual dashboard/widget capture. This is now the #1 remaining gap and the last thing standing between "honest and polished" and "Series-A credible."

**Updated scorecard (supersedes §0 where they differ):**

| Dimension | Was | Now | Why the move |
|---|---|---|---|
| Trust | 3.0 | **7.0** | Active falsehoods removed; honest security/pricing framing; still no customers/logos |
| Authenticity / Substance | 3.0 | **6.5** | Interactive true-copy `HeroDemo` + honest metrics; still no real screenshots |
| Product Story | 6.0 | **7.5** | Hero now shows the real question→cite→score→route arc; ingest step shows the real script tag |
| Content | — | **8.0** | Metrics now concrete and true |
| Perceived Premium (net) | 6.5 | **8.0** | Top-decile shell no longer undermined by lies |

**Unchanged (design-craft items, not addressed — this is where the next work is):** single-accent icon-chip monotony, template-cadence layout (eyebrow→heading→grid ×6), one-radius/one-elevation system that never breaks itself, no ownable brand device beyond color. See §2, §5, §8, §9. The remaining path to world-class is now **craft, not honesty.**

---

## 0. Executive Summary

This is **not** a vibe-coded, shadcn-default template. The `Voltage Paper` design system (`globals.css`) is opinionated and hand-authored: a warm paper canvas (`#FAFAF7`), near-black ink, a single electric-violet accent (`#A21CAF`), a custom five-step type scale, bespoke motion tokens, and a considered elevation ramp. On pure execution it sits in the top ~10% of B2B SaaS marketing sites. The `Button`, `Navbar` mega-menu, and `FinalCTA` "live console" are craft, not assembly.

The problem is **substance, not surface.** Two things undermine everything the design earns:

1. **The product is never actually shown.** `public/images/` is empty. Every "product" surface — the hero chat, the BANT ring, the analytics dashboard, the live console — is a hand-drawn React mock with invented data. The site *describes and simulates*; it never *demonstrates*.
2. **Several claims are false or unsubstantiated**, and the platform's own code proves it — most damningly, the marketing pages assert **SOC 2 Type II** while the site's *own* `/security` page correctly says the company holds no such certification. That is a self-contradiction shipping in production.

Net effect: a sophisticated visitor feels the polish, then hits a claim they can't verify (or that rings false), and the whole thing re-reads as **confident marketing rather than a trustworthy product.** The fix is not a redesign. It is honesty + real screenshots.

### Premium Scorecard

| Dimension | Score | One-line reason |
|---|---|---|
| Brand Identity | 7.0 / 10 | Strong "Voltage Paper" POV, but one-accent monotony and internal codename leaking into the public mark |
| Visual Design | 8.5 / 10 | Premium, deliberate, well-crafted — the standout |
| Visual Hierarchy | 8.0 / 10 | Clear type ramp and eyebrow rhythm; a few "everything equal" grids |
| Layout | 6.5 / 10 | Every section is eyebrow → heading → grid; template cadence underneath the polish |
| Motion | 7.0 / 10 | Tasteful easing, good `reduced-motion` support; too much *decorative/fake-live* motion |
| Originality | 6.0 / 10 | Plum-black console + dotted grid + mono labels is the 2025 "AI SaaS" house style |
| **Trust** | **3.0 / 10** | Fabricated metrics, false claims, zero real proof, no customers |
| Product Story | 6.0 / 10 | Narrative arc exists, but it stars a fake product |
| UX | 8.0 / 10 | Clean nav, sticky sub-nav, sensible flows |
| Accessibility | 7.0 / 10 | Great reduced-motion + focus rings; low-contrast micro-type in places |
| Performance | 8.5 / 10 | Static, tiny dep tree, no image weight (because there are no images) |
| **Authenticity / Substance** | **3.0 / 10** | Nothing on the page is the actual product |
| **Perceived Premium (net)** | **6.5 / 10** | Top-decile shell, dragged down by the hollow, occasionally-false core |

**Product maturity it *looks* like:** Series A polish.
**Product maturity it *proves*:** Seed/MVP — because it shows no real product, no customers, and no verifiable numbers.

---

## 1. First Impression (the 5-second test)

**What lands:** Expensive, calm, technical. The warm paper + violet + mono eyebrows read "developer-credible SaaS." The hero line — *"You only talk to buyers."* — is genuinely good: short, benefit-first, confident.

**What subconsciously registers as off:**
- The right-hand hero "conversation" is obviously an illustration, not a screenshot. A savvy buyer clocks "this is a drawing of a product" instantly.
- The stat band directly below (`0–100`, `< 10 min`, `5 types`, `99.9%`) mixes a real spec (BANT range) with an unbacked SLA. The eye can't tell which numbers are trustworthy, so it discounts all of them.
- The hero chat has the AI confidently answer *"Yes to SOC2 (Type II)."* — the single most load-bearing trust claim on the page is fictional (see §15).

**Emotion after 5s:** *Curiosity + mild skepticism.* It looks like a real company; it doesn't yet feel like one you can verify.

---

## 2. Vibe-Coding / AI-Generation Audit

Credit where due: this is **well above** the AI-generated baseline. No default shadcn, no random `rounded-2xl shadow-lg` cards, no Inter-everything. The tells that remain are subtler:

| Signal | Where | Why it reads "generated" | What premium teams do |
|---|---|---|---|
| **One-accent monotony** | Every icon chip is `bg-volt-tint text-volt` (`Navbar`, `features`, `security`, `about`, `integrations`) | When *every* icon gets the identical violet square, the eye stops reading them as distinct — it reads "system output." | Vary icon treatment by section; let some surfaces breathe without the accent. |
| **Section template repetition** | `Section` used identically 6+ times: eyebrow → heading → `sub` → grid | Predictable cadence is the #1 subconscious "template" cue | Break the grid deliberately — one asymmetric, one full-bleed, one editorial. |
| **Simulated "live" data** | `FinalCTA` feed, analytics mock, sparklines "hand-tuned to look realistic" | Fabricated telemetry is the defining AI-demo tell | Show *one* real dashboard screenshot instead of ten fake tickers. |
| **Fabricated round metrics** | `87%`, `3×`, `<2 min`, `Up to 60%`, `Up to 3.4x` | Suspiciously clean, sourceless numbers | Cite a real number with a source, or cut it. |
| **Decorative gradient text** | `GradientText` on one word per heading, on nearly every page | The "gradient the key noun" move is now a genre convention | Use it once, as a signature — not per page. |
| **Ambient glows everywhere** | `HeroGlow`, `volt-aurora`, `console-aurora` on most heroes | Aurora-behind-hero is the 2025 house style | Keep one hero glow as a signature; drop the rest. |

**Bottom line:** The *components* are handcrafted. The *composition* still follows the generated-SaaS playbook. The gap between "looks designed" and "looks assembled" here is small but real, and it lives in the repetition, not the pixels.

---

## 3. Brand Identity

**If you removed the logo, would anyone know it's OyeChats?** Partially. The warm-paper + single-violet + mono-eyebrow combination is distinctive *enough* to be recognizable across the site — that's a genuine achievement. But it is **not yet ownable**: plum-black consoles, dotted grids, and violet accents are shared DNA with a dozen AI-infra startups (Linear/Vercel-adjacent).

**Missing brand DNA:**
- **No mascot, no signature illustration style, no proprietary visual device** beyond color. The `BantScoreRing` is the closest thing to a brand-owned object — lean into it hard; make it *the* OyeChats visual.
- **No voice-of-founder, no human face.** The `/about` page has one office (Thane) and a "PullQuote" attributed to "OyeChats Team." A real company name has real people.
- **Codename leak:** the footer brand mark renders `/ voltage-paper` (`Footer.tsx:35`) and the announcement bar celebrates *"Voltage Paper v1.0 shipped"* — internal design-system jargon presented to customers as if it were a product milestone. Remove it; customers don't know or care what your CSS is called.

---

## 4. Visual Hierarchy

**Strong.** The `type-display-1 → type-mono-sm` ramp (`globals.css:407-417`) is well-tuned, with proper negative tracking on displays and uppercase mono for eyebrows. Scanning works: eyebrow orients, heading commits, `sub` explains.

**Weak spots:**
- The homepage **stat band** (`page.tsx:93-98`) gives four numbers equal weight and equal size. Nothing signals which matters. "Uptime SLA 99.9%" sits with the same authority as "Setup time < 10 min," so a fabricated stat borrows credibility from a real one.
- On `/features`, the RAG six-step list, BANT grid, analytics grid, and webhook list are all **medium-density card grids** — the page has one rhythm for five very different concepts. Nothing is allowed to be *big.*
- `type-mono-sm` at `0.6875rem` in `--muted` (`#71717A`) on paper is a recurring low-contrast micro-label. It's charming; it's also below comfortable reading contrast (§10/accessibility).

---

## 5. Layout Audit — does each section earn its place?

| Section | Verdict |
|---|---|
| Hero | ✅ Earns it. Strong line, clear CTA. But swap the illustration for a real product frame. |
| Stat band | ⚠️ Half the numbers are unverifiable. Keep the real specs, cut the SLA. |
| Feature bento (6 cards) | ⚠️ Exists because every SaaS has one. Cards end in repeated *"Learn more →"* — the classic filler CTA. |
| Scroll story (Ingest/Qualify/Route) | ✅ **Best section on the site.** Real narrative, real product concepts — *if* the `npx oyechats init` terminal weren't fictional (§15). |
| Live stats (dark) | ✅ **FIXED 2026-07-13** — was four fabricated outcome numbers; reframed to *"Numbers you can verify"* with four true stack specs (768 dims / 200 free credits / 3 doc formats / 2 crawl engines). Design retained. |
| Integrations preview | ⚠️ "30+ platforms" overclaims (§15); most are the same script tag. |
| Pricing preview | ✅ Grounded and honest — the most trustworthy block. |
| Final CTA (live console) | ✅ **FIXED 2026-07-13** — was fabricated telemetry reading as live; reframed as an explicit `SAMPLE` / *"Illustrative sample — not live customer data"* (and the false "12 regions" line removed). Design retained. |

**Pattern:** the *honest* sections (pricing, the how-it-works story) are also the *strongest.* The fabricated sections are where craft is spent covering for missing proof. That's the whole thesis in miniature.

---

## 6. Product Authenticity — the central failure

**Count of sections that SHOW the real product: 0. Count that describe/simulate it: every single one.**

`public/images/` is empty. There is not one screenshot of the actual dashboard, the real widget on a real site, a real BANT signal timeline, or a real analytics view — even though the platform agent confirms **all of these exist and are fully built** (`analytics_routes.py`, `bant-signals/page.tsx`, the live widget on `cdn.oyechats.com`). The product is real; the website refuses to show it.

This is the single highest-ROI fix in this document. Premium products *demonstrate*:
- Replace the hero illustration with a **real, annotated widget screenshot** on a recognizable-looking site.
- Replace the fabricated `FinalCTA` console with **one real (anonymized) analytics dashboard** capture.
- Turn the "Qualify" step into a **short screen-recording** of an actual BANT score updating live.
- The `/features` BANT and analytics mocks → **real UI, blurred/anonymized data.**

You have a genuinely differentiated product (real hybrid RAG, real BANT engine, real live handoff). Hiding it behind drawings is a self-inflicted wound.

---

## 7. Content Audit

**Good:** The copy is largely concrete and technical — "hybrid semantic + keyword RAG," "HMAC-signed webhooks," "TSVECTOR keyword index," "token-streamed." This is credible, engineer-respecting language, and it mostly maps to real code.

**Cut or fix:**
- **Sourceless metrics** presented as fact: *"87% Rep meetings with qualified buyers,"* *"3× Fewer unqualified meetings,"* *"Up to 60% of routine tickets deflected,"* *"Up to 3.4x more qualified leads."* Either attribute these ("in an internal pilot, N=…") or delete them. Right now they read as invented, because they are.
- **Buzzword drift:** *"We're defining the AI era of customer conversations"* (`/about`) is exactly the empty-adjective register the rest of the copy avoids. Replace with what you actually do.
- **Fabricated personas:** changelog authors *"Steve · Ingestion,"* *"Priya"* and the recurring sales-rep "Priya M." A real changelog with real (or team-level) attribution is more trustworthy than invented names.

---

## 8. Component Audit

**Genuinely strong:** `Button` (six deliberate variants, proper external-link handling, `!text-white` guards, considered shadow states) and the `Navbar` mega-menu are portfolio-grade.

**Where variation *should* exist but doesn't:**
- **Icon chips** — one treatment (`bg-volt-tint text-volt`) across the entire site. Introduce at least a neutral and an inverted variant.
- **Cards** — `Card`, integration tiles, feature cards, security cards, pricing cards all share the same `border-line` + `r-3/r-4` + `e-1` recipe. Correct for a system; monotonous for a *marketing* site, where surprise is a feature.
- **`ChatBubble`** appears on hero, features, and how-it-works — three times with near-identical fabricated content, including the *same* SOC 2 lie twice.

**Broken-anchor bug (QA):** the `Navbar` mega-menu links to `/features#bant-scoring`, `#grounded-rag`, `#live-handoff`, but the actual section IDs on `/features` are `feature-bant`, `feature-rag`, `feature-live-chat`. Those deep links silently fail to scroll. Same mismatch for the homepage feature-card links (`/features#${slug}`).

---

## 9. Design System Audit

**This is the site's crown jewel.** Tokenized radius (`--r-1..5`), a three-tier elevation ramp (`--e-1..3`), semantic color roles (`signal`/`alert`/`danger` + tints), a full custom keyframe library, and `@theme inline` wiring to Tailwind v4 utilities. Consistency is excellent.

**Where consistency has become *boring* (premium systems break their own rules on purpose):**
- Radius is *always* `r-3`/`r-4`. Nothing is ever sharp-cornered or pill-shaped for emphasis. One deliberately-different shape per page would create rhythm.
- Elevation is *always* the soft `e-1`. No object ever feels genuinely lifted or genuinely flat.
- Container width is a single `max-w-[1360px]` everywhere. A full-bleed moment (one edge-to-edge product shot) would break the monotony and — conveniently — show the product.

The system is mature enough that it can now afford *intentional* violations. Right now it never violates itself, which is exactly what makes it read a touch mechanical.

---

## 10. Motion & Accessibility

**Good:** Consistent `cubic-bezier(.16,1,.3,1)` easing, a proper `prefers-reduced-motion` block that neutralizes everything (`globals.css:429`), and `FinalCTA` correctly disables its timers under reduced motion. Focus-visible rings are defined globally. This is responsible motion engineering.

**Overused / decorative:**
- `badge-glow`, `cta-ring`, `shimmer-line`, `signal-pulse`, `glow-drift`, `border-beam`, `traveling-dot` — a large share of the motion budget is spent on *ambient decoration* and *faking liveness*, not on guiding attention. The rotating word in `FinalCTA` (`workflow → pipeline → revenue → growth → quota`) is pure ornament.
- **Recommendation:** reallocate motion from "make it feel alive" to "make the product legible" — e.g., animate a *real* BANT score climbing as a user reads the qualify step.

**Accessibility gaps:** `type-mono-sm` in `--muted` on `--paper` is below comfortable contrast for body-adjacent text used as labels throughout. Some hover-only affordances (mega-menu on `mouseenter`) have keyboard equivalents worth verifying. The fabricated data carousels update every 2s with no pause control.

---

## 11–14. Storytelling, Emotional Design, Trust, Maturity

- **Storytelling (6/10):** There *is* an arc — problem (unqualified leads) → mechanism (BANT + RAG) → proof → CTA. But the "proof" beat is fabricated, so the story collapses at its climax. The strongest narrative moment (Ingest → Qualify → Route) is undercut by a fake CLI.
- **Emotional design:** After browsing, the residual emotion is *"slick, but can I trust it?"* — which is the worst outcome for a security/sales product, because trust *is* the product.
- **Trust (3/10):** No customer logos, no case study, no real screenshot, no named team, no third-party proof, plus **active false claims.** The one honest, trust-building page (`/security`, which openly admits no SOC 2/ISO) is contradicted by the marketing pages. You have the raw material for trust (real GDPR-aligned deletion, HMAC webhooks, SSRF protection, RBAC) and you're squandering it on claims you can't back.
- **Maturity:** *Looks* Series A; *proves* MVP. The delta is entirely: real screenshots + real proof + removing false claims.

---

## 15. FALSE & MISLEADING CLAIMS — verified against the platform code

This is the section the review was explicitly commissioned for. Each row is cross-checked against `oye-chats-platform` / `oyechats-admin`. Severity: 🔴 **false** · 🟠 **misleading / overstated** · 🟡 **unsubstantiated**.

| # | Claim (website) | Location | Reality (platform evidence) | Sev |
|---|---|---|---|---|
| 1 | **"Yes to SOC2 (Type II)"** / "Yes, SOC2 Type II." | `page.tsx:68`, `features/page.tsx:281` | **Not certified.** No SOC 2 program in code; `docs/…/multi-tenancy.md:119` marks SOC 2-driven isolation *deferred*, and `rag_service.py:3685` literally instructs the bot **not** to claim certifications. **Also contradicts the site's own `/security` page**, which admits no SOC 2/ISO. | 🔴 |
| 2 | **"connected · 12 regions"** | `FinalCTA.tsx:264` | Single-node deployment; `docs/…/reliability.md` flags a **single-droplet SPOF**. No multi-region infra. **✅ FIXED 2026-07-13:** replaced with *"sample data · not live"* during the console reframe. | 🔴→✅ |
| 3 | **`npx oyechats init`** developer CLI | `page.tsx:145` | **No CLI exists.** Onboarding is a `<script data-bot-key>` tag — per the site's *own* `/docs` page. | 🔴 |
| 4 | **"Live handoff across 5 channels"** | `AnnouncementBar.tsx` | **Web widget only.** No WhatsApp / Instagram / Messenger / Slack inbound handlers anywhere in `api/app`. "WhatsApp" appears once, in a code *comment*. | 🔴 |
| 5 | **"Self-hosted is on Enterprise"** | `page.tsx:65-68` | **Not found.** No self-host / on-prem capability in the codebase. | 🔴 |
| 6 | **"Ships to 30+ platforms" / "30+ integrations"** | `page.tsx:226`, `AnnouncementBar.tsx` | Only **16** are listed; ~8 are the *same script tag* on different site builders. No native CRM, Zapier, Make, or Shopify app — only outbound webhooks + a user-supplied URL. **✅ FIXED 2026-07-13:** heading → *"Drops into any stack."*, sub reframed to signed-webhooks mechanism, announcement bar → *"Any site, one script tag."* | 🟠→✅ |
| 7 | **"Uptime SLA 99.9%"** (blanket homepage stat) | `page.tsx:97` | Internal **SLO target only** (`reliability.md:92`), explicitly "input to a *future* SLA," with a known SPOF. Contractual SLA is Enterprise-only per pricing. Presenting it as a headline stat is misleading. **✅ FIXED 2026-07-13:** relabeled to *"Uptime target 99.9%"* (drops the contractual-SLA framing; Enterprise "Custom SLA" copy left intact). | 🟠→✅ |
| 8 | **"87%" qualified meetings · "3×" fewer · "<2 min"** | `page.tsx:214-217` | No substantiation anywhere in code. Invented. **✅ FIXED 2026-07-13:** dark band reframed *"Numbers that move"* → *"Numbers you can verify"* with four true, verifiable stack specs (768 vector dims, 200 free credits, 3 doc formats, 2 crawl engines). | 🟡→✅ |
| 9 | **"Up to 60%" deflection · "Up to 3.4x" leads · "<5s" · "<25s"** | `features.ts:138/158/178/198` | No benchmarks or measured numbers in code. | 🟡 |
| 10 | **Live console feed** (342 quals, fake domains, 87% handoff) | `FinalCTA.tsx` | Fully fabricated. Mitigated by a small "demo signals · anonymized" caption, but visually presents as real telemetry. **✅ FIXED 2026-07-13:** reframed as an explicit sample — `live-feed`→`sample-feed`, green `LIVE`→muted `SAMPLE`, `Recent`→`Example qualifications`, `stream · realtime`→`illustrative`, caption→*"Illustrative sample — not live customer data"* (design retained). | 🟠→✅ |
| 11 | **"All systems operational"** (always green) | `Footer.tsx:42` | Hardcoded chip; no status page or health source behind it. **✅ FIXED 2026-07-13:** now a live `<SystemStatus />` reading `api.oyechats.com/health` via a cached same-origin proxy (`/api/status`); reflects real operational/degraded/down/unknown and never shows green unless the platform reports healthy. | 🟠→✅ |
| 12 | **"Data encrypted at rest … (AES-256)"** | `security/page.tsx:78` | Defensible at the *storage* layer (R2/disk-level), but design docs state **"No app-level encryption for stored secrets — TODO."** Framing implies more than exists. | 🟡 |
| 13 | **"Optional reranking and relevance filtering"** | `features/page.tsx:136` | Reranker exists (`reranker.py`) but is **off by default** and was historically non-functional until a recent fix. | 🟡 |
| 14 | **Pricing drift** — Standard "$39/mo" · annual "$31/mo ($372/yr)" · top-up "$239" | `lib/pricing.ts` | **Corrected after full migration-chain verification** (the live `plans` table is source-of-truth; the earlier `preflight_plan_migration.py` numbers were stale). Credits & bot counts on the site are actually **CORRECT** (Free 200, Starter 2,000, Standard 1 bot). The real drift is **price**: platform bills **$49/mo** Standard, **$39/mo ($468/yr)** annual, **$249** top-up. Site shows *lower* prices than checkout charges. **Decision (owner, 2026-07-13): HOLD the site — platform pricing will be updated later to match the site.** No website change. | 🟠→⏸ |
| 15 | Fabricated changelog authors ("Steve · Ingestion", "Priya") | `lib/changelog.ts` | Invented personas on otherwise-real releases. **✅ FIXED:** → honest team attribution. | 🟡→✅ |
| 16 | **Fabricated version numbers & impossible dates** (v2.4.0→v3.2.0; footer `v3.2.0`) | `lib/changelog.ts`, `Footer.tsx` | **Content real, versioning invented.** Platform `pyproject.toml` = **0.1.0**, live `/health` = **1.0.0**, **zero git tags**, no CHANGELOG — the whole v2.4→v3.2 progression is manufactured (exactly 2 entries/version = hand-authored tell). Two oldest entries were dated **before the codebase's first commit** (repo starts 2026-03-26; "Hybrid retrieval" claimed Mar 5, "BANT" claimed Mar 20 — real first commits Mar 28 / Mar 30). **✅ FIXED 2026-07-13:** dropped all version numbers → date-based changelog; corrected the two impossible dates (→Mar 28 / Mar 30); footer shows real "updated {latest date}" instead of `v3.2.0`. | 🟠→✅ |

### Claims that are TRUE and safe to keep (affirmed by code — lead with these)

- **BANT scoring is real** — a genuine four-dimension engine (`qualification_service.py`), plan-gated, with background LLM extraction and an admin BANT-signals view. The `BantScoreRing` is backed by real logic. ✅
- **Hybrid RAG with citations** — Spider + Jina crawl, `gemini-embedding-001` (768-d, pgvector), FlashRank rerank, groundedness gate. ✅
- **Streaming answers, live human handoff, department routing, canned replies, CSAT** — all implemented (`live_chat_service.py`, `ws_routes.py`, `feedback.py`). ✅
- **5 HMAC-signed webhook events + REST API** — exact match: `tier_transition, lead_captured, handoff_requested, chat_closed, meeting_booked`. ✅
- **Meeting booking** — Calendly / Zcal / **Cal.com** all supported. (Website actually *under*-claims — it omits Cal.com.) ✅
- **Security primitives** — bcrypt, HMAC-SHA256 webhooks, SSRF protection, rate limiting, Google OAuth, internal RBAC, GDPR-aligned retention/deletion. The honest `/security` page is well-grounded — **use it as the model for the rest of the site.** ✅
- **Four real plans**, Razorpay billing, credit metering. ✅

**The uncomfortable truth:** the real product is strong enough to sell honestly. Every false claim in the table above is *unnecessary* — you are lying to prop up a product that doesn't need it.

---

## Implementation Roadmap

### Priority 1 — Truth & Proof (do this week; highest ROI, mostly non-visual)
| Action | Effort | Impact |
|---|---|---|
| **Remove/repair every 🔴 claim** — SOC 2 lines (hero + features), "12 regions", `npx oyechats init`, "5 channels", "self-hosted". | S | 🔥🔥🔥 Removes legal/trust liability |
| **Add real product screenshots** — hero widget, one real analytics dashboard, one real BANT timeline. Fill `public/images/`. | M | 🔥🔥🔥 Fixes the #1 authenticity gap |
| ~~Fix pricing drift~~ — **RESOLVED (no site change).** Credits/bots verified correct. Real drift is price (site $39 < billed $49 Standard); owner elected to update the *platform* to match the site later. | — | ✅ Verified & decided |
| **Caveat or cut all 🟡 metrics** — attribute ("internal pilot") or delete 87%/3×/60%/3.4x/<5s/<25s. | S | 🔥🔥 Restores numeric credibility |
| Align the honest `/security` framing across the whole site. | S | 🔥🔥 |

### Priority 2 — Break the Template (medium impact, moderate effort)
| Action | Effort | Impact |
|---|---|---|
| Replace the fabricated `FinalCTA` console with **one real anonymized dashboard**. | M | 🔥🔥 |
| Introduce **layout variety** — one asymmetric section, one full-bleed product shot, one editorial block — so it isn't 6× eyebrow→heading→grid. | M | 🔥🔥 |
| **De-monotonize icon chips** — add neutral + inverted variants; stop painting every icon violet. | S | 🔥 |
| Fix the **broken deep-link anchors** (`#bant-scoring` vs `feature-bant`). | S | 🔥 QA correctness |
| Add **one real trust signal** — a named founder + photo, or a single real (permissioned) customer/logo. | M | 🔥🔥 |

### Priority 3 — Polish & Ownable Brand (lower urgency)
| Action | Effort | Impact |
|---|---|---|
| Make the **`BantScoreRing` the signature brand object** — own it the way Linear owns its gradient. | M | 🔥 |
| Remove the **"Voltage Paper" codename** from the public footer/announcement bar. | S | 🔥 |
| **Reallocate motion** from ambient glow to product-legibility (animate a *real* score climbing). | M | 🔥 |
| Real changelog attribution; kill invented personas. | S | 🔥 |
| Contrast pass on `type-mono-sm`/`--muted` micro-labels. | S | 🔥 accessibility |

---

## The One Thing

If only one sentence survives this audit: **you built a top-decile design system and then filled it with a product you refuse to show and claims your own code disproves.** Delete the lies, paste in real screenshots, and this goes from "impressive-but-untrustworthy" to genuinely Series-A grade — with less work than a redesign, because the hard part (the craft) is already done.

---

*Analysis-only audit — no source files were modified. No lint/build run required (no code changed). Claims cross-checked against `oye-chats-platform` and `oyechats-admin` on 2026-07-13.*
