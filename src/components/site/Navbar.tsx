'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Sparkles,
  Headphones,
  Target,
  BookOpen,
  MessageCircle,
  Zap,
  Search,
  BrainCircuit,
  MessageSquare,
  Code,
  ShieldCheck,
  Webhook,
  LineChart,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ds';
import { APP_LINKS } from '@/lib/site';
import { Logo } from './Logo';
import { cn } from '@/lib/cn';

type MegaColumn = {
  title: string;
  items: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; description: string; href: string }[];
};

const PRODUCT_MENU: MegaColumn[] = [
  {
    title: 'What it does',
    items: [
      { icon: BrainCircuit, label: 'BANT scoring', description: 'Qualify every visitor automatically', href: '/features#feature-bant' },
      { icon: Search, label: 'Grounded answers', description: 'Answers pulled from your own docs', href: '/features#feature-rag' },
      { icon: MessageSquare, label: 'Live handoff', description: 'Hand off to a human, with context', href: '/features#feature-live-chat' },
      { icon: Zap, label: 'Streaming answers', description: 'Replies stream in real time', href: '/features#feature-rag' },
    ],
  },
  {
    title: 'Set up and grow',
    items: [
      { icon: Code, label: 'Easy setup', description: 'One script tag, any website', href: '/features#feature-integrations' },
      { icon: Webhook, label: 'Webhooks and REST API', description: 'Push events to your own tools', href: '/docs#webhooks' },
      { icon: LineChart, label: 'Deep analytics', description: 'See what actually converts', href: '/features#feature-analytics' },
      { icon: ShieldCheck, label: 'Security', description: 'GDPR, HMAC signing, RBAC', href: '/security' },
    ],
  },
];

const SOLUTIONS_MENU: MegaColumn[] = [
  {
    title: 'By team',
    items: [
      { icon: Headphones, label: 'Customer Support', description: 'Cut ticket volume, keep quality', href: '/solutions#customer-support' },
      { icon: Target, label: 'Sales and Lead Gen', description: 'Qualify every visitor', href: '/solutions#sales-lead-gen' },
      { icon: BookOpen, label: 'Docs Assistant', description: 'Grounded answers from your knowledge base', href: '/solutions#docs-assistant' },
      { icon: MessageCircle, label: 'Live Chat Handoff', description: 'Bot first, human second', href: '/solutions#live-chat-handoff' },
    ],
  },
];

const RESOURCES_MENU: MegaColumn[] = [
  {
    title: 'Resources',
    items: [
      { icon: BookOpen, label: 'Documentation', description: 'Install, configure, connect webhooks', href: '/docs' },
      { icon: Sparkles, label: 'Changelog', description: 'Every release, tagged and dated', href: '/changelog' },
      { icon: LineChart, label: 'Blog', description: 'Ideas from the team', href: '/blog' },
      { icon: ShieldCheck, label: 'Security', description: 'How we protect your data', href: '/security' },
    ],
  },
];

const TOP_LINKS = [
  { label: 'Product', href: '/features', menu: PRODUCT_MENU },
  { label: 'Solutions', href: '/solutions', menu: SOLUTIONS_MENU },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/docs', menu: RESOURCES_MENU },
] as const;

// Primary mobile nav — kept lean. Secondary pages (Changelog, About,
// Security) are intentionally omitted here since they're all reachable from
// the footer; a 10-item drawer buried the primary journey.
const MOBILE_LINKS = [
  { label: 'Product', href: '/features' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
    <header
      className={cn(
        'sticky top-0 z-50 h-16 flex items-center backdrop-blur-md transition-[border-color,box-shadow,background] duration-200',
        scrolled
          ? 'bg-paper/85 border-b border-line shadow-[var(--e-1)]'
          : 'bg-paper/80 border-b border-transparent'
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="mx-auto w-full max-w-[1360px] px-6 md:px-12 flex items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {TOP_LINKS.map((l) => (
            <div
              key={l.href}
              onMouseEnter={() => 'menu' in l && setOpenMenu(l.label)}
              className="relative"
            >
              <Link
                href={l.href}
                className="text-[13px] font-medium text-ink-2 hover:text-ink no-underline px-3 py-2 rounded-[var(--r-2)] hover:bg-canvas transition-colors inline-flex items-center gap-1"
              >
                {l.label}
                {'menu' in l && <ChevronDown size={12} className="text-muted-2" />}
              </Link>

              {'menu' in l && openMenu === l.label && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  <MegaMenu columns={l.menu} onNavigate={() => setOpenMenu(null)} />
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button href={APP_LINKS.login} external variant="ghost" size="sm">
            Sign in
          </Button>
          <Button href={APP_LINKS.register} external variant="volt" size="sm">
            Start free
          </Button>
        </div>

        {/* Mobile / tablet: keep the primary CTA visible in the header,
            not just buried in the drawer. */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <Button href={APP_LINKS.register} external variant="volt" size="sm">
            Start free
          </Button>
          <button
            type="button"
            className="-mr-2 p-2 text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      </header>

      {/* Mobile drawer — rendered OUTSIDE <header> on purpose. The header has
          `backdrop-blur` (backdrop-filter), which establishes a containing block
          for `position: fixed` descendants; keeping the drawer inside would make
          `top-16 bottom-0` resolve against the 64px header and collapse it.
          As a header sibling it resolves against the viewport and fills the screen. */}
      <div
        className={cn(
          'lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-paper transition-opacity duration-200 overflow-y-auto',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex flex-col p-6 gap-1 min-h-full">
          {MOBILE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="type-heading-3 text-ink no-underline py-3 border-b border-line"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-auto flex flex-col gap-3 pt-6">
            <Button href={APP_LINKS.login} external variant="ghost">
              Sign in
            </Button>
            <Button href={APP_LINKS.register} external variant="volt">
              Start free
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function MegaMenu({
  columns,
  onNavigate,
}: {
  columns: MegaColumn[];
  onNavigate: () => void;
}) {
  return (
    <div className="bg-canvas rounded-[var(--r-4)] shadow-[var(--e-3)] border border-line p-5 grid gap-6 min-w-[520px]"
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
      {columns.map((col) => (
        <div key={col.title}>
          <div className="type-mono-sm text-muted mb-3">{col.title}</div>
          <ul className="space-y-1">
            {col.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className="flex items-start gap-3 p-2.5 rounded-[var(--r-2)] hover:bg-paper transition-colors no-underline group"
                >
                  <div className="w-8 h-8 rounded-[var(--r-2)] bg-volt-tint text-volt flex items-center justify-center shrink-0 group-hover:bg-volt group-hover:text-white transition-colors">
                    <item.icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="type-body-sm text-ink font-medium">{item.label}</div>
                    <div className="type-mono-sm text-muted mt-0.5">{item.description}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
