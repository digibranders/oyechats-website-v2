# OyeChats Website v2 — Content Audit Report

**Date:** 2026-07-13
**Scope:** Every user-facing string in `oyechats-website-v2/` — pages, components, metadata, forms, error messages, empty states, CTAs, navigation, footer, changelog, blog, and marketing copy.
**Lens:** Senior UX writer / content strategist reviewing the site before launch. Goal: make the copy clear for **non-engineers** while keeping a premium, enterprise-grade tone — and **without changing UI, layout, logic, or product meaning.**
**Companion docs:** `CONTENT_STYLE_GUIDE.md` (the rules) · `CONTENT_CHANGELOG.md` (every change made).

> **One-line verdict:** The writing is already strong — concrete, confident, engineer-respecting. The two things dragging it down were (1) a handful of **claims the product can't back** (SOC 2, a fake CLI, "5 channels") and (2) **implementation-first phrasing** in places a first-time visitor lands. Both are now fixed in code. What remains is polish and proof (real screenshots), not a rewrite.

---

## How to read the scores

Each page is scored 1–10 on six axes. Higher is better **except Technical Complexity**, where higher = *more jargon-heavy / harder for a non-engineer* (so lower is better there).

- **Readability** — can someone outside the industry follow it?
- **Professionalism** — does it read premium, or like internal notes?
- **Trust** — does it inspire confidence / is it verifiable?
- **Consistency** — same names, tone, and claims as the rest of the site?
- **Technical Complexity** — jargon load (10 = wall of jargon, 1 = plain English)

---

## Global Scorecard (post-edit)

| Page / Surface | Overall | Readability | Professionalism | Trust | Consistency | Tech Complexity |
|---|---|---|---|---|---|---|
| Homepage (`/`) | 8.5 | 8 | 9 | 8 | 9 | 4 |
| Features (`/features`) | 8.0 | 7 | 9 | 8 | 8 | 6 |
| Solutions (`/solutions`) | 8.5 | 9 | 9 | 8 | 9 | 3 |
| Pricing (`/pricing`) | 9.0 | 9 | 9 | 9 | 9 | 3 |
| About (`/about`) | 8.0 | 8 | 8 | 8 | 8 | 3 |
| Contact (`/contact`) | 8.5 | 9 | 8 | 8 | 9 | 2 |
| Security (`/security`) | 9.5 | 8 | 10 | 10 | 10 | 5 |
| Docs (`/docs`) | 9.0 | 8 | 9 | 9 | 9 | 6 |
| Integrations (`/integrations`) | 8.5 | 8 | 9 | 8 | 9 | 5 |
| Changelog (`/changelog`) | 8.5 | 8 | 9 | 9 | 9 | 4 |
| Blog (`/blog`, posts) | 9.0 | 8 | 9 | 8 | 9 | 6 |
| Navbar / Footer / Announcement | 8.5 | 9 | 9 | 8 | 9 | 3 |
| Legal (`/legal/*`) | 9.0 | 8 | 10 | 10 | 9 | 4 |
| 404 / Empty / Error states | 8.5 | 9 | 8 | 8 | 9 | 2 |

**Site average (overall): ~8.6 / 10** after edits. Before edits the trust-weighted average was dragged to ~6.5 by the false claims.

---

================================
## PAGE: Homepage (`/`)
================================

**Overall: 8.5/10** · Readability 8 · Professionalism 9 · Trust 8 · Consistency 9 · Tech Complexity 4

**Recommendations**
- ✅ The hero line ("You only talk to buyers") is excellent — short, benefit-first. Keep.
- ✅ **Fixed:** the "Ingest" step showed a fictional `npx oyechats init` CLI. No CLI exists; onboarding is a `<script>` tag. Replaced with the real script-tag flow.
- ✅ **Fixed:** feature-card CTA was the filler "Learn more →". Now "See how it works →" and the deep-links actually resolve to the right section.
- Keep the "Numbers you can verify" dark band — it's the honest replacement for the old fabricated outcome stats and it's working.
- Consider (design, out of scope here): one real product screenshot in the hero instead of the animated mock.

