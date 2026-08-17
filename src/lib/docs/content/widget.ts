import type { DocGroup } from '../types';

export const WIDGET: DocGroup = {
  slug: 'widget',
  label: 'The website widget',
  description: 'Install it, style it, control its behaviour, and lock it to your own domains.',
  pages: [
    {
      slug: 'install',
      navLabel: 'Install',
      title: 'Installing the widget',
      summary:
        'One script tag, any website. This page covers the snippet, where it goes, how loading works, and how to verify the install.',
      metaTitle: 'Install the OyeChats Chat Widget on Any Website',
      metaDescription:
        'Add the OyeChats AI chat widget to your website with one script tag. Placement, loading behaviour, consent-gated installs and install verification.',
      sections: [
        {
          id: 'snippet',
          heading: 'The snippet',
          blocks: [
            {
              t: 'p',
              text: 'Copy the snippet from **Chatbots → Channels → Website** (it arrives with your bot key already filled in) and paste it immediately before the closing `</body>` tag of every page where the widget should appear.',
            },
            {
              t: 'code',
              label: 'HTML',
              code: `<script
  src="https://cdn.oyechats.com/oyechats-widget.js"
  data-bot-key="bot-6a427d4529b9"
  defer
></script>`,
            },
            {
              t: 'table',
              head: ['Attribute', 'Required', 'Purpose'],
              rows: [
                ['`data-bot-key`', 'Yes', 'Identifies which chatbot to load. Public by design.'],
                ['`defer`', 'Recommended', 'Keeps the script off your page\'s critical rendering path.'],
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Everything else is configured server-side',
              text: 'Colours, copy, avatar, suggested questions, lead form, live chat and timings all live on the chatbot record and are fetched at load time. There are no other data attributes to set, and changing settings in the dashboard takes effect without editing your HTML.',
            },
          ],
        },
        {
          id: 'placement',
          heading: 'Where to put it',
          blocks: [
            {
              t: 'list',
              items: [
                'Inside `<body>`, as the last element before `</body>`. The widget creates its own container element at load time.',
                'On every page you want it on. A snippet in a shared footer, layout or template covers a whole site at once.',
                'Once per page. Two copies of the script mount one widget, but the duplicate load is wasted bandwidth.',
              ],
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'Not in <head>',
              text: 'The script needs a `<body>` to attach to. Placed in `<head>` it may run before the body exists and fail to mount.',
            },
          ],
        },
        {
          id: 'isolation',
          heading: 'How it loads',
          blocks: [
            {
              t: 'steps',
              items: [
                {
                  title: 'It finds itself',
                  text: 'The loader locates its own `<script>` tag and reads `data-bot-key`.',
                },
                {
                  title: 'It mounts into a shadow root',
                  text: 'The UI renders inside a shadow DOM, so your site\'s CSS cannot leak in and the widget\'s CSS cannot leak out. It carries its own copy of its framework and does not touch your page\'s JavaScript.',
                },
                {
                  title: 'It fetches its configuration',
                  text: 'Appearance and behaviour come from a public settings endpoint keyed by your bot key. No account credentials are involved.',
                },
                {
                  title: 'It renders the launcher',
                  text: 'A floating button, bottom-right. The chat panel itself is only created when a visitor opens it.',
                },
              ],
            },
            {
              t: 'p',
              text: 'Because the panel mounts on interaction rather than on page load, the widget contributes very little to your initial page weight.',
            },
          ],
        },
        {
          id: 'consent',
          heading: 'Consent-gated installs',
          blocks: [
            {
              t: 'p',
              text: 'If your consent banner must approve the widget before it does anything, set a flag before the script loads and mount it yourself after consent is granted.',
            },
            {
              t: 'code',
              label: 'HTML + JS',
              code: `<script>window.OYECHATS_ASYNC_INIT = true;</script>
<script
  src="https://cdn.oyechats.com/oyechats-widget.js"
  data-bot-key="bot-6a427d4529b9"
  defer
></script>

<script>
  // Call this from your consent manager's "accepted" callback.
  function onConsentGranted() {
    window.OyeChats.init();
  }
</script>`,
            },
            {
              t: 'p',
              text: 'With the flag set, the script downloads but nothing mounts and no configuration request is made until `init()` is called. See [Cookies](/legal/cookies) for what the widget stores in the browser.',
            },
          ],
        },
        {
          id: 'verify',
          heading: 'Verifying the install',
          blocks: [
            {
              t: 'list',
              items: [
                'Load the page in a normal tab and look for the launcher in the bottom-right corner.',
                'Open the console. Widget messages are prefixed `[OyeChats]`. Run `OyeChats.diagnose()` for a snapshot of version, mount state and resolved configuration.',
                'The dashboard marks the chatbot as installed after the widget has bootstrapped from your real domain at least once — dashboard previews, the demo page and localhost do not count.',
              ],
            },
            {
              t: 'p',
              text: 'Nothing appearing? Start with [Troubleshooting](/docs/support/troubleshooting).',
            },
          ],
        },
      ],
    },

    {
      slug: 'platforms',
      navLabel: 'Platform guides',
      title: 'Platform-specific install',
      summary:
        'Where the script tag goes on the platforms customers ask about most. In every case it is the same snippet.',
      metaTitle: 'Install on WordPress, Shopify or Next.js',
      metaDescription:
        'Platform-by-platform instructions for adding the OyeChats chat widget: WordPress, Shopify, Webflow, Wix, Squarespace, Next.js, React, Vue and Google Tag Manager.',
      sections: [
        {
          id: 'cms',
          heading: 'Website builders and CMS',
          blocks: [
            {
              t: 'defs',
              items: [
                {
                  term: 'WordPress',
                  text: 'Appearance → Theme File Editor → `footer.php`, before `</body>`. Or use any "insert headers and footers" plugin and paste into the footer/body field. Editing a child theme survives theme updates; editing the parent theme does not.',
                },
                {
                  term: 'Shopify',
                  text: 'Online Store → Themes → Edit code → `layout/theme.liquid`, before `</body>`.',
                },
                {
                  term: 'Webflow',
                  text: 'Project settings → Custom code → Footer code, then publish. Custom code does not run on the Designer canvas — test on the published site.',
                },
                {
                  term: 'Wix',
                  text: 'Settings → Custom code → Add custom code, place in Body – end, apply to all pages.',
                },
                {
                  term: 'Squarespace',
                  text: 'Settings → Advanced → Code injection → Footer. Requires a Business plan or above.',
                },
                {
                  term: 'Ghost',
                  text: 'Settings → Code injection → Site footer.',
                },
              ],
            },
          ],
        },
        {
          id: 'frameworks',
          heading: 'JavaScript frameworks',
          blocks: [
            { t: 'h3', text: 'Next.js (App Router)' },
            {
              t: 'code',
              label: 'app/layout.tsx',
              code: `import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://cdn.oyechats.com/oyechats-widget.js"
          data-bot-key="bot-6a427d4529b9"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}`,
            },
            { t: 'h3', text: 'React, Vue or any SPA' },
            {
              t: 'p',
              text: 'Put the snippet in the static `index.html` rather than injecting it from a component. A component-mounted script re-runs on route changes and can mount the widget more than once.',
            },
            { t: 'h3', text: 'Google Tag Manager' },
            {
              t: 'p',
              text: 'Create a Custom HTML tag containing the snippet and fire it on All Pages. GTM injects into the DOM at runtime, which the widget supports. If your GTM container is itself consent-gated, use the [consent-gated install](/docs/widget/install) pattern so the two gates do not fight.',
            },
          ],
        },
        {
          id: 'spa',
          heading: 'Single-page apps and route changes',
          blocks: [
            {
              t: 'p',
              text: 'The widget survives client-side navigation on its own — it lives outside your app\'s render tree, so it does not unmount when a route changes. You do not need to re-initialise it per route.',
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Conversations follow the visitor',
              text: 'A conversation is keyed per browser and origin, so a visitor who navigates around your site keeps the same conversation. To continue conversations across subdomains, see [Widget security](/docs/widget/security).',
            },
          ],
        },
      ],
    },

    {
      slug: 'customize',
      navLabel: 'Appearance & copy',
      title: 'Appearance and copy',
      summary:
        'Colours, avatar, launcher, every visitor-facing string, and branding removal. All of it is dashboard configuration — no code.',
      metaTitle: 'Customise the Chat Widget: Colours and Copy',
      metaDescription:
        'Configure the OyeChats widget appearance and wording: brand colours, avatar, launcher label, welcome copy, offline message, rating prompt and white-label branding.',
      sections: [
        {
          id: 'appearance',
          heading: 'Appearance',
          blocks: [
            {
              t: 'table',
              head: ['Setting', 'Applies to'],
              rows: [
                ['Primary colour', 'Buttons, accents and the send control.'],
                ['Header colour', 'The chat panel header.'],
                ['Background colour', 'The message area.'],
                ['Visitor bubble colour', 'The visitor\'s own messages.'],
                ['Avatar', 'The chatbot\'s picture in the header and next to its messages — upload an image or use a generated orb.'],
                ['Launcher label', 'The text on the floating button, e.g. "Have Questions?".'],
                ['Launcher icon', 'The image on the floating button.'],
              ],
            },
            {
              t: 'callout',
              variant: 'success',
              title: 'Palette suggestions',
              text: 'If you trained from a website, OyeChats samples that site\'s colours and offers them as one-click suggestions, so the widget can match your brand without you fetching hex codes.',
            },
          ],
        },
        {
          id: 'copy',
          heading: 'Every visitor-facing string',
          blocks: [
            {
              t: 'p',
              text: 'All of these are editable per chatbot from **Experience → Messages**. Defaults are shown so you can see what you are replacing.',
            },
            {
              t: 'table',
              head: ['String', 'Default'],
              rows: [
                ['Welcome greeting', '"Hi There, How can I help you today?"'],
                ['Welcome title', '"Hi there 👋"'],
                ['Suggested questions', '"Our Services", "About us", "Contact us"'],
                ['Input placeholder', '"Write a message..."'],
                ['Proactive greeting', '"Hi! Let us know if you have any questions."'],
                ['Live chat label', '"Live chat"'],
                ['Waiting message', 'Shown while a visitor waits for an operator.'],
                ['Offline message', '"We\'ll be right back! Leave a message and we\'ll follow up shortly."'],
                ['Rating prompt', '"How was your experience?"'],
                ['End-chat label', '"End chat and return to AI"'],
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Writing for another language',
              text: 'There is no automatic translation layer for widget chrome. To run the widget in another language, replace these strings with that language and instruct the chatbot to reply in it via the [system prompt](/docs/chatbot/answer-control).',
            },
          ],
        },
        {
          id: 'features',
          heading: 'Optional widget features',
          blocks: [
            {
              t: 'table',
              head: ['Feature', 'Default', 'What it does'],
              rows: [
                ['Post-chat rating', 'On', 'Asks the visitor to rate the conversation when it ends. Feeds **Analytics → Ratings**.'],
                ['Typing preview', 'On', 'Shows the visitor that an operator is typing during live chat.'],
                ['Show branding', 'On', 'The "Powered by OyeChats" badge inside the widget.'],
                ['Queue position', 'Off', 'Tells a waiting visitor their place in the live-chat queue.'],
                ['File sharing', 'Off', 'Lets a visitor attach a file during a live chat with an operator.'],
                ['Email transcript', 'Off', 'Offers the visitor a copy of the conversation by email.'],
              ],
            },
          ],
        },
        {
          id: 'branding',
          heading: 'Removing OyeChats branding',
          blocks: [
            {
              t: 'p',
              text: 'White-label branding is a plan entitlement. On plans that include it you can turn off the in-widget badge and edit the branding text and link, and the dashboard emits an embed snippet without the attribution anchor.',
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Two separate things',
              text: 'The in-widget badge and the attribution `<a>` in your page HTML are distinct. The badge is inside the shadow root and only visible after a visitor opens the chat; the anchor is in your served HTML, which is the only version search engines and AI assistants can read. Removing branding removes both.',
            },
          ],
        },
      ],
    },

    {
      slug: 'behavior',
      navLabel: 'Behaviour & timing',
      title: 'Behaviour and timing',
      summary:
        'When the widget speaks first, how long it waits, when it offers a human, and the JavaScript API for driving it from your own code.',
      metaTitle: 'OyeChats Widget Behaviour, Timing and JavaScript API',
      metaDescription:
        'Configure greetings, handoff timing and reconnection for the OyeChats widget, and drive it from your code with the JavaScript API.',
      sections: [
        {
          id: 'timing',
          heading: 'Timing settings',
          blocks: [
            {
              t: 'p',
              text: 'These live under **Advanced** on each chatbot. The defaults are tuned for a typical marketing site; change them if your traffic behaves differently.',
            },
            {
              t: 'table',
              head: ['Setting', 'Default', 'Effect'],
              rows: [
                ['Greeting delay', '3,000 ms', 'How long after page load the proactive greeting bubble appears.'],
                ['Handoff form delay', '0 ms', 'Pause between the chatbot offering a human and the handoff form appearing. Raise it to let the visitor finish reading.'],
                ['Frustration window', '30,000 ms', 'The rolling window used to detect a struggling visitor.'],
                ['Frustration threshold', '3 messages', 'How many messages inside that window trigger a proactive offer of a human.'],
                ['Typing timeout', '2,000 ms', 'How long the typing indicator lingers after the last keystroke.'],
                ['Queue timeout', '20 s', 'How long a visitor waits in the live-chat queue before falling back to the offline form.'],
                ['Maximum queue size', '10', 'Past this, new handoff requests get the offline form instead of a queue slot.'],
              ],
            },
          ],
        },
        {
          id: 'reconnect',
          heading: 'Connection handling',
          blocks: [
            {
              t: 'p',
              text: 'During a live chat the widget holds a real-time connection. If the network drops it reconnects automatically with a backing-off delay, up to 15 attempts and a maximum 30-second gap, and it heartbeats less often while the tab is in the background to save battery.',
            },
            {
              t: 'p',
              text: 'Separate disconnect timeouts decide when a silent participant is treated as gone: 120 seconds for a visitor, 60 for an operator, both configurable per chatbot.',
            },
          ],
        },
        {
          id: 'js-api',
          heading: 'JavaScript API',
          blocks: [
            {
              t: 'p',
              text: 'The widget exposes `window.OyeChats`. Calls made before the bundle finishes loading are queued and replayed, so you do not need to wait for a ready callback before calling a method.',
            },
            {
              t: 'table',
              head: ['Method', 'What it does'],
              rows: [
                ['`OyeChats.init()`', 'Mounts the widget. Only needed with `OYECHATS_ASYNC_INIT`.'],
                ['`OyeChats.destroy()`', 'Unmounts the widget and removes its container.'],
                ['`OyeChats.open()`', 'Opens the chat panel.'],
                ['`OyeChats.close()`', 'Closes the chat panel.'],
                ['`OyeChats.toggle()`', 'Toggles the panel.'],
                ['`OyeChats.send("text")`', 'Opens the panel and sends a message as the visitor.'],
                ['`OyeChats.boot()`', 'Starts a fresh conversation, discarding the stored one.'],
                ['`OyeChats.shutdown()`', 'Ends the session and clears the stored conversation — use this on logout.'],
                ['`OyeChats.diagnose()`', 'Logs and returns a diagnostic snapshot. Useful in a support ticket.'],
                ['`OyeChats.version`', 'The loaded bundle version.'],
              ],
            },
            { t: 'h3', text: 'Events' },
            {
              t: 'p',
              text: 'Subscribe with `on`, `once` and `off`. Three events are emitted today:',
            },
            {
              t: 'table',
              head: ['Event', 'Fires when'],
              rows: [
                ['`ready`', 'The widget has mounted. Payload carries the bundle version.'],
                ['`open`', 'The chat panel opens.'],
                ['`close`', 'The chat panel closes.'],
              ],
            },
            {
              t: 'code',
              label: 'JavaScript',
              code: `// Open the chat from your own button.
document.querySelector('#help').addEventListener('click', () => {
  window.OyeChats.open();
});

// Or open it with a question already asked.
window.OyeChats.send('How do I change my plan?');

// React to the widget mounting.
window.OyeChats.on('ready', ({ version }) => {
  console.log('OyeChats ready', version);
});

// Clear the conversation when your user signs out.
function onLogout() {
  window.OyeChats.shutdown();
}`,
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Debug logging',
              text: 'Set `window.OYECHATS_DEBUG = true` before the script loads for verbose console output while you are integrating.',
            },
          ],
        },
      ],
    },

    {
      slug: 'security',
      navLabel: 'Widget security',
      title: 'Widget security',
      summary:
        'Your bot key is public. This page explains why that is fine, and how to stop anyone from embedding your chatbot on a site you do not own.',
      metaTitle: 'Widget Security: Domain Allowlist, Bot Keys',
      metaDescription:
        'How OyeChats bot keys work, how to restrict your chat widget to your own domains with the allowlist, and how cross-subdomain conversation continuity works.',
      sections: [
        {
          id: 'bot-key',
          heading: 'What the bot key can and cannot do',
          blocks: [
            {
              t: 'p',
              text: 'The bot key is in your page source, so treat it as public — every embedded chat product works this way. It is scoped to exactly one capability: starting and continuing visitor conversations with that one chatbot. It cannot read your leads, your analytics, your billing or your settings. Only your `X-API-Key` can do that, and it never touches the browser.',
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'The risk that is real',
              text: 'Someone who copies your key could embed your chatbot on their own site and spend your credits. That is what the domain allowlist prevents.',
            },
          ],
        },
        {
          id: 'allowlist',
          heading: 'Domain allowlist',
          blocks: [
            {
              t: 'p',
              text: 'Under **Advanced → Allowed domains**, list the hostnames the widget may load on. Requests whose browser origin does not match are rejected.',
            },
            {
              t: 'table',
              head: ['Entry', 'Matches', 'Does not match'],
              rows: [
                ['`acme.com`', '`acme.com`', '`www.acme.com`, `app.acme.com`'],
                ['`*.acme.com`', '`www.acme.com`, `app.acme.com`', '`acme.com` itself'],
                ['`acme.com` and `*.acme.com`', 'the apex and every subdomain', '—'],
              ],
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'An empty list allows everything',
              text: 'The check is on by default but has nothing to enforce until you add at least one domain. Add your domains as part of going live — this is the single most valuable widget setting most customers never touch.',
            },
            {
              t: 'p',
              text: 'Add `www` and non-`www` if your site serves both, and add your staging hostname if you test there. `localhost` and `127.0.0.1` are accepted in non-production environments without being listed.',
            },
            {
              t: 'p',
              text: 'The allowlist checks the browser-supplied origin, which a page running in another browser tab cannot forge. A non-browser client such as a script can send any origin it likes, so per-chatbot rate limits and quotas remain the layer that bounds abuse from those.',
            },
          ],
        },
        {
          id: 'sessions',
          heading: 'Conversations across subdomains',
          blocks: [
            {
              t: 'p',
              text: 'By default a conversation is stored per browser and per origin, so a visitor who moves from `example.com` to `academy.example.com` starts a new one — browser storage cannot cross that boundary on its own.',
            },
            {
              t: 'p',
              text: 'Setting a session-sharing domain (for example `example.com`) makes the widget mirror the conversation identifier into a cookie scoped to that parent domain, so the conversation continues across every subdomain under it. Leave it unset to keep each origin independent.',
            },
          ],
        },
        {
          id: 'visitor-privacy',
          heading: 'What visitors are asked for',
          blocks: [
            {
              t: 'p',
              text: 'The widget never asks a visitor for a password or a payment detail. Contact details are only collected where you have enabled the [lead form](/docs/leads/capture) or the visitor volunteers them in conversation.',
            },
            {
              t: 'p',
              text: 'Visitor IP addresses are used for geolocation and abuse prevention and are never shown in the dashboard, included in a CSV export, or returned by the API — those boundaries return geography only. Full detail is in the [Privacy Policy](/legal/privacy).',
            },
          ],
        },
      ],
    },
  ],
};
