# OyeChats.com (v2) — Product Design Audit

**Reviewer lens:** Senior Staff Product Designer / Creative Director / Design Systems Lead
**Date:** 2026-07-13
**Scope:** `oyechats-website-v2` — full marketing site (17 routes, 28 components, "Voltage Paper" design system)
**Method:** First-hand read of the entire design system, all page templates, and all backing content/data files. Cross-referenced against the real product source at `oye-chats-platform`.
**Nature:** Product design audit — **not** a code review. Judged as an investor deciding whether this product deserves a Series A.

---

## 0. The one-paragraph verdict

This is **not** a vibe-coded shadcn template, and it is not "AI slop." It is something rarer and, in one specific way, more dangerous: a **beautifully engineered simulation of a company that never actually shows itself.** The design system ("Voltage Paper") has a genuine point of view — warm paper, near-black ink, a single electric violet, a disciplined type scale, restrained motion, and bespoke product illustrations (the live console, the BANT ring, the terminal cards). On craft alone it reads Series A. But the entire proof layer is fabricated: **zero real product screenshots** (the `public/images` folder is literally empty), invented customers the code itself labels "Illustrative," a headline that asserts *"Real teams, real outcomes"* over that fiction, and precise-sounding metrics (87%, 3×, "100% citation rate") with no source. Meanwhile the **real product with ~30 live screens sits one directory away**, unused. The site is a premium shell around a hollow core. The fix is not more design — it is replacing theater with truth.

**Overall Premium Score: 6.6 / 10** — "Premium shell, unproven core."

---

## 1. First Impression (the 5-second test)

| Question | Honest answer |
|---|---|
| Does it feel expensive? | **Yes.** The warm paper, the type, the restraint, and the violet accent read as considered and high-end. Top ~10% of SaaS sites on pure surface craft. |
| Does it feel trustworthy? | **On the surface, yes — until you read closely.** Trust survives the first scroll and collapses on the second (fabricated customers, "Live" badges on static mockups, self-attributed "OyeChats Team" testimonial). |
| Does it feel memorable? | **Weakly.** The BANT ring is the one ownable image. Everything else lives in the "premium AI dev-tool" genre — you'll remember the *category*, not the *company*. |
| Does it feel original? | **Partly.** Original *execution* of an *unoriginal genre*. The warm-paper + one-accent + terminal-chrome + gradient-word recipe is now its own recognizable template (Vercel/Linear/Resend-adjacent). |
| Does it feel generic? | **No — and that's the real achievement.** It escapes the obvious AI tells. It fails on a subtler axis: authenticity of *evidence*, not quality of *design*. |

**Emotion at 5 seconds:** competence and confidence.
**Emotion at 5 minutes:** a quiet unease — *"wait, is any of this real?"* That reversal is the single most important problem on the site.

---

## 2. Vibe-Coding / "AI-Generated" Audit

Credit first: this site **avoids** almost every classic generated tell. It is **not** default shadcn, **not** Lucide-icons-in-identical-cards-only, **not** random gradient abuse, **not** glassmorphism-for-its-own-sake. It has a real type scale, a real token system, and hand-tuned motion. Most reviewers would stop here and call it "handcrafted." It largely is.

But the brutal read finds a **more sophisticated class of AI tell** — the moves a *strong* model makes when asked to "build a premium SaaS site":

| Tell | Where | Why it reads as generated | What premium companies do |
|---|---|---|---|
| **Synthetic-product theater** | `FinalCTA` live console, `/features` fake dashboards, chat mockups, BANT ring, sparklines | An LLM's favorite substitute for a real screenshot is an *elaborate hand-built facsimile* of one. It's impressive and hollow. The `Live` chip on a fully static card (`/features` analytics) is the tell. | Show the **real UI** — a cropped, annotated screenshot or a real embedded widget. Linear/Vercel screenshot the actual app. |
| **The one-gradient-word headline formula** | Every H1 and most H2s: "ship / understands / when / converts / pricing / real / stack" all wrapped in `<GradientText>` | Effective once; a formula by the fourth page. The identical `eyebrow + type-display-3 + one gradient word + sub` cadence repeats on ~every section. | Vary the headline device. Let one page break the pattern hard. |
| **Precise-but-sourceless metrics** | "87%", "3×", "100% citation rate", "+18%", "342 today" | Round, uniformly flattering, no attribution. Humans produce messy numbers with footnotes; models produce clean confident ones. | Every number gets a source, a customer name, or a "measured across N accounts" footnote — or it gets cut. |
| **Structural symmetry** | 4 of 6 `/features` sections and all 4 `/solutions` blocks are the same "text+checklist / visual" two-column, `.map()`-rendered | Perfect repeatability is a generation artifact. `/solutions` is literally one template × 4. | Intentional asymmetry; a "hero feature" that gets 2× the space and a unique treatment. |
| **Vocabulary loops** | "ship" as verb on 3 pages; "Ships to your stack" reused as both a page H1 *and* a section heading; "A real human, exactly when it matters" duplicated verbatim across `/features` and `/solutions` | Copy reuse across surfaces is a context-window artifact. | Each surface earns its own language. |

