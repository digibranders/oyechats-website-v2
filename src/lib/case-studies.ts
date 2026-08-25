/**
 * Case study corpus.
 *
 * Shape mirrors `src/lib/blog.ts`: a typed array in one file, rendered by
 * `/case-studies` (library) and `/case-studies/[slug]` (story). Adding a study
 * means appending one object here. Nothing else needs editing: the sitemap,
 * the library filters, the OG image and the JSON-LD all derive from this file.
 *
 * The shape is a fixed spine plus a flexible body:
 *   spine  = client profile, headline metrics, results, funnel
 *   body   = `sections`, a discriminated union of renderable blocks
 * so a future study with a different narrative still composes from the same
 * modules instead of needing a bespoke page.
 *
 * House style: no em-dashes or en-dashes in any string here. Everything in this
 * file is rendered copy and `scripts/verify-html.mjs` (W-1) asserts against the
 * compiled HTML.
 */

export type CaseStudyAccent = 'violet' | 'emerald' | 'amber' | 'blue' | 'rose';

/** One stage of the conversation funnel. Order is top of funnel to bottom. */
export type FunnelStage = {
  id: string;
  label: string;
  value: number;
  /** Short clarifier shown under the label on wide screens. */
  note?: string;
};

/** A headline number. `value` is numeric so it can animate and format. */
export type CaseMetric = {
  value: number;
  label: string;
  /** e.g. '%' or 'x'. Rendered immediately after the number. */
  suffix?: string;
};

/** One paired row of the challenge comparison. */
export type ComparisonRow = { reality: string; needed: string };

/** One group of the qualification progression. */
export type QualificationGroup = { title: string; items: string[] };

export type CaseSection =
  /** Running copy. `body` is one entry per paragraph. */
  | { kind: 'prose'; id: string; eyebrow: string; heading: string; body: string[] }
  /**
   * Paired "what the website did" against "what the business needed". Rows are
   * pairs rather than two independent lists so the association survives the
   * mobile stack, where two columns would otherwise separate into two lists a
   * reader has to re-pair by counting.
   */
  | {
      kind: 'comparison';
      id: string;
      eyebrow: string;
      heading: string;
      intro?: string;
      realityLabel: string;
      neededLabel: string;
      rows: ComparisonRow[];
      close?: string;
    }
  /** The signature module: the conversation funnel, stage by stage. */
  | {
      kind: 'funnel';
      id: string;
      eyebrow: string;
      heading: string;
      intro?: string;
      /** Rendered under the stages, above the methodology note. */
      close?: string;
    }
  /**
   * What the chatbot learned, as an ordered progression rather than a flat
   * grid. The order is the argument: identity, then context, then intent.
   */
  | {
      kind: 'qualificationGroups';
      id: string;
      eyebrow: string;
      heading: string;
      intro?: string;
      groups: QualificationGroup[];
    }
  /** Dark band. One oversized figure, an explanation, and supporting items. */
  | {
      kind: 'spotlight';
      id: string;
      eyebrow: string;
      heading: string;
      stat: { value: number; suffix?: string; caption: string };
      body: string[];
      /** Heading for `items`. Required whenever `items` is set. */
      itemsLabel?: string;
      items?: string[];
    }
  /**
   * A single from/to conversion. `rate` is stated separately rather than
   * derived at render time so the number on the page is reviewable in the
   * source data, next to the two counts it came from.
   */
  | {
      kind: 'conversion';
      id: string;
      eyebrow: string;
      heading: string;
      from: { value: number; label: string };
      to: { value: number; label: string };
      rate: string;
      rateCaption: string;
      body: string[];
    }
  /** Named outcomes, each a short title and one paragraph. */
  | {
      kind: 'impact';
      id: string;
      eyebrow: string;
      heading: string;
      intro?: string;
      /**
       * `was` is the prior state this outcome replaced. Optional: a study whose
       * impact is not a transformation should leave it unset rather than invent
       * a before.
       */
      items: { was?: string; title: string; body: string }[];
    }
  /**
   * Editorial close. `conclusion` is the study's own authored statement, NOT a
   * customer quotation: the source presents it unattributed, so it is rendered
   * as a heading and a statement rather than a blockquote. There is no `cite`
   * field by design, because there is nobody to cite.
   */
  | {
      kind: 'takeaway';
      id: string;
      eyebrow: string;
      heading: string;
      conclusion: string;
      body: string[];
      /**
       * Sentence set beside the derived end-to-end rate. The rate itself is
       * computed from the funnel, so the two can never drift apart.
       */
      closing?: string;
    };

