# SEO / AEO / GEO Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every code-fixable finding in `SEO_AEO_GEO_AUDIT_2026-07-29.md`, taking Overall SEO from 62 → ~90 and AI Search Readiness from 48 → ~85, without altering one word of visible page copy.

**Architecture:** Three structural moves carry most of the value. (1) A checked-in **HTML assertion harness** that runs against the compiled output — the audit's three critical bugs all passed `lint`, `tsc` and `build`, so output assertions are the only control that would have caught them. (2) **Centralised metadata and schema helpers** in `src/lib/seo.ts`, so `og:image`, `@id` anchors and JSON-LD escaping are structurally impossible to omit per-page. (3) **Generated GEO assets** (`llms.txt`, `llms-full.txt`) derived from the same typed modules that generate the sitemap, so they cannot drift from the product the way the current hand-written file did.

**Tech Stack:** Next.js 16.2.1 (App Router) · React 19.2.4 · TypeScript 5.9 strict · Tailwind CSS v4 (CSS-first, no config file) · Vercel · Node ≥20

---

## Global Constraints

Every task's requirements implicitly include this section.

- **No visible page copy may change.** No rewriting headings, paragraphs, hero text, CTAs, button labels, or marketing messaging. Changing an HTML *tag* while keeping its text and CSS class is allowed and is how most AEO tasks are executed. `<title>` and `<meta name="description">` are metadata, not page copy, and ARE in scope.
- **No fabricated facts.** Do not add `aggregateRating`, `review`, `foundingDate`, `telephone`, `streetAddress`, `addressRegion`, legal entity name, or any `Person` author. The only permitted location facts are `addressLocality: "Thane"` and `addressCountry: "IN"`, both sourced from `OFFICES` in `src/app/about/page.tsx:72`.
- **Canonical host is exactly `https://www.oyechats.com`** — no trailing slash on the origin constant.
- **Tailwind v4 is CSS-first.** There is no `tailwind.config.*`. New design tokens go in the `@theme inline` block in `src/app/globals.css`. A utility class that has no matching token silently matches nothing (this is finding F-6).
- **Every task ends green:** `npm run verify` must pass before review (defined in Task 1).
- **Every task ends with a code review, then a commit.** See *Review Gate* below. The review runs on the staged diff, before the commit lands.
- **Never mark a task complete on an unverified build.** If tooling cannot run, stop and report — do not proceed on assumption.

## Review Gate

Insert this as the second-to-last step of every task, between "Verify" and "Commit". Do not skip it, and do not review your own work in the same pass that wrote it — the value comes from a reader who has not just spent an hour inside the file.

```
- [ ] Step N-1: Code review

Stage the change, then review the staged diff against this checklist:

    git add -A && git --no-pager diff --staged

1. CORRECTNESS  Does it do what the task said? Any off-by-one, inverted
   condition, or wrong variable? Trace one real input end to end.
2. TYPES        Every import resolves to a real export. No `any`, no
   non-null `!` hiding a genuine nullable. Discriminated unions handled
   exhaustively.
3. CONTRACT     Does it match the Interfaces block of this task? Do names
   and signatures agree with the tasks that consume them?
4. CONSTRAINTS  No visible page copy changed. No fabricated facts. Tokens
   used exist in @theme inline. Re-read Global Constraints.
5. REGRESSION   What did this file do before that it must still do? Check
   the "already correct" list in the audit — several behaviours are load-
   bearing and easy to destroy (Accordion DOM retention, FadeUp's
   skipAnimation initial state, WidgetLoader's intent gating).
6. DEAD CODE    Imports, variables, props left unused by this change.

Record the verdict inline. If anything is found, fix it and re-run
`npm run verify` before committing — do not commit "with a note".
```

When executing via `superpowers:subagent-driven-development`, this gate is the second-stage review and should be run by a **fresh subagent** with no memory of writing the code. Running it in the same context that authored the change is the weaker form; do that only when a subagent is unavailable.

- **Commits** use Conventional Commits, matching existing history (`feat:`, `fix:`, `style:`, `docs:`, `perf:`, `refactor:`).

---

## Current State — read before starting

There is an **uncommitted, unverified** change set in the working tree from the audit session. Task 2 reconciles it. Do not start at Task 3 assuming a clean tree.

Modified: `src/lib/seo.ts`, `src/lib/site.ts`, `src/app/layout.tsx`, `src/components/site/Footer.tsx`, `src/app/globals.css`, `src/app/features/page.tsx`, `src/app/solutions/page.tsx`, `src/components/ds/Chip.tsx`, `src/components/site/HeroDemo.tsx`.
Untracked: `SEO_AEO_GEO_AUDIT_2026-07-29.md`.

---

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `scripts/verify-html.mjs` | **New.** Asserts compiled HTML in `.next/server/app`. The regression gate. | 1 |
| `src/lib/seo.ts` | Metadata + schema helpers: `pageMeta`, `jsonLd`, `buildGraph`, `siteGraph`, `ID`, `abs` | 2, 4 |
| `src/lib/site.ts` | Nav/footer/link constants, `SOCIAL_LINKS`, `SUPPORT_EMAIL` | 2 |
| `src/lib/blog.ts` | Post data, `getRelatedPosts`, `updatedISO` | 5, 12 |
| `src/lib/legal.ts` | Legal docs; inline link markers | 13 |
| `src/lib/llms.ts` | **New.** Serialises typed modules to the llms.txt formats | 17 |
| `src/app/llms.txt/route.ts` | **New.** Generated GEO summary | 17 |
| `src/app/llms-full.txt/route.ts` | **New.** Generated full-text corpus | 18 |
| `src/app/error.tsx`, `src/app/global-error.tsx` | **New.** Route + root error boundaries | 15 |
| `src/components/ds/PricingPrice.tsx` | **New.** Server-safe price rendering | 3 |
| `src/components/site/Breadcrumbs.tsx` | **New.** Visible breadcrumb trail | 14 |

---

# PHASE 0 — Unblock and instrument

## Task 1: Restore tooling, then build the HTML assertion harness

**Covers:** the BLOCKER, plus the verification gate every later task depends on.

**Files:**
- Create: `scripts/verify-html.mjs`
- Modify: `package.json` (scripts block)

**Interfaces:**
- Produces: `npm run verify` — runs `tsc --noEmit`, `eslint`, `next build`, then HTML assertions. Every later task's final step calls it.
- Produces: assertion registry shape `{ id, file, must?, mustNot?, minCount?, test? }` in `scripts/verify-html.mjs`, extended by later tasks.

- [ ] **Step 1: Diagnose — iCloud Drive is syncing the repo**

**Root cause: the repo lives under `~/Desktop`, which iCloud Drive syncs.** Any
process that reads *many* files under the repo — above all `node_modules` — blocks
indefinitely at 0% CPU waiting on iCloud's file provider.

Proof, four independent measurements:

| Test | Result |
|---|---|
| `tsc` on `/tmp/probe.ts`, cwd `/tmp` | **2.4 s**, 13% CPU ✓ |
| `tsc` on a **project** file, cwd `/tmp`, `--skipLibCheck` | **0.17 s**, 185% CPU ✓ |
| `tsc` on `/tmp/probe.ts`, cwd **project** | blocked, 0% CPU ✗ |
| Full project `tsc` from a `/tmp` copy, `node_modules` symlinked back to the repo | blocked, 0% CPU ✗ |

The last row is decisive: identical sources outside iCloud still block, because
`node_modules` resolution reaches back into the synced folder. A single file with
`--skipLibCheck` succeeds because it never touches `node_modules` at scale.

Corroborating evidence:

```
$ brctl status
    Needs Apply Changes:
    Under /.Trash/.next 2/dev/logs        ← iCloud actively syncing .next
  client:needs-sync  server:...  needs-sync-up|needs-sync-down|in-sync-up
  last-reset: CKUnderlyingErrorContainerReset
$ ls -d .next/*" "*
.next/cache 3
.next/dev 3                              ← iCloud conflict copies
```

`.next/cache 3` and `.next/dev 3` are iCloud conflict-copy naming. A build
directory should never be synced at all.

**Two earlier hypotheses were tested and are wrong — do not chase them.**
*Memory/swap*: real (12.4 G of 13.3 G used at one point) but incidental — the block
persisted with swap at 0.00 M. *Sandboxing*: the block persisted with the sandbox
disabled.

- [ ] **Step 2: Move the repo out of iCloud's reach**

```bash
mkdir -p ~/dev
mv ~/Desktop/AI/OyeChats ~/dev/OyeChats
cd ~/dev/OyeChats/oyechats-website
rm -rf .next                 # discard iCloud conflict copies
npm install                  # re-link binaries at the new path
```

Then reopen the editor at the new path. Alternatively, turn off System Settings →
Apple ID → iCloud → iCloud Drive → **Desktop & Documents Folders** — but moving the
repo is safer, since that toggle can pull files down or evict them.

Verify:

```bash
time npx tsc --noEmit
```
Expected: completes in seconds. Do not proceed until it does — every task below
verifies through `npm run verify`, and running them blind produces an
unverifiable diff, which is the exact failure mode that let the original defects
ship.

<details>
<summary>Superseded diagnosis (kept for the record)</summary>

**Root cause: memory exhaustion, not disk or network.** Measured on 2026-07-29:

```
vm.swapusage: total = 10240.00M  used = 9105.88M  free = 1134.12M
Pageins: 9,658,539
load average: 7.16 (with no build running)
```

Symptom signature — a memory-hungry process blocks on paging while a tiny one is instant:

| Process | Wall | CPU | Verdict |
|---|---|---|---|
| `node -e "console.log(1)"` | 0.02 s | 88% | fits in RAM, fine |
| `tsc --version` | 0.4 s | — | exits before allocating |
| `tsc` on a **7-line** file | 150 s | **0.22 s (0%)** | blocked on swap |
| `next build` | >10 min, no output | 0% | blocked on swap |
| `git cat-file --batch-check` | 17 objects / 180 s | 0% | blocked on swap |

0% CPU over minutes means the process is **not computing** — it is waiting on page-ins. Anything needing ~1–2 GB (tsc, next build) stalls; anything tiny does not.

**Do not chase disk-level causes.** iCloud sync, Full Disk Access and AV exclusions were each considered and are ruled out by the evidence above: plain `node` read all 83 files in `src/` in 0.028 s, so filesystem access itself is healthy.

Run this to confirm before and after:

```bash
sysctl vm.swapusage
time ./node_modules/.bin/tsc --noEmit --skipLibCheck src/lib/cn.ts
```
Healthy: swap used well under capacity, and the typecheck completing in under 10 s.

- [ ] **Step 2: Free memory**

The dominant consumers observed were the IDE's TypeScript servers — **five or more `tsserver.js` processes, each launched with `--max-old-space-size=3072`** — alongside a browser holding several 400 MB+ renderers.

In order of preference:

