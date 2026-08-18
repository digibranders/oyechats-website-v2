import type { DocGroup } from '../types';

export const CHATBOT: DocGroup = {
  slug: 'chatbot',
  label: 'Building a chatbot',
  description: 'Create it, train it on your content, shape how it answers, and test it before it goes live.',
  pages: [
    {
      slug: 'create',
      navLabel: 'Create a chatbot',
      title: 'Create a chatbot',
      summary:
        'What a chatbot is made of, how many you can have, and what OyeChats fills in for you when you create one.',
      metaTitle: 'Create an AI Chatbot in OyeChats',
      metaDescription:
        'How to create a chatbot in OyeChats, what gets auto-detected from your website, and how chatbot limits work per plan.',
      sections: [
        {
          id: 'creating',
          heading: 'Creating one',
          blocks: [
            {
              t: 'p',
              text: 'Go to **Chatbots → New chatbot**, give it a name, and optionally give it your website URL. The name is visible to visitors in the widget header, so use something they will recognise. Usually your company or product name.',
            },
            {
              t: 'p',
              text: 'Every chatbot gets its own bot key immediately, so you can install the widget before you finish training. An untrained chatbot will tell visitors it does not have that information yet rather than inventing an answer.',
            },
          ],
        },
        {
          id: 'auto-detected',
          heading: 'What gets detected from your site',
          blocks: [
            {
              t: 'p',
              text: 'If you supply a website URL, the crawl fills in several fields for you. Each one is editable, and once you edit a field by hand OyeChats stops overwriting it on later crawls.',
            },
            {
              t: 'table',
              head: ['Field', 'Where it comes from'],
              rows: [
                ['Company name and description', 'Extracted from your site content.'],
                ['Brand tone', 'Inferred from how your site is written; you can accept it, pick a preset, or write your own.'],
                ['Suggested colours', 'Sampled from your site so the widget can match your palette in one click.'],
                ['Services', 'Candidate service names harvested from your navigation and footer, offered as a starting point for [answer scope](/docs/chatbot/answer-control).'],
                ['Suggested questions', 'Sample questions generated from your content and then verified against your own index, so a suggested question always has a real answer behind it.'],
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Nothing is published without you',
              text: 'Detected values are drafts on the chatbot record. Visitors only ever see what you leave in place.',
            },
          ],
        },
        {
          id: 'how-many',
          heading: 'How many chatbots you can have',
          blocks: [
            {
              t: 'p',
              text: 'Every paid tier below Enterprise includes one chatbot; Enterprise includes an unlimited number sharing one credit pool, which is what makes it the agency tier. Current numbers live on the [pricing page](/pricing). Plan limits are enforced from your subscription, not from these docs.',
            },
            {
              t: 'p',
              text: 'Deleting a chatbot removes its knowledge base, conversations and captured leads. Export anything you need first. See [Exporting leads](/docs/leads/export).',
            },
          ],
        },
      ],
    },

    {
      slug: 'knowledge',
      navLabel: 'Training & knowledge',
      title: 'Training your chatbot',
      summary:
        'Two ways to teach a chatbot: crawl a website, or upload files. This page covers both, what is supported, what it costs, and how to keep the knowledge base fresh.',
      metaTitle: 'Train an AI Chatbot: Website Crawling and File Upload',
      metaDescription:
        'Train your OyeChats chatbot by crawling your website or uploading PDF, DOCX, TXT and Markdown files. Supported formats, size limits, credit costs and re-crawling.',
      sections: [
        {
          id: 'crawl',
          heading: 'Crawling a website',
          blocks: [
            {
              t: 'steps',
              items: [
                {
                  title: 'Enter a URL',
                  text: 'Open **Chatbots → Knowledge → Add from website** and paste the URL you want indexed. A section root such as `https://example.com/help` works as well as a homepage.',
                },
                {
                  title: 'Review the discovered pages',
                  text: 'OyeChats reads your `robots.txt` for `Sitemap:` directives and then the sitemaps themselves. If that turns up nothing usable, it scans the page you gave it for same-domain links and follows them. Either way you get the page list with an estimated credit cost before anything is charged, and your typed URL is always included.',
                },
                {
                  title: 'Deselect what you do not want',
                  text: 'Pruning the list here is the cheapest moment to do it. Login pages, cart pages, tag archives and paginated blog indexes usually add cost without adding answers.',
                },
                {
                  title: 'Start the crawl',
                  text: 'Progress updates live. Pages are indexed in waves as they arrive, so early pages become answerable before the whole crawl finishes. You can cancel mid-run; pages already indexed are kept.',
                },
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'A sitemap gets you better coverage',
              text: 'The link scan is deliberately bounded so it stays fast and does not hammer your origin: it follows links about two hops from the page you give it and only fetches a limited number of pages to find more. A sitemap is authoritative, so it also reaches deep and orphaned pages that no link scan would find. If you have one, discovery will be more complete.',
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Client-rendered sites',
              text: 'If a site publishes no sitemap and its links only exist after JavaScript runs. A typical single-page app. Neither of the above finds anything. The crawl then falls back to a recursive browser crawl, which does render the page. That path is slower and gives no page list to review up front.',
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'What it can reach',
              text: 'Only pages a public visitor can reach. Anything behind a login or a paywall is not indexed, and `robots.txt` `Disallow` rules are honoured. JavaScript-rendered pages are supported, subject to a per-plan cap on how many need rendering.',
            },
          ],
        },
        {
          id: 'upload',
          heading: 'Uploading files',
          blocks: [
            {
              t: 'p',
              text: 'Use **Add files** for anything not on your website: spec sheets, policy documents, price lists, internal FAQs.',
            },
            {
              t: 'table',
              head: ['Constraint', 'Value'],
              rows: [
                ['Formats', '`.pdf`, `.docx`, `.txt`, `.md`'],
                ['Maximum per file', '10 MB'],
                ['Maximum per upload request', '60 MB'],
                ['Maximum files per upload request', '50'],
              ],
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'Scanned PDFs',
              text: 'Text is extracted from the PDF\'s own text layer. A scanned or photographed document has no text layer, so it indexes as empty. Run it through OCR first, or paste the text into a `.txt` or `.md` file.',
            },
            {
              t: 'p',
              text: 'Before charging, the uploader shows a cost preview. Unsupported extensions and oversized files are rejected at that point, so they never consume credits.',
            },
          ],
        },
        {
          id: 'cost',
          heading: 'What training costs',
          blocks: [
            {
              t: 'table',
              head: ['Action', 'Credits'],
              rows: [
                ['Crawled page', '5 per page'],
                ['Uploaded file', '1 credit per 250 words, minimum 1 credit per file'],
                ['Automatic weekly re-crawl', '0, funded by your subscription, whatever changed'],
                ['Manual re-crawl, updated pages only *(Standard and above)*', '5 per page that actually changed'],
                ['Manual re-crawl, full', '5 per page for every page, changed or not'],
              ],
            },
            {
              t: 'p',
              text: 'Plans also cap total knowledge size, in pages, files, and characters. Hitting a cap blocks further ingestion for that chatbot until you remove content or move up a tier; it never silently truncates a document. See [Plans and limits](/docs/account/plans).',
            },
          ],
        },
        {
          id: 'freshness',
          heading: 'Keeping it current',
          blocks: [
            {
              t: 'defs',
              items: [
                {
                  term: 'Manual re-crawl. Full',
                  text: 'Re-fetches and re-indexes every discovered page, and **charges for all of them at 5 credits each even if nothing changed**. Available on every plan, and it is the only manual option below Standard.',
                },
                {
                  term: 'Manual re-crawl. Updated pages only',
                  text: 'Re-fetches everything but only re-indexes and charges for pages whose content actually changed. Included on Standard and above. Before it runs you get a diff showing how many pages are unchanged, new and removed.',
                },
                {
                  term: 'Automatic re-crawl',
                  text: 'A weekly refresh of every previously-crawled URL. Pages whose content genuinely changed are re-indexed; unchanged pages are skipped. Cosmetic churn such as a copyright year rolling over does not count as a change. Included on Standard and above; the toggle is visible but locked on lower tiers.',
                },
                {
                  term: 'Re-index a file',
                  text: 'Re-processes a single uploaded document, useful after you upload a corrected version under the same name.',
                },
              ],
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'A full manual re-crawl bills the whole site',
              text: 'Only the automatic weekly refresh is free. A manual full re-crawl deliberately re-charges every page, on a 300-page site that is 1,500 credits whether two pages changed or none did. If you are on Standard or above, use "updated pages only". If you are below it, leaning on the automatic weekly re-crawl is much cheaper than re-crawling by hand.',
            },
          ],
        },
        {
          id: 'removing',
          heading: 'Removing content',
          blocks: [
            {
              t: 'p',
              text: 'Deleting a page or file from the Knowledge tab removes it and its indexed passages, and the chatbot immediately stops being able to answer from it. Deletion does not refund the credits already spent indexing it.',
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'Answers reflect the index, not the live web',
              text: 'The chatbot answers from what was indexed at crawl time. Publishing a change on your site does not change its answers until the next crawl or re-crawl.',
            },
          ],
        },
        {
          id: 'quality',
          heading: 'Getting better answers',
          blocks: [
            {
              t: 'list',
              items: [
                'Index the pages that answer questions. Docs, help centre, FAQs, pricing, policies. Before marketing pages.',
                'Skip near-duplicate pages. Ten variants of the same landing page make retrieval less certain, not more thorough.',
                'Prefer one thorough page over several thin ones on the same topic.',
                'Watch **Analytics → Unanswered questions**. It is a direct list of what your knowledge base is missing.',
              ],
            },
          ],
        },
      ],
    },

    {
      slug: 'answer-control',
      navLabel: 'Controlling answers',
      title: 'Controlling how it answers',
      summary:
        'Personality, tone, what the chatbot is allowed to discuss, and how it links out. These settings shape every reply without touching the knowledge base.',
      metaTitle: 'Control Chatbot Answers: Prompt, Tone, Scope',
      metaDescription:
        'Shape OyeChats replies with a system prompt, brand tone presets, service-scoped answers and smart links, so the chatbot stays on-message and on-brand.',
      sections: [
        {
          id: 'system-prompt',
          heading: 'System prompt',
          blocks: [
            {
              t: 'p',
              text: 'The system prompt is your standing instruction to the chatbot: who it is, who it is talking to, and how to behave in situations your content does not cover. It applies to every conversation.',
            },
            {
              t: 'code',
              label: 'Example system prompt',
              code: `You are the support assistant for Acme, a B2B logistics platform.

Audience: operations managers evaluating or already using Acme.

Rules:
- Answer only from Acme's documentation.
- If the answer is not in the documentation, say so and offer to connect
  the visitor with the team. Never guess at pricing or SLAs.
- Keep replies under four sentences unless asked for detail.
- For anything about invoices or refunds, direct them to billing@acme.com.`,
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'The prompt is not a security boundary',
              text: 'It steers behaviour reliably but is not a guarantee. Anything that must never be disclosed should not be in the knowledge base at all.',
            },
          ],
        },
        {
          id: 'brand-tone',
          heading: 'Brand tone',
          blocks: [
            {
              t: 'p',
              text: 'Tone controls voice rather than content. Pick a preset, let OyeChats infer one from your website, or write your own description.',
            },
            {
              t: 'table',
              head: ['Preset', 'Reads as'],
              rows: [
                ['Professional', 'Measured, businesslike, no filler.'],
                ['Friendly', 'Warm and conversational.'],
                ['Playful', 'Light, informal, a little humour.'],
                ['Concise & Direct', 'Shortest useful answer, minimal preamble.'],
                ['Empathetic', 'Acknowledges the situation before solving it.'],
                ['Technical / Expert', 'Precise, comfortable with jargon and specifics.'],
                ['Luxury / Premium', 'Restrained, polished, unhurried.'],
                ['Bold / Confident', 'Assertive and decisive.'],
              ],
            },
            {
              t: 'p',
              text: 'You can preview a tone against a real question from the Experience tab before saving it.',
            },
          ],
        },
        {
          id: 'answer-scope',
          heading: 'Answer scope (services)',
          blocks: [
            {
              t: 'p',
              text: 'Listing services constrains the chatbot to those topics. Off-topic questions get a polite decline and a redirect instead of a best-effort answer, useful when your site covers more ground than you want the chatbot fielding.',
            },
            {
              t: 'p',
              text: 'Each service can carry its own URL. When the chatbot mentions that service, its name is rendered with an inline link to that page. There is no single "learn more" line appended at the end. Leave the services list empty to let the chatbot answer from everything you trained it on.',
            },
          ],
        },
        {
          id: 'smart-links',
          heading: 'Smart links',
          blocks: [
            {
              t: 'p',
              text: 'Smart links are keyword-to-URL pairs. When a reply naturally mentions one of your keywords, the chatbot links the phrase to the page you chose. It is how you turn an informational answer into a click.',
            },
            {
              t: 'table',
              head: ['Keyword', 'URL'],
              rows: [
                ['pricing', 'https://example.com/pricing'],
                ['book a demo', 'https://example.com/demo'],
                ['status page', 'https://status.example.com'],
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Links do not widen scope',
              text: 'Smart links only affect how existing answers are rendered. Unlike services, they never restrict or expand what the chatbot may answer.',
            },
          ],
        },
        {
          id: 'suggested-questions',
          heading: 'Suggested questions',
          blocks: [
            {
              t: 'p',
              text: 'The widget can open with up to three one-tap suggestions. OyeChats generates candidates from your content and then checks each one against your own index with a stricter threshold than normal chat, so a suggestion only ships if there is strong content behind it. Candidates that fail the check are dropped. An empty result is a normal outcome for a thin knowledge base, and the widget falls back to a plain input.',
            },
            {
              t: 'p',
              text: 'You can also write the suggestions yourself from the Experience tab. Hand-written suggestions are not verified for answerability, so test them.',
            },
          ],
        },
      ],
    },

    {
      slug: 'testing',
      navLabel: 'Testing',
      title: 'Testing before you launch',
      summary:
        'How to test a chatbot without burning credits or shipping a bad first impression, and what to check before you install it.',
      metaTitle: 'Test Your AI Chatbot Before Going Live',
      metaDescription:
        'Preview conversations, the daily free preview allowance, and a pre-launch checklist for OyeChats chatbots.',
      sections: [
        {
          id: 'preview',
          heading: 'Preview conversations',
          blocks: [
            {
              t: 'p',
              text: 'Every chatbot has a preview chat in the dashboard that behaves exactly like the live widget. Same retrieval, same prompt, same streaming. Preview replies do not consume chat credits.',
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Preview allowance',
              text: 'Free preview replies are capped at 50 per chatbot per day (UTC). Past the cap the preview returns a rate-limit response until the counter resets. Live visitor conversations are unaffected.',
            },
          ],
        },
        {
          id: 'checklist',
          heading: 'Pre-launch checklist',
          blocks: [
            {
              t: 'list',
              ordered: true,
              items: [
                'Ask the ten questions your customers actually ask. Not the ten you wish they asked.',
                'Ask something deliberately outside your content and confirm the chatbot admits it does not know instead of inventing an answer.',
                'Check any figure it quotes. Prices, SLAs, delivery windows. Against the source page.',
                'Test the handoff: ask to speak to a human and confirm the request reaches the right place.',
                'If a lead form is enabled, submit it and confirm the lead appears under **Leads**.',
                'Open the widget on a phone-sized viewport.',
                'Confirm your domain allowlist includes every hostname the widget will load on, including staging.',
              ],
            },
          ],
        },
        {
          id: 'share',
          heading: 'Sharing a demo',
          blocks: [
            {
              t: 'p',
              text: 'Each chatbot has a hosted demo link you can send to a colleague for review before the widget goes on your site. Anyone with the link can chat with it, and those conversations are metered like normal visitor conversations.',
            },
          ],
        },
      ],
    },
  ],
};
