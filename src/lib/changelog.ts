export type ChangelogEntry = {
  id: string;
  version: string;
  date: string;
  dateISO: string;
  title: string;
  description: string;
  tags: string[];
  author: { name: string; initials: string };
  accent: 'blue' | 'violet' | 'emerald' | 'amber' | 'rose';
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    id: 'auto-recrawl',
    version: 'v3.2.0',
    date: 'July 7, 2026',
    dateISO: '2026-07-07',
    title: 'Auto-recrawl keeps your knowledge base fresh, automatically',
    description: 'Standard-tier bots now refresh their knowledge base on a schedule. Point OyeChats at a URL once and we re-crawl it in the background whenever your docs, product pages, or pricing change. No more stale answers, no more manual re-uploads.',
    tags: ['New feature', 'Knowledge base'],
    author: { name: 'OyeChats Team', initials: 'OC' },
    accent: 'blue',
  },
  {
    id: 'crawler-youtube-docs',
    version: 'v3.2.0',
    date: 'July 2, 2026',
    dateISO: '2026-07-02',
    title: 'The crawler now understands YouTube and linked downloadables',
    description: 'Point OyeChats at any page and it pulls in YouTube transcripts and linked PDFs, DOCX, and TXT files inline with the source. One URL, one crawl, richer context, more accurate answers.',
    tags: ['Improved', 'Crawler'],
    author: { name: 'Steve · Ingestion', initials: 'ST' },
    accent: 'violet',
  },
  {
    id: 'billing-tab',
    version: 'v3.1.0',
    date: 'June 24, 2026',
    dateISO: '2026-06-24',
    title: 'Billing moves into its own tab, with the right currency from day one',
    description: 'Billing is now a dedicated tab, decoupled from account settings. We capture your billing country at signup and every price you see (seats, plans, top-ups, invoices) renders in your local currency from the very first load.',
    tags: ['New feature', 'Billing'],
    author: { name: 'OyeChats Team', initials: 'OC' },
    accent: 'emerald',
  },
  {
    id: 'currency-context',
    version: 'v3.1.0',
    date: 'June 18, 2026',
    dateISO: '2026-06-18',
    title: 'A global currency context, everywhere at once',
    description: 'The seat modal, plan picker, top-up flow, and invoices all read from a single CurrencyContext now. Switch billing country and every price in the app updates instantly. No reloads, no mismatched totals at checkout.',
    tags: ['Improved', 'Billing'],
    author: { name: 'Billing Squad', initials: 'BS' },
    accent: 'emerald',
  },
  {
    id: 'security-hardening',
    version: 'v3.0.1',
    date: 'May 30, 2026',
    dateISO: '2026-05-30',
    title: 'A quiet security pass across the whole platform',
    description: 'Centralized SSRF guard on the crawler and demo preview. Non-root systemd services with unit-level sandboxing. CI actions pinned to commit SHAs. API docs gated in production, WebSocket file events rate-limited, and web push with a hard timeout. Nothing you have to configure. It just runs safer.',
    tags: ['Security', 'Improved'],
    author: { name: 'Security Team', initials: 'SC' },
    accent: 'rose',
  },
  {
    id: 'auth-hardening',
    version: 'v3.0.1',
    date: 'May 12, 2026',
    dateISO: '2026-05-12',
    title: 'Strict auth on every account-credential endpoint',
    description: 'The /settings, /upload-logo, and account-credential endpoints now require a valid X-API-Key. No more soft auth paths. Live-chat sessions restored from the database are correctly tenant-scoped on reconnect, and operator presence has a database fallback when Redis is down.',
    tags: ['Fixed', 'Security'],
    author: { name: 'Security Team', initials: 'SC' },
    accent: 'rose',
  },
  {
    id: 'live-chat-ga',
    version: 'v3.0.0',
    date: 'April 15, 2026',
    dateISO: '2026-04-15',
    title: 'Live chat handoff, now generally available',
    description: 'Visitors can hand off from the bot to a real human at any point, with department routing, canned responses, and a post-chat rating. Operator presence is Redis-backed with automatic database fallback, so nobody drops off the queue when infrastructure hiccups.',
    tags: ['New feature', 'Live chat'],
    author: { name: 'OyeChats Team', initials: 'OC' },
    accent: 'violet',
  },
  {
    id: 'auto-rollback',
    version: 'v3.0.0',
    date: 'April 3, 2026',
    dateISO: '2026-04-03',
    title: 'Auto-rollback on failed post-deploy health checks',
    description: 'A bad release no longer needs a human in the loop. If a deploy fails its health check, the API rolls back to the previous known-good release automatically. Renewal cron and invoice-email workers isolate per-record failures so one bad account never stalls the batch.',
    tags: ['Improved', 'Infrastructure'],
    author: { name: 'Platform Team', initials: 'PL' },
    accent: 'blue',
  },
  {
    id: 'bant-scoring',
    version: 'v2.4.0',
    date: 'March 20, 2026',
    dateISO: '2026-03-20',
    title: 'BANT scoring, built into every conversation',
    description: 'OyeChats now scores every conversation on Budget, Authority, Need, and Timing, automatically. Combined with visitor context (pages viewed, return visits, UTM, device), sales sees a qualified lead the moment intent shows up, without asking a single form question.',
    tags: ['New feature', 'Analytics'],
    author: { name: 'OyeChats Team', initials: 'OC' },
    accent: 'amber',
  },
  {
    id: 'hybrid-search',
    version: 'v2.4.0',
    date: 'March 5, 2026',
    dateISO: '2026-03-05',
    title: 'Hybrid retrieval, tighter answers',
    description: 'Reciprocal rank fusion now blends semantic similarity with keyword TSVECTOR search. Answers stay grounded in your docs even when the visitor uses acronyms, product codes, or phrasing your knowledge base never anticipated.',
    tags: ['Improved', 'RAG'],
    author: { name: 'AI Team', initials: 'AI' },
    accent: 'violet',
  },
];