1. **Restart the machine.** Fastest reliable fix; 9.6 M pageins means swap is deeply fragmented.
2. **Quit the IDE** (releases every `tsserver`), plus unneeded browser windows, then retest.
3. **Reduce the IDE's TS server heap** if this recurs: set `typescript.tsserver.maxTsServerMemory` to `2048` or lower, and close unused project windows — each open workspace root spawns its own pair of servers.
4. **Add RAM headroom for builds** if it still stalls: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`.

</details>

- [ ] **Step 3: Write the assertion harness**

Create `scripts/verify-html.mjs`:

```js
#!/usr/bin/env node
/**
 * Asserts facts about the COMPILED output in .next/server/app.
 *
 * Rationale: every critical defect found in the 2026-07-29 audit — 18 routes
 * with no og:image, "$0" rendered for every paid pricing tier, and a Tailwind
 * class that matched no CSS rule — passed `eslint`, `tsc --noEmit` AND
 * `next build`. Those three tools verify that code compiles, not that it
 * produces correct markup. This script closes that gap.
 *
 * Usage: node scripts/verify-html.mjs   (run AFTER `next build`)
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const APP_DIR = '.next/server/app';
const CSS_DIR = '.next/static/css';

if (!existsSync(APP_DIR)) {
  console.error(`✗ ${APP_DIR} not found — run \`next build\` first.`);
  process.exit(1);
}

/** Every compiled page, as { route, html }. Excludes framework error shells. */
function pages() {
  const out = [];
  const walk = (dir, prefix) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full, `${prefix}/${entry.name}`);
      else if (entry.name.endsWith('.html')) {
        const name = entry.name.replace(/\.html$/, '');
        if (name.startsWith('_')) continue;
        const route = name === 'index' ? '/' : `${prefix}/${name}`;
        out.push({ route, file: full, html: readFileSync(full, 'utf8') });
      }
    }
  };
  walk(APP_DIR, '');
  return out.sort((a, b) => a.route.localeCompare(b.route));
}

function allCss() {
  if (!existsSync(CSS_DIR)) return '';
  return readdirSync(CSS_DIR)
    .filter((f) => f.endsWith('.css'))
    .map((f) => readFileSync(join(CSS_DIR, f), 'utf8'))
    .join('\n');
}

const P = pages();
const CSS = allCss();
const failures = [];
const checks = [];

function check(id, fn) {
  checks.push(id);
  try {
    const problems = fn() ?? [];
    for (const p of problems) failures.push(`${id}: ${p}`);
  } catch (err) {
    failures.push(`${id}: threw ${err.message}`);
  }
}

// ── T-1: every indexable route must ship og:image and twitter:image ──────────
check('T-1 og:image on every route', () =>
  P.filter((p) => !p.html.includes('property="og:image"')).map(
    (p) => `${p.route} has no og:image`,
  ),
);
check('T-1 twitter:image on every route', () =>
  P.filter((p) => !p.html.includes('name="twitter:image"')).map(
    (p) => `${p.route} has no twitter:image`,
  ),
);

// ── P-1: pricing must never render a zeroed ticker for a paid tier ───────────
check('P-1 no $0 placeholder prices', () => {
  const pricing = P.find((p) => p.route === '/pricing');
  if (!pricing) return ['/pricing not built'];
  const zeros = pricing.html.match(/tabular-nums[^>]*>\$<!-- -->0</g) ?? [];
  return zeros.length ? [`/pricing renders ${zeros.length} "$0" price(s)`] : [];
});

// ── P-2: both billing currencies must be present in static HTML ─────────────
check('P-2 INR present on /pricing', () => {
  const pricing = P.find((p) => p.route === '/pricing');
  if (!pricing) return ['/pricing not built'];
  return pricing.html.includes('₹') ? [] : ['/pricing HTML contains no INR pricing'];
});

// ── T-2: title budget. Brand suffix is " · OyeChats" (11 chars). ─────────────
check('T-2 titles are substantive', () => {
  const bad = [];
  for (const p of P) {
    const m = p.html.match(/<title>([^<]*)<\/title>/);
    if (!m) { bad.push(`${p.route} has no <title>`); continue; }
    const len = m[1].length;
    if (len < 30) bad.push(`${p.route} title only ${len} chars: "${m[1]}"`);
    if (len > 65) bad.push(`${p.route} title ${len} chars (truncation risk): "${m[1]}"`);
  }
  return bad;
});

check('T-2 meta descriptions within budget', () => {
  const bad = [];
  for (const p of P) {
    const m = p.html.match(/<meta name="description" content="([^"]*)"/);
    if (!m) { bad.push(`${p.route} has no meta description`); continue; }
    const len = m[1].length;
    if (len < 70) bad.push(`${p.route} description only ${len} chars`);
    if (len > 165) bad.push(`${p.route} description ${len} chars (truncated in SERP)`);
  }
  return bad;
});

// ── S-2/S-8: JSON-LD must parse, be escaped, and carry @id ──────────────────
check('S-8 JSON-LD parses and is script-safe', () => {
  const bad = [];
  for (const p of P) {
    const blocks = [...p.html.matchAll(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    )];
    if (!blocks.length) { bad.push(`${p.route} emits no JSON-LD`); continue; }
    for (const [, raw] of blocks) {
      if (raw.includes('<')) bad.push(`${p.route} JSON-LD contains a raw "<" (unescaped)`);
      try { JSON.parse(raw); } catch (e) { bad.push(`${p.route} JSON-LD invalid: ${e.message}`); }
    }
  }
  return bad;
});

check('S-2 entity graph is connected by @id', () => {
  const bad = [];
  for (const p of P) {
    if (!p.html.includes('"@id":"https://www.oyechats.com/#organization"')) {
      bad.push(`${p.route} does not reference the canonical Organization @id`);
    }
  }
  return bad;
});

// ── L-1: /legal must be reachable by link, not only via sitemap ─────────────
check('L-1 /legal is not orphaned', () => {
  const linkers = P.filter((p) => p.html.includes('href="/legal"'));
  return linkers.length ? [] : ['/legal has zero inbound links across all compiled pages'];
});

// ── L-2: no blog post may have fewer than 3 inbound pages ──────────────────
check('L-2 blog posts have inbound links', () => {
  const posts = P.filter((p) => p.route.startsWith('/blog/'));
  const bad = [];
  for (const post of posts) {
    const n = P.filter((o) => o.route !== post.route && o.html.includes(`href="${post.route}"`)).length;
    if (n < 3) bad.push(`${post.route} has only ${n} inbound page(s)`);
  }
  return bad;
});

// ── A-2/F-12: heading structure must support passage extraction ─────────────
check('A-2 long pages have h3 subheadings', () => {
  const bad = [];
  for (const route of ['/features', '/solutions']) {
    const p = P.find((x) => x.route === route);
    if (!p) { bad.push(`${route} not built`); continue; }
    const h3 = (p.html.match(/<h3[\s>]/g) ?? []).length;
    if (h3 === 0) bad.push(`${route} has zero <h3> — content cannot chunk for AI retrieval`);
  }
  return bad;
});

check('F-12 no heading level is skipped', () => {
  const bad = [];
  for (const p of P) {
    const levels = [...p.html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
    let prev = 0;
    for (const lvl of levels) {
      if (prev && lvl > prev + 1) { bad.push(`${p.route} skips h${prev} → h${lvl}`); break; }
      prev = lvl;
    }
  }
  return bad;
});

check('F-12 exactly one h1 per route', () =>
  P.filter((p) => (p.html.match(/<h1[\s>]/g) ?? []).length !== 1).map(
    (p) => `${p.route} has ${(p.html.match(/<h1[\s>]/g) ?? []).length} h1 elements`,
  ),
);

// ── F-2/F-26: icons must never be the sole carrier of meaning ──────────────
check('F-2 no unlabelled icon-only table cells', () => {
  const pricing = P.find((p) => p.route === '/pricing');
  if (!pricing) return ['/pricing not built'];
  return pricing.html.includes('>Included<') && pricing.html.includes('>Not included<')
    ? []
    : ['/pricing comparison table has no text alternative for ✓/✗ cells'];
});

// ── F-6: every Tailwind class used must exist in the compiled CSS ──────────
check('F-6 no phantom design-token classes', () => {
  const tokens = ['volt-fg', 'signal-graphic'];
  const bad = [];
  for (const t of tokens) {
    const usedInHtml = P.some((p) => p.html.includes(t));
    if (usedInHtml && CSS && !CSS.includes(t)) {
      bad.push(`class using "${t}" ships in HTML but matches no compiled CSS rule`);
    }
  }
  return bad;
});

// ── F-8: skip link must exist ──────────────────────────────────────────────
check('F-8 skip link present', () =>
  P.filter((p) => !p.html.includes('href="#main"')).map((p) => `${p.route} has no skip link`),
);

// ── T-6: canonical must be present, absolute and www ───────────────────────
check('T-6 canonical is absolute and www', () => {
  const bad = [];
  for (const p of P) {
    const m = p.html.match(/<link rel="canonical" href="([^"]*)"/);
    if (!m) { bad.push(`${p.route} has no canonical`); continue; }
    if (!m[1].startsWith('https://www.oyechats.com')) {
      bad.push(`${p.route} canonical is not www-absolute: ${m[1]}`);
    }
  }
  return bad;
});

