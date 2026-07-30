import type { Metadata } from 'next';
import { ID, buildGraph, jsonLd, pageMeta } from '@/lib/seo';
import ContactClient from './ContactClient';

const title = 'Contact Sales & Support';
const description =
  'Get in touch with OyeChats. Talk to sales about a rollout, request a demo, or reach support. We usually reply within one business day.';

export const metadata: Metadata = pageMeta({
  title,
  description,
  path: '/contact',
});

// `mainEntity` points at the Organization, not a ContactPoint. A ContactPoint is
// a property OF an organization, not a thing a page can be "about" — and the
// contact details now live on the single Organization node in the site graph.
const graph = buildGraph({
  path: '/contact',
  name: 'Contact OyeChats',
  description,
  type: 'ContactPage',
  about: ID.organization,
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Contact' }],
});

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <ContactClient />
    </>
  );
}
