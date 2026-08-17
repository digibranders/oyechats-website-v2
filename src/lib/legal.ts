export type LegalPage = {
  slug: string;
  /** Visible H1 on the document page, and the card heading on /legal. */
  title: string;
  /** Visible card body on /legal. Never used as the meta description — several
   *  are far shorter than a SERP snippet wants, and lengthening them would
   *  change on-page content. */
  description: string;
  /** `<title>` only. `title` alone yields e.g. "Cookie Policy · OyeChats" at 24
   *  characters against a ~60 character budget. */
  metaTitle: string;
  /** `<meta name="description">` only. Kept separate from the visible card copy. */
  metaDescription: string;
  lastUpdated: string;
  sections: { id: string; heading: string; body: string[] }[];
};

/**
 * Statutory identity lives in `lib/entity.ts`, shared with the footer and the
 * contact page. That module documents which values are still unresolved and why.
 *
 * The renderer (`components/site/LegalDocument.tsx`) emits these strings as
 * plain text — no markdown, no links, no emphasis — so keep interpolations
 * inside ordinary prose.
 */
import { ENTITY, REGISTERED_ADDRESS } from '@/lib/entity';

const OFFICER = ENTITY.grievanceOfficer;

/** Repeated verbatim in Privacy, Terms and the DPA — one string, one truth. */
const ENTITY_PREAMBLE =
  `OyeChats is a brand of ${ENTITY.legalName} (CIN ${ENTITY.cin}), a company incorporated in India with its registered office at ${REGISTERED_ADDRESS}.`;

/**
 * The Service definition, shared by Privacy and Terms so the two can never
 * disagree about what is in scope. The Android application was missing from
 * both for as long as it has existed, which also puts the Play Store Data
 * Safety declaration out of step.
 */
