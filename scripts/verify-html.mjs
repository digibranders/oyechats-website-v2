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

/** Every compiled page, as { route, file, html }. Excludes framework error shells. */
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
/** @type {{id: string, msg: string}[]} */
const failures = [];
const passed = [];
const skipped = [];

/** Return `SKIP` from an assertion when its precondition is unavailable, so an
 *  unrunnable check is never silently reported as a pass. */
const SKIP = Symbol('skip');

function check(id, fn) {
  try {
    const result = fn();
    if (result === SKIP) {
      skipped.push(id);
      return;
    }
    const problems = result ?? [];
    if (problems.length) for (const msg of problems) failures.push({ id, msg });
    else passed.push(id);
  } catch (err) {
    failures.push({ id, msg: `threw ${err.message}` });
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

// ── P-2: both billing currencies must be discoverable ──────────────────────
// The page renders one currency at a time by design, and duplicating prices as
// hidden DOM text risks reading as cloaking. Alternate-currency pricing belongs
// in structured data, so assert on the Offer nodes instead.
//
// Note this deliberately does NOT match the bare ₹ glyph: the currency toggle is
// labelled "INR (₹)", so `includes('₹')` reports green while no rupee price
// exists anywhere. That false pass is the exact class of bug this harness exists
// to catch, and it fooled an earlier revision of this very check.
check('P-2 INR offers present in structured data', () => {
  const pricing = P.find((p) => p.route === '/pricing');
  if (!pricing) return ['/pricing not built'];
  const inr = (pricing.html.match(/"priceCurrency":"INR"/g) ?? []).length;
  const usd = (pricing.html.match(/"priceCurrency":"USD"/g) ?? []).length;
  const bad = [];
  if (inr < 3) bad.push(`only ${inr} INR Offer(s) in JSON-LD; expected one per tier`);
  if (usd < 3) bad.push(`only ${usd} USD Offer(s) in JSON-LD; expected one per tier`);
  return bad;
});

// ── T-2: title budget. Brand suffix is " · OyeChats" (11 chars). ─────────────
check('T-2 titles are substantive', () => {
  const bad = [];
  for (const p of P) {
    const m = p.html.match(/<title>([^<]*)<\/title>/);
    if (!m) {
      bad.push(`${p.route} has no <title>`);
      continue;
    }
    const len = m[1].length;
    if (len < 30) bad.push(`${p.route} title only ${len} chars: "${m[1]}"`);
    // No upper bound on article titles. A descriptive post headline running to
    // 90 chars is correct — Google truncates the display but still uses the
    // full string for relevance. Enforcing a ceiling here would push authors to
    // shorten titles the audit found exemplary.
    if (!p.route.startsWith('/blog/') && len > 65) {
      bad.push(`${p.route} title ${len} chars (truncation risk): "${m[1]}"`);
    }
  }
  return bad;
});

check('T-2 meta descriptions within budget', () => {
  const bad = [];
  for (const p of P) {
    const m = p.html.match(/<meta name="description" content="([^"]*)"/);
    if (!m) {
      bad.push(`${p.route} has no meta description`);
      continue;
    }
    const len = m[1].length;
    if (len < 70) bad.push(`${p.route} description only ${len} chars`);
    if (len > 165) bad.push(`${p.route} description ${len} chars (truncated in SERP)`);
  }
  return bad;
});

// ── S-8: JSON-LD must parse and be script-safe ─────────────────────────────
check('S-8 JSON-LD parses and is script-safe', () => {
  const bad = [];
  for (const p of P) {
    const blocks = [
      ...p.html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
    ];
    if (!blocks.length) {
      bad.push(`${p.route} emits no JSON-LD`);
      continue;
    }
    for (const [, raw] of blocks) {
      if (raw.includes('<')) bad.push(`${p.route} JSON-LD contains a raw "<" (unescaped)`);
      try {
        JSON.parse(raw);
      } catch (e) {
        bad.push(`${p.route} JSON-LD invalid: ${e.message}`);
      }
    }
  }
  return bad;
});

// ── S-2: entity graph must be connected by @id ─────────────────────────────
check('S-2 entity graph is connected by @id', () =>
  P.filter((p) => !p.html.includes('"@id":"https://www.oyechats.com/#organization"')).map(
    (p) => `${p.route} does not reference the canonical Organization @id`,
  ),
);

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
    const n = P.filter(
      (o) => o.route !== post.route && o.html.includes(`href="${post.route}"`),
    ).length;
    if (n < 3) bad.push(`${post.route} has only ${n} inbound page(s)`);
  }
  return bad;
});

