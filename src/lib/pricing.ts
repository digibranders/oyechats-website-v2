import { APP_LINKS } from './site';

/**
 * Pricing is geo-gated: visitors in India (country code `IN`) are shown INR
 * only; everyone else is shown USD only. The currency is resolved server-side
 * from the request's IP country (see `app/pricing/page.tsx`) and passed down —
 * a visitor never sees both currencies. USD is a deliberate international
 * geo-price, not an FX conversion of the INR price.
 */
export type Currency = 'INR' | 'USD';

export const CURRENCY_SYMBOL: Record<Currency, string> = { INR: '₹', USD: '$' };
export const CURRENCY_LOCALE: Record<Currency, string> = { INR: 'en-IN', USD: 'en-US' };

/** India → INR, everyone else (including unknown) → USD. */
export function currencyForCountry(country: string | null | undefined): Currency {
  return country === 'IN' ? 'INR' : 'USD';
}

export function formatPrice(amount: number, currency: Currency): string {
  return `${CURRENCY_SYMBOL[currency]}${amount.toLocaleString(CURRENCY_LOCALE[currency])}`;
}

/** A value expressed in both billing currencies. */
export type Money = Record<Currency, number>;

export type TierId = 'free' | 'starter' | 'standard' | 'professional' | 'enterprise';

export type PricingTier = {
  id: TierId;
  name: string;
  tagline: string;
  /** Per-month, billed monthly. `null` = custom (Enterprise). */
  monthly: Money | null;
  /** Effective per-month when billed annually (~20% off). */
  annualMonthly: Money | null;
  /** Total charged per year on annual billing. */
  annualTotal: Money | null;
  credits: number | null;
  includedSeats: number | null;
  features: string[];
  cta: string;
  ctaHref: string;
  featured?: boolean;
  badge?: string;
};

export const EXTRA_SEAT_PRICE: Money = { INR: 499, USD: 5 };

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'A grounded AI bot, free forever.',
    monthly: { INR: 0, USD: 0 },
    annualMonthly: { INR: 0, USD: 0 },
    annualTotal: { INR: 0, USD: 0 },
    credits: 200,
    includedSeats: 1,
    features: [
      '1 chatbot',
      '200 credits / month',
      'Grounded AI answers, cited & streamed',
      'Website widget + customization',
      '7-day chat history',
      'Community & docs support',
    ],
    cta: 'Get started',
    ctaHref: APP_LINKS.register,
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For a solo site that wants live chat + a real AI agent.',
    monthly: { INR: 449, USD: 9 },
    annualMonthly: { INR: 359, USD: 7 },
    annualTotal: { INR: 4308, USD: 84 },
    credits: 2000,
    includedSeats: 1,
    features: [
      'Everything in Free, plus',
      '2,000 credits / month',
      '1 operator seat',
      'Live chat + human handoff',
      'Proactive triggers & meeting booking',
      'Canned replies & file sharing',
      '30-day chat history',
      'Email support',
    ],
    cta: 'Get started',
    ctaHref: APP_LINKS.registerStarter,
  },
  {
    id: 'standard',
    name: 'Standard',
    tagline: 'The lead-machine — grounded AI plus BANT qualification.',
    monthly: { INR: 949, USD: 19 },
    annualMonthly: { INR: 759, USD: 15 },
    annualTotal: { INR: 9108, USD: 180 },
    credits: 6000,
    includedSeats: 2,
    featured: true,
    badge: 'Most Popular',
    features: [
      'Everything in Starter, plus',
      '6,000 credits / month',
      '2 operator seats',
      'BANT lead qualification & scoring',
      'Auto-recrawl + visitor & UTM tracking',
      'Remove OyeChats branding · routing',
      'Webhooks + REST API + CLI',
      '90-day history · priority support',
    ],
    cta: 'Start 7-day trial',
    ctaHref: APP_LINKS.registerStandard,
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'For teams scaling qualified pipeline with deeper frameworks.',
    monthly: { INR: 1399, USD: 39 },
    annualMonthly: { INR: 1119, USD: 31 },
    annualTotal: { INR: 13428, USD: 372 },
    credits: 10000,
    includedSeats: 3,
    features: [
      'Everything in Standard, plus',
      '10,000 credits / month',
      '3 operator seats',
      'MEDDIC / CHAMP / custom frameworks',
      'White-label custom domain',
      'Audit logs & advanced controls',
      '1-year history · priority chat support',
    ],
    cta: 'Get started',
    ctaHref: APP_LINKS.registerProfessional,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Custom volume, SSO, and a dedicated account manager.',
    monthly: null,
    annualMonthly: null,
    annualTotal: null,
    credits: null,
    includedSeats: null,
    features: [
      'Custom credit allocation',
      'Unlimited chatbots & operator seats',
      'All qualification frameworks',
      'SSO · custom SLA · dedicated CSM',
      'Region / on-prem deployment',
    ],
    cta: 'Contact sales',
    ctaHref: '/contact?intent=enterprise',
  },
];

