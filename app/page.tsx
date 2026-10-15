import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Tilt } from "@/components/Tilt";
import { projects } from "@/lib/data";

export default function Home() {
  return (
    <main>
      <Hero />
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="Demo"
          title="Reusable blocks"
          description="Temporary section to test Reveal, SpotlightCard and Tilt."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((p) => (
            <Tilt key={p.title}>
              <SpotlightCard className="p-6">
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{p.description}</p>
              </SpotlightCard>
            </Tilt>
          ))}
        </div>
      </section>
    </main>
  );
}