// ── Report ─────────────────────────────────────────────────────────────────
console.log(`Checked ${P.length} compiled routes across ${checks.length} assertions.`);
if (failures.length) {
  console.error(`\n✗ ${failures.length} failure(s):\n`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log('✓ all HTML assertions passed');
```

- [ ] **Step 4: Wire it into package.json**

Modify the `scripts` block in `package.json`:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "verify:html": "node scripts/verify-html.mjs",
    "verify": "npm run lint && npm run typecheck && npm run build && npm run verify:html"
  },
```

- [ ] **Step 5: Run it and watch it FAIL**

```bash
npm run verify
```

Expected: build succeeds, then `verify:html` exits 1 reporting roughly — 18 routes with no og:image, 3 `$0` prices on `/pricing`, no INR on `/pricing`, ~12 titles under 30 chars, `/legal` orphaned, 4 blog posts with <3 inbound, `/features` and `/solutions` with zero h3.

**This failing output is the acceptance criteria for the whole plan.** Save it:

```bash
npm run verify 2>&1 | tee /tmp/oyechats-baseline.txt
```

- [ ] **Step 6: Commit**

```bash
git add scripts/verify-html.mjs package.json
git commit -m "test: add compiled-HTML assertion harness

lint, tsc and next build all passed while the site shipped 18 routes with
no og:image, \$0 for every paid pricing tier, and a Tailwind class matching
no CSS rule. Those tools verify compilation, not output. This asserts on
the built HTML instead."
```

---

## Task 2: Reconcile the uncommitted audit-session changes

**Covers:** T-1 (partial), S-1, S-2 (helpers), L-1, F-5, F-7, F-8, F-12 (footer), P-14 (dead CSS).

The working tree already contains these edits, written but never compiled. Verify then commit — do not rewrite.

**Files:**
- Modify: `src/lib/seo.ts`, `src/lib/site.ts`, `src/app/layout.tsx`, `src/components/site/Footer.tsx`, `src/app/globals.css`, `src/app/features/page.tsx`, `src/app/solutions/page.tsx`, `src/components/ds/Chip.tsx`, `src/components/site/HeroDemo.tsx`

**Interfaces:**
- Produces: `SITE_URL`, `abs(path)`, `ID`, `jsonLd(schema)`, `pageMeta({title,description,path,image?})`, `siteGraph(featureList)`, `buildGraph({path,name,description,crumbs?,about?,dateModified?,nodes?,type?})` from `src/lib/seo.ts`
- Produces: `SOCIAL_LINKS: readonly {label,href}[]`, `SUPPORT_EMAIL: string` from `src/lib/site.ts`

- [ ] **Step 1: Typecheck the new helpers in isolation**

```bash
npx tsc --noEmit
```
Expected: clean. The likely failure is in `pricingOffers()` in `src/lib/seo.ts` — `PRICING_TIERS.flatMap` returning `[]` on one branch and objects on the other can infer `never[]`. If TS complains, annotate the return:

```ts
function pricingOffers(): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  for (const tier of PRICING_TIERS) {
    if (!tier.monthly) continue;
    for (const { code, region } of [
      { code: 'USD' as const, region: undefined },
      { code: 'INR' as const, region: 'IN' as const },
    ]) {
      out.push({
        '@type': 'Offer',
        '@id': `${SITE_URL}/pricing#offer-${tier.id}-${code.toLowerCase()}`,
        name: tier.name,
        url: `${SITE_URL}/pricing`,
        availability: 'https://schema.org/InStock',
        price: String(tier.monthly[code]),
        priceCurrency: code,
        ...(region ? { eligibleRegion: { '@type': 'Country', name: region } } : {}),
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: String(tier.monthly[code]),
          priceCurrency: code,
          billingIncrement: 1,
          unitCode: 'MON',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
        },
      });
    }
  }
  return out;
}
```

- [ ] **Step 2: Confirm no dangling reference to the deleted `NAV_LINKS`**

```bash
grep -rn "NAV_LINKS" src/
```
Expected: no output.

- [ ] **Step 3: Confirm the footer icon map covers every social label**

```bash
grep -n "label:" src/lib/site.ts | grep -A0 -E "LinkedIn|Instagram|X|GitHub"
grep -n "SOCIAL_ICONS" -A6 src/components/site/Footer.tsx
```
Expected: the four labels in `SOCIAL_LINKS` each have a key in `SOCIAL_ICONS`. A missing key renders an empty link, which is an accessibility regression.

- [ ] **Step 4: Run the harness**

```bash
npm run verify
```
Expected: og:image, skip-link, `/legal`-orphan and `@id` assertions now PASS. Title, `$0`, INR, h3 and blog-inbound assertions still FAIL — those are Tasks 3–12.

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo.ts src/lib/site.ts src/app/layout.tsx \
        src/components/site/Footer.tsx src/app/globals.css \
        src/app/features/page.tsx src/app/solutions/page.tsx \
        src/components/ds/Chip.tsx src/components/site/HeroDemo.tsx
git commit -m "feat(seo): connected entity graph, og:image on every route, a11y tokens

- pageMeta() now emits images; a page-level openGraph replaces the root one,
  so 18 routes were shipping with no og:image or twitter:image
- jsonLd() escapes <, >, & — blog content already contains a literal
  </script> that would break out the moment a schema field reads post content
- single Organization/WebSite/SoftwareApplication behind stable @ids,
  replacing five unlinked Organization nodes
- sameAs populated from the footer's own profile URLs
- /legal added to the footer: it had zero inbound links sitewide
- focus ring uses outline (3:1 + forced-colors safe), --signal darkened to
  meet AA at small sizes, --color-volt-fg declared (was a phantom class)"
```

---

# PHASE 1 — Critical correctness

## Task 3: Render real prices in static HTML

**Covers:** P-1 (critical), P-2 (critical), S-4.

The server renders `$0` for Starter, Standard and Professional because `NumberTicker` initialises `useState(0)`. The `Offer` schema on the same page says 9/19/39. That is a visible-content-vs-markup mismatch, and non-JS AI crawlers read `$0` as the price.

**Files:**
- Create: `src/components/ds/PricingPrice.tsx`
- Modify: `src/app/pricing/PricingClient.tsx:172-177`
- Modify: `src/components/ds/index.ts`

**Interfaces:**
- Consumes: `formatPrice`, `CURRENCY_SYMBOL`, `Currency` from `src/lib/pricing.ts`
- Produces: `<PricingPrice value={number} currency={Currency} />` — renders the real value on the server, animating only after mount.

- [ ] **Step 1: Add the failing assertion (already in the harness)**

Confirm it currently fails:

```bash
npm run build && node scripts/verify-html.mjs 2>&1 | grep "P-1\|P-2"
```
Expected: `P-1 no $0 placeholder prices: /pricing renders 3 "$0" price(s)` and `P-2 INR present on /pricing: /pricing HTML contains no INR pricing`.

- [ ] **Step 2: Create the server-safe price component**

Create `src/components/ds/PricingPrice.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { CURRENCY_SYMBOL, type Currency } from '@/lib/pricing';

/**
 * Renders a price. The server output is ALWAYS the real number.
 *
 * NumberTicker initialised its display state to 0, so the static HTML for
 * /pricing shipped "$0" for every paid tier while the page's own Offer schema
 * declared 9/19/39. Google renders JS and eventually sees the truth; GPTBot,
 * ClaudeBot, PerplexityBot and CCBot do not. Seeding state with the real value
 * keeps the count-up as pure post-hydration decoration.
 */
export function PricingPrice({
  value,
  currency,
  className,
}: {
  value: number;
  currency: Currency;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const animated = useRef(false);

  useEffect(() => {
    // Re-seed on currency/tier change without ever passing through 0.
    setDisplay(value);
  }, [value]);

  useEffect(() => {
    if (animated.current) return;
    animated.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (value <= 0) return;

    const DURATION = 900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span className={className}>
      {CURRENCY_SYMBOL[currency]}
      {display.toLocaleString()}
    </span>
  );
}
```

- [ ] **Step 3: Export it**

Add to `src/components/ds/index.ts`, alongside the existing exports:

```ts
export { PricingPrice } from './PricingPrice';
```

- [ ] **Step 4: Swap the usage**

In `src/app/pricing/PricingClient.tsx`, replace the `NumberTicker` block at lines 172-177:

```tsx
                        <PricingPrice
                          key={`${annual ? 'annual' : 'monthly'}-${currency}`}
                          value={price}
                          currency={currency}
                          className="tabular-nums"
                        />
```

Update the import: remove `NumberTicker`, add `PricingPrice`.

- [ ] **Step 5: Render both currencies into the DOM**

Still in `src/app/pricing/PricingClient.tsx`, the INR values must exist in static HTML. Wrap the price so the inactive currency is present but hidden — visible text is unchanged for every user, only the DOM gains the alternate value:

```tsx
{/* Both currencies ship in the HTML; CSS hides the inactive one. Crawlers
    that do not run JS (GPTBot, ClaudeBot, PerplexityBot) previously saw only
    USD, contradicting llms.txt which advertises INR pricing. */}
<span aria-hidden={currency !== 'USD'} hidden={currency !== 'USD'}>
  <PricingPrice value={money.USD} currency="USD" className="tabular-nums" />
</span>
<span aria-hidden={currency !== 'INR'} hidden={currency !== 'INR'}>
  <PricingPrice value={money.INR} currency="INR" className="tabular-nums" />
</span>
```

- [ ] **Step 6: Verify**

```bash
npm run verify
```
Expected: P-1 and P-2 assertions PASS. Manually confirm:

```bash
grep -o 'tabular-nums[^>]*>\$[0-9,]*' .next/server/app/pricing.html | head
grep -c '₹' .next/server/app/pricing.html
```
Expected: real dollar figures (9/19/39), and a non-zero rupee count.

- [ ] **Step 7: Commit**

```bash
git add src/components/ds/PricingPrice.tsx src/components/ds/index.ts src/app/pricing/PricingClient.tsx
git commit -m "fix(pricing): render real prices in static HTML

NumberTicker seeded display state to 0, so /pricing shipped \$0 for Starter,
Standard and Professional while its own AggregateOffer schema declared 9/19/39
— a visible-content-vs-markup mismatch. Non-JS AI crawlers read \$0 as fact.
Both currencies now ship in the DOM so INR is crawlable too."
```

---

## Task 4: Give money pages real titles and descriptions

**Covers:** T-2 (critical).

Twelve routes ship 15–24 character titles against a ~60 character budget. `/pricing` ships `Pricing · OyeChats`. These are metadata, not page copy.

**Files:**
- Modify: `src/app/pricing/page.tsx:7-13`, `src/app/features/page.tsx:44-49`, `src/app/solutions/page.tsx:16-21`, `src/app/integrations/page.tsx:8-14`, `src/app/docs/page.tsx:19-23`, `src/app/blog/page.tsx:7-12`, `src/app/about/page.tsx:15-20`, `src/app/security/page.tsx:27-32`, `src/app/changelog/page.tsx:6-11`, `src/app/contact/page.tsx:6-12`, `src/app/legal/page.tsx:8-12`
- Modify: `src/app/not-found.tsx` (add metadata export)

**Interfaces:**
- Consumes: `pageMeta` from `src/lib/seo.ts` (Task 2)

- [ ] **Step 1: Apply the new titles**

The root template appends ` · OyeChats` (11 chars), so the `title` argument should land at ~45 chars. Replace the `title:` argument at each call site. Descriptions marked (trim) exceed 165 chars today.

| File | New `title` |
|---|---|
| `pricing/page.tsx` | `AI Chatbot Pricing — Plans from Free` |
| `features/page.tsx` | `Features — RAG Answers & BANT Lead Scoring` |
| `solutions/page.tsx` | `Solutions for Support, Sales & Live Chat` |
| `integrations/page.tsx` | `Integrations — One Script Tag, Any Site` (trim description to ≤165) |
| `docs/page.tsx` | `Documentation — Install, Configure, Webhooks` |
| `blog/page.tsx` | `Blog — AI Chat, Lead Qualification & RAG` |
| `about/page.tsx` | `About OyeChats — The RAG AI Chat Platform` |
| `security/page.tsx` | `Security — Encryption, GDPR & Signed Webhooks` |
| `changelog/page.tsx` | `Changelog — Product Updates & Release Notes` |
| `contact/page.tsx` | `Contact Sales & Support` |
| `legal/page.tsx` | `Legal — Privacy, Terms, DPA & Sub-processors` |

For `/pricing`, also trim the description to ≤165 chars. Current is 179.

- [ ] **Step 2: Lengthen the seven legal child titles and thin descriptions**

The `/legal/*` pages take their title from `page.title` in `src/lib/legal.ts`, so `Cookie Policy · OyeChats` is 24 chars and its description is 51 — both below the harness floors. Add a dedicated `metaTitle` and lengthen the short descriptions in `src/lib/legal.ts`, leaving `title` (rendered as the visible `<h1>`) untouched:

```ts
export type LegalPage = {
  slug: string;
  title: string;
  /** Longer form used only in <title>. `title` stays the visible H1. */
  metaTitle: string;
  description: string;
  lastUpdated: string;
  // ...unchanged
};
```

Set `metaTitle` per document, e.g. `'Cookie Policy — How OyeChats Uses Cookies'`, `'Privacy Policy — How We Handle Your Data'`, `'Terms of Service — OyeChats Platform Agreement'`. Then in each `src/app/legal/<slug>/page.tsx`, pass `title: page.metaTitle`. Descriptions under 70 chars (`cookies` at 51, `refund` at 66) need extending to 100–160 — these are meta descriptions, not page copy.

- [ ] **Step 3: Stop the 404 inheriting the homepage's metadata**