| Current Text | Problem | Improved Copy | Reason | Priority |
|---|---|---|---|---|
| `npx oyechats init` + `// crawls docs.acme.com · builds vector index · deploys` | **False** — there is no CLI; the real install is a script tag (see `/docs`). Actively misleads developers. | `// paste one script tag — we crawl and index the rest` → `<script src="cdn.oyechats.com/widget.js" data-bot-key="…">` → `→ crawled docs.acme.com · indexed 1,247 passages` | Truth. Matches the actual onboarding shown on `/docs`. | **High** |
| "Learn more →" (×6 feature cards) | Filler CTA; says nothing about what happens. | "See how it works →" | CTA should hint at the payoff, not restate "link". | Medium |
| `/features#${f.slug}` deep-links | **Broken** — slugs (`bant-scoring`, etc.) don't match section IDs (`feature-bant`). Clicking scrolled nowhere. | Added `anchor` field mapping each card to a real section ID; fallback to `/features`. | A CTA that scrolls nowhere reads as broken. | Medium |
| "OyeChats crawls your docs… Hybrid semantic + keyword index built in minutes." | "Hybrid semantic + keyword index" is jargon on the first scroll. | "Point OyeChats at your docs… It reads them and builds a searchable index in minutes — no engineering required." | Same meaning, plain-English, adds the "no eng" reassurance. | Medium |
| Hero subhead ("…answers every visitor from your own docs — in real time, with citations…") | None — strong. | *(kept)* | Concrete, benefit-led. | — |

---

================================
## PAGE: Features (`/features`)
================================

**Overall: 8.0/10** · Readability 7 · Professionalism 9 · Trust 8 · Consistency 8 · Tech Complexity 6

**Recommendations**
- ✅ **Fixed (critical):** the live-chat demo had the bot say **"Yes, SOC2 Type II."** The company is **not** SOC 2 certified — and the site's own `/security` page says so. This was a self-contradiction shipping in production. Rewritten to an honest data-handling exchange.
- ✅ **Fixed:** RAG "Embed" step used vague jargon ("semantic meaning the AI can reason over"). Reworded to plain English; relabeled the step "Understand".
- ✅ **Fixed:** the mock analytics panel was labeled "Live" with invented numbers. Relabeled "Sample" (consistent with the final-CTA console reframe).
- This is the most technical marketing page — appropriate for its audience, but glossary-style first-mentions would help (see Style Guide).

| Current Text | Problem | Improved Copy | Reason | Priority |
|---|---|---|---|---|
| "Hey, do you support SOC2?" / "Yes, SOC2 Type II." | **False claim** contradicting `/security`; the highest-stakes trust line on the page was fiction. | "How do you handle our data?" / "Encrypted in transit and at rest, GDPR-aligned, and we never train models on your data. Want the details?" | Truth + it *leads with* real, verifiable strengths. | **High** |
| "Embed — Converts your content into semantic meaning the AI can reason over." | Jargon; "semantic meaning the AI can reason over" is engineer-speak. | "Understand — Turns your content into a form the AI can search by meaning, not just exact words." | Explains the benefit without the buzzword. | Medium |
| Analytics panel `Chip: Live` | Implies real-time real data; it's a static mock. | `Chip: Sample` | Honesty; matches the sample-labeled console elsewhere. | Medium |
| "Optional reranking and relevance filtering for precise answers" | Reranking is off by default; wording implies it's always on. | *(kept — it says "Optional", which is accurate)* | Already hedged correctly. | Low |
| Hero: "Each one deep, each one wired to the next, no bolt-ons." | None — good. | *(kept)* | Confident, concrete. | — |

---

================================
## PAGE: Solutions (`/solutions`)
================================

**Overall: 8.5/10** · Readability 9 · Professionalism 9 · Trust 8 · Consistency 9 · Tech Complexity 3

**Recommendations**
- ✅ **Fixed (critical):** all four "outcome" metrics were **fabricated** — *Up to 60% tickets deflected, Up to 3.4x leads, Typically <5s, Typically <25s*. No source in the product. Replaced with **verifiable, capability-based** figures.
- The long-form body copy here is the best on the site: plain, human, benefit-led ("Instead of hiding behind a contact form, meet the visitor in a chat that already sounds like a discovery call"). Keep.