export type CreditCost = { action: string; credits: number };

export const CREDIT_COSTS: CreditCost[] = [
  { action: '1 AI chat reply', credits: 1 },
  { action: '1 document uploaded to your knowledge base', credits: 3 },
  { action: '1 web page crawled and added to your knowledge base', credits: 5 },
];

export type TopupPack = {
  price: Money;
  credits: number;
  bonusPct: number;
  badge?: string;
};

export const TOPUP_PACKS: TopupPack[] = [
  { price: { INR: 1599, USD: 19 }, credits: 2_000, bonusPct: 0 },
  { price: { INR: 3999, USD: 49 }, credits: 5_500, bonusPct: 10 },
  { price: { INR: 7999, USD: 99 }, credits: 12_000, bonusPct: 20, badge: 'Best value' },
  { price: { INR: 19999, USD: 249 }, credits: 32_500, bonusPct: 30 },
];

export type PricingFeatureCategory = 'usage' | 'features' | 'security';
/** A cell value: plain text, a check/cross, or per-currency text. */
export type CurrencyText = Record<Currency, string>;
export type PricingFeatureValue = string | boolean | CurrencyText;
export type PricingFeature = {
  label: string;
  free: PricingFeatureValue;
  starter: PricingFeatureValue;
  standard: PricingFeatureValue;
  professional: PricingFeatureValue;
  enterprise: PricingFeatureValue;
  category: PricingFeatureCategory;
};

export function isCurrencyText(v: PricingFeatureValue): v is CurrencyText {
  return typeof v === 'object' && v !== null && 'INR' in v && 'USD' in v;
}

export const FEATURE_ROWS: PricingFeature[] = [
  {
    label: 'Monthly price',
    free: 'Free',
    starter: { INR: '₹449 / mo', USD: '$9 / mo' },
    standard: { INR: '₹949 / mo', USD: '$19 / mo' },
    professional: { INR: '₹1,399 / mo', USD: '$39 / mo' },
    enterprise: 'Custom',
    category: 'usage',
  },
  {
    label: 'Annual price (save ~20%)',
    free: '-',
    starter: { INR: '₹359/mo (₹4,308/yr)', USD: '$7/mo ($84/yr)' },
    standard: { INR: '₹759/mo (₹9,108/yr)', USD: '$15/mo ($180/yr)' },
    professional: { INR: '₹1,119/mo (₹13,428/yr)', USD: '$31/mo ($372/yr)' },
    enterprise: 'Contact us',
    category: 'usage',
  },
  { label: 'Monthly credits', free: '200', starter: '2,000', standard: '6,000', professional: '10,000', enterprise: 'Custom', category: 'usage' },
  { label: 'Chatbots', free: '1', starter: '1', standard: '1', professional: '1', enterprise: 'Unlimited', category: 'usage' },
  { label: 'Operator seats included', free: '1', starter: '1', standard: '2', professional: '3', enterprise: 'Unlimited', category: 'usage' },
  {
    label: 'Extra operator seats',
    free: '-',
    starter: { INR: '₹499/mo each', USD: '$5/mo each' },
    standard: { INR: '₹499/mo each', USD: '$5/mo each' },
    professional: { INR: '₹499/mo each', USD: '$5/mo each' },
    enterprise: 'Custom',
    category: 'usage',
  },
  { label: 'Crawl pages / doc uploads per month', free: '20 / 3', starter: '500 / 20', standard: '2,000 / 50', professional: '5,000 / 150', enterprise: 'Unlimited', category: 'usage' },
  { label: 'Chat history retention', free: '7 days', starter: '30 days', standard: '90 days', professional: '1 year', enterprise: 'Unlimited', category: 'usage' },
  { label: 'Credit top-ups / overage', free: false, starter: true, standard: true, professional: true, enterprise: true, category: 'usage' },

  { label: 'Grounded AI answers (cited, streamed)', free: true, starter: true, standard: true, professional: true, enterprise: true, category: 'features' },
  { label: 'Hallucination guardrails', free: 'Sampled', starter: true, standard: 'Full', professional: 'Full', enterprise: 'Full', category: 'features' },
  { label: 'Website crawl + file upload', free: true, starter: true, standard: true, professional: true, enterprise: true, category: 'features' },
  { label: 'Auto-recrawl (weekly refresh)', free: false, starter: false, standard: true, professional: true, enterprise: true, category: 'features' },
  { label: 'Proactive triggers + meeting booking', free: false, starter: true, standard: true, professional: true, enterprise: true, category: 'features' },
  { label: 'Live chat / human handoff', free: false, starter: true, standard: true, professional: true, enterprise: true, category: 'features' },
  { label: 'Routing + departments', free: false, starter: false, standard: true, professional: true, enterprise: true, category: 'features' },
  { label: 'BANT lead qualification', free: false, starter: false, standard: true, professional: true, enterprise: true, category: 'features' },
  { label: 'MEDDIC / CHAMP / custom frameworks', free: false, starter: false, standard: false, professional: true, enterprise: true, category: 'features' },
  { label: 'Qualification funnel analytics', free: false, starter: false, standard: true, professional: true, enterprise: true, category: 'features' },
  { label: 'Visitor + behavioral tracking, UTM', free: 'Basic', starter: 'Basic', standard: true, professional: true, enterprise: true, category: 'features' },
  { label: 'Webhooks (5 events) + REST API + CLI', free: false, starter: false, standard: true, professional: true, enterprise: true, category: 'features' },
  { label: 'Remove OyeChats branding', free: false, starter: false, standard: true, professional: true, enterprise: true, category: 'features' },
  { label: 'White-label custom domain', free: false, starter: false, standard: false, professional: true, enterprise: true, category: 'features' },

  { label: 'Roles & permissions (RBAC)', free: 'Owner', starter: true, standard: true, professional: true, enterprise: true, category: 'security' },
  { label: 'Domain allowlist security', free: true, starter: true, standard: true, professional: true, enterprise: true, category: 'security' },
  { label: 'Audit logs', free: false, starter: false, standard: false, professional: true, enterprise: true, category: 'security' },
  { label: 'SSO · dedicated CSM · custom SLA', free: false, starter: false, standard: false, professional: false, enterprise: true, category: 'security' },
  { label: 'Support', free: 'Community', starter: 'Email', standard: 'Priority', professional: 'Priority chat', enterprise: 'CSM + SLA', category: 'security' },
];

