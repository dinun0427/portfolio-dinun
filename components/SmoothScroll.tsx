"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Smooth, eased scrolling for mouse wheels and trackpads.
 * Off for reduced motion. Touch screens keep their native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1 });

    // One clock for everything: GSAP's ticker drives Lenis, and every Lenis
    // scroll tells ScrollTrigger, so scroll-linked animations stay in sync.
    const onTick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", () => ScrollTrigger.update());
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Same-page links (#about, #contact...) glide instead of jumping.
    // Lenis respects each section's scroll-margin-top, so the fixed navbar
    // never covers a section title.
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      const hash = link?.getAttribute("href");
      // keep the skip link's native behaviour so keyboard focus moves too
      if (!hash || hash === "#main") return;

      const target =
        hash === "#"
          ? 0
          : document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target === null) return;

      event.preventDefault();
      lenis.scrollTo(target);
      if (hash !== "#") history.pushState(null, "", hash);
    }

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(onTick);
      gsap.ticker.lagSmoothing(500, 33); // GSAP's default
      lenis.destroy();
    };
  }, []);

  return null;
}
