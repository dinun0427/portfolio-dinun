"use client";

import { motion } from "framer-motion";

type CodeWindowProps = {
  name: string;
  role: string;
  stack: readonly string[];
  focus: readonly string[];
};

const punctuation = "text-zinc-400";
const stringColor = "text-emerald-300";

function StringList({ items }: { items: readonly string[] }) {
  return (
    <>
      <span className={punctuation}>[</span>
      {items.map((item, i) => (
        <span key={item}>
          <span className={stringColor}>&quot;{item}&quot;</span>
          {i < items.length - 1 && <span className={punctuation}>, </span>}
        </span>
      ))}
      <span className={punctuation}>],</span>
    </>
  );
}

export function CodeWindow({ name, role, stack, focus }: CodeWindowProps) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative hidden lg:block"
    >
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-accent-violet/30 via-accent-cyan/20 to-accent-pink/30 blur-3xl" />
      <div className="glass relative animate-bob rounded-2xl shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          <span className="ml-3 font-mono text-xs text-zinc-400">
            developer.ts
          </span>
        </div>
        <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-7">
          <code>
            <span className="text-violet-400">const</span>{" "}
            <span className="text-sky-300">developer</span>
            <span className={punctuation}>: </span>
            <span className="text-accent-cyan">Developer</span>{" "}
            <span className={punctuation}>= {"{"}</span>
            {"\n"}
            {"  "}name<span className={punctuation}>: </span>
            <span className={stringColor}>&quot;{name}&quot;</span>
            <span className={punctuation}>,</span>
            {"\n"}
            {"  "}role<span className={punctuation}>: </span>
            <span className={stringColor}>&quot;{role}&quot;</span>
            <span className={punctuation}>,</span>
            {"\n"}
            {"  "}stack<span className={punctuation}>: </span>
            <StringList items={stack} />
            {"\n"}
            {"  "}focus<span className={punctuation}>: </span>
            <StringList items={focus} />
            {"\n"}
            {"  "}openToWork<span className={punctuation}>: </span>
            <span className="text-accent-pink">true</span>
            <span className={punctuation}>,</span>
            {"\n"}
            <span className={punctuation}>{"}"};</span>
            {"\n\n"}
            <span className="text-zinc-400">
              {"// "}let&apos;s build something great
            </span>
          </code>
        </pre>
      </div>
    </motion.div>
  );
}
