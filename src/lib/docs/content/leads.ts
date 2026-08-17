import type { DocGroup } from '../types';

export const LEADS: DocGroup = {
  slug: 'leads',
  label: 'Leads & qualification',
  description: 'Capturing contact details, scoring intent, and getting qualified leads out to your team.',
  pages: [
    {
      slug: 'capture',
      navLabel: 'Capturing leads',
      title: 'Capturing leads',
      summary:
        'Three ways contact details reach your Leads list, how to configure the form, and what real-time email checking does.',
      metaTitle: 'Capture Leads From Chat Conversations With OyeChats',
      metaDescription:
        'Configure lead capture in OyeChats: the in-chat lead form, conversational capture, offline messages, field configuration and real-time email validation.',
      sections: [
        {
          id: 'how',
          heading: 'Three routes in',
          blocks: [
            {
              t: 'defs',
              items: [
                {
                  term: 'The lead form',
                  text: 'A short in-chat form you enable per chatbot. You choose which fields appear and which are required, up to ten fields.',
                },
                {
                  term: 'Conversationally',
                  text: 'A visitor who types their email or phone number while chatting has it recognised and attached to the conversation — no form required.',
                },
                {
                  term: 'The offline form',
                  text: 'Anyone who leaves a message when no operator is available becomes a lead too. See [Offline messages](/docs/conversations/offline-messages).',
                },
              ],
            },
            {
              t: 'p',
              text: 'However they arrive, one conversation produces at most one lead, so the same visitor asking three questions is one record and not three.',
            },
          ],
        },
        {
          id: 'form',
          heading: 'Configuring the form',
          blocks: [
            {
              t: 'p',
              text: 'Turn it on under **Experience → Lead capture** and pick your fields. Name, email, phone and company are the usual set.',
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'Ask for less than you want',
              text: 'Every required field costs you completions. Email alone converts far better than four mandatory fields, and the chatbot can gather the rest in conversation once the visitor is engaged.',
            },
          ],
        },
        {
          id: 'email-validation',
          heading: 'Real-time email checking',
          blocks: [
            {
              t: 'p',
              text: 'On paid plans the widget checks an email address the moment the visitor leaves the field, before the form can be submitted. It is deliberately lenient: it blocks unambiguous junk — malformed addresses, disposable domains, spam traps, domains with no working mail server — and lets everything else through.',
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'It fails open, by design',
              text: 'Catch-all and inconclusive results are accepted, and if the check is unavailable the form submits normally. Many legitimate businesses run catch-all mail gateways; the check exists to keep fake leads out, not to turn away real visitors.',
            },
            {
              t: 'p',
              text: 'A deeper verification runs in the background on Standard and above, after capture. It costs 10 credits per lead and stores the result on the record. On Free the check does not run at all.',
            },
          ],
        },
        {
          id: 'quotas',
          heading: 'Lead quotas',
          blocks: [
            {
              t: 'p',
              text: 'Free caps how many leads are stored; every paid tier stores an unlimited number. Once a cap is reached, conversations still work — you just stop accumulating new lead records until you upgrade.',
            },
          ],
        },
      ],
    },

    {
      slug: 'qualification',
      navLabel: 'Qualification frameworks',
      title: 'Lead qualification',
      summary:
        'OyeChats reads the conversation and scores how ready the visitor is to buy, using the sales framework you choose.',
      metaTitle: 'AI Lead Qualification: BANT, MEDDIC, CHAMP and GPCTBA',
      metaDescription:
        'How OyeChats scores leads from chat conversations using BANT, MEDDIC, CHAMP or GPCTBA/C&I, including dimensions, weights, behavioural signals and score decay.',
      sections: [
        {
          id: 'what',
          heading: 'What it does',
          blocks: [
            {
              t: 'p',
              text: 'After a conversation ends, OyeChats analyses what the visitor said and scores each dimension of your chosen framework. Those scores combine into one composite score out of 100, and the composite maps to a tier. Nothing is asked of the visitor to make this happen — it is derived from the conversation they already had.',
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Plan availability',
              text: 'Qualification scoring is available from Standard upwards. Every paid tier gets the lead-intelligence layer — score, tier, per-dimension breakdown, location and device, and CSV export. On Free you see the conversation and any contact details, without the scoring layer.',
            },
          ],
        },
        {
          id: 'frameworks',
          heading: 'The four frameworks',
          blocks: [
            {
              t: 'table',
              head: ['Framework', 'Dimensions', 'Best for'],
              rows: [
                [
                  'BANT *(default)*',
                  'Need, Timeline, Authority, Budget',
                  'Most B2B sales. Simple, fast to reason about.',
                ],
                [
                  'MEDDIC',
                  'Identify Pain, Metrics, Economic Buyer, Decision Criteria, Decision Process, Champion',
                  'Complex enterprise deals with several stakeholders.',
                ],
                [
                  'CHAMP',
                  'Challenges, Authority, Money, Prioritization',
                  'Teams that want to lead with the problem rather than the budget.',
                ],
                [
                  'GPCTBA/C&I',
                  'Goals, Plans, Challenges, Timeline, Budget, Authority, Consequences',
                  'Consultative selling where the cost of inaction matters.',
                ],
              ],
            },
            {
              t: 'p',
              text: 'Pick one per chatbot under **Advanced → Qualification**. Each framework ships as an editable preset: you can change dimension weights, turn a dimension off, rewrite the answer options and their scores, and reorder the sequence the chatbot works through.',
            },
          ],
        },
        {
          id: 'scoring',
          heading: 'How the score is built',
          blocks: [
            {
              t: 'steps',
              items: [
                {
                  title: 'Each dimension is scored',
                  text: 'On its own scale, from the conversation content.',
                },
                {
                  title: 'Scores are normalised and weighted',
                  text: 'Each dimension is expressed as a percentage of its own maximum, then weighted. Weights are relative, not required to sum to 100, and disabled dimensions are excluded from the maths entirely.',
                },
                {
                  title: 'The result is a composite out of 100',
                  text: 'Which is what the tier thresholds are compared against.',
                },
              ],
            },
            {
              t: 'code',
              label: 'Default BANT weights',
              code: `Need      25
Timeline  25
Authority 25
Budget    25

Conversation order: Need → Timeline → Authority → Budget`,
            },
          ],
        },
        {
          id: 'cta-pills',
          heading: 'Asking directly, or not',
          blocks: [
            {
              t: 'p',
              text: 'Each dimension can optionally show the visitor a one-tap multiple-choice prompt ("When are you looking to get started?"). Those prompts are **off by default** for every dimension, because most B2B visitors read them as qualification fishing.',
            },
            {
              t: 'p',
              text: 'With them off, scoring still happens — it is inferred from the conversation text after the fact. You get the tier without interrogating the visitor. Turn individual prompts on if you want the faster, more explicit flow.',
            },
          ],
        },
        {
          id: 'behavioral',
          heading: 'Behavioural signals',
          blocks: [
            {
              t: 'p',
              text: 'Alongside what the visitor said, OyeChats scores how they behaved, up to 20 points. This is intent evidence that never appears in the conversation.',
            },
            {
              t: 'table',
              head: ['Signal', 'Points'],
              rows: [
                ['Returning visitor', '5'],
                ['Arrived from a known referrer', '5'],
                ['Viewed several pages', '4'],
                ['Spent significant time on site', '3'],
                ['Carried UTM campaign parameters', '3'],
              ],
            },
          ],
        },
        {
          id: 'decay',
          heading: 'Score decay',
          blocks: [
            {
              t: 'p',
              text: 'Urgency ages. By default the timeline dimension loses 5 points and the need dimension 3 points per 30 days, so a lead that was hot two months ago does not keep sitting at the top of your list. Decay is configurable per framework and can be switched off.',
            },
          ],
        },
        {
          id: 'audit',
          heading: 'Seeing why a score is what it is',
          blocks: [
            {
              t: 'p',
              text: 'Every scoring change is written to an append-only signal log with the dimension, the before and after values, and the source — whether it came from analysing the conversation or from the visitor tapping a prompt. Open any lead to see that trail, and correct a score by hand if the analysis got it wrong.',
            },
          ],
        },
      ],
    },

    {
      slug: 'tiers',
      navLabel: 'Tiers & thresholds',
      title: 'Lead tiers and thresholds',
      summary:
        'The four tiers, the score bands behind them, and what fires when a lead crosses one.',
      metaTitle: 'OyeChats Lead Tiers: Unqualified, MQL, SAL and SQL',
      metaDescription:
        'How OyeChats maps a composite qualification score to the unqualified, MQL, SAL and SQL tiers, how to change the thresholds, and what happens on a tier transition.',
      sections: [
        {
          id: 'tiers',
          heading: 'The four tiers',
          blocks: [
            {
              t: 'table',
              head: ['Tier', 'Default band', 'Reading'],
              rows: [
                ['Unqualified', '0–29', 'Browsing. No sales action warranted.'],
                ['MQL — marketing qualified', '30–54', 'Genuine interest. Worth nurturing.'],
                ['SAL — sales accepted', '55–74', 'Worth a human conversation.'],
                ['SQL — sales qualified', '75–100', 'Real buying intent. Follow up today.'],
              ],
            },
            {
              t: 'p',
              text: 'Thresholds are per chatbot. Raise them if your list is full of leads that do not convert; lower them if your team has capacity for more.',
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'These are the exact values in the API',
              text: 'The tier values sent in webhooks and returned by the API are `unqualified`, `mql`, `sal` and `sql`. Match on those strings rather than on labels like "hot".',
            },
          ],
        },
        {
          id: 'transitions',
          heading: 'What happens on a transition',
          blocks: [
            {
              t: 'p',
              text: 'A tier change is the event worth acting on, so it is the one that fans out:',
            },
            {
              t: 'list',
              items: [
                'The lead moves tier in your Leads list and in **Analytics → Qualification funnel**.',
                'A `tier_transition` [webhook](/docs/integrations/webhook-events) fires, carrying the old tier, new tier, composite score and behavioural score.',
                'Email notification goes to the recipients configured for that chatbot, if qualified-lead emails are on.',
                'Operators watching the Support inbox see the lead surface as qualified.',
              ],
            },
            {
              t: 'callout',
              variant: 'success',
              title: 'This is the CRM hook',
              text: 'One webhook on `tier_transition` filtered to `new_tier: "sql"` is usually the whole integration most teams need. See [Connecting a CRM](/docs/integrations/crm).',
            },
          ],
        },
      ],
    },

    {
      slug: 'visitor-intelligence',
      navLabel: 'Visitor intelligence',
      title: 'Visitor intelligence',
      summary:
        'What OyeChats can infer about a visitor beyond what they typed — and, just as importantly, what it cannot.',
      metaTitle: 'Visitor Intelligence and Company Signals',
      metaDescription:
        'What OyeChats infers about chat visitors from network signals and email domains, which plans include it, and the limits of IP-based company identification.',
      sections: [
        {
          id: 'what',
          heading: 'What you get',
          blocks: [
            {
              t: 'table',
              head: ['Signal', 'Plans', 'Cost'],
              rows: [
                ['Approximate location (city, region, country) and device type', 'All paid tiers', 'Included'],
                ['Page journey and campaign attribution', 'Standard and above', 'Included'],
                ['Background email verification', 'Standard and above', '10 credits per lead'],
                ['Company / network identification from the visitor\'s connection', 'Professional and above', '5 credits, charged only when a company is actually identified'],
              ],
            },
          ],
        },
        {
          id: 'limits',
          heading: 'What it cannot do',
          blocks: [
            {
              t: 'callout',
              variant: 'warn',
              title: 'This is not person-level identification',
              text: 'OyeChats does not tell you which individual visited your site. It does not de-anonymise visitors, and it does not buy identity graph data to try.',
            },
            {
              t: 'p',
              text: 'Company identification works from the network a visitor connects through. That is reliable when someone is on a corporate network that owns its own address space, and unreliable when they are on home broadband, mobile data, a VPN or a coffee-shop connection — which is most people, most of the time. Treat an identified company as a signal, not a fact, and never as the basis for an automated claim to the visitor about who they are.',
            },
            {
              t: 'p',
              text: 'Hosting providers, VPNs and proxies are flagged as such rather than reported as companies, so bot traffic does not show up as a promising enterprise lead.',
            },
          ],
        },
        {
          id: 'privacy',
          heading: 'Privacy',
          blocks: [
            {
              t: 'p',
              text: 'Full IP addresses are never shown in the dashboard, included in an export, or returned by the API — every one of those boundaries strips the address and shows geography only. You are the controller of your visitors\' conversation data and OyeChats is the processor; the split is set out in the [DPA](/legal/dpa) and the [Privacy Policy](/legal/privacy).',
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Tell your visitors',
              text: 'If you enable these features, your own privacy notice should say that chat conversations are processed to derive lead and intent signals. Your consent obligations depend on your jurisdiction and are yours to meet.',
            },
          ],
        },
      ],
    },

    {
      slug: 'export',
      navLabel: 'Working with leads',
      title: 'Working with leads',
      summary: 'Filtering, following up, and getting leads out of OyeChats and into your own systems.',
      metaTitle: 'Export and Follow Up on OyeChats Leads',
      metaDescription:
        'Filter and review leads in OyeChats, send manual follow-up emails, and export leads to CSV with qualification scores and attribution columns.',
      sections: [
        {
          id: 'reviewing',
          heading: 'Reviewing a lead',
          blocks: [
            {
              t: 'p',
              text: 'Opening a lead shows the contact details, the composite score and tier, the per-dimension breakdown with its signal trail, the full transcript, approximate location and device, and the pages the visitor saw. New leads are flagged unread until someone opens them, so nothing sits unnoticed.',
            },
          ],
        },
        {
          id: 'follow-up',
          heading: 'Manual follow-up',
          blocks: [
            {
              t: 'p',
              text: 'You can send a follow-up email to a lead straight from OyeChats. It costs 1 credit, sends from your branded sender with your Reply-To so replies reach your own inbox, and includes a working unsubscribe link.',
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'Follow-up is not a marketing channel',
              text: 'This is for a genuine one-to-one reply to someone who just talked to you. Bulk or repeated unsolicited email through it is a breach of the [Acceptable Use Policy](/legal/aup) and puts sending reputation at risk for everyone.',
            },
            {
              t: 'p',
              text: 'Follow-up sending can be paused per chatbot, and unsubscribes are honoured automatically.',
            },
          ],
        },
        {
          id: 'export',
          heading: 'CSV export',
          blocks: [
            {
              t: 'p',
              text: 'Export from **Leads → Export**, optionally filtered to one chatbot. Available on Starter and above.',
            },
            {
              t: 'table',
              head: ['Columns', 'Included on'],
              rows: [
                [
                  'Session ID, Name, Email, Phone, Company, Score, Status, the four framework dimensions, Location, Device, Messages, Created, Last Active',
                  'Starter and above',
                ],
                ['Source, Medium, Campaign, Referrer, Landing Page, Journey', 'Standard and above'],
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'For a live feed, use webhooks',
              text: 'CSV is a snapshot. If you want leads in your CRM as they qualify, use [webhooks](/docs/integrations/webhooks) or the [REST API](/docs/api/endpoints) instead of exporting on a schedule.',
            },
          ],
        },
      ],
    },
  ],
};
