import type { Metadata, Viewport } from 'next';
import { Inter, Geist, Geist_Mono, Fraunces } from 'next/font/google';
import Navbar from '@/components/site/Navbar';
import Footer from '@/components/site/Footer';
// Hidden for now, re-enable (import + render below) when there's an announcement or offer.
// import AnnouncementBar from '@/components/site/AnnouncementBar';
import './globals.css';
import WidgetLoader from '@/components/site/WidgetLoader';
import Analytics from '@/components/site/Analytics';
import ConsentProvider from '@/components/site/ConsentProvider';
import CookieConsent from '@/components/site/CookieConsent';
import { jsonLd, siteGraph } from '@/lib/seo';
import { FEATURES } from '@/lib/features';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-geist-mono',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  display: 'swap',
  // Editorial accent used only on blog/about pull-quotes; keep it off the
  // critical path so it never competes with the LCP font on other pages.
  preload: false,
  variable: '--font-fraunces',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAFAF7',
};

const SITE_DESCRIPTION =
  'AI chatbot that qualifies every visitor with BANT scoring before your sales reps see them. RAG-grounded answers, live handoff, webhooks, and analytics.';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.oyechats.com'),
  title: {
    default: 'OyeChats. You only talk to buyers.',
    template: '%s · OyeChats',
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    // No `url` here: it is the homepage's own value, but is silently inherited by
    // any page lacking its own openGraph, pointing their og:url at '/'. The home
    // page sets its own url in app/page.tsx; other pages set theirs via pageMeta.
    title: 'OyeChats. You only talk to buyers.',
    description:
      'AI chatbot that qualifies every visitor with BANT scoring before your sales reps see them.',
    siteName: 'OyeChats',
  },
  twitter: { card: 'summary_large_image', title: 'OyeChats. You only talk to buyers.' },
  robots: { index: true, follow: true },
};

// One connected entity graph for the whole site: Organization, WebSite, logo and
// SoftwareApplication, each with a stable @id that per-page graphs reference.
// Replaces five unlinked Organization nodes and two rival SoftwareApplication
// nodes that search engines had to guess were the same entity.
const siteSchema = siteGraph(FEATURES.map((f) => f.title));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geist.variable} ${geistMono.variable} ${fraunces.variable}`}
    >
      <Analytics />
      <body>
        <ConsentProvider>
          {/* Keyboard users otherwise tab through the logo, six nav links and two
              CTAs on every page before reaching content (WCAG 2.4.1). */}
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          {/* <AnnouncementBar />, hidden for now; re-enable for announcements/offers */}
          <Navbar />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd(siteSchema) }}
          />

          <WidgetLoader />
          <CookieConsent />
        </ConsentProvider>
      </body>
    </html>
  );
}
