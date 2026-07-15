'use client';

import { useEffect } from 'react';

/**
 * Defers loading the OyeChats chat widget off the critical path.
 *
 * The widget script is the single largest main-thread cost on the page, so we
 * hold it back until the visitor shows intent (scroll / pointer / touch / key)
 * or the browser goes idle — whichever comes first. This keeps Total Blocking
 * Time low without ever failing to load the widget.
 *
 * Renders nothing.
 */

const WIDGET_SRC = 'https://cdn.oyechats.com/oyechats-widget.js';
const WIDGET_BOT_KEY = 'bot-9d52d243038c';
const IDLE_FALLBACK_MS = 4000;

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export default function WidgetLoader(): null {
  useEffect(() => {
    // The widget's settings API validates the request origin against the bot's
    // allowed domains, so it can only succeed on real deployments. On localhost
    // it always fails with "Failed to fetch chatbot settings" — skip loading it
    // in local dev to keep the console clean. Every real host still loads it.
    const host = window.location.hostname;
    const isLocalHost =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '[::1]' ||
      host.endsWith('.local');
    if (isLocalHost) return;

    let loaded = false;
    const interactionEvents = ['scroll', 'pointerdown', 'touchstart', 'keydown'] as const;

    const idleWindow = window as IdleWindow;
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;

    const cleanup = (): void => {
      for (const event of interactionEvents) {
        window.removeEventListener(event, load);
      }
      if (idleHandle !== undefined && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== undefined) {
        window.clearTimeout(timeoutHandle);
      }
    };

    function load(): void {
      if (loaded) return;
      loaded = true;
      cleanup();

      if (document.querySelector(`script[src="${WIDGET_SRC}"]`)) return;

      const script = document.createElement('script');
      script.src = WIDGET_SRC;
      script.async = true;
      script.setAttribute('data-bot-key', WIDGET_BOT_KEY);
      document.body.appendChild(script);
    }

    for (const event of interactionEvents) {
      window.addEventListener(event, load, { once: true, passive: true });
    }

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(load, { timeout: IDLE_FALLBACK_MS });
    } else {
      timeoutHandle = window.setTimeout(load, IDLE_FALLBACK_MS);
    }

    return cleanup;
  }, []);

  return null;
}
