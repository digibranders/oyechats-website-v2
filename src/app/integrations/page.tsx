import type { Metadata } from 'next';
import IntegrationsClient from './IntegrationsClient';

const title = 'Integrations';
const description =
  'Install OyeChats with one script tag and connect everywhere. Works with WordPress, Webflow, Next.js, React, and Vue, plus signed webhooks that push every chat event to your CRM and automation tools.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/integrations' },
  openGraph: {
    title,
    description,
    url: '/integrations',
  },
};

export default function IntegrationsPage() {
  return <IntegrationsClient />;
}
