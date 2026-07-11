export type LegalPage = {
  slug: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: { id: string; heading: string; body: string[] }[];
};

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    description: 'OyeChats Privacy Policy, how we collect, use, store, share, and protect your data.',
    lastUpdated: '2026-04-16',
    sections: [
      { id: 'introduction', heading: 'Introduction', body: [
        'OyeChats ("OyeChats," "we," "us," or "our") operates the OyeChats platform, including our website at oyechats.com, the customer dashboard at app.oyechats.com, our REST and WebSocket APIs, and the embeddable chat widget our customers deploy on their own websites (collectively, the "Service").',
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
        '- Account data: Name, work email address, organization name, hashed password, account role, and optionally a website URL when you register or invite team members.',
        '- Bot configuration: Bot name, system prompt, appearance settings, business hours, and the knowledge base content (documents you upload or URLs you ask us to crawl).',
        '- Conversation data: Chat messages between Visitors and the bot or live operators, timestamps, lead-capture form submissions (name, email, phone, company), and qualification signals derived from the conversation.',
        '- Visitor metadata: Truncated IP address, browser and device type, approximate geographic location (country/region), page URL the widget loaded on, referrer, and UTM campaign parameters.',
        '- Operator data: For customers using live chat, the names, emails, roles, and activity logs of human operators assigned to handle visitor conversations.',
        '- Usage and diagnostic data: Feature usage counters, API request volumes, error stack traces, performance metrics, and audit logs of administrative actions.',
        '- Billing data: Plan tier, billing cycle, invoice history, and the last four digits and brand of the payment instrument. Full card numbers and bank account details are processed and stored by our payment providers (Stripe and Razorpay) and never reach our servers.',
        '- Communications: Contents of emails or support tickets you send us.',
      ]},
      { id: 'how-we-use', heading: 'How We Use Your Information', body: [
        'We use the information described above for the following purposes:',
        '- Provide, maintain, and operate the Service, including running the retrieval-augmented generation pipeline that answers Visitor questions from your knowledge base.',
        '- Authenticate users, enforce plan limits, and prevent abuse.',
        '- Generate lead-qualification signals (for example, BANT or MEDDIC scoring) and surface those signals to the customer who owns the conversation.',
        '- Send transactional emails such as account verification, password resets, billing notifications, and webhook failure alerts.',
        '- Process payments, issue invoices, and meet tax and accounting obligations.',
        '- Monitor platform health, debug errors, and investigate security incidents.',
        '- Improve the Service through aggregated, anonymized analytics. We do not use Customer or Visitor conversation content to train large language models, ours or any third party\'s.',
        '- Comply with applicable law and respond to lawful requests from public authorities.',
      ]},
      { id: 'legal-bases', heading: 'Legal Bases for Processing (EEA / UK)', body: [
        'If you are in the European Economic Area or United Kingdom, we rely on the following legal bases under the GDPR / UK GDPR:',
        '- Performance of a contract: to deliver the Service you have signed up for.',
        '- Legitimate interests: to secure the Service, prevent abuse, debug errors, and conduct aggregated analytics, balanced against your rights and freedoms.',
        '- Consent: where required (for example, non-essential cookies on our marketing site). You may withdraw consent at any time.',
        '- Legal obligation: to retain billing records, respond to lawful authority requests, and meet tax requirements.',
      ]},
      { id: 'sub-processors', heading: 'Sub-processors and Data Sharing', body: [
        'We do not sell your personal information. We share data only with the sub-processors and partners we engage to deliver the Service, each under written agreements that require equivalent protections. Categories of sub-processors include cloud infrastructure and hosting, AI model providers, transactional email delivery, payment processors, and observability tooling.',
        'The current, itemized list, including each provider\'s name, purpose, and location, is maintained on our Subprocessors List page.',
        'We may add or change sub-processors from time to time. Material changes affecting how Customer data is handled will be communicated via email or in-product notice with at least 30 days\' advance notice where reasonably possible. We may also disclose information when required by law, to protect the rights, property, or safety of OyeChats, our customers, or others, or in connection with a corporate transaction such as a merger or acquisition, in which case we will notify affected customers.',
      ]},
      { id: 'international-transfers', heading: 'International Data Transfers', body: [
        'OyeChats is operated from India and uses sub-processors located in India, the United States, the European Union, and other jurisdictions. Where personal data is transferred out of the EEA, UK, or India, we rely on appropriate safeguards such as the European Commission\'s Standard Contractual Clauses, the UK International Data Transfer Addendum, or equivalent mechanisms permitted under the Digital Personal Data Protection Act, 2023. A copy of the relevant transfer mechanism is available on request.',
      ]},
      { id: 'data-retention', heading: 'Data Retention', body: [
        'We retain personal information only as long as needed for the purposes described in this policy:',
        '- Account data: Retained for the life of the account and deleted (or anonymized) within 30 days of account closure, except where longer retention is required by law.',
        '- Conversation history: Retained according to your plan, 7 days on Free, 30 days on Starter, 90 days on Standard, and unlimited on Enterprise, unless a shorter custom retention period is configured in your dashboard settings.',
        '- Knowledge base content: Retained until you delete it or close your account.',
        '- Diagnostic and error logs: Retained for up to 90 days.',
        '- Audit logs of administrative actions: Retained for up to 12 months.',
        '- Billing records and invoices: Retained for the period required under applicable tax and accounting law, typically 7 years.',
        '- Backups: Encrypted database backups are retained for up to 30 days before automatic rotation.',
        'You may request earlier deletion of Visitor or account data by writing to support@oyechats.com. Requests will be honored within 30 days unless a legal hold applies.',
      ]},
      { id: 'security', heading: 'Security', body: [
        'We apply technical and organizational measures designed to protect personal information against unauthorized access, alteration, disclosure, or destruction. These include encryption in transit (TLS 1.3 for all API and widget traffic), encryption at rest for primary databases and object storage, role-based access controls on production systems, audit logging of administrative actions, and dedicated environments for production and non-production workloads. Production access is restricted to a small number of authorized personnel under multi-factor authentication.',
        'No system can be guaranteed perfectly secure. If you discover a vulnerability, please report it to support@oyechats.com under our responsible disclosure policy.',
      ]},
      { id: 'data-breach', heading: 'Data Breach Notification', body: [
        'If we become aware of a personal data breach that is likely to result in a risk to the rights and freedoms of affected individuals, we will notify our customers without undue delay and, where required, the relevant supervisory authority within 72 hours of becoming aware. Customers are responsible for notifying their own Visitors and any applicable regulators in respect of Visitor data, with our reasonable assistance.',
      ]},
      { id: 'your-rights', heading: 'Your Rights', body: [
        'Depending on where you live, you have rights over your personal information. We honor verified requests regardless of residency wherever practical.',
        'If you are in the EEA, UK, or Switzerland (GDPR / UK GDPR): the rights to access, rectification, erasure, restriction of processing, data portability, and objection; the right not to be subject to solely automated decision-making with significant effects; and the right to lodge a complaint with your local supervisory authority.',
        'If you are a California resident (CCPA / CPRA): the rights to know what we collect, to delete personal information, to correct inaccurate information, to opt out of any sale or sharing of personal information (we do not sell or share for cross-context behavioral advertising), and to limit the use of sensitive personal information.',
        'If you are in India (DPDP Act, 2023): the rights to obtain a summary of personal data processed, to correction and erasure, to nominate another individual to exercise your rights in case of incapacity, and to grievance redressal.',
        'To exercise any of these rights, write to support@oyechats.com from the email associated with your account, or use the self-service deletion controls in your dashboard.',
      ]},
      { id: 'childrens-privacy', heading: 'Children\'s Privacy', body: [
        'OyeChats is intended for use by businesses and is not directed to children. We do not knowingly collect personal information from children under the age of 16 (or under 18 where required by local law, including India under the DPDP Act). If you believe a child has provided us personal information, please contact us and we will delete it.',
      ]},
      { id: 'cookies', heading: 'Cookies and Similar Technologies', body: [
        'We use a small number of strictly necessary cookies on oyechats.com and the customer dashboard for session management, authentication, and CSRF protection. We do not use third-party advertising or cross-site tracking cookies on our own properties, and the embeddable chat widget does not set cookies. For the full breakdown, see our Cookie Policy.',
      ]},
      { id: 'automated-decisions', heading: 'Automated Decision-Making', body: [
        'OyeChats generates qualification signals (such as BANT or MEDDIC scoring) and conversation summaries using large language models. These outputs are decision-support information for the customer who owns the conversation; they do not by themselves produce legal or similarly significant effects on a Visitor. Customers remain responsible for any subsequent decisions they take based on these signals.',
      ]},
      { id: 'third-party-links', heading: 'Third-Party Links', body: [
        'Our website and the chat widget may contain links to third-party sites or content provided by our customers. We are not responsible for the privacy practices of those third parties. You should review their privacy policies independently.',
      ]},
      { id: 'changes', heading: 'Changes to This Policy', body: [
        'We may update this Privacy Policy from time to time to reflect changes in our practices, the Service, or applicable law. The "Last updated" date at the top of this page indicates when it was last revised. Material changes will be communicated via email to account administrators or via in-product notice at least 30 days in advance where reasonably possible.',
      ]},
      { id: 'contact', heading: 'Contact Us', body: [
        'For privacy questions, requests, or complaints, please contact:',
        '- Privacy: support@oyechats.com',
        '- Security: support@oyechats.com',
        '- General: support@oyechats.com',
        'If you are in the EEA or UK and we do not resolve your concern, you may lodge a complaint with your local data protection authority. If you are in India, you may approach the Data Protection Board of India after first writing to our grievance address above.',
      ]},
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    description: 'OyeChats Terms of Service, the legal agreement governing your use of the platform.',
    lastUpdated: '2026-04-16',
    sections: [
      { id: 'introduction', heading: 'Introduction', body: [
        'These Terms of Service (the "Agreement") form a binding contract between OyeChats ("OyeChats," "we," "us," or "our") and the entity or person agreeing to them ("Customer," "you," or "your"). The Agreement governs your access to and use of the OyeChats platform, including our website at oyechats.com, the customer dashboard at app.oyechats.com, our REST and WebSocket APIs, and the embeddable chat widget (collectively, the "Services"). By signing up for an account, clicking "I agree," or otherwise using the Services, you confirm that you have read, understood, and agree to be bound by this Agreement. If you are agreeing on behalf of an organization, you represent that you have authority to bind that organization to this Agreement.',
      ]},
      { id: 'definitions', heading: 'Definitions', body: [
        '- "Account" means the account you create to access and administer the Services.',
        '- "Bot" means a chatbot instance you configure on the platform, identified by a unique bot key.',
        '- "Customer Data" means all data, content, and information that you, your Authorized Users, or your Visitors submit to or generate through the Services.',
        '- "Authorized User" means an employee, contractor, or operator you authorize to access the Services on your behalf.',
        '- "Visitor" means an end user who interacts with a Bot on a website where you have deployed the widget.',
        '- "Order" means the online sign-up, in-product upgrade flow, or written order form by which you subscribe to a plan.',
        '- "Subscription Term" means the period for which a plan is in effect under an Order.',
        '- "Third Party Apps" means software, integrations, or services provided by a party other than OyeChats that interoperate with the Services.',
      ]},
      { id: 'oyechats-services', heading: 'OyeChats Services', body: [
        'Subject to your compliance with this Agreement and timely payment of fees, OyeChats grants you a non-exclusive, non-transferable, worldwide right during the Subscription Term to access and use the Services for your internal business purposes.',
        'You will not, and will not permit any Authorized User or third party to:',
        '- Use the Services to send spam, malware, or content that is unlawful, infringing, harassing, or otherwise objectionable.',
        '- Reverse-engineer, decompile, or attempt to extract the source code of the Services, except to the extent applicable law expressly permits.',
        '- Resell, sublicense, or make the Services available to any third party other than your Authorized Users and the Visitors interacting with your Bots.',
        '- Access the Services to build a competing product or to benchmark performance for publication without our prior written consent.',
        '- Exceed documented rate limits, evade plan limits, or use the Services in a way that imposes a disproportionate load on our infrastructure.',
        '- Misrepresent the Bot\'s identity to Visitors. Bots must be reasonably identifiable as automated, in accordance with applicable law.',
      ]},
      { id: 'customer-data', heading: 'Customer Data and Customer Obligations', body: [
        'As between the parties, you retain all right, title, and interest in and to Customer Data. You grant OyeChats a worldwide, royalty-free license to host, copy, transmit, display, and process Customer Data solely as necessary to provide, secure, and support the Services. We will not use Customer Data, including conversation content, to train general-purpose foundation models.',
        'Where you process personal data of Visitors through the Services, you act as the controller and OyeChats acts as a processor on your behalf. The Data Processing Addendum available at oyechats.com/legal/dpa is incorporated by reference and governs that processing.',
      ]},
      { id: 'security', heading: 'Security', body: [
        'We will maintain commercially reasonable administrative, physical, and technical safeguards designed to protect the security, confidentiality, and integrity of Customer Data. These include encryption in transit (TLS 1.3), encryption at rest for primary databases and object storage, role-based access controls on production systems, audit logging, and a documented incident response process.',
      ]},
      { id: 'third-party', heading: 'Third-Party Platforms and Third Party Apps', body: [
        'The Services rely on, and can be configured to integrate with, Third Party Apps, including large language model providers (OpenAI, Google), payment processors (Stripe, Razorpay), email delivery (Brevo), object storage (Cloudflare R2), and any integrations you elect to connect.',
        'Third Party Apps are governed by their own terms and privacy policies. Enabling an integration authorizes OyeChats to transmit Customer Data to that Third Party App to the extent necessary to operate it.',
      ]},
      { id: 'ownership', heading: 'Ownership', body: [
        'OyeChats and its licensors retain all right, title, and interest in and to the Services, the Documentation, the widget code we publish, and all underlying software, models, designs, trademarks, and know-how. This Agreement grants you only a limited right to use the Services as expressly set out herein.',
        'If you provide feedback, suggestions, or ideas about the Services, you grant us a perpetual, irrevocable, royalty-free license to use them without restriction.',
      ]},
      { id: 'subscription', heading: 'Subscription Term, Fees and Payment', body: [
        'Plans and renewal. Your Subscription Term begins on the start date in your Order and continues for the period specified (monthly or annually). Unless either party gives notice of non-renewal at least 7 days before the end of the then-current term, the subscription renews automatically for successive periods of equal length at the then-current list price.',
        'Fees and taxes. Fees are charged in advance and are non-refundable except where expressly stated or required by law. All fees are exclusive of taxes.',
        'Payment. We process card and bank payments through Stripe (international) and Razorpay (India). You authorize us to charge your designated payment method on a recurring basis until you cancel.',
        'Usage and overages. Your plan includes monthly limits. If you exceed a limit, the Services may degrade gracefully, and we will notify you to upgrade. We do not silently charge overages without your consent.',
        'Price changes. We may adjust list prices for future Subscription Terms by giving you at least 30 days\' notice before your renewal.',
      ]},
      { id: 'term-and-termination', heading: 'Term and Termination', body: [
        'This Agreement begins when you create an Account and continues until all Subscription Terms expire or the Agreement is terminated as described below.',
        'Termination for convenience. You may cancel your subscription at any time from your dashboard. Cancellation stops automatic renewal; the Services remain available until the end of the paid period, and we do not refund partial periods.',
        'Termination for cause. Either party may terminate this Agreement for material breach by the other party if the breach is not cured within 14 days after written notice describing it.',
        'Effect of termination. On termination, your right to access the Services ceases. You may export Customer Data through the dashboard for up to 30 days after termination, after which we will delete or anonymize it in line with the retention schedule in the Privacy Policy.',
      ]},
      { id: 'limited-warranty', heading: 'Limited Warranty', body: [
        'OyeChats warrants that the Services will perform materially in accordance with the Documentation during the Subscription Term. As your sole and exclusive remedy for breach of this warranty, we will use commercially reasonable efforts to correct the non-conformity.',
        'EXCEPT FOR THE EXPRESS WARRANTY IN THIS SECTION, THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE." TO THE MAXIMUM EXTENT PERMITTED BY LAW, OYECHATS DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
      ]},
      { id: 'limitation-of-liability', heading: 'Limitation of Liability', body: [
        'TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, GOODWILL, OR DATA.',
        'EACH PARTY\'S AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THIS AGREEMENT WILL NOT EXCEED THE FEES YOU PAID OR WERE OBLIGATED TO PAY FOR THE SERVICES IN THE 12 MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.',
      ]},
      { id: 'indemnification', heading: 'Indemnification', body: [
        'By OyeChats. We will defend you against any third-party claim alleging that the Services, when used as authorized under this Agreement, infringe a third party\'s intellectual property right, and will pay damages and reasonable costs finally awarded against you or agreed in settlement.',
        'By Customer. You will defend OyeChats against any third-party claim arising out of Customer Data, your use of the Services in breach of this Agreement, or your failure to provide required notices to Visitors.',
      ]},
      { id: 'general-terms', heading: 'General Terms', body: [
        'Entire agreement. This Agreement, together with the Privacy Policy, DPA, and any Order, is the entire agreement between the parties.',
        'Amendments. We may update this Agreement from time to time. For material changes, we will provide at least 30 days\' notice.',
        'Governing law and venue. This Agreement is governed by the laws of India. The courts located in Bengaluru, Karnataka, India will have exclusive jurisdiction over any dispute.',
        'Force majeure. Neither party will be liable for any delay or failure to perform caused by events beyond its reasonable control.',
        'Notices. Notices to OyeChats must be sent to support@oyechats.com.',
      ]},
      { id: 'questions', heading: 'Questions', body: [
        'Questions about these Terms? Contact support@oyechats.com.',
      ]},
    ],
  },
  {
    slug: 'dpa',
    title: 'Data Processing Addendum',
    description: 'The OyeChats Data Processing Addendum governing how we process personal data on behalf of our customers.',
    lastUpdated: '2026-07-07',
    sections: [
      { id: 'introduction', heading: 'Introduction and Applicability', body: [
        'This Data Processing Addendum ("DPA") forms part of the Terms of Service (the "Agreement") between OyeChats, a brand of Digibranders Pvt Ltd, India ("OyeChats," "we," "us"), and the customer that has entered into the Agreement ("Customer," "you"). It applies whenever OyeChats processes Personal Data on your behalf in the course of providing the Services.',
        'This DPA is designed to satisfy the requirements that apply to a data processor under the Digital Personal Data Protection Act, 2023 (India) ("DPDP Act") and, where your processing is subject to it, the EU General Data Protection Regulation 2016/679 and the UK GDPR (together, "GDPR").',
      ]},
      { id: 'roles', heading: 'Roles of the Parties', body: [
        'For Personal Data processed under this DPA, you are the Controller (Data Fiduciary under the DPDP Act) and OyeChats is your Processor (Data Processor). You determine the purposes and means of the processing.',
        'Separately, OyeChats acts as an independent Controller for the account data of its own customers (such as your login credentials, billing records, and support correspondence). That processing is described in our Privacy Policy and is not governed by this DPA.',
      ]},
      { id: 'scope', heading: 'Scope and Purpose of Processing', body: [
        'OyeChats processes Personal Data for the following purposes and no others:',
        '- Operating the chat widget and generating AI responses to Visitor messages.',
        '- Storing chat transcripts, lead capture submissions, and Visitor metadata.',
        '- Routing conversations to your operators for live chat and delivering the notifications you configure.',
        '- Producing analytics and lead qualification scores.',
        '- Securing, supporting, and troubleshooting the Services.',
      ]},
      { id: 'security', heading: 'Security Measures', body: [
        'OyeChats implements and maintains appropriate technical and organizational measures designed to protect Personal Data, including:',
        '- Encryption of Personal Data in transit using TLS.',
        '- Encryption at rest for primary databases and object storage.',
        '- Logical tenant isolation.',
        '- Role-based access controls and least-privilege access to production systems.',
        '- Audit logging of administrative and operator actions.',
        '- A documented incident response process.',
      ]},
      { id: 'subprocessors', heading: 'Sub-processors', body: [
        'You provide a general authorization for OyeChats to engage Sub-processors to deliver the Services. The Sub-processors we currently engage are:',
        '- DigitalOcean: Application server and managed database hosting. (India / United States)',
        '- Cloudflare (R2): Object storage and CDN delivery of the embeddable widget. (Global edge network)',
        '- OpenAI: Large language model inference and embedding generation. (United States)',
        '- Google (Gemini API): Large language model inference and embedding generation. (United States)',
        '- Brevo: Transactional email delivery. (European Union)',
        '- Razorpay: Payment processing. (India)',
        '- Sentry: Application error monitoring. (United States)',
        '- Langfuse: LLM observability. (European Union)',
        'We will give you at least 30 days\' advance notice before adding or replacing a Sub-processor that processes Personal Data.',
      ]},
      { id: 'breach-notification', heading: 'Personal Data Breach Notification', body: [
        'OyeChats will notify you without undue delay, and in any event within 72 hours, after becoming aware of a Personal Data Breach affecting Personal Data processed on your behalf.',
        'We will reasonably cooperate with your own notification obligations to supervisory authorities and to affected Data Subjects.',
      ]},
      { id: 'retention-deletion', heading: 'Data Retention and Deletion', body: [
        'During the term of the Agreement, Personal Data is retained according to the retention settings available in the dashboard and the schedule described in the Privacy Policy.',
        'On termination or expiry of the Agreement, you may export Customer Data for up to 30 days. After that export window, OyeChats will delete or irreversibly anonymize all Personal Data processed on your behalf within 30 days.',
      ]},
      { id: 'transfers', heading: 'International Data Transfers', body: [
        'Where Personal Data subject to the GDPR is transferred to a country without an adequacy decision, OyeChats relies on appropriate safeguards, typically the European Commission\'s Standard Contractual Clauses.',
      ]},
      { id: 'audits', heading: 'Audit Rights', body: [
        'OyeChats will make available to you the information reasonably necessary to demonstrate compliance with this DPA. In the first instance, we satisfy audit requests through written responses to security and privacy questionnaires and copies of relevant policy documentation.',
      ]},
      { id: 'contact', heading: 'Contact', body: [
        'Questions about this DPA can be sent to support@oyechats.com.',
      ]},
    ],
  },
  {
    slug: 'subprocessors',
    title: 'Subprocessors List',
    description: 'The current list of third-party sub-processors OyeChats engages to deliver the Services.',
    lastUpdated: '2026-04-16',
    sections: [
      { id: 'overview', heading: 'Overview', body: [
        'A "sub-processor" is a third party we engage to process Customer Data on our behalf in order to deliver the OyeChats Services. Each one is engaged under a written agreement that requires data protection terms at least as protective as those in our Privacy Policy and Data Processing Addendum.',
      ]},
      { id: 'infrastructure', heading: 'Infrastructure and Hosting', body: [
        '- DigitalOcean: Primary application servers and managed PostgreSQL database hosting. (United States, Bangalore region for Enterprise)',
        '- Cloudflare: Object storage for uploaded knowledge base files via R2, and CDN delivery of the embeddable widget bundle. (Global edge network)',
        '- Vercel: Hosting for the marketing site (oyechats.com) and customer dashboard front-end (app.oyechats.com). (United States)',
      ]},
      { id: 'ai-providers', heading: 'AI Model Providers', body: [
        'Conversation messages and knowledge base content are sent to these providers at query time. We do not authorize them to use Customer Data to train general-purpose foundation models.',
        '- OpenAI: Primary large language model inference and text embedding generation. (United States)',
        '- Google (Gemini API): Fallback large language model inference. (United States)',
      ]},
      { id: 'communications', heading: 'Communications and Notifications', body: [
        '- Brevo (Sendinblue): Transactional email delivery. (European Union)',
      ]},
      { id: 'payments', heading: 'Payment Processing', body: [
        'Card numbers and bank account details are processed and stored by these providers and do not reach OyeChats servers.',
        '- Razorpay: Card, UPI, net-banking, and international payment processing. (India)',
      ]},
      { id: 'observability', heading: 'Monitoring and Observability', body: [
        '- Sentry: Application error monitoring and diagnostics. (United States)',
        '- Langfuse: LLM observability. (European Union)',
      ]},
      { id: 'integrations', heading: 'Optional Customer-Enabled Integrations', body: [
        'Customers may choose to connect third-party tools (such as CRMs, ticketing systems, calendars, or analytics services) to their account. These integrations are processors of Customer Data acting on the customer\'s direct instructions.',
      ]},
      { id: 'updates', heading: 'Updates to This List', body: [
        'We may add, remove, or replace sub-processors from time to time. For material changes, we will provide at least 30 days\' advance notice by email to account administrators or by in-product notice.',
      ]},
      { id: 'contact', heading: 'Contact', body: [
        'Questions about our sub-processors? Write to support@oyechats.com and we will respond within 14 days.',
      ]},
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy',
    description: 'How OyeChats uses cookies and similar technologies.',
    lastUpdated: '2026-04-16',
    sections: [
      { id: 'introduction', heading: 'Introduction', body: [
        'This Cookie Policy explains how OyeChats uses cookies and similar technologies on our marketing site at oyechats.com, the customer dashboard at app.oyechats.com, and the embeddable chat widget our customers deploy on their own websites.',
      ]},
      { id: 'what-are-cookies', heading: 'What are cookies?', body: [
        'Cookies are small text files a website places on your device so it can remember you between visits. "Similar technologies" covers anything that does roughly the same job: localStorage and sessionStorage in the browser, the IndexedDB API, pixel tags in emails, and software development kits (SDKs).',
      ]},
      { id: 'cookies-we-use', heading: 'Cookies on our marketing site and dashboard', body: [
        'We use a small number of strictly-necessary first-party cookies. We do not run advertising cookies or cross-site tracking pixels on our own properties.',
        '- oyechats_session: Keeps you signed in to the customer dashboard between page loads and protects against session fixation. (Session, cleared on logout)',
        '- oyechats_csrf: Protects state-changing requests from cross-site request forgery attacks. (Session)',
        '- oyechats_consent: Remembers your cookie banner choice on the marketing site. (6 months)',
      ]},
      { id: 'widget', heading: 'The embeddable chat widget', body: [
        'The OyeChats chat widget that customers embed on their own websites does not set cookies. To keep a conversation continuous within the same browser, the widget stores a single anonymous session identifier in localStorage under the key oyechats_session_id.',
      ]},
      { id: 'your-choices', heading: 'Your choices and controls', body: [
        'You can control cookies in several ways:',
        '- Browser settings: most browsers let you block, delete, or be warned about cookies on a per-site basis.',
        '- Marketing site banner: if a consent banner is shown on oyechats.com in your region, you can accept or decline non-essential categories there.',
        '- Widget storage mode: if you operate a site that embeds the OyeChats widget, you can enable cookie-free mode from your dashboard under Settings > Privacy.',
        'Blocking strictly-necessary cookies will break sign-in and other core flows on the dashboard.',
      ]},
      { id: 'do-not-track', heading: 'Do Not Track and Global Privacy Control', body: [
        'Browsers can transmit a Do Not Track (DNT) header or a Global Privacy Control (GPC) signal. We honor GPC where transmitted: when GPC is detected, we treat it as an opt-out of any sale or sharing of personal information for the purposes covered by the CCPA / CPRA.',
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
    slug: 'refund',
    title: 'Refund Policy',
    description: 'OyeChats Refund Policy, when refunds apply and how to request one.',
    lastUpdated: '2026-06-25',
    sections: [
      { id: 'introduction', heading: 'Introduction', body: [
        'This Refund Policy applies to all payments made to OyeChats, a brand of Digibranders Pvt Ltd. It should be read together with our Terms of Service.',
      ]},
      { id: 'general', heading: 'General Policy', body: [
        'All fees paid to OyeChats are non-refundable except in the specific circumstances described below. This includes fees for subscription plans (monthly or annual) and one-time top-up credit purchases.',
        'We encourage you to evaluate OyeChats using our free plan before upgrading to a paid subscription. Where a free trial is offered on a plan, it provides a full-featured experience before any charge is made.',
      ]},
      { id: 'subscriptions', heading: 'Subscription Payments', body: [
        'Monthly plans. Monthly subscription fees are charged in advance at the start of each billing cycle. If you cancel during a billing cycle, your subscription remains active until the end of the paid period; no partial-month refund is issued for the unused days.',
        'Annual plans. Annual subscription fees are charged upfront for the full year. If you cancel an annual subscription before the end of the term, no refund is issued for the remaining months, except in the eligible circumstances listed below.',
        'Plan upgrades. When you upgrade from a lower to a higher plan mid-cycle, any unused credit from the current cycle is applied as a prorated credit toward the new plan. No cash refund is issued for this adjustment.',
      ]},
      { id: 'topup-credits', heading: 'Top-Up Credits', body: [
        'Top-up credit packs are non-refundable once purchased. Credits are valid for 12 months from the date of purchase and roll over month-to-month within that window.',
        'If you believe credits were deducted in error, contact us at support@oyechats.com within 30 days and we will investigate.',
      ]},
      { id: 'eligible-refunds', heading: 'Eligible Refunds', body: [
        'A refund may be issued in the following circumstances:',
        '- Duplicate charge. If you were charged more than once for the same billing period due to a payment processing error, we will refund the duplicate amount in full.',
        '- Warranty remedy. If OyeChats cannot resolve a material non-conformance of the Services within a reasonable time, you may be entitled to a pro-rata refund of pre-paid fees for the unused remainder of your Subscription Term.',
        '- Service termination by OyeChats. If we terminate your subscription for reasons other than your breach, we will refund any pre-paid fees covering the period after termination.',
        '- Erroneous billing. If we charged you an amount different from what was displayed at checkout due to a system error on our side, we will refund the difference.',
        '- Statutory rights. Nothing in this policy limits any rights you have under applicable law.',
      ]},
      { id: 'process', heading: 'How to Request a Refund', body: [
        'To request a refund, email us at support@oyechats.com with the subject line "Refund Request" and include:',
        '- The email address associated with your OyeChats account.',
        '- The date and amount of the charge in question.',
        '- The reason for your refund request.',
        '- Any supporting evidence (for example, a screenshot of a duplicate charge).',
        'We will acknowledge your request within 2 business days and aim to resolve eligible refunds within 7 business days. Approved refunds are processed back to the original payment method.',
      ]},
      { id: 'contact', heading: 'Contact', body: [
        'For questions about this policy, contact us at support@oyechats.com.',
      ]},
    ],
  },
  {
    slug: 'cancellation',
    title: 'Cancellation Policy',
    description: 'OyeChats Cancellation Policy, how to cancel your subscription and what happens next.',
    lastUpdated: '2026-06-25',
    sections: [
      { id: 'introduction', heading: 'Introduction', body: [
        'This Cancellation Policy explains how to cancel your OyeChats subscription and what happens when you do.',
      ]},
      { id: 'how-to-cancel', heading: 'How to Cancel', body: [
        'You can cancel your subscription at any time directly from your dashboard, no need to contact support. To cancel:',
        '- Log in to your account at app.oyechats.com.',
        '- Go to Billing in the left sidebar.',
        '- Click Manage Subscription and select Cancel Plan.',
        '- Confirm the cancellation when prompted.',
        'If you are unable to cancel through the dashboard, contact us at support@oyechats.com and we will process the cancellation for you within 1 business day.',
      ]},
      { id: 'effect', heading: 'Effect of Cancellation', body: [
        'Cancellation stops automatic renewal, you will not be charged again after the current billing period ends. Your subscription remains fully active until the last day of the period you have already paid for.',
        'For example, if you are on a monthly plan billed on the 1st of each month and you cancel on the 15th, your account stays active until the end of that month. On the 1st of the following month, your plan downgrades to Free automatically.',
        'We do not issue refunds for unused days in the current billing period. See our Refund Policy for the specific circumstances where a refund may apply.',
      ]},
      { id: 'annual-plans', heading: 'Annual Plans', body: [
        'If you are on an annual plan, cancelling stops the renewal at the end of the annual term. Your subscription continues until the end of the year you have paid for.',
        'No refund is issued for the remaining months of an annual plan on voluntary cancellation. If you need to cancel an annual plan early due to exceptional circumstances, contact support@oyechats.com and we will review your case on its merits.',
      ]},
      { id: 'credits', heading: 'Credits After Cancellation', body: [
        'Plan credits. Monthly plan credits (included with your subscription) expire at the end of the billing cycle and are not carried forward after cancellation.',
        'Top-up credits. Top-up credits you have purchased separately are not affected by subscription cancellation. They remain in your account and are valid for 12 months from their purchase date.',
      ]},
      { id: 'data', heading: 'Your Data After Cancellation', body: [
        'When your paid plan ends and your account downgrades to Free, your bots, knowledge base documents, chat history, and leads are retained in your account subject to the Free plan\'s storage limits.',
        'If you close your account entirely (rather than just cancelling the subscription), you may export your data from the dashboard for up to 30 days after account closure.',
      ]},
      { id: 'reactivation', heading: 'Reactivation', body: [
        'You can reactivate a paid subscription at any time by going to Billing in your dashboard and selecting a plan. Your previous configuration, bots, and knowledge base will still be there if you reactivate before your data retention period expires.',
      ]},
      { id: 'contact', heading: 'Contact', body: [
        'For questions about cancellation or your account, contact us at support@oyechats.com.',
      ]},
    ],
  },
];
