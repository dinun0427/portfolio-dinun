"use client";

import type { MouseEvent, ReactNode } from "react";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
};

export function SpotlightCard({
  children,
  className = "",
}: SpotlightCardProps) {
  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      onMouseMove={handleMove}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800/60 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgba(139,92,246,0.18), transparent 60%)",
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