const SERVICE_SCOPE =
  'our website at oyechats.com, the customer dashboard at app.oyechats.com, our REST and WebSocket APIs, the OyeChats mobile application for operators, and the embeddable chat widget our customers deploy on their own websites';

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: 'privacy',
    metaTitle: 'Privacy Policy: How OyeChats Handles Your Data',
    metaDescription:
      'How OyeChats collects, uses, stores, shares and protects your data, including visitor chat transcripts, retention periods and your rights as a data subject.',
    title: 'Privacy Policy',
    description: 'OyeChats Privacy Policy, how we collect, use, store, share, and protect your data.',
    lastUpdated: '2026-08-17',
    sections: [
      { id: 'introduction', heading: 'Introduction', body: [
        `OyeChats ("OyeChats," "we," "us," or "our") operates the OyeChats platform, including ${SERVICE_SCOPE} (collectively, the "Service"). ${ENTITY_PREAMBLE}`,
        'This Privacy Policy describes how we collect, use, store, share, and protect personal information when you interact with the Service, whether you are a customer who has signed up for an OyeChats account, an end user ("Visitor") chatting with a bot on a customer\'s website, or simply browsing oyechats.com. By using the Service, you agree to the practices described here.',
      ]},
      { id: 'our-role', heading: 'Our Role: Controller vs. Processor', body: [
        'Privacy law distinguishes between data "controllers" (who decide why and how data is processed) and "processors" (who handle data on a controller\'s instructions). Our role differs depending on whose data is involved:',
        '- Customer data: Where you have signed up for an OyeChats account, we act as the controller of the data we collect from you to operate, bill for, and improve the Service.',
        '- Visitor data: Where a Visitor interacts with a bot on a customer\'s website, our customer is the controller of that conversation data and we act as a processor on their behalf, governed by the Data Processing Addendum incorporated into our Terms of Service.',
        'If you are a Visitor with questions about how a specific customer uses your data, please contact that customer directly. We will assist with verified requests forwarded by the controller.',
      ]},
      { id: 'information-we-collect', heading: 'Information We Collect', body: [
        'We collect the following categories of information:',
        '- Account data: Name, work email address, organization name, hashed password, account role, and optionally a website URL when you register or invite team members. If you choose to sign in with Google, we receive the name, email address, and profile picture associated with that Google account. We request only the openid, email, and profile scopes; we do not request access to your Gmail, Drive, Calendar, or any other Google service.',
        '- Bot configuration: Bot name, system prompt, appearance settings, business hours, and the knowledge base content (documents you upload or URLs you ask us to crawl).',
        '- Conversation data: Chat messages between Visitors and the bot or live operators, timestamps, lead-capture form submissions (name, email, phone, company), and qualification signals derived from the conversation.',
        '- Visitor metadata: The Visitor\'s IP address, browser and device type, approximate geographic location (city, region, and country) derived from that address, the page URL the widget loaded on, referrer, and UTM campaign parameters. The IP address is recorded in full because it is what geolocation, abuse prevention, and deduplication of repeat visits are performed against. It is never shown in the dashboard, included in a CSV export, or returned by our API: every one of those boundaries strips it and shows only the geography.',
        '- Derived IP intelligence: From the Visitor\'s IP address we look up the organization or network that owns it, its autonomous system, and whether it is associated with a hosting provider, VPN, proxy, or known abusive traffic. These are inferred network signals, not a confirmed identification of a Visitor or their employer, and they are frequently wrong about individuals connecting through a consumer internet provider.',
        '- Email verification results: Where a Visitor submits an email address through a lead-capture form on a plan that includes verification, we check that address against a third-party deliverability service and store the result (valid, invalid, disposable, or unknown) alongside the lead. The check confirms whether an address can receive mail; it does not retrieve any information about the person behind it.',
        '- Operator data: For customers using live chat, the names, emails, roles, and activity logs of human operators assigned to handle visitor conversations, plus browser and mobile push notification tokens for the operators who opt in to notifications.',
        '- Usage and diagnostic data: Feature usage counters, API request volumes, error stack traces, performance metrics, and audit logs of administrative actions.',
        '- Billing data: Plan tier, billing cycle, invoice history, and the last four digits and brand of the payment instrument. Full card numbers, UPI handles, and bank account details are processed and stored by our payment provider, Razorpay, and never reach our servers.',
        '- Communications: Contents of emails or support tickets you send us.',
      ]},
      { id: 'how-we-use', heading: 'How We Use Your Information', body: [
        'We use the information described above for the following purposes:',
        '- Provide, maintain, and operate the Service, including running the retrieval-augmented generation pipeline that answers Visitor questions from your knowledge base.',
        '- Authenticate users, enforce plan limits, and prevent abuse.',
        '- Generate lead-qualification signals (BANT scoring) and surface those signals to the customer who owns the conversation.',
        '- Derive geography and network signals from a Visitor\'s IP address, so the customer who owns the conversation can see where an enquiry came from and can distinguish genuine enquiries from automated and abusive traffic.',
        '- Verify the deliverability of email addresses submitted through lead-capture forms, so customers do not send follow-up mail to mistyped or disposable addresses.',
        '- Send transactional emails such as account verification, password resets, billing notifications, and webhook failure alerts, and deliver push notifications to operators who have opted in.',
        '- Process payments, issue invoices, and meet tax and accounting obligations.',
        '- Monitor platform health, debug errors, and investigate security incidents.',
        '- Improve the Service through aggregated, anonymized analytics. We do not use Customer or Visitor conversation content to train large language models, ours or any third party\'s.',
        '- Comply with applicable law and respond to lawful requests from public authorities.',
      ]},
      { id: 'legal-bases', heading: 'Legal Bases for Processing', body: [
        'If you are in the European Economic Area or United Kingdom, we rely on the following legal bases under the GDPR / UK GDPR:',
        '- Performance of a contract: to deliver the Service you have signed up for.',
        '- Legitimate interests: to secure the Service, prevent abuse, debug errors, and conduct aggregated analytics, balanced against your rights and freedoms.',
        '- Consent: where required (for example, non-essential cookies on our marketing site). You may withdraw consent at any time.',
        '- Legal obligation: to retain billing records, respond to lawful authority requests, and meet tax requirements.',
        'If your data is processed under India\'s Digital Personal Data Protection Act, 2023, note that the Act does not provide a legitimate-interest basis. Processing of personal data under that Act is carried out on the basis of consent, or on one of the legitimate uses the Act specifies. Where OyeChats acts as a processor for a customer, that customer is responsible for obtaining the notice and consent the Act requires from its Visitors before the widget collects their data.',
      ]},
      { id: 'sub-processors', heading: 'Sub-processors and Data Sharing', body: [
        'We do not sell your personal information. We share data only with the sub-processors and partners we engage to deliver the Service, each under written agreements that require equivalent protections. Categories of sub-processors include cloud infrastructure and hosting, AI model providers, web crawling and content extraction, IP and email intelligence, transactional email and push notification delivery, payment processing, and observability tooling.',
        'The current, itemized list, including each provider\'s name, purpose, and location, is maintained on our Subprocessors List page.',
        'We may add or change sub-processors from time to time. Material changes affecting how Customer data is handled will be communicated via email or in-product notice with at least 30 days\' advance notice where reasonably possible. We may also disclose information when required by law, to protect the rights, property, or safety of OyeChats, our customers, or others, or in connection with a corporate transaction such as a merger or acquisition, in which case we will notify affected customers.',
      ]},
      { id: 'international-transfers', heading: 'International Data Transfers', body: [
        'OyeChats is operated from India and uses sub-processors located in India, the United States, the European Union, and other jurisdictions. Where personal data is transferred out of the EEA, UK, or India, we rely on appropriate safeguards such as the European Commission\'s Standard Contractual Clauses, the UK International Data Transfer Addendum, or equivalent mechanisms permitted under the Digital Personal Data Protection Act, 2023. A copy of the relevant transfer mechanism is available on request.',
      ]},
      { id: 'data-retention', heading: 'Data Retention', body: [
        'We retain personal information only as long as needed for the purposes described in this policy:',
        '- Account data: Retained for the life of the account and deleted (or anonymized) within 30 days of account closure, except where longer retention is required by law.',
        '- Conversation history: Your plan determines how far back conversation history remains available to you, 7 days on Free, 30 days on Starter, 90 days on Standard, and 365 days on Professional. Conversation data older than your plan window is no longer accessible through the dashboard, exports, or the API. It is not automatically deleted from our database at the end of that window; it is deleted when you close your account, or earlier on request as described below.',
        '- Trial accounts: Conversation and knowledge base data created during a free trial that does not convert to a paid plan is deleted 15 days after the trial ends.',
        '- Knowledge base content: Retained until you delete it or close your account.',
        '- Visitor behavioural events (page views, return visits, campaign parameters): Retained for up to 180 days.',
        '- Diagnostic and error logs: Retained for up to 90 days.',
        '- Audit logs of administrative actions: Retained for up to 12 months.',
        '- Push notification tokens: Retained until the operator disables notifications, uninstalls the app, or the token is rejected as stale by the delivery provider.',
        '- Billing records and invoices: Retained for the period required under applicable tax and accounting law, typically 7 years.',
        '- Backups: Encrypted database backups are retained for up to 30 days before automatic rotation.',
        'You may request deletion of Visitor or account data at any time by writing to support@oyechats.com from the email address associated with your account. Requests are honored within 30 days unless a legal hold applies. Deletion is currently handled by our team on request rather than through a self-service control in the dashboard.',
      ]},
      { id: 'security', heading: 'Security', body: [
        'We apply technical and organizational measures designed to protect personal information against unauthorized access, alteration, disclosure, or destruction. These include encryption in transit (TLS 1.3 for all API and widget traffic), encryption at rest for primary databases and object storage, logical isolation of each customer\'s data, role-based access controls on production systems, audit logging of administrative actions, and dedicated environments for production and non-production workloads. Production access is restricted to a small number of authorized personnel under multi-factor authentication.',
        'No system can be guaranteed perfectly secure. If you discover a vulnerability, please report it under our Security and Responsible Disclosure Policy, which sets out where to send a report, our safe-harbour commitment, and what is in and out of scope.',
      ]},
      { id: 'data-breach', heading: 'Data Breach Notification', body: [
        'If we become aware of a personal data breach that is likely to result in a risk to the rights and freedoms of affected individuals, we will notify our customers without undue delay. Customers are responsible for notifying their own Visitors and any applicable regulators in respect of Visitor data, with our reasonable assistance.',
        'Where the GDPR or UK GDPR applies, we will notify the relevant supervisory authority within 72 hours of becoming aware where required.',
        'Where India\'s Digital Personal Data Protection Act, 2023 applies to us as a Data Fiduciary, we will give the Data Protection Board of India and each affected Data Principal intimation of the breach without delay, and follow it with the detailed report the Act and its rules require. These are separate obligations from the GDPR timeline above, and we treat them as such rather than relying on one to satisfy the other.',
      ]},
      { id: 'your-rights', heading: 'Your Rights', body: [
        'Depending on where you live, you have rights over your personal information. We honor verified requests regardless of residency wherever practical.',
        'If you are in the EEA, UK, or Switzerland (GDPR / UK GDPR): the rights to access, rectification, erasure, restriction of processing, data portability, and objection; the right not to be subject to solely automated decision-making with significant effects; and the right to lodge a complaint with your local supervisory authority.',
        'If you are a California resident (CCPA / CPRA): the rights to know what we collect, to delete personal information, to correct inaccurate information, to opt out of any sale or sharing of personal information (we do not sell or share for cross-context behavioral advertising), and to limit the use of sensitive personal information.',
        'If you are in India (DPDP Act, 2023): the rights to obtain a summary of personal data processed, to correction and erasure, to nominate another individual to exercise your rights in case of incapacity, and to grievance redressal.',
        'To exercise any of these rights, write to support@oyechats.com from the email associated with your account, or contact our Grievance Officer using the details below. We will acknowledge your request within 2 business days and respond within 30 days.',
      ]},
      { id: 'childrens-privacy', heading: 'Children\'s Privacy', body: [
        'OyeChats is intended for use by businesses and is not directed to children. We do not knowingly collect personal information from children under the age of 16 (or under 18 where required by local law, including India under the DPDP Act). If you believe a child has provided us personal information, please contact us and we will delete it.',
        'Because our customers choose where to deploy the chat widget, they are responsible for not deploying it to an audience they know or ought to know consists of children, and for obtaining verifiable parental consent where their own law requires it. This obligation is set out in our Terms of Service.',
      ]},
      { id: 'cookies', heading: 'Cookies and Similar Technologies', body: [
        'We use a small number of strictly necessary cookies on oyechats.com and the customer dashboard for session management, authentication, and CSRF protection, plus an analytics category on the marketing site that runs only with your permission where consent is required. We do not use third-party advertising or cross-site tracking cookies on our own properties.',
        'The embeddable chat widget sets a first-party cookie on the customer\'s own domain to keep a conversation continuous when a Visitor moves between subdomains, and reads and writes short-lived cookies to work out which domain to scope it to. For the full breakdown of every cookie, including names, lifetimes, and how to control them, see our Cookie Policy.',
      ]},
      { id: 'ai-outputs', heading: 'AI-Generated Content', body: [
        'Answers shown to Visitors are generated by large language models from the customer\'s own knowledge base. Model outputs are probabilistic and can be incomplete or incorrect even when the underlying source material is accurate. Conversation messages and the retrieved knowledge base passages needed to answer them are sent to our AI model providers at query time. We do not authorize those providers to use Customer or Visitor data to train general-purpose foundation models.',
        'Where the EU AI Act applies, OyeChats is the provider of the AI system and our customer is its deployer. The widget identifies itself as an automated assistant to Visitors, and our Terms of Service prohibit customers from configuring a bot to conceal that it is automated.',
      ]},
      { id: 'automated-decisions', heading: 'Automated Decision-Making', body: [
        'OyeChats generates qualification signals (BANT scoring), conversation summaries, and derived IP and email signals using large language models and third-party data services. These outputs are decision-support information for the customer who owns the conversation; they do not by themselves produce legal or similarly significant effects on a Visitor. Customers remain responsible for any subsequent decisions they take based on these signals.',
      ]},
      { id: 'third-party-links', heading: 'Third-Party Links', body: [
        'Our website and the chat widget may contain links to third-party sites or content provided by our customers. We are not responsible for the privacy practices of those third parties. You should review their privacy policies independently.',
      ]},
      { id: 'changes', heading: 'Changes to This Policy', body: [
        'We may update this Privacy Policy from time to time to reflect changes in our practices, the Service, or applicable law. The "Last updated" date at the top of this page indicates when it was last revised. Material changes will be communicated via email to account administrators or via in-product notice at least 30 days in advance where reasonably possible.',
      ]},
      { id: 'contact', heading: 'Contact Us and Grievance Redressal', body: [
        `For privacy questions, requests, or complaints, you may contact our Grievance Officer, who also serves as our data protection contact for the purposes of the Digital Personal Data Protection Act, 2023:`,
        `- ${OFFICER.title}: ${OFFICER.name}`,
        `- Email: ${OFFICER.email}`,
        `- Phone: ${OFFICER.phone}`,
        `- Postal address: ${ENTITY.legalName}, ${REGISTERED_ADDRESS}`,
        'We acknowledge grievances within 2 business days and aim to resolve them within 30 days.',
        'For general enquiries and technical support, write to support@oyechats.com. For security reports, follow our Security and Responsible Disclosure Policy.',
        'If you are in the EEA or UK and we do not resolve your concern, you may lodge a complaint with your local data protection authority. If you are in India, you may approach the Data Protection Board of India after first raising the matter with our Grievance Officer above.',
      ]},
    ],
  },
  {
    slug: 'terms',
    metaTitle: 'Terms of Service: Platform Agreement',
    metaDescription:
      'The legal agreement governing your use of the OyeChats platform: account terms, acceptable use, AI outputs, billing, liability, and termination.',
    title: 'Terms of Service',
    description: 'OyeChats Terms of Service, the legal agreement governing your use of the platform.',
    lastUpdated: '2026-08-17',
    sections: [
      { id: 'introduction', heading: 'Introduction', body: [
        `These Terms of Service (the "Agreement") form a binding contract between ${ENTITY.legalName}, trading as OyeChats ("OyeChats," "we," "us," or "our"), and the entity or person agreeing to them ("Customer," "you," or "your"). ${ENTITY_PREAMBLE}`,
        `The Agreement governs your access to and use of the OyeChats platform, including ${SERVICE_SCOPE} (collectively, the "Services"). By signing up for an account, clicking "I agree," or otherwise using the Services, you confirm that you have read, understood, and agree to be bound by this Agreement. If you are agreeing on behalf of an organization, you represent that you have authority to bind that organization to this Agreement.`,
      ]},
      { id: 'definitions', heading: 'Definitions', body: [
        '- "Account" means the account you create to access and administer the Services.',
        '- "Bot" means a chatbot instance you configure on the platform, identified by a unique bot key.',
        '- "Customer Data" means all data, content, and information that you, your Authorized Users, or your Visitors submit to or generate through the Services.',
        '- "Authorized User" means an employee, contractor, or operator you authorize to access the Services on your behalf.',
        '- "Visitor" means an end user who interacts with a Bot on a website where you have deployed the widget.',
        '- "Documentation" means the product and developer documentation OyeChats publishes for the Services at oyechats.com and in the customer dashboard, as updated from time to time. Marketing material, blog posts, roadmap statements, and support correspondence are not Documentation.',
        '- "Output" means text, summaries, qualification signals, and other content generated by the Services using a large language model.',
        '- "Order" means the online sign-up, in-product upgrade flow, or written order form by which you subscribe to a plan.',
        '- "Subscription Term" means the period for which a plan is in effect under an Order.',
        '- "Third Party Apps" means software, integrations, or services provided by a party other than OyeChats that interoperate with the Services.',
      ]},
      { id: 'oyechats-services', heading: 'OyeChats Services and Acceptable Use', body: [
        'Subject to your compliance with this Agreement and timely payment of fees, OyeChats grants you a non-exclusive, non-transferable, worldwide right during the Subscription Term to access and use the Services for your internal business purposes.',
        'You will not, and will not permit any Authorized User or third party to:',
        '- Use the Services to send spam, malware, or content that is unlawful, infringing, harassing, or otherwise objectionable.',
        '- Reverse-engineer, decompile, or attempt to extract the source code of the Services, except to the extent applicable law expressly permits.',
        '- Resell, sublicense, or make the Services available to any third party other than your Authorized Users and the Visitors interacting with your Bots.',
        '- Access the Services to build a competing product or to benchmark performance for publication without our prior written consent.',
        '- Exceed documented rate limits, evade plan limits, or use the Services in a way that imposes a disproportionate load on our infrastructure.',
        '- Misrepresent the Bot\'s identity to Visitors. Bots must be reasonably identifiable as automated, in accordance with applicable law, and you will not configure or modify a Bot so as to conceal or suppress that disclosure.',
        '- Attempt to extract another customer\'s system prompt, knowledge base, or conversation data, whether through prompt injection or any other means.',
        '- Deploy a Bot to an audience you know or ought reasonably to know consists of children, unless you have obtained the parental consent your applicable law requires.',
        'The full and current list of prohibited uses is set out in our Acceptable Use Policy, which forms part of this Agreement. Because misuse patterns for AI systems change faster than contracts do, we may update that policy without amending this Agreement; we will not use it to reduce the rights this Agreement grants you.',
      ]},
      { id: 'customer-data', heading: 'Customer Data and Customer Obligations', body: [
        'As between the parties, you retain all right, title, and interest in and to Customer Data. You grant OyeChats a worldwide, royalty-free license to host, copy, transmit, display, and process Customer Data solely as necessary to provide, secure, and support the Services. We will not use Customer Data, including conversation content, to train general-purpose foundation models.',
        'Where you process personal data of Visitors through the Services, you act as the controller and OyeChats acts as a processor on your behalf. The Data Processing Addendum available at oyechats.com/legal/dpa is incorporated by reference and governs that processing.',
        'You are responsible for giving your Visitors the privacy notices their law requires, for obtaining any consent required before the widget collects their data, and for the accuracy and lawfulness of the knowledge base content you upload or ask us to crawl. You confirm you have the right to use any content you supply to us for that purpose.',
      ]},
      { id: 'ai-outputs', heading: 'AI Outputs', body: [
        'The Services generate Output using large language models. Output is probabilistic: it can be incomplete, out of date, or factually wrong, including where the underlying knowledge base is accurate. OyeChats does not warrant the accuracy, completeness, or fitness for any purpose of any Output, and Output is expressly excluded from the limited warranty below.',
        'You are responsible for reviewing Output and for any reliance you or your Visitors place on it. Where Output could have legal, financial, medical, safety, or similarly significant consequences, you will not present it to Visitors without human review. The Services do not provide legal, medical, financial, tax, or other professional advice, and you will not configure a Bot to hold itself out as doing so.',
        'Where the EU AI Act applies to a deployment, OyeChats is the provider of the AI system and you are its deployer, and each party is responsible for the obligations the Act places on its role. The Services disclose to Visitors that they are interacting with an automated system; you are responsible for the transparency, record-keeping, and human-oversight duties that fall on a deployer, and for not disabling any disclosure the Services provide.',
        'As between you and OyeChats, you own the Output generated from your Customer Data. Output is not unique to you: the same or similar Output may be generated for other customers, and we make no claim of exclusivity in it.',
      ]},
      { id: 'security', heading: 'Security', body: [
        'We will maintain commercially reasonable administrative, physical, and technical safeguards designed to protect the security, confidentiality, and integrity of Customer Data. These include encryption in transit (TLS 1.3), encryption at rest for primary databases and object storage, logical isolation of each customer\'s data, role-based access controls on production systems, audit logging, and a documented incident response process. Further detail, and the process for reporting a vulnerability, is set out in our Security and Responsible Disclosure Policy.',
      ]},
      { id: 'third-party', heading: 'Third-Party Platforms and Third Party Apps', body: [
        'The Services rely on, and can be configured to integrate with, Third Party Apps. Those we engage to operate the Services include large language model and embedding providers (OpenAI, Google), web crawling and content extraction (Spider.cloud, Jina AI), IP and email intelligence (ipapi.is, Reoon), infrastructure and storage (DigitalOcean, Cloudflare, Vercel), transactional email (Brevo), push notification delivery (Expo), payment processing (Razorpay), observability (Sentry, Langfuse), and any integrations you elect to connect. The current itemized list is maintained on our Subprocessors List page.',
        'Third Party Apps are governed by their own terms and privacy policies. Enabling an integration authorizes OyeChats to transmit Customer Data to that Third Party App to the extent necessary to operate it.',
      ]},
      { id: 'ownership', heading: 'Ownership', body: [
        'OyeChats and its licensors retain all right, title, and interest in and to the Services, the Documentation, the widget code we publish, and all underlying software, models, designs, trademarks, and know-how. This Agreement grants you only a limited right to use the Services as expressly set out herein.',
        'If you provide feedback, suggestions, or ideas about the Services, you grant us a perpetual, irrevocable, royalty-free license to use them without restriction.',
      ]},
      { id: 'trials', heading: 'Free Plan, Trials and Promotional Credits', body: [
        'Free plan. We offer a free plan with reduced limits. It is provided as is, without any warranty or support commitment, and we may change or discontinue it on notice.',
        'Trials. Where a plan is offered with a free trial, the trial runs for the period stated at sign-up and gives you the paid plan\'s features. Unless you cancel before the trial ends, the trial converts automatically to a paid subscription and the plan fee is charged to your designated payment method. You can cancel at any point during the trial from your dashboard at no charge.',
        'Pre-debit notice. Where a recurring charge is set up on an Indian card or e-mandate, we send you a notification in advance of each debit, as the applicable Reserve Bank of India requirements provide. Receiving that notice does not extend the cancellation deadline; cancel before the debit date if you do not want the charge.',
        'Trial data. Conversation and knowledge base data created during a trial that does not convert to a paid plan is deleted 15 days after the trial ends.',
        'Promotional credits. Credits granted as part of a promotion are not purchased credits. They carry the expiry and eligibility conditions stated when they are granted, are not refundable or transferable, and may be withdrawn if the promotion\'s conditions are not met.',
      ]},
      { id: 'subscription', heading: 'Subscription Term, Fees and Payment', body: [
        'Plans and renewal. Your Subscription Term begins on the start date in your Order and continues for the period specified (monthly or annually). The subscription renews automatically for successive periods of equal length at the then-current list price until you cancel. You may cancel at any time from your dashboard, effective at the end of the then-current period, as described in our Cancellation Policy.',
        `Fees and taxes. Fees are charged in advance and are non-refundable except where expressly stated in our Refund Policy or required by law. Prices listed for Indian customers are inclusive of applicable Goods and Services Tax, which is shown as a separate line on your tax invoice; we do not add GST on top of the listed price. Prices listed in other currencies are exclusive of any withholding, sales, use, VAT, or similar taxes your jurisdiction imposes, which are your responsibility.`,
        'Payment. We process card, UPI, net-banking, and international payments through Razorpay. You authorize us to charge your designated payment method on a recurring basis until you cancel.',
        'Usage and overages. Your plan includes monthly limits. If you exceed a limit, the Services may degrade gracefully, and we will notify you to upgrade. We do not silently charge overages without your consent.',
        'Non-payment. If a charge fails, we will retry it and notify you. We may suspend access to the Services after a failed payment remains uncured following the notices described in our dunning process, and may terminate for non-payment under the termination provisions below.',
        'Price changes. We may adjust list prices for future Subscription Terms by giving you at least 30 days\' notice before your renewal.',
      ]},
      { id: 'term-and-termination', heading: 'Term and Termination', body: [
        'This Agreement begins when you create an Account and continues until all Subscription Terms expire or the Agreement is terminated as described below.',
        'Termination for convenience. You may cancel your subscription at any time from your dashboard. Cancellation stops automatic renewal; the Services remain available until the end of the paid period, and we do not refund partial periods.',
        'Termination for cause. Either party may terminate this Agreement for material breach by the other party if the breach is not cured within 14 days after written notice describing it.',
        'Suspension. We may suspend your access, or a specific Bot, without prior notice where necessary to prevent material harm to the Services, to other customers, or to a third party, or where required by law. We will restore access promptly once the cause is resolved, and will tell you why we suspended it.',
        'Effect of termination. On termination, your right to access the Services ceases. On request within 30 days of termination we will provide you with an export of your Customer Data; export is currently handled by our team on request rather than through a self-service control in the dashboard. After that window, we will delete or anonymize Customer Data in line with the retention schedule in the Privacy Policy and the Data Processing Addendum.',
        'Survival. The Definitions, Ownership, AI Outputs, Limitation of Liability, Indemnification, and General Terms sections, and any accrued payment obligation, survive termination.',
      ]},
      { id: 'limited-warranty', heading: 'Limited Warranty', body: [
        'OyeChats warrants that the Services will perform materially in accordance with the Documentation during the Subscription Term. As your sole and exclusive remedy for breach of this warranty, we will use commercially reasonable efforts to correct the non-conformity.',
        'This warranty does not apply to the free plan, to trials, to features identified as beta, preview, or early access, or to Output. Beta features are provided as is, may be changed or withdrawn at any time, and are excluded from every warranty and service commitment in this Agreement.',
        'EXCEPT FOR THE EXPRESS WARRANTY IN THIS SECTION, THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE." TO THE MAXIMUM EXTENT PERMITTED BY LAW, OYECHATS DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
      ]},
      { id: 'limitation-of-liability', heading: 'Limitation of Liability', body: [
        'TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, GOODWILL, OR DATA.',
        'EACH PARTY\'S AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THIS AGREEMENT WILL NOT EXCEED THE FEES YOU PAID OR WERE OBLIGATED TO PAY FOR THE SERVICES IN THE 12 MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.',
        'Nothing in this Agreement excludes or limits either party\'s liability where applicable law does not permit it to be excluded or limited.',
      ]},
      { id: 'indemnification', heading: 'Indemnification', body: [
        'By OyeChats. We will defend you against any third-party claim alleging that the Services, when used as authorized under this Agreement, infringe a third party\'s intellectual property right, and will pay damages and reasonable costs finally awarded against you or agreed in settlement. This obligation does not apply to a claim arising from Output, from Customer Data, or from your combination of the Services with anything we did not supply.',
        'By Customer. You will defend OyeChats against any third-party claim arising out of Customer Data, your use of the Services in breach of this Agreement or the Acceptable Use Policy, your reliance on or presentation of Output, or your failure to provide required notices to or obtain required consent from Visitors.',
      ]},
      { id: 'general-terms', heading: 'General Terms', body: [
        'Entire agreement. This Agreement, together with the Privacy Policy, the Acceptable Use Policy, the Data Processing Addendum, the Refund Policy, the Cancellation Policy, and any Order, is the entire agreement between the parties and supersedes any prior proposal or representation.',
        'Amendments. We may update this Agreement from time to time. For material changes, we will provide at least 30 days\' notice.',
        `Governing law and venue. This Agreement is governed by the laws of India. The courts located in ${ENTITY.jurisdiction} will have exclusive jurisdiction over any dispute.`,
        'Assignment. You may not assign this Agreement without our prior written consent, except to a successor in a merger or sale of substantially all of your assets who is not our competitor. We may assign it to an affiliate or to a successor in a corporate transaction.',
        'Severability and waiver. If any provision is held unenforceable, it will be modified to the minimum extent needed to make it enforceable and the rest of the Agreement will remain in effect. A failure to enforce a provision is not a waiver of it.',
        'Independent parties. The parties are independent contractors. This Agreement creates no partnership, agency, joint venture, or employment relationship.',
        'Publicity. Neither party will use the other\'s name or logo in a public statement or customer list without prior written consent, except that you may state that you use the Services and we may identify you as a customer where you have given us written permission.',
        'Export control and sanctions. Each party will comply with applicable export control and economic sanctions laws. You confirm you are not located in, organized under the laws of, or ordinarily resident in a territory subject to comprehensive sanctions, and that you are not a restricted or denied party.',
        'Force majeure. Neither party will be liable for any delay or failure to perform caused by events beyond its reasonable control.',
        `Notices. Notices to OyeChats must be sent to support@oyechats.com, with a copy to ${ENTITY.legalName}, ${REGISTERED_ADDRESS}. Notices to you are sent to the email address of your account administrator.`,
      ]},
      { id: 'questions', heading: 'Questions', body: [
        'Questions about these Terms? Contact support@oyechats.com.',
      ]},
    ],
  },
  {
    slug: 'aup',
    metaTitle: 'Acceptable Use Policy for the OyeChats Platform',
    metaDescription:
      'What you may and may not do with OyeChats: prohibited content, prohibited AI uses, security and platform-integrity rules, and how we enforce them.',
    title: 'Acceptable Use Policy',
    description: 'What you may and may not do with OyeChats, and how we enforce it.',
    lastUpdated: '2026-08-17',
    sections: [
      { id: 'introduction', heading: 'Introduction', body: [
        'This Acceptable Use Policy ("AUP") sets out what you may and may not do with the OyeChats Services. It forms part of our Terms of Service, and it applies to you, to your Authorized Users, and to any Bot you configure.',
        'It exists as a separate document for a practical reason: the ways an AI chat system can be misused change faster than a contract can be renegotiated. Keeping the list here means we can add a newly-observed abuse pattern without amending the Agreement. We will not use that flexibility to reduce the rights the Agreement grants you.',
      ]},
      { id: 'prohibited-content', heading: 'Prohibited Content and Conduct', body: [
        'You will not use the Services to create, store, transmit, or make available content that:',
        '- Is unlawful, defamatory, harassing, abusive, or that threatens or incites violence.',
        '- Infringes a third party\'s intellectual property, privacy, or publicity rights.',
        '- Constitutes spam, chain messaging, or unsolicited bulk commercial messaging.',
        '- Sexually exploits or endangers a minor, or is sexual content involving minors in any form.',
        '- Contains malware, ransomware, or code designed to disrupt or gain unauthorized access to any system.',
        '- Is designed to deceive a person about who they are dealing with, including impersonating a real individual, business, or public authority.',
      ]},
      { id: 'prohibited-ai-uses', heading: 'Prohibited Uses of AI Features', body: [
        'The following are specific to the AI capabilities of the Services and are prohibited:',
        '- Configuring, prompting, or modifying a Bot so that it denies being automated, or so that a Visitor who asks whether they are talking to a human is misled.',
        '- Suppressing, removing, or obscuring any disclosure the Services present to a Visitor about the automated nature of the conversation.',
        '- Using the Services to generate content presented as professional legal, medical, financial, tax, or safety advice, or to substitute for a regulated professional.',
        '- Presenting Output to Visitors without human review where an error could have legal, financial, medical, or safety consequences.',
        '- Deploying a Bot to an audience you know or ought reasonably to know consists of children, without the parental consent your applicable law requires.',
        '- Using the Services to generate content intended to manipulate an election, to produce coordinated inauthentic messaging, or to impersonate a real person\'s voice or writing without their consent.',
        '- Using Output to train, fine-tune, distil, or evaluate a competing machine learning model.',
        '- Using the Services for automated decisions about a person\'s access to employment, credit, housing, insurance, education, or essential services.',
      ]},
      { id: 'platform-integrity', heading: 'Platform and Tenant Integrity', body: [
        'The following protect the Services and the other customers on them:',
        '- Do not attempt to discover, extract, or infer another customer\'s system prompt, knowledge base content, conversation data, or configuration, whether by prompt injection, crafted input, enumeration of identifiers, or any other means.',
        '- Do not attempt to make a Bot ignore or override the instructions or restrictions its owner configured.',
        '- Do not probe, scan, or test the vulnerability of the Services except under our Security and Responsible Disclosure Policy.',
        '- Do not circumvent authentication, rate limits, credit accounting, plan entitlements, or usage metering.',
        '- Do not scrape, crawl, or bulk-extract the Services or their output other than through the documented API within your plan limits.',
        '- Do not use the Services to crawl or ingest content from a website you do not own or have permission to ingest, or in a way that breaches that site\'s terms or robots directives.',
        '- Do not send traffic that imposes a disproportionate load on our infrastructure, including automated load generation not agreed with us in advance.',
      ]},
      { id: 'reporting', heading: 'Reporting Abuse', body: [
        'If you believe a Bot built on OyeChats is being used in breach of this policy, write to support@oyechats.com with the website address, a description of what you observed, and the approximate time. We investigate every report we can reproduce.',
        'Security vulnerabilities are handled separately, under our Security and Responsible Disclosure Policy.',
      ]},
      { id: 'enforcement', heading: 'Enforcement', body: [
        'Where we find a breach of this policy, our response is proportionate to what we find. In most cases we contact the account owner and ask for it to be corrected. Where a breach is causing active harm to Visitors, to other customers, or to the Services, we may suspend the affected Bot or the account without prior notice, and we will tell you why.',
        'A material or repeated breach is a material breach of the Terms of Service and may result in termination under those terms. We may also report unlawful conduct to the relevant authorities where we are required or permitted to do so.',
      ]},
      { id: 'changes', heading: 'Changes to This Policy', body: [
        'We may update this policy as new misuse patterns emerge. Material additions will be announced by email to account administrators or by in-product notice. The "Last updated" date above reflects the most recent revision.',
      ]},
      { id: 'contact', heading: 'Contact', body: [
        'Questions about this policy? Write to support@oyechats.com.',
      ]},
    ],
  },
  {
    slug: 'dpa',
    metaTitle: 'Data Processing Addendum (DPA) for Customers',
    metaDescription:
      'The OyeChats Data Processing Addendum governing how we process personal data on behalf of our customers, including sub-processors and security measures.',
    title: 'Data Processing Addendum',
    description: 'The OyeChats Data Processing Addendum governing how we process personal data on behalf of our customers.',
    lastUpdated: '2026-08-17',
    sections: [
      { id: 'introduction', heading: 'Introduction and Applicability', body: [
        `This Data Processing Addendum ("DPA") forms part of the Terms of Service (the "Agreement") between ${ENTITY.legalName}, trading as OyeChats ("OyeChats," "we," "us"), and the customer that has entered into the Agreement ("Customer," "you"). It applies whenever OyeChats processes Personal Data on your behalf in the course of providing the Services.`,
        'This DPA is designed to satisfy the requirements that apply to a data processor under the Digital Personal Data Protection Act, 2023 (India) ("DPDP Act") and, where your processing is subject to it, the EU General Data Protection Regulation 2016/679 and the UK GDPR (together, "GDPR").',
        'Where this DPA conflicts with the rest of the Agreement, this DPA prevails in respect of the processing of Personal Data. This DPA takes effect when you accept the Agreement and continues for as long as OyeChats processes Personal Data on your behalf.',
      ]},
      { id: 'roles', heading: 'Roles of the Parties', body: [
        'For Personal Data processed under this DPA, you are the Controller (Data Fiduciary under the DPDP Act) and OyeChats is your Processor (Data Processor). You determine the purposes and means of the processing.',
        'You are responsible for the lawfulness of the instructions you give us, for giving Data Subjects the notice their law requires, and for obtaining any consent required before the widget collects their data. This matters particularly under the DPDP Act, which does not provide a legitimate-interest basis to fall back on.',
        'Separately, OyeChats acts as an independent Controller for the account data of its own customers (such as your login credentials, billing records, and support correspondence). That processing is described in our Privacy Policy and is not governed by this DPA.',
      ]},
      { id: 'scope', heading: 'Scope and Purpose of Processing', body: [
        'OyeChats processes Personal Data for the following purposes and no others:',
        '- Operating the chat widget and generating AI responses to Visitor messages.',
        '- Storing chat transcripts, lead capture submissions, and Visitor metadata.',
        '- Deriving geography and network signals from a Visitor\'s IP address, and verifying the deliverability of email addresses submitted through lead-capture forms.',
        '- Routing conversations to your operators for live chat and delivering the notifications you configure.',
        '- Producing analytics and lead qualification scores.',
        '- Securing, supporting, and troubleshooting the Services.',
        'The categories of Data Subjects, categories of Personal Data, and duration of processing are set out in Annex I below.',
      ]},
      { id: 'instructions', heading: 'Processing on Documented Instructions', body: [
        'OyeChats processes Personal Data only on your documented instructions. The Agreement, this DPA, the configuration choices you make in the dashboard, and your use of the Services are your instructions to us.',
        'If we consider an instruction to infringe applicable data protection law, we will inform you without undue delay, and may suspend performance of that instruction until it is confirmed or withdrawn.',
        'If applicable law requires us to process Personal Data other than on your instructions, we will inform you of that requirement before processing, unless the law prohibits us from doing so. We will not disclose Personal Data to a public authority except where legally compelled, and where permitted we will notify you and disclose only the minimum required.',
      ]},
      { id: 'confidentiality', heading: 'Confidentiality of Personnel', body: [
        'OyeChats ensures that every person authorized to process Personal Data under this DPA is bound by a written obligation of confidentiality that survives the end of their engagement, has been informed of the confidential nature of the data, and receives access only on a least-privilege basis for as long as they need it.',
      ]},
      { id: 'security', heading: 'Security Measures', body: [
        'OyeChats implements and maintains appropriate technical and organizational measures designed to protect Personal Data. They are set out in Annex II below.',
        'We may update those measures over time, provided we do not materially reduce the level of protection they provide.',
      ]},
      { id: 'subprocessors', heading: 'Sub-processors', body: [
        'You provide a general authorization for OyeChats to engage Sub-processors to deliver the Services. Each Sub-processor is engaged under a written contract imposing data protection obligations at least as protective as those in this DPA, and OyeChats remains responsible to you for its Sub-processors\' performance.',
        'The Sub-processors we currently engage are:',
        '- DigitalOcean: Application server and managed database hosting. (India)',
        '- Cloudflare: Object storage for uploaded knowledge base files, and CDN delivery of the embeddable widget. (Global edge network)',
        '- Vercel: Hosting for the marketing site and the customer dashboard front-end. (United States)',
        '- OpenAI: Large language model inference. (United States)',
        '- Google: Large language model inference (fallback) and all text embedding generation. (United States)',
        '- Spider.cloud: Web crawling and content extraction for knowledge base ingestion. (United States)',
        '- Jina AI: Web content extraction for knowledge base ingestion. (Germany / European Union)',
        '- ipapi.is: IP geolocation and network intelligence lookups. (European Union)',
        '- Reoon: Email address deliverability verification. (Singapore)',
        '- Brevo: Transactional email delivery. (European Union)',
        '- Expo: Mobile push notification delivery to operators. (United States)',
        '- Razorpay: Payment processing. (India)',
        '- Sentry: Application error monitoring. (United States)',
        '- Langfuse: LLM observability. (European Union)',
        'We will give you at least 30 days\' advance notice before adding or replacing a Sub-processor that processes Personal Data. If you have a reasonable data protection objection to a new Sub-processor, tell us within that notice period and we will work with you in good faith to find an alternative. If we cannot, you may terminate the affected Services without penalty and receive a pro-rata refund of pre-paid fees for the unused remainder of the Subscription Term.',
      ]},
      { id: 'data-subject-requests', heading: 'Data Subject Requests', body: [
        'The Services give you the ability to access, correct, export, and delete Personal Data about your Visitors, so that you can respond to a Data Subject request yourself.',
        'Where a request cannot be fulfilled through the Services, OyeChats will provide reasonable assistance, at your cost where the assistance is substantial, to help you respond within your statutory deadline.',
        'If a Data Subject contacts OyeChats directly about Personal Data we process on your behalf, we will not respond to the substance of the request. We will refer them to you and inform you promptly.',
      ]},
      { id: 'assistance', heading: 'Assistance with Your Compliance Obligations', body: [
        'Taking into account the nature of the processing and the information available to us, OyeChats will provide reasonable assistance with:',
        '- Your obligation to keep processing secure.',
        '- Your obligations to notify Personal Data Breaches to supervisory authorities and to Data Subjects.',
        '- Your data protection impact assessments, and any prior consultation with a supervisory authority arising from one.',
      ]},
      { id: 'breach-notification', heading: 'Personal Data Breach Notification', body: [
        'OyeChats will notify you without undue delay, and in any event within 72 hours, after becoming aware of a Personal Data Breach affecting Personal Data processed on your behalf.',
        'The notification will describe, to the extent then known, the nature of the breach, the categories and approximate number of Data Subjects and records affected, the likely consequences, and the measures taken or proposed. Where we cannot provide all of that at once, we will provide it in phases without further undue delay.',
        'We will reasonably cooperate with your own notification obligations to supervisory authorities, to the Data Protection Board of India, and to affected Data Subjects. Our notification is not an admission of fault or liability.',
      ]},
      { id: 'retention-deletion', heading: 'Data Retention and Deletion', body: [
        'During the term of the Agreement, Personal Data is retained according to the retention settings available in the dashboard and the schedule described in the Privacy Policy. Note that your plan tier governs how far back conversation history remains accessible to you; it is not an automatic deletion schedule.',
        'On termination or expiry of the Agreement, you may request an export of Personal Data within 30 days. After that window, OyeChats will delete or irreversibly anonymize all Personal Data processed on your behalf within a further 30 days, except where retention is required by applicable law, in which case we will retain only what the law requires and continue to protect it under this DPA.',
        'You may request deletion of Personal Data at any point during the term by writing to support@oyechats.com. Deletion is currently carried out by our team on request rather than through a self-service control in the dashboard, and is completed within 30 days.',
      ]},
      { id: 'transfers', heading: 'International Data Transfers', body: [
        'Where Personal Data subject to the GDPR is transferred to a country without an adequacy decision, the European Commission\'s Standard Contractual Clauses (Commission Implementing Decision (EU) 2021/914) are incorporated into this DPA by reference and apply to that transfer, with Module Two (controller to processor) applying between you and OyeChats and Module Three (processor to processor) applying where you are yourself a processor.',
        'For the purposes of the Clauses: the data exporter is you, the data importer is OyeChats, Clause 7 (docking) applies, Clause 9 option 2 (general written authorization for Sub-processors) applies with the 30-day notice period set out above, Clause 11 does not include the optional independent dispute resolution body, Clause 17 selects the law of Ireland, and Clause 18(b) selects the courts of Ireland. Annex I and Annex II of the Clauses are populated by Annex I and Annex II of this DPA, and the Sub-processor list above serves as Annex III.',
        'Where Personal Data is subject to the UK GDPR, the UK International Data Transfer Addendum to the Clauses applies, with the information in Part 1 taken from this DPA and Annexes and neither party permitted to end the Addendum under Section 19.',
        'Where Personal Data is subject to the Swiss FADP, the Clauses apply with references to the GDPR read as references to the FADP and the Swiss Federal Data Protection and Information Commissioner as the competent authority.',
      ]},
      { id: 'audits', heading: 'Audit Rights', body: [
        'OyeChats will make available to you the information reasonably necessary to demonstrate compliance with this DPA. In the first instance, we satisfy audit requests through written responses to security and privacy questionnaires and copies of relevant policy documentation.',
        'Where that is not sufficient to demonstrate compliance, and where you are required to conduct an audit or inspection by applicable data protection law or by your supervisory authority, OyeChats will allow for and contribute to an audit of the processing, conducted by you or by an independent auditor you appoint who is not our competitor. Such an audit is subject to at least 30 days\' written notice, reasonable confidentiality undertakings, scoping that avoids disruption to the Services or access to other customers\' data, and no more than once in any 12-month period unless a Personal Data Breach or a regulator\'s direction requires otherwise. You bear the cost of the audit and of our reasonable assistance.',
      ]},
      { id: 'liability', heading: 'Liability', body: [
        'Each party\'s liability under or in connection with this DPA is subject to the exclusions and limitations of liability set out in the Agreement. Where the Standard Contractual Clauses apply, nothing in this section limits any liability the Clauses impose towards a Data Subject.',
      ]},
      { id: 'annex-i', heading: 'Annex I: Details of Processing', body: [
        'Subject matter and nature of the processing: provision of an AI chat and live-chat service embedded on the Customer\'s websites, including storage, retrieval, AI inference, enrichment, analytics, notification, and support.',
        'Duration: for the term of the Agreement, plus the post-termination export and deletion windows described above.',
        'Categories of Data Subjects:',
        '- Visitors to websites where the Customer has deployed the widget.',
        '- The Customer\'s Authorized Users and operators.',
        'Categories of Personal Data:',
        '- Identifiers and contact details submitted by a Visitor: name, email address, phone number, company.',
        '- Conversation content: messages exchanged with a Bot or an operator, timestamps, and ratings.',
        '- Technical and network data: IP address, browser and device type, derived city, region and country, derived network and organization signals, page URL, referrer, and campaign parameters.',
        '- Email verification results for addresses submitted through lead-capture forms.',
        '- Derived qualification signals and conversation summaries generated from the above.',
        '- Operator account data: name, email, role, activity logs, and push notification tokens.',
        'Sensitive Personal Data: the Services are not designed for, and the Customer must not configure a Bot to solicit, special categories of data under Article 9 GDPR, government identifiers, or payment card details. Any such data a Visitor volunteers unprompted in free text is processed as ordinary conversation content, and the Customer remains responsible for it.',
        'Frequency of transfer: continuous, on an ongoing basis for the duration of the Agreement.',
      ]},
      { id: 'annex-ii', heading: 'Annex II: Technical and Organizational Measures', body: [
        'Encryption. TLS 1.3 for all API, widget, and dashboard traffic. Encryption at rest for primary databases and object storage. Encrypted database backups, rotated on a 30-day cycle.',
        'Access control. Role-based access control on the platform and on production systems, least-privilege provisioning, multi-factor authentication for production access, and separate credentials for each persona (customer, operator, widget, administrator).',
        'Tenant isolation. Every query is scoped to the owning account, and each Bot\'s knowledge base and conversations are logically isolated from every other tenant\'s.',
        'Data minimization at boundaries. Visitor IP addresses are stripped from every API response, dashboard view, CSV export, and third-party observability trace, at a single enforced point in the code.',
        'Logging and monitoring. Audit logging of administrative and operator actions, immutable transition logs for live-chat handovers, application error monitoring, and health monitoring of the platform.',
        'Environment separation. Production and non-production workloads run in separate environments with separate credentials and separate observability projects.',
        'Resilience. Automated encrypted backups, rate limiting, and graceful degradation when a plan limit or an upstream provider limit is reached.',
        'Incident response. A documented incident response process, with the breach notification commitments set out above.',
        'Personnel. Confidentiality obligations for all personnel with access to Personal Data, and least-privilege access granted for the duration of need.',
        'Sub-processor governance. Written data protection terms with every Sub-processor, and the notice and objection process set out above.',
      ]},
      { id: 'contact', heading: 'Contact', body: [
        `Questions about this DPA can be sent to support@oyechats.com, or to our ${OFFICER.title}, ${OFFICER.name}, at ${ENTITY.legalName}, ${REGISTERED_ADDRESS}.`,
      ]},
    ],
  },
  {
    slug: 'subprocessors',
    metaTitle: 'Sub-processors: Third Parties We Engage',
    metaDescription:
      'The current list of third-party sub-processors OyeChats engages to deliver the service, what each one does, and where they process data.',
    title: 'Subprocessors List',
    description: 'The current list of third-party sub-processors OyeChats engages to deliver the Services.',
    lastUpdated: '2026-08-17',
    sections: [
      { id: 'overview', heading: 'Overview', body: [
        'A "sub-processor" is a third party we engage to process Customer Data on our behalf in order to deliver the OyeChats Services. Each one is engaged under a written agreement that requires data protection terms at least as protective as those in our Privacy Policy and Data Processing Addendum.',
        'This page is the authoritative list. Where a location is given as a country, that is where the provider processes data for us under our configuration; several providers operate globally.',
      ]},
      { id: 'infrastructure', heading: 'Infrastructure and Hosting', body: [
        '- DigitalOcean: Primary application servers and managed PostgreSQL database hosting. (India)',
        '- Cloudflare: Object storage for uploaded knowledge base files via R2, and CDN delivery of the embeddable widget bundle. (Global edge network)',
        '- Vercel: Hosting for the marketing site (oyechats.com) and customer dashboard front-end (app.oyechats.com). (United States)',
      ]},
      { id: 'ai-providers', heading: 'AI Model Providers', body: [
        'Conversation messages and knowledge base content are sent to these providers at query time. We do not authorize them to use Customer Data to train general-purpose foundation models.',
        '- OpenAI: Primary large language model inference for chat responses. (United States)',
        '- Google (Gemini API): Fallback large language model inference, and the sole provider of text embedding generation. Every document you upload or page we crawl, and every question a Visitor asks, is embedded by Google. (United States)',
      ]},
      { id: 'crawling', heading: 'Web Crawling and Content Extraction', body: [
        'When you ask us to train a bot on a URL, we fetch and extract that page through a managed crawling provider rather than from our own servers. The URL and the page content are sent to the provider; where a page is behind a login or contains personal data, that content is transmitted too.',
        '- Jina AI: Primary web content extraction. (Germany / European Union)',
        '- Spider.cloud: Web crawling and content extraction, used as the alternate provider. (United States)',
      ]},
      { id: 'enrichment', heading: 'IP and Email Intelligence', body: [
        '- ipapi.is: IP geolocation and network intelligence. Receives the Visitor\'s IP address for every conversation, and returns the geography, the owning organization and network, and hosting, VPN, and abuse signals. (European Union)',
        '- Reoon: Email address deliverability verification. Receives email addresses submitted through lead-capture forms on plans that include verification, and returns a deliverability result. (Singapore)',
      ]},
      { id: 'communications', heading: 'Communications and Notifications', body: [
        '- Brevo (Sendinblue): Transactional email delivery. (European Union)',
        '- Expo: Mobile push notification delivery to operators who have enabled notifications. Receives the device push token and the notification content, which may include a preview of a Visitor message. (United States)',
      ]},
      { id: 'identity', heading: 'Authentication', body: [
        '- Google (Sign in with Google): Optional sign-in for customer accounts. We request only the openid, email, and profile scopes, and receive the name, email address, and profile picture on the Google account. (United States)',
      ]},
      { id: 'payments', heading: 'Payment Processing', body: [
        'Card numbers, UPI handles, and bank account details are processed and stored by this provider and do not reach OyeChats servers.',
        '- Razorpay: Card, UPI, net-banking, and international payment processing, for both INR and foreign-currency charges. (India)',
      ]},
      { id: 'observability', heading: 'Monitoring and Observability', body: [
        '- Sentry: Application error monitoring and diagnostics. (United States)',
        '- Langfuse: LLM observability. Receives prompts, retrieved context, and model responses for tracing. Visitor IP addresses are stripped before a trace is sent. (European Union)',
      ]},
      { id: 'integrations', heading: 'Optional Customer-Enabled Integrations', body: [
        'Customers may choose to connect third-party tools (such as CRMs, ticketing systems, calendars, or analytics services) to their account. These integrations are processors of Customer Data acting on the customer\'s direct instructions.',
      ]},
      { id: 'updates', heading: 'Updates to This List', body: [
        'We may add, remove, or replace sub-processors from time to time. For material changes, we will provide at least 30 days\' advance notice by email to account administrators or by in-product notice. Customers with a data protection objection to a new sub-processor have the rights set out in our Data Processing Addendum.',
      ]},
      { id: 'contact', heading: 'Contact', body: [
        'Questions about our sub-processors? Write to support@oyechats.com and we will respond within 14 days.',
      ]},
    ],
  },
  {
    slug: 'cookies',
    metaTitle: 'Cookie Policy: Cookies and Similar Technologies',
    metaDescription:
      'How OyeChats uses cookies and similar technologies across the website and the chat widget, what each category does, and how to control them.',
    title: 'Cookie Policy',
    description: 'How OyeChats uses cookies and similar technologies.',
    lastUpdated: '2026-08-17',
    sections: [
      { id: 'introduction', heading: 'Introduction', body: [
        'This Cookie Policy explains how OyeChats uses cookies and similar technologies on our marketing site at oyechats.com, the customer dashboard at app.oyechats.com, and the embeddable chat widget our customers deploy on their own websites.',
        'If you are a customer deciding how to describe the OyeChats widget in your own cookie notice, the section on the widget below is the part you need.',
      ]},
      { id: 'what-are-cookies', heading: 'What are cookies?', body: [
        'Cookies are small text files a website places on your device so it can remember you between visits. "Similar technologies" covers anything that does roughly the same job: localStorage and sessionStorage in the browser, the IndexedDB API, pixel tags in emails, and software development kits (SDKs).',
      ]},
      { id: 'cookies-we-use', heading: 'Cookies on our marketing site and dashboard', body: [
        'We use a small number of strictly-necessary first-party cookies, plus one analytics category that runs only with your permission where consent is required. We do not run advertising cookies or cross-site advertising pixels on our own properties.',
        '- oyechats_session: Keeps you signed in to the customer dashboard between page loads and protects against session fixation. (Session, cleared on logout)',
        '- oyechats_csrf: Protects state-changing requests from cross-site request forgery attacks. (Session)',
        '- oyechats_consent: Remembers your cookie banner choice on the marketing site. (6 months)',
        'Analytics cookies, set by Google Analytics via Google Tag Manager on oyechats.com only:',
        '- _ga: Distinguishes one browser from another so we can count returning visitors. (2 years)',
        '- _ga_E5ZZ461R8T: Holds the session state for our Google Analytics property. (2 years)',
        'Visitors in the EEA, the UK, and Switzerland are asked to consent before either analytics cookie is set, and neither is set if you decline. Elsewhere they are set by default and you can turn them off at any time from "Cookie preferences" in the footer. We also treat a Global Privacy Control signal as a decline.',
      ]},
      { id: 'widget', heading: 'The embeddable chat widget', body: [
        'The OyeChats widget stores a single anonymous session identifier so a conversation stays continuous for the same Visitor. That identifier is not tied to a name, an email address, or an account unless the Visitor submits one through a lead-capture form.',
        'Primary storage is localStorage, under the key chat_session_id_[bot key]. Because localStorage is partitioned per origin, the widget also writes first-party cookies so a conversation survives a move between subdomains of the site it is embedded on:',
        '- oyechats_sid_[bot key]: Mirrors the anonymous session identifier, scoped to the parent domain of the site the widget is embedded on, so a Visitor moving from example.com to help.example.com keeps the same conversation. First-party, SameSite=Lax, Secure on HTTPS. (30 days)',
        '- __oye_apex_probe: A throwaway cookie written and immediately deleted the first time the widget loads on a hostname, to work out which parent domain the browser will accept a cookie for. It holds no data about the Visitor and does not persist. (Deleted immediately)',
        'These are first-party cookies on the customer\'s own domain, not OyeChats cookies, and they are strictly necessary for the chat function the Visitor initiated. Cross-subdomain continuity is enabled by default, using an automatically detected parent domain; customers can restrict the scope by setting an explicit share domain in the dashboard under Channels. If the browser refuses cookies, the widget falls back to localStorage alone and the chat still works, without continuity across subdomains.',
        'The widget sets no advertising, analytics, or cross-site tracking cookies, and does not track Visitors across websites belonging to different customers. Session storage is namespaced per bot, so a Visitor who chats on two OyeChats-powered sites is not linked between them.',
      ]},
      { id: 'your-choices', heading: 'Your choices and controls', body: [
        'You can control cookies in several ways:',
        '- Browser settings: most browsers let you block, delete, or be warned about cookies on a per-site basis.',
        '- Marketing site banner: if a consent banner is shown on oyechats.com in your region, you can accept or decline non-essential categories there.',
        '- In the widget: starting a new chat clears the stored session identifier and expires the continuity cookie.',
        '- Widget scope, for customers: if you operate a site that embeds the OyeChats widget, you can narrow cross-subdomain continuity to a specific domain from your dashboard under Channels.',
        'Blocking strictly-necessary cookies will break sign-in and other core flows on the dashboard.',
      ]},
      { id: 'do-not-track', heading: 'Do Not Track and Global Privacy Control', body: [
        'Browsers can transmit a Do Not Track (DNT) header or a Global Privacy Control (GPC) signal. We honor GPC where transmitted: when GPC is detected, we treat it as an opt-out of any sale or sharing of personal information for the purposes covered by the CCPA / CPRA. We do not respond to DNT, which has no agreed meaning across browsers.',
      ]},
      { id: 'changes', heading: 'Changes to this policy', body: [
        'We may update this Cookie Policy from time to time to reflect changes in technology, applicable law, or our practices.',
      ]},
      { id: 'contact', heading: 'Questions', body: [
        'Have a question about how we use cookies? Write to support@oyechats.com and we will respond within 14 days.',
      ]},
    ],
  },
  {
    slug: 'security',
    metaTitle: 'Security and Responsible Disclosure Policy',
    metaDescription:
      'How to report a security vulnerability in OyeChats, our safe-harbour commitment, what is in and out of scope, and the security measures we operate.',
    title: 'Security and Responsible Disclosure Policy',
    description: 'How to report a vulnerability to us, and the security measures we operate.',
    lastUpdated: '2026-08-17',
    sections: [
      { id: 'introduction', heading: 'Introduction', body: [
        'We would rather hear about a vulnerability from you than from an incident. This policy tells you where to send a report, what we commit to in return, and what is in and out of scope.',
        'We do not currently run a paid bug bounty. We do acknowledge every valid report, and we will credit you publicly if you would like us to.',
      ]},
      { id: 'reporting', heading: 'How to Report a Vulnerability', body: [
        'Email support@oyechats.com with "Security" in the subject line. A useful report includes:',
        '- The affected component and URL or endpoint.',
        '- Steps to reproduce, ideally with a proof of concept.',
        '- What an attacker could achieve, and any prerequisites.',
        '- Your name or handle, if you would like to be credited.',
        'Please report in English, and please send one issue per report.',
      ]},
      { id: 'our-commitments', heading: 'What We Commit To', body: [
        '- We acknowledge your report within 2 business days.',
        '- We give you an initial assessment, including whether we consider it in scope and our severity view, within 5 business days.',
        '- We keep you informed while we work on a fix, and tell you when it is deployed.',
        '- We aim to remediate critical issues within 7 days, high severity within 30 days, and everything else on a schedule we will share with you.',
        '- We will not take legal action against you for research conducted in good faith under this policy.',
      ]},
      { id: 'safe-harbour', heading: 'Safe Harbour', body: [
        'If you make a good-faith effort to comply with this policy during your research, we will treat your research as authorized, we will work with you to understand and resolve the issue quickly, and we will not pursue or support any legal action related to it.',
        'To stay within safe harbour, you must:',
        '- Use only your own test accounts, and stop as soon as you can demonstrate the issue.',
        '- Not access, modify, export, or retain data belonging to any other customer or Visitor. If you encounter such data incidentally, stop, report it, and delete any copy.',
        '- Not degrade the Service: no denial of service, no load or stress testing, no automated scanning at volume.',
        '- Not use social engineering, phishing, or physical attacks against our staff, our customers, or our providers.',
        '- Give us a reasonable opportunity to remediate before disclosing publicly, and coordinate the timing with us.',
        'Safe harbour covers our own systems only. It does not authorize testing against our sub-processors, or against a customer\'s website that happens to embed our widget.',
      ]},
      { id: 'scope', heading: 'Scope', body: [
        'In scope:',
        '- oyechats.com and app.oyechats.com.',
        '- Our REST and WebSocket APIs.',
        '- The embeddable chat widget and its CDN bundle.',
        '- The OyeChats mobile application for operators.',
        'Particularly interesting to us: any cross-tenant data access, authentication or authorization bypass, extraction of another customer\'s system prompt or knowledge base, credit or entitlement bypass, and server-side request forgery through the URL ingestion feature.',
        'Out of scope:',
        '- Reports from automated scanners with no demonstrated impact.',
        '- Missing security headers, cookie flags, or TLS configuration preferences with no demonstrated exploit.',
        '- Denial of service, rate-limit exhaustion, and volumetric testing.',
        '- Social engineering, phishing, and physical security.',
        '- Vulnerabilities in a third-party service we use; report those to that provider.',
        '- A customer\'s own website configuration, including how they have configured their bot or their consent banner.',
        '- Content a bot generates that is merely inaccurate or undesirable. That is a product report, not a vulnerability; send it to support@oyechats.com without the Security subject line.',
      ]},
      { id: 'measures', heading: 'Security Measures We Operate', body: [
        'Encryption. TLS 1.3 for all API, widget, and dashboard traffic. Encryption at rest for primary databases and object storage. Encrypted, rotated database backups.',
        'Access control. Role-based access control, least-privilege provisioning, multi-factor authentication for production access, and separate credentials for each persona.',
        'Tenant isolation. Every query is scoped to the owning account; knowledge bases and conversations are logically isolated between tenants.',
        'Data minimization. Visitor IP addresses are stripped at every outbound boundary, including API responses, dashboard views, CSV exports, and third-party observability traces.',
        'Monitoring. Audit logging of administrative and operator actions, immutable transition logs for live-chat handovers, application error monitoring, and platform health monitoring.',
        'Environment separation. Production and non-production workloads run in separate environments with separate credentials.',
        'We do not currently hold a SOC 2 or ISO 27001 certification, and we will not claim one until we do. We answer security questionnaires in writing, and the audit rights available to customers are set out in our Data Processing Addendum.',
      ]},
      { id: 'contact', heading: 'Contact', body: [
        'Security reports and questions about this policy: support@oyechats.com, with "Security" in the subject line.',
      ]},
    ],
  },
  {
    slug: 'refund',
    metaTitle: 'Refund Policy: When Refunds Apply',
    metaDescription:
      'When OyeChats refunds apply, what is and is not eligible, how to request one, and how long refunds take to process for INR and USD customers.',
    title: 'Refund Policy',
    description: 'OyeChats Refund Policy, when refunds apply and how to request one.',
    lastUpdated: '2026-08-17',
    sections: [
      { id: 'introduction', heading: 'Introduction', body: [
        `This Refund Policy applies to all payments made to OyeChats, a brand of ${ENTITY.legalName}. It should be read together with our Terms of Service and Cancellation Policy.`,
      ]},
      { id: 'general', heading: 'General Policy', body: [
        'All fees paid to OyeChats are non-refundable except in the specific circumstances described below. This includes fees for subscription plans (monthly or annual) and one-time top-up credit purchases.',
        'We encourage you to evaluate OyeChats using our free plan before upgrading to a paid subscription. Where a free trial is offered on a plan, it provides a full-featured experience before any charge is made, and you can cancel during the trial at no charge.',
        'Prices listed for Indian customers are inclusive of applicable GST. A refund of a GST-inclusive charge is refunded as the full amount you were charged, and the tax component is adjusted through a credit note.',
      ]},
      { id: 'subscriptions', heading: 'Subscription Payments', body: [
        'Monthly plans. Monthly subscription fees are charged in advance at the start of each billing cycle. If you cancel during a billing cycle, your subscription remains active until the end of the paid period; no partial-month refund is issued for the unused days.',
        'Annual plans. Annual subscription fees are charged upfront for the full year. If you cancel an annual subscription before the end of the term, no refund is issued for the remaining months, except in the eligible circumstances listed below.',
        'Plan upgrades. When you upgrade from a lower to a higher plan mid-cycle, any unused credit from the current cycle is applied as a prorated credit toward the new plan. No cash refund is issued for this adjustment.',
      ]},
      { id: 'topup-credits', heading: 'Top-Up Credits', body: [
        'Top-up credit packs are non-refundable once purchased. Credits are valid for 12 months from the date of purchase and roll over month-to-month within that window.',
        'Promotional credits granted as part of an offer are not purchased credits, carry the conditions stated when they are granted, and are not refundable.',
        'If you believe credits were deducted in error, contact us at support@oyechats.com within 30 days and we will investigate.',
      ]},
      { id: 'eligible-refunds', heading: 'Eligible Refunds', body: [
        'A refund may be issued in the following circumstances:',
        '- Duplicate charge. If you were charged more than once for the same billing period due to a payment processing error, we will refund the duplicate amount in full.',
        '- Charge after cancellation. If you cancelled before a renewal date and were charged anyway, we will refund that charge in full.',
        '- Warranty remedy. If OyeChats cannot resolve a material non-conformance of the Services within a reasonable time, you may be entitled to a pro-rata refund of pre-paid fees for the unused remainder of your Subscription Term.',
        '- Service termination by OyeChats. If we terminate your subscription for reasons other than your breach, we will refund any pre-paid fees covering the period after termination.',
        '- Sub-processor objection. If you terminate affected Services because we could not resolve a reasonable data protection objection to a new sub-processor, you receive a pro-rata refund as set out in our Data Processing Addendum.',
        '- Erroneous billing. If we charged you an amount different from what was displayed at checkout due to a system error on our side, we will refund the difference.',
        '- Statutory rights. Nothing in this policy limits any rights you have under applicable law.',
      ]},
      { id: 'process', heading: 'How to Request a Refund', body: [
        'To request a refund, email us at support@oyechats.com with the subject line "Refund Request" and include:',
        '- The email address associated with your OyeChats account.',
        '- The date and amount of the charge in question.',
        '- The reason for your refund request.',
        '- Any supporting evidence (for example, a screenshot of a duplicate charge).',
        'We will acknowledge your request within 2 business days and aim to resolve eligible refunds within 7 business days. Approved refunds are processed back to the original payment method. Once we issue the refund, your bank or card issuer typically takes a further 5 to 7 business days to credit it, and that part is outside our control.',
      ]},
      { id: 'contact', heading: 'Contact', body: [
        `For questions about this policy, contact us at support@oyechats.com. For an unresolved grievance, contact our ${OFFICER.title}, ${OFFICER.name}, at ${ENTITY.legalName}, ${REGISTERED_ADDRESS}.`,
      ]},
    ],
  },
  {
    slug: 'cancellation',
    metaTitle: 'Cancellation Policy: How to Cancel',
    metaDescription:
      'How to cancel your OyeChats subscription, when the cancellation takes effect, what happens to your bots and data, and how final billing is handled.',
    title: 'Cancellation Policy',
    description: 'OyeChats Cancellation Policy, how to cancel your subscription and what happens next.',
    lastUpdated: '2026-08-17',
    sections: [
      { id: 'introduction', heading: 'Introduction', body: [
        'This Cancellation Policy explains how to cancel your OyeChats subscription and what happens when you do.',
      ]},
      { id: 'how-to-cancel', heading: 'How to Cancel', body: [
        'You can cancel your subscription at any time directly from your dashboard, no need to contact support. To cancel:',
        '- Log in to your account at app.oyechats.com.',
        '- Go to Billing in the left sidebar.',
        '- Select Cancel subscription.',
        '- Confirm the cancellation when prompted.',
        'You will see the cancellation reflected in your dashboard immediately, along with the date your access ends.',
        'If you are unable to cancel through the dashboard, contact us at support@oyechats.com and we will process the cancellation for you within 1 business day.',
      ]},
      { id: 'effect', heading: 'Effect of Cancellation', body: [
        'Cancellation stops automatic renewal, you will not be charged again after the current billing period ends. Your subscription remains fully active until the last day of the period you have already paid for.',
        'For example, if you are on a monthly plan billed on the 1st of each month and you cancel on the 15th, your account stays active until the end of that month. On the 1st of the following month, your plan downgrades to Free automatically.',
        'We do not issue refunds for unused days in the current billing period. See our Refund Policy for the specific circumstances where a refund may apply.',
      ]},
      { id: 'payment-mandate', heading: 'Your Payment Mandate', body: [
        'Cancelling in the dashboard takes effect immediately as an instruction to us: no further charge will be raised. The underlying payment mandate or subscription at our payment provider is closed shortly before your paid period ends, rather than on the day you cancel.',
        'This means that if you check your bank, card, or UPI app in the meantime, you may still see the OyeChats mandate listed as active. That is expected and no charge will be taken against it. The benefit of doing it this way is that if you change your mind before your period ends, you can reactivate with a single click instead of setting up a new mandate and re-authorising it.',
        'If you would prefer the mandate closed immediately, tell us at support@oyechats.com and we will do it. You will then need to re-authorise a new mandate if you later come back.',
      ]},
      { id: 'annual-plans', heading: 'Annual Plans', body: [
        'If you are on an annual plan, cancelling stops the renewal at the end of the annual term. Your subscription continues until the end of the year you have paid for.',
        'No refund is issued for the remaining months of an annual plan on voluntary cancellation. If you need to cancel an annual plan early due to exceptional circumstances, contact support@oyechats.com and we will review your case on its merits.',
      ]},
      { id: 'credits', heading: 'Credits After Cancellation', body: [
        'Plan credits. Monthly plan credits (included with your subscription) expire at the end of the billing cycle and are not carried forward after cancellation.',
        'Top-up credits. Top-up credits you have purchased separately are not affected by subscription cancellation. They remain in your account and are valid for 12 months from their purchase date.',
        'Promotional credits. Credits granted as part of a promotion end with the promotion and are not carried forward.',
      ]},
      { id: 'data', heading: 'Your Data After Cancellation', body: [
        'When your paid plan ends and your account downgrades to Free, your bots, knowledge base documents, chat history, and leads are retained in your account subject to the Free plan\'s limits. Note that the Free plan\'s 7-day window governs how far back conversation history is visible to you; it does not delete anything.',
        'If you want your data deleted rather than downgraded, write to support@oyechats.com and we will delete it within 30 days. If you close your account entirely, you can request an export of your data within 30 days of closure.',
      ]},
      { id: 'reactivation', heading: 'Reactivation', body: [
        'You can reactivate a paid subscription at any time by going to Billing in your dashboard and selecting a plan. If you reactivate before your cancellation takes effect at the end of the paid period, it is a single click and your existing payment mandate continues. After that, you will be asked to authorise payment again.',
        'Your previous configuration, bots, and knowledge base will still be there, provided you have not asked us to delete them.',
      ]},
      { id: 'contact', heading: 'Contact', body: [
        'For questions about cancellation or your account, contact us at support@oyechats.com.',
      ]},
    ],
  },
];
