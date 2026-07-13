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
  /** Section id on /features to deep-link to (keeps homepage "See how it works" links working). */
  anchor?: string;
};

export const FEATURES: Feature[] = [
  {
    slug: 'streaming-answers',
    icon: Zap,
    title: 'Streaming answers',
    tagline: 'Replies stream in real time.',
    description:
      'Answers appear word by word as they are written, no spinners, no blank waiting screen. The conversation feels instant.',
    anchor: 'feature-rag',
  },
  {
    slug: 'grounded-rag',
    icon: Search,
    title: 'Grounded answers',
    tagline: 'Answers from your content, with sources.',
    description:
      'Every answer is grounded in your own docs, retrieved via hybrid semantic and keyword search. It refreshes on its own as your content changes.',
    anchor: 'feature-rag',
  },
  {
    slug: 'bant-scoring',
    icon: BrainCircuit,
    title: 'BANT lead scoring',
    tagline: 'Every conversation, qualified.',
    description:
      'OyeChats scores each conversation on Budget, Authority, Need, and Timeline, read from the chat itself, so visitors never fill out a form.',
    anchor: 'feature-bant',
  },
  {
    slug: 'live-handoff',
    icon: MessageSquare,
    title: 'Live human handoff',
    tagline: 'A person steps in at the right moment.',
    description:
      'When a lead heats up, OyeChats hands the chat to a live teammate in the same thread, with the full transcript and score already in hand.',
    anchor: 'feature-live-chat',
  },
  {
    slug: 'easy-integration',
    icon: Code,
    title: 'Easy setup',
    tagline: 'One script tag. Any website.',
    description:
      'Add one line of code and OyeChats goes live, on WordPress, Shopify, Webflow, Next.js, React, Vue, or plain HTML.',
    anchor: 'feature-integrations',
  },
  {
    slug: 'custom-personality',
    icon: Sparkles,
    title: 'Your brand voice',
    tagline: 'Every reply sounds like you.',
    description:
      'Set the tone, share your FAQs and product docs, and OyeChats answers in your brand voice, not a generic robot.',
    anchor: 'feature-rag',
  },
  {
    slug: 'security',
    icon: ShieldCheck,
    title: 'Built-in security',
    tagline: 'Encrypted in transit and at rest.',
    description:
      'Encryption in transit and at rest, signed webhooks, prompt-injection guards, and role-based access, built in, not bolted on.',
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
    tagline: 'Send events to your tools.',
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
      'The vast majority of inbound tickets are questions your team has already answered somewhere. OyeChats reads your entire knowledge base, retrieves the right snippet in real time, and responds in your brand voice grounded in that content.',
      'When the question needs a human, the bot hands off with the full transcript, the pages the visitor was looking at, and a suggested department. Nobody starts from scratch.',
    ],
    bullets: [
      'Answer FAQs 24/7 from your docs, no scripts to maintain',
      'Automatic ticket deflection with a live human fallback',
      'Post-chat survey with a 1 to 5 rating stored per session',
    ],
    outcome: { metric: '24/7', label: 'first-line answers from your own docs, no scripts to maintain' },
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
    outcome: { metric: '0', label: 'form fields, every lead is BANT-scored from the chat itself' },
    icon: Target,
    accent: 'amber',
  },
  {
    slug: 'docs-assistant',
    category: 'Docs Assistant',
    title: 'Turn every doc into a conversation',
    intro:
      'Point OyeChats at a docs site, a Notion workspace, or a folder of PDFs. Add an in-product assistant grounded in your content.',
    body: [
      'Developers and end users rarely read docs top to bottom. They arrive with a question and want an answer with a link they can trust. OyeChats does exactly that. Hybrid retrieval blends vector similarity with keyword search so acronyms, error codes, and product names always land on the right page.',
      'When your docs change, the recrawl runs on a schedule. The bot stays fresh without a rebuild.',
    ],
    bullets: [
      'Ingests PDF, DOCX, TXT, and any crawlable URL',
      'Hybrid search over vector plus TSVECTOR keyword index',
      'Grounded in your docs, not the model\'s training data',
      'Scheduled auto-recrawl keeps the knowledge base current',
    ],
    outcome: { metric: 'Every answer', label: 'grounded in your docs via hybrid RAG' },
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
    outcome: { metric: '1 click', label: 'from bot to a human, with the full transcript attached' },
    icon: MessageCircle,
    accent: 'rose',
  },
];
