import { Reveal, SectionHeading } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { profile } from "@/lib/data";

export function About() {
  const facts = [
    { label: "Location", value: profile.location },
    { label: "Status", value: profile.status },
  ];

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="About" title="Who I am" />
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 text-lg leading-relaxed text-zinc-400">
          {profile.about.map((paragraph, i) => (
            <Reveal key={paragraph} delay={i * 0.1}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <SpotlightCard className="p-6">
            <dl className="space-y-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-white">{fact.value}</dd>
                </div>
              ))}
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-accent-cyan hover:underline"
                  >
                    {profile.email}
                  </a>
                </dd>
              </div>
            </dl>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}