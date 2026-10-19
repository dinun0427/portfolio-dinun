import { Reveal, SectionHeading } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { skillGroups } from "@/lib/data";
import type { SkillLevel } from "@/lib/types";

const levelDots: Record<SkillLevel, number> = {
  learning: 1,
  proficient: 2,
  advanced: 3,
};

function LevelDots({ level }: { level: SkillLevel }) {
  const filled = levelDots[level];
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${
            n <= filled ? "bg-accent-cyan" : "bg-white/15"
          }`}
        />
      ))}
      <span className="sr-only">{level}</span>
    </span>
  );
}

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Skills"
        title="What I work with"
        description="Dots show my confidence: one is learning, two is proficient, three is advanced."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={(i % 3) * 0.08}>
            <SpotlightCard className="h-full p-6">
              <h3 className="text-lg font-semibold text-white">
                {group.title}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">{group.blurb}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-200"
                  >
                    {skill.name}
                    <LevelDots level={skill.level} />
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
