import { SocialIcon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { profile, socials } from "@/lib/data";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-24">
      <Reveal>
        <SpotlightCard className="p-8 text-center sm:p-12">
          <p className="font-mono text-sm uppercase tracking-widest text-accent-cyan">
            Contact
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Let&apos;s work together
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            I&apos;m open to new opportunities. If you have a project, a role or
            just want to say hi, my inbox is open.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-flex rounded-full bg-violet-600 px-6 py-3 font-medium text-white transition hover:brightness-110"
          >
            Say hello
          </a>
          <ul className="mt-10 flex flex-wrap justify-center gap-4">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target={social.icon === "mail" ? undefined : "_blank"}
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-accent-cyan hover:text-white"
                >
                  <span className="[&>svg]:h-5 [&>svg]:w-5">
                    <SocialIcon name={social.icon} />
                  </span>
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </SpotlightCard>
      </Reveal>
    </section>
  );
}
