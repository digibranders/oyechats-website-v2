import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { INTEGRATIONS } from '@/lib/integrations';
import IntegrationsClient from './IntegrationsClient';

const title = 'Integrations';
const description =
  'Install OyeChats with one script tag and connect everywhere. Works with WordPress, Webflow, Next.js, React, and Vue, plus signed webhooks that push every chat event to your CRM and automation tools.';

export const metadata: Metadata = pageMeta({
  title,
  description,
  path: '/integrations',
});

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'OyeChats Supported Integrations',
  description,
  url: 'https://www.oyechats.com/integrations',
  itemListElement: INTEGRATIONS.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    description: item.description,
  })),
};

export default function IntegrationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <IntegrationsClient />
    </>
  );
}
