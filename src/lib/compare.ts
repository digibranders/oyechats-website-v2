/**
 * Comparison ("OyeChats vs …") content. One `Competitor` object per rival powers
 * both the /compare hub and each /compare/[slug] spoke, adding a competitor is a
 * single entry here plus one line in sitemap.ts.
 *
 * Content rules, because these pages name and rank real products:
 *  - Comparisons are framed around stable, defensible facts (a product's category,
 *    its pricing *model*, its well-known strengths), never invented numbers.
 *  - Every rival gets an honest "when to choose them" section. Fair comparison is
 *    both better SEO (Google's helpful-content system) and legally safer than a
 *    one-sided feature grid.
 *  - `edge` on each feature row is judged from OyeChats' point of view but marks
 *    `them` and `tie` honestly where the rival genuinely leads or matches.
 */

/** Who wins a given feature row, judged from OyeChats' perspective. */
export type Edge = 'oye' | 'them' | 'tie';

/** A row of the comparison matrix. `oye` is constant across all competitors. */
export type FeatureAxis = {
  key: string;
  label: string;
  /** What OyeChats does on this axis. Same string on every comparison page. */
  oye: string;
};

export type CompetitorFeature = {
  /** What the competitor does on this axis. */
  text: string;
  edge: Edge;
};

export type Faq = { q: string; a: string };

export type Competitor = {
  /** Full route slug, e.g. `oyechats-vs-chatbase`. */
  slug: string;
  /** Rival product name as written in prose and headings. */
  name: string;
  /** Product category, used in chips and schema. */
  category: string;
  /** Letter monogram used in place of a (trademarked) brand logo. */
  monogram: string;
  /** One-line description of what the rival is. */
  tagline: string;
  /** The search intent this page targets, shown as an eyebrow line. */
  intent: string;
  /** Two-to-three sentence honest positioning summary. */
  summary: string;
  /** What the rival is genuinely good at. */
  theirStrengths: string[];
  /** Where OyeChats has the advantage for our target buyer. */
  oyeEdge: string[];
  /** The honest "pick them instead" case. */
  whenToChooseThem: string;
  /** Pricing *model* (stable), not live numbers. */
  pricingModel: string;
  /** Per-axis competitor values, keyed by `FeatureAxis.key`. */
  features: Record<string, CompetitorFeature>;
  faqs: Faq[];
  metaTitle: string;
  metaDescription: string;
};

/**
 * The comparison axes, in table order. `oye` describes OyeChats once; every
 * competitor supplies its own value per `key` in `features`.
 */
export const FEATURE_AXES: FeatureAxis[] = [
  {
    key: 'rag',
    label: 'Grounded answers from your own content',
    oye: 'Hybrid semantic + keyword RAG grounded in your own content and site crawl',
  },
  {
    key: 'bant',
    label: 'Built-in BANT lead scoring',
    oye: 'Every visitor scored on Budget, Authority, Need & Timeline before handoff',
  },
  {
    key: 'handoff',
    label: 'Live human handoff',
    oye: 'Bot-to-agent handoff with the full transcript and BANT score attached',
  },
  {
    key: 'analytics',
    label: 'Conversation & lead analytics',
    oye: 'Intent, drop-off and qualification analytics out of the box',
  },
  {
    key: 'integrations',
    label: 'Webhooks & integrations',
    oye: 'HMAC-signed outbound webhooks on every event, CRM-agnostic by design',
  },
  {
    key: 'setup',
    label: 'Time to go live',
    oye: 'Under 5 minutes: add your content, paste one script tag',
  },
  {
    key: 'pricing',
    label: 'Pricing model',
    oye: 'Flat monthly tiers, no per-seat tax, no per-resolution surprises',
  },
  {
    key: 'bestFor',
    label: 'Best fit',
    oye: 'SMBs and sales teams that want qualification + support in one bot',
  },
];

/** Constant OyeChats positioning line reused across the hub and spokes. */
export const OYE_POSITION =
  'OyeChats is an AI chatbot that answers with RAG grounded in your own content and qualifies every visitor with BANT scoring before a rep ever sees them, with live handoff, analytics and webhooks built in.';