`/_not-found` currently ships the homepage title AND description. Add to the top of `src/app/not-found.tsx`:

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'That page moved, was renamed, or never existed. Browse the OyeChats docs, pricing, and product pages instead.',
  robots: { index: false, follow: true },
};
```

- [ ] **Step 4: Verify**

```bash
npm run verify
```
Expected: the T-2 title and description assertions PASS for all routes.

- [ ] **Step 5: Commit**

```bash
git add src/app/*/page.tsx src/app/not-found.tsx
git commit -m "feat(seo): expand money-page titles and fix 404 metadata

Twelve routes shipped 15-24 char titles against a ~60 char budget with no
head term — /pricing was literally 'Pricing · OyeChats'. The 404 inherited
the homepage title and description verbatim."
```

---

# PHASE 2 — Entity graph

## Task 5: Migrate every page to `buildGraph` and add breadcrumbs

**Covers:** S-2, S-3, S-4, S-6, S-7, S-8, L-8 (markup half).

Fifteen hand-written JSON-LD objects become per-page graphs referencing the shared `@id`s from Task 2.

**Files:**
- Modify: `src/app/page.tsx`, `features/page.tsx`, `solutions/page.tsx`, `integrations/page.tsx`, `pricing/page.tsx`, `docs/page.tsx`, `about/page.tsx`, `contact/page.tsx`, `blog/page.tsx`, `blog/[slug]/page.tsx`, `security/page.tsx`, `changelog/page.tsx`, `legal/page.tsx`, `src/components/site/LegalDocument.tsx`

**Interfaces:**
- Consumes: `buildGraph`, `jsonLd`, `ID`, `abs`, `SITE_URL` from `src/lib/seo.ts`

- [ ] **Step 1: Replace the homepage and features duplicates**

Both declare a full `SoftwareApplication` with different `url`s and no `@id`, so search engines see two products. Delete both objects. In `src/app/page.tsx`:

```tsx
const graph = buildGraph({
  path: '/',
  name: 'OyeChats. You only talk to buyers.',
  description: SITE_DESCRIPTION,
  crumbs: [{ name: 'Home' }],
});
```

In `src/app/features/page.tsx`:

```tsx
const graph = buildGraph({
  path: '/features',
  name: 'Features · OyeChats',
  description: FEATURES_DESCRIPTION,
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Features' }],
});
```

`about: ID.software` is the default, so both pages now *reference* the single canonical SoftwareApplication rather than redefining it.

- [ ] **Step 2: Fold `/pricing`'s Product into the shared software node**

In `src/app/pricing/page.tsx`, delete `offerSchema` entirely (the offers now live on `ID.software` via `siteGraph`). Keep the FAQ, attached to the page:

```tsx
const graph = buildGraph({
  path: '/pricing',
  name: 'Pricing · OyeChats',
  description,
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Pricing' }],
  nodes: [
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/pricing#faq`,
      mainEntity: PRICING_FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
});
```

- [ ] **Step 3: Fix the invalid ItemList on `/integrations`**

`ListItem` entries carry neither `item` nor `url`, which is invalid. There are no per-integration routes, so use the all-in-one-page form:

```tsx
const graph = buildGraph({
  path: '/integrations',
  name: 'Integrations · OyeChats',
  description,
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Integrations' }],
  nodes: [
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/integrations#list`,
      name: 'OyeChats Supported Integrations',
      numberOfItems: INTEGRATIONS.length,
      itemListOrder: 'https://schema.org/ItemListUnordered',
      itemListElement: INTEGRATIONS.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: item.name,
          description: item.description,
          applicationCategory: 'WebApplication',
        },
      })),
    },
  ],
});
```

- [ ] **Step 4: Enumerate posts on `/blog` and complete `TechArticle` on `/docs`**

`/blog`:

```tsx
const graph = buildGraph({
  path: '/blog',
  name: 'Blog · OyeChats',
  description,
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Blog' }],
  type: 'CollectionPage',
  nodes: [
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/blog#list`,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: BLOG_POSTS.length,
      itemListElement: BLOG_POSTS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/blog/${p.slug}`,
        name: p.title,
      })),
    },
  ],
});
```

`/docs` — add the dates, publisher and image it lacks entirely:

```tsx
const graph = buildGraph({
  path: '/docs',
  name: 'Documentation · OyeChats',
  description,
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Documentation' }],
  dateModified: DOCS_LAST_UPDATED,
  nodes: [
    {
      '@type': 'TechArticle',
      '@id': ID.article('/docs'),
      headline: 'OyeChats Integration Documentation',
      description,
      mainEntityOfPage: { '@id': ID.webPage('/docs') },
      datePublished: DOCS_PUBLISHED,
      dateModified: DOCS_LAST_UPDATED,
      inLanguage: 'en',
      author: { '@id': ID.organization },
      publisher: { '@id': ID.organization },
      image: `${SITE_URL}/opengraph-image`,
      proficiencyLevel: 'Beginner',
      about: { '@id': ID.software },
    },
  ],
});
```

Declare the two date constants at the top of `src/app/docs/page.tsx`:

```tsx
/** Wired to real edit dates, not `new Date()` — a build-time clock would tell
 *  crawlers the docs change on every deploy. */
const DOCS_PUBLISHED = '2026-07-14';
const DOCS_LAST_UPDATED = '2026-07-14';
```

- [ ] **Step 5: Fix `ContactPage.mainEntity` and add legal breadcrumbs**

`/contact` — `mainEntity` should be the Organization, not a `ContactPoint` (which is a property of one, not a thing a page is about):

```tsx
const graph = buildGraph({
  path: '/contact',
  name: 'Contact · OyeChats',
  description,
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Contact' }],
  type: 'ContactPage',
  about: ID.organization,
});
```

In `src/components/site/LegalDocument.tsx`, add the graph the whole `/legal/*` cluster lacks — this is the one genuine three-level hierarchy on the site:

```tsx
const graph = buildGraph({
  path: `/legal/${page.slug}`,
  name: `${page.title} · OyeChats`,
  description: page.description,
  dateModified: page.lastUpdated,
  about: ID.organization,
  crumbs: [
    { name: 'Home', path: '/' },
    { name: 'Legal', path: '/legal' },
    { name: page.title },
  ],
});
```

- [ ] **Step 6: Convert `/blog/[slug]`**

**Prerequisite — do this first.** The graph below reads `post.updatedISO`, which does not exist yet. Add it to the `BlogPost` type in `src/lib/blog.ts` now (Task 12 Step 1 covers the rendering side):

```ts
  /** ISO date of the last substantive edit. Falls back to dateISO when unset —
   *  emitting dateModified === datePublished forever gives crawlers and answer
   *  engines no freshness signal at all. */
  updatedISO?: string;
```

Then keep `BlogPosting`, bound to the page, with the dates genuinely split:

```tsx
const graph = buildGraph({
  path: `/blog/${post.slug}`,
  name: post.title,
  description: post.description,
  crumbs: [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title },
  ],
  dateModified: post.updatedISO ?? post.dateISO,
  nodes: [
    {
      '@type': 'BlogPosting',
      '@id': ID.article(`/blog/${post.slug}`),
      headline: post.title,
      description: post.description,
      datePublished: post.dateISO,
      dateModified: post.updatedISO ?? post.dateISO,
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: 1200,
        height: 630,
      },
      keywords: post.tags.join(', '),
      articleSection: post.category,
      wordCount,
      inLanguage: 'en',
      isPartOf: { '@id': ID.website },
      author: { '@id': ID.organization },
      publisher: { '@id': ID.organization },
      mainEntityOfPage: { '@id': ID.webPage(`/blog/${post.slug}`) },
    },
    ...(post.faq?.length
      ? [{
          '@type': 'FAQPage',
          '@id': `${abs(`/blog/${post.slug}`)}#faq`,
          mainEntity: post.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }]
      : []),
  ],
});
```

- [ ] **Step 7: Add graphs to the three routes with none**

`/security`, `/changelog` and `/legal` currently emit only the layout graph. Add a `buildGraph` call to each with the appropriate crumbs, mirroring Step 1's shape.

- [ ] **Step 8: Replace every `JSON.stringify` with `jsonLd`**

```bash
grep -rn "JSON.stringify" src/app/ src/components/
```
Expected after the change: no results in any `dangerouslySetInnerHTML`. Every schema script becomes:

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
```

- [ ] **Step 9: Verify**

```bash
npm run verify
```
Expected: S-8 and S-2 assertions PASS on every route.

Then validate externally — paste `.next/server/app/pricing.html` into <https://validator.schema.org/> and confirm zero errors.

- [ ] **Step 10: Commit**

```bash
git add src/app src/components/site/LegalDocument.tsx
git commit -m "feat(schema): single connected entity graph across all routes

Replaces 15 ad-hoc JSON-LD objects. Previously the site emitted five
unlinked Organization nodes, two rival SoftwareApplication nodes and a third
Product node describing the same product, with no @id anywhere. Adds WebPage
nodes (nothing anchored breadcrumb/dateModified before), BreadcrumbList on
all routes, fixes the invalid ItemList, enumerates blog posts, and completes
TechArticle with the dates and publisher it lacked."
```

---

# PHASE 3 — Accessibility

## Task 6: Replace the keyboard-inoperable contact dropdown

**Covers:** F-1 (critical), F-18.

`<li role="option">` with `onClick` only. No keydown handling anywhere — a keyboard user can open the menu and never select a value. WCAG 2.1.1 (A). Also a lead-capture conversion bug.

**Files:**
- Modify: `src/app/contact/ContactClient.tsx:150-194`

- [ ] **Step 1: Replace the custom listbox with a native select**

Delete the custom dropdown (trigger button, `<ul role="listbox">`, the outside-`mousedown` effect, and the `open` state). Replace with:

```tsx
<div>
  <Label htmlFor="intent">I&apos;m reaching out about</Label>
  <select
    id="intent"
    name="intent"
    value={intent}
    onChange={(e) => setIntent(e.target.value)}
    className="w-full rounded-[var(--r-2)] border border-line-control bg-canvas px-4 py-3 min-h-11 text-[15px] text-ink appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b7280%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_14px_center] bg-no-repeat"
  >
    {INTENT_OPTIONS.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
</div>
```

Native `<select>` provides keyboard navigation, typeahead and mobile pickers for free, and removes ~45 lines. The visible option labels are unchanged.

- [ ] **Step 2: Add the missing autocomplete attributes**

WCAG 1.3.5 (AA). In the same file: `autoComplete="name"` on the name input, `autoComplete="email"` on email, `autoComplete="organization"` on company.

- [ ] **Step 3: Manual keyboard test**

```bash
npm run dev
```
Tab to the select, press ↓/↑ and type "s". Confirm the value changes and the form submits. Then confirm with a screen reader (VoiceOver: ⌘F5) that the field announces its label.

- [ ] **Step 4: Verify and commit**

```bash
npm run verify
git add src/app/contact/ContactClient.tsx
git commit -m "fix(a11y): make contact topic selector keyboard-operable

li role=option with onClick only and no keydown handling anywhere — a
keyboard user could open the menu and never choose a value (WCAG 2.1.1 A).
Native select also fixes the orphaned label and adds mobile pickers."
```

---

## Task 7: Label the pricing comparison icons

**Covers:** F-2 (critical), F-26, F-15 (table scope).

113 lucide SVGs ship on `/pricing` with no `aria-hidden` and no accessible name. In the comparison tables the ✓/✗ icons are the *only* carrier of include/exclude.

**Files:**
- Modify: `src/app/pricing/PricingClient.tsx:38-43`, `:315`
- Modify: `src/components/ds/Table.tsx:25-36`

- [ ] **Step 1: Give the boolean cells a text alternative**