| Current Text | Problem | Improved Copy | Reason | Priority |
|---|---|---|---|---|
| Outcome: **Up to 60%** "of routine tickets deflected" | Invented statistic presented as fact. | **24/7** "first-line answers from your own docs — no scripts to maintain" | True capability instead of a made-up number. | **High** |
| Outcome: **Up to 3.4x** "more qualified leads per visitor" | Invented statistic. | **0** "form fields — every lead is BANT-scored from the chat itself" | Verifiable and actually more distinctive. | **High** |
| Outcome: **Typically <5s** "to a cited answer" | Unmeasured latency claim. | **Every answer** "links back to the source doc it came from" | Real, checkable property. | **High** |
| Outcome: **Typically <25s** "to reach a human" | Unmeasured latency claim. | **1 click** "from bot to a human, with the full transcript attached" | Real, checkable property. | **High** |
| "Bot first, human second." | None — crisp. | *(kept)* | Memorable, accurate. | — |

---

================================
## PAGE: Pricing (`/pricing`)
================================

**Overall: 9.0/10** · Readability 9 · Professionalism 9 · Trust 9 · Consistency 9 · Tech Complexity 3

**Recommendations**
- The most trustworthy page on the site. Credit costs, top-up packs, and FAQ are concrete and honest. No changes needed.
- The FAQ is a model of the voice we want everywhere: "We never let costs run away. We hard-cap at zero, with a friendly message to visitors."
- **Note (not a copy fix):** platform vs. site price drift is tracked separately by the owner (decision: update the platform to match the site later). No website change.

| Current Text | Problem | Improved Copy | Reason | Priority |
|---|---|---|---|---|
| "Start free. Scale as you grow. Cancel anytime." | None. | *(kept)* | Clear value ladder. | — |
| FAQ answers | None — plain and reassuring. | *(kept)* | Best-in-class tone. | — |

---

================================
## PAGE: About (`/about`)
================================

**Overall: 8.0/10** · Readability 8 · Professionalism 8 · Trust 8 · Consistency 8 · Tech Complexity 3

**Recommendations**
- ✅ **Fixed:** the headline "We're defining the AI era of customer conversations" was exactly the empty-adjective register the rest of the site avoids. Rewritten to say what OyeChats actually does.
- The "Where we work" section is honest and human (one Thane HQ, remote-first). Keep.
- Consider (out of scope): a named founder to raise Trust — currently the only attribution is "OyeChats Team".

| Current Text | Problem | Improved Copy | Reason | Priority |
|---|---|---|---|---|
| "We're defining the AI era of customer conversations." | Buzzword headline; says nothing concrete. | "We help teams answer every visitor — and **qualify** the ones worth calling." | States the actual value in plain words. | **High** |
| Subhead: "…RAG-powered chat platform that turns your knowledge base into a real-time customer agent…" | "RAG-powered" + "customer agent" is jargon in the first paragraph a visitor reads. | "…turns your knowledge base into a chat assistant that answers questions from your own content, scores each visitor as they chat, and hands the hot ones to your team — all in one conversation." | Same claim, zero jargon. | Medium |
| Vision block copy (Support/Sales/Live Chat/E-com) | None — clear and status-tagged (Live/Soon). | *(kept)* | Honest roadmap framing. | — |

---

================================
## PAGE: Contact (`/contact`)
================================

**Overall: 8.5/10** · Readability 9 · Professionalism 8 · Trust 8 · Consistency 9 · Tech Complexity 2

**Recommendations**
- ✅ **Fixed:** the API returned raw technical errors ("name, email, and message are required", "Failed to send email", "Email service not configured") straight into the form UI. All rewritten to human, action-oriented messages.
- Form labels, placeholders, and the success state ("Message sent") are already good.
- "Let's talk pipeline" is slightly insider-y but on-brand and confident; kept.

| Current Text | Problem | Improved Copy | Reason | Priority |
|---|---|---|---|---|
| "name, email, and message are required" | Technical, lowercase, lists field names like a validator. | "Please add your name, email, and a short message." | Human, sentence case, tells the user what to do. | **High** |
| "Invalid email address" | Blunt. | "That email address doesn't look right. Please check it and try again." | Friendlier, actionable. | Medium |
| "Failed to send email" / "Network error sending email" | Exposes internals; no next step. | "We couldn't send your message just now. Please try again in a moment, or email support@oyechats.com." | Reassures + gives a fallback. | **High** |
| "Email service not configured" (503) | Internal state leaked to the user. | "We can't send messages right now. Please email us at support@oyechats.com." | Users don't need our config state. | **High** |
| "Too many requests. Please try again later." | Robotic. | "You've sent a few messages already. Please wait a few minutes and try again." | Warmer, same meaning. | Medium |

