import { ArrowUpRightIcon } from "@/components/Icons";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Tilt } from "@/components/Tilt";
import { projects } from "@/lib/data";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Projects"
        title="Things I've built"
        description="A few projects, from research to full-stack apps."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.08} className="h-full">
            <Tilt className="h-full">
              <SpotlightCard className="h-full p-6">
                <div className="flex h-full flex-col">
                  <p className="font-mono text-xs uppercase tracking-widest text-violet-400">
                    {project.kind}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {project.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                    {project.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-zinc-300"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex gap-4 text-sm">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-accent-cyan hover:underline"
                      >
                        Code <ArrowUpRightIcon className="h-4 w-4" />
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-accent-cyan hover:underline"
                      >
                        Live <ArrowUpRightIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