```tsx
function renderCell(v: PricingFeatureValue, currency: Currency) {
  if (v === true)
    return (
      <>
        <Check size={16} className="text-signal inline" aria-hidden="true" />
        <span className="sr-only">Included</span>
      </>
    );
  if (v === false)
    return (
      <>
        <X size={16} className="text-muted-2 inline" aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </>
    );
  // ...unchanged
}
```

- [ ] **Step 2: Add `scope` support to Th and use a row header**

In `src/components/ds/Table.tsx`, add an optional `scope` prop defaulting to `'col'`, emitting `scope={scope}` on the `<th>`. Then in `PricingClient.tsx:315` change the feature-name cell from `<Td>{r.label}</Td>` to `<Th scope="row">{r.label}</Th>`.

Without a row header, a screen reader reading the 5-column matrix cell by cell has no idea which feature a ✓ belongs to. This also materially improves AI table extraction.

- [ ] **Step 3: Verify and commit**

```bash
npm run verify
```
Expected: the F-2 assertion PASSES.

```bash
git add src/app/pricing/PricingClient.tsx src/components/ds/Table.tsx
git commit -m "fix(a11y): text alternatives for pricing matrix, row headers on tables"
```

---

## Task 8: Make the mega menu and mobile drawer keyboard-operable

**Covers:** F-3, F-4, F-13 (nav label), L-9 (crawlability side effect).

The Resources menu opens only on `onMouseEnter` and is conditionally rendered, so its four links are absent from the compiled HTML *and* unreachable by keyboard or touch. One change fixes both.

**Files:**
- Modify: `src/components/site/Navbar.tsx:87-114`, `:135-183`, `:188-224`

- [ ] **Step 1: Always render the panel; toggle with CSS**

Mirror the pattern this same file already proves correct for the mobile drawer at `:153-161`. Replace the conditional render at `:107` with an always-rendered panel whose visibility is CSS-driven and which is `inert` when closed:

```tsx
<div
  id={`menu-${l.label}`}
  inert={openMenu !== l.label ? true : undefined}
  className={cn(
    'absolute left-0 top-full pt-2 z-50 transition-opacity duration-150',
    openMenu === l.label ? 'opacity-100' : 'opacity-0 pointer-events-none',
  )}
>
  <MegaMenu columns={l.menu} onNavigate={() => setOpenMenu(null)} />
</div>
```

- [ ] **Step 2: Make the trigger a real disclosure control**

```tsx
<button
  type="button"
  aria-expanded={openMenu === l.label}
  aria-controls={`menu-${l.label}`}
  aria-haspopup="true"
  onClick={() => setOpenMenu(openMenu === l.label ? null : l.label)}
  onFocus={() => setOpenMenu(l.label)}
  className="..."
>
  {l.label}
  <ChevronDown size={12} className="text-muted-2" aria-hidden="true" />
</button>
```

Keep `/docs` reachable by leaving the Documentation entry as the first item inside the panel — the destination is not lost.

- [ ] **Step 3: Add Escape handling and focus management**

Add to `Navbar.tsx`:

```tsx
useEffect(() => {
  if (!open && !openMenu) return;
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    setOpenMenu(null);
    if (open) {
      setOpen(false);
      toggleRef.current?.focus();
    }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, [open, openMenu]);
```

Add `const toggleRef = useRef<HTMLButtonElement>(null);`, attach it to the hamburger, and on open move focus to the first drawer link via a ref + `requestAnimationFrame`.

- [ ] **Step 4: Label the primary nav**

`aria-label="Primary"` on the `<nav>` at `:92`; wrap the mobile drawer's link column in `<nav aria-label="Mobile">`. On `/solutions` a screen reader currently hears "navigation" and "Workflow anchor navigation" — the ambiguous one is the primary.

- [ ] **Step 5: Verify**

```bash
npm run verify
grep -c 'href="/changelog"' .next/server/app/features.html
```
Expected: non-zero — the Resources links now ship in the HTML from the header, not only the footer.

- [ ] **Step 6: Commit**

```bash
git add src/components/site/Navbar.tsx
git commit -m "fix(a11y): keyboard-operable mega menu and drawer

The Resources menu opened only on mouseenter and was conditionally rendered,
so Docs/Changelog/Blog/Security were unreachable by keyboard and touch AND
absent from the compiled HTML. Always-rendered + inert fixes both at once."
```

---

## Task 9: Hide collapsed accordion answers from assistive tech — without removing them from the DOM

**Covers:** F-9, F-8 (accordion headings).

This is the one place where the a11y fix and the AEO benefit are in tension, and getting it wrong destroys real value.

**Files:**
- Modify: `src/components/ds/Accordion.tsx:35-59`

- [ ] **Step 1: Understand the constraint before editing**

The current `grid-rows-[0fr]` collapse keeps every answer in the DOM. That is **why** the FAQ structured data is visible-content compliant and why AI engines can extract the answers. Switching to conditional rendering or `display: none` would break both.

Use `inert` + `aria-hidden`: crawlers ignore both, so the text stays extractable, while assistive tech correctly skips it.

- [ ] **Step 2: Apply**

```tsx
<button
  type="button"
  onClick={() => (controlled ? onToggle(it.q) : setOpen(isOpen ? null : i))}
  aria-expanded={isOpen}
  aria-controls={`${baseId}-panel-${i}`}
  className="w-full flex items-center justify-between text-left py-5 gap-6"
>
  <span className="type-heading-3 text-ink">{it.q}</span>
  <Plus size={18} aria-hidden="true" className={cn('shrink-0 text-muted transition-transform duration-200', isOpen && 'rotate-45')} />
</button>
<div
  id={`${baseId}-panel-${i}`}
  role="region"
  className={cn('grid transition-[grid-template-rows] duration-200 ease-[var(--ease-inout)]', isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]')}
>
  <div className="overflow-hidden" inert={!isOpen ? true : undefined} aria-hidden={!isOpen}>
    <div className="type-body text-ink-2 max-w-2xl">{it.a}</div>
  </div>
</div>
```

Add `const baseId = useId();` at the top of the component.

- [ ] **Step 3: Verify the answers are still in the HTML**

```bash
npm run build
grep -c "Credits are how OyeChats measures usage" .next/server/app/pricing.html
```
Expected: `1`. **If this returns 0 the change is wrong — revert it.**

- [ ] **Step 4: Commit**

```bash
git add src/components/ds/Accordion.tsx
git commit -m "fix(a11y): hide collapsed accordion panels from AT, keep them in the DOM

inert + aria-hidden rather than display:none — crawlers ignore both, so FAQ
answers stay extractable and the FAQPage markup stays visible-content
compliant, while screen readers correctly skip collapsed content."
```

---

## Task 10: Remaining accessibility fixes

**Covers:** F-10, F-11, F-14, F-15 (remainder), F-27, F-28, F-29, F-33.

**Files:**
- Modify: `src/components/site/BlogList.tsx:73-93`, `:66-68`
- Modify: `src/app/contact/ContactClient.tsx:209-215`
- Modify: `src/app/integrations/IntegrationsClient.tsx:101-106`
- Modify: `src/app/pricing/PricingClient.tsx:92-131`
- Modify: `src/components/ds/Input.tsx:7`, `src/components/ds/Button.tsx:20`
- Modify: `src/app/globals.css` (add `--line-control`)

- [ ] **Step 1: Drop the fake tabs pattern**

`BlogList.tsx` declares `role="tablist"`/`role="tab"`/`aria-selected` with no tabpanel, no `aria-controls`, no ids, no roving tabIndex and no arrow-key handler. Replace with the pattern this codebase already uses correctly in `IntegrationsClient.tsx:122`:

```tsx
<div role="group" aria-label="Filter posts by category" className="...">
  {categories.map((c) => (
    <button key={c} type="button" aria-pressed={active === c} onClick={() => setActive(c)} className="...">
      {c}
    </button>
  ))}
</div>
```

- [ ] **Step 2: Keep a heading above the grid when filtered**

`showFeatured` is gated on `active === ALL`, so choosing a category removes the page's only `<h2>` and leaves h1 → h3. Add above the grid:

```tsx
<h2 className="sr-only">{active === ALL ? 'All posts' : active}</h2>
```

- [ ] **Step 3: Announce contact form status**

Wrap the error `Callout` in `<div role="alert">`; add `aria-busy={loading}` and `disabled={loading}` to the submit button (it is currently never disabled, so a double-click posts twice); on success, focus the confirmation card via a ref with `tabIndex={-1}`.

- [ ] **Step 4: Label the integrations search and announce result counts**

```tsx
<Input id="integration-search" type="search" aria-label="Search integrations" ... />
<p aria-live="polite" className="sr-only">{filtered.length} integrations</p>
```

- [ ] **Step 5: Expose toggle state on the pricing controls**

Wrap the billing group in `<div role="group" aria-label="Billing period">` and the currency group in `<div role="group" aria-label="Currency">`; add `aria-pressed` to all four buttons. Selection is currently signalled by background colour alone (WCAG 1.4.1).

- [ ] **Step 6: Fix control borders**

`--line` is 1.26:1 against canvas and `--line-2` is 1.49:1 — form fields and ghost buttons have effectively invisible boundaries (WCAG 1.4.11 needs 3:1). Add to `globals.css`:

```css
  /* Control boundaries need 3:1 (WCAG 1.4.11). --line/--line-2 are decorative
     dividers at ~1.3:1 and are exempt; form fields and buttons are not. */
  --line-control: #9A9A93;
```

Register `--color-line-control: var(--line-control);` in `@theme inline`, then use `border-line-control` in `Input.tsx:7` and the ghost variant of `Button.tsx:20`.

- [ ] **Step 7: Mark decorative SVGs**

Add `aria-hidden="true"` to the sparkline in `features/page.tsx:341`, `BantScoreRing.tsx:27` and `HeroDemo.tsx:82` (their values are in adjacent text). Change `integrations.tsx:44` from `role="img" aria-label={icon.title}` to `aria-hidden="true"` — the visible name is already adjacent, so it announces twice. Give `BlogCover`'s category an `sr-only` twin since the cover is `aria-hidden`. Replace the `id="a"` gradient in `features/page.tsx` with a `useId()`-derived value.

- [ ] **Step 8: Verify and commit**

```bash
npm run verify
npx @axe-core/cli http://localhost:3000/pricing http://localhost:3000/contact http://localhost:3000/blog
```
Expected: zero critical/serious violations.

```bash
git add src/
git commit -m "fix(a11y): form status, filter semantics, control contrast, decorative icons"
```

---

# PHASE 4 — Semantic structure and AEO

## Task 11: Add the missing heading tier and semantic list markup

**Covers:** A-2, A-3, F-12 (remainder), F-13.

`/features` has 7 h2 and **zero h3**; `/solutions` has 5 h2 and zero h3. Semantic chunkers split on heading boundaries, so the densest product page chunks into 7 giant multi-topic passages instead of ~25 focused ones. This is the single highest-leverage AEO change available.

**Files:**
- Modify: `src/app/features/page.tsx`, `src/app/solutions/page.tsx`, `src/app/docs/page.tsx`, `src/app/about/page.tsx`, `src/app/integrations/IntegrationsClient.tsx`, `src/app/security/page.tsx:171`

- [ ] **Step 1: Promote heading-styled divs to real headings**

Every one of these keeps its text and its `type-heading-*` class, so nothing moves visually. Only the tag changes.

