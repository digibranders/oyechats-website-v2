# OyeChats — Voltage Paper

Full rebuild of oyechats.com on the **Voltage Paper** design system — a technical-modern light theme with warm paper neutrals, near-black ink, and a single electric violet accent.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- TypeScript (strict)
- Framer Motion (micro-interactions only)
- Lucide React icons

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
├── app/                    # Next.js App Router routes
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Home
│   ├── about/
│   ├── features/
│   ├── solutions/
│   ├── integrations/
│   ├── pricing/
│   ├── customers/
│   ├── docs/
│   ├── blog/
│   ├── changelog/
│   ├── contact/
│   ├── security/
│   ├── legal/              # 7 sub-pages
│   └── globals.css         # Voltage Paper tokens
├── components/
│   ├── ds/                 # Design system: primitives + composed + signatures
│   ├── site/               # Nav, Footer, page-specific composed sections
│   └── ui/                 # Local UI helpers
├── lib/                    # constants, pricing, integrations, blog data
└── types/                  # shared TS types
```

## Design system

The complete design brief lives in `DESIGN.md` (getdesign.md format) in the original repo.
A live HTML showcase is `design-system.html` in the original repo.

## Rules for future edits

1. Never invent new tokens. Add to `DESIGN.md` first.
2. Never introduce a new hero style. Use `DottedGrid` + `TerminalCard` + `ChatBubble` + `BantScoreRing`.
3. Never highlight a multi-word phrase in Volt. One word max per hero.
4. Never render `--muted` at body size for content. Meta only.
5. Never add decoration to already-elevated components.
6. When in doubt, remove.
