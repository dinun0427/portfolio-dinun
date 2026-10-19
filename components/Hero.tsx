"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile, socials } from "@/lib/data";
import { ArrowUpRightIcon, MapPinIcon, SocialIcon } from "./Icons";

function useTypewriter(words: string[], speed = 70, pause = 1600) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    let delay = deleting ? speed / 2 : speed;

    if (!deleting && text === word) delay = pause;
    if (deleting && text === "") delay = 350;

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setText(
          deleting
            ? word.slice(0, text.length - 1)
            : word.slice(0, text.length + 1),
        );
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, words, speed, pause]);

  return text;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const typed = useTypewriter(profile.rotatingRoles);

  return (
    <section
      id="top"
      className="mx-auto flex min-h-screen max-w-5xl items-center px-6 pb-20 pt-32"
    >
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div
          variants={item}
          className="glass inline-flex items-center gap-3 rounded-full px-4 py-1.5 text-sm text-zinc-300"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-emerald-400" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          {profile.status}
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-7 text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Hi, I&apos;m <span className="gradient-text">{profile.name}</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 h-9 font-mono text-xl text-accent-cyan sm:text-2xl"
        >
          <span aria-hidden="true">
            {"> "}
            {typed}
            <span className="ml-0.5 inline-block w-[2px] animate-blink bg-accent-cyan align-middle">
              &nbsp;
            </span>
          </span>
          <span className="sr-only">{profile.rotatingRoles.join(", ")}</span>
        </motion.p>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400"
        >
          {profile.tagline}
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-accent-cyan"
          >
            View my work
            <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href="#contact"
            className="glass inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
          >
            Contact me
          </a>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <div className="flex gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.icon === "mail" ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={social.label}
                className="glass flex h-11 w-11 items-center justify-center rounded-full text-zinc-400 transition hover:-translate-y-1 hover:border-accent-violet/50 hover:text-white"
              >
                <SocialIcon name={social.icon} className="h-5 w-5" />
              </a>
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-sm text-zinc-400">
            <MapPinIcon className="h-4 w-4" />
            {profile.location}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
