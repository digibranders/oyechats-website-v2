import type { DocGroup } from '../types';

export const ANALYTICS: DocGroup = {
  slug: 'analytics',
  label: 'Analytics & reporting',
  description: 'What the numbers mean, which ones to act on, and how visitor journeys are reconstructed.',
  pages: [
    {
      slug: 'overview',
      navLabel: 'Analytics overview',
      title: 'Analytics',
      summary:
        'Volume, quality and outcome metrics for every chatbot, plus the two reports that tell you what to fix next.',
      metaTitle: 'Chatbot Analytics, Ratings and Resolution',
      metaDescription:
        'Understand OyeChats analytics. Conversation volume, top questions, unanswered questions, visitor ratings, resolution rate and the qualification funnel.',
      sections: [
        {
          id: 'metrics',
          heading: 'What is measured',
          blocks: [
            {
              t: 'table',
              head: ['Metric', 'What it tells you'],
              rows: [
                ['Conversations', 'How many visitors chatted in the period. Your denominator for everything else.'],
                ['Messages', 'Total volume. A rising messages-per-conversation ratio usually means answers are not landing first time.'],
                ['Leads captured', 'Conversations that produced contact details.'],
                ['Qualification funnel', 'How conversations distributed across unqualified, MQL, SAL and SQL, with the conversion rate between stages.'],
                ['Visitor ratings', 'Average and distribution from the post-chat rating prompt.'],
                ['Resolution', 'The share of visitors who indicated their question was answered.'],
                ['Handoffs', 'How often visitors asked for a human, and how often one was available.'],
                ['Top questions', 'What visitors ask most.'],
                ['Unanswered questions', 'What the chatbot could not answer.'],
              ],
            },
            {
              t: 'p',
              text: 'Filter by chatbot and by date range. There is also a per-chatbot comparison view with a CSV download for reporting outside OyeChats.',
            },
          ],
        },
        {
          id: 'act-on',
          heading: 'The two reports worth a weekly look',
          blocks: [
            {
              t: 'defs',
              items: [
                {
                  term: 'Unanswered questions',
                  text: 'The single highest-value report in the product. Every row is a visitor whose question your knowledge base could not answer. Fix the top five each week (write the missing page, then re-crawl) and answer quality compounds.',
                },
                {
                  term: 'Top questions',
                  text: 'Tells you what your site should say louder. If a question dominates your chat volume, it probably deserves to be answered on the page itself, not only in chat.',
                },
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Message feedback',
              text: 'Visitors can rate individual replies. That feedback is collected separately from the post-chat rating and is the fastest way to find a specific answer that reads badly.',
            },
          ],
        },
        {
          id: 'retention',
          heading: 'How far back the data goes',
          blocks: [
            {
              t: 'p',
              text: 'Analytics respect your plan\'s chat-history window. One week on Free, up to a year on the top tiers. Export what you need if you want a longer series than your plan shows.',
            },
          ],
        },
      ],
    },

    {
      slug: 'journey',
      navLabel: 'Visitor journey',
      title: 'Visitor journey',
      summary:
        'The pages a visitor saw before, during and after chatting, which is where chat stops being a support channel and starts being attribution.',
      metaTitle: 'OyeChats Visitor Journey and Chat Attribution',
      metaDescription:
        'See which pages lead to chats, which pages visitors go to afterwards, and which journeys convert, with OyeChats visitor journey analytics.',
      sections: [
        {
          id: 'what',
          heading: 'What it shows',
          blocks: [
            {
              t: 'table',
              head: ['View', 'Answers'],
              rows: [
                ['Summary', 'Overall journey shape. Entry, chat, exit.'],
                ['Top pages', 'Which pages produce the most conversations. Usually not the pages you would guess.'],
                ['Pre-chat sequences', 'The common page paths visitors take before opening the chat.'],
                ['Post-chat destinations', 'Where visitors go after chatting. A jump to pricing or signup is the strongest signal chat is working.'],
                ['Conversion paths', 'The journeys that ended in a captured or qualified lead.'],
              ],
            },
            {
              t: 'p',
              text: 'Campaign attribution is captured too. Source, medium, campaign, referrer and landing page travel with the lead and appear in the [CSV export](/docs/leads/export).',
            },
          ],
        },
        {
          id: 'availability',
          heading: 'Availability',
          blocks: [
            {
              t: 'p',
              text: 'Journey analytics and lead source attribution are included on Standard and above.',
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Only pages the widget was on',
              text: 'The journey is built from pages where your widget is installed. Pages without the snippet are invisible to it, which is a good reason to install site-wide even where you do not expect chats.',
            },
          ],
        },
      ],
    },

    {
      slug: 'reports',
      navLabel: 'Reports & exports',
      title: 'Reports and exports',
      summary: 'Getting numbers out of OyeChats and into a spreadsheet, a warehouse, or your own dashboard.',
      metaTitle: 'OyeChats Reports and Data Exports',
      metaDescription:
        'Export OyeChats data: per-chatbot analytics CSV, lead exports, usage and credit reports, invoices, and pulling metrics through the REST API.',
      sections: [
        {
          id: 'in-app',
          heading: 'From the dashboard',
          blocks: [
            {
              t: 'table',
              head: ['Export', 'Where'],
              rows: [
                ['Per-chatbot analytics CSV', 'Analytics → comparison view'],
                ['Leads CSV', 'Leads → Export'],
                ['Credit and usage history', 'Workspace → Usage'],
                ['Invoices with PDFs', 'Workspace → Billing'],
                ['Billing and usage reports', 'Workspace → Reports'],
              ],
            },
          ],
        },
        {
          id: 'api',
          heading: 'Through the API',
          blocks: [
            {
              t: 'p',
              text: 'Everything the dashboard charts is available over REST, so you can pull it into your own BI tool on a schedule.',
            },
            {
              t: 'endpoints',
              items: [
                { method: 'GET', path: '/analytics/dashboard', text: 'Aggregate conversation, message and lead counts.' },
                { method: 'GET', path: '/analytics/qualification-funnel', text: 'Tier distribution with stage conversion rates.' },
                { method: 'GET', path: '/analytics/top-questions', text: 'Most frequently asked questions.' },
                { method: 'GET', path: '/analytics/unanswered-questions', text: 'Questions the chatbot could not answer.' },
                { method: 'GET', path: '/analytics/ratings-summary', text: 'Average and distribution of visitor ratings.' },
                { method: 'GET', path: '/analytics/resolution-summary', text: 'Resolution outcomes.' },
                { method: 'GET', path: '/analytics/journey/summary', text: 'Visitor journey overview.' },
                { method: 'GET', path: '/leads/export', text: 'Leads as CSV.' },
              ],
            },
            {
              t: 'p',
              text: 'See [API endpoints](/docs/api/endpoints) for authentication, parameters and rate limits.',
            },
          ],
        },
      ],
    },
  ],
};
