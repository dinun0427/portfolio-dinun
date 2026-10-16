import { Reveal, SectionHeading } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { nowItems } from "@/lib/data";

export function Now() {
  return (
    <section id="now" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Now"
        title="What I'm doing right now"
        description="A live snapshot of what I'm learning and building."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {nowItems.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.1} className="h-full">
            <SpotlightCard className="h-full p-6">
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-pink">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full bg-accent-pink"
                />
                {item.label}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {item.detail}
              </p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
