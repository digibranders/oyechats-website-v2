import type { DocGroup } from '../types';

export const GETTING_STARTED: DocGroup = {
  slug: 'getting-started',
  label: 'Getting started',
  description: 'What OyeChats is, how the pieces fit together, and the fastest path to a live chatbot.',
  pages: [
    {
      slug: 'introduction',
      navLabel: 'Introduction',
      title: 'What OyeChats is',
      summary:
        'OyeChats turns the content you already have. Your website, help centre and documents. Into an AI chatbot that answers visitor questions on your site, captures leads, and hands off to a human when it matters.',
      metaTitle: 'OyeChats Documentation: AI Chatbot Platform Overview',
      metaDescription:
        'How OyeChats works: train a chatbot on your content, embed it with one script tag, qualify leads, and hand off to human operators.',
      sections: [
        {
          id: 'what-it-does',
          heading: 'What it does',
          blocks: [
            {
              t: 'p',
              text: 'You point OyeChats at your website or upload your documents. It reads that content, indexes it, and answers visitor questions from it. Grounded in your material rather than invented. When a visitor looks like a buyer, it captures their details and scores them. When they want a person, it routes them to one of your operators.',
            },
            {
              t: 'defs',
              items: [
                {
                  term: 'Grounded answers',
                  text: 'Replies are built from the content you trained the chatbot on, not from general knowledge. If your knowledge base does not cover a question, the chatbot says so instead of guessing.',
                },
                {
                  term: 'One-line install',
                  text: 'A single `<script>` tag adds the widget to any website. Plain HTML, WordPress, Shopify, Webflow, Next.js, anything with a `<body>` tag.',
                },
                {
                  term: 'Lead capture and scoring',
                  text: 'Contact details captured in-conversation, plus a qualification score derived from what the visitor actually said. See [Lead qualification](/docs/leads/qualification).',
                },
                {
                  term: 'Human handoff',
                  text: 'Live chat with routing, queueing, business hours and an offline fallback form. See [Live chat](/docs/conversations/live-chat).',
                },
                {
                  term: 'Outbound events',
                  text: 'Signed webhooks push qualified leads and conversation events to your CRM or backend. See [Webhooks](/docs/integrations/webhooks).',
                },
              ],
            },
          ],
        },
        {
          id: 'how-it-works',
          heading: 'How it works end to end',
          blocks: [
            {
              t: 'steps',
              items: [
                {
                  title: 'You train it',
                  text: 'Give it a URL to crawl, or upload PDF, DOCX, TXT and Markdown files. OyeChats extracts the text, splits it into passages, and indexes each passage for search.',
                },
                {
                  title: 'You embed it',
                  text: 'Copy the script tag from your dashboard and paste it into your site. The widget appears as a launcher button; the visitor clicks it to open the chat.',
                },
                {
                  title: 'A visitor asks something',
                  text: 'The widget sends the question to the OyeChats API together with your public bot key.',
                },
                {
                  title: 'It retrieves, then answers',
                  text: 'The platform searches your indexed content, by meaning and by keyword together. Assembles the most relevant passages with the recent conversation, and generates a reply that streams back word by word.',
                },
                {
                  title: 'It records what happened',
                  text: 'The conversation, any captured contact details, the qualification score, and the visitor\'s page journey all land in your dashboard. Configured webhooks and email notifications fire.',
                },
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Why grounding matters',
              text: 'Because answers are assembled from your own passages, you control what the chatbot can say by controlling what you train it on. Removing a document removes what it knew from that document.',
            },
          ],
        },
        {
          id: 'what-you-need',
          heading: 'What you need to start',
          blocks: [
            {
              t: 'list',
              items: [
                'An OyeChats account. Sign up at [app.oyechats.com](https://app.oyechats.com/register). The Free plan needs no card.',
                'Content to train on: a public website URL, or files you can upload.',
                'Access to edit your website\'s HTML, or a plugin/app that can inject a script tag.',
              ],
            },
            {
              t: 'p',
              text: 'That is it. There is nothing to host, no model to choose, and no vector database to run.',
            },
          ],
        },
        {
          id: 'next',
          heading: 'Where to go next',
          blocks: [
            {
              t: 'cards',
              items: [
                {
                  title: 'Quickstart',
                  text: 'Live chatbot on your site in about five minutes.',
                  href: '/docs/getting-started/quickstart',
                },
                {
                  title: 'Core concepts',
                  text: 'Workspace, chatbot, knowledge base, conversation, lead, credit.',
                  href: '/docs/getting-started/concepts',
                },
                {
                  title: 'Install the widget',
                  text: 'The embed snippet and per-platform instructions.',
                  href: '/docs/widget/install',
                },
                {
                  title: 'REST API',
                  text: 'Authentication, endpoints, rate limits and errors.',
                  href: '/docs/api/overview',
                },
              ],
            },
          ],
        },
      ],
    },

    {
      slug: 'quickstart',
      navLabel: 'Quickstart',
      title: 'Quickstart',
      summary:
        'Sign up, train a chatbot on your site, test it, and install it. Five steps, roughly five minutes of your attention plus crawl time.',
      metaTitle: 'OyeChats Quickstart: Launch an AI Chatbot in Minutes',
      metaDescription:
        'Step-by-step quickstart: create an OyeChats account, train a chatbot on your website, test the answers, and install the widget with one script tag.',
      sections: [
        {
          id: 'steps',
          heading: 'The five steps',
          blocks: [
            {
              t: 'p',
              text: 'New accounts land in Launch Studio, a guided version of exactly these steps. You can leave it at any point and finish from the main dashboard.',
            },
            {
              t: 'steps',
              items: [
                {
                  title: 'Create your account',
                  text: 'Register with email and password, or continue with Google, at [app.oyechats.com/register](https://app.oyechats.com/register). Verify your email address. Unverified accounts cannot train or publish a chatbot.',
                },
                {
                  title: 'Create a chatbot',
                  text: 'Give it a name. This is what visitors see in the widget header. You can change it, its colours and its avatar later.',
                },
                {
                  title: 'Train it',
                  text: 'Enter your website URL. OyeChats discovers the pages it can reach, shows you the list, and lets you deselect anything you do not want indexed before the crawl runs. You can also upload files instead of, or in addition to, crawling.',
                },
                {
                  title: 'Test it',
                  text: 'Ask it the questions your customers actually ask. Preview conversations from the dashboard do not consume chat credits, up to 50 preview messages per chatbot per day.',
                },
                {
                  title: 'Install it',
                  text: 'Copy the embed snippet and paste it into your site before the closing `</body>` tag. The dashboard detects the first real page load and marks the chatbot as live.',
                },
              ],
            },
          ],
        },
        {
          id: 'snippet',
          heading: 'The embed snippet',
          blocks: [
            {
              t: 'p',
              text: 'Your dashboard shows the snippet with your own bot key filled in. It looks like this:',
            },
            {
              t: 'code',
              label: 'HTML. Paste before </body>',
              code: `<!-- OyeChats -->
<script
  src="https://cdn.oyechats.com/oyechats-widget.js"
  data-bot-key="YOUR_BOT_KEY"
></script>
<a
  href="https://www.oyechats.com/?ref=YOUR_BOT_KEY&utm_source=widget&utm_medium=referral"
  rel="nofollow"
  style="font-size:11px;color:inherit;opacity:0.7;text-decoration:none"
>Powered by OyeChats</a>`,
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'About the credit link',
              text: 'The `<a>` is the attribution link. It sits in your page\'s HTML so search engines and AI assistants can read it. The badge inside the widget only renders after a visitor opens the chat, so crawlers never see it. Plans that include white-label branding emit a snippet without this line. See [Branding](/docs/widget/customize).',
            },
          ],
        },
        {
          id: 'verify',
          heading: 'Confirming it works',
          blocks: [
            {
              t: 'list',
              items: [
                'Load your page in a normal browser tab (not a preview iframe) and look for the launcher in the bottom-right corner.',
                'Open your browser console. Messages from the widget are prefixed `[OyeChats]`.',
                'Back in the dashboard, the chatbot\'s status shows as installed once the widget has bootstrapped from your real domain at least once.',
              ],
            },
            {
              t: 'p',
              text: 'If the launcher does not appear, work through [Troubleshooting](/docs/support/troubleshooting). The two usual causes are a script tag placed outside `<body>` and a domain allowlist that does not include the site you are testing on.',
            },
          ],
        },
      ],
    },

    {
      slug: 'concepts',
      navLabel: 'Core concepts',
      title: 'Core concepts',
      summary:
        'The eight nouns that everything else in OyeChats is built from. Worth five minutes before you configure anything.',
      metaTitle: 'Core Concepts: Workspace, Chatbot, Credits',
      metaDescription:
        'Definitions of the core OyeChats concepts: workspace, chatbot, bot key, knowledge base, conversation, lead, operator, and credits.',
      sections: [
        {
          id: 'vocabulary',
          heading: 'Vocabulary',
          blocks: [
            {
              t: 'defs',
              items: [
                {
                  term: 'Workspace (account)',
                  text: 'Your organisation on OyeChats. It owns the subscription, the credit balance, the chatbots, the team, and every conversation. One login can belong to more than one workspace.',
                },
                {
                  term: 'Chatbot',
                  text: 'One configured assistant: its own knowledge base, personality, appearance, live-chat settings and analytics. Most customers run one chatbot per website.',
                },
                {
                  term: 'Bot key',
                  text: 'The public identifier for a chatbot, shaped like `bot-6a427d4529b9`. It goes in the embed snippet and is visible to anyone who views your page source. That is by design. It can only start conversations, never read your account. Protect your site with the [domain allowlist](/docs/widget/security), not by hiding the key.',
                },
                {
                  term: 'API key',
                  text: 'The private credential for your workspace, sent as the `X-API-Key` header. It can read and change everything in the workspace. Never put it in front-end code. See [API authentication](/docs/api/overview).',
                },
                {
                  term: 'Knowledge base',
                  text: 'Everything a chatbot has been trained on. Crawled pages and uploaded files. After extraction and indexing. See [Training your chatbot](/docs/chatbot/knowledge).',
                },
                {
                  term: 'Conversation',
                  text: 'One visitor\'s chat session, from the first message to the moment it closes. A conversation can move between AI mode, waiting for an operator, and live with an operator.',
                },
                {
                  term: 'Lead',
                  text: 'A conversation with contact details attached. Leads carry a qualification score and tier. See [Lead capture](/docs/leads/capture).',
                },
                {
                  term: 'Operator',
                  text: 'A human teammate who can take over live chats. Operators have their own login and occupy a seat on your plan. See [Operators and seats](/docs/conversations/operators).',
                },
                {
                  term: 'Credits',
                  text: 'The single unit that meters usage. One per AI reply, five per crawled page, and so on. Your plan grants a monthly allowance. See [Credits](/docs/account/credits).',
                },
              ],
            },
          ],
        },
        {
          id: 'naming',
          heading: 'A note on naming',
          blocks: [
            {
              t: 'p',
              text: 'The product calls the AI an **AI Chatbot** and a human teammate an **Operator**. Older material and some API field names still use "agent" for both, which is why you will occasionally see `agent` in a URL or a legacy header. They mean the same objects described above.',
            },
          ],
        },
        {
          id: 'model',
          heading: 'How the objects relate',
          blocks: [
            {
              t: 'code',
              label: 'Object hierarchy',
              code: `Workspace
├── Subscription ── Credit balance ── Invoices
├── Team
│   ├── Members (dashboard access)
│   └── Operators (live chat seats) ── Departments
└── Chatbot
    ├── Knowledge base (crawled pages + uploaded files)
    ├── Conversations
    │   ├── Messages
    │   └── Lead  ── Qualification score & tier
    ├── Widget configuration (appearance, copy, behaviour)
    └── Webhook endpoints`,
            },
          ],
        },
      ],
    },

    {
      slug: 'dashboard',
      navLabel: 'Dashboard tour',
      title: 'Dashboard tour',
      summary:
        'Where each thing lives in the OyeChats dashboard, so the rest of these docs can point at a place rather than describe it.',
      metaTitle: 'OyeChats Dashboard Tour: Where Everything Lives',
      metaDescription:
        'A guide to the OyeChats dashboard: Home, Chatbots, Support inbox, Leads, Journey, Analytics, Workspace and Settings.',
      sections: [
        {
          id: 'primary-nav',
          heading: 'Primary navigation',
          blocks: [
            {
              t: 'table',
              head: ['Section', 'What it is for'],
              rows: [
                ['Home', 'Daily overview. Recent activity, what needs attention, quick actions.'],
                ['Chatbots', 'Create, train, configure and manage each chatbot.'],
                ['Support', 'The live-chat inbox: the queue, active conversations, transcripts and offline messages.'],
                ['Leads', 'Captured contacts with their qualification scores, filters and CSV export.'],
                ['Journey', 'The pages visitors saw before, during and after chatting.'],
                ['Analytics', 'Volume, resolution, ratings, top questions and unanswered questions across chatbots.'],
                ['Workspace', 'Members, billing, usage, reports, API keys, integrations and the affiliate programme.'],
                ['Settings', 'Your own profile, password, email and notification preferences.'],
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Operators see less',
              text: 'A teammate who only holds an operator seat sees Support, Leads and Settings. Home, Chatbots, Analytics and Workspace are hidden and blocked at the route level.',
            },
          ],
        },
        {
          id: 'chatbot-tabs',
          heading: 'Inside a chatbot',
          blocks: [
            {
              t: 'p',
              text: 'Selecting a chatbot opens five tabs:',
            },
            {
              t: 'table',
              head: ['Tab', 'Contents'],
              rows: [
                ['Overview', 'Health, install status, training state, and this chatbot\'s own metrics.'],
                ['Knowledge', 'Crawl and upload, the indexed page and file list, re-crawl settings.'],
                ['Experience', 'Personality, appearance, widget copy, suggested questions, lead form.'],
                ['Channels', 'Where the chatbot is reachable. Website widget and meeting booking are live; other channels are marked as planned.'],
                ['Advanced', 'Qualification framework, domain allowlist, answer scope, smart links, timing thresholds.'],
              ],
            },
          ],
        },
        {
          id: 'launch-studio',
          heading: 'Launch Studio',
          blocks: [
            {
              t: 'p',
              text: 'A full-screen guided setup for new chatbots, covering Welcome, Create, Setup & Train, Test, Customize, Deploy and Verification. It writes to exactly the same settings as the tabs above, so you can switch between the two freely.',
            },
          ],
        },
      ],
    },
  ],
};
