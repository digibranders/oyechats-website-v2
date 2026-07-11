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
};

export const BLOG_POSTS: BlogPost[] = [
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