---

================================
## PAGE: Security (`/security`)
================================

**Overall: 9.5/10** · Readability 8 · Professionalism 10 · Trust 10 · Consistency 10 · Tech Complexity 5

**Recommendations**
- **This is the model for the whole site.** It explicitly states what's *not* in place ("does not yet hold formal third-party certifications such as SOC 2 or ISO 27001") and backs every claim. No changes.
- Every other page's security language should mirror this page's honesty — which, after this pass, it now does.

| Current Text | Problem | Improved Copy | Reason | Priority |
|---|---|---|---|---|
| "No vague assurances. Here is exactly how we protect your data…" | None — exemplary. | *(kept)* | Sets the trust bar. | — |

---

================================
## PAGE: Docs (`/docs`)
================================

**Overall: 9.0/10** · Readability 8 · Professionalism 9 · Trust 9 · Consistency 9 · Tech Complexity 6

**Recommendations**
- Honest and useful — confirms the real onboarding is a script tag (this is what the homepage now matches).
- Technical by design and appropriate for the audience. No changes.

| Current Text | Problem | Improved Copy | Reason | Priority |
|---|---|---|---|---|
| "Four steps from signup to a working chat widget. The whole flow takes about five minutes." | None. | *(kept)* | Clear, honest, scannable. | — |

---

================================
## PAGE: Integrations (`/integrations`)
================================

**Overall: 8.5/10** · Readability 8 · Professionalism 9 · Trust 8 · Consistency 9 · Tech Complexity 5

**Recommendations**
- ✅ **Fixed:** the empty state was a dead-end ("No integrations match your search."). Now it suggests a next step and reminds users webhooks cover anything.
- ✅ **Fixed:** two install labels overclaimed/contradicted their own text — WordPress said "Plugin" beside "Paste one script tag"; Shopify said "App" beside "Add the script to your theme". Relabeled "Script" / "Embed" to match reality.
- Webhook setup steps and payload examples are clear and consistent with `/docs` and `/features`.

| Current Text | Problem | Improved Copy | Reason | Priority |
|---|---|---|---|---|
| Empty state: "No integrations match your search." | Dead-end; no next step. | "No integrations match your search yet. Try a different name, or clear the filters to see everything. Every event also ships to any tool via signed webhooks." | Recovers the user; reinforces capability. | Medium |
| WordPress `install: Plugin` (beside "Paste one script tag") | Overclaims a native plugin; contradicts its own description. | `install: Script` | Accuracy + internal consistency. | Medium |
| Shopify `install: App` (beside "Add the script to your theme") | Overclaims a native Shopify app. | `install: Embed` | Accuracy. | Medium |

---

================================
## PAGE: Changelog (`/changelog`)
================================

**Overall: 8.5/10** · Readability 8 · Professionalism 9 · Trust 9 · Consistency 9 · Tech Complexity 4

**Recommendations**
- ✅ **Fixed:** cadence contradiction — metadata said "shipped every two weeks", the page said "Weekly", and the entry dates are ~monthly. Both softened to "as they ship".
- ✅ **Fixed:** one real release was attributed to an invented individual ("Steve · Ingestion"). Changed to team-level attribution ("Ingestion Team"), matching every other entry.
- The entry copy itself is excellent — benefit-led, human ("No more stale answers, no more manual re-uploads").

| Current Text | Problem | Improved Copy | Reason | Priority |
|---|---|---|---|---|
| meta: "…shipped every two weeks" / body: "Weekly product updates" | Two different cadences, neither matches the dated entries. | meta + body → "…new features, improvements, and fixes as they ship." | Removes an unverifiable, self-contradicting cadence claim. | Medium |
| author "Steve · Ingestion" | Invented persona presented as a real author. | "Ingestion Team" | Team-level attribution is both honest and consistent with the other 9 entries. | Medium |

---

================================
## PAGE: Blog (`/blog`, posts)
================================

**Overall: 9.0/10** · Readability 8 · Professionalism 9 · Trust 8 · Consistency 9 · Tech Complexity 6