export const CATEGORY_LABELS: Record<PricingFeatureCategory, string> = {
  usage: 'Usage and seats',
  features: 'Features',
  security: 'Security and support',
};

export const PRICING_FAQ = [
  { q: "What's a credit?", a: 'Credits are how OyeChats measures usage. Each AI chat reply uses 1 credit, each web page we crawl and add to your knowledge base uses 5 credits, and each document upload uses 3 credits. System emails and live-chat operator messages are always free.' },
  { q: 'Which currency will I be billed in?', a: 'Pricing is shown in your local currency. Customers in India are billed in INR (₹); international customers are billed in USD ($). You always see a single currency based on your location.' },
  { q: 'How do I pay?', a: 'Indian customers pay via Razorpay — UPI, cards, NetBanking, and wallets are all supported. International customers pay by card in USD. You can switch payment methods any time from the Billing page.' },
  { q: 'Is there a free trial?', a: 'Yes. New accounts can start a 7-day free trial of the Standard plan — the full Standard feature set, no credit card required. And the Free plan runs a working grounded bot at no cost, forever.' },
  { q: 'What happens when I run out of credits?', a: 'Your bot pauses new conversations until your monthly credits reset, or you can buy a top-up pack any time from the Billing page. We hard-cap at zero — costs never run away — with a friendly message to visitors.' },
  { q: 'Do unused credits roll over?', a: 'Plan credits reset at the start of each billing cycle (use-it-or-lose-it). Top-up credits roll over for 12 months from purchase, oldest first.' },
  { q: 'Can I add more operator seats?', a: 'Yes. Extra seats are ₹499 (or $5 for international customers) per month each, added or removed with one click from the Billing page.' },
  { q: 'Can I change plans at any time?', a: 'Absolutely. Upgrade, downgrade, or cancel any time from your dashboard. Downgrades take effect at the end of the billing cycle.' },
  { q: 'How does BANT scoring work?', a: 'OyeChats analyzes every conversation across Budget, Authority, Need, and Timeline, scoring each dimension and combining them into a composite 0 to 100 lead score. That score drives webhook notifications and lead-tier assignments. Professional adds MEDDIC, CHAMP, and custom frameworks.' },
  { q: 'Is annual billing charged upfront?', a: 'Yes. Annual billing is charged as a single payment at the start of the year, giving you approximately 20% savings versus monthly.' },
  { q: 'Do you offer discounts for startups or non-profits?', a: 'Yes. Contact us at support@oyechats.com and we will work out the right pricing.' },
];
