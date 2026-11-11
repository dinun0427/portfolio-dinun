"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/**
 * Makes whatever is inside lean toward the mouse, like a magnet, and spring
 * back when the mouse leaves. The padding gives it a catch area around the
 * content, so the pull starts a little before the cursor touches it.
 */
export function Magnetic({
  children,
  strength = 0.4,
  className = "",
}: {
  children: ReactNode;
  /** how far it follows the cursor (0 = not at all, 1 = fully) */
  strength?: number;
  className?: string;
}) {
  const area = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 14, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 14, mass: 0.4 });

  function onMove(event: PointerEvent<HTMLDivElement>) {
    // mouse only: a finger has no "hover" to pull toward
    if (reduce || event.pointerType !== "mouse" || !area.current) return;
    const box = area.current.getBoundingClientRect();
    x.set((event.clientX - (box.left + box.width / 2)) * strength);
    y.set((event.clientY - (box.top + box.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={area}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`p-3 ${className}`}
    >
      <motion.div style={{ x: springX, y: springY }}>{children}</motion.div>
    </div>
  );
}
