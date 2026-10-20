"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { skillGroups } from "@/lib/data";

function SkillBar({ name, level }: { name: string; level: number }) {
  const reduce = useReducedMotion();

  return (
    <li>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-zinc-200">{name}</span>
        <span className="font-mono text-xs text-zinc-400">{level}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={`${name} proficiency`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={level}
        className="h-1.5 overflow-hidden rounded-full bg-white/10"
      >
        <motion.div
          initial={{ width: reduce ? `${level}%` : 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{
            duration: reduce ? 0 : 1.1,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="h-full rounded-full bg-gradient-to-r from-accent-violet via-accent-cyan to-accent-pink"
        />
      </div>
    </li>
  );
}

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Skills"
        title="What I work with"
        description="The bars show how confident I am with each skill, from still learning to advanced."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={(i % 3) * 0.08} className="h-full">
            <SpotlightCard className="h-full p-6">
              <h3 className="text-lg font-semibold text-white">
                {group.title}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">{group.blurb}</p>
              <ul className="mt-6 space-y-4">
                {group.skills.map((skill) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                  />
                ))}
              </ul>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