/**
 * One run of the hero h1. Segments rather than a single string so the accent
 * is data-driven: the previous implementation regex-matched a leading figure
 * out of `title`, which only worked while every study happened to open with a
 * number.
 */
export type HeadlineSegment = { text: string; accent?: boolean };

export type CaseStudy = {
  slug: string;
  /**
   * Card, breadcrumb and JSON-LD headline. Written as a claim, not a label.
   * The hero renders `heroHeadline` instead.
   */
  title: string;
  /**
   * SERP title. The root layout appends ' · OyeChats' (11 chars) and
   * verify-html T-2 caps non-blog routes at 65, so keep this at or under 54.
   */
  metaTitle: string;
  /** 70 to 165 chars. Asserted by verify-html T-2. */
  description: string;
  /** Lead paragraph under the h1. */
  summary: string;
  category: string;
  accent: CaseStudyAccent;
  tags: string[];
  dateISO: string;
  updatedISO?: string;
  readMinutes: number;
  client: {
    /** Anonymized studies use a descriptive stand-in, never an invented name. */
    name: string;
    industry: string;
    model: string;
    market: string;
    period: string;
    solution: string;
  };
  /** The h1, split so the accent lands on the figures that carry the claim. */
  heroHeadline: HeadlineSegment[];
  /** Exactly three. Rendered in the outcome strip and on the library card. */
  headline: CaseMetric[];
  funnel: FunnelStage[];
  sections: CaseSection[];
  /** Where the numbers came from. Rendered verbatim near the results. */
  methodology: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'b2b-saas-lead-qualification',
    // "Potential", never "qualified". The source document's metric is
    // "Potential B2B Leads Identified"; it uses "qualified opportunities" only
    // as editorial framing, never as the label for this count. Relabelling the
    // figure would be a claim the client never made.
    title: '18,742 conversations, 1,146 potential B2B leads, in 90 days',
    metaTitle: '18,742 chats to 1,146 potential B2B leads',
    description:
      'How a B2B technology company used an AI chatbot to identify companies, validate business emails and identify 1,146 potential B2B leads from 18,742 conversations.',
    summary:
      'A B2B technology company used an AI website chatbot to engage visitors, identify the companies behind them, capture and validate business information, and route people toward the right next step. These are the counts it reported over 90 days.',
    category: 'Lead qualification',
    accent: 'violet',
    tags: ['B2B', 'SaaS', 'Lead qualification', 'India'],
    dateISO: '2026-08-24',
    readMinutes: 6,
    client: {
      name: 'Client name withheld',
      industry: 'B2B technology and SaaS',
      model: 'B2B',
      market: 'India',
      period: '90 days',
      solution: 'AI website chatbot for lead identification, qualification and support',
    },
    heroHeadline: [
      { text: '18,742', accent: true },
      { text: ' conversations. ' },
      { text: '1,146', accent: true },
      { text: ' potential B2B leads. 90 days.' },
    ],
    headline: [
      { value: 18742, label: 'Conversations handled' },
      { value: 1146, label: 'Potential B2B leads identified' },
      { value: 241, label: 'Quotations shared' },
    ],
    // Labels are the client's own reporting labels. No `note` is set: the
    // source records the counts and the stage names, not the mechanism behind
    // each stage, and describing one would be invention.
    funnel: [
      { id: 'handled', label: 'Users handled by AI chatbot', value: 18742 },
      { id: 'company', label: 'Users identified by company name', value: 12486 },
      { id: 'email', label: 'Email IDs collected', value: 8964 },
      { id: 'validated', label: 'Email IDs successfully validated', value: 7821 },
      { id: 'leads', label: 'Potential B2B leads identified', value: 1146 },
      { id: 'transferred', label: 'Users transferred to live support', value: 428 },
      { id: 'requested', label: 'Quotations requested', value: 286 },
      { id: 'shared', label: 'Quotations shared', value: 241 },
    ],
    methodology:
      'All counts on this page are the client reported totals for a single 90 day implementation period. The client is not named. Every percentage shown is calculated from those counts, and nothing is projected beyond that window.',
    sections: [
      {
        kind: 'comparison',
        id: 'challenge',
        eyebrow: 'The challenge',
        heading: 'Traffic was arriving. Prospects were not.',
        intro:
          'The client was receiving a steady flow of website visitors, but a large percentage of potential prospects were leaving the website without engaging with the sales team.',
        realityLabel: 'Website reality',
        neededLabel: 'What was needed',
        rows: [
          { reality: 'Anonymous, general visitors', needed: 'Company identification' },
          { reality: 'Unknown business intent', needed: 'Requirement and intent signals' },
          { reality: 'Repetitive enquiries', needed: 'Automated initial assistance' },
          { reality: 'After hours visitors', needed: '24/7 engagement' },
          { reality: 'Limited sales context', needed: 'Structured information before handoff' },
        ],
        close:
          'The client implemented an AI powered B2B chatbot to automate the initial conversation, identify prospects, and route high intent users to the appropriate next step.',
      },
      {
        kind: 'qualificationGroups',
        id: 'qualification',
        eyebrow: 'What the chatbot identified',
        heading: 'What the chatbot learned before sales got involved.',
        intro:
          'These are the attributes the chatbot was able to capture while a conversation was happening. Together they are what allowed the sales team to receive more context before engaging with a prospect.',
        groups: [
          {
            title: 'Identity',
            items: ['Visitor name', 'Company name', 'Business email', 'Email validity'],
          },
          {
            title: 'Business context',
            items: [
              'Company profile',
              'Requirement',
              'Product or service interest',
              'Estimated requirement',
            ],
          },
          {
            title: 'Intent and action',
            items: ['Purchase intent', 'Need for sales assistance', 'Request for quotation'],
          },
        ],
      },
      {
        kind: 'funnel',
        id: 'results',
        eyebrow: '90 day funnel',
        heading: 'What happened to 18,742 conversations.',
        intro:
          'The chatbot did not simply answer questions. It progressively collected and analyzed information during conversations to determine whether a visitor could represent a potential business opportunity. Each stage below is a reported count.',
        // Folded in from the standalone lead qualification section that this
        // redesign removed. The point is load bearing and appears nowhere else.
        close:
          'The other 17,596 conversations were handled by the chatbot too. Identifying the potential prospects first is what kept sales representatives out of them.',
      },
      {
        kind: 'spotlight',
        id: 'handoff',
        eyebrow: 'Sales handoff',
        heading: 'Human attention when it was more appropriate.',
        stat: { value: 428, caption: 'Users transferred to live support' },
        body: [
          'The AI chatbot handled the initial conversations and transferred users to live support when human assistance was more appropriate. 428 of 18,742 conversations reached that point.',
          'This helped the sales team focus their time on the conversations that required human involvement, and it meant they received more context before engaging with a prospect.',
        ],
        itemsLabel: 'Common transfer triggers',
        items: [
          'Detailed product discussions',
          'Pricing negotiations',
          'Complex technical questions',
          'Enterprise requirements',
          'Custom requirements',
          'High purchase intent',
          'Direct request to speak with sales',
        ],
      },
      {
        kind: 'conversion',
        id: 'quotations',
        eyebrow: 'Quotation generation',
        heading: '286 requested a quotation. 241 received one.',
        from: { value: 286, label: 'Quotation requests' },
        to: { value: 241, label: 'Quotations shared' },
        // 241 / 286 = 84.27%. Both counts stay on screen beside it so the
        // arithmetic is checkable rather than asserted.
        rate: '84.3%',
        rateCaption: 'of quotation requests resulted in a quotation being shared',
        body: [
          'The chatbot helped capture the required information before the quotation process, reducing unnecessary back and forth between prospects and the sales team.',
          'The remaining 45 requests did not result in a quotation being shared. The reported figures do not say why, and this page does not fill that in.',
        ],
      },
      {
        kind: 'impact',
        id: 'impact',
        eyebrow: 'Business impact',
        heading: 'The website became an active qualification channel.',
        intro:
          'The implementation changed the role of the website from being primarily an information channel into an active lead identification and qualification channel.',
        items: [
          {
            was: 'Anonymous traffic',
            title: 'Traffic became identifiable',
            body: 'Company and contact information could be captured during the conversation itself, so visitors who would otherwise have left without contacting the company could still be identified as potential buyers.',
          },
          {
            was: 'Sales qualified manually',
            title: 'Qualification moved before sales',
            body: 'Potential B2B prospects were identified before a sales representative was involved, conversations carried more structure, and visitors were engaged even when the sales team was unavailable.',
          },
          {
            was: 'Every enquiry reached a person',
            title: 'Human attention became selective',
            body: 'High intent users were transferred to live support when required, and the sales team received additional context before engaging, so human time went to the conversations that needed it.',
          },
        ],
      },
      {
        kind: 'takeaway',
        id: 'takeaway',
        eyebrow: 'The takeaway',
        heading: 'AI did not replace the sales team.',
        conclusion: 'It helped the sales team focus on the conversations that mattered.',
        body: [
          'The biggest impact of the AI chatbot was not simply the number of conversations it handled. It was its ability to turn anonymous website visitors into identifiable, qualified and actionable B2B opportunities.',
          'In 90 days the chatbot handled 18,742 users, identified 1,146 potential B2B leads, validated 7,821 email IDs, identified 12,486 companies, transferred 428 users to live support, and helped facilitate 241 quotations.',
        ],
        closing:
          'of conversations became a shared quotation. The rest of them are on this page too, which is the only reason to believe that figure.',
      },
    ],
  },
];

