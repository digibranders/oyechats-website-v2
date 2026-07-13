# OyeChats — Content Style Guide

**Purpose:** One consistent voice for every word on the OyeChats website. Use this when writing or editing any page, component, form, error, empty state, tooltip, CTA, or metadata.
**Companion docs:** `CONTENT_AUDIT.md` (findings) · `CONTENT_CHANGELOG.md` (changes made).

---

## 1. Brand Voice

OyeChats sounds like a **calm, technical expert who respects your time** — closer to Stripe, Linear, and Anthropic than to a hype-driven SaaS ad.

Four traits, in priority order:

1. **Honest** — we only claim what the product does. If we can't back it, we cut it. Trust *is* the product.
2. **Clear** — one idea per sentence. A non-engineer should understand the value; an engineer should respect the accuracy.
3. **Confident** — short declaratives, no hedging, no exclamation marks. "You only talk to buyers." not "You could talk to more buyers!"
4. **Concrete** — describe outcomes and real mechanisms, never vague "AI magic".

**We are not:** salesy, hype-y, buzzword-heavy, or robotic. No "revolutionary", "cutting-edge", "game-changing", "unleash", "supercharge", "seamless", "10x", "next-gen".

---

## 2. Tone by Surface

Tone shifts with context, but voice never does.

| Surface | Tone | Jargon budget |
|---|---|---|
| Homepage, About, Solutions (first scroll) | Warm, benefit-led, plain | **None.** Explain the payoff. |
| Features | Confident, precise | Medium — technical terms OK, glossed on first use. |
| Docs, API, Webhooks | Direct, instructional | High — the audience is developers. |
| Blog | First-person, essay | High — depth is the point. |
| Pricing | Reassuring, transparent | Low. |
| Security, Legal | Precise, plain, no spin | Medium — accuracy over simplicity; never soften a limitation. |
| Errors, empty states, toasts | Human, calm, helpful | None. |

---

## 3. Reading Level

- **Marketing surfaces (home, about, solutions, pricing intro, CTAs, errors, empty states):** target **Grade 7–9**. Short sentences. One idea per paragraph. Scannable.
- **Technical surfaces (features, docs, blog):** clarity over grade level — but still plain where a plain word exists.
- Enterprise ≠ complicated. If a smart 14-year-old couldn't follow the homepage, simplify it.

---

## 4. Terminology (use one name per concept)

| Concept | ✅ Use | ❌ Avoid |
|---|---|---|
| The product | **OyeChats** | "the platform" as a name, "the tool" |
| What the customer deploys | **your chatbot**, **your bot**, **your assistant** | "engine", "pipeline", "AI agent" (in marketing) |
| The on-site embed | **the widget**, **one script tag** | "SDK", "CLI", "package" (no CLI exists) |
| Retrieval feature | **grounded answers** (gloss: "answers from your own docs, with sources") | leading with "RAG" on marketing pages |
| Qualification feature | **BANT scoring** — always gloss *Budget, Authority, Need, Timeline* on first use | "MEDDIC" (not implemented) |
| Human escalation | **live handoff**, **hand off to a human** | "omnichannel", "multi-channel" (web widget only) |
| Setup | **easy setup**, **one line of code** | "integration" as a verb-noun everywhere |

**Product acronyms:** `RAG`, `TSVECTOR`, `embeddings`, `reranking`, `vector index`, `HMAC` — allowed on `/features`, `/docs`, and the blog. **Not** on the homepage/about first scroll.

**Consistency rule:** describe the same feature the same way on every page. If Features calls it "grounded answers", the homepage and nav must too.

---

## 5. Writing Rules

1. **Lead with the outcome, not the implementation.**
   - ❌ "Uses hybrid semantic + keyword RAG over a pgvector index."
   - ✅ "Answers come from your own docs and link back to the source."
2. **One idea per sentence. Break long paragraphs.**
3. **Cut hedges and filler:** "simply", "just", "basically", "in order to", "leverage", "utilize" → "use".
4. **Prefer the active voice and present tense.** "OyeChats scores each chat", not "chats are scored".
5. **Numbers must be real.** Every stat is either verifiable from the product or cut. No "up to X%", no round invented multiples. (See §9.)
6. **Second person.** Talk to "you" (the customer). The visitor on their site is "the visitor".
7. **Sentence case** for headings, buttons, labels, and chips. Not Title Case, not ALL CAPS (except the intentional mono eyebrows in the design system).
8. **No internal codenames** in customer-facing copy (e.g. never "Voltage Paper").

