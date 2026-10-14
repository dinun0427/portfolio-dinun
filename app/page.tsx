import { profile, projects } from "@/lib/data";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-5xl font-semibold tracking-tight text-white">
        {profile.name}
      </h1>
      <p className="mt-2 font-mono text-accent-cyan">{profile.role}</p>

      <ul className="mt-10 space-y-3">
        {projects.map((project) => (
          <li key={project.title}>
            <span className="font-semibold text-white">{project.title}</span>:{" "}
            {project.description}
          </li>
        ))}
      </ul>
    </main>
  );
}