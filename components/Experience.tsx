import { Reveal, SectionHeading } from "@/components/Reveal";
import { experience } from "@/lib/data";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-24">
      <SectionHeading
        eyebrow="Experience"
        title="Where I've worked"
        description="My path from trainee engineer to AI/ML engineer."
      />
      <ol className="relative border-l border-white/10 pl-8">
        {experience.map((job, i) => (
          <li
            key={`${job.company}-${job.role}`}
            className="relative pb-12 last:pb-0"
          >
            <span
              aria-hidden
              className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full border-2 border-accent-violet bg-ink-950"
            />
            <Reveal delay={i * 0.08}>
              <p className="font-mono text-xs uppercase tracking-widest text-accent-cyan">
                {job.period}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                {job.role}{" "}
                <span className="font-normal text-zinc-400">
                  · {job.company}
                </span>
              </h3>
              <p className="mt-3 leading-relaxed text-zinc-400">
                {job.summary}
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-400 marker:text-violet-400">
                {job.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <ul className="mt-4 flex flex-wrap gap-2">
                {job.tech.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-zinc-300"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
