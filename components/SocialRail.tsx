import { Magnetic } from "@/components/Magnetic";
import { SocialIcon } from "@/components/Icons";
import { socials } from "@/lib/data";

/**
 * GitHub, LinkedIn and email, pinned to the left edge with no background.
 * Each icon leans toward the cursor. Hidden on narrower screens, where the
 * same links are in the Contact section.
 */
export function SocialRail() {
  return (
    <nav
      aria-label="Social links"
      className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center xl:flex"
    >
      <span
        aria-hidden="true"
        className="mb-3 h-24 w-px bg-gradient-to-t from-zinc-500 to-transparent"
      />
      <ul className="flex flex-col items-center">
        {socials.map((social) => (
          <li key={social.label}>
            <Magnetic>
              <a
                href={social.href}
                target={social.icon === "mail" ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={social.label}
                className="grid h-11 w-11 place-items-center rounded-full text-zinc-400 transition-colors hover:text-accent-violet focus-visible:text-accent-violet"
              >
                <SocialIcon name={social.icon} className="h-6 w-6" />
              </a>
            </Magnetic>
          </li>
        ))}
      </ul>
      <span
        aria-hidden="true"
        className="mt-3 h-24 w-px bg-gradient-to-b from-zinc-500 to-transparent"
      />
    </nav>
  );
}
