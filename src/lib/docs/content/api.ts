import type { DocGroup } from '../types';

export const API: DocGroup = {
  slug: 'api',
  label: 'REST API',
  description: 'Authentication, conventions, errors, rate limits, and the endpoints you will actually use.',
  pages: [
    {
      slug: 'overview',
      navLabel: 'Authentication',
      title: 'API overview and authentication',
      summary:
        'One base URL, three authentication personas, and a small set of conventions that hold across every endpoint.',
      metaTitle: 'OyeChats REST API: Authentication and Conventions',
      metaDescription:
        'Authenticate with the OyeChats REST API using X-API-Key, X-Bot-Key or X-Operator-Key. Base URL, key management, conventions and the OpenAPI specification.',
      sections: [
        {
          id: 'base-url',
          heading: 'Base URL',
          blocks: [
            { t: 'code', label: 'Base URL', code: 'https://api.oyechats.com' },
            {
              t: 'p',
              text: 'Everything is JSON in and JSON out, except file uploads (multipart) and CSV exports. HTTPS only. The API is versionless today; breaking changes are announced on the [changelog](/changelog) before they ship.',
            },
          ],
        },
        {
          id: 'keys',
          heading: 'The three keys',
          blocks: [
            {
              t: 'table',
              head: ['Header', 'Who it represents', 'Where it comes from'],
              rows: [
                [
                  '`X-API-Key`',
                  'Your workspace. Full read and write across chatbots, knowledge, leads, analytics and billing.',
                  '**Workspace → API Keys** in the dashboard.',
                ],
                [
                  '`X-Bot-Key`',
                  'A website visitor talking to one chatbot. Can start and continue conversations, nothing else.',
                  'The `data-bot-key` in your embed snippet. Public.',
                ],
                [
                  '`X-Operator-Key`',
                  'One live-chat operator. Scoped to the conversations they may handle.',
                  'Issued to the operator when their account is created.',
                ],
              ],
            },
            {
              t: 'code',
              label: 'curl',
              code: `curl https://api.oyechats.com/bots \\
  -H "X-API-Key: $OYECHATS_API_KEY"`,
            },
            {
              t: 'callout',
              variant: 'danger',
              title: 'Never ship X-API-Key to a browser',
              text: 'It is a full-access workspace credential. Call the API from your server. Anything a browser needs to do, the widget already does with the public bot key.',
            },
          ],
        },
        {
          id: 'key-management',
          heading: 'Managing your API key',
          blocks: [
            {
              t: 'list',
              items: [
                'Read it from **Workspace → API Keys**.',
                'Rotate it from the same screen. Rotation is immediate — the old key stops working the moment the new one is issued, so update your integrations first.',
                'Store it in a secret manager or an environment variable. Not in source control, not in a front-end bundle, not in a support ticket.',
                'If it leaks, rotate it. There is no partial revocation.',
              ],
            },
          ],
        },
        {
          id: 'conventions',
          heading: 'Conventions',
          blocks: [
            {
              t: 'defs',
              items: [
                {
                  term: 'Scoping',
                  text: 'Every workspace-authenticated response is scoped to your workspace on the server. Passing another workspace\'s `bot_id` returns 403, not someone else\'s data.',
                },
                {
                  term: 'Pagination',
                  text: 'List endpoints take `page` and `limit`, or `limit` and `offset`. Defaults are modest — typically 50 — and each endpoint enforces its own maximum.',
                },
                {
                  term: 'Filtering',
                  text: 'Most list endpoints accept `bot_id` to narrow to one chatbot, and a date or `days` window where it makes sense.',
                },
                {
                  term: 'Timestamps',
                  text: 'ISO 8601 with an explicit UTC offset.',
                },
                {
                  term: 'Money',
                  text: 'Integer minor units — paise for INR, cents for USD — with the currency alongside. Never a float.',
                },
                {
                  term: 'Identifiers',
                  text: 'Chatbots have both a numeric `bot_id` (used by the API) and a public `bot_key` (used by the widget). Conversations are identified by `session_id`.',
                },
              ],
            },
          ],
        },
        {
          id: 'openapi',
          heading: 'OpenAPI specification',
          blocks: [
            {
              t: 'p',
              text: 'The full machine-readable schema for the customer-facing API — every parameter, request body and response model — is published as OpenAPI. Import it into Postman, Insomnia, or a client generator.',
            },
            { t: 'code', label: 'Specification URL', code: 'https://www.oyechats.com/openapi.json' },
            {
              t: 'callout',
              variant: 'info',
              title: 'Customer surface only',
              text: 'The published specification deliberately excludes internal administrative and platform-operations endpoints. If a route is not in the specification, treat it as unsupported and subject to change without notice.',
            },
          ],
        },
      ],
    },

    {
      slug: 'errors',
      navLabel: 'Errors & rate limits',
      title: 'Errors and rate limits',
      summary:
        'What failures look like on the wire, which status codes mean what, and how to pace your requests.',
      metaTitle: 'OyeChats API Errors, Status Codes and Rate Limits',
      metaDescription:
        'OyeChats API error format, status code reference, rate limits per endpoint class, and how to handle 429 responses with Retry-After.',
      sections: [
        {
          id: 'shape',
          heading: 'Error shape',
          blocks: [
            {
              t: 'p',
              text: 'Errors carry a `detail` field. Read that; do not parse prose out of the status line.',
            },
            {
              t: 'code',
              label: 'JSON — 403',
              code: `{
  "detail": "Bot not found or access denied."
}`,
            },
            {
              t: 'p',
              text: 'Validation failures return 422 with `detail` as a list of field-level problems. Feature-gated endpoints return a machine-readable code alongside the message — the same shape whether the gate is a plan feature or an exhausted credit balance:',
            },
            {
              t: 'code',
              label: 'JSON — 403, feature not on this plan',
              code: `{
  "detail": {
    "error": "feature_not_available",
    "feature": "lead_intelligence",
    "message": "Lead export is included on Starter and above."
  }
}`,
            },
            {
              t: 'code',
              label: 'JSON — 402, out of credits',
              code: `{
  "detail": {
    "error": "insufficient_credits",
    "required": 1,
    "available": 0,
    "message": "You're out of credits. Upgrade your plan or buy a top-up to keep chatting."
  }
}`,
            },
          ],
        },
        {
          id: 'codes',
          heading: 'Status codes',
          blocks: [
            {
              t: 'table',
              head: ['Code', 'Meaning', 'What to do'],
              rows: [
                ['200 / 201', 'Success.', '—'],
                ['202', 'Accepted — long-running work was queued.', 'Poll the matching status endpoint.'],
                ['400', 'Malformed request.', 'Fix the request. Retrying will not help.'],
                ['401', 'Missing or invalid key.', 'Check the header name and the key value.'],
                ['402', 'Out of credits. `detail.error` is `insufficient_credits`, with `required` and `available`.', 'Top up or upgrade. Retrying will not help.'],
                ['403', 'Authenticated but not allowed — wrong workspace, insufficient role, or a plan gate.', 'Read `detail`. Do not retry.'],
                ['404', 'No such resource, or not yours.', 'Do not retry.'],
                ['409', 'Conflicts with current state.', 'Re-read the resource and decide.'],
                ['422', 'Validation failed.', 'Fix the fields listed in `detail`.'],
                ['429', 'Rate limited.', 'Wait for `Retry-After` seconds, then retry.'],
                ['5xx', 'Something failed on our side.', 'Retry with exponential backoff.'],
              ],
            },
          ],
        },
        {
          id: 'rate-limits',
          heading: 'Rate limits',
          blocks: [
            {
              t: 'p',
              text: 'Limits are per endpoint and are counted against your API key, your bot key, or the caller\'s IP depending on the endpoint. Expensive operations are limited harder than reads.',
            },
            {
              t: 'table',
              head: ['Endpoint class', 'Typical limit'],
              rows: [
                ['Reads — lists, analytics, settings', '20–60 per minute'],
                ['Chat, including streaming', '30 per minute per bot key'],
                ['Document upload — `POST /ingest`', '10 per minute'],
                ['Upload cost preview', '20 per minute'],
                ['Start a crawl — `POST /crawl`', '10 per hour'],
                ['Crawl discovery', '120 per hour'],
                ['Authentication and password reset', '5–10 per minute'],
                ['Billing and checkout', 'Tightly limited; see the response headers'],
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'The exact ceiling is not published in the response',
              text: 'A 429 body does not restate the configured limit — publishing it would tell an abusive caller exactly how slowly to grind. What you get instead is a `Retry-After` header in seconds and a `retry_after_seconds` field in the body, which is what a well-behaved client actually needs.',
            },
            {
              t: 'code',
              label: 'JSON — 429',
              code: `{
  "detail": "Too many requests. Please slow down and try again shortly.",
  "error": "Rate limit exceeded",
  "retry_after_seconds": 24
}`,
            },
          ],
        },
        {
          id: 'retry',
          heading: 'Retrying well',
          blocks: [
            {
              t: 'list',
              items: [
                'Honour `Retry-After` on a 429 rather than guessing a backoff.',
                'Retry 5xx with exponential backoff and jitter. Do not retry 4xx other than 429.',
                'Keep write requests idempotent on your side, so a retry after a timeout cannot double-apply.',
                'Prefer webhooks over polling. A webhook costs you nothing against your rate limits and arrives sooner.',
              ],
            },
          ],
        },
      ],
    },

    {
      slug: 'endpoints',
      navLabel: 'Endpoint reference',
      title: 'Endpoint reference',
      summary:
        'The endpoints most integrations use, grouped by what they are for. The [OpenAPI specification](/docs/api/overview) is the exhaustive list.',
      metaTitle: 'OyeChats API Endpoint Reference',
      metaDescription:
        'Reference for the main OyeChats REST API endpoints: chatbots, knowledge base, leads, analytics, webhooks, billing and account.',
      sections: [
        {
          id: 'bots',
          heading: 'Chatbots',
          blocks: [
            {
              t: 'endpoints',
              items: [
                { method: 'GET', path: '/bots', text: 'List every chatbot in the workspace.' },
                { method: 'POST', path: '/bots', text: 'Create a chatbot. Subject to your plan\'s chatbot limit.' },
                { method: 'GET', path: '/bots/{bot_id}', text: 'Full configuration for one chatbot.' },
                { method: 'PATCH', path: '/bots/{bot_id}', text: 'Update configuration — prompt, appearance, copy, live chat, qualification.' },
                { method: 'DELETE', path: '/bots/{bot_id}', text: 'Delete a chatbot and everything it owns.' },
                { method: 'GET', path: '/bots/{bot_id}/framework-presets', text: 'The qualification framework presets and their default weights.' },
                { method: 'GET', path: '/bots/{bot_id}/recrawl', text: 'Read automatic re-crawl settings.' },
                { method: 'PATCH', path: '/bots/{bot_id}/recrawl', text: 'Enable or disable automatic re-crawl.' },
              ],
            },
          ],
        },
        {
          id: 'knowledge',
          heading: 'Knowledge base',
          blocks: [
            {
              t: 'endpoints',
              items: [
                { method: 'GET', path: '/documents', text: 'List indexed documents and pages.' },
                { method: 'GET', path: '/documents/knowledge-state', text: 'Whether a chatbot is trained, and on how much.' },
                { method: 'POST', path: '/ingest/preview-cost', text: 'Credit cost for an upload, before you commit to it.' },
                { method: 'POST', path: '/ingest', text: 'Upload files (multipart). Returns a job id.' },
                { method: 'GET', path: '/ingest/status/{job_id}', text: 'Poll ingestion progress.' },
                { method: 'DELETE', path: '/documents/{document_name}', text: 'Remove a document and its indexed passages.' },
                { method: 'POST', path: '/crawl/discover', text: 'Discover crawlable pages for a URL without indexing them.' },
                { method: 'POST', path: '/crawl', text: 'Start a crawl. Returns 202; poll progress.' },
                { method: 'GET', path: '/crawl/progress', text: 'Live crawl progress.' },
                { method: 'POST', path: '/crawl/cancel', text: 'Cancel a running crawl. Pages already indexed are kept.' },
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Two-step ingestion is the point',
              text: 'Call the cost preview before the upload or crawl. It is the only way to know what you are about to spend, and it rejects unsupported or oversized files without charging.',
            },
          ],
        },
        {
          id: 'leads',
          heading: 'Leads',
          blocks: [
            {
              t: 'endpoints',
              items: [
                { method: 'GET', path: '/leads', text: 'List leads. Filter by `bot_id`, `tier`, `min_score`; paginate with `page` and `limit` (max 200).' },
                { method: 'GET', path: '/leads/{session_id}', text: 'One lead with its full transcript and dimension breakdown.' },
                { method: 'GET', path: '/leads/stats', text: 'Lead counts by tier.' },
                { method: 'GET', path: '/leads/export', text: 'CSV export. Starter and above.' },
                { method: 'POST', path: '/leads/{session_id}/follow-up', text: 'Send a follow-up email. Costs 1 credit.' },
              ],
            },
            {
              t: 'code',
              label: 'curl — today\'s sales-qualified leads',
              code: `curl -G https://api.oyechats.com/leads \\
  -H "X-API-Key: $OYECHATS_API_KEY" \\
  --data-urlencode "tier=sql" \\
  --data-urlencode "limit=100"`,
            },
          ],
        },
        {
          id: 'analytics',
          heading: 'Analytics',
          blocks: [
            {
              t: 'endpoints',
              items: [
                { method: 'GET', path: '/analytics/dashboard', text: 'Aggregate counts for a window.' },
                { method: 'GET', path: '/analytics/qualification-funnel', text: 'Tier distribution and stage conversion.' },
                { method: 'GET', path: '/analytics/top-questions', text: 'What visitors ask most.' },
                { method: 'GET', path: '/analytics/unanswered-questions', text: 'What the chatbot could not answer.' },
                { method: 'GET', path: '/analytics/ratings-summary', text: 'Visitor rating average and distribution.' },
                { method: 'GET', path: '/analytics/resolution-summary', text: 'Resolution outcomes.' },
                { method: 'GET', path: '/analytics/journey/summary', text: 'Visitor journey overview. Standard and above.' },
              ],
            },
          ],
        },
        {
          id: 'webhooks',
          heading: 'Webhooks',
          blocks: [
            {
              t: 'endpoints',
              items: [
                { method: 'GET', path: '/webhooks', text: 'List endpoints for a chatbot (`bot_id` required). Secrets come back masked.' },
                { method: 'POST', path: '/webhooks', text: 'Create an endpoint. The response contains the signing secret in full — this is the only time it is returned.' },
                { method: 'PATCH', path: '/webhooks/{webhook_id}', text: 'Change the URL, the subscribed events, or the active flag.' },
                { method: 'DELETE', path: '/webhooks/{webhook_id}', text: 'Delete an endpoint.' },
                { method: 'POST', path: '/webhooks/{webhook_id}/test', text: 'Send a test delivery.' },
                { method: 'GET', path: '/webhooks/{webhook_id}/deliveries', text: 'Per-attempt delivery log with status codes and bodies.' },
              ],
            },
          ],
        },
        {
          id: 'billing',
          heading: 'Account and billing',
          blocks: [
            {
              t: 'endpoints',
              items: [
                { method: 'GET', path: '/auth/me', text: 'The authenticated account.' },
                { method: 'GET', path: '/auth/me/entitlements', text: 'Resolved plan limits, features and current usage. The right way to check a gate before acting.' },
                { method: 'GET', path: '/credits/balance', text: 'Current credit balance.' },
                { method: 'GET', path: '/credits/history', text: 'Credit ledger entries.' },
                { method: 'GET', path: '/subscriptions/current', text: 'Active subscription and status.' },
                { method: 'GET', path: '/subscriptions/usage', text: 'Usage against plan limits for the period.' },
                { method: 'GET', path: '/subscriptions/invoices', text: 'Invoice history with PDF links.' },
                { method: 'GET', path: '/client/api-key', text: 'Read the workspace API key.' },
                { method: 'POST', path: '/client/api-key/regenerate', text: 'Rotate it. The previous key stops working immediately.' },
              ],
            },
            {
              t: 'callout',
              variant: 'success',
              title: 'Check entitlements, do not hardcode plan names',
              text: '`GET /auth/me/entitlements` returns the resolved limits and feature flags for the account. Branching on that is stable; branching on a plan slug breaks the moment plans change.',
            },
          ],
        },
        {
          id: 'widget',
          heading: 'Widget endpoints',
          blocks: [
            {
              t: 'p',
              text: 'These authenticate with `X-Bot-Key` and exist so the widget can work. They are documented because they are visible in any browser\'s network tab, not because you are expected to call them — build on the widget or on webhooks instead.',
            },
            {
              t: 'endpoints',
              items: [
                { method: 'GET', path: '/bots/settings/public', text: 'Public appearance and behaviour configuration for a chatbot.' },
                { method: 'POST', path: '/chat/stream', text: 'Ask a question and stream the reply. 30 per minute per bot key.' },
                { method: 'POST', path: '/chat/lead-capture', text: 'Submit the lead form.' },
                { method: 'GET', path: '/chat/history/{session_id}', text: 'Rehydrate a conversation on reload.' },
                { method: 'POST', path: '/operators/handoff', text: 'Request a human.' },
              ],
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'Not a public chat API',
              text: 'A general-purpose conversation API is on the roadmap and marked as such in the dashboard. Until it ships, these endpoints exist to serve the widget and their contracts can change without a deprecation window.',
            },
          ],
        },
      ],
    },
  ],
};
