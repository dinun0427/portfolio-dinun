"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { experience } from "@/lib/data";

export function Experience() {
  const reduce = useReducedMotion();

  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Experience"
        title="Where I've Worked"
        description="My path from Trainee Software Engineer to Full-Stack AI Engineer."
      />

      <div className="relative">
        {/* the timeline line draws itself as it scrolls into view */}
        <motion.div
          aria-hidden
          initial={reduce ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute bottom-0 left-[11px] top-2 w-px origin-top bg-gradient-to-b from-accent-violet via-accent-cyan/60 to-transparent md:left-1/2"
        />

        <ol className="space-y-12">
          {experience.map((job, i) => {
            const left = i % 2 === 0;

            return (
              <li
                key={`${job.company}-${job.role}`}
                className="relative grid md:grid-cols-2 md:gap-14"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-accent-violet/60 bg-ink-950 md:left-1/2 md:-translate-x-1/2"
                >
                  <span className="h-2 w-2 rounded-full bg-accent-cyan" />
                </span>

                <Reveal
                  className={`pl-10 md:pl-0 ${
                    left ? "md:col-start-1 md:text-right" : "md:col-start-2"
                  }`}
                >
                  <SpotlightCard className="p-6">
                    <p className="font-mono text-xs uppercase tracking-widest text-accent-cyan">
                      {job.period}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {job.role}
                    </h3>
                    <p className="text-zinc-400">{job.company}</p>
                    <p className="mt-4 leading-relaxed text-zinc-400">
                      {job.summary}
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                      {job.highlights.map((highlight) => (
                        <li key={highlight}>
                          <span aria-hidden className="mr-2 text-violet-400">
                            ▹
                          </span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <ul
                      className={`mt-5 flex flex-wrap gap-2 ${
                        left ? "md:justify-end" : ""
                      }`}
                    >
                      {job.tech.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-zinc-300"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </SpotlightCard>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
