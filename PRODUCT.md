# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two co-primary, equally weighted markets — neither is the fallback for the other:

1. **India SMB / mid-market**, buying in INR through the `/in` pricing path.
2. **Global (English-speaking) SMB / mid-market**, buying in USD.

Within both, the person who evaluates OyeChats is usually the one who will also
install it: a founder, growth lead, or support lead at a company small enough
that the evaluator and the implementer are the same person. They arrive from
search or comparison shopping, are mid-evaluation against named competitors,
and are deciding whether a chatbot can qualify leads without a form. They are
technical enough to paste a script tag and read `/docs`, but the first scroll of
the homepage must land for a non-engineer.

The site must be a first-class experience in either currency and geography.
Geo-routing decides the currency, not the quality of the argument.

## Product Purpose

OyeChats is an AI chatbot for websites that answers visitor questions from the
customer's own documents and scores every conversation for sales intent, so the
business only spends human time on buyers.

The website's job is to take a stranger mid-evaluation and get them to register
for the platform (`app.oyechats.com`). Success is a qualified signup, not a
demo request — there is no sales-call gate in the funnel.

## Positioning

Qualification happens **inside the conversation, with zero form fields**. Every
chat is BANT-scored (Budget, Authority, Need, Timeline) from what the visitor
actually said, and every answer is grounded in the customer's own documents.
A neighboring chatbot product can copy "AI chat"; it
cannot truthfully copy "no form fields, and every lead is already scored."

Secondary differentiators, all live: one-script-tag install, one-click handoff to
a human with the full transcript attached, and multi-bot support.

## Operating Context

- The buyer is comparison-shopping. `/compare/[slug]` pages exist because named
  competitor comparison is part of the real evaluation path.
- Evaluation is self-serve end to end: read → try the widget → register. No
  gated demo, no mandatory sales conversation.
- The live OyeChats widget runs on the marketing site itself. The product is
  demonstrating itself to the visitor while they read about it.
- `/docs`, `/security`, and seven `/legal` sub-pages exist because a
  self-serve buyer does their own diligence and never asks a salesperson.
- `SystemStatus` reads live from the platform API's `/health`. Operational
  honesty is on the page, not in a promise.

## Capabilities and Constraints

**Confirmed, shipping:** streaming answers; grounded answers over the customer's
docs (hybrid RAG); BANT lead scoring; live human handoff; one-line widget
install; brand-voice customization; built-in security; analytics; webhooks and
REST API; multi-bot support.

**Hard product boundaries — do not imply otherwise:**

- Web widget only. Not omnichannel, not multi-channel.
- No CLI and no SDK/package. The install is one script tag.
- BANT only. MEDDIC is not implemented.
- **Answers are grounded, but never cited.** Retrieval over the customer's own
  content is real (hybrid RAG). What does not exist is any citation or source
  link shown to the visitor: the platform prompt explicitly forbids mentioning
  sources, and the streaming response carries no source data. Commit `1795f3e`
  removed these claims once; they regressed into pricing, comparison, and legal
  copy and were removed again on 2026-08-13. "Cited", "citations", "sourced",
  and "links back to the source" are all false. Say "grounded" and stop there.
  The `C-1` assertion in `scripts/verify-html.mjs` now fails the build on any
  of them.

**Terminology is fixed** and governed by `CONTENT_STYLE_GUIDE.md`: "your
chatbot" (never "AI agent" in marketing), "the widget", "grounded answers"
(gloss it), "BANT scoring" (always expand on first use), "live handoff".
Describe a feature the same way on every page.

**Stack constraint:** Next.js 16 App Router, React 19, Tailwind v4, TypeScript
strict, `motion` for micro-interactions only, Lucide icons. `npm run verify`
(lint → typecheck → build → verify:html) is the gate.

## Brand Commitments

- **Name and wordmark:** OyeChats. The one-word spelling is the entity; schema
  carries `alternateName: "Oye Chats"` so the spaced spelling resolves to it.
  Search has also confused the brand with WeChat — the two are close in edit
  distance and a young domain loses that disambiguation. A
  `disambiguatingDescription` addressing this was drafted but is **not currently
  in the codebase** (it was discarded with an abandoned working branch on
  2026-08-13). Treat re-adding it as an open item, not a shipped defense.
- **Voice is documented and binding** (`CONTENT_STYLE_GUIDE.md`): honest, clear,
  confident, concrete. Reference points are Stripe, Linear, and Anthropic.
  Banned vocabulary: revolutionary, cutting-edge, game-changing, unleash,
  supercharge, seamless, 10x, next-gen. No exclamation marks, no hedging.
- **Honesty is the product.** "If we can't back it, we cut it." A prior audit
  removed fabricated testimonials, invented statistics, and false security
  claims (SOC 2, region counts, self-hosting). That correction is permanent.
- **The Voltage Paper design system is binding.** Warm paper neutrals, near-black
  ink, a single electric violet accent. Its standing rules: never invent tokens
  outside the system; never introduce a new hero style; never highlight more than
  one word in Volt. Future work extends this world rather than replacing it. A
  2026-07-13 audit scored the earlier site ~6.5/10 — that is a mandate to execute
  the system better, not to rebrand.

## Evidence on Hand

**Real and usable:**

- The live widget on the site — the product demonstrates itself.
- A genuine changelog with two named, real authors (Gaurav, Steve) and dated
  entries.
- Real technical documentation, security page, and seven legal documents.
- A real blog with substantive posts.
- Live platform health surfaced via `SystemStatus`.
- Transparent, published pricing in both INR and USD.

**Confirmed absent — must never be fabricated:**

- No customer testimonials anywhere in the codebase.
- No customer logos. The `LogoCloud` component exists but is deliberately
  unused; populating it requires real, permissioned customers.
- No published usage metrics or outcome statistics.

**OPEN DECISION — not yet answered by the user:** whether named customers,
logos, or defensible usage metrics now exist and may be published. Until
answered, future work must assume they do not and must lead with the product
itself as proof. Ask before adding any social-proof section.

## Product Principles

1. **Practice what you preach.** The widget on this site is the demo. A page
   that describes conversational qualification while hiding the conversation is
   arguing against itself.
2. **Honesty is the differentiator, not a constraint.** Every claim traces to a
   shipped capability. Absent proof is stated plainly, never simulated.
3. **Show the mechanism.** This audience distrusts "AI magic." Name the actual
   thing — grounded in your docs, scored on BANT, one script tag.
4. **Self-serve or nothing.** Every question a buyer would ask a salesperson is
   answerable on the site. No step in the path requires a human.
5. **Two markets, one argument.** Currency and geography change; the reasoning,
   the quality, and the respect for the reader do not.

## Accessibility & Inclusion

No project-specific standard has been established with the user. Treat WCAG 2.2
AA as the working floor — the general Impeccable baseline — and confirm before
any work that would depend on a stricter commitment.
