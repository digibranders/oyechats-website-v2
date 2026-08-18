"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

interface FadeUpProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Delay before the animation starts, in seconds. */
  delay?: number;
  /** Vertical offset to animate from, in pixels. */
  y?: number;
  /** Duration of the animation, in seconds. */
  duration?: number;
  /** Fraction of the element that must be in view before triggering (0-1). */
  amount?: number;
  /** If true, replay the animation each time the element re-enters the viewport. */
  replay?: boolean;
}

// Module-level store: flips to `true` on bfcache restore so every FadeUp on the
// page falls through to the plain-div branch. Avoids the IntersectionObserver
// re-attach problem that left content stuck at opacity 0.
let bfcacheRestored = false;
const bfcacheListeners = new Set<() => void>();

function subscribeBfcache(cb: () => void) {
  bfcacheListeners.add(cb);
  return () => {
    bfcacheListeners.delete(cb);
  };
}

function getBfcacheSnapshot() {
  return bfcacheRestored;
}

function getServerFalse() {
  return false;
}

if (typeof window !== "undefined") {
  window.addEventListener("pageshow", (event) => {
    if ((event as PageTransitionEvent).persisted) {
      bfcacheRestored = true;
      for (const cb of bfcacheListeners) cb();
    }
  });
}

// prefers-reduced-motion as an external store, so the plain-div branch also
// wins if the user flips the OS setting while the page is open.
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduce(cb: () => void) {
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener("change", cb);
  return () => {
    mq.removeEventListener("change", cb);
  };
}

function getReduceSnapshot() {
  return window.matchMedia(REDUCE_QUERY).matches;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Same curve the motion/react version used ([0.16, 1, 0.3, 1]).
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Fades a block up as it scrolls into view, with plain CSS transitions driven
 * by one IntersectionObserver, no animation library. This component (via
 * Reveal) is on every page, and the motion/react runtime it previously pulled
 * in was a measurable slice of the critical-path JS that throttled-mobile
 * Lighthouse charges against LCP/TBT.
 *
 * SSR-safe and bfcache-safe: content is visible by default and only below-the-
 * fold blocks arm the entrance animation, so the hero/LCP text never paints at
 * opacity 0. Respects prefers-reduced-motion.
 */
export function FadeUp({
  children,
  delay = 0,
  y = 30,
  duration = 0.7,
  amount = 0.05,
  replay = false,
  style,
  ...rest
}: FadeUpProps) {
  const reduce = useSyncExternalStore(
    subscribeReduce,
    getReduceSnapshot,
    getServerFalse,
  );
  const restored = useSyncExternalStore(
    subscribeBfcache,
    getBfcacheSnapshot,
    getServerFalse,
  );
  const ref = useRef<HTMLDivElement | null>(null);
  // Default to `true` so the server-rendered HTML is fully visible. Only when
  // the client has mounted AND confirmed the element is below the fold do we
  // arm the entrance animation. This is what makes FadeUp SSR-safe and
  // bfcache-safe: there is no render path that paints opacity:0 unattended.
  const [skipAnimation, setSkipAnimation] = useState(true);
  const [inView, setInView] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (reduce || restored) {
      setSkipAnimation(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const viewportH =
      window.innerHeight || document.documentElement.clientHeight || 0;
    // If the element's top edge is already in (or above) the viewport at mount,
    // skip animation, it's already visible, no need to animate from opacity 0.
    // A 0-height viewport means the page mounted before layout (hidden tab,
    // embedded pane): we can't tell what's above the fold, so fail visible.
    const alreadyVisible = viewportH === 0 || rect.top < viewportH;
    setSkipAnimation(alreadyVisible);
  }, [reduce, restored]);

  const animate = !(reduce || restored || skipAnimation);

  useEffect(() => {
    if (!animate) return;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (!replay) io.disconnect();
          } else if (replay) {
            setInView(false);
          }
        }
      },
      // Mirrors the previous motion/react viewport config:
      // { amount, margin: '0px 0px -60px 0px' }.
      { threshold: amount, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [animate, amount, replay]);

  if (!animate) {
    return (
      <div ref={ref} style={style} {...rest}>
        {children}
      </div>
    );
  }

  const animStyle: CSSProperties = {
    ...style,
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0px)" : `translateY(${y}px)`,
    transition: `opacity ${duration}s ${EASE} ${delay}s, transform ${duration}s ${EASE} ${delay}s`,
  };

  return (
    <div ref={ref} style={animStyle} {...rest}>
      {children}
    </div>
  );
}
