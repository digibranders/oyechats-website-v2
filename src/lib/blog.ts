export type BlogAccent = 'blue' | 'violet' | 'emerald' | 'amber' | 'rose';

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'code'; lang?: string; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  dateISO: string;
  readMinutes: number;
  author: { name: string; initials: string; role: string };
  accent: BlogAccent;
  tags: string[];
  image: string;
  content: BlogBlock[];
  /** Optional FAQ block, rendered at the end of the post and emitted as
   *  FAQPage JSON-LD for AI answer engines / rich results. */
  faq?: { q: string; a: string }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'ai-chatbot-cost',
    title: 'How much does an AI chatbot actually cost? A 2026 breakdown in ₹ and $',
    description:
      'A transparent teardown of what an AI chatbot for your website really costs each month — the pricing models, the hidden usage fees, and real numbers for a small team.',
    category: 'Buyer Guide',
    date: 'July 16, 2026',
    dateISO: '2026-07-16',
    readMinutes: 8,
    author: { name: 'OyeChats Team', initials: 'OC', role: 'Product' },
    accent: 'emerald',
    tags: ['Pricing', 'AI chatbot', 'Buyer guide'],
    image: '/images/blog/ai-chatbot-cost-v1.webp',
    content: [
      { type: 'p', text: 'A small team can run a capable AI chatbot on its website for anywhere from nothing to a few tens of dollars — a few thousand rupees — a month on a flat plan, and a good deal more on usage-based pricing. The wide gap comes down to one thing: whether a vendor charges you a predictable subscription or bills you per resolved conversation. Usage-based tools look cheap on the pricing page and get expensive the month your traffic spikes. This is the trap that surprises people, so it is worth walking through slowly.' },
      { type: 'h2', text: 'How much does an AI chatbot cost per month?' },
      { type: 'p', text: 'For a small business, a flat-rate AI website chatbot typically ranges from a free tier up to roughly a few thousand rupees — on the order of $10 to $40 — a month, depending on how many conversations, seats, and trained documents you need. Resolution-priced enterprise tools instead charge per successfully answered conversation, which can run far higher once volume climbs. The right question is not "what is the sticker price" but "what does my bill look like on a busy month".' },
      { type: 'h2', text: 'The three pricing models you will actually meet' },
      { type: 'p', text: 'Almost every chatbot on the market bills in one of three ways. Knowing which one you are looking at tells you more than any headline number.' },
      { type: 'h3', text: 'Flat subscription' },
      { type: 'p', text: 'You pay a fixed monthly fee for a tier, and usage inside that tier is included. Your bill is the same whether you have a quiet week or a launch week. This is the easiest model to budget against, and it is how OyeChats prices: a Free plan to start, then Starter, Standard, and Professional tiers you can read on the [pricing page](/pricing).' },
      { type: 'h3', text: 'Per-seat' },
      { type: 'p', text: 'You pay for each human agent who logs in. Fine when your team is small and stable, painful when support is seasonal or you want the whole company to be able to jump into a live chat. Watch for tools that combine a per-seat fee with a usage fee on top.' },
      { type: 'h3', text: 'Per-resolution or per-conversation' },
      { type: 'p', text: 'You pay each time the bot resolves a conversation. This is common at the enterprise end. It aligns cost with value in theory, but it also means a viral post or a bad-news day, exactly when volume spikes, is also when your invoice spikes. Model your worst month, not your average one, before you sign.' },
      { type: 'h2', text: 'What transparent pricing looks like' },
      { type: 'p', text: 'Whatever tool you choose, favour one whose plans you can read on a single page without booking a sales call. The healthiest signs are a public pricing page, a real free tier, plain monthly figures, and a clear limit on each plan, so you can predict next month from this month. If the only way to learn the price is a demo, treat that as information too.' },
      { type: 'p', text: 'OyeChats, for example, runs on flat monthly plans with a free tier and separate India (INR) and international (USD) rates. The current figures live on the [pricing page](/pricing) rather than in this article on purpose: prices should have one source of truth that stays up to date, not a number copied into a blog post that quietly goes stale.' },
      { type: 'h2', text: 'The costs that never appear on the pricing page' },
      { type: 'p', text: 'The subscription is rarely the whole bill. Four line items quietly decide whether a cheap plan stays cheap.' },
      { type: 'ol', items: [
        'Overage. What happens on the message, conversation, or document that goes past your tier? A flat plan absorbs it; a metered plan invoices it.',
        'Seats. If everyone who might handle a live handoff needs a paid login, a "cheap" per-seat tool gets expensive as the team grows.',
        'Retraining and re-crawls. Some tools charge to re-index your site when your docs change. Ask whether keeping the bot current is included.',
        'Integrations. Webhooks, a REST API, and CRM connections are sometimes locked to the top tier. If routing leads into your stack matters, price the tier that unlocks it, not the entry one.',
      ] },
      { type: 'h2', text: 'Is an AI chatbot worth the cost?' },
      { type: 'p', text: 'For most teams handling repeat questions or qualifying inbound leads, yes — the monthly fee is small next to a single support hire or a single closed deal. Gartner projects that by 2029 agentic AI will autonomously resolve [80% of common customer-service issues](https://www.gartner.com/en/newsroom/press-releases/2025-03-05-gartner-predicts-agentic-ai-will-autonomously-resolve-80-percent-of-common-customer-service-issues-without-human-intervention-by-20290) and cut related operational costs by around 30%. Even a fraction of that, on an entry-level flat plan, pays for itself quickly.' },
      { type: 'p', text: 'The honest caveat, also from Gartner, is that more than 40% of agentic-AI projects are expected to be scrapped by the end of 2027 — almost always because they were bought without a clear job to do. So the cost question and the value question are the same question. Pick the smallest plan that covers a specific, measurable task, prove it deflects tickets or books calls, then move up a tier. That is a far better path than buying the biggest plan and hoping.' },
      { type: 'h2', text: 'How to choose the plan that fits' },
      { type: 'ol', items: [
        'Estimate your busy-month conversation volume, not your average, and check what a metered plan would bill at that number.',
        'Count how many humans truly need a login versus how many just need to read transcripts.',
        'Confirm whether retraining on updated docs is included or billed.',
        'Check which tier unlocks the webhook or API you need to move leads into your CRM.',
        'Start on the smallest plan that clears those four, and only upgrade once the bot has earned it.',
      ] },
      { type: 'p', text: 'An AI chatbot should be one of the more predictable lines in your software budget, not one of the scary ones. If you cannot tell what next month will cost from this month, that is not a pricing detail — it is the whole decision. Once you have picked a plan, the next step is [training the bot on your own website](/blog/train-ai-chatbot-website).' },
    ],
    faq: [
      { q: 'How much does an AI chatbot cost per month?', a: 'For a small team, a flat-rate AI website chatbot usually ranges from a free tier up to roughly a few thousand rupees a month (on the order of $10 to $40), depending on conversation volume, seats, and how many documents it is trained on. Enterprise tools that charge per resolved conversation can cost significantly more at higher volumes.' },
      { q: 'Are there free AI chatbots for websites?', a: 'Yes. Several platforms, including OyeChats, offer a free plan that lets you train one bot on your website and run it end to end, which is enough to validate whether it deflects tickets or captures leads before you pay.' },
      { q: 'Why is usage-based chatbot pricing risky for small businesses?', a: 'Per-resolution or per-conversation pricing ties your bill to traffic, so the busy months — a launch, a viral post, an outage — are also your most expensive months. A flat subscription keeps the cost predictable regardless of volume.' },
      { q: 'What hidden costs should I watch for?', a: 'Overage fees past your tier, per-seat charges for every human agent, re-training or re-crawl fees when your content changes, and integrations (webhooks, API, CRM) locked behind higher tiers. Price the tier that includes what you actually need.' },
    ],
  },
  {
    slug: 'best-ai-chatbot-india',
    title: 'The best AI chatbot for Indian SMBs in 2026 (pricing in ₹, WhatsApp, and Hindi)',
    description:
      'What Indian small businesses should look for in an AI support and lead-gen chatbot — rupee pricing, WhatsApp reach, regional languages, and a practical shortlist.',
    category: 'Buyer Guide',
    date: 'July 15, 2026',
    dateISO: '2026-07-15',
    readMinutes: 9,
    author: { name: 'OyeChats Team', initials: 'OC', role: 'Product' },
    accent: 'amber',
    tags: ['India', 'AI chatbot', 'SMB', 'WhatsApp'],
    image: '/images/blog/best-ai-chatbot-india-v1.webp',
    content: [
      { type: 'p', text: 'If you run a small business in India, the best AI chatbot is the one that answers in your customer\'s language, prices in rupees you can predict, and turns website visitors into qualified leads without a form. That sounds obvious, but most chatbot roundups are written for US enterprises and quietly assume dollar budgets, English-only support, and a dedicated ops team. This guide is written the other way around.' },
      { type: 'h2', text: 'What should an Indian SMB look for in an AI chatbot?' },
      { type: 'p', text: 'For an Indian small business, the four things that matter most are rupee-denominated flat pricing, support for Hindi and regional languages, a clean path from website chat to WhatsApp follow-up, and lead qualification built in. Ticket deflection and a fast install matter too, but those four are what separate a tool built for this market from one that merely tolerates it.' },
      { type: 'h2', text: 'Why the timing is good' },
      { type: 'p', text: 'India is one of the fastest-growing conversational-AI markets in the world. The India chatbot market was valued at around [USD 243 million in 2024 and is projected to reach roughly USD 1.47 billion by 2033](https://www.imarcgroup.com/india-chatbot-market), a compound growth rate near 20% a year. That growth is not coming from large enterprises alone; it is D2C brands, clinics, coaching institutes, SaaS startups, and local service businesses adding chat to sites that used to have nothing but a contact form.' },
      { type: 'p', text: 'The practical takeaway is that the tooling has finally caught up with small budgets. You no longer need an enterprise contract to put a competent AI agent on your site.' },
      { type: 'h2', text: 'Rupee pricing you can actually predict' },
      { type: 'p', text: 'The single biggest trap for an Indian SMB is a tool priced per resolved conversation in dollars. It looks affordable at ten conversations a day and becomes a real line item the month a campaign lands. Prefer a flat monthly plan quoted in rupees, so a busy month costs the same as a quiet one.' },
      { type: 'p', text: 'As a reference point, OyeChats uses flat monthly pricing in rupees with a free tier, and charges the same whether you are in Mumbai or Madurai. The live figures are on the [pricing page](/pricing) so they stay current. Whatever you choose, insist on seeing the rupee price before the sales call, not after.' },
      { type: 'h2', text: 'WhatsApp is where your customer already is' },
      { type: 'p', text: 'India is the largest WhatsApp market on earth, and for most Indian buyers a chat on your website and a message on WhatsApp are the same conversation. The best setup answers instantly on your site, and when a visitor wants a human or a follow-up, continues the thread on WhatsApp rather than forcing an email. Even if you start with website chat only, choose a tool whose roadmap and integrations point toward that unified experience.' },
      { type: 'h2', text: 'Hindi, and the languages after Hindi' },
      { type: 'p', text: 'A support bot that only speaks English is leaving trust on the table. Indian customers switch between English, Hindi, and a regional language mid-sentence, and a good bot should follow. Modern language models handle Hindi and major Indian languages well, so the question is less "can it" and more "is the bot allowed to answer in the language the customer used". Test this before you buy: open the widget, ask a question in Hindi, and see whether the answer comes back in Hindi or awkwardly in English.' },
      { type: 'h2', text: 'It should qualify leads, not just deflect tickets' },
      { type: 'p', text: 'Deflecting repetitive questions about pricing, shipping, or GST is valuable, but for a growing business the bigger prize is capturing the visitor who is ready to buy. A chatbot that scores intent as the conversation happens, and flags the hot leads for a callback, turns your support widget into a sales channel. This is the difference between a tool that saves you time and one that makes you money — see [how conversational BANT scoring works](/blog/bant-scoring-ai-chatbot) for the mechanics.' },
      { type: 'h2', text: 'A practical shortlist for Indian SMBs' },
      { type: 'p', text: 'Rather than rank tools by logo size, judge any candidate against this checklist. The right chatbot for your business is the one that clears all six.' },
      { type: 'ol', items: [
        'Flat monthly pricing quoted in rupees, with a free plan to validate before you pay.',
        'Answers grounded in your own website and documents, so it never invents policies or prices.',
        'Hindi and regional-language answers, tested live in the widget.',
        'A clear path from website chat to WhatsApp or a human handoff.',
        'Built-in lead qualification that flags buyers, not just a transcript log.',
        'A ten-minute install with a single script tag, and GST-compliant billing.',
      ] },
      { type: 'p', text: 'Start with the free tier of one or two tools, train each on your real website, and ask them the ten questions your customers actually send. The winner is usually obvious within an afternoon. When you are ready, [training a bot on your own site](/blog/train-ai-chatbot-website) takes about ten minutes.' },
    ],
    faq: [
      { q: 'What is the best AI chatbot for a small business in India?', a: 'The best AI chatbot for an Indian SMB is one with flat rupee pricing, answers grounded in your own website, Hindi and regional-language support, a path to WhatsApp or human handoff, and built-in lead qualification. Shortlist tools against those criteria and validate on a free plan before paying.' },
      { q: 'How much does an AI chatbot cost in India?', a: 'Flat-rate plans for Indian small businesses commonly start with a free tier and run to a few thousand rupees per month. Avoid tools priced per resolved conversation in dollars, since your bill then rises with traffic and is hard to predict.' },
      { q: 'Can an AI chatbot answer in Hindi and regional languages?', a: 'Yes. Modern language models handle Hindi and major Indian languages well. The thing to verify is whether the specific bot is configured to reply in the language the customer used — test it live in the widget before you buy.' },
      { q: 'Can a website chatbot connect to WhatsApp?', a: 'Many can continue a conversation on WhatsApp or hand off to a human there, which matters in India where WhatsApp is the primary channel. If a unified website-plus-WhatsApp experience is important, confirm it is supported or on the roadmap before choosing a tool.' },
    ],
  },
  {
    slug: 'train-ai-chatbot-website',
    title: 'How to train an AI chatbot on your own website, step by step',
    description:
      'A practical, no-jargon guide to turning your existing website and docs into an AI chatbot that answers in your voice and only from your content.',
    category: 'How-to',
    date: 'July 14, 2026',
    dateISO: '2026-07-14',
    readMinutes: 9,
    author: { name: 'AI Team', initials: 'AI', role: 'Engineering' },
    accent: 'blue',
    tags: ['RAG', 'Training', 'Getting started'],
    image: '/images/blog/train-ai-chatbot-v1.webp',
    content: [
      { type: 'p', text: 'You do not train an AI chatbot on your website the way you might imagine — by feeding pages into a model and waiting for it to memorise them. Modern support and sales bots use retrieval, not memorisation. You point the bot at your content, it indexes that content, and at question time it looks up the most relevant passages and answers from them. The practical upshot is that "training" is mostly about giving the bot clean content and good boundaries, and it takes minutes, not weeks.' },
      { type: 'h2', text: 'How do you train a chatbot on your own website?' },
      { type: 'p', text: 'You give the bot your URLs and documents, it crawls and splits them into small passages, converts each passage into a searchable vector, and stores them. When a visitor asks something, the bot retrieves the closest passages and writes an answer grounded in them. You are not editing the model — you are curating the library it reads from, which means you stay in control of every fact it can state.' },
      { type: 'h2', text: 'Step 1 — Point the bot at your content' },
      { type: 'p', text: 'Start with the pages that already answer real questions: your docs, help center, pricing, FAQ, and key product pages. Most tools, OyeChats included, take a root URL and crawl outward, so you rarely list pages by hand. Add PDFs or a knowledge-base export if the answers live there too. The rule of thumb is simple — if a customer emails to ask it, the answer should be in the crawl.' },
      { type: 'h2', text: 'Step 2 — Let it chunk and embed' },
      { type: 'p', text: 'Behind the scenes the bot splits each page into passages a few sentences long and turns every passage into an embedding, a numerical representation of its meaning. This is what lets it match a question like "how do I cancel" to a doc that says "ending your subscription", even though the words differ. You do not configure any of this by hand; it is the part the platform handles for you.' },
      { type: 'p', text: 'The one thing worth knowing is that cleaner source content produces better retrieval. A page that answers one thing clearly beats a sprawling page that buries the answer under marketing copy. If you improve any content before launch, improve the pages customers actually ask about.' },
      { type: 'h2', text: 'Step 3 — Set the boundaries so it does not make things up' },
      { type: 'p', text: 'Grounding the bot in your content is also what keeps it honest. A well-built retrieval bot answers from the passages it found and says "I am not sure" when it finds nothing relevant, rather than inventing a confident wrong answer. Configure it to refuse gracefully, hand off to a human on low confidence, and never guess at prices, policies, or availability. This single setting is the difference between a helpful bot and a liability.' },
      { type: 'h2', text: 'Step 4 — Give it your voice' },
      { type: 'p', text: 'Retrieval decides what the bot knows; a short instruction decides how it sounds. Tell it who it is, how formal to be, and what to do at the edges — when to offer a demo, when to escalate, what never to promise. You are not retraining anything here, just prompting the response layer. A paragraph of clear guidance usually gets you a bot that reads like your team wrote it. You can see the full set of controls on the [features page](/features).' },
      { type: 'h2', text: 'Step 5 — Test with real questions, then install' },
      { type: 'p', text: 'Before you ship, ask the bot the ten questions your team actually hears every week, plus a few it should refuse. Fix gaps by improving the underlying page, not by hard-coding an answer — that keeps a single source of truth. When it holds up, installing is a one-line script tag on your site, and the bot goes live on every page at once.' },
      { type: 'code', lang: 'html', text: '<script src="https://cdn.oyechats.com/widget.js" data-bot="your-bot-id" async></script>' },
      { type: 'h2', text: 'How do you keep the bot accurate over time?' },
      { type: 'p', text: 'Re-crawl whenever your content changes, and review real transcripts weekly for questions the bot missed or answered thinly. Because the bot reads from your content rather than a frozen snapshot inside a model, keeping it current is a documentation task, not a retraining project — update the page, re-index, and the next answer is right.' },
      { type: 'ul', items: [
        'Re-index after any pricing, policy, or feature change so answers never lag your site.',
        'Read a sample of transcripts weekly; every unanswered question is a page to write or sharpen.',
        'Watch the low-confidence and handoff rate — a rising one usually means a content gap, not a model problem.',
      ] },
      { type: 'p', text: 'Training an AI chatbot on your own website is really an exercise in curation. Give it good content, clear boundaries, and your voice, and the retrieval does the rest. The teams who get the most out of it treat the bot as a mirror of their documentation — improve the docs, and the bot improves with them. Curious what it costs to run? See the [full pricing breakdown](/blog/ai-chatbot-cost).' },
    ],
    faq: [
      { q: 'How do you train an AI chatbot on your own website?', a: 'You give the chatbot your website URLs and documents. It crawls and splits them into passages, converts each into a searchable vector, and stores them. At question time it retrieves the most relevant passages and answers from them — so you curate the content rather than retrain a model.' },
      { q: 'Do you need to code to train a website chatbot?', a: 'No. Most platforms take a root URL, crawl your site automatically, and handle the chunking and embedding for you. Installing the finished bot is typically a single script tag, so no engineering work is required to launch.' },
      { q: 'How do you stop an AI chatbot from making things up?', a: 'Ground it in your own content and configure it to answer only from retrieved passages, refuse gracefully when it finds nothing relevant, and hand off to a human on low confidence. Never let it guess at prices, policies, or availability.' },
      { q: 'How do you keep the chatbot answers up to date?', a: 'Re-crawl your site whenever content changes and review transcripts weekly for missed questions. Because the bot reads from your live content rather than a frozen model snapshot, updating a page and re-indexing is enough to correct future answers.' },
    ],
  },
  {
    slug: 'bant-scoring-ai-chatbot',
    title: 'BANT scoring inside an AI chatbot, without a single form question',
    description: 'How OyeChats infers Budget, Authority, Need, and Timing from natural conversation, then hands sales a ready-to-call lead.',
    category: 'Sales AI',
    date: 'June 12, 2026',
    dateISO: '2026-06-12',
    readMinutes: 7,
    author: { name: 'OyeChats Team', initials: 'OC', role: 'Product' },
    accent: 'amber',
    tags: ['BANT', 'Lead qualification', 'Sales'],
    image: '/images/blog/bant-scoring-v2.webp',
    content: [
      { type: 'p', text: 'For decades, BANT has been the shortest useful sales framework in the world. Budget, Authority, Need, Timing. If you know those four things about a visitor, you know whether to call them today, nurture them next month, or let them keep reading. The problem was never the framework. It was the collection method. Reps had to squeeze those four answers out of a discovery call, and marketers had to bury them in a form that no visitor wanted to fill.' },
      { type: 'p', text: 'An AI chatbot changes the economics of collection. When a visitor is already in a natural conversation about your product, BANT signals leak out on their own. The job of the bot is to notice them, structure them, and put them in front of sales before the tab is closed.' },
      { type: 'h2', text: 'What each BANT signal looks like in a real chat' },
      { type: 'p', text: 'OyeChats treats each of the four dimensions as a probability, not a boolean. Every visitor message is scored against a small classifier that watches for language patterns tied to that dimension. A single confident sentence can move the score. A vague one nudges it.' },
      { type: 'h3', text: 'Budget' },
      { type: 'p', text: 'Visitors rarely name a number. They name a shape. "We are a five person team", "we are on the free plan of a competitor", or "we have a small ops budget for tools this quarter" all imply a range. The bot maps that range to a plan tier and stores the raw phrase for the rep to read later.' },
      { type: 'h3', text: 'Authority' },
      { type: 'p', text: 'A visitor who says "I would need to check with our head of support" is telling you exactly where they sit in the org. So is one who says "I run growth here". OyeChats tags the role, the pronoun pattern, and whether they speak in "we" or "I" when discussing purchase decisions.' },
      { type: 'h3', text: 'Need' },
      { type: 'p', text: 'Need is the easiest of the four because it is the reason the visitor started chatting. The trick is separating a real pain from a feature curiosity. A person who asks "does this integrate with HubSpot?" is exploring. A person who says "our current tool is dropping tickets after eight in the evening" is bleeding.' },
      { type: 'h3', text: 'Timing' },
      { type: 'p', text: 'Timing surfaces through deadlines, launch dates, and frustration intensity. Phrases like "we are rolling this out next month" or "we need to fix this before Black Friday" push the timing score sharply. So does a visitor returning three times in a week.' },
      { type: 'h2', text: 'Turning four numbers into a single decision' },
      { type: 'p', text: 'Once every score has a value between zero and one, OyeChats blends them into a lead grade. High Need with high Timing but unknown Budget still deserves a call, because the sales team can qualify the number faster than a bot can. High Budget with weak Need is a nurture, not a call. The exact weighting is tunable per account.' },
      { type: 'ul', items: [
        'Hot: three or four dimensions above 0.7. Route to a live operator or notify sales instantly.',
        'Warm: two dimensions above 0.7. Deliver a scheduled follow up email with a calendar link.',
        'Cold: one dimension confirmed, others thin. Continue the conversation, keep collecting.',
      ] },
      { type: 'h2', text: 'Why this beats forms' },
      { type: 'p', text: 'A form gets you the data of the small percentage of visitors willing to fill it. A conversation gets you the shape of intent from everyone who talks. Even a visitor who never becomes a lead has told you something about the market you are selling into, and that is worth keeping.' },
      { type: 'p', text: 'BANT was never broken. It was just waiting for a collection method that felt like a normal exchange between two humans. That is what an AI chatbot finally does at scale.' },
    ],
  },
  {
    slug: 'rag-vs-fine-tuning',
    title: 'RAG or fine tuning, when each is actually the right answer',
    description: 'A practical decision guide for teams choosing between retrieval augmented generation and fine tuning a base model.',
    category: 'AI Engineering',
    date: 'June 5, 2026',
    dateISO: '2026-06-05',
    readMinutes: 8,
    author: { name: 'AI Team', initials: 'AI', role: 'Engineering' },
    accent: 'violet',
    tags: ['RAG', 'Fine tuning', 'LLM'],
    image: '/images/blog/rag-vs-fine-tuning-v2.webp',
    content: [
      { type: 'p', text: 'Almost every team that picks up a large language model for the first time ends up asking the same question. Should we fine tune it on our data, or should we build a retrieval pipeline around it? The two paths look similar from a distance because they both promise the same outcome, which is answers that sound like your company wrote them. Up close they solve different problems.' },
      { type: 'h2', text: 'The one sentence version' },
      { type: 'p', text: 'Fine tuning changes how the model speaks. Retrieval changes what the model knows in the moment. If your problem is tone, format, or a repeatable pattern, fine tune. If your problem is up to date facts about your product, your policies, or your customers, retrieve.' },
      { type: 'h2', text: 'Where RAG wins outright' },
      { type: 'p', text: 'Any body of knowledge that changes weekly, monthly, or unpredictably belongs in retrieval. Documentation, pricing, feature flags, help center articles, and internal wikis all fall into this bucket. A retrieval pipeline lets you update a single source of truth and see the answer change on the next question.' },
      { type: 'ul', items: [
        'Cost per update is roughly zero, because you are only reindexing a chunk, not retraining a model.',
        'Attribution comes for free. You can show the visitor which document a sentence came from.',
        'Rollback is instant. Delete the bad chunk, ask again, the model no longer knows the wrong fact.',
      ] },
      { type: 'h2', text: 'Where fine tuning wins outright' },
      { type: 'p', text: 'Fine tuning earns its cost when the target is a stable pattern rather than a piece of knowledge. Turning free text into a strict JSON schema every time, matching a specific writing voice, or teaching a smaller model a specialised classification are all excellent fits. The model is learning a shape, and shapes rarely change.' },
      { type: 'ul', items: [
        'The behaviour you want is repeatable across thousands of inputs, so training pays off.',
        'You have a labelled dataset that reflects the target behaviour cleanly.',
        'Latency matters, and you want a smaller model to punch above its weight.',
      ] },
      { type: 'h2', text: 'Why most production systems end up doing both' },
      { type: 'p', text: 'Once a team is running in the real world, the split usually resolves the same way. Retrieval provides the facts. A lightly fine tuned model provides the personality and the output shape. The base model reads a small pack of relevant chunks and answers in the voice you trained it in. This is how OyeChats runs by default. Documents are chunked, embedded, and searched with a hybrid pipeline, and the response layer is prompted to sound consistent across every bot.' },
      { type: 'h2', text: 'A short checklist to run before you commit' },
      { type: 'ol', items: [
        'Write down the failure you are trying to fix. If it is "the answer is out of date", RAG is your first move.',
        'If it is "the answer is off brand or the wrong format", start with prompt engineering, then fine tune only if the prompt cannot get you there.',
        'Estimate the update cadence. Anything faster than quarterly should live in retrieval.',
        'Estimate the labelled data you can produce. Fine tuning without a real dataset almost always disappoints.',
        'Plan the eval before the build. Both approaches are worthless without a way to tell if the next change made things better.',
      ] },
      { type: 'p', text: 'Neither approach is inherently more advanced than the other. They are two different tools that people keep reaching for at the wrong moment. Pick the one that maps to the failure you actually have today, and leave the other on the shelf until you need it.' },
    ],
  },
  {
    slug: 'hybrid-search-explained',
    title: 'Hybrid search, explained without the buzzwords',
    description: 'Why blending vector similarity with keyword search consistently outperforms either method alone, and how to implement it.',
    category: 'Search',
    date: 'May 26, 2026',
    dateISO: '2026-05-26',
    readMinutes: 6,
    author: { name: 'AI Team', initials: 'AI', role: 'Engineering' },
    accent: 'blue',
    tags: ['Hybrid search', 'Vector search', 'BM25'],
    image: '/images/blog/hybrid-search-v2.webp',
    content: [
      { type: 'p', text: 'Vector search gets a lot of the press in modern retrieval, and for good reason. It handles paraphrasing, synonyms, and messy human phrasing in a way that plain keyword search never could. But if you have ever watched a visitor ask a question that includes an internal product code, a version number, or an acronym, you have also seen vector search miss badly. Hybrid search exists because both methods have blind spots, and their blind spots barely overlap.' },
      { type: 'h2', text: 'What each method is actually good at' },
      { type: 'p', text: 'Vector search compares meaning. It turns text into a dense numerical representation and looks for chunks whose meaning is close to the query. That is exactly what you want when a visitor asks about "cancelling my plan" and the docs use the phrase "ending your subscription".' },
      { type: 'p', text: 'Keyword search, in the form of BM25 or a Postgres TSVECTOR index, compares literal tokens. It is exactly what you want when a visitor pastes the string "ERR_TIMEOUT_1044" and needs the doc that mentions that exact code. No embedding model is going to reliably guess that a specific error code should map to a specific troubleshooting page.' },
      { type: 'h2', text: 'How to combine the two' },
      { type: 'p', text: 'The simplest and most reliable technique is reciprocal rank fusion. Run both searches, get two ranked lists, and combine them by rank rather than by raw score. A chunk that shows up near the top of either list gets credit. A chunk that shows up near the top of both lists gets a lot of credit.' },
      { type: 'code', lang: 'python', text: 'def rrf(vector_hits, keyword_hits, k=60):\n    scores = {}\n    for rank, doc_id in enumerate(vector_hits):\n        scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)\n    for rank, doc_id in enumerate(keyword_hits):\n        scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)\n    return sorted(scores.items(), key=lambda x: x[1], reverse=True)' },
      { type: 'p', text: 'The k parameter is a smoothing constant. A value around 60 works well in practice. Larger values flatten the contribution of top ranked results. Smaller values sharpen it.' },
      { type: 'h2', text: 'The failure modes hybrid quietly fixes' },
      { type: 'ul', items: [
        'Rare terminology like SKUs, error codes, and legal clause references start returning the right page again.',
        'Paraphrased questions still land on the right chunk even when the vocabulary does not match.',
        'A single embedding model bug no longer takes down retrieval entirely, because keyword search continues to work.',
      ] },
      { type: 'h2', text: 'What to measure' },
      { type: 'p', text: 'A good hybrid rollout is boring by design. Track recall at ten for a fixed evaluation set of real questions, and compare vector only, keyword only, and hybrid. In our internal evaluation, hybrid beat vector alone on roughly nineteen of twenty question types, and beat keyword alone on all of them. The exceptions were queries where a single perfect keyword match should completely dominate the result.' },
      { type: 'p', text: 'You do not need a research team to ship hybrid search. You need one vector index, one keyword index, one small function to fuse them, and a habit of measuring against real questions. Everything else is polish.' },
    ],
  },
  {
    slug: 'behavioral-tracking-lead-gen',
    title: 'Behavioural tracking for lead gen, without becoming creepy',
    description: 'The signals that actually predict intent, the ones that only feel like they do, and how to use both without breaking trust.',
    category: 'Growth',
    date: 'May 10, 2026',
    dateISO: '2026-05-10',
    readMinutes: 7,
    author: { name: 'Growth Team', initials: 'GT', role: 'Marketing' },
    accent: 'emerald',
    tags: ['Behavioural tracking', 'Lead gen', 'Analytics'],
    image: '/images/blog/behavioral-tracking-v2.webp',
    content: [
      { type: 'p', text: 'A lot of behavioural tracking dashboards are theatre. They show a wall of metrics, most of which have no predictive relationship to whether a visitor is about to buy something. If you have ever stared at a heatmap and asked yourself "what am I supposed to do with this", you already know the problem. The signals worth acting on are much narrower than the ones a tool will happily record.' },
      { type: 'h2', text: 'Signals that actually predict intent' },
      { type: 'p', text: 'Across dozens of accounts, the same handful of behaviours consistently line up with visitors who eventually convert.' },
      { type: 'ul', items: [
        'Return visits within seven days, especially to a pricing or comparison page.',
        'Time spent on a single feature page above the ninetieth percentile for that page.',
        'Copying an install snippet or a code sample to the clipboard.',
        'Opening the FAQ or documentation from a product page rather than from the nav.',
        'A specific referrer pattern, such as arriving from a curated newsletter or a peer review site.',
      ] },
      { type: 'p', text: 'Notice what is not on the list. Scroll depth on a landing page. Mouse movement heatmaps. Time on a blog post. These are entertaining to look at and almost never predictive of purchase.' },
      { type: 'h2', text: 'The trust boundary' },
      { type: 'p', text: 'Every behavioural signal you collect crosses a spectrum from "obvious that you are tracking it" to "surprising and a little unsettling". Return visits are on the obvious end. Any regular analytics tool tracks them, and no visitor is shocked to hear it. Real time inference of an emotional state from webcam access is on the other end. Nobody wants that in a chatbot.' },
      { type: 'p', text: 'The right question is not "what can we capture". It is "what would we happily disclose in a one paragraph note on the site". If a signal survives that test, use it. If it does not, drop it, even if it is technically legal in your jurisdiction.' },
      { type: 'h2', text: 'How to act on the signals you keep' },
      { type: 'p', text: 'The behavioural signals only matter if they change what the chatbot does next. Three actions cover almost every case.' },
      { type: 'ol', items: [
        'Adjust the greeting. A returning visitor who spent six minutes on the pricing page yesterday should not be greeted with the same generic message as a first time reader.',
        'Adjust the routing. A visitor whose behavioural profile matches your best converting cohort should be offered a live operator, not a scheduled email.',
        'Adjust the qualification prompts. If the visitor already looked at three integrations pages, do not ask which integrations they care about.',
      ] },
      { type: 'p', text: 'Behavioural tracking earns its keep when it makes the conversation smarter. If it is only feeding a report, you can probably delete half of the tags and lose nothing.' },
    ],
  },
  {
    slug: 'webhook-best-practices',
    title: 'Webhook best practices for chat platforms, from a team that ships them',
    description: 'How to design webhooks that stay reliable under retries, spikes, and partner outages, without turning into a support nightmare.',
    category: 'Engineering',
    date: 'May 3, 2026',
    dateISO: '2026-05-03',
    readMinutes: 8,
    author: { name: 'Platform Team', initials: 'PL', role: 'Engineering' },
    accent: 'rose',
    tags: ['Webhooks', 'Integrations', 'Reliability'],
    image: '/images/blog/webhooks-v2.webp',
    content: [
      { type: 'p', text: 'Webhooks look simple on a whiteboard. Something happens on our side, we send a POST to your URL. In production, the same feature is where roughly a third of integration bugs quietly live. Retry storms, delivery gaps, silent signature mismatches, and endpoints that return two hundred OK while doing nothing at all. The rules below are what we have learned running webhooks across thousands of bots.' },
      { type: 'h2', text: 'Sign every payload, and pin the signature scheme' },
      { type: 'p', text: 'Every webhook we send carries an HMAC SHA 256 signature over the raw request body, computed with a secret unique to the receiver. Two things matter here. First, sign the raw bytes, not the parsed JSON, because any JSON reserialisation on either side breaks verification. Second, put the scheme identifier in the header, so future rotations do not require a coordinated release.' },
      { type: 'code', lang: 'http', text: 'X-OyeChats-Signature: v1=8f2a1c93b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1\nX-OyeChats-Timestamp: 1739299200' },
      { type: 'p', text: 'The timestamp is not decoration. Verifiers should reject any request more than five minutes old, which kills replay attacks and also catches misconfigured servers whose clocks have drifted.' },
      { type: 'h2', text: 'Retry with exponential backoff and a hard cap' },
      { type: 'p', text: 'If your receiver returns anything other than a two hundred status, we retry. Retries follow exponential backoff with jitter, and we cap the total window at twenty four hours. After that we mark the delivery as failed and expose it in the admin dashboard for manual replay.' },
      { type: 'ul', items: [
        'Return a two hundred as soon as you have durably enqueued the payload. Do the real work in a background job.',
        'Never retry from your side too. The sender is already retrying, and duplicate retries lead to duplicate side effects.',
        'Log the delivery id so support can trace a specific event across both systems.',
      ] },
      { type: 'h2', text: 'Make every event safely retriable' },
      { type: 'p', text: 'The sender does not know whether your two hundred came before or after the crash. The only safe assumption is that any event might arrive twice. Every event carries a stable delivery id and a stable event id. Store the event id on the receiver, check it before applying side effects, and skip if it has already been processed.' },
      { type: 'h2', text: 'Send small, coherent events' },
      { type: 'p', text: 'Large batched payloads are tempting because they cut request volume. They also make retries expensive, encourage partial failure handling that nobody actually writes, and force the receiver to parse events they may not care about. We prefer one event per business fact. A new chat session, a new message, a status change. The receiver filters what it wants.' },
      { type: 'h2', text: 'Observability the receiver can trust' },
      { type: 'p', text: 'Every webhook we send is inspectable in the admin dashboard. The receiver sees the raw payload, the response status, the response body, the delivery timestamps, and every retry attempt with its reason. When integrations break at three in the morning, that is the difference between a five minute fix and a two hour support thread.' },
      { type: 'p', text: 'None of this is exotic. It is a small collection of habits that pay off the first time a downstream system has a bad day, which will happen sooner than you expect.' },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/** Stable, URL-safe id derived from a heading's text (for anchor links + TOC). */
export function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60) || 'section'
  );
}

