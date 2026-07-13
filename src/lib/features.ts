import type { ComponentType } from 'react';
import {
  Zap,
  Search,
  Code,
  Sparkles,
  ShieldCheck,
  LineChart,
  MessageSquare,
  Webhook,
  Users,
  BrainCircuit,
  Headphones,
  Target,
  BookOpen,
  MessageCircle,
} from 'lucide-react';

export type Feature = {
  slug: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  tagline: string;
  description: string;
};

export const FEATURES: Feature[] = [
  {
    slug: 'streaming-answers',
    icon: Zap,
    title: 'Streaming answers',
    tagline: 'Replies stream in real time.',
    description:
      'Words appear as they are generated, token by token. No spinners, no blank waiting screen, so the conversation feels immediate.',
  },
  {
    slug: 'grounded-rag',
    icon: Search,
    title: 'Grounded answers',
    tagline: 'Hybrid semantic + keyword RAG.',
    description:
      'Answers pull from your docs with inline citations, grounded in your content rather than the model\'s guesses. Refreshes automatically as content updates.',
  },
  {
    slug: 'bant-scoring',
    icon: BrainCircuit,
    title: 'BANT lead scoring',
    tagline: 'Every conversation, qualified.',
    description:
      'Budget, Authority, Need, Timeline scored automatically from natural conversation, no form questions.',
  },
  {
    slug: 'live-handoff',
    icon: MessageSquare,
    title: 'Live human handoff',
    tagline: 'Handoff at the moment of intent.',
    description:
      'Escalate to a human operator when the BANT score crosses your threshold. Full context handed over instantly.',
  },
  {
    slug: 'easy-integration',
    icon: Code,
    title: 'Easy integration',
    tagline: 'One script tag. Every stack.',
    description:
      'WordPress, Shopify, Webflow, Next.js, React, Vue, plain HTML, drop OyeChats in with one line.',
  },
  {
    slug: 'custom-personality',
    icon: Sparkles,
    title: 'Custom personality',
    tagline: 'On-brand every response.',
    description:
      'Train OyeChats on your brand voice, FAQs, and product docs. Every response reflects your positioning.',
  },
  {
    slug: 'security',
    icon: ShieldCheck,
    title: 'Built-in security',
    tagline: 'Encrypted end to end.',
    description:
      'TLS in transit, HMAC-signed webhooks, prompt-injection guards, role-based access control.',
  },
  {
    slug: 'analytics',
    icon: LineChart,
    title: 'Deep analytics',
    tagline: 'See what actually converts.',
    description:
      'Live dashboards, lead qualification funnels, top-question reports, post-chat CSAT ratings.',
  },
  {
    slug: 'webhooks',
    icon: Webhook,
    title: 'Webhooks & REST API',
    tagline: 'Ship to your stack.',
    description:
      'Five HMAC-signed event types wired to Zapier, Make, or your own endpoint. REST API for full control.',
  },
  {
    slug: 'multi-bot',
    icon: Users,
    title: 'Multi-bot ready',
    tagline: 'One dashboard, many surfaces.',
    description:
      'Run separate bots per product, region, or persona. Shared analytics; isolated billing per bot.',
  },
];

export type Solution = {
  slug: string;
  category: string;
  title: string;
  intro: string;
  body: string[];
  bullets: string[];
  outcome: { metric: string; label: string };
  icon: ComponentType<{ size?: number; className?: string }>;
  accent: 'blue' | 'violet' | 'emerald' | 'amber' | 'rose';
};

export const SOLUTIONS: Solution[] = [
  {
    slug: 'customer-support',
    category: 'Customer Support',
    title: 'Cut ticket volume without cutting quality',
    intro:
      'Turn your help center, product docs, and past tickets into a bot that answers on the first message, day or night.',
    body: [
      'The vast majority of inbound tickets are questions your team has already answered somewhere. OyeChats reads your entire knowledge base, retrieves the right snippet in real time, and responds in your brand voice with a citation the visitor can trust.',
      'When the question needs a human, the bot hands off with the full transcript, the pages the visitor was looking at, and a suggested department. Nobody starts from scratch.',
    ],
    bullets: [
      'Answer FAQs 24/7 from your docs, no scripts to maintain',
      'Automatic ticket deflection with a live human fallback',
      'Post-chat survey with a 1 to 5 rating stored per session',
    ],
    outcome: { metric: 'Up to 60%', label: 'of routine tickets deflected' },
    icon: Headphones,
    accent: 'blue',
  },
  {
    slug: 'sales-lead-gen',
    category: 'Sales and Lead Gen',
    title: 'Qualify every visitor, without a single form question',
    intro:
      'OyeChats scores each conversation on Budget, Authority, Need, and Timing, so your sales team only talks to leads worth talking to.',
    body: [
      'Instead of hiding behind a contact form, meet the visitor in a chat that already sounds like a discovery call. The bot listens for BANT signals inside the natural conversation and grades the lead in the background.',
      'A hot lead is routed to a live rep the moment intent shows up. A warm lead lands in a nurture sequence with a follow up email and a calendar link. A cold visitor keeps chatting, and every message adds to the profile.',
    ],
    bullets: [
      'Automatic BANT scoring across every session',
      'Instant handoff to a live operator when a lead scores hot',
      'Lead capture with name, email, phone, and company fields',
      'Calendly and CRM webhooks for zero-touch follow up',
    ],
    outcome: { metric: 'Up to 3.4x', label: 'more qualified leads per visitor' },
    icon: Target,
    accent: 'amber',
  },
  {
    slug: 'docs-assistant',
    category: 'Docs Assistant',
    title: 'Turn every doc into a chat interface',
    intro:
      'Point OyeChats at a docs site, a Notion workspace, or a folder of PDFs. Ship an in-product assistant that always cites its source.',
    body: [
      'Developers and end users rarely read docs top to bottom. They arrive with a question and want an answer with a link they can trust. OyeChats does exactly that. Hybrid retrieval blends vector similarity with keyword search so acronyms, error codes, and product names always land on the right page.',
      'When your docs change, the recrawl runs on a schedule. The bot stays fresh without a rebuild.',
    ],
    bullets: [
      'Ingests PDF, DOCX, TXT, and any crawlable URL',
      'Hybrid search over vector plus TSVECTOR keyword index',
      'Every answer links back to the source doc',
      'Scheduled auto-recrawl keeps the knowledge base current',
    ],
    outcome: { metric: 'Typically <5s', label: 'to a cited answer' },
    icon: BookOpen,
    accent: 'violet',
  },
  {
    slug: 'live-chat-handoff',
    category: 'Live Chat Handoff',
    title: 'A real human, exactly when it matters',
    intro:
      'Bot first, human second. When a visitor wants to talk to someone, OyeChats routes them to the right department in seconds.',
    body: [
      'Not every visitor should end at the bot. High intent buyers, angry customers, and edge case questions belong with a person. OyeChats knows when to escalate, and hands off with the full transcript, the visitor profile, and the recommended department.',
      'Operators work from a full inbox with canned responses, transfers, and a rating survey at the end of every chat.',
    ],
    bullets: [
      'One-click bot to human handoff, with transcript context',
      'Department routing and load balancing across operators',
      'Canned responses with keyboard shortcuts like /hello',
      'Post-chat rating from 1 to 5 stars, stored per session',
    ],
    outcome: { metric: 'Typically <25s', label: 'to reach a human' },
    icon: MessageCircle,
    accent: 'rose',
  },
];