**Recommendations**
- The five posts are genuinely well-written for a technical audience — answer-first, plain-spoken, no filler. Left as-is by design (blog is a different genre than marketing pages; Grade 7–9 doesn't apply to an "AI Engineering" essay).
- The internal claims inside posts ("in our internal evaluation, hybrid beat vector alone on roughly nineteen of twenty…") are acceptable in a first-person engineering-blog voice.
- **Note (design, not copy):** post images point at `/images/blog/*.webp` but `public/images/` is empty, so cards show placeholder text ("post preview"). Add art or the cards read unfinished.

| Current Text | Problem | Improved Copy | Reason | Priority |
|---|---|---|---|---|
| "Ideas from the team." | None — right voice for a blog. | *(kept)* | Warm, unpretentious. | — |
| Post bodies | None — strong. | *(kept)* | Appropriate depth for the audience. | — |

---

================================
## Navbar / Footer / Announcement Bar
================================

**Overall: 8.5/10** · Readability 9 · Professionalism 9 · Trust 8 · Consistency 9 · Tech Complexity 3

**Recommendations**
- ✅ **Fixed:** Navbar mega-menu links pointed at non-existent anchors (`#bant-scoring` vs real `#feature-bant`), so they silently failed to scroll. Repointed to real section IDs.
- ✅ **Fixed:** the footer wordmark rendered the internal codename "**/ voltage-paper**" to customers. Removed.
- ✅ **Fixed:** the (currently disabled) Announcement Bar contained the codename "Voltage Paper v1.0 shipped" and the **false** "Live handoff across 5 channels" (web widget only). Rewritten to true, benefit-led items.
- **Note:** the footer "All systems operational" chip is hardcoded with no status source behind it. Not a fabricated *metric*, but it asserts live health it can't prove. Recommend wiring it to a real status source or making it a neutral link. (Left unchanged pending a status page.)

| Current Text | Problem | Improved Copy | Reason | Priority |
|---|---|---|---|---|
| Announcement: "Live handoff across 5 channels" | **False** — web widget only; no WhatsApp/IG/Messenger/Slack inbound. | "Hand off to a human in the same thread" | Truth; still a strong benefit. | **High** |
| Announcement: "Voltage Paper v1.0 shipped" | Internal design-system codename shown as a product milestone. | "Auto-recrawl keeps your knowledge base fresh" | Customers don't know/care what the CSS is called. | Medium |
| Footer wordmark: "/ voltage-paper" | Codename leak. | *(removed)* | Same reason. | Medium |
| Nav mega-menu `#bant-scoring`, `#grounded-rag`, `#live-handoff`, `#easy-integration`, `#analytics` | Broken anchors — none exist on `/features`. | `#feature-bant`, `#feature-rag`, `#feature-live-chat`, `#feature-integrations`, `#feature-analytics` | Deep links now actually scroll. | Medium |
| Footer chip: "All systems operational" | No status source behind the claim. | *(left; flagged)* | Needs a real status feed, not a copy edit. | Medium |

---

================================
## 404 / Empty / Loading / Error / Toast states
================================

**Overall: 8.5/10** · Readability 9 · Professionalism 8 · Trust 8 · Consistency 9 · Tech Complexity 2

**Recommendations**
- 404 ("Nothing here." + "The page you're looking for moved, was renamed, or never existed.") is friendly and on-brand. Kept.
- Contact success state ("Message sent" / "Thanks, we'll get back to you within one business day.") is good. Kept.
- All server/validation errors are now human (see Contact section).

| Current Text | Problem | Improved Copy | Reason | Priority |
|---|---|---|---|---|
| 404: "Nothing here." | None. | *(kept)* | Calm, clear, offers two exits. | — |
| Integrations empty state | Dead-end (fixed above). | *(see Integrations)* | — | Medium |

---

## Global Findings

### Most confusing terminology (glossed or removed)
- **RAG / "hybrid semantic + keyword RAG"** — fine on `/features` and `/docs`; removed from the homepage/about first-scroll in favour of "answers from your own docs, with sources".
- **"semantic meaning the AI can reason over"** — replaced with "search by meaning, not just exact words".
- **"customer agent" / "conversational agent"** — standardized to "chat assistant" in marketing prose.
- **TSVECTOR, embeddings, vector index, reranking** — kept only on technical pages (`/features`, `/docs`, blog), never on the first thing a non-engineer reads.

### Technical jargon to remove (from marketing surfaces)
Done: `npx … init` (fake CLI), "SOC2 Type II" (false), "semantic meaning", "RAG-powered … agent" in the About lede. Remaining acceptable on technical pages only.

### Inconsistent naming (now standardized — see Style Guide)
- The product is **OyeChats**; the deployed thing is a **chatbot / your bot / assistant** (category noun kept as "chatbot" for SEO). Avoid "engine", "pipeline", "agent" as product synonyms in marketing.
- **BANT** is always glossed as *Budget, Authority, Need, Timeline* on first use.
- **"Easy integration" → "Easy setup"** on cards/menus, matching the "one script tag" story.

### Weak CTAs (fixed)
- "Learn more →" → "See how it works →" (homepage cards).
- Broken deep-link CTAs (nav + homepage) now resolve to real sections.
- Strong CTAs already present and kept: "Start free", "Talk to sales", "Contact sales", "See pricing", "Send message", "Read the docs".

### Weak headlines (fixed)
- About: "We're defining the AI era of customer conversations" → "We help teams answer every visitor — and qualify the ones worth calling."
- Everything else (Homepage "You only talk to buyers", Security "Security, documented", Solutions "Bot first, human second") is strong.

### Weak / implementation-first feature descriptions (fixed)
- Feature blurbs rewritten from *what it is* to *what you get* (e.g. "Grounded answers" now leads with "comes from your own docs and links back to the source").
- Solutions outcomes reframed from invented metrics to verifiable capabilities.

### Claims that were FALSE or unverifiable (all resolved in code)
| Claim | Where | Resolution |
|---|---|---|
| "Yes, SOC2 Type II" | features live-chat demo | Replaced with honest data-handling exchange |
| `npx oyechats init` CLI | homepage "Ingest" | Replaced with real script-tag flow |
| "Live handoff across 5 channels" | announcement bar | "Hand off to a human in the same thread" |
| "Up to 60% / 3.4x / <5s / <25s" outcomes | solutions | Verifiable capability figures |
| "Voltage Paper" codename | footer + announcement | Removed |
| Invented author "Steve · Ingestion" | changelog | "Ingestion Team" |
| WordPress "Plugin" / Shopify "App" | integrations | "Script" / "Embed" |
| Cadence "every two weeks" / "Weekly" | changelog | "as they ship" |

### SEO / metadata
- Titles and descriptions are already strong, benefit-led, and honest (`layout.tsx`, per-page `metadata`). The `%s · OyeChats` template and canonical tags are correct.
- Changelog meta cadence claim corrected (above).
- Keep the keyword set factual ("BANT qualification", "RAG chatbot", "lead qualification") — all map to real features.

### Accessibility (copy-side)
- Icon-only social links have `aria-label`s; brand SVGs have `aria-label`. Good.
- Recommend (design, noted in the product-design audit): raise contrast on `type-mono-sm` muted micro-labels, and add a pause control to auto-rotating sample data.

### Grammar / mechanics
- Clean throughout. Standardize on **curly apostrophes** in prose (mostly already done); the new error strings use `'` intentionally.
- Keep the em-dash cadence consistent (used well already).

### Tone inconsistencies (resolved)
- The site had one honest register (Security, Pricing, Docs, Solutions body) and one over-confident register (SOC 2 line, fabricated outcomes, codename). The edits pull everything onto the honest register.

### Content hierarchy
- Strong eyebrow → heading → sub rhythm site-wide. The one risk is *sameness* (flagged in the product-design audit) — a copy fix can't solve that; it needs a layout break and a real product shot.

### Pages needing major rewrites
- **None.** No page needed a wholesale rewrite. The work was surgical: kill false claims, de-jargon the first-scroll surfaces, humanize errors/empty states.

### Quick wins (all shipped this pass)
- Delete the fake CLI · kill the SOC 2 line · fix the 4 fabricated outcomes · humanize contact errors · fix broken nav anchors · remove the codename · fix the "Learn more" filler · improve the integrations empty state.

### Highest-impact remaining (not copy — proof)
1. **Add real product screenshots** to `public/images/` (hero widget, one analytics view, one BANT timeline). This is the single biggest trust lever left and it's not a writing task.
2. **Wire "All systems operational"** to a real status source, or neutralize it.
3. **Name a founder** on `/about` for a human trust signal.