// ── A-2: long pages need an h3 tier so content chunks for AI retrieval ─────
check('A-2 long pages have h3 subheadings', () => {
  const bad = [];
  for (const route of ['/features', '/solutions']) {
    const p = P.find((x) => x.route === route);
    if (!p) {
      bad.push(`${route} not built`);
      continue;
    }
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
      if (prev && lvl > prev + 1) {
        bad.push(`${p.route} skips h${prev} → h${lvl}`);
        break;
      }
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

// ── F-2: icons must never be the sole carrier of meaning ──────────────────
check('F-2 no unlabelled icon-only table cells', () => {
  const pricing = P.find((p) => p.route === '/pricing');
  if (!pricing) return ['/pricing not built'];
  return pricing.html.includes('>Included<') && pricing.html.includes('>Not included<')
    ? []
    : ['/pricing comparison table has no text alternative for ✓/✗ cells'];
});

// ── F-6: every design-token class used must exist in the compiled CSS ─────
check('F-6 no phantom design-token classes', () => {
  if (!CSS) return SKIP;
  const tokens = ['volt-fg', 'signal-graphic'];
  const bad = [];
  for (const t of tokens) {
    const usedInHtml = P.some((p) => p.html.includes(t));
    if (usedInHtml && !CSS.includes(t)) {
      bad.push(`class using "${t}" ships in HTML but matches no compiled CSS rule`);
    }
  }
  return bad;
});

// ── F-8: skip link must exist ─────────────────────────────────────────────
check('F-8 skip link present', () =>
  P.filter((p) => !p.html.includes('href="#main"')).map((p) => `${p.route} has no skip link`),
);

// ── T-6: canonical must be present, absolute and www ──────────────────────
check('T-6 canonical is absolute and www', () => {
  const bad = [];
  for (const p of P) {
    const m = p.html.match(/<link rel="canonical" href="([^"]*)"/);
    if (!m) {
      bad.push(`${p.route} has no canonical`);
      continue;
    }
    if (!m[1].startsWith('https://www.oyechats.com')) {
      bad.push(`${p.route} canonical is not www-absolute: ${m[1]}`);
    }
  }
  return bad;
});

/**
 * Capabilities the product does NOT have, which have each reached production
 * copy at least once. Every entry is a claim a buyer could pay for and not
 * receive, so this asserts against the compiled HTML rather than the source:
 * the claims previously arrived via data files, JSON-LD and legal documents,
 * and only the rendered output sees all three at once.
 *
 * - MEDDIC / CHAMP: only BANT is implemented. These were sold as a paid
 *   Professional feature and also described in the privacy policy and DPA.
 * - CLI: the install is one script tag. There is no CLI and no SDK.
 * - cited / citations / "links back to the source": answers are genuinely
 *   grounded via hybrid RAG, but the platform prompt forbids mentioning
 *   sources and the streaming response carries no source data, so the visitor
 *   never sees a citation. Removed once in 1795f3e; regressed; removed again.
 */
const UNSHIPPED_CLAIMS = [
  { term: 'MEDDIC', re: /\bMEDDIC\b/i },
  { term: 'CHAMP', re: /\bCHAMP\b/i },
  { term: 'CLI', re: /\bCLI\b/ },
  { term: 'cited', re: /\bcited\b/i },
  { term: 'citation', re: /\bcitations?\b/i },
  { term: 'source link', re: /links? back to the source/i },
];

check('C-1 no claims for unshipped capabilities', () => {
  const bad = [];
  for (const p of P) {
    // Strip JSON-LD script bodies' escaped unicode so <-style encoding
    // cannot hide a claim from a plain substring match.
    const text = p.html.replace(/\\u([0-9a-f]{4})/gi, (_, h) =>
      String.fromCharCode(parseInt(h, 16))
    );
    for (const { term, re } of UNSHIPPED_CLAIMS) {
      if (re.test(text)) {
        bad.push(`${p.route} claims "${term}" — not a shipped capability`);
      }
    }
  }
  return bad;
});

// ── Report ────────────────────────────────────────────────────────────────
const failedIds = [...new Set(failures.map((f) => f.id))];
const total = passed.length + skipped.length + failedIds.length;
console.log(`Checked ${P.length} compiled routes across ${total} assertions.\n`);

if (failures.length) {
  console.error(`✗ ${failures.length} failure(s) across ${failedIds.length} assertion(s):\n`);
  for (const id of failedIds) {
    const msgs = failures.filter((f) => f.id === id);
    console.error(`  ${id}  (${msgs.length})`);
    for (const { msg } of msgs) console.error(`      ${msg}`);
  }
}

if (passed.length) console.log(`\n✓ passing (${passed.length}):`);
for (const id of passed) console.log(`      ${id}`);

if (skipped.length) {
  console.log(`\n⊘ skipped — precondition unavailable (${skipped.length}):`);
  for (const id of skipped) console.log(`      ${id}`);
}

process.exit(failures.length ? 1 : 0);