**Net:** This isn't a generic site. It's a site where a very good model out-designed the *evidence* it was given. The generated quality lives in the **proof layer**, not the pixels.

---

## 3. Brand Identity — "Remove the logo. Whose site is this?"

**Partial pass.** Strip the wordmark and a knowledgeable viewer would say *"a premium AI/dev SaaS, probably YC-adjacent, 2025-26 vintage"* — but would **not** name OyeChats.

**What is ownable (keep and amplify):**
- **The BANT score ring.** This is the one genuinely proprietary visual. No competitor has it. It should be the brand's signature — a favicon-level asset, a loading state, a recurring motif.
- The **plum-black `#14101E`** dark surface tuned to the violet (not pure black) — a nice, defensible detail.
- The **`~/oyechats` terminal voice** as a through-line.

**What is missing (brand DNA gaps):**
- No **illustration language** of its own — no characters, no diagram system, no editorial photography. It borrows the generic "terminal + glow" kit.
- No **human presence** — no founders, no team, no faces, no real customer people. The site is populated entirely by "Priya M" and "Sarah Chen" placeholders.
- No **signature interaction** that is unmistakably OyeChats. The live console is charming but is a generic "activity feed" trope.
- The design system references its own spec (`DESIGN.md`, "rule R-03") **that does not exist in the repo** — the brand's constitution is missing.

**Recommendation:** Make the BANT ring the axis of the entire brand. Build one proprietary diagram/illustration style around "conversation → score → route." Put real humans on the About page.

---

## 4. Visual Hierarchy

**Strong at the component scale, flat at the page scale.**

- **Typography:** genuinely excellent. Four purposeful families (Geist display, Inter body, Geist Mono for data/labels, Fraunces italic for pull-quotes), a real clamp-based scale (`type-display-1…mono-sm`), tight negative tracking on display sizes. This is design-system-lead work, not developer defaults.
- **The flaw:** every section is built from the *same rhythm* — `eyebrow → display-3 heading → sub → grid`. Macro-hierarchy is therefore **flat**: section 2 shouts as loudly as section 6. Nothing signals *"this is the most important thing on the page."* Premium pages have a clear loudest moment and quiet supporting passages.
- **Contrast risk:** `--muted (#71717A)` and especially `--muted-2 (#A1A1AA)` on `--paper` sit near or below WCAG AA for small text. The mono `type-mono-sm` labels (uppercase, 11px, muted) are used heavily and are the most at-risk.

**Fix:** introduce hierarchy *between* sections — one oversized "hero feature," variable section heights, at least one full-bleed moment. Let the page breathe unevenly.

---

## 5. Layout Audit — does each section earn its place?

The homepage contains **every** canonical SaaS section: Hero → Stats → Feature bento → How-it-works → Big-stats (dark) → Integrations → Pricing → Final CTA. Most are justified, but:

- **Stats band (`0–100`, `<10 min`, `5 types`, `99.9%`):** mixes *spec facts* (BANT range, webhook count) with *vanity/aspirational* claims (99.9% uptime SLA — is that contractual?). It reads as "we needed a stats band," which is the template talking. Either make them all verifiable product facts or cut it.
- **"Numbers that move" dark band (87% / 3× / <2 min / 10 min):** these are the fabricated hero metrics. Beautiful section, unearned content.
- **`/solutions`:** four near-identical text blocks in a row — the weakest layout on the site. It exists because "every SaaS has a solutions page," not because it communicates. It desperately needs a product visual per solution.
- **Two consecutive near-identical 3-column card grids** on `/customers` (personas, then case studies) look like the same component rendered twice.