export const COMPETITORS: Competitor[] = [
  {
    slug: 'oyechats-vs-chatbase',
    name: 'Chatbase',
    category: 'AI chatbot builder',
    monogram: 'C',
    tagline: 'The popular "train a GPT on your data" chatbot builder.',
    intent: 'Chatbase alternative',
    summary:
      'Chatbase made it easy to spin up an AI chatbot trained on your website and docs, and it is a strong pick for pure self-serve Q&A. OyeChats starts from the same RAG foundation but adds what turns a conversation into pipeline: BANT lead scoring, live agent handoff and sales analytics.',
    theirStrengths: [
      'Dead-simple to create an AI bot on your site content',
      'Well-known brand in the AI-chatbot category',
      'Good fit for FAQ deflection and self-serve support',
    ],
    oyeEdge: [
      'Chatbase answers questions; OyeChats also qualifies the buyer with BANT scoring',
      'Built-in live handoff passes hot leads to a human with the full transcript',
      'Qualification and drop-off analytics, not just chat logs',
    ],
    whenToChooseThem:
      'Choose Chatbase if all you need is a self-serve support or FAQ bot and lead qualification, live agents and sales analytics are not on your list.',
    pricingModel: 'Usage-based on AI message credits, tiered per chatbot.',
    features: {
      rag: { text: 'Strong RAG on your uploaded content', edge: 'tie' },
      bant: { text: 'No native lead-qualification framework', edge: 'oye' },
      handoff: { text: 'Basic lead capture; limited live-agent handoff', edge: 'oye' },
      analytics: { text: 'Chat logs and basic usage analytics', edge: 'oye' },
      integrations: { text: 'Webhooks, Zapier and popular integrations', edge: 'tie' },
      setup: { text: 'Fast, upload content and embed', edge: 'tie' },
      pricing: { text: 'Metered AI message credits per plan', edge: 'oye' },
      bestFor: { text: 'Self-serve support & FAQ deflection', edge: 'them' },
    },
    faqs: [
      {
        q: 'Is OyeChats a good Chatbase alternative?',
        a: 'Yes, if you want more than a support bot. OyeChats matches Chatbase on RAG answers grounded in your content, then adds BANT lead scoring, live agent handoff and qualification analytics, so the same conversations also feed your sales pipeline.',
      },
      {
        q: 'What can OyeChats do that Chatbase cannot?',
        a: 'OyeChats scores every visitor on Budget, Authority, Need and Timeline, hands qualified leads to a human with the full transcript attached, and reports on qualification and drop-off, capabilities aimed at sales teams rather than support-only deflection.',
      },
    ],
    metaTitle: 'OyeChats vs Chatbase: AI Chatbot Comparison',
    metaDescription:
      'Chatbase vs OyeChats: both build RAG chatbots on your content, but OyeChats adds BANT lead scoring, live handoff and sales analytics. See the full comparison.',
  },
  {
    slug: 'oyechats-vs-intercom',
    name: 'Intercom',
    category: 'Customer support suite',
    monogram: 'I',
    tagline: 'The premium customer-support and engagement platform (Fin AI agent).',
    intent: 'Intercom alternative',
    summary:
      'Intercom is a mature, enterprise-grade support suite: shared inbox, tickets, help center, product tours and the Fin AI agent. It is deep and powerful, and priced accordingly. OyeChats is the AI-first, SMB-priced option: RAG answers plus BANT lead qualification live in minutes, without an enterprise rollout.',
    theirStrengths: [
      'Full support suite: inbox, tickets, help center, product tours',
      'Fin AI agent and a large enterprise integration ecosystem',
      'Battle-tested at scale with strong reporting and SLAs',
    ],
    oyeEdge: [
      'AI-first from day one, no seat-heavy rollout to get value',
      'BANT lead scoring built in, aimed at sales qualification not just support',
      'Flat pricing instead of per-seat plus per-resolution costs that climb with volume',
    ],
    whenToChooseThem:
      'Choose Intercom if you are a larger support organisation that needs a full ticketing suite, SLAs, product tours and deep enterprise integrations, and you have the budget for it.',
    pricingModel: 'Per-seat plans plus resolution-based Fin AI pricing; scales up quickly with volume.',
    features: {
      rag: { text: 'Fin answers from help center & sources', edge: 'tie' },
      bant: { text: 'No BANT scoring; sales handled by separate tooling', edge: 'oye' },
      handoff: { text: 'Excellent, mature inbox and routing', edge: 'them' },
      analytics: { text: 'Deep support analytics and reporting', edge: 'them' },
      integrations: { text: 'Very large enterprise app ecosystem', edge: 'them' },
      setup: { text: 'Heavier setup; built for support orgs', edge: 'oye' },
      pricing: { text: 'Per-seat + per-resolution; premium tier', edge: 'oye' },
      bestFor: { text: 'Larger support teams needing a full suite', edge: 'them' },
    },
    faqs: [
      {
        q: 'Is OyeChats a cheaper alternative to Intercom?',
        a: 'Yes. Intercom prices per seat plus per AI resolution, which climbs with volume. OyeChats uses flat monthly tiers, so an SMB gets RAG answers and BANT lead scoring without enterprise-tier spend.',
      },
      {
        q: 'When is Intercom the better choice over OyeChats?',
        a: 'If you run a large support organisation that needs a full ticketing suite, SLAs, product tours and deep enterprise integrations, Intercom is more complete. OyeChats is aimed at teams that want AI-first qualification and answers without that overhead.',
      },
    ],
    metaTitle: 'OyeChats vs Intercom: Alternative Comparison',
    metaDescription:
      'Intercom alternative: OyeChats gives you RAG answers and BANT lead scoring at flat SMB pricing, without per-seat and per-resolution costs. Full comparison inside.',
  },
  {
    slug: 'oyechats-vs-zoho-salesiq',
    name: 'Zoho SalesIQ',
    category: 'Live chat & engagement',
    monogram: 'Z',
    tagline: 'Live chat and visitor engagement inside the Zoho ecosystem.',
    intent: 'Zoho SalesIQ alternative',
    summary:
      'Zoho SalesIQ is affordable per-operator live chat with visitor tracking, the Zobot builder, and, on its Enterprise tier, the Answer Bot and Zia AI layer. It shines if you already run on Zoho CRM and Desk. OyeChats is the AI-native option that is not tied to one ecosystem: grounded RAG answers and BANT scoring are included from the entry tier, regardless of which CRM you use.',
    theirStrengths: [
      'Tight, native integration with Zoho CRM, Desk and the wider Zoho suite',
      'Mature live chat with omnichannel (WhatsApp, Instagram and more) and voice',
      'Capable AI (Answer Bot, Zia Agents) once you are on the Enterprise tier',
    ],
    oyeEdge: [
      'Grounded AI answers and BANT scoring included from the entry tier, no top-tier upgrade',
      'CRM-agnostic: HMAC-signed webhooks push qualified leads anywhere, not just Zoho',
      'Sales-qualification frameworks rather than generic visitor scores',
    ],
    whenToChooseThem:
      'Choose Zoho SalesIQ if your business already runs on Zoho and you want chat that plugs straight into Zoho CRM and Desk, or if you need omnichannel and voice in one suite.',
    pricingModel:
      'Per-operator tiers; AI answering (Answer Bot, Zia) sits on the Enterprise tier.',
    features: {
      rag: { text: 'Answer Bot & Zia AI, gated to the Enterprise tier', edge: 'oye' },
      bant: { text: 'Behavioural lead scoring, no named BANT framework', edge: 'oye' },
      handoff: { text: 'Mature live chat, routing, plus voice & omnichannel', edge: 'tie' },
      analytics: { text: 'Visitor tracking & engagement analytics', edge: 'tie' },
      integrations: { text: 'Native inside Zoho; broader is limited', edge: 'oye' },
      setup: { text: 'More configuration to reach an AI bot', edge: 'oye' },
      pricing: { text: 'Low per-operator price; AI is Enterprise-only', edge: 'them' },
      bestFor: { text: 'Existing Zoho customers; omnichannel teams', edge: 'them' },
    },
    faqs: [
      {
        q: 'How does OyeChats compare to Zoho SalesIQ?',
        a: 'Zoho SalesIQ is strongest when you already use Zoho, it plugs into Zoho CRM and Desk. OyeChats is AI-native and CRM-agnostic: RAG answers and BANT lead scoring work out of the box and push qualified leads to any tool via webhooks.',
      },
      {
        q: 'Do I need to use Zoho to get value from OyeChats?',
        a: 'No. OyeChats is not tied to any ecosystem, so it fits teams on HubSpot, Salesforce, Pipedrive or a spreadsheet just as well as Zoho users.',
      },
    ],
    metaTitle: 'OyeChats vs Zoho SalesIQ: Comparison',
    metaDescription:
      'Zoho SalesIQ alternative: OyeChats delivers AI-native RAG answers and BANT lead scoring without ecosystem lock-in. Compare features, fit and pricing model.',
  },
  {
    slug: 'oyechats-vs-livechat',
    name: 'LiveChat',
    category: 'Live chat software',
    monogram: 'L',
    tagline: 'Classic, agent-first live chat software.',
    intent: 'LiveChat alternative',
    summary:
      'LiveChat is a polished, reliable live-chat product built around human agents, strong routing, canned responses and a big integrations marketplace (AI comes via the separate ChatBot add-on). OyeChats is AI-first: RAG answers deflect and qualify before an agent is needed, with BANT scoring built in rather than bolted on.',
    theirStrengths: [
      'Best-in-class human agent tooling, routing, tags, canned replies',
      'Reliable, mature, with a large integrations marketplace',
      'Pairs with HelpDesk and the ChatBot add-on for automation',
    ],
    oyeEdge: [
      'AI does the first mile, answering and qualifying before a human is needed',
      'BANT scoring is native, not a separately priced ChatBot add-on',
      'Grounded RAG answers from your docs, included in every plan',
    ],
    whenToChooseThem:
      'Choose LiveChat if your priority is a polished human live-chat experience for a sizeable agent team and AI is a secondary concern.',
    pricingModel: 'Per-agent monthly pricing; AI automation is a separate ChatBot subscription.',
    features: {
      rag: { text: 'RAG only via the separate ChatBot add-on', edge: 'oye' },
      bant: { text: 'No native lead scoring', edge: 'oye' },
      handoff: { text: 'Excellent human-agent chat experience', edge: 'them' },
      analytics: { text: 'Strong agent & chat reporting', edge: 'tie' },
      integrations: { text: 'Large integrations marketplace', edge: 'them' },
      setup: { text: 'Quick for live chat; AI needs add-on setup', edge: 'oye' },
      pricing: { text: 'Per-agent + separate ChatBot cost', edge: 'oye' },
      bestFor: { text: 'Agent-led human live chat', edge: 'them' },
    },
    faqs: [
      {
        q: 'Is OyeChats an AI-first alternative to LiveChat?',
        a: 'Yes. LiveChat is built around human agents, with AI available through the separate ChatBot add-on. OyeChats leads with AI: RAG answers and BANT qualification are built in, so the bot handles and scores conversations before handing hot leads to a human.',
      },
      {
        q: 'Does OyeChats still support human agents like LiveChat?',
        a: 'It does. OyeChats includes live handoff, so once a visitor is qualified the conversation moves to an agent with the full transcript and BANT score attached.',
      },
    ],
    metaTitle: 'OyeChats vs LiveChat: Alternative Comparison',
    metaDescription:
      'LiveChat alternative: OyeChats is AI-first, with RAG answers and BANT lead scoring built in rather than a separate add-on. Compare features and fit.',
  },
  {
    slug: 'oyechats-vs-tidio',
    name: 'Tidio',
    category: 'Live chat & AI',
    monogram: 'T',
    tagline: 'SMB and e-commerce live chat with the Lyro AI agent.',
    intent: 'Tidio alternative',
    summary:
      'Tidio is a friendly, freemium live-chat and automation tool popular with small e-commerce stores, with the Lyro AI agent for support answers. OyeChats is built for sales-led teams: alongside RAG answers it adds BANT qualification and deeper analytics, so conversations are scored, not just automated.',
    theirStrengths: [
      'Approachable freemium plan and quick setup',
      'Lyro AI agent and handy e-commerce/Shopify features',
      'Good fit for small stores automating support',
    ],
    oyeEdge: [
      'BANT lead scoring for sales teams, not just support automation',
      'Hybrid RAG suited to docs-heavy and B2B use cases',
      'Qualification and drop-off analytics beyond basic chat stats',
    ],
    whenToChooseThem:
      'Choose Tidio if you run a small e-commerce store and want simple support chat with light AI automation on a budget.',
    pricingModel: 'Freemium, with Lyro AI conversations metered on paid plans.',
    features: {
      rag: { text: 'Lyro answers from your content', edge: 'tie' },
      bant: { text: 'No BANT lead scoring', edge: 'oye' },
      handoff: { text: 'Built-in live chat handoff', edge: 'tie' },
      analytics: { text: 'Basic chat & automation analytics', edge: 'oye' },
      integrations: { text: 'Good e-commerce integrations', edge: 'tie' },
      setup: { text: 'Very quick, freemium start', edge: 'tie' },
      pricing: { text: 'Freemium; metered AI conversations', edge: 'tie' },
      bestFor: { text: 'Small e-commerce support', edge: 'them' },
    },
    faqs: [
      {
        q: 'How is OyeChats different from Tidio?',
        a: 'Tidio is optimised for small-store support with the Lyro AI agent. OyeChats is sales-led: it adds BANT lead scoring and qualification analytics on top of RAG answers, so it fits B2B and docs-heavy teams that need to score and route leads.',
      },
      {
        q: 'Is OyeChats better than Tidio for B2B lead generation?',
        a: 'For lead generation, yes, OyeChats scores every visitor on Budget, Authority, Need and Timeline and hands qualified prospects to sales, which Tidio does not do natively.',
      },
    ],
    metaTitle: 'OyeChats vs Tidio: Alternative Comparison',
    metaDescription:
      'Tidio alternative: OyeChats adds BANT lead scoring and qualification analytics to RAG answers, built for sales-led teams. Compare features and best fit.',
  },
  {
    slug: 'oyechats-vs-crisp',
    name: 'Crisp',
    category: 'Business messaging',
    monogram: 'C',
    tagline: 'All-in-one business messaging with a shared inbox.',
    intent: 'Crisp alternative',
    summary:
      'Crisp is a well-priced, multichannel shared inbox, email, chat, WhatsApp and Messenger in one place, with MagicReply AI. OyeChats goes narrow and deep instead: AI qualification. If BANT scoring and RAG grounded in your content matter more than a multichannel inbox, OyeChats is the sharper tool.',
    theirStrengths: [
      'Flat pricing that is not charged per seat',
      'Multichannel shared inbox (email, WhatsApp, Messenger)',
      'Good all-round value for small teams',
    ],
    oyeEdge: [
      'Deep AI qualification with BANT scoring, not just an inbox',
      'Hybrid RAG answers grounded in your own content',
      'Analytics focused on lead quality and conversion',
    ],
    whenToChooseThem:
      'Choose Crisp if what you want most is an affordable multichannel shared inbox for a small team, with AI as a helper rather than the core.',
    pricingModel: 'Flat per-workspace tiers (not per-seat); strong value multichannel.',
    features: {
      rag: { text: 'MagicReply AI; lighter RAG grounding', edge: 'oye' },
      bant: { text: 'No BANT lead scoring', edge: 'oye' },
      handoff: { text: 'Strong shared-inbox handoff', edge: 'tie' },
      analytics: { text: 'Inbox & response analytics', edge: 'oye' },
      integrations: { text: 'Multichannel + integrations', edge: 'them' },
      setup: { text: 'Quick multichannel setup', edge: 'tie' },
      pricing: { text: 'Flat, not per-seat, good value', edge: 'tie' },
      bestFor: { text: 'Multichannel shared inbox', edge: 'them' },
    },
    faqs: [
      {
        q: 'Should I pick OyeChats or Crisp?',
        a: 'Pick Crisp if your priority is an affordable multichannel shared inbox. Pick OyeChats if AI-driven lead qualification is the goal, it adds BANT scoring and grounded RAG answers that Crisp does not focus on.',
      },
      {
        q: 'Does OyeChats offer a multichannel inbox like Crisp?',
        a: 'OyeChats concentrates on the website chatbot experience and lead qualification rather than a full multichannel inbox. It integrates outward via webhooks, but Crisp is the better pick if unified email/WhatsApp/Messenger is your main need.',
      },
    ],
    metaTitle: 'OyeChats vs Crisp: Alternative Comparison',
    metaDescription:
      'Crisp alternative: OyeChats trades the multichannel inbox for deep AI qualification, BANT lead scoring and grounded RAG answers. See where each one fits.',
  },
  {
    slug: 'oyechats-vs-chatsimple',
    name: 'Chatsimple',
    category: 'AI sales chatbot',
    monogram: 'C',
    tagline: 'AI chatbot focused on lead capture and meeting booking.',
    intent: 'Chatsimple alternative',
    summary:
      'Chatsimple is the closest to OyeChats in spirit, an AI sales chatbot for lead capture, meeting booking and multilingual conversations. The difference is depth of qualification: OyeChats scores leads with a structured BANT framework, grounds answers in hybrid RAG and adds live handoff, so reps get scored leads rather than raw captures.',
    theirStrengths: [
      'Purpose-built for AI-driven lead capture and booking',
      'Multilingual conversations and quick setup',
      'A natural fit for top-of-funnel capture',
    ],
    oyeEdge: [
      'Structured BANT scoring, not just contact capture',
      'Hybrid RAG grounding in your own content for accurate answers',
      'Live handoff plus qualification analytics your reps can trust',
    ],
    whenToChooseThem:
      'Choose Chatsimple if you want lightweight AI lead capture and calendar booking and do not need a formal qualification model behind it.',
    pricingModel: 'Freemium tiers metered on AI messages / leads.',
    features: {
      rag: { text: 'AI answers on your content', edge: 'tie' },
      bant: { text: 'Lead capture, but no structured BANT model', edge: 'oye' },
      handoff: { text: 'Lead capture & booking; lighter handoff', edge: 'oye' },
      analytics: { text: 'Lead capture analytics', edge: 'oye' },
      integrations: { text: 'CRM and calendar integrations', edge: 'tie' },
      setup: { text: 'Quick, freemium start', edge: 'tie' },
      pricing: { text: 'Freemium; metered on messages/leads', edge: 'tie' },
      bestFor: { text: 'Top-of-funnel lead capture', edge: 'them' },
    },
    faqs: [
      {
        q: 'What is the difference between OyeChats and Chatsimple?',
        a: 'Both are AI sales chatbots. Chatsimple focuses on lead capture and booking; OyeChats adds a structured BANT qualification model, hybrid RAG grounding in your own content, and live handoff, so reps receive scored, qualified leads rather than raw contacts.',
      },
      {
        q: 'Is OyeChats better for qualifying leads than Chatsimple?',
        a: 'For qualification specifically, yes. OyeChats scores every conversation on Budget, Authority, Need and Timeline and reports on it, giving sales a consistent framework rather than capture alone.',
      },
    ],
    metaTitle: 'OyeChats vs Chatsimple: AI Chatbot Comparison',
    metaDescription:
      'Chatsimple alternative: OyeChats adds structured BANT lead scoring, hybrid RAG grounding and live handoff to AI lead capture. Compare the two chatbots.',
  },
];

export function getCompetitor(slug: string): Competitor | undefined {
  return COMPETITORS.find((c) => c.slug === slug);
}

/** Short display name for a competitor's monogram card, without the slug prefix. */
export const COMPARE_HUB = {
  path: '/compare',
  title: 'OyeChats vs the alternatives',
} as const;
