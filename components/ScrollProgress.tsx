"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** A thin bar at the top of the page that fills as you scroll. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // only when the visitor has not asked for reduced motion
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        },
      );
    });

    return () => mm.revert();
  });

  return (
    <div
      ref={bar}
      aria-hidden
      data-testid="scroll-progress"
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-0.5 origin-left scale-x-0 bg-gradient-to-r from-accent-violet via-accent-cyan to-accent-pink"
    />
  );
}
