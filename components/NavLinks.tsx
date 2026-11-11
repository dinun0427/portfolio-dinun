"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type NavItem = { id: string; label: string };

/**
 * The desktop links. A soft pill glides between them as the mouse (or the
 * keyboard) moves, and rests on the current section when nothing is hovered.
 * On hover each label also rolls up, and a coloured copy rolls in.
 */
export function NavLinks({
  links,
  active,
}: {
  links: readonly NavItem[];
  active: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const target = hovered ?? active;

  return (
    <ul
      className="hidden gap-1 md:flex"
      onMouseLeave={() => setHovered(null)}
      onBlur={() => setHovered(null)}
    >
      {links.map((link) => (
        <li key={link.id} className="relative">
          {target === link.id && (
            <motion.span
              layoutId="nav-pill"
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/10"
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 380, damping: 30 }
              }
            />
          )}
          <a
            href={`#${link.id}`}
            aria-current={active === link.id ? "true" : undefined}
            onMouseEnter={() => setHovered(link.id)}
            onFocus={() => setHovered(link.id)}
            className={`group/link relative block rounded-full px-3 py-1.5 text-sm transition-colors ${
              target === link.id ? "text-white" : "text-zinc-400"
            }`}
          >
            <span className="relative block overflow-hidden">
              <span className="block transition-transform duration-300 ease-out group-hover/link:-translate-y-full motion-reduce:transition-none">
                {link.label}
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-0 block translate-y-full text-accent-violet transition-transform duration-300 ease-out group-hover/link:translate-y-0 motion-reduce:transition-none"
              >
                {link.label}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
