"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/**
 * A soft light that follows the mouse across the whole page.
 * Fine pointers only (no touch). For reduced motion the listener is never
 * attached and CSS hides the layer, so server and client render the same HTML.
 */
export function CursorGlow() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const smoothX = useSpring(x, { stiffness: 120, damping: 22, mass: 0.6 });
  const smoothY = useSpring(y, { stiffness: 120, damping: 22, mass: 0.6 });

  const background = useMotionTemplate`radial-gradient(520px circle at ${smoothX}px ${smoothY}px, rgba(139,92,246,0.16), rgba(34,211,238,0.06) 40%, transparent 70%)`;

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y]);

  return (
    <motion.div
      aria-hidden
      data-testid="cursor-glow"
      className="absolute inset-0 motion-reduce:hidden"
      style={{ background }}
    />
  );
}
