import type { Metadata } from 'next';
import { PRICING_TIERS, type Currency } from '@/lib/pricing';
import { SOCIAL_LINKS, SUPPORT_EMAIL } from '@/lib/site';

export const SITE_URL = 'https://www.oyechats.com';

/** Absolute URL for a site-relative path. `/` yields the bare origin + slash. */
export function abs(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/**
 * Stable `@id` anchors. Every schema node the site emits is addressable here, so
 * nodes reference each other instead of being repeated. Without these the site
 * emitted five unlinked `Organization` nodes and two rival `SoftwareApplication`
 * nodes, and search engines had to guess they described one entity.
 */
export const ID = {
  organization: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
  logo: `${SITE_URL}/#logo`,
  software: `${SITE_URL}/#software`,
  webPage: (path: string) => `${abs(path)}#webpage`,
  breadcrumb: (path: string) => `${abs(path)}#breadcrumb`,
  article: (path: string) => `${abs(path)}#article`,
} as const;

/**
 * Serialises a schema object for `<script type="application/ld+json">`.
 *
 * `JSON.stringify` does not escape `<`, so a value containing `</script>` would
 * close the tag early and inject whatever followed as live HTML. Authored blog
 * content already contains that exact string (the widget install snippet), so
 * this is a live hazard the moment any schema field reads from post content.
 * The `<` form is valid JSON and parses back to the identical string, so
 * escaping changes nothing about how the markup is interpreted.
 */
export function jsonLd(schema: unknown): string {
  return JSON.stringify(schema)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * Builds consistent per-page metadata: document title (the root layout applies
 * the `%s · OyeChats` template), canonical URL, and matching OpenGraph + Twitter
 * tags.
 *
 * `images` must be set explicitly. A page-level `openGraph` *replaces* the root
 * one rather than merging, and the file-convention `app/opengraph-image` only
 * backfills pages that declare no `openGraph` at all — so every page using this
 * helper previously shipped with no og:image or twitter:image.
 */
export function pageMeta({
  title,
  description,
  path,
  image = '/opengraph-image',
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const social = `${title} · OyeChats`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      title: social,
      description,
      url: path,
      siteName: 'OyeChats',
      images: [{ url: image, width: 1200, height: 630, alt: social }],
    },
    twitter: {
      card: 'summary_large_image',
      title: social,
      description,
      images: [image],
    },
  };
}

/**
 * Paid + free tiers as `Offer` nodes, in both currencies the site actually
 * bills in. Emitting INR here matters independently of the UI: the pricing page
 * renders only the active currency, so rupee pricing was invisible to every
 * crawler even though llms.txt advertised it.
 *
 * Written as an explicit loop rather than `flatMap`: a callback returning `[]`
 * on one branch and objects on the other infers as `never[]` under strict mode.
 */
function pricingOffers(): Record<string, unknown>[] {
  const currencies: { code: Currency; region?: string }[] = [
    { code: 'USD' },
    { code: 'INR', region: 'IN' },
  ];

  const offers: Record<string, unknown>[] = [];
  for (const tier of PRICING_TIERS) {
    const monthly = tier.monthly;
    if (!monthly) continue;
    for (const { code, region } of currencies) {
      const amount = String(monthly[code]);
      offers.push({
        '@type': 'Offer',
        '@id': `${SITE_URL}/pricing#offer-${tier.id}-${code.toLowerCase()}`,
        name: tier.name,
        url: `${SITE_URL}/pricing`,
        availability: 'https://schema.org/InStock',
        price: amount,
        priceCurrency: code,
        ...(region ? { eligibleRegion: { '@type': 'Country', name: region } } : {}),
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: amount,
          priceCurrency: code,
          billingIncrement: 1,
          unitCode: 'MON',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
        },
      });
    }
  }
  return offers;
}

const SITE_DESCRIPTION =
  'AI chatbot that qualifies every visitor with BANT scoring before your sales reps see them. RAG-grounded answers, live handoff, webhooks, and analytics.';

/**
 * Site-level entity graph, emitted once from the root layout. Every page-level
 * graph references these by `@id` rather than redefining them.
 *
 * Deliberately omitted: `aggregateRating`/`review` (no real reviews exist — the
 * Software App rich result stays unattainable until they do, and inventing them
 * would be a spam-policy violation), `foundingDate`, `telephone`, and
 * `streetAddress` (not present anywhere in this repo). `addressLocality` and
 * `addressCountry` come from the offices list rendered on /about.
 */
export function siteGraph(featureList: string[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ID.organization,
        name: 'OyeChats',
        // Helps Google associate the spaced spelling with the coined one-word
        // brand, so a search for "oye chats" resolves to this entity.
        alternateName: 'Oye Chats',
        url: `${SITE_URL}/`,
        logo: { '@id': ID.logo },
        image: { '@id': ID.logo },
        description: SITE_DESCRIPTION,
        sameAs: SOCIAL_LINKS.map((s) => s.href),
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: SUPPORT_EMAIL,
            url: `${SITE_URL}/contact`,
            availableLanguage: ['en'],
          },
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Thane',
          addressCountry: 'IN',
        },
      },
      {
        '@type': 'ImageObject',
        '@id': ID.logo,
        url: `${SITE_URL}/logo.png`,
        contentUrl: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
        caption: 'OyeChats',
      },
      {
        '@type': 'WebSite',
        '@id': ID.website,
        name: 'OyeChats',
        alternateName: 'Oye Chats',
        url: `${SITE_URL}/`,
        publisher: { '@id': ID.organization },
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': ID.software,
        name: 'OyeChats',
        url: `${SITE_URL}/`,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Conversational AI / live chat',
        operatingSystem: 'Web browser',
        description: SITE_DESCRIPTION,
        publisher: { '@id': ID.organization },
        featureList,
        offers: pricingOffers(),
      },
    ],
  };
}

export type Crumb = { name: string; path?: string };

/**
 * Per-page graph: a `WebPage` node plus an optional `BreadcrumbList`, plus any
 * page-specific nodes. The `WebPage` is what gives `breadcrumb`, `isPartOf`, and
 * `dateModified` something to attach to — previously no route declared one.
 *
 * The final breadcrumb entry deliberately carries no `item`: that is Google's
 * documented preference for the page you are already on.
 */
export function buildGraph({
  path,
  name,
  description,
  crumbs = [],
  about = ID.software,
  dateModified,
  nodes = [],
  type = 'WebPage',
}: {
  path: string;
  name: string;
  description: string;
  crumbs?: Crumb[];
  about?: string | null;
  dateModified?: string;
  nodes?: Record<string, unknown>[];
  type?: string;
}): Record<string, unknown> {
  const webPage: Record<string, unknown> = {
    '@type': type,
    '@id': ID.webPage(path),
    url: abs(path),
    name,
    description,
    isPartOf: { '@id': ID.website },
    primaryImageOfPage: { '@id': ID.logo },
    inLanguage: 'en',
    ...(about ? { about: { '@id': about } } : {}),
    ...(dateModified ? { dateModified } : {}),
  };

  const graph: Record<string, unknown>[] = [webPage];

  if (crumbs.length > 1) {
    webPage.breadcrumb = { '@id': ID.breadcrumb(path) };
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': ID.breadcrumb(path),
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        ...(c.path ? { item: abs(c.path) } : {}),
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': [...graph, ...nodes] };
}
