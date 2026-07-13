/**
 * Site-wide static content, nav, footer, constants.
 * Every string here appears somewhere in the UI.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.oyechats.com';

/** Platform REST API base. Health status is read from `${API_URL}/health`. */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.oyechats.com';

export const APP_LINKS = {
  register: `${APP_URL}/register`,
  registerStarter: `${APP_URL}/register?plan=starter`,
  registerStandard: `${APP_URL}/register?plan=standard`,
  login: `${APP_URL}/login`,
  home: APP_URL,
} as const;

export const NAV_LINKS = [
  { label: 'Product', href: '/features' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
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
      { label: 'Security', href: '/security' },
      { label: 'Blog', href: '/blog' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
      { label: 'DPA', href: '/legal/dpa' },
      { label: 'Sub-processors', href: '/legal/subprocessors' },
      { label: 'Cookies', href: '/legal/cookies' },
      { label: 'Refund', href: '/legal/refund' },
      { label: 'Cancellation', href: '/legal/cancellation' },
    ],
  },
] as const;