| File:line | Change |
|---|---|
| `features/page.tsx` (each sub-topic within a section) | `<div className="type-heading-3">` → `<h3 className="type-heading-3">` |
| `solutions/page.tsx` (each sub-topic) | same |
| `docs/page.tsx:133` | `<p className="type-heading-3">` → `<h3 className="type-heading-3">` |
| `docs/page.tsx:356` | `<div className="type-heading-2">` → `<h2 className="type-heading-2">` |
| `about/page.tsx:180` | `<p className="type-heading-3">` → `<h3 className="type-heading-3">` |
| `IntegrationsClient.tsx:155` | `<div className="type-heading-3">` → `<h3 className="type-heading-3">` |
| `security/page.tsx:171` | `<h3>` → `<h2>` (it is styled `type-heading-2` and is an h2 peer) |

- [ ] **Step 2: Convert faked structures to real semantics**

Zero `<dl>` elements exist site-wide, and the most citation-worthy content is in div grids:

- **Webhook events** (`features/page.tsx`, from `WEBHOOK_EVENTS`) → `<dl>` with `<dt>` for the event name and `<dd>` for the description.
- **BANT criteria** → `<dl>`, or a `<table>` with `<th scope="row">` per dimension.
- **RAG steps** (`RAG_STEPS`) and the BANT timeline → `<ol>`/`<li>`.
- **`/docs` quick start** (4 numbered steps) → `<ol>`.
- **`/integrations` webhook steps** (`'01'/'02'/'03'`) → `<ol>`.
- **Integration/feature card grids** → `<ul>`/`<li>` (screen readers currently get no item count).

Keep every class name and every string. Where `Reveal` wraps a card, wrap outward: `<li><Reveal>…</Reveal></li>`.

- [ ] **Step 3: Verify**

```bash
npm run verify
grep -c '<h3' .next/server/app/features.html
grep -c '<dl' .next/server/app/features.html
```
Expected: both non-zero; the A-2 and F-12 assertions PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app
git commit -m "feat(aeo): real heading tier and list semantics on product pages

/features and /solutions had zero h3, so each chunked into 7 and 5 giant
multi-topic passages for AI passage retrieval instead of ~25 focused ones.
Webhook events, BANT criteria and step sequences move from div grids to
dl/ol/table. Tag changes only — no copy and no visual change."
```

---

## Task 12: Freshness signals — `updatedISO` and `<time>`

**Covers:** S-5, A-5, F-38.

`dateModified` is currently always identical to `datePublished`, so posts read as stale forever. No `<time datetime>` exists anywhere despite `dateISO` living in the data layer.

**Files:**
- Modify: `src/lib/blog.ts:12-28`
- Modify: `src/components/site/BlogList.tsx:30`, `:119-121`
- Modify: `src/app/blog/[slug]/page.tsx:159-161`, `:303-305`
- Modify: `src/app/changelog/page.tsx:68`
- Modify: `src/app/legal/page.tsx:37`, `src/components/site/LegalDocument.tsx:46`
- Modify: `src/components/site/Footer.tsx:50`

- [ ] **Step 1: Confirm the field exists**

`updatedISO` was added to the `BlogPost` type in Task 5 Step 6, because the schema there consumes it. Verify rather than re-adding:

```bash
grep -n "updatedISO" src/lib/blog.ts
```
Expected: the optional field declaration on the `BlogPost` type. If absent, add it now — see Task 5 Step 6 for the exact declaration and comment.

- [ ] **Step 2: Wrap every rendered date in `<time>`**

Each site keeps its visible string; only the element changes:

```tsx
<time dateTime={post.dateISO}>{post.date}</time>
```

For legal, `lastUpdated` is already in `YYYY-MM-DD` form, so it doubles as the `dateTime` value. For changelog, use `entry.dateISO`.

- [ ] **Step 3: Verify and commit**

```bash
npm run verify
grep -c '<time datetime=' .next/server/app/blog/ai-chatbot-cost.html
```
Expected: non-zero.

```bash
git add src/lib/blog.ts src/components src/app
git commit -m "feat(seo): machine-readable dates and a real dateModified signal"
```

---

## Task 13: Internal linking — related posts, legal cross-links, dead ends

**Covers:** L-2, L-3, L-4, L-5, L-9.

**Files:**
- Modify: `src/lib/blog.ts:415-422`
- Modify: `src/components/site/LegalDocument.tsx:26-33`, `src/lib/legal.ts`
- Modify: `src/app/page.tsx:126-138`
- Modify: `src/app/features/page.tsx`, `src/app/solutions/page.tsx`, `src/app/security/page.tsx`, `src/app/integrations/IntegrationsClient.tsx`, `src/app/pricing/PricingClient.tsx`, `src/app/about/page.tsx`

- [ ] **Step 1: Fix the related-posts sink**

`rest` preserves declaration order, so with 7 distinct categories across 8 posts, six posts deterministically surface the same three entries — leaving four posts with exactly one inbound page. Replace `getRelatedPosts`:

```ts
/** Related posts: same category first, then by tag overlap, then most recent.
 *  Ordering `rest` by array position left four posts unreachable from any other
 *  post — a rich-get-richer link sink. */
export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return BLOG_POSTS.slice(0, limit);
  const tags = new Set(current.tags);
  const score = (p: BlogPost) =>
    (p.category === current.category ? 100 : 0) +
    p.tags.filter((t) => tags.has(t)).length * 10;

  return BLOG_POSTS.filter((p) => p.slug !== slug)
    .sort((a, b) => score(b) - score(a) || b.dateISO.localeCompare(a.dateISO))
    .slice(0, limit);
}
```

- [ ] **Step 2: Make legal cross-references clickable**

`src/lib/legal.ts` contains ~10 sentences that already name sibling documents. Use the inline-link renderer that already exists for blog content — `renderRichText` from `src/lib/richtext.tsx` — inside `LegalDocument.renderBody`, then wrap the existing phrases in markers. **No new prose**; the sentences already name their destinations.

| `legal.ts` line | Existing phrase to wrap | Destination |
|---|---|---|
| 57 | `Subprocessors List page` | `/legal/subprocessors` |
| 92 | `Cookie Policy` | `/legal/cookies` |
| 143 | `oyechats.com/legal/dpa` | `/legal/dpa` |
| 398 | `Refund Policy` | `/legal/refund` |
| 23, 342 | `Terms of Service` | `/legal/terms` |
| 167, 205, 262 | `Privacy Policy` | `/legal/privacy` |

- [ ] **Step 3: Give the six dead-end pages outbound links**

Each is a UI affordance (a CTA row or a related-links module), not new prose:

| Source | Add | Destination |
|---|---|---|
| `/pricing` (below FAQ) | "Related reading" module, 2 cards | `/blog/ai-chatbot-cost`, `/blog/best-ai-chatbot-india` |
| `/features` (`#feature-bant`) | link in the existing `:460-465` pattern | `/blog/bant-scoring-ai-chatbot` |
| `/features` (`#feature-rag`) | same pattern | `/blog/hybrid-search-explained` |
| `/features` (`:466`) | sibling link | `/blog/webhook-best-practices` |
| `/solutions` (`docs-assistant`) | link after bullets | `/blog/rag-vs-fine-tuning` |
| `/solutions` (`sales-lead-gen`) | link after bullets | `/blog/behavioral-tracking-lead-gen` |
| `/integrations` (after webhook steps) | CTA row | `/docs#webhooks`, `/features` |
| `/security` (below disclosure) | link row | `/legal/privacy`, `/legal/dpa` |
| `/about` (`VISION_BLOCKS`) | wrap each card in a `Link` | `/solutions#customer-support`, `#sales-lead-gen`, `#live-chat-handoff` |

The four `/blog/*` targets above are exactly the four near-orphans, so this and Step 1 together satisfy the L-2 assertion.

- [ ] **Step 4: Fix the six duplicate homepage anchors**

`src/app/page.tsx:132-137` emits `See how it works →` six times, three of them pointing at the same `#feature-rag`. Wrap the whole `<Card>` in the `<Link>` — the pattern already used in `BlogList.tsx:38-51` — so the existing `<h3>{f.title}</h3>` becomes the anchor text automatically. The visible "See how it works →" affordance stays as a visual cue inside the card.

- [ ] **Step 5: Verify and commit**

```bash
npm run verify
```
Expected: the L-2 assertion PASSES — every post has ≥3 inbound pages.

```bash
git add src/
git commit -m "feat(seo): repair internal link graph

getRelatedPosts fell back to array order, leaving four posts with exactly one
inbound page. Six pages were pure link sinks, /pricing worst of all with 12
inbound and zero outbound. Legal cross-references that already name their
destination are now clickable."
```

---

## Task 14: Visible breadcrumbs

**Covers:** L-8, M-3.

`BreadcrumbList` markup exists on `/blog` and `/blog/[slug]` but **no page has visible breadcrumb UI**. Google's guidelines require markup to reflect visible content.

**Files:**
- Create: `src/components/site/Breadcrumbs.tsx`
- Modify: `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx:141-146`, `src/app/legal/page.tsx`, `src/components/site/LegalDocument.tsx`

- [ ] **Step 1: Create the component**

```tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Crumb } from '@/lib/seo';

/** Visible trail matching the BreadcrumbList emitted by buildGraph(). Markup
 *  without a visible equivalent is non-compliant and may be ignored. */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 type-mono-sm text-muted">
        {crumbs.map((c, i) => (
          <li key={c.name} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
            {c.path ? (
              <Link href={c.path} className="no-underline hover:text-ink">
                {c.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {c.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 2: Render it where markup already claims a hierarchy**

On `/blog/[slug]`, replace the standalone `← All posts` link at `:141-146` with `<Breadcrumbs crumbs={[{name:'Home',path:'/'},{name:'Blog',path:'/blog'},{name:post.title}]} />` so UI and markup agree. Add it to `/blog`, `/legal`, and `LegalDocument` using the same crumb arrays passed to `buildGraph` in Task 5.

- [ ] **Step 3: Verify and commit**

```bash
npm run verify
git add src/components/site/Breadcrumbs.tsx src/app src/components/site/LegalDocument.tsx
git commit -m "feat(seo): visible breadcrumb trails matching BreadcrumbList markup"
```

---

# PHASE 5 — Performance

## Task 15: Error boundaries

**Covers:** P-11.

Any runtime throw in a client component blanks the whole route.

**Files:**
- Create: `src/app/error.tsx`, `src/app/global-error.tsx`

- [ ] **Step 1: Route-level boundary**

```tsx
'use client';

import { useEffect } from 'react';
import { Button, Chip, Container, DottedGrid, GradientText, HeroGlow } from '@/components/ds';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative bg-paper overflow-hidden min-h-[70vh] flex items-center">
      <HeroGlow />
      <DottedGrid />
      <Container className="relative text-center">
        <Chip variant="mono">error</Chip>
        <h1 className="type-display-1 text-ink mt-6">
          Something <GradientText>broke</GradientText>.
        </h1>
        <p className="type-body-lg text-ink-2 mt-6 max-w-md mx-auto">
          That is on us. Try again, or head back home.
        </p>
        <div className="mt-9 flex justify-center gap-3 flex-wrap">
          <Button onClick={reset} variant="volt" size="lg">Try again</Button>
          <Button href="/" variant="ghost" size="lg">Back home</Button>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Root boundary**

`global-error.tsx` must render its own `<html>`/`<body>` — it replaces the root layout:

