import type { ComponentType } from 'react';
import { ShoppingBag, Diamond, Users } from 'lucide-react';

export type AudiencePersona = {
  audience: string;
  industry: string;
  logo: ComponentType<{ size?: number; className?: string }>;
  summary: string;
  tags: string[];
};

/**
 * The three audience personas OyeChats sells into.
 * Migrated verbatim from the previous site.
 */
export const AUDIENCE_PERSONAS: AudiencePersona[] = [
  {
    audience: 'E-commerce',
    industry: 'Online stores',
    logo: ShoppingBag,
    summary:
      'Answer product, shipping, and returns questions instantly from your own docs and site content. Capture leads from visitors who are about to leave, and hand the conversation to a human the moment a sale is on the line.',
    tags: ['RAG Q&A', 'Lead Capture', 'Live Handoff'],
  },
  {
    audience: 'B2B SaaS',
    industry: 'Software teams',
    logo: Diamond,
    summary:
      'Qualify every visitor with BANT scoring, push hot leads to your team in real time via webhooks, and let prospects book a demo through Calendly without ever leaving the chat.',
    tags: ['BANT Scoring', 'Webhooks', 'Calendly'],
  },
  {
    audience: 'Agencies',
    industry: 'Multi-client teams',
    logo: Users,
    summary:
      'Run a separate bot per client, each with its own knowledge base, billing, and analytics. Remove OyeChats branding on paid plans and connect each client\'s stack through webhooks and the REST API.',
    tags: ['Multi-Bot', 'Custom Branding', 'REST API'],
  },
];

export type Customer = {
  slug: string;
  company: string;
  industry: string;
  summary: string;
  quote: string;
  quoteBy: string;
  metrics: { label: string; value: string }[];
};

/**
 * Illustrative case studies used on the /customers/[slug] detail routes.
 */
export const CUSTOMERS: Customer[] = [
  {
    slug: 'acme',
    company: 'Acme',
    industry: 'B2B SaaS',
    summary: 'Acme replaced their intake form and cut unqualified sales meetings by 3x in the first quarter.',
    quote:
      'The team stopped chasing tire-kickers within a week. Reps went from 40 meetings to 12, and closed more.',
    quoteBy: 'Priya M · Head of Revenue',
    metrics: [
      { label: 'Reduction in unqualified meetings', value: '3x' },
      { label: 'Rep meetings held with qualified buyers', value: '87%' },
      { label: 'Time-to-qualified handoff', value: '<2 min' },
    ],
  },
  {
    slug: 'northwind',
    company: 'Northwind',
    industry: 'DTC E-commerce',
    summary: 'Northwind uses OyeChats as an in-chat shopping assistant with product recommendations and cart recovery.',
    quote: 'Chat replaced the FAQ page and half of email support in one release.',
    quoteBy: 'Marcus L · Head of CX',
    metrics: [
      { label: 'In-chat AOV lift', value: '+18%' },
      { label: 'Cart recovery lift', value: '2.1x' },
      { label: 'Ticket deflection', value: '54%' },
    ],
  },
  {
    slug: 'quill',
    company: 'Quill',
    industry: 'Developer tools',
    summary: 'Quill uses OyeChats as a docs assistant with hybrid RAG grounded in their API reference and blog.',
    quote: 'Our docs became the source of truth reps actually cite in every deal.',
    quoteBy: 'Ana G · Head of DevRel',
    metrics: [
      { label: 'Docs deflection', value: '61%' },
      { label: 'Time to first useful answer', value: '<1s' },
      { label: 'Citation rate', value: '100%' },
    ],
  },
];