/** Newest first. The library and the sitemap both read through this. */
export function getCaseStudies(): CaseStudy[] {
  return [...CASE_STUDIES].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

/**
 * Related studies for the end-of-page rail: same category first, then anything
 * else, so the slot is never empty once a second study exists.
 */
export function getRelatedCaseStudies(slug: string, limit = 2): CaseStudy[] {
  const current = getCaseStudy(slug);
  if (!current) return [];
  const rest = getCaseStudies().filter((c) => c.slug !== slug);
  const scored = rest
    .map((c) => ({
      c,
      score:
        (c.category === current.category ? 2 : 0) +
        c.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.c);
}

/** Distinct industries, for the library filter rail. */
export function getIndustries(): string[] {
  return [...new Set(CASE_STUDIES.map((c) => c.client.industry))].sort();
}

/** Step conversion between two funnel stages, as a whole percentage. */
export function stepRate(from: number, to: number): number {
  if (from <= 0) return 0;
  return Math.round((to / from) * 1000) / 10;
}

/** Share of the top of funnel a stage still holds, 0 to 100. */
export function stageShare(stage: FunnelStage, stages: FunnelStage[]): number {
  const top = stages[0]?.value ?? 0;
  if (top <= 0) return 0;
  return (stage.value / top) * 100;
}