**Best-earned sections:** Contact (real address/phone/GST), Security (named real vendor stack), Docs (real endpoints/payloads), the `/integrations` interactive filter grid. These are where the site stops performing and starts *being* a product.

---

## 6. Product Authenticity — the core finding

**This is the audit's headline. Fix this before anything else.**

**Count:** Across the entire site, sections that **describe or simulate** the product outnumber sections that **show the real product** by roughly ∞-to-0. There is **not a single real screenshot of the actual application anywhere on the site.**

**The evidence:**
- `public/images/` is **empty** (0 bytes of content).
- Every "product" visual is a **hand-built JSX facsimile**: the chat window, the analytics dashboard, the BANT ring, the live console, the terminal cards. Gorgeous, and entirely synthetic.
- Blog posts reference `.webp` hero images that **do not exist** (`public/images/blog/` has no directory); the `image` field in `blog.ts` is dead data, and every blog card renders a "post preview" placeholder tile.

**The aggravating factor:** The real product **exists and is rich.** `oye-chats-platform` ships ~30 real screens: `Dashboard`, `Analytics`, `Leads`, `LiveChat`, `Qualification`, `KnowledgeBase`, `Webhooks`, `Insights`, `Chatbot`, `BotSettings`, `Integrations`, `Billing`, and more. **The website could screenshot any of them today and does not.** The gap is a *choice*, not a *constraint*.

**Why this is fatal to a Series A read:** Investors and technical buyers pattern-match on *"do they show the actual thing?"* A site this polished that shows only mockups triggers the exact opposite of the intended effect — it signals *the product may not look this good, or may not exist yet.* Premium SaaS **demonstrates**; weak SaaS **describes**. This site describes beautifully.

**Recommendation (Priority 1):**
1. Capture 8–12 real, high-DPI screenshots of the actual platform (Dashboard, Leads with a BANT score, LiveChat handoff, KnowledgeBase ingest, Analytics, Webhooks config).
2. Frame them in the existing `TerminalCard`/browser-chrome treatment so they inherit the design language.
3. Replace the synthetic `/features` mockups and populate the empty `/solutions` visuals with them.
4. Best of all: embed the **real widget** live on the site so a visitor can *talk to OyeChats about OyeChats* and watch their own BANT score rise. That single move would make the product undeniable.

---

## 7. Content Audit

**Above average — genuinely product-specific in most places, which is rare.** The copy could *not* be dropped into any SaaS: BANT scoring, hybrid RAG (vector + TSVECTOR), the credit model, 5 HMAC-signed webhook events, and live-operator handoff recur consistently across features, pricing, blog, changelog, and docs. Credit where due.

**But the following must be rewritten or cut:**

| Problem | Verbatim | Fix |
|---|---|---|
| **False reality claim** | `/customers` heading *"Real teams, real outcomes."* over data the code labels *"Illustrative case studies."* | Either get real customers or reframe honestly: "How a team like yours would use OyeChats." |
| **Templated case studies** | Acme (implied DTC), Northwind, Quill all get the *same* B2B-sales narrative about "reps" and "Slack escalation" — a DTC brand narrated with sales-rep language. | One real case study beats three fake ones. Cut to zero until you have one real. |
| **Absolute/overclaims** | "No hallucinations," "100% Citation rate," "Zero-latency conversations," "safe with us," "Enterprise-grade security" (with **zero** third-party certs) | Hedge to defensible truth: "grounded, cited answers," "sub-second streaming," "GDPR-aligned." Drop the badge-wall styling that implies SOC2/ISO you don't have. |
| **Vocabulary loops** | "ship" ×3 pages; "Ships to your stack" reused; "A real human, exactly when it matters" duplicated | De-duplicate; give each surface its own line. |
| **Self-attributed "testimonial"** | Pull quote credited to "OyeChats Team" | That's a slogan, not proof. Label it as a manifesto line or replace with a real quote. |
| **Cross-page inconsistency** | Deploy time is "5 min" (About) vs "10 minutes" (case-study CTA); changelog cadence "every two weeks" (meta) vs "Weekly" (hero) | Pick one number, use it everywhere. |

**Strong, keep-as-is:** the pricing copy (real credit costs, seat economics, honest ~20% annual math), the docs (real endpoints, real payload), the security vendor stack (Postgres, ARQ+Redis, Sentry, Cloudflare R2, bcrypt, HMAC-SHA256), and the blog/changelog technical depth (a working RRF Python snippet, semver discipline).

