import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { LegalDocument } from '@/components/site/LegalDocument';
import { LEGAL_PAGES } from '@/lib/legal';

// Distinct from the marketing page at /security: that one sells the security
// posture, this one is the reportable policy the Privacy Policy points at.
const SLUG = 'security';
const page = LEGAL_PAGES.find((p) => p.slug === SLUG)!;

export const metadata: Metadata = pageMeta({
  title: page.metaTitle,
  description: page.metaDescription,
  path: `/legal/${SLUG}`,
});

export default function Page() {
  if (!page) notFound();
  return <LegalDocument page={page} />;
}
