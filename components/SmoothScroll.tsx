"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth, eased scrolling for mouse wheels and trackpads.
 * Off for reduced motion. Touch screens keep their native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true, lerp: 0.1 });

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
      lenis.destroy();
    };
  }, []);

  return null;
}