```tsx
'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '80px 24px', textAlign: 'center', background: '#FAFAF7', color: '#0A0A0A' }}>
        <h1 style={{ fontSize: 32, margin: 0 }}>Something broke.</h1>
        <p style={{ color: '#3F3F46', marginTop: 12 }}>Reload the page, or come back shortly.</p>
        <button onClick={reset} style={{ marginTop: 28, padding: '12px 24px', borderRadius: 8, border: 0, background: '#7C3AED', color: '#fff', fontSize: 15, cursor: 'pointer' }}>
          Try again
        </button>
      </body>
    </html>
  );
}
```

Do **not** add `loading.tsx` — every route is static, so there is no streaming gap to fill and it would only introduce a flash.

- [ ] **Step 3: Verify and commit**

```bash
npm run verify
git add src/app/error.tsx src/app/global-error.tsx
git commit -m "feat: add route and root error boundaries"
```

---

## Task 16: Rendering performance

**Covers:** P-4, P-5, P-6, P-7, P-10, P-12, P-3, P-13, P-15, P-16, P-17.

**Files:**
- Modify: `src/components/site/pill-tabs.tsx`, `src/components/site/ScrollSpyToc.tsx:39-68`, `src/components/site/HeroDemo.tsx:141-165`, `:251`, `src/components/ui/FadeUp.tsx:88-102`, `src/components/site/Logo.tsx:37`, `src/components/site/Navbar.tsx:63-68`, `src/components/ds/Button.tsx:79`, `next.config.ts`, `src/lib/integrations.tsx`

- [ ] **Step 1: Remove the `motion` import that defeats `LazyMotion`**

`FadeUp.tsx` correctly uses `LazyMotion` + `domAnimation` + `m` — whose entire purpose is keeping the full feature set out of the bundle. `pill-tabs.tsx:4` imports the full `motion` proxy for a decorative sliding background, re-adding everything plus layout-projection code on 8+ routes.

Replace `PillHighlight` with a CSS-only indicator: an absolutely-positioned span whose `transform: translateX()` and `width` are set from the active pill's offsets inside the existing `useCenteredTabs` effect, with `transition: transform .25s, width .25s`. Delete the `motion/react` import entirely.

- [ ] **Step 2: Stop `ScrollSpyToc` forcing layout every frame**

It re-runs `getElementById` for every item, reads `scrollHeight`, then calls `getBoundingClientRect()` in a loop over every item — every rAF frame during scroll. Replace with a single `IntersectionObserver`:

```tsx
useEffect(() => {
  if (!items.length) return;
  const els = items
    .map((it) => document.getElementById(it.id))
    .filter((el): el is HTMLElement => el !== null);
  if (!els.length) return;

  const visible = new Set<string>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      }
      const first = els.find((el) => visible.has(el.id));
      if (first) setActiveId(first.id);
    },
    { rootMargin: `-${offsetTop}px 0px -70% 0px`, threshold: 0 },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}, [items, offsetTop]);
```

This removes the scroll listener entirely.

- [ ] **Step 3: Cut `HeroDemo` from ~200 React commits to ~5**

It calls `setTypedQ`/`setTypedA` once per character during the LCP window. Drive the text through a ref instead, keeping React state only for coarse phase transitions:

```tsx
const qRef = useRef<HTMLSpanElement>(null);
// inside the typing loop, replace setTypedQ(...) with:
if (qRef.current) qRef.current.textContent = script.q.slice(0, i);
```

Then gate the first `play()` behind `requestIdleCallback` so the hero heading paints on an idle main thread.

- [ ] **Step 4: Share one observer across `FadeUp` instances**

Each instance runs a `useLayoutEffect` calling `getBoundingClientRect()` + `window.innerHeight` then `setState`; `/integrations` instantiates 13+, all in one commit. Replace with a module-scope `IntersectionObserver` that reports `isAboveFold` to subscribers.

- [ ] **Step 5: Small fixes**

- `Logo.tsx:37` — add `priority?: boolean` defaulting `false`; pass `priority` from `Navbar` only. The footer instance currently loads eagerly.
- `Navbar.tsx:63-68` — rAF-throttle the scroll handler to match `ReadingProgress.tsx:20-22`.
- `Button.tsx:79` — default to `type="button"`; pass `type="submit"` explicitly at `ContactClient.tsx:215`.
- `next.config.ts` — delete the dead `images.unsplash.com` remote pattern (`grep -rn unsplash src/` returns nothing); add a `Cache-Control` header for `/openapi.json` and `/:path*.png`. Do **not** add a blanket `/(.*)` cache rule — that would override Vercel's `immutable` policy on `_next/static`.
- `src/lib/integrations.tsx` — inline the 8 brand icon paths and drop the `simple-icons` dependency. Tree-shaking already works correctly (verified: only the 8 used brands ship, zero leakage), so this is a **build-time** win, not a bundle win. Each icon is `{title, hex, path}` — three static strings, copied from `node_modules/simple-icons/icons/{wordpress,webflow,nextdotjs,html5,vuedotjs,react,framer,calendly}.svg`.
- `HeroDemo.tsx:251` — give the pane a fixed mobile height (`h-[440px] sm:h-[360px]`) sized for the longest script; `min-h` currently lets it grow as text types in, shifting the homepage on mobile.

- [ ] **Step 6: Verify with real numbers**

```bash
npm run verify
npx lighthouse http://localhost:3000/pricing --preset=desktop --output=json --output-path=/tmp/lh-pricing.json
node -e "const r=require('/tmp/lh-pricing.json');console.log(Object.entries(r.audits).filter(([k])=>['largest-contentful-paint','cumulative-layout-shift','total-blocking-time'].includes(k)).map(([k,v])=>k+': '+v.displayValue).join('\n'))"
```
Expected: LCP < 2.5 s, CLS < 0.1, TBT < 200 ms on desktop preset.

- [ ] **Step 7: Commit**

```bash
git add src next.config.ts package.json
git commit -m "perf: remove motion from pill-tabs, IO-based scrollspy, ref-driven hero typing"
```

---

# PHASE 6 — GEO assets

## Task 17: Generate `llms.txt` from typed source

**Covers:** G-1 (critical), G-3, T-3.

`public/llms.txt` advertises an Enterprise plan deleted in commit `e8f7042`, with fabricated pricing, in the one file AI answer engines read first and trust most. Correcting the text is not enough — it is a hand-maintained duplicate of facts that live in typed modules, and it drifted within days of a pricing change.

**Files:**
- Create: `src/lib/llms.ts`, `src/app/llms.txt/route.ts`
- Delete: `public/llms.txt`
- Modify: `src/app/robots.ts`

- [ ] **Step 1: Delete the static file first**

A file in `public/` shadows a route of the same path, so both cannot coexist.

```bash
git rm public/llms.txt
```

- [ ] **Step 2: Build the serialiser**

Create `src/lib/llms.ts` exporting `buildLlmsTxt(): string`, composed from `PRICING_TIERS`, `BLOG_POSTS`, `FEATURES`, `LEGAL_PAGES` and the route list. Structure only — reuse existing descriptions verbatim, write no new marketing copy:

```
# OyeChats
> {existing one-line summary}

{existing product paragraph}

## Key pages          ← all 12 top-level routes, from one array
## Articles           ← all 8 posts, from BLOG_POSTS
## API                ← /openapi.json, /docs#api, /docs#webhooks
## Legal              ← from LEGAL_PAGES
## Details            ← plan names and prices from PRICING_TIERS, both currencies
```

- [ ] **Step 3: Serve it**

```ts
import { buildLlmsTxt } from '@/lib/llms';

export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
```

- [ ] **Step 4: Declare an AI-crawler policy**

Rewrite `src/app/robots.ts`. The current two-line wildcard permits everything, but the policy is implicit and unmanaged — a future blanket AI block could land without a conversation.

```ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/** Crawlers we explicitly welcome — each is a path to being cited. OyeChats is
 *  product-led with no content moat: the site IS the marketing, so being the
 *  cited answer beats protecting copy from training corpora.
 *  Note: Google-Extended gates Gemini/AI-Overviews grounding ONLY — it has no
 *  effect on classic Search ranking. */
const AI_ALLOW = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended', 'CCBot',
];

/** Aggressive crawlers with no citation upside. */
const DISALLOW = ['Bytespider', 'Amazonbot', 'Diffbot', 'Omgili', 'omgilibot', 'ImagesiftBot'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      ...AI_ALLOW.map((userAgent) => ({ userAgent, allow: '/' })),
      ...DISALLOW.map((userAgent) => ({ userAgent, disallow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

- [ ] **Step 5: Verify against the live product**

```bash
npm run build
node -e "
const t = require('fs').readFileSync('.next/server/app/llms.txt.body','utf8');
if (/enterprise/i.test(t)) { console.error('✗ llms.txt still mentions Enterprise'); process.exit(1); }
for (const s of ['/solutions','/about','/changelog','₹','\$']) {
  if (!t.includes(s)) { console.error('✗ llms.txt missing ' + s); process.exit(1); }
}
console.log('✓ llms.txt matches the shipped product');
"
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/llms.ts src/app/llms.txt src/app/robots.ts
git rm public/llms.txt
git commit -m "feat(geo): generate llms.txt from source; declare AI crawler policy

