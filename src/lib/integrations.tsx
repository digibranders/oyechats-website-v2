import type { ReactNode } from 'react';
import {
  siWordpress,
  siShopify,
  siWebflow,
  siNextdotjs,
  siHtml5,
  siVuedotjs,
  siReact,
  siFramer,
  siBrevo,
  siCalendly,
  siSentry,
  siZapier,
  siMake,
  type SimpleIcon,
} from 'simple-icons';
import { Link as LinkIcon, Wrench } from 'lucide-react';

export type IntegrationCategory =
  | 'cms'
  | 'website'
  | 'crm'
  | 'meetings'
  | 'analytics'
  | 'automation'
  | 'developer';

export type Integration = {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  install: string;
  available: boolean;
  icon: ReactNode;
};

/** Renders a simple-icons brand glyph. */
function BrandIcon({
  icon,
  size = 28,
  overrideColor,
}: {
  icon: SimpleIcon;
  size?: number;
  overrideColor?: string;
}) {
  return (
    <svg
      role="img"
      aria-label={icon.title}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={overrideColor ?? `#${icon.hex}`}
    >
      <path d={icon.path} />
    </svg>
  );
}

/** Langfuse doesn't ship in simple-icons; custom SVG. */
function LangfuseIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      role="img"
      aria-label="Langfuse"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
    >
      <rect width="32" height="32" rx="7" fill="#0F1010" />
      <path d="M9 8h3.5v12.5H21V24H9V8Z" fill="#E11AAF" />
      <path d="M15.5 8h3.5v9.5h3.5V21H15.5V8Z" fill="#F2C94C" opacity="0.95" />
    </svg>
  );
}

export const INTEGRATIONS: Integration[] = [
  { id: 'wordpress', name: 'WordPress', description: 'Paste one script tag', category: 'cms', install: 'Plugin', available: true, icon: <BrandIcon icon={siWordpress} /> },
  { id: 'shopify', name: 'Shopify', description: 'Add the script to your theme', category: 'cms', install: 'App', available: true, icon: <BrandIcon icon={siShopify} /> },
  { id: 'webflow', name: 'Webflow', description: 'Custom embed code', category: 'cms', install: 'Embed', available: true, icon: <BrandIcon icon={siWebflow} /> },

  { id: 'nextjs', name: 'Next.js', description: 'Script component', category: 'website', install: 'Script', available: true, icon: <BrandIcon icon={siNextdotjs} /> },
  { id: 'html', name: 'HTML / Vanilla', description: 'Single script tag', category: 'website', install: 'Script', available: true, icon: <BrandIcon icon={siHtml5} /> },
  { id: 'vue', name: 'Vue.js', description: 'Plugin or script', category: 'website', install: 'npm', available: true, icon: <BrandIcon icon={siVuedotjs} /> },
  { id: 'react', name: 'React', description: 'Drop-in component', category: 'website', install: 'npm', available: true, icon: <BrandIcon icon={siReact} /> },
  { id: 'framer', name: 'Framer', description: 'Code component embed', category: 'website', install: 'Component', available: true, icon: <BrandIcon icon={siFramer} /> },

  { id: 'brevo', name: 'Brevo', description: 'Transactional email', category: 'crm', install: 'API', available: true, icon: <BrandIcon icon={siBrevo} /> },
  { id: 'calendly', name: 'Calendly', description: 'In-chat booking', category: 'meetings', install: 'Link', available: true, icon: <BrandIcon icon={siCalendly} /> },

  { id: 'langfuse', name: 'Langfuse', description: 'AI observability and tracing', category: 'analytics', install: 'API', available: true, icon: <LangfuseIcon /> },
  { id: 'sentry', name: 'Error Monitoring', description: 'Incident alerting', category: 'analytics', install: 'DSN', available: true, icon: <BrandIcon icon={siSentry} overrideColor="#A99CFF" /> },

  { id: 'zapier', name: 'Zapier', description: 'Via webhooks', category: 'automation', install: 'Zap', available: true, icon: <BrandIcon icon={siZapier} /> },
  { id: 'make', name: 'Make', description: 'Via webhooks', category: 'automation', install: 'Scenario', available: true, icon: <BrandIcon icon={siMake} /> },

  { id: 'webhooks', name: 'Webhooks', description: '5 event types', category: 'developer', install: 'Webhook', available: true, icon: <LinkIcon className="w-7 h-7 text-volt" strokeWidth={1.5} /> },
  { id: 'rest-api', name: 'REST API', description: 'Full OpenAPI spec', category: 'developer', install: 'HTTP', available: true, icon: <Wrench className="w-7 h-7 text-volt" strokeWidth={1.5} /> },
];

export const INTEGRATION_CATEGORIES: { id: IntegrationCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'cms', label: 'CMS' },
  { id: 'website', label: 'Website' },
  { id: 'crm', label: 'CRM' },
  { id: 'meetings', label: 'Meetings' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'automation', label: 'Automation' },
  { id: 'developer', label: 'Developer' },
];
