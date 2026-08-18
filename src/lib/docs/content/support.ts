import type { DocGroup } from '../types';

export const SUPPORT: DocGroup = {
  slug: 'support',
  label: 'Troubleshooting & help',
  description: 'The problems customers actually hit, what causes them, and where to get a human.',
  pages: [
    {
      slug: 'troubleshooting',
      navLabel: 'Troubleshooting',
      title: 'Troubleshooting',
      summary:
        'Symptom, cause, fix. Grouped by where the problem shows up.',
      metaTitle: 'Troubleshooting: Widget, Training, Webhooks',
      metaDescription:
        'Fix common OyeChats problems: widget not appearing, wrong or missing answers, crawls finding no pages, live chat unavailable, and webhook deliveries failing.',
      sections: [
        {
          id: 'widget',
          heading: 'The widget does not appear',
          blocks: [
            {
              t: 'steps',
              items: [
                {
                  title: 'Confirm the script is in the served HTML',
                  text: 'View source — not the inspector, which shows the DOM after JavaScript has run — and search for `oyechats-widget.js`. If it is not there, your CMS or template did not publish the change.',
                },
                {
                  title: 'Check it is inside <body>',
                  text: 'A script in `<head>` can run before there is a body to attach to.',
                },
                {
                  title: 'Check the bot key',
                  text: 'A typo, a truncated paste, or a placeholder still reading `YOUR_BOT_KEY` all produce silence. Copy it fresh from the dashboard.',
                },
                {
                  title: 'Check the domain allowlist',
                  text: 'If **Advanced → Allowed domains** does not include the exact hostname you are on, requests are rejected. `www` and non-`www` are different hostnames.',
                },
                {
                  title: 'Look at the console',
                  text: 'Widget messages are prefixed `[OyeChats]`. Run `OyeChats.diagnose()` for version, mount state and resolved configuration.',
                },
                {
                  title: 'Rule out blockers',
                  text: 'Some content blockers and strict corporate proxies block third-party chat widgets. Test in a clean profile.',
                },
              ],
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'A consent gate will hold it back deliberately',
              text: 'If `window.OYECHATS_ASYNC_INIT = true` is set, nothing mounts until `OyeChats.init()` is called. Confirm your consent manager actually calls it.',
            },
          ],
        },
        {
          id: 'answers',
          heading: 'Answers are wrong, thin, or missing',
          blocks: [
            {
              t: 'table',
              head: ['Symptom', 'Most likely cause', 'Fix'],
              rows: [
                [
                  '"I don\'t have that information"',
                  'The topic is not in the knowledge base, or the page holding it was not indexed.',
                  'Check the indexed page list. Crawl the missing page or upload the document.',
                ],
                [
                  'Answers quote out-of-date facts',
                  'Answers come from the index, not the live web.',
                  'Re-crawl, or turn on automatic weekly re-crawl.',
                ],
                [
                  'An uploaded PDF taught it nothing',
                  'The PDF is a scan with no text layer.',
                  'Run OCR first, or paste the text into a `.txt` or `.md` file.',
                ],
                [
                  'It refuses on-topic questions',
                  'The services list is set and the question falls outside it.',
                  'Widen or clear the services list under Advanced.',
                ],
                [
                  'Answers are vague across the board',
                  'Many near-duplicate pages are competing for retrieval.',
                  'Remove duplicate and thin pages; keep one thorough page per topic.',
                ],
                [
                  'Tone is off',
                  'Brand tone or system prompt.',
                  'Set a tone preset and tighten the system prompt.',
                ],
              ],
            },
            {
              t: 'callout',
              variant: 'success',
              title: 'Start with Unanswered questions',
              text: '**Analytics → Unanswered questions** is a ranked list of what your knowledge base is missing. It beats guessing.',
            },
          ],
        },
        {
          id: 'crawl',
          heading: 'Crawl problems',
          blocks: [
            {
              t: 'defs',
              items: [
                {
                  term: 'It found almost no pages',
                  text: 'Discovery tries your sitemap first, then a same-domain link scan. Both come up short on a client-rendered site whose links only exist after JavaScript runs, and `robots.txt` `Disallow` rules are honoured, so check those first. Publishing a sitemap is the most reliable fix — it also reaches orphaned pages a link scan cannot. Failing that, point the crawler at a section root that links out widely rather than a sparse landing page, or upload the content directly.',
                },
                {
                  term: 'Pages indexed but empty',
                  text: 'Content that renders only after user interaction, or is behind a login, has nothing to extract. Only what a public visitor sees is indexed.',
                },
                {
                  term: 'It stopped short of the whole site',
                  text: 'A plan cap on pages, crawl depth, or JavaScript-rendered pages. **Workspace → Usage** shows which cap you met.',
                },
                {
                  term: 'It failed part-way',
                  text: 'Pages already indexed are kept. Re-run the crawl; it skips unchanged pages.',
                },
              ],
            },
          ],
        },
        {
          id: 'live-chat',
          heading: 'Live chat is not available',
          blocks: [
            {
              t: 'p',
              text: 'Work down the seven [availability states](/docs/conversations/live-chat) in order — the first match wins, and the answer is almost always one of the first four:',
            },
            {
              t: 'list',
              ordered: true,
              items: [
                'Does your plan include live chat, and is the chatbot\'s toggle on?',
                'Does the workspace have at least one operator?',
                'Is it inside business hours, in the timezone you configured?',
                'Is at least one operator actually online and accepting chats?',
                'Is the queue full, or is every online operator at their concurrency limit?',
              ],
            },
            {
              t: 'p',
              text: 'The Support inbox shows the current state as a pill, so you can read the answer instead of deducing it.',
            },
          ],
        },
        {
          id: 'webhooks',
          heading: 'Webhooks are not arriving',
          blocks: [
            {
              t: 'steps',
              items: [
                {
                  title: 'Read the delivery log',
                  text: 'Every attempt is recorded with its status code and response body. It usually names the problem outright.',
                },
                {
                  title: 'Check you are subscribed to the right event',
                  text: 'An endpoint subscribed only to `lead_captured` never receives `tier_transition`.',
                },
                {
                  title: 'Check reachability',
                  text: 'The URL must be HTTPS on a publicly resolvable host. Private, internal and loopback addresses are rejected at registration.',
                },
                {
                  title: 'Check your response',
                  text: 'Only 2xx counts as delivered, and you have 10 seconds. Return quickly and do the work afterwards.',
                },
                {
                  title: 'Check your signature verification',
                  text: 'A silent 401 from your own handler is the most common cause of "webhooks not working". Hash the raw body bytes, before any parse or re-serialise.',
                },
              ],
            },
            {
              t: 'p',
              text: 'Once your endpoint is healthy, failed deliveries can be replayed from the dashboard. Full detail in [Webhooks](/docs/integrations/webhooks).',
            },
          ],
        },
        {
          id: 'billing',
          heading: 'Billing and credits',
          blocks: [
            {
              t: 'defs',
              items: [
                {
                  term: 'Credits drained faster than expected',
                  text: 'Check **Workspace → Usage** by action. A large crawl at 5 credits per page dwarfs conversation cost, and a re-crawl started manually is not the same as the free automatic one.',
                },
                {
                  term: 'A feature is greyed out',
                  text: 'It is not on your plan. The API returns `feature_not_available` with the feature name for the same reason.',
                },
                {
                  term: 'Payment failed',
                  text: 'You keep full access during the grace window. Update the payment method from Workspace → Billing; recovering the payment restores everything without re-subscribing.',
                },
                {
                  term: 'GSTIN missing from an invoice',
                  text: 'It was added after the invoice was issued. Add billing details before your first charge; already-issued invoices are not reissued.',
                },
              ],
            },
          ],
        },
      ],
    },

    {
      slug: 'faq',
      navLabel: 'FAQ',
      title: 'Frequently asked questions',
      summary: 'Short answers to the questions that come up before people commit.',
      metaTitle: 'OyeChats FAQ: Setup, Accuracy, Languages and Data',
      metaDescription:
        'Answers to common OyeChats questions about setup time, answer accuracy, hallucination, languages, multiple websites, data ownership and cancellation.',
      sections: [
        {
          id: 'setup',
          heading: 'Setup',
          blocks: [
            {
              t: 'defs',
              items: [
                {
                  term: 'How long does it take to go live?',
                  text: 'Minutes of your attention. Crawl time depends on how many pages you index; you can install the widget before training finishes.',
                },
                {
                  term: 'Do I need a developer?',
                  text: 'Only someone who can paste a script tag into your site or your tag manager. Everything else is dashboard configuration.',
                },
                {
                  term: 'Will it slow my site down?',
                  text: 'The snippet goes at the end of the body, the loader waits for the page to finish parsing before it does anything, and the chat panel is only built when a visitor opens it. The initial page load carries very little.',
                },
                {
                  term: 'Can I use one chatbot on several websites?',
                  text: 'Technically yes — add each hostname to the allowlist. But one knowledge base answering for two different businesses produces worse answers for both. Use one chatbot per site unless the content genuinely overlaps.',
                },
              ],
            },
          ],
        },
        {
          id: 'answers',
          heading: 'Answers',
          blocks: [
            {
              t: 'defs',
              items: [
                {
                  term: 'Will it make things up?',
                  text: 'Answers are assembled from passages retrieved from your own content, and the chatbot is instructed to say it does not know when the content does not cover the question. That makes invention much less likely than an ungrounded assistant, but no language model can be guaranteed never to err. Test with your real questions, and keep anything that must never be disclosed out of the knowledge base entirely.',
                },
                {
                  term: 'Can I stop it discussing certain topics?',
                  text: 'Yes. Set a services list to restrict it to specific topics, and use the system prompt for standing instructions. See [Controlling answers](/docs/chatbot/answer-control).',
                },
                {
                  term: 'What languages does it support?',
                  text: 'The underlying models are multilingual and will generally reply in the language a visitor writes in. The widget\'s own buttons and labels are not auto-translated — you set those strings yourself. See [Appearance and copy](/docs/widget/customize).',
                },
                {
                  term: 'Can I correct a bad answer?',
                  text: 'Not by editing a stored reply — there is no answer cache to edit. You fix the source: add or rewrite the content it drew from, then re-crawl. That fixes every future phrasing of the question, not just the one that was asked.',
                },
              ],
            },
          ],
        },
        {
          id: 'data',
          heading: 'Data and control',
          blocks: [
            {
              t: 'defs',
              items: [
                {
                  term: 'Who owns the data?',
                  text: 'You do. For visitor conversations you are the controller and OyeChats is the processor. See [Data and privacy](/docs/account/privacy) and the [DPA](/legal/dpa).',
                },
                {
                  term: 'Is my content used to train models?',
                  text: 'Your content is indexed to answer your visitors\' questions. What each third-party provider does with data passed to it is set out in [Sub-processors](/legal/subprocessors) — read that page if this matters to your procurement.',
                },
                {
                  term: 'Can I export everything?',
                  text: 'Leads and analytics export to CSV, invoices download as PDFs, and the REST API can read anything the dashboard shows.',
                },
                {
                  term: 'What happens if I cancel?',
                  text: 'You keep access until the end of the period you paid for, then drop to Free limits. Reactivating before the period end is free. See [Billing](/docs/account/billing).',
                },
              ],
            },
          ],
        },
        {
          id: 'roadmap',
          heading: 'Not available yet',
          blocks: [
            {
              t: 'p',
              text: 'These appear in the dashboard marked as planned, and are listed here so nobody buys on the expectation of them:',
            },
            {
              t: 'list',
              items: [
                'WhatsApp as a channel.',
                'Facebook Messenger as a channel.',
                'A general-purpose Conversation API for talking to your chatbot from your own app or backend.',
                'Native one-click CRM connectors — today the route is [webhooks plus an automation platform](/docs/integrations/crm).',
              ],
            },
          ],
        },
      ],
    },

    {
      slug: 'help',
      navLabel: 'Getting help',
      title: 'Getting help',
      summary: 'Where to go, and what to include so the first reply is a useful one.',
      metaTitle: 'OyeChats Support: How to Get Help',
      metaDescription:
        'How to contact OyeChats support, what to include in a report, and where to find status, changelog and security disclosure.',
      sections: [
        {
          id: 'channels',
          heading: 'Where to go',
          blocks: [
            {
              t: 'table',
              head: ['For', 'Go to'],
              rows: [
                ['Product questions and problems', '[Contact support](/contact) or email support@oyechats.com'],
                ['Something in these docs is wrong or missing', 'Same address — tell us the page'],
                ['A security vulnerability', '[Responsible disclosure](/legal/security). Not the support inbox.'],
                ['Billing and invoices', 'Contact support with the invoice number'],
                ['What changed recently', '[Changelog](/changelog)'],
              ],
            },
            {
              t: 'p',
              text: 'Priority support is a plan entitlement; every plan including Free can reach documentation and the support inbox.',
            },
          ],
        },
        {
          id: 'report',
          heading: 'What to include',
          blocks: [
            {
              t: 'p',
              text: 'A report with these five things usually gets solved in one reply instead of four:',
            },
            {
              t: 'list',
              ordered: true,
              items: [
                'Which chatbot — its name or bot key.',
                'What you expected, and what happened instead.',
                'The exact question you asked, if it is an answer-quality problem.',
                'The URL where you saw it, and the browser.',
                'For widget problems, the output of `OyeChats.diagnose()` from the console.',
              ],
            },
            {
              t: 'callout',
              variant: 'danger',
              title: 'Never send us a credential',
              text: 'Do not include your API key, an operator key, or a password in a support message. We never need one, and we will never ask for one.',
            },
          ],
        },
      ],
    },
  ],
};
