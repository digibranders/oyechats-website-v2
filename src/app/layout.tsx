import type { Metadata, Viewport } from 'next';
import { Inter, Geist, Geist_Mono, Fraunces } from 'next/font/google';
import Navbar from '@/components/site/Navbar';
import Footer from '@/components/site/Footer';
// Hidden for now, re-enable (import + render below) when there's an announcement or offer.
// import AnnouncementBar from '@/components/site/AnnouncementBar';
import './globals.css';
import WidgetLoader from '@/components/site/WidgetLoader';
import Script from 'next/script';

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

const siteSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'OyeChats',
      url: 'https://www.oyechats.com',
      logo: 'https://www.oyechats.com/logo.png',
      description: SITE_DESCRIPTION,
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      name: 'OyeChats',
      url: 'https://www.oyechats.com',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geist.variable} ${geistMono.variable} ${fraunces.variable}`}
    >
      <body>
        {/* <AnnouncementBar />, hidden for now; re-enable for announcements/offers */}
        <Navbar />
        <main>{children}</main>
        <Footer />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        <Script
          src="http://localhost:4173/oyechats-widget.js"
          data-bot-key="bot-d3574fdd8e89"
          strategy="lazyOnload"
        />

        {/* <WidgetLoader /> */}
      </body>
    </html>
  );
}