---

## 8. Component Audit

**Primitive quality is high.** `Button` (6 well-differentiated variants with inner-highlight + ring detailing), `Card`, `Chip`, `Accordion` (grid-rows height animation — the correct modern technique), `Table`, `Input` — all are considered, consistent, and accessible-by-default (pointer cursors, focus-visible rings, reduced-motion handling).

**The repetition to break:**
- **The `w-10 h-10 rounded bg-volt-tint text-volt` icon square** is the site's signature — and it appears in the feature bento, mega-menu, integrations, about, security, and solutions. It is *everywhere*. Signature or crutch? Right now, crutch. Introduce 2–3 alternate icon treatments so it stays special.
- **"Learn more" / "Read case study →" / "See all →"** link pattern repeats without variation. Vary the affordance.
- **The two-column "text+checklist / visual"** appears 4× on `/features` and 4× on `/solutions`. Break it.
- **Three stacked comparison tables** on `/pricing` are the flattest stretch of any page.

**Where variation is *correctly* used:** the customer detail template (large metric numbers + prose + inverted CTA), the Contact asymmetric 2-col, the Security four-treatment page. These prove the team *can* break the grid — they just don't do it enough.

---

## 9. Design System Audit

**Coherent to a fault.** Radius scale (`6/8/12/16/24/full`), three-tier elevation, a warm neutral ramp, one accent with tints, and a clean token→Tailwind bridge (`@theme inline`). This is real design-systems work.

**The critique: consistency has become monotony.** Because *every* card is `bg-canvas border-line rounded-[r-3] shadow-e1`, *every* section is `py-16 md:py-32 border-b`, and *every* eyebrow is `mono-sm + volt line`, the site has one texture from top to bottom. Premium products **intentionally break their own system** at high-value moments — a full-bleed image, an oversized number, a section with no border, a card with a different radius. Voltage Paper needs 3–4 sanctioned "rule-breaks."

