import type { CSSProperties } from "react";
import { techRows } from "@/lib/data";

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  return (
    <div className={`marquee ${reverse ? "marquee-reverse" : ""}`}>
      <ul
        className="marquee-track"
        style={
          { "--marquee-duration": `${items.length * 3}s` } as CSSProperties
        }
      >
        {/* the list is rendered twice so the loop has no gap;
            the copy is hidden from screen readers */}
        {[0, 1].flatMap((copy) =>
          items.map((name) => (
            <li
              key={`${copy}-${name}`}
              aria-hidden={copy === 1 ? true : undefined}
              className="mr-3 shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm text-zinc-300 transition-colors hover:border-accent-cyan hover:text-white"
            >
              {name}
            </li>
          )),
        )}
      </ul>
    </div>
  );
}

export function TechMarquee() {
  return (
    <section
      aria-label="Technologies I work with"
      className="relative z-10 space-y-3 py-10"
    >
      {techRows.map((row, i) => (
        <MarqueeRow key={row[0]} items={row} reverse={i % 2 === 1} />
      ))}
    </section>
  );
}