/**
 * Deterministic heading id per block index, deduped so two headings with the
 * same text still get unique anchors. The detail page and the TOC both call
 * this, so anchors and scroll-spy targets always agree.
 */
export function computeHeadingIds(content: BlogBlock[]): Record<number, string> {
  const seen = new Map<string, number>();
  const ids: Record<number, string> = {};
  content.forEach((block, i) => {
    if (block.type === 'h2' || block.type === 'h3') {
      const base = slugifyHeading(block.text);
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      ids[i] = n === 0 ? base : `${base}-${n}`;
    }
  });
  return ids;
}

export type TocEntry = { id: string; label: string; level: 2 | 3 };

/** Ordered table-of-contents entries built from a post's h2/h3 blocks. */
export function getToc(content: BlogBlock[]): TocEntry[] {
  const ids = computeHeadingIds(content);
  const toc: TocEntry[] = [];
  content.forEach((block, i) => {
    if (block.type === 'h2' || block.type === 'h3') {
      toc.push({ id: ids[i], label: block.text, level: block.type === 'h2' ? 2 : 3 });
    }
  });
  return toc;
}

/** Related posts: same category first, then most recent, excluding the current post. */
export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return BLOG_POSTS.slice(0, limit);
  const others = BLOG_POSTS.filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