**Loose ends:**
- `DESIGN.md` (the system's own spec, referenced in `globals.css` and multiple components as "rule R-03") is **absent from the repo.** The source of truth is missing.
- A large keyframe library is defined in `globals.css` (`word-out`, `traveling-dot`, `cta-ring`, `badge-glow`, etc.); verify each is actually used or prune — unused animation tokens are a maintenance smell.

---

## 10. Motion Audit

**Mostly purposeful and restrained — a strength.** `Reveal` (once-only IntersectionObserver, reduced-motion aware), `NumberTicker` (eased count-up on view), the BANT ring fill (1.4s ease), the aurora drift (12s, 0.35 opacity — genuinely tasteful), and the marquee are all *doing a job*. `prefers-reduced-motion` is respected globally. This is above the bar.

**Where motion becomes theater:**
- The **`FinalCTA` live console** — a ticking clock, a shuffling event feed, an animating sparkline, pinging "world-map" nodes. It's charming and well-built, but it simulates liveness that isn't real, and the "demo signals · anonymized" caption is an honesty patch on a fundamentally decorative element. Consider making it *actually* live (real anonymized events) or dialing it back so it doesn't over-promise.
- The **`animate-badge-glow`** on "Recommended" pricing and pinging nodes edge toward decoration.

**Verdict:** motion is 80% meaningful, 20% performance. Better than most. Keep the guidance-motion (reveal, ticker, BANT fill); question the liveness-theater.

---

## 11. Product Storytelling

The homepage **does** tell a story, and a good one: *"You only talk to buyers"* → **Ingest / Qualify / Route** (the three-step spine) → the numbers → integrations → pricing → CTA. The problem-solution-proof-action arc exists.

**The break in the narrative:** the "proof" beat is **fabricated**, so the story is *"here's the transformation… illustrated with invented evidence."* A narrative is only as strong as its proof node. Right now the site tells a confident story to a skeptical reader and hands them fiction at the exact moment they ask "prove it."

**Better flow:** Hook → **show the real product doing the thing** (embedded widget) → the mechanism (Ingest/Qualify/Route) → **one real customer's numbers** → objection-handling (security/pricing) → CTA. Replace the two fabricated stat bands with one real proof beat.

---

## 12. Emotional Design

- **Intended (and delivered on first pass):** confidence, competence, technical credibility, calm.
- **Delivered on scrutiny:** a subtle *distrust* — the "everything here is staged" feeling once you notice the empty images folder's worth of simulations.

Software worth paying for should leave you feeling *"these people have built the real thing and they're proud of it."* This site currently leaves a sharp technical buyer feeling *"these people are excellent designers — I hope the product is as good as the website."* That gap is the emotional debt to repay.

---

## 13. Trust Audit

| Signal | Status |
|---|---|
| Physical address, phone, **GST number** (Contact) | ✅ **Real and strong** — the site's best legitimacy anchor |
| Named real vendor stack (Security) | ✅ **Credible** (Postgres, Redis, Sentry, Cloudflare R2, bcrypt, HMAC) |
| Real developer docs + downloadable `openapi.json` | ✅ **Present and real** (486KB spec confirmed) |
| Real brand integration logos (`simple-icons`) | ✅ Legitimate trust-by-association |
| Customer logos | ❌ Lucide icons in tinted squares, not logos |
| Testimonials | ❌ First-name+initial, no photo, no company link — fabricated pattern |
| Case-study metrics | ❌ Round, uniformly flattering, unsourced, templated |
| Third-party certifications | ❌ None — yet the Security page *styles* itself like a compliance wall |
| Founders / team / faces | ❌ Absent; "Meet the team" promised in meta, never shown |
| Responsible disclosure | ⚠️ Routes to `support@`, not `security@` — weakens the "program" claim |

**Net:** Trust is real where the site *stops marketing* (Contact, Security substance, Docs) and fabricated where it *tries to impress* (Customers, testimonials, hero stats). Invert that ratio.

---

## 14. Product Maturity Read

- **On craft:** Series A. The design system, type, and component quality are genuinely at that level.
- **On evidence:** Seed / pre-launch. No real customers, team-persona bylines ("AI Team," "Growth Team"), no faces, no logos, a roadmap item dated **"Coming in early 2027"** (on a 2026 site), and self-labeled "illustrative" case studies.

**The mismatch is the problem.** A site that *looks* Series A but *proves* seed creates cognitive dissonance that reads as **overselling**. Align them: either add real proof to match the craft, or let a little more honest "we're early, here's exactly what's real today" texture through. Early-and-honest beats polished-and-hollow with the investors and buyers who matter.

---

## 15. Premium Score

| Category | Score | Reason for deduction |
|---|---:|---|
| Brand Identity | 6.0 / 10 | Distinctive execution of a non-distinctive genre; BANT ring under-exploited; no human/illustration DNA; missing `DESIGN.md`. |
| Visual Design | 8.5 / 10 | Genuinely excellent type, color, spacing, and detailing. The site's standout strength. |
| Hierarchy | 7.0 / 10 | Superb at component scale; flat at page scale; muted-text contrast risk. |
| Layout | 6.5 / 10 | Every template section present; `/solutions` and `/customers` are repetitive; stat bands feel obligatory. |
| Motion | 7.5 / 10 | Mostly purposeful and reduced-motion-safe; some liveness-theater. |
| Originality | 6.0 / 10 | Escapes AI tells but sits squarely in the "premium dev-tool" template genre. |
| Trust | 4.0 / 10 | Fabricated customers/testimonials/stats; "Real teams, real outcomes" over admitted fiction; no certs behind an enterprise-security frame. |
| Product Story | 5.5 / 10 | Good arc, fabricated proof node; narrative undercut by staged evidence. |
| UX | 7.5 / 10 | Clean nav, real mega-menu, interactive integrations filter, good forms with honeypot. |
| Accessibility | 7.0 / 10 | focus-visible, aria, reduced-motion, semantic tables — strong; muted-on-paper contrast and 11px uppercase mono labels are the risks. |
| Performance | 7.0 / 10 | Mostly CSS-driven, but 4 Google font families + framer-motion + many always-on animations; verify LCP/CLS on the hero. |
| **Premium Feel** | **7.5 / 10** | High on arrival, erodes on inspection. |
| **OVERALL** | **≈ 6.6 / 10** | *Premium shell, unproven core.* |

---

## Implementation Roadmap

Effort = rough build cost. Impact = effect on perceived product quality / conversion / investor read.

### Priority 1 — Highest ROI (do these first)

| # | Action | Effort | Impact |
|---|---|---|---|
| P1-1 | **Capture 8–12 real product screenshots** (Dashboard, Leads+BANT, LiveChat handoff, KnowledgeBase ingest, Analytics, Webhooks). Frame in existing browser/terminal chrome. Replace the synthetic `/features` mockups and fill the empty `/solutions` visuals. | M | 🔥🔥🔥 Single biggest lever. Converts "beautiful mockups" into "real product." |
| P1-2 | **Embed the real widget live on the homepage** — let visitors talk to OyeChats about OyeChats and watch their own BANT score rise. | M–L | 🔥🔥🔥 Turns the whole "show don't tell" problem into the site's hero moment. |
| P1-3 | **Fix the customer/trust fabrication.** Remove "Real teams, real outcomes" over fake data. Cut fake case studies to zero; ship one real one, or reframe honestly as "how a team like yours uses it." | S | 🔥🔥🔥 Removes the Series-A-killing credibility risk. |
| P1-4 | **De-risk the overclaims:** drop "no hallucinations," "100% citation," "zero-latency," "safe with us"; stop styling Security like a cert wall you don't have. | S | 🔥🔥 Protects credibility with technical buyers. |
| P1-5 | **Add real humans** — founders/team with names + photos on About; replace "OyeChats Team" pull-quote with a real voice. | S | 🔥🔥 Trust + brand DNA. |

### Priority 2 — Medium impact

| # | Action | Effort | Impact |
|---|---|---|---|
| P2-1 | **Break the section monotony.** Introduce 3–4 sanctioned system-breaks: one oversized "hero feature," a full-bleed moment, variable section heights, one borderless section. | M | 🔥🔥 Fixes flat page-scale hierarchy. |
| P2-2 | **Rebuild `/solutions`** — kill the ×4 identical template; give each solution a real screenshot and a distinct layout. | M | 🔥🔥 Currently the weakest page. |
| P2-3 | **De-duplicate copy** — retire the one-gradient-word formula on at least one page; remove "ship"/"stack" loops and the verbatim-repeated Live-Chat and webhook blocks. | S | 🔥 Removes the "generated" fingerprint. |
| P2-4 | **Source or cut every metric.** Add footnotes/attribution to "Up to 60%", "3.4×", the stat bands — or delete them. | S | 🔥🔥 Turns vanity numbers into evidence. |
| P2-5 | **Ship the blog images** (or a real generated-illustration system) so posts stop rendering "post preview" placeholders. | S–M | 🔥 Completes the editorial layer. |
| P2-6 | **Fix cross-page inconsistencies** (5 vs 10 min; weekly vs biweekly; CSM vs account manager; Sentry de-branding; Zcal referenced but not integrated). | S | 🔥 Signals precision. |

### Priority 3 — Polish

| # | Action | Effort | Impact |
|---|---|---|---|
| P3-1 | Raise muted-text contrast (`--muted-2` especially) to clear WCAG AA; re-check 11px uppercase mono labels. | S | ♿ Accessibility + legibility. |
| P3-2 | Make the `FinalCTA` console *actually* live (real anonymized events) or dial back the liveness-theater. | M | ✨ Integrity of motion. |
| P3-3 | Elevate the **BANT ring** to a true brand signature (favicon, loaders, recurring motif, OG images). | S | 🎯 Ownable brand asset. |
| P3-4 | Restore/author **`DESIGN.md`** so the system's referenced spec exists; prune unused keyframes. | S | 🧹 System hygiene. |
| P3-5 | Add a real `security@` disclosure address; add real OG/social preview images per page. | S | 🔒 Trust polish. |
| P3-6 | Audit font/animation payload for LCP/CLS on the hero (4 families + always-on aurora/marquee). | S | ⚡ Performance. |

---

## The single sentence to remember

**You have built a Series-A website around a seed-stage story — and the real product that would close that gap is sitting one folder away, unused. Show the real thing, tell the truth about proof, and this goes from an 6.6 to a 9.**

---

## Appendix — what is genuinely excellent (do not touch)

So the roadmap isn't read as "it's all bad": the typographic system, the Voltage Paper token architecture, the `Button`/`Accordion`/`Table` primitives, the reduced-motion discipline, the real developer docs, the honest Contact/GST/vendor-stack details, the pricing transparency, and the restraint of the aurora/reveal motion are all genuinely high-craft and above the SaaS baseline. The problem is never the design. It's the distance between how real the *design* looks and how real the *evidence* is.