The static file advertised an Enterprise plan removed in e8f7042, with
fabricated pricing, to the file AI engines read first. Generating it from
PRICING_TIERS/BLOG_POSTS/LEGAL_PAGES makes that class of drift impossible."
```

---

## Task 18: `llms-full.txt`

**Covers:** G-2.

The highest-ROI GEO asset available here, precisely because the content already exists in a clean structured form.

**Files:**
- Create: `src/app/llms-full.txt/route.ts`
- Modify: `src/lib/llms.ts`

- [ ] **Step 1: Add a `BlogBlock[]` → markdown serialiser**

Add `buildLlmsFullTxt()` to `src/lib/llms.ts` emitting the full text of all 8 posts, `/docs` content, `PRICING_FAQ`, `FEATURE_ROWS` and `LEGAL_PAGES` as flat markdown. `BlogBlock[]` → markdown is ~20 lines:

```ts
function blocksToMarkdown(content: BlogBlock[]): string {
  return content
    .map((b) => {
      switch (b.type) {
        case 'h2': return `## ${b.text}`;
        case 'h3': return `### ${b.text}`;
        case 'p': return b.text;
        case 'ul': return (b.items ?? []).map((i) => `- ${i}`).join('\n');
        case 'ol': return (b.items ?? []).map((i, n) => `${n + 1}. ${i}`).join('\n');
        case 'code': return '```\n' + (b.text ?? '') + '\n```';
        case 'quote': return `> ${b.text ?? ''}`;
        default: return '';
      }
    })
    .filter(Boolean)
    .join('\n\n');
}
```

- [ ] **Step 2: Serve it** — same route shape as Task 17 Step 3.

- [ ] **Step 3: Link both for discovery**

Neither file is referenced anywhere (`grep -rn "llms.txt" src/` returns nothing). Add a footer link and reference them from `llms.txt` itself.

- [ ] **Step 4: Verify and commit**

```bash
npm run verify
curl -s http://localhost:3000/llms-full.txt | head -40
git add src/lib/llms.ts src/app/llms-full.txt src/components/site/Footer.tsx
git commit -m "feat(geo): add generated llms-full.txt corpus"
```

---

## Task 19: Sitemap accuracy and icon assets

**Covers:** T-4, T-8, T-5.

**Files:**
- Modify: `src/app/sitemap.ts:8`, `:11-24`
- Modify: `src/app/manifest.ts:14-15`
- Replace: `src/app/icon.png`, `src/app/apple-icon.png`
- Create: `src/app/favicon.ico`

- [ ] **Step 1: Tier the sitemap**

All 12 static routes report the same frozen `2026-07-14` and `weekly`. Split by real change cadence — `/`, `/pricing`, `/features` weekly; `/about`, `/security`, `/legal` yearly — and derive `/changelog`'s `lastModified` from `CHANGELOG[0].dateISO`, which `Footer.tsx:15` already imports. Differentiate `priority` between money pages and policy pages.

- [ ] **Step 2: Fix the icons**

`src/app/icon.png` and `apple-icon.png` are **242 KB each at 512×512** — roughly 10× what that resolution needs, while `public/favicon.png` is 1024×1024 at 8.5 KB.

```bash
sips -Z 512 -s format png public/favicon.png --out src/app/icon.png
sips -Z 180 -s format png public/favicon.png --out src/app/apple-icon.png
ls -la src/app/icon.png src/app/apple-icon.png
```
Expected: both well under 40 KB.

Correct `manifest.ts:14-15` — it declares `/favicon.png` at `512x512` and again at `180x180` while the file is 1024×1024, and reuses a standard logo as `maskable` without the required safe-zone padding. Produce a genuine padded maskable variant, and add a 32×32 `favicon.ico` for older crawlers and Bing.

- [ ] **Step 3: Audit `openapi.json` before promoting it**

486 KB linked once from `/docs`, not in the sitemap or `llms.txt`. A spec that large on a marketing site is likely a full backend dump while `/docs` documents 6 endpoints.

**Review its contents for internal-only endpoints and example secrets before increasing its discoverability.** Once cleared, publish a slimmed public spec covering the documented endpoints and add the `Cache-Control` header from Task 16.

- [ ] **Step 4: Verify and commit**

```bash
npm run verify
git add src/app/sitemap.ts src/app/manifest.ts src/app/icon.png src/app/apple-icon.png src/app/favicon.ico
git commit -m "fix(seo): tier sitemap freshness, recompress icons, correct manifest sizes"
```

---

# PHASE 7 — Architectural (schedule separately)

## Task 20: Split `/docs` into four routes

**Covers:** L-6.

375 lines covering four separately-searched intents under one URL, one title, one canonical. `/features:461` already links `/docs#webhooks`, treating the fragment as a destination — but a fragment cannot rank independently and **AI answer engines cite URLs, not fragments**, so a citation for the webhook payload resolves to a page whose first 200 lines are about installing a script tag.

**This is the highest-leverage IA change available: 1 rankable URL becomes 4.**

**Files:** Create `src/app/docs/widget/page.tsx`, `docs/webhooks/page.tsx`, `docs/api/page.tsx`; modify `src/app/docs/page.tsx`, `src/app/sitemap.ts`, `src/lib/llms.ts`, `next.config.ts`

- [ ] **Step 1:** Extract each section into its own route with its own `pageMeta` and `buildGraph` (`TechArticle` + breadcrumbs). Move content verbatim — no rewriting.
- [ ] **Step 2:** Keep `/docs` as a hub that links all four and retains the quick-start.
- [ ] **Step 3:** Preserve the existing anchors. Fragments are not sent to the server, so a redirect cannot catch `/docs#webhooks` — keep the anchor ids present on the hub.
- [ ] **Step 4:** Update `sitemap.ts`, `llms.ts`, and the `/features` link to point at `/docs/webhooks`.
- [ ] **Step 5:** `npm run verify`, then commit.

---

## Task 21: Split `/solutions` into `/solutions/[slug]`

**Covers:** L-7.

Four sections mapping onto four buyer segments with genuinely different search intent. Each `SOLUTIONS` entry already carries `title`, `intro`, `body[]`, `bullets[]`, `outcome` — enough for a standalone page. Use the `generateStaticParams` pattern already proven at `/blog/[slug]`. 1 URL becomes 5, zero new copy.

**Do not do the same to `/features`.** Its six sections are facets of one product argument, not independent reference topics, and the `SoftwareApplication` schema legitimately covers all six via `featureList`. Splitting it would create six thin pages competing on the same brand+feature queries.

- [ ] **Step 1:** Create `src/app/solutions/[slug]/page.tsx` with `generateStaticParams` from `SOLUTIONS`.
- [ ] **Step 2:** Keep `/solutions` as a hub linking all four.
- [ ] **Step 3:** Per-page `Service` schema with `provider: {'@id': ID.organization}` + breadcrumbs.
- [ ] **Step 4:** Update `sitemap.ts` and `llms.ts`.
- [ ] **Step 5:** `npm run verify`, then commit.

---

## Task 22: Resolve apex vs www — evidence first

**Covers:** T-6.

**Blocked on external evidence. Do not write a redirect before running these.**

- [ ] **Step 1: Gather the evidence**

```bash
curl -sI https://oyechats.com/ | head -3            # expect 308 → https://www.oyechats.com/
curl -sI https://www.oyechats.com/pricing/ | head -3 # expect 308 → /pricing
curl -sI https://www.oyechats.com/Pricing | head -3  # expect 404
```

Also pull GSC Coverage filtered to *Duplicate without user-selected canonical*, and the top 404 URLs over 90 days.

- [ ] **Step 2: Fix the apex URLs the product already emits**

Regardless of the redirect outcome, `src/app/api/contact/route.ts:121,135` emits `https://oyechats.com` in transactional emails, actively distributing non-canonical URLs. Change both to `https://www.oyechats.com`.

- [ ] **Step 3:** If apex serves rather than redirects, add a `redirects()` rule in `next.config.ts` or configure it at the Vercel domain level. Build a legacy redirect map from the GSC 404 data — the Enterprise removal (`e8f7042`) and the BANT "Timing"→"Timeline" rename (`2edd439`) are both candidates for broken deep links.

- [ ] **Step 4:** Commit.

---

## Task 23: Security headers

**Covers:** T-7.

**Files:** Modify `next.config.ts:22-40`

- [ ] **Step 1:** Add `Content-Security-Policy` (which supersedes `X-Frame-Options` via `frame-ancestors`), `Permissions-Policy`, and `Cross-Origin-Opener-Policy`. CSP needs a `script-src` allowance for `cdn.oyechats.com` and the inline JSON-LD — do Task 5 first so the escaping is already correct, then prefer a nonce over `'unsafe-inline'`.
- [ ] **Step 2:** Deploy to a preview URL and check the browser console for CSP violations before promoting. **A CSP that blocks the chat widget is worse than no CSP.**
- [ ] **Step 3:** Verify at <https://securityheaders.com>, expect A or better. Commit.

---

# PHASE 8 — Not code (hand to marketing/leadership)

These set the ceiling on four scorecard dimensions and **cannot be fixed in this repo**. Fabricating any of them would be a Google spam-policy violation with manual-action risk.

| Item | Unblocks | Owner |
|---|---|---|
| Claim G2, Capterra, Product Hunt listings | Entity Optimization 32 → ~70. The primary source AI engines cite for "best X" comparisons — their absence is why OyeChats will not appear in AI-generated vendor shortlists. | Marketing |
| Real customer reviews on-page | Trust Signals 60 → ~85. **Until these exist the Software App rich result is unattainable** — Google requires `aggregateRating` or `review`. | Marketing |
| Named authors with real bios | E-E-A-T 42 → ~75. Current bylines are "OyeChats Team", "Growth Team" and — literally — **"AI Team"**, which reads as AI-generated authorship to a quality rater. | Content |
| A team section on `/about` | Its own meta description promises "Meet the team"; the page has none. | Content |
| Original benchmark data | Citation Readiness 45 → ~80. Median BANT scores across N conversations, RAG answer accuracy. Proprietary data is what AI engines cite and competitors cannot copy. **Highest AEO ceiling available.** | Product |
| Crunchbase profile, registered entity details | Knowledge Graph Readiness | Ops |

---

## Coverage Matrix

Every finding in the audit maps to a task. Verify before starting execution.

| Finding | Task | Finding | Task | Finding | Task |
|---|---|---|---|---|---|
| T-1 | 2 | F-1 | 6 | P-1 | 3 |
| T-2 | 4 | F-2 | 7 | P-2 | 3 |
| T-3 | 17 | F-3 | 8 | P-3 | 16 |
| T-4 | 19 | F-4 | 8 | P-4 | 16 |
| T-5 | 19 | F-5 | 2 | P-5 | 16 |
| T-6 | 22 | F-6 | 2 | P-6 | 16 |
| T-7 | 23 | F-7 | 2 | P-7 | 16 |
| T-8 | 19 | F-8 | 2 | P-8 | *deferred — see note* |
| S-1 | 2 | F-9 | 9 | P-9 | 16 |
| S-2 | 2, 5 | F-10 | 10 | P-10 | 16 |
| S-3 | 5 | F-11 | 10 | P-11 | 15 |
| S-4 | 5 | F-12 | 2, 11 | P-12 | 16 |
| S-5 | 12 | F-13 | 11 | A-2 | 11 |
| S-6 | 5 | F-14 | 10 | A-3 | 11 |
| S-7 | 5 | F-15 | 7, 10 | A-5 | 12 |
| S-8 | 2, 5 | L-1 | 2 | G-1 | 17 |
| L-2 | 13 | L-6 | 20 | G-2 | 18 |
| L-3 | 13 | L-7 | 21 | G-3 | 18 |
| L-4 | 13 | L-8 | 14 | G-4 | Phase 8 |
| L-5 | 13 | L-9 | 8, 13 | G-5 | 2 |

**P-8 (whole-page client boundaries on `/pricing`, `/contact`, `/integrations`) is deliberately deferred.** These pages *are* server-rendered and *are* crawlable — the cost is bundle size and hydration, not invisibility. It is the largest-diff, highest-regression-risk item in the audit, and Task 3 already removes its most damaging symptom. Schedule it as its own project after Phase 7 lands, using `/features` and `/docs` as the target pattern.

**A-1, A-4, A-6 have no task by design** — they are findings that the existing implementation is already correct (accordion DOM retention, blog content model, FAQPage expectation-setting). Preserve them; do not "optimise" them.

---

## Expected Score Movement

| Dimension | Now | After Phase 6 | After Phase 7 | Ceiling without Phase 8 |
|---|---:|---:|---:|---:|
| Technical SEO | 68 | 90 | 94 | 94 |
| On-page SEO | 55 | 88 | 92 | 92 |
| Metadata | 48 | 95 | 95 | 95 |
| Schema | 58 | 92 | 94 | 94 |
| Accessibility | 52 | 90 | 90 | 90 |
| Internal Linking | 48 | 82 | 92 | 92 |
| AEO Readiness | 58 | 88 | 92 | 92 |
| GEO Readiness | 45 | 90 | 92 | 92 |
| Entity Optimization | 32 | 55 | 55 | **55** |
| Trust Signals | 60 | 68 | 68 | **68** |
| E-E-A-T | 42 | 55 | 58 | **58** |
| **Overall SEO** | **62** | **87** | **91** | **91** |
| **AI Search Readiness** | **48** | **82** | **86** | **86** |

Bold ceilings are Phase 8 dependencies. **"Near 100" is not reachable from code alone** — roughly 9 points of Overall SEO and 12 of AI Search Readiness require real reviews, real named authors, and third-party listings that must be earned rather than written.
