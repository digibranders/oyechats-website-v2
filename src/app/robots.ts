import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * Crawlers we explicitly welcome. The previous two-line wildcard already
 * permitted all of these, but the policy was implicit and unmanaged — nobody
 * had made a decision, so nobody could defend one, and a future blanket AI
 * block could land without a conversation.
 *
 * The case for allowing, specifically here: OyeChats is a low-ACV, self-serve,
 * product-led SaaS with no content moat — the site IS the marketing. Being the
 * cited answer to "best AI chatbot for Indian SMBs" is worth far more than
 * keeping marketing copy out of a training corpus. That calculus would differ
 * for a paywalled research business.
 *
 * Worth knowing: `Google-Extended` gates Gemini and AI Overviews grounding
 * ONLY. It has no effect on classic Search ranking, so disallowing it would
 * remove the site from the highest-volume AI surface while gaining nothing.
 */
const AI_ALLOW = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
];

/** Aggressive crawlers with no citation upside for a B2B SaaS. */
const DISALLOW = ['Bytespider', 'Amazonbot', 'Diffbot', 'Omgili', 'omgilibot', 'ImagesiftBot'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // /api/ is a POST-only mail endpoint plus a health proxy: no crawl value.
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      ...AI_ALLOW.map((userAgent) => ({ userAgent, allow: '/' })),
      ...DISALLOW.map((userAgent) => ({ userAgent, disallow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
