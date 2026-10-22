import type { CSSProperties } from "react";
import { techRows } from "@/lib/data";
import { techIcons } from "@/lib/tech-icons";
import type { TechIcon } from "@/lib/tech-icons";

function IconGraphic({ icon }: { icon: TechIcon }) {
  if ("src" in icon) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- tiny static logo
      <img src={icon.src} alt="" width={24} height={24} decoding="async" />
    );
  }

  return (
    <svg viewBox={icon.viewBox ?? "0 0 24 24"} aria-hidden>
      {"layers" in icon ? (
        icon.layers.map((layer, i) => (
          <path key={i} d={layer.d} fill={layer.fill} />
        ))
      ) : (
        <path d={icon.path} />
      )}
    </svg>
  );
}

function TechPill({ name, hidden }: { name: string; hidden: boolean }) {
  const icon = techIcons[name];

  return (
    <li
      aria-hidden={hidden ? true : undefined}
      className="tech-pill group"
      style={icon?.rgb ? ({ "--brand": icon.rgb } as CSSProperties) : undefined}
    >
      {icon && (
        <span className="tech-pill-icon">
          <IconGraphic icon={icon} />
        </span>
      )}
      <span className="font-mono text-sm text-zinc-300 transition-colors group-hover:text-white">
        {name}
      </span>
    </li>
  );
}

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
          { "--marquee-duration": `${items.length * 3.5}s` } as CSSProperties
        }
      >
        {/* the list is rendered twice so the loop has no gap;
            the copy is hidden from screen readers */}
        {[0, 1].flatMap((copy) =>
          items.map((name) => (
            <TechPill key={`${copy}-${name}`} name={name} hidden={copy === 1} />
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
      className="relative z-10 py-8"
    >
      {techRows.map((row, i) => (
        <MarqueeRow key={row[0]} items={row} reverse={i % 2 === 1} />
      ))}
    </section>
  );
}
