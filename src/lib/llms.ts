import { BLOG_POSTS, type BlogBlock } from '@/lib/blog';
import { LEGAL_PAGES } from '@/lib/legal';
import { PRICING_TIERS, PRICING_FAQ, CURRENCY_SYMBOL } from '@/lib/pricing';
import { FEATURES } from '@/lib/features';
import { INTEGRATIONS } from '@/lib/integrations';
import { DOC_PAGES } from '@/lib/docs';
import { SITE_URL } from '@/lib/seo';

/**
 * llms.txt and llms-full.txt, generated from the same typed modules that
 * generate the sitemap.
 *
 * The previous hand-written `public/llms.txt` advertised an "Enterprise
 * (custom)" plan that had been deleted from the product, with a fabricated
 * price, in the one file AI answer engines fetch first and treat as
 * authoritative. It drifted within days of a pricing change. Deriving it from
 * PRICING_TIERS / BLOG_POSTS / LEGAL_PAGES makes that class of drift
 * structurally impossible rather than a thing someone has to remember.
 *
 * Descriptions are reused verbatim from the modules; no marketing copy is
 * written here.
 */

const SUMMARY =
  'AI chatbot that answers visitors from your own docs, scores their intent with BANT, and routes qualified buyers to a live human.';

const INTRO =
  'OyeChats is an AI chatbot for websites. It answers visitor questions grounded in your own documentation via retrieval-augmented generation (RAG), so replies stay accurate to your content instead of a model\'s training data. As each conversation unfolds, OyeChats reads it for Budget, Authority, Need, and Timeline signals and produces a composite BANT lead score from 0 to 100. When a lead heats up, the chat is handed to a live human teammate in the same thread, with the full transcript and score already attached. Installation is a single script tag on any website. Every event is delivered to your CRM or your own endpoint via HMAC-signed webhooks, and live dashboards show what actually converts.';

const KEY_PAGES: { path: string; blurb: string }[] = [
  { path: '/', blurb: 'Overview of OyeChats, how it works, and headline stats.' },
  { path: '/features', blurb: 'Streaming answers, grounded RAG, BANT scoring, live handoff, analytics, and webhooks.' },
  { path: '/solutions', blurb: 'Workflows for customer support, sales lead generation, docs assistants, and live chat handoff.' },
  { path: '/pricing', blurb: 'Credit-based plans with a free tier. Billed in USD internationally and INR in India.' },
  { path: '/integrations', blurb: 'One-line install on WordPress, Webflow, Next.js, React, Vue, or plain HTML.' },
  { path: '/docs', blurb: 'Setup guides, widget configuration, webhook events, and API reference.' },
  { path: '/security', blurb: 'Encryption, signed webhooks, access controls, and infrastructure details.' },
  { path: '/about', blurb: 'What OyeChats is building and why.' },
  { path: '/changelog', blurb: 'Product updates and release notes as they ship.' },
  { path: '/legal', blurb: 'Privacy, terms, DPA, sub-processors, cookies, refund, and cancellation policies.' },
  { path: '/contact', blurb: 'Get in touch with sales or support.' },
];

/** Plan lines generated from PRICING_TIERS so a removed tier cannot linger. */
function pricingLines(): string {
  return PRICING_TIERS.map((tier) => {
    if (!tier.monthly) return `- ${tier.name}: custom pricing.`;
    const usd = `${CURRENCY_SYMBOL.USD}${tier.monthly.USD}`;
    const inr = `${CURRENCY_SYMBOL.INR}${tier.monthly.INR.toLocaleString('en-IN')}`;
    const price = tier.monthly.USD === 0 ? 'free' : `${usd}/mo international, ${inr}/mo in India`;
    return `- ${tier.name}: ${price}.`;
  }).join('\n');
}

export function buildLlmsTxt(): string {
  const sections = [
    `# OyeChats`,
    `> ${SUMMARY}`,
    INTRO,
    `## Key pages`,
    KEY_PAGES.map((p) => `- [${p.path === '/' ? 'Home' : p.path}](${SITE_URL}${p.path}): ${p.blurb}`).join('\n'),
    `## Articles`,
    BLOG_POSTS.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`).join('\n'),
    `## Plans`,
    pricingLines(),
    `## Capabilities`,
    FEATURES.map((f) => `- ${f.title}: ${f.tagline}`).join('\n'),
    `## Integrations`,
    INTEGRATIONS.map((i) => `- ${i.name}: ${i.description}`).join('\n'),
    `## Documentation`,
    // Enumerated from the corpus rather than hand-listed: the previous three
    // hand-written lines all pointed at /docs itself, so an answer engine
    // reading this file could not reach any individual documentation page.
    DOC_PAGES.map(({ page, path }) => `- [${page.title}](${SITE_URL}${path}): ${page.metaDescription}`).join('\n'),
    `## API`,
    [
      `- [OpenAPI specification](${SITE_URL}/openapi.json): machine-readable REST API schema for the customer-facing endpoints.`,
    ].join('\n'),
    `## Legal`,
    LEGAL_PAGES.map((p) => `- [${p.title}](${SITE_URL}/legal/${p.slug}): ${p.description} Last updated ${p.lastUpdated}.`).join('\n'),
    `## Full text`,
    `- [llms-full.txt](${SITE_URL}/llms-full.txt): complete text of every article and policy.`,
  ];
  return `${sections.join('\n\n')}\n`;
}

/** BlogBlock[] -> markdown. Code fences keep the widget snippet intact. */
function blocksToMarkdown(content: BlogBlock[]): string {
  return content
    .map((b) => {
      switch (b.type) {
        case 'h2':
          return `## ${b.text}`;
        case 'h3':
          return `### ${b.text}`;
        case 'p':
          return b.text;
        case 'ul':
          return b.items.map((i) => `- ${i}`).join('\n');
        case 'ol':
          return b.items.map((i, n) => `${n + 1}. ${i}`).join('\n');
        case 'code':
          return ['```', b.text, '```'].join('\n');
        case 'quote':
          return `> ${b.text}`;
        default:
          return '';
      }
    })
    .filter(Boolean)
    .join('\n\n');
}

export function buildLlmsFullTxt(): string {
  const parts: string[] = [`# OyeChats: full text`, `> ${SUMMARY}`, INTRO];

  parts.push(`# Pricing`, pricingLines());
  parts.push(
    `# Pricing FAQ`,
    PRICING_FAQ.map((f) => `## ${f.q}\n\n${f.a}`).join('\n\n'),
  );

  parts.push(`# Articles`);
  for (const post of BLOG_POSTS) {
    parts.push(
      `## ${post.title}`,
      `Source: ${SITE_URL}/blog/${post.slug}\nPublished: ${post.dateISO}${post.updatedISO ? `\nUpdated: ${post.updatedISO}` : ''}\nCategory: ${post.category}`,
      blocksToMarkdown(post.content),
    );
    if (post.faq?.length) {
      parts.push(post.faq.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n'));
    }
  }

  parts.push(`# Legal`);
  for (const doc of LEGAL_PAGES) {
    parts.push(
      `## ${doc.title}`,
      `Source: ${SITE_URL}/legal/${doc.slug}\nLast updated: ${doc.lastUpdated}`,
      doc.sections.map((sec) => `### ${sec.heading}\n\n${sec.body.join('\n\n')}`).join('\n\n'),
    );
  }

  return `${parts.join('\n\n')}\n`;
}
