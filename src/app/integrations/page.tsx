import type { Metadata } from 'next';
import { SITE_URL, buildGraph, jsonLd, pageMeta } from '@/lib/seo';
import { INTEGRATIONS } from '@/lib/integrations';
import IntegrationsClient from './IntegrationsClient';

const title = 'Integrations — One Script Tag, Any Site';
const description =
  'Install OyeChats with one script tag. Works with WordPress, Webflow, Next.js, React, and Vue, plus signed webhooks that push every chat event to your CRM.';

export const metadata: Metadata = pageMeta({
  title,
  description,
  path: '/integrations',
});

// Each ListItem previously carried neither `item` nor `url`, which makes the
// list invalid per Google's ItemList spec — it must be one or the other. There
// are no per-integration routes, so the all-in-one-page form (nested `item`) is
// the correct choice rather than `url`.
const graph = buildGraph({
  path: '/integrations',
  name: 'OyeChats Supported Integrations',
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

export default function IntegrationsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <IntegrationsClient />
    </>
  );
}
