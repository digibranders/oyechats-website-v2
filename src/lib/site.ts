/**
 * Site-wide static content, nav, footer, constants.
 * Every string here appears somewhere in the UI.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.oyechats.com';

/**
 * The app's origin, for recognising links that leave this site for the console.
 * `AttributionCapture` matches anchors against it to carry `?ref=` / `?code=`
 * through to signup.
 */
export const APP_ORIGIN = APP_URL;

/** Platform REST API base. Health status is read from `${API_URL}/health`. */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.oyechats.com';

/** Dedicated public status page, hosted independently of the platform. */
export const STATUS_URL = process.env.NEXT_PUBLIC_STATUS_URL ?? 'https://status.oyechats.com';

export const APP_LINKS = {
  register: `${APP_URL}/register`,
  registerStarter: `${APP_URL}/register?plan=starter`,
  registerStandard: `${APP_URL}/register?plan=standard`,
  registerProfessional: `${APP_URL}/register?plan=professional`,
  login: `${APP_URL}/login`,
  home: APP_URL,
} as const;

/** Public support inbox. Also the `contactPoint` email in the Organization schema. */
export const SUPPORT_EMAIL = 'support@oyechats.com';

/**
 * Official profiles. Rendered in the footer AND used verbatim as
 * `Organization.sameAs`. Keeping one source means the entity signal can never
 * drift from the links users actually see.
 */
export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/oyechats' },
  { label: 'Instagram', href: 'https://www.instagram.com/oyechats' },
  { label: 'X', href: 'https://x.com/oyechats' },
  { label: 'GitHub', href: 'https://github.com/digibranders' },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Solutions', href: '/solutions' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'Case studies', href: '/case-studies' },
      { label: 'Security', href: '/security' },
      { label: 'Status', href: STATUS_URL },
      { label: 'Blog', href: '/blog' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Legal',
    links: [
      // The hub is listed first on purpose: without it /legal had zero inbound
      // links from anywhere on the site and was reachable only via sitemap.xml.
      { label: 'All legal docs', href: '/legal' },
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
      { label: 'Acceptable use', href: '/legal/aup' },
      { label: 'DPA', href: '/legal/dpa' },
      { label: 'Sub-processors', href: '/legal/subprocessors' },
      { label: 'Cookies', href: '/legal/cookies' },
      // Distinct from the marketing page at /security. This is the
      // vulnerability-reporting policy the Privacy Policy points at.
      { label: 'Responsible disclosure', href: '/legal/security' },
      { label: 'Refund', href: '/legal/refund' },
      { label: 'Cancellation', href: '/legal/cancellation' },
    ],
  },
] as const;