---

## 6. CTA Guidelines

Every button says **what happens next**. Verb + object beats a bare verb.

| ❌ Weak | ✅ Strong |
|---|---|
| "Learn more" | "See how it works" |
| "Continue" | "Continue to dashboard" |
| "Submit" | "Send message" |
| "Generate" | "Generate SEO strategy" |
| "Go" | "Start free" |

**Approved primary CTAs (keep consistent):** `Start free` · `Talk to sales` · `Contact sales` · `See pricing` · `Read the docs` · `Send message` · `Get started`.

Rules:
- One primary action per view; everything else is `ghost`/`link`.
- Keep an arrow (`→`) on forward-motion CTAs; don't mix arrow styles.
- Match the CTA to the destination ("Read the docs" → `/docs`).

---

## 7. Error Message Guidelines

Structure: **what happened (plain) → what to do next → a fallback if relevant.** Never expose HTTP codes, stack traces, or internal state.

| ❌ Technical | ✅ Human |
|---|---|
| "HTTP 500" / "Failed to send email" | "We couldn't send your message just now. Please try again in a moment, or email support@oyechats.com." |
| "name, email, and message are required" | "Please add your name, email, and a short message." |
| "Invalid email address" | "That email address doesn't look right. Please check it and try again." |
| "Email service not configured" | "We can't send messages right now. Please email us at support@oyechats.com." |
| "Too many requests" | "You've sent a few messages already. Please wait a few minutes and try again." |

Rules: sentence case, calm tone, no blame ("you entered…" → "please check…"), always offer a way forward.

---

## 8. Empty State Guidelines

An empty state is an instruction, not a status. Structure: **plain statement → the one action that fills it → a reassurance if useful.**

| ❌ | ✅ |
|---|---|
| "No data" | "You haven't created any projects yet. Create your first project to start generating content." |
| "No integrations match your search." | "No integrations match your search yet. Try a different name, or clear the filters to see everything. Every event also ships to any tool via signed webhooks." |

Rules: never dead-end the user; name the next step; keep it short.

---

## 9. Claims & Proof (non-negotiable)

This is where trust is won or lost. Every claim must pass one test: **can we back it with the product or a cited source?**

- **Only claim shipped capabilities.** No SOC 2 / ISO unless certified. No channels we don't have. No CLI we didn't build.
- **Numbers:** verifiable stack facts ("768 vector dimensions", "200 free credits", "5 webhook events", "0–100 BANT") are encouraged. Outcome stats ("60% deflection", "3.4x leads") are **banned** unless attributed to a real, named study or pilot ("in an internal pilot, N=…").
- **Mocks and samples** must be labeled ("Sample", "Illustrative — not live customer data"). Never present a mock as live telemetry.
- **Mirror the `/security` page's honesty everywhere.** It openly states what's *not* in place — that candor is the brand's biggest trust asset.
- When in doubt, **cut the claim.** The real product is strong enough to sell on the truth.

---

## 10. Mechanics & Formatting

- **Apostrophes/quotes:** curly (`'` `"`) in prose.
- **Dashes:** em dash `—` for asides (no surrounding spaces in tight display copy, spaced in body). En dash `–` for ranges (`0–100`).
- **Numbers:** numerals for stats and money (`5 webhook events`, `$19/mo`); spell out one–nine only in flowing blog prose.
- **Currency:** `$19 / month`, `$372/yr` — match existing pricing format.
- **Ampersands:** only in tight labels ("Webhooks & REST API"); "and" in sentences.
- **Lists:** parallel structure; start each bullet with the same part of speech.
- **Product name:** always "OyeChats" (one word, camel-cased O and C). Never "Oye Chats" or "oyechats" in prose.

---

## 11. Quick Checklist (before shipping any copy)

- [ ] Would a non-engineer understand the value in one read?
- [ ] Is every claim backable by the product? (If not — cut it.)
- [ ] Does each CTA say what happens next?
- [ ] Any jargon that could be plain English on a marketing surface?
- [ ] Same feature named the same way as elsewhere on the site?
- [ ] Errors/empty states human, calm, and pointing to a next step?
- [ ] No internal codenames, no hype words, no invented numbers?
- [ ] Sentence case, curly quotes, real product name?
