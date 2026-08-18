export type PersonId = 'gaurav' | 'steve';

export type Person = { name: string; image: string };

// Face photos live in public/. Cropped to the face in the UI via object-cover.
export const PEOPLE: Record<PersonId, Person> = {
  gaurav: { name: 'Gaurav', image: '/gaurav.jpeg' },
  steve: { name: 'Steve', image: '/steve.jpg' },
};

export type ChangelogEntry = {
  id: string;
  date: string;
  dateISO: string;
  title: string;
  description: string;
  tags: string[];
  // Who shipped the entry. One or two people; when two, listed in display order.
  updatedBy: PersonId[];
  accent: 'blue' | 'violet' | 'emerald' | 'amber' | 'rose';
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    id: 'retrieval-recall-fix',
    date: 'August 17, 2026',
    dateISO: '2026-08-17',
    title: 'Fixed: answers could come back empty on small knowledge bases',
    description:
      'A chatbot could reply that it did not know something while the answer sat in its knowledge base. The cause was our shared vector index: as the total number of customers grew, searches scoped to one workspace were drawn from a candidate set dominated by everyone else’s content and discarded, returning nothing — silently, with no error to alert us. Smaller knowledge bases were hit hardest, which is most of them. Retrieval now runs an exact, workspace-scoped search: every matching passage is found, every time, and it is faster at today’s sizes — a 5,000-chunk knowledge base searches in under 8ms. No action needed, and nothing was lost; the content was always there.',
    tags: ['Fixed', 'Answer quality'],
    updatedBy: ['gaurav'],
    accent: 'rose',
  },
  {
    id: 'chat-concurrency',
    date: 'August 17, 2026',
    dateISO: '2026-08-17',
    title: 'Chat stays responsive when a lot of visitors arrive at once',
    description:
      'Two changes to how a chat request uses the database. Billing and subscription checks no longer block while they run, and a database connection is now released for the whole time we are searching your knowledge base and generating a reply rather than being held end to end. Together they take the ceiling off how many conversations can be in flight at the same time, so a traffic spike on one site no longer slows replies for everyone. Nothing to configure.',
    tags: ['Improved', 'Performance'],
    updatedBy: ['gaurav'],
    accent: 'violet',
  },
  {
    id: 'company-intelligence',
    date: 'August 6, 2026',
    dateISO: '2026-08-06',
    title: 'OyeChats now knows the company behind every conversation',
    description: 'Visitor & Company Intelligence resolves the business behind a chat from the visitor’s own domain, resolving it once per session and caching it across the platform so repeat lookups are free. Company details appear right in the lead record, kept separate from network context we never mistake for the company itself. Turn it on per agent, and you’re only charged when we actually return a match.',
    tags: ['New feature', 'Leads'],
    updatedBy: ['steve', 'gaurav'],
    accent: 'amber',
  },
  {
    id: 'verified-email-capture',
    date: 'July 22, 2026',
    dateISO: '2026-07-22',
    title: 'Verified email capture keeps junk leads out of your CRM',
    description: 'Every email a visitor submits is now verified in real time before the lead is saved, so mistyped and disposable addresses never reach your pipeline. Deliverability checks run server-side at the moment of capture on Standard and Professional plans, keeping your lead list clean and your follow-ups landing.',
    tags: ['New feature', 'Lead capture'],
    updatedBy: ['gaurav'],
    accent: 'emerald',
  },
  {
    id: 'auto-recrawl',
    date: 'July 7, 2026',
    dateISO: '2026-07-07',
    title: 'Auto-recrawl keeps your knowledge base fresh, automatically',
    description: 'Standard-tier bots now refresh their knowledge base on a schedule. Point OyeChats at a URL once and we re-crawl it in the background whenever your docs, product pages, or pricing change. No more stale answers, no more manual re-uploads.',
    tags: ['New feature', 'Knowledge base'],
    updatedBy: ['steve'],
    accent: 'blue',
  },
  {
    id: 'crawler-youtube-docs',
    date: 'July 2, 2026',
    dateISO: '2026-07-02',
    title: 'The crawler now understands YouTube and linked downloadables',
    description: 'Point OyeChats at any page and it pulls in YouTube transcripts and linked PDFs, DOCX, and TXT files inline with the source. One URL, one crawl, richer context, more accurate answers.',
    tags: ['Improved', 'Crawler'],
    updatedBy: ['gaurav'],
    accent: 'violet',
  },
  {
    id: 'billing-tab',
    date: 'June 24, 2026',
    dateISO: '2026-06-24',
    title: 'Billing moves into its own tab, with the right currency from day one',
    description: 'Billing is now a dedicated tab, decoupled from account settings. We capture your billing country at signup and every price you see (seats, plans, top-ups, invoices) renders in your local currency from the very first load.',
    tags: ['New feature', 'Billing'],
    updatedBy: ['gaurav'],
    accent: 'emerald',
  },
  {
    id: 'currency-context',
    date: 'June 18, 2026',
    dateISO: '2026-06-18',
    title: 'A global currency context, everywhere at once',
    description: 'The seat modal, plan picker, top-up flow, and invoices all read from a single CurrencyContext now. Switch billing country and every price in the app updates instantly. No reloads, no mismatched totals at checkout.',
    tags: ['Improved', 'Billing'],
    updatedBy: ['steve'],
    accent: 'emerald',
  },
  {
    id: 'security-hardening',
    date: 'May 30, 2026',
    dateISO: '2026-05-30',
    title: 'A quiet security pass across the whole platform',
    description: 'Centralized SSRF guard on the crawler and demo preview. Non-root systemd services with unit-level sandboxing. CI actions pinned to commit SHAs. API docs gated in production, WebSocket file events rate-limited, and web push with a hard timeout. Nothing you have to configure. It just runs safer.',
    tags: ['Security', 'Improved'],
    updatedBy: ['gaurav'],
    accent: 'rose',
  },
  {
    id: 'auth-hardening',
    date: 'May 12, 2026',
    dateISO: '2026-05-12',
    title: 'Strict auth on every account-credential endpoint',
    description: 'The /settings, /upload-logo, and account-credential endpoints now require a valid X-API-Key. No more soft auth paths. Live-chat sessions restored from the database are correctly tenant-scoped on reconnect, and operator presence has a database fallback when Redis is down.',
    tags: ['Fixed', 'Security'],
    updatedBy: ['gaurav'],
    accent: 'rose',
  },
  {
    id: 'live-chat-ga',
    date: 'April 15, 2026',
    dateISO: '2026-04-15',
    title: 'Live chat handoff, now generally available',
    description: 'Visitors can hand off from the bot to a real human at any point, with department routing, canned responses, and a post-chat rating. Operator presence is Redis-backed with automatic database fallback, so nobody drops off the queue when infrastructure hiccups.',
    tags: ['New feature', 'Live chat'],
    updatedBy: ['steve'],
    accent: 'violet',
  },
  {
    id: 'auto-rollback',
    date: 'April 3, 2026',
    dateISO: '2026-04-03',
    title: 'Auto-rollback on failed post-deploy health checks',
    description: 'A bad release no longer needs a human in the loop. If a deploy fails its health check, the API rolls back to the previous known-good release automatically. Renewal cron and invoice-email workers isolate per-record failures so one bad account never stalls the batch.',
    tags: ['Improved', 'Infrastructure'],
    updatedBy: ['gaurav'],
    accent: 'blue',
  },
  {
    id: 'bant-scoring',
    date: 'March 30, 2026',
    dateISO: '2026-03-30',
    title: 'BANT scoring, built into every conversation',
    description: 'OyeChats now scores every conversation on Budget, Authority, Need, and Timeline, automatically. Combined with visitor context (pages viewed, return visits, UTM, device), sales sees a qualified lead the moment intent shows up, without asking a single form question.',
    tags: ['New feature', 'Analytics'],
    updatedBy: ['gaurav'],
    accent: 'amber',
  },
  {
    id: 'hybrid-search',
    date: 'March 28, 2026',
    dateISO: '2026-03-28',
    title: 'Hybrid retrieval, tighter answers',
    description: 'Reciprocal rank fusion now blends semantic similarity with keyword TSVECTOR search. Answers stay grounded in your docs even when the visitor uses acronyms, product codes, or phrasing your knowledge base never anticipated.',
    tags: ['Improved', 'RAG'],
    updatedBy: ['steve'],
    accent: 'violet',
  },
];
