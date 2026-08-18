'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Sparkles,
  BookOpen,
  ShieldCheck,
  LineChart,
  ChevronDown,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ds';
import { APP_LINKS } from '@/lib/site';
import { Logo } from './Logo';
import { cn } from '@/lib/cn';

type MegaColumn = {
  title: string;
  items: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; href: string }[];
};

const RESOURCES_MENU: MegaColumn[] = [
  {
    title: 'Resources',
    items: [
      { icon: BookOpen, label: 'Documentation', href: '/docs' },
      { icon: Rocket, label: 'Quickstart', href: '/docs/getting-started/quickstart' },
      { icon: Sparkles, label: 'Changelog', href: '/changelog' },
      { icon: LineChart, label: 'Blog', href: '/blog' },
      { icon: ShieldCheck, label: 'Security', href: '/security' },
    ],
  },
];

const TOP_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/docs', menu: RESOURCES_MENU },
  { label: 'Contact us', href: '/contact' },
] as const;

// Primary mobile nav — kept lean. Secondary pages (Changelog, About,
// Security) are intentionally omitted here since they're all reachable from
// the footer; a 10-item drawer buried the primary journey.
const MOBILE_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact us', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // rAF-coalesced, matching ReadingProgress. React bails out when the boolean
    // is unchanged, so this was never a re-render problem — but it did invoke a
    // callback on every scroll event on every page.
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Escape must dismiss both the mega menu and the drawer. Neither had any key
  // handling, so a keyboard user who opened one could not close it.
  useEffect(() => {
    if (!open && !openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenMenu(null);
      if (open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, openMenu]);

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
        <Logo priority size={40} imgClassName="h-8 w-auto md:h-10" />

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
          {TOP_LINKS.map((l) => (
            <div
              key={l.href}
              onMouseEnter={() => 'menu' in l && setOpenMenu(l.label)}
              onFocus={() => 'menu' in l && setOpenMenu(l.label)}
              className="relative"
            >
              <Link
                href={l.href}
                aria-expanded={'menu' in l ? openMenu === l.label : undefined}
                aria-controls={'menu' in l ? `megamenu-${l.label}` : undefined}
                className="text-[15px] font-medium text-ink-2 hover:text-ink no-underline px-3 py-2 rounded-[var(--r-2)] hover:bg-canvas transition-colors inline-flex items-center gap-1"
              >
                {l.label}
                {'menu' in l && <ChevronDown size={12} className="text-muted-2" aria-hidden="true" />}
              </Link>

              {/* Rendered unconditionally and hidden with CSS + `inert`, mirroring
                  the mobile drawer below. Conditional rendering kept Docs,
                  Changelog, Blog and Security out of the served HTML entirely -
                  the header contributed no link equity to them, and made them
                  unreachable by keyboard, since the panel only ever existed
                  while the mouse was over it. `onFocus` on the wrapper opens it
                  when the trigger is tabbed to. Visually identical: closed state
                  is opacity-0 + pointer-events-none, exactly as before. */}
              {'menu' in l && (
                <div
                  id={`megamenu-${l.label}`}
                  inert={openMenu !== l.label ? true : undefined}
                  className={cn(
                    'absolute left-0 top-full pt-2 z-50 transition-opacity duration-150',
                    openMenu === l.label ? 'opacity-100' : 'opacity-0 pointer-events-none',
                  )}
                >
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
          {/* Hidden while the drawer is open. The drawer footer already has
              its own Start free, so showing both would duplicate the CTA. */}
          {!open && (
            <Button href={APP_LINKS.register} external variant="volt" size="md">
              Start free
            </Button>
          )}
          <button
            ref={toggleRef}
            type="button"
            className="-mr-1 p-2.5 min-h-11 min-w-11 flex items-center justify-center text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      </header>

      {/* Mobile drawer. Rendered OUTSIDE <header> on purpose. The header has
          `backdrop-blur` (backdrop-filter), which establishes a containing block
          for `position: fixed` descendants; keeping the drawer inside would make
          `top-16 bottom-0` resolve against the 64px header and collapse it.
          As a header sibling it resolves against the viewport and fills the screen. */}
      <div
        id="mobile-menu"
        // `inert` when closed removes the off-screen drawer links from the tab
        // order and the accessibility tree (pointer-events alone leaves them
        // keyboard-focusable). Opacity transition is preserved.
        inert={!open ? true : undefined}
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
    // Width scales with the column count instead of a flat 520px floor: that
    // floor was set when the menu had one column and silently doubled the
    // panel the moment a second was added.
    <div className="bg-canvas rounded-[var(--r-4)] shadow-[var(--e-3)] border border-line p-4 grid gap-6"
      style={{
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        minWidth: `${columns.length * 220}px`,
      }}>
      {columns.map((col) => (
        <div key={col.title}>
          <div className="type-mono-sm text-muted mb-3">{col.title}</div>
          <ul className="space-y-1">
            {col.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className="flex items-center gap-3 p-2 rounded-[var(--r-2)] hover:bg-paper transition-colors no-underline group"
                >
                  <div className="w-8 h-8 rounded-[var(--r-2)] bg-volt-tint text-volt flex items-center justify-center shrink-0 group-hover:bg-volt group-hover:text-white transition-colors">
                    <item.icon size={16} />
                  </div>
                  <div className="type-body-sm text-ink font-medium min-w-0">{item.label}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
