import type { DocGroup } from '../types';
import { seatsTable } from '../plan-matrix';

export const CONVERSATIONS: DocGroup = {
  slug: 'conversations',
  label: 'Conversations & live chat',
  description: 'How a conversation moves from AI to a human, who it goes to, and what happens when nobody is available.',
  pages: [
    {
      slug: 'lifecycle',
      navLabel: 'Conversation lifecycle',
      title: 'The conversation lifecycle',
      summary:
        'Every conversation is in exactly one of four states. Knowing which is which explains most of what you see in the Support inbox.',
      metaTitle: 'Conversation Lifecycle: AI, Waiting, Live, Closed',
      metaDescription:
        'The four conversation states in OyeChats. Bot, waiting, live and closed. How transitions happen, and how transcripts and audit logs are kept.',
      sections: [
        {
          id: 'states',
          heading: 'The four states',
          blocks: [
            {
              t: 'table',
              head: ['State', 'Meaning'],
              rows: [
                ['**AI**', 'The chatbot is answering. Every conversation starts here.'],
                ['**Waiting**', 'The visitor asked for a human and is queued for an operator.'],
                ['**Live**', 'An operator has accepted and is chatting with the visitor.'],
                ['**Closed**', 'The conversation is finished and marked done in reporting.'],
              ],
            },
            {
              t: 'p',
              text: 'From Live there are two ways out. **Close** returns the visitor to the chatbot, which is what you want when the human question is answered but the visitor may keep browsing. **Resolve** ends the conversation entirely and records it as done. This is the one that reads as completed in your resolution metrics.',
            },
          ],
        },
        {
          id: 'transitions',
          heading: 'What triggers a transition',
          blocks: [
            {
              t: 'defs',
              items: [
                {
                  term: 'Visitor asks for a human',
                  text: 'Either by tapping the live chat control or by saying so in conversation. The chatbot recognises the intent and offers the handoff.',
                },
                {
                  term: 'The visitor appears stuck',
                  text: 'Several messages inside the frustration window trigger a proactive offer of a human. Tunable per chatbot. See [Behaviour and timing](/docs/widget/behavior).',
                },
                {
                  term: 'An operator reaches out',
                  text: 'An operator watching a live AI conversation can send a connect request. The visitor accepts or declines; nothing is forced on them.',
                },
                {
                  term: 'An operator takes over',
                  text: 'An operator can take an AI conversation directly without waiting for the visitor to ask.',
                },
                {
                  term: 'Timeouts',
                  text: 'A queued visitor who waits past the queue timeout is offered the offline form instead. A silent participant is treated as disconnected after the configured window.',
                },
              ],
            },
          ],
        },
        {
          id: 'records',
          heading: 'What gets recorded',
          blocks: [
            {
              t: 'list',
              items: [
                'Every message, tagged with who sent it. Visitor, chatbot, operator or system.',
                'An append-only audit log of state changes: handoff requested, accepted, transferred, closed, resolved.',
                'The visitor rating, when post-chat rating is enabled.',
                'The page journey: what the visitor saw before, during and after the conversation.',
                'Any contact details captured, plus the qualification score at the time.',
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'How far back you can look',
              text: 'Your plan sets a chat-history window that governs how far back the dashboard shows conversations, from one week on Free to a year on the top tiers. It is a visibility window, not an automatic deletion schedule; for deletion see [Data and privacy](/docs/account/privacy).',
            },
          ],
        },
      ],
    },

    {
      slug: 'live-chat',
      navLabel: 'Live chat',
      title: 'Live chat',
      summary:
        'Turning on human handoff, what visitors see at each stage, and the seven availability states that decide what happens when they ask.',
      metaTitle: 'Live Chat: Human Handoff and Availability',
      metaDescription:
        'Set up live chat in OyeChats: enable handoff, configure the queue, understand the seven availability states, and handle out-of-hours traffic.',
      sections: [
        {
          id: 'enable',
          heading: 'Turning it on',
          blocks: [
            {
              t: 'steps',
              items: [
                {
                  title: 'Check your plan includes it',
                  text: 'Live chat is available from Starter upwards. On Free the controls are visible but locked.',
                },
                {
                  title: 'Add at least one operator',
                  text: 'A chatbot with live chat enabled and no operators shows the offline form to everyone who asks for a human. See [Operators and seats](/docs/conversations/operators).',
                },
                {
                  title: 'Set business hours',
                  text: 'Outside them the widget offers the offline form and tells the visitor when you are back.',
                },
                {
                  title: 'Test the handoff',
                  text: 'Ask your own chatbot for a human and confirm the request arrives in the Support inbox.',
                },
              ],
            },
          ],
        },
        {
          id: 'states',
          heading: 'The seven availability states',
          blocks: [
            {
              t: 'p',
              text: 'When a visitor asks for a human, one deterministic check decides what happens. The first matching state wins, so a chatbot outside business hours never shows a queue even if operators happen to be online.',
            },
            {
              t: 'table',
              head: ['#', 'State', 'What the visitor gets'],
              rows: [
                ['1', 'Feature disabled', 'Offline form immediately. Either your plan excludes live chat or the toggle is off.'],
                ['2', 'No operators', 'Offline form immediately. The workspace has no operators at all.'],
                ['3', 'Out of hours', 'Offline form, plus when you are next open.'],
                ['4', 'All offline', 'Offline form, plus "the team is offline".'],
                ['5', 'Queue full', 'Offline form, plus "we are very busy".'],
                ['6', 'All busy', 'The queue, with progressive waiting messages and a timeout to the offline form.'],
                ['7', 'Available', 'Routed to an operator.'],
              ],
            },
            {
              t: 'p',
              text: 'The Support inbox shows the current state as a status pill, so you can always see which of the seven a visitor would hit right now.',
            },
          ],
        },
        {
          id: 'business-hours',
          heading: 'Business hours',
          blocks: [
            {
              t: 'p',
              text: 'Business hours are per weekday with an explicit timezone, and a day can be marked closed. Departments can override the chatbot\'s hours with their own, so a sales team on IST hours and a support team on UK hours never contradict each other.',
            },
            {
              t: 'code',
              label: 'Business hours shape',
              code: `{
  "timezone": "Asia/Kolkata",
  "mon": { "start": "09:00", "end": "17:00" },
  "tue": { "start": "09:00", "end": "17:00" },
  "wed": { "start": "09:00", "end": "17:00" },
  "thu": { "start": "09:00", "end": "17:00" },
  "fri": { "start": "09:00", "end": "17:00" },
  "sat": { "start": "10:00", "end": "14:00" },
  "sun": null
}`,
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Unset means always open',
              text: 'With no business hours configured, the out-of-hours state never fires and availability depends purely on whether operators are online. An invalid timezone also falls back to always-open rather than locking your team out.',
            },
          ],
        },
        {
          id: 'queue',
          heading: 'The queue',
          blocks: [
            {
              t: 'p',
              text: 'When every online operator is at capacity, waiting visitors queue. Two settings bound it: the queue timeout (default 20 seconds) after which the visitor is offered the offline form, and the maximum queue size (default 10) past which new requests get the offline form directly.',
            },
            {
              t: 'p',
              text: 'Showing queue position is off by default. It reassures visitors when your queue is short and does the opposite when it is long. Turn it on only if you know which situation you are in.',
            },
          ],
        },
        {
          id: 'operator-side',
          heading: 'What operators can do',
          blocks: [
            {
              t: 'list',
              items: [
                '**Accept** a queued conversation and start chatting.',
                '**Take over** a conversation the chatbot is currently handling.',
                '**Connect**. Invite a visitor in an AI conversation to talk to a human; they choose.',
                '**Transfer** an active conversation to another operator or department.',
                '**Close**. Hand the visitor back to the chatbot.',
                '**Resolve**. End the conversation and mark it done.',
                'Send files, if file sharing is enabled for that chatbot.',
                'Insert a [canned response](/docs/conversations/canned-responses) with a slash shortcut.',
                'Read and edit the conversation\'s qualification scores.',
              ],
            },
          ],
        },
      ],
    },

    {
      slug: 'operators',
      navLabel: 'Operators & seats',
      title: 'Operators, roles and seats',
      summary:
        'Who can take a live chat, how they sign in, how many can work at once, and how seats are billed.',
      metaTitle: 'Operators: Roles, Seats and Chat Routing',
      metaDescription:
        'Add live-chat operators in OyeChats, understand owner/admin/operator roles, seat billing, concurrent chat limits, departments and routing strategies.',
      sections: [
        {
          id: 'adding',
          heading: 'Adding an operator',
          blocks: [
            {
              t: 'p',
              text: 'Invite them from **Workspace → Members**. They receive an email, set a password, and get their own login. You can also make yourself an operator without a second account, which is what most solo customers do.',
            },
            {
              t: 'p',
              text: 'Each operator is bound to one chatbot. Routing is scoped to that binding, so an operator assigned to chatbot A never receives a conversation from chatbot B.',
            },
          ],
        },
        {
          id: 'roles',
          heading: 'Roles',
          blocks: [
            {
              t: 'table',
              head: ['Role', 'Can do'],
              rows: [
                ['Owner', 'Everything, including billing and deleting the workspace.'],
                ['Admin', 'Manage chatbots, knowledge, operators and settings.'],
                ['Operator', 'Handle live chats, view leads, manage their own profile. No access to chatbot configuration, analytics or billing.'],
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Enforced server-side',
              text: 'Operator restrictions are applied at the route layer, not just by hiding navigation, so a plain operator cannot reach an owner surface by typing its URL.',
            },
          ],
        },
        {
          id: 'seats',
          heading: 'Seats and capacity',
          blocks: [
            {
              t: 'p',
              text: 'Each plan includes a number of operator seats, and you can buy extra seats as an add-on. Seat pricing is on the [pricing page](/pricing).',
            },
            seatsTable(),
            {
              t: 'table',
              head: ['Control', 'Default', 'Meaning'],
              rows: [
                ['Concurrent chats per operator', '5', 'How many live conversations one operator can hold at once. Past it they are "busy" for routing.'],
                ['Accepting chats', 'On', 'A do-not-disturb switch. The operator stays online but receives no new assignments.'],
                ['Online status', 'Derived', 'An operator counts as online while their dashboard holds a live connection.'],
              ],
            },
          ],
        },
        {
          id: 'departments',
          heading: 'Departments',
          blocks: [
            {
              t: 'p',
              text: 'Departments group operators. Sales, Support, Billing. A visitor can be asked to pick one when they request a human, and each department can carry its own business hours. Routing then only considers operators in the chosen department.',
            },
          ],
        },
        {
          id: 'routing',
          heading: 'Routing strategies',
          blocks: [
            {
              t: 'table',
              head: ['Strategy', 'Behaviour'],
              rows: [
                ['Least busy *(default)*', 'The eligible operator with the fewest active chats. Ties are broken in rotation.'],
                ['Round robin', 'Strict rotation regardless of current load.'],
                ['First available', 'The first eligible operator found.'],
              ],
            },
            {
              t: 'p',
              text: 'In all three, only operators who are online, accepting chats, under their concurrency limit and in the requested department are considered.',
            },
          ],
        },
        {
          id: 'notifications',
          heading: 'Making sure they notice',
          blocks: [
            {
              t: 'list',
              items: [
                'In-dashboard toast and sound while the tab is open.',
                'Browser push, for when the dashboard tab is closed. The operator has to grant permission once.',
                'Email, as a backstop when nobody picked the conversation up. Repeated messages from the same waiting visitor are debounced to one email per minute.',
              ],
            },
            {
              t: 'p',
              text: 'Each operator controls their own notification preferences from Settings.',
            },
          ],
        },
      ],
    },

    {
      slug: 'canned-responses',
      navLabel: 'Canned responses',
      title: 'Canned responses',
      summary: 'Saved snippets your operators insert with a slash shortcut instead of retyping the same answer.',
      metaTitle: 'OyeChats Canned Responses for Live Chat Operators',
      metaDescription:
        'Create canned responses with slash shortcuts so OyeChats live-chat operators can insert common replies instantly.',
      sections: [
        {
          id: 'using',
          heading: 'Creating and using them',
          blocks: [
            {
              t: 'p',
              text: 'Create them per chatbot under **Support → Canned responses**. Each has a title, the message body, and an optional slash shortcut. In a live chat, an operator types `/` followed by the shortcut and the body is inserted into the composer, where it can still be edited before sending.',
            },
            {
              t: 'table',
              head: ['Shortcut', 'Typical body'],
              rows: [
                ['`/hours`', 'Our team is available Monday to Friday, 9am–6pm IST.'],
                ['`/refund`', 'Refund requests go to billing@example.com and are processed within 5 business days.'],
                ['`/escalate`', 'I am bringing in a specialist. One moment.'],
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Who can edit them',
              text: 'Owners and admins manage the library. Operators can use every response but cannot change them, so your wording stays consistent.',
            },
          ],
        },
      ],
    },

    {
      slug: 'offline-messages',
      navLabel: 'Offline messages',
      title: 'Offline messages',
      summary: 'What happens to a visitor who wants a human when no human is there, and how you follow up.',
      metaTitle: 'Offline Messages and Out-of-Hours Enquiries',
      metaDescription:
        'How the OyeChats offline form captures enquiries when no operator is available, where the messages land, and how to follow them up.',
      sections: [
        {
          id: 'form',
          heading: 'The offline form',
          blocks: [
            {
              t: 'p',
              text: 'In any availability state except "available", the widget offers a short form instead of a queue. The visitor leaves their details and message, and the AI chatbot remains available the whole time. The form is an addition, never a dead end.',
            },
            {
              t: 'p',
              text: 'The message shown above the form is fully editable per chatbot, including a "back at" line when you are outside business hours.',
            },
          ],
        },
        {
          id: 'handling',
          heading: 'Handling them',
          blocks: [
            {
              t: 'list',
              items: [
                'Submissions land under **Support → Offline messages** with the full conversation transcript attached.',
                'Mark them handled as you work through them.',
                'The submitter also becomes a lead, so they appear under **Leads** with whatever qualification the conversation produced.',
                'Email notification to your team can be turned on or off per chatbot, and you can set a Reply-To so replies reach your own inbox.',
              ],
            },
            {
              t: 'callout',
              variant: 'success',
              title: 'A visitor confirmation is sent by default',
              text: 'The visitor gets an acknowledgement that their message was received. It is a per-chatbot toggle if you would rather handle that yourself.',
            },
          ],
        },
      ],
    },
  ],
};
