import type { DocGroup } from '../types';
import { TRIAL_PLAN, capabilitiesTable, limitsTable } from '../plan-matrix';

export const ACCOUNT: DocGroup = {
  slug: 'account',
  label: 'Account & billing',
  description: 'Plans, credits, invoices, your team, and how your data is handled.',
  pages: [
    {
      slug: 'plans',
      navLabel: 'Plans & limits',
      title: 'Plans and limits',
      summary:
        'What a plan actually controls, how limits are enforced, and how to check what your workspace is entitled to right now.',
      metaTitle: 'OyeChats Plans, Limits and Feature Entitlements',
      metaDescription:
        'How OyeChats plan limits and feature entitlements work — chatbots, credits, seats, knowledge size, chat history and gated features.',
      sections: [
        {
          id: 'shape',
          heading: 'What a plan controls',
          blocks: [
            {
              t: 'p',
              text: 'Both tables below are generated from the platform itself — the seeded plan matrix for limits, and the entitlement gates in the services layer for capabilities. They are not restated by hand, so they cannot drift from what your workspace is actually allowed to do.',
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Prices are not here on purpose',
              text: 'Pricing is geo-dependent and lives on the [pricing page](/pricing). These tables cover what each tier *does*, not what it costs.',
            },
            { t: 'h3', text: 'Limits' },
            {
              t: 'p',
              text: '"Unlimited" is a real uncapped value, not a fair-use figure. Credits still meter actual usage, so uncapped ingestion is self-limiting.',
            },
            limitsTable(),
            { t: 'h3', text: 'Capabilities' },
            {
              t: 'p',
              text: 'A capability your plan does not include is visible but disabled in the dashboard, and its API endpoints return 403 with a `feature_not_available` code naming the feature.',
            },
            capabilitiesTable(),
          ],
        },
        {
          id: 'enforcement',
          heading: 'How limits behave when you hit them',
          blocks: [
            {
              t: 'list',
              items: [
                'Hitting a **knowledge** cap blocks further ingestion for that chatbot. It never truncates a document silently.',
                'Hitting the **lead** cap stops new lead records accumulating. Conversations keep working.',
                'Running out of **credits** stops metered actions — see [Credits](/docs/account/credits) for exactly which.',
                'A **locked feature** is visible but disabled in the dashboard, and its API endpoints return 403 with a machine-readable `feature_not_available` code.',
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Check entitlements programmatically',
              text: '`GET /auth/me/entitlements` returns your resolved limits, feature flags and current usage. Branch on that rather than on a plan name — plan names change, entitlements are the contract.',
            },
          ],
        },
        {
          id: 'trial',
          heading: 'The trial',
          blocks: [
            {
              t: 'p',
              text: `There is a ${TRIAL_PLAN ? `${TRIAL_PLAN.days}-day trial of the ${TRIAL_PLAN.name} tier, with full ${TRIAL_PLAN.name} features. It is the only trial offered — the other tiers do not carry one` : 'no trial on any tier'}. Free is not a trial; it is a permanent tier with a small allowance and no card required.`,
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'What happens after an unconverted trial',
              text: 'A trial that ends without a subscription has a short grace window, after which the chatbots, knowledge base and conversations created under it are deleted. Export anything you need before the window closes.',
            },
          ],
        },
        {
          id: 'changing',
          heading: 'Changing plan',
          blocks: [
            {
              t: 'list',
              items: [
                'Upgrade or downgrade from **Workspace → Billing**.',
                'A downgrade applies your new, lower limits — if you are over one of them, resolve that before switching.',
                'A scheduled change can be cancelled from the same screen before it takes effect.',
                'Extra operator seats are billed as a separate add-on and can be adjusted independently of the plan.',
              ],
            },
          ],
        },
      ],
    },

    {
      slug: 'credits',
      navLabel: 'Credits',
      title: 'Credits',
      summary:
        'One unit meters everything OyeChats does on your behalf. This page lists exactly what costs what.',
      metaTitle: 'OyeChats Credits: Costs, Top-Ups and Running Out',
      metaDescription:
        'How OyeChats credits work: cost per AI reply, per crawled page and per uploaded document, monthly allowances, top-ups, and what stops at zero.',
      sections: [
        {
          id: 'costs',
          heading: 'What costs credits',
          blocks: [
            {
              t: 'table',
              head: ['Action', 'Credits'],
              rows: [
                ['AI reply to a visitor', '1'],
                ['Crawled page indexed', '5'],
                ['Uploaded document', '1 per 250 words, minimum 1 per file'],
                ['Follow-up email sent from OyeChats', '1'],
                ['Background email verification of a lead', '10'],
                ['Visitor company / network identification', '5, charged only when a company is actually identified'],
              ],
            },
            { t: 'h3', text: 'What is free' },
            {
              t: 'list',
              items: [
                'Preview conversations from the dashboard, up to 50 per chatbot per day.',
                'Automatic weekly re-crawls — funded by your subscription. A **manual** re-crawl is metered: on Standard and above you can re-crawl updated pages only, otherwise a manual re-crawl charges for every page. See [Training](/docs/chatbot/knowledge).',
                'Live chat with a human operator. Operator capacity is billed as seats, not credits.',
                'Reading anything: dashboard, analytics, exports, API reads.',
                'The real-time email format check on the lead form.',
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Costs are platform settings',
              text: 'Credit costs are configurable on the platform side and the values above are the current defaults. Your dashboard always shows the rate you are actually charged, and cost previews are quoted before you commit to a crawl or an upload.',
            },
          ],
        },
        {
          id: 'estimating',
          heading: 'Estimating your usage',
          blocks: [
            {
              t: 'p',
              text: 'The arithmetic is simple enough to do in your head. Two components: a one-off training cost, then a recurring conversation cost.',
            },
            {
              t: 'code',
              label: 'Worked example',
              code: `Training a 300-page site
  300 pages × 5 credits                 = 1,500 credits  (one-off)

Monthly conversations
  400 conversations × ~4 replies each   = 1,600 credits / month

Optional extras
  50 leads verified × 10                =   500 credits / month`,
            },
            {
              t: 'p',
              text: 'Before you commit, both crawl and upload flows show an estimate. **Workspace → Usage** shows what you have actually spent, by day and by action.',
            },
          ],
        },
        {
          id: 'running-out',
          heading: 'Running out',
          blocks: [
            {
              t: 'p',
              text: 'You are warned as your balance gets low — the default threshold is 20% remaining. At zero the chat endpoint returns a `402` with `insufficient_credits` rather than an answer, and the widget surfaces that to the visitor:',
            },
            {
              t: 'table',
              head: ['Stops', 'Keeps working'],
              rows: [
                ['AI replies to visitors', 'Live chat with your operators'],
                ['New crawls and uploads', 'The offline message form'],
                ['Metered enrichment', 'The dashboard, analytics and exports'],
                ['Follow-up emails', 'Everything already indexed and recorded'],
              ],
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'The widget does not vanish',
              text: 'A visitor arriving at a chatbot with no credits can still reach a human or leave a message. They just do not get an AI answer. Nothing is deleted.',
            },
          ],
        },
        {
          id: 'topups',
          heading: 'Top-ups',
          blocks: [
            {
              t: 'p',
              text: 'Buy extra credits any time from **Workspace → Usage**, in packs, with larger packs carrying bonus credits. Available on Starter and above; current packs and pricing are shown in the dashboard.',
            },
            {
              t: 'list',
              items: [
                'Top-up credits do not expire — they carry forward indefinitely.',
                'Your monthly allowance is consumed before your top-up balance, so buying early never wastes credits.',
                'Every grant and deduction is recorded in an append-only ledger you can read in full from **Workspace → Usage** or `GET /credits/history`.',
              ],
            },
          ],
        },
      ],
    },

    {
      slug: 'billing',
      navLabel: 'Billing & invoices',
      title: 'Billing and invoices',
      summary:
        'Currency, tax, invoices, what happens when a payment fails, and how cancellation actually works.',
      metaTitle: 'Billing, GST Invoices and Cancellation',
      metaDescription:
        'How OyeChats billing works — payment methods, GST-compliant invoices, failed payment grace periods, cancellation, reactivation and refunds.',
      sections: [
        {
          id: 'payments',
          heading: 'Paying',
          blocks: [
            {
              t: 'p',
              text: 'Payments are processed by Razorpay. Card, UPI and net-banking mandates are supported for recurring billing; the available methods depend on your country. Card numbers, UPI handles and bank details are handled entirely by the payment provider and never reach OyeChats servers — we store only the brand and last four digits so you can tell your instruments apart.',
            },
            {
              t: 'p',
              text: 'Monthly and annual cycles are both offered, with a discount on annual. Indian customers are billed in INR; international pricing is a separate USD price list rather than a converted figure. See the [pricing page](/pricing) for current amounts.',
            },
          ],
        },
        {
          id: 'invoices',
          heading: 'Invoices and GST',
          blocks: [
            {
              t: 'list',
              items: [
                'Every charge produces a numbered invoice with a PDF, under **Workspace → Billing**.',
                'Invoices are emailed when they are issued.',
                'Indian GST is computed and shown on the invoice, with the CGST/SGST or IGST split determined by place of supply.',
                'Displayed prices are GST-inclusive: the tax is broken out on the invoice rather than added on top at checkout.',
                'Add your GSTIN and billing address under **Workspace → Billing** before your first charge so they appear on the invoice from the start.',
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Fix billing details early',
              text: 'A GSTIN added after an invoice is issued does not retroactively change that invoice. Enter it before you first subscribe if you need it for input credit.',
            },
          ],
        },
        {
          id: 'failed',
          heading: 'When a payment fails',
          blocks: [
            {
              t: 'steps',
              items: [
                {
                  title: 'The subscription goes past due',
                  text: 'Your workspace keeps full access during this window — nothing is cut off while the payment is being recovered.',
                },
                {
                  title: 'The provider retries',
                  text: 'Razorpay runs its own retry sequence against your mandate. You are notified, with a link to fix the payment method.',
                },
                {
                  title: 'The grace window ends',
                  text: 'After roughly a week without a successful payment the subscription expires and plan gates apply. Your data is not deleted.',
                },
              ],
            },
            {
              t: 'p',
              text: 'Recovering the payment restores access without you having to re-subscribe.',
            },
          ],
        },
        {
          id: 'cancelling',
          heading: 'Cancelling',
          blocks: [
            {
              t: 'p',
              text: 'Cancel from **Workspace → Billing**. Cancellation takes effect at the end of the period you have already paid for; you keep full access until then.',
            },
            {
              t: 'callout',
              variant: 'success',
              title: 'Changing your mind is free',
              text: 'Until close to the period end, cancellation is a reversible intent — reactivating restores your subscription at no cost. Only near the end of the period does the cancellation become final with the payment provider, because mandates cannot be un-cancelled once withdrawn.',
            },
            {
              t: 'p',
              text: 'After a cancellation takes effect the workspace falls back to Free limits. Refund eligibility is set out in the [Refund Policy](/legal/refund) and the [Cancellation Policy](/legal/cancellation).',
            },
          ],
        },
        {
          id: 'affiliate',
          heading: 'Referrals',
          blocks: [
            {
              t: 'p',
              text: 'OyeChats runs a referral programme: you get a code, share it, and earn on the workspaces that sign up through it. Codes, referral status and earnings live under **Workspace → Affiliate**.',
            },
          ],
        },
      ],
    },

    {
      slug: 'team',
      navLabel: 'Team & access',
      title: 'Team and access',
      summary: 'Inviting people, what each role can do, signing in, and account security.',
      metaTitle: 'OyeChats Team Management, Roles and Account Security',
      metaDescription:
        'Invite teammates to your OyeChats workspace, understand owner, admin and operator roles, manage sign-in options and secure your account.',
      sections: [
        {
          id: 'invites',
          heading: 'Inviting people',
          blocks: [
            {
              t: 'p',
              text: 'Invite from **Workspace → Members**. The invitee gets an email, accepts, and sets a password. Pending invites can be resent or revoked, and one login can belong to several workspaces — useful for agencies and contractors.',
            },
            {
              t: 'p',
              text: 'Roles are described in [Operators and seats](/docs/conversations/operators). In short: owner can do everything including billing, admin can configure but not bill, operator can only handle conversations and view leads.',
            },
          ],
        },
        {
          id: 'sign-in',
          heading: 'Signing in',
          blocks: [
            {
              t: 'list',
              items: [
                'Email and password, or Continue with Google.',
                'Email verification is required before you can train or publish a chatbot.',
                'Password reset by email; repeated failed sign-in attempts are throttled.',
                'Changing your account email requires confirming the new address before the change applies.',
                'Operators sign in with their own credentials, separate from the workspace owner\'s.',
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Google sign-in scope',
              text: 'OyeChats requests only your name, email address and profile picture. It does not request access to Gmail, Drive, Calendar or any other Google service.',
            },
          ],
        },
        {
          id: 'security',
          heading: 'Keeping the account safe',
          blocks: [
            {
              t: 'list',
              items: [
                'Treat your API key as a full-access credential. Rotate it if it has ever been pasted anywhere you would not paste a password.',
                'Remove operators who leave — deactivating them ends their access and frees their seat.',
                'Set the [domain allowlist](/docs/widget/security) on every chatbot so your bot key cannot be used on someone else\'s site.',
                'Administrative actions in the workspace are recorded in an audit log.',
              ],
            },
            {
              t: 'p',
              text: 'To report a security issue, follow the [responsible disclosure policy](/legal/security). Please do not report vulnerabilities through the public support inbox.',
            },
          ],
        },
      ],
    },

    {
      slug: 'privacy',
      navLabel: 'Data & privacy',
      title: 'Data and privacy',
      summary:
        'What OyeChats stores, who is the controller of what, how long things are visible, and how deletion works. The binding detail is in the legal documents this page links to.',
      metaTitle: 'OyeChats Data Handling, Retention and Privacy',
      metaDescription:
        'What data OyeChats stores about your workspace and your visitors, the controller/processor split, retention windows, deletion and sub-processors.',
      sections: [
        {
          id: 'roles',
          heading: 'Who controls what',
          blocks: [
            {
              t: 'p',
              text: 'For your **visitors\'** conversation data, you are the controller and OyeChats is the processor acting on your instructions. For **your own account** data — your login, your billing, your usage — OyeChats is the controller. The [DPA](/legal/dpa) sets out the processor terms and is incorporated into the [Terms of Service](/legal/terms).',
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'Your notice, your obligation',
              text: 'Because you are the controller of visitor conversations, telling your visitors that a chatbot processes their messages — and obtaining consent where your jurisdiction requires it — is your responsibility, not ours.',
            },
          ],
        },
        {
          id: 'stored',
          heading: 'What is stored',
          blocks: [
            {
              t: 'table',
              head: ['Category', 'Examples'],
              rows: [
                ['Account', 'Name, work email, hashed password, workspace and role.'],
                ['Chatbot configuration', 'Prompt, appearance, business hours, and the knowledge base you supplied.'],
                ['Conversations', 'Messages, timestamps, lead form submissions and derived qualification signals.'],
                ['Visitor metadata', 'IP address, browser and device type, approximate location, the page the widget loaded on, referrer and UTM parameters.'],
                ['Operator data', 'Names, emails, roles, activity logs and push notification tokens.'],
                ['Billing', 'Plan, cycle, invoice history, and the brand plus last four digits of the payment instrument.'],
              ],
            },
            {
              t: 'p',
              text: 'Full IP addresses are recorded because geolocation, abuse prevention and repeat-visit detection are performed against them, but they are stripped at every boundary you can see — dashboard, export and API all return geography only.',
            },
          ],
        },
        {
          id: 'retention',
          heading: 'Retention and deletion',
          blocks: [
            {
              t: 'defs',
              items: [
                {
                  term: 'Chat history window',
                  text: 'Your plan governs how far back the dashboard and analytics show conversations. This is a visibility window: reaching the end of it does not by itself delete the underlying records.',
                },
                {
                  term: 'Deleting content',
                  text: 'Removing a document or page from a knowledge base removes it and its indexed passages. Deleting a chatbot removes its knowledge base, conversations and leads.',
                },
                {
                  term: 'Expired trials',
                  text: 'A trial that ends without converting has its chatbots, knowledge and conversations deleted after a short grace window.',
                },
                {
                  term: 'Account deletion',
                  text: 'Request full deletion of a workspace and its data via support. Retention required for statutory purposes — invoices, tax records — is described in the [Privacy Policy](/legal/privacy).',
                },
              ],
            },
          ],
        },
        {
          id: 'subprocessors',
          heading: 'Sub-processors and security',
          blocks: [
            {
              t: 'p',
              text: 'OyeChats uses third-party providers for model inference, hosting, storage, email delivery, payments and error monitoring. The current list, with what each one processes and where, is published at [Sub-processors](/legal/subprocessors).',
            },
            {
              t: 'p',
              text: 'Security practices are described on the [Security](/security) page. Vulnerability reports go through [responsible disclosure](/legal/security).',
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Cookies',
              text: 'The widget stores a small amount of data in the visitor\'s browser so a conversation survives a page reload. Details, and what to declare in your own cookie notice, are in the [Cookie Policy](/legal/cookies).',
            },
          ],
        },
      ],
    },
  ],
};
