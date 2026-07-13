# Content Changelog — Website v2 Copy Pass

**Date:** 2026-07-13
**Author:** Content audit & rewrite (UX writing pass)
**Rule followed:** Text-only changes. No UI, layout, styling, routing, or product logic altered except where a string was itself broken (deep-link anchors, error payloads). All changes preserve meaning and improve clarity, honesty, or tone.
**Verification:** `tsc --noEmit` ✓ clean · `next build` ✓ success (all routes prerendered). *(Repo's `next lint` is removed in Next 16 and its flat ESLint config is pre-existing-broken; unrelated to these text edits.)*

Legend: 🔴 false-claim fix · ✂️ jargon/clarity · 🔗 broken CTA · 💬 error/empty-state · 🏷️ consistency/naming

---

## `src/app/page.tsx` (Homepage)
- 🔴 **Removed fictional CLI.** "Ingest" demo `npx oyechats init … builds vector index · deploys` → real script-tag flow (`<script src="cdn.oyechats.com/widget.js" data-bot-key="…">` → "crawled docs.acme.com · indexed 1,247 passages"). Matches actual onboarding on `/docs`.
- ✂️ **Ingest body copy** de-jargoned: "Hybrid semantic + keyword index built in minutes" → "It reads them and builds a searchable index in minutes — no engineering required."
- 🔗 **Feature-card CTA** "Learn more →" → "See how it works →"; link now resolves via new `anchor` field instead of the broken `#${slug}`.
- Removed now-unused imports (`TermCmd`, `TermK`).

## `src/lib/features.ts`
- Added optional `anchor` field to `Feature` so homepage cards deep-link to real `/features` section IDs.
- ✂️/🏷️ Rewrote 6 homepage feature blurbs to be outcome-first and plain (streaming, grounded answers, BANT, live handoff, easy setup, brand voice). "Easy integration" → "Easy setup".
- 🔴 **Security tagline** "Encrypted end to end." (implies E2EE) → "Encrypted in transit and at rest."
- 🔴 **Solutions outcomes** — replaced 4 fabricated metrics with verifiable capabilities:
  - "Up to 60% of routine tickets deflected" → "24/7 — first-line answers from your own docs…"
  - "Up to 3.4x more qualified leads per visitor" → "0 form fields — every lead is BANT-scored from the chat itself"
  - "Typically <5s to a cited answer" → "Every answer links back to the source doc it came from"
  - "Typically <25s to reach a human" → "1 click from bot to a human, with the full transcript attached"

## `src/app/features/page.tsx`
- 🔴 **Removed the SOC 2 lie.** Live-chat demo "Yes, SOC2 Type II." → honest data-handling exchange ("Encrypted in transit and at rest, GDPR-aligned, and we never train models on your data.") — now consistent with `/security`.
- ✂️ RAG step "Embed — Converts your content into semantic meaning…" → "Understand — Turns your content into a form the AI can search by meaning, not just exact words."; hybrid-search desc plain-worded.
- 🏷️ Mock analytics panel chip "Live" → "Sample".

## `src/components/site/AnnouncementBar.tsx`
- 🔴 "Live handoff across 5 channels" → "Hand off to a human in the same thread" (web widget only).
- 🏷️ "Voltage Paper v1.0 shipped" (internal codename) → "Auto-recrawl keeps your knowledge base fresh".
- ✂️ Minor rewrites for consistency ("Any site" → "Any website"; "First qualified lead in <10 min" → "Live on your site in minutes").

## `src/components/site/Footer.tsx`
- 🏷️ Removed the internal codename subtitle "/ voltage-paper" from the wordmark.

## `src/components/site/Navbar.tsx`
- 🔗 Fixed broken mega-menu deep-links: `#bant-scoring`/`#grounded-rag`/`#live-handoff`/`#easy-integration`/`#analytics` → real IDs `#feature-bant`/`#feature-rag`/`#feature-live-chat`/`#feature-integrations`/`#feature-analytics`.
- 🏷️ "Hybrid RAG" → "Grounded answers"; "Easy integration" → "Easy setup"; description tweaks for consistency.

## `src/app/about/page.tsx`
- ✂️ **Headline** "We're defining the AI era of customer conversations." → "We help teams answer every visitor — and qualify the ones worth calling."
- ✂️ Subhead de-jargoned ("RAG-powered … real-time customer agent" → "chat assistant that answers questions from your own content…").

## `src/lib/changelog.ts`
- 🏷️ Invented author "Steve · Ingestion" → "Ingestion Team" (matches team-level attribution of all other entries).

## `src/app/changelog/page.tsx`
- 🏷️ Removed self-contradicting cadence claim: meta "shipped every two weeks" + body "Weekly product updates" → both "as they ship".

## `src/app/api/contact/route.ts`
- 💬 Humanized all 6 user-facing error strings (503/429/400/422×3/502) — no more raw validator/HTTP wording; each now states the problem, the next step, and a fallback email.

## `src/app/integrations/page.tsx`
- 💬 Empty state "No integrations match your search." → helpful, non-dead-end copy with a recovery step + webhook reminder.

## `src/lib/integrations.tsx`
- 🔴/🏷️ Install labels corrected to match reality/their own descriptions: WordPress "Plugin" → "Script" (beside "Paste one script tag"); Shopify "App" → "Embed" (beside "Add the script to your theme").

---

## Intentionally left unchanged
- **Security, Docs, Pricing, Legal, Blog** — already honest, clear, and appropriate for their audience. Editing would add risk, not value.
- **Blog article bodies** — strong technical essays; Grade 7–9 target doesn't apply to that genre.
- **Legal text** (`src/lib/legal.ts`) — precise, plain-language legal content; not rewritten (accuracy/liability domain).
- **Footer "All systems operational" chip** — flagged in the audit (no status source), but it needs a data feed, not a copy edit.
- **Pricing figures** — platform/site price drift is owner-tracked separately (decision: update platform later). No site change.
- **`Callout.tsx` code comment** mentioning "Voltage Paper" — internal, non-rendered; not customer-facing.

## Recommended follow-ups (not copy)
1. Add real product screenshots to `public/images/` (hero widget, one analytics view, one BANT timeline) — biggest remaining trust lever.
2. Wire "All systems operational" to a real status source, or neutralize it.
3. Add a named founder + photo on `/about`.

---

# Pass 2 — Headings & titles: plain-language sweep

**Date:** 2026-07-13 · **Goal:** every heading, card title, section label, and step title in plain, meaningful language — no dev jargon on customer-facing surfaces.
**Verification:** `tsc --noEmit` ✓ · `next build` ✓ (all routes prerendered).

Jargon retired from headings/labels: **ship / shipped / ship it** (→ *go live / built in / often*), **stack** (→ *tools / setup / website*), **pipeline** (→ *tools / setup*), **deploy** (→ *add*), **agent** as product name (→ *assistant*), **async** (→ *remotely*), **ingest** (→ *setup / add*), **RAG Pipeline / chunk / hybrid / embed** step labels (→ plain verbs), **CSM / SLA** acronyms (→ *manager / uptime*), **workflow / use case / business outcomes** (→ plain).

### Homepage (`page.tsx`)
- Story steps: "Ingest" → **"Connect your content"**; "Route" → **"Hand off"**; "Qualify" body de-jargoned ("Inferred from natural chat" → "read from the conversation itself").
- Integrations heading "Drops into any stack." → **"Drops onto any website."**; sub reworded.
- Terminal chrome label "~/oyechats · ingest" → "~/oyechats · setup".

### FinalCTA
- Eyebrow "Ship in 10 minutes" → **"Go live in 10 minutes"**; body "Deploy OyeChats…" → "Add OyeChats…".

### Features (`features/page.tsx`)
- H1 "Everything you need to **ship**." → **"Everything you need, built in."** (also removes the duplicate H1 shared with Docs); sub de-jargoned.
- Sub-nav chips: "RAG Pipeline" → **"Grounded answers"**, "BANT scoring" → **"Lead scoring"**.
- RAG section eyebrow "RAG Pipeline" → "Grounded answers"; heading "Knowledge that actually understands context." → **"Answers that actually understand the question."**
- RAG steps relabeled to plain verbs: Upload docs→**Add your content**, Chunk and clean→**Prepare it**, Understand→**Understand it**, Hybrid search→**Smart search**, AI generate→**Write the answer**, Stream reply→**Reply in real time** (all descriptions de-jargoned).
- BANT criteria descriptions simplified ("Detects decision-maker language patterns." → "Spots who the decision-maker is.").
- Webhooks heading "Ship every event to your stack." → **"Send every event to your own tools."**; integrations heading "Ships to your stack." → **"Fits your existing tools."**; closing eyebrow "Ready to ship?" → **"Ready to go live?"**

### Solutions (`solutions/page.tsx`, `features.ts`)
- H1 "Workflows that drive real business outcomes." → **"Built for support, sales, and everything between."**; sub reworded from "use case / workflow" to plain.
- "Jump to a workflow" → "Jump to a solution".
- Closing "Pick a solution, ship it this week." → **"Pick a solution, go live this week."**
- Card title "Turn every doc into a chat interface" → **"Turn every doc into a conversation."**

### About (`about/page.tsx`)
- "One agent, every customer moment." → **"One assistant, every customer moment."** (+ sub: "agent" → "assistant").
- "Built async, shipped weekly." → **"Built remotely. Shipped often."**

### Pricing (`pricing/page.tsx`, `pricing.ts`)
- "Custom volume. Dedicated **CSM**." → **"Custom volume. A dedicated manager."**
- Category "Security and **SLA**" → **"Security and uptime"**.
- Credit action "1 URL page crawl + **ingest**" → **"1 web page crawled and added to your knowledge base"** (+ matching FAQ wording).

### Contact (`contact/page.tsx`)
- H1 "Let's talk **pipeline**." → **"Let's talk."**; sub tightened.

### Integrations (`integrations/page.tsx`)
- H1 "Ships to your **stack**." → **"Works with your whole setup."**; sub reworded.

### Docs (`docs/page.tsx`)
- H1 "Everything you need to **ship**." → **"Everything you need to go live."**; sub "webhook pipelines" → "webhook setups".
- Quick-start step "The **RAG pipeline** handles the rest." → "OyeChats reads and indexes the rest."; meta "ship webhooks" → "connect webhooks".

### Navbar (`Navbar.tsx`)
- Mega-menu column titles: "Core capabilities" → **"What it does"**, "Ship and scale" → **"Set up and grow"**, "By workflow" → **"By team"**.
- "Documentation — Install, configure, ship webhooks" → "…connect webhooks".

### Left as-is (correctly)
- **Blog, Legal, Docs code samples, Security infra list, changelog technical entries** — technical/legal genres where terms like *pipeline, deploy, async, chunk* are accurate and the audience expects them.
- Strong headings kept unchanged: "You only talk to buyers.", "Security, documented.", "Bot first, human second.", "Numbers you can verify.", "Simple, credit-based pricing.", "What's new in OyeChats.", "Nothing here." (404).
