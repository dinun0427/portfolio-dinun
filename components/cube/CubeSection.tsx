"use client";

import { useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { SectionHeading } from "@/components/Reveal";
import {
  applyMove,
  applyMoves,
  createCube,
  scramble,
  type Move,
} from "@/lib/cube";

// three.js is only downloaded when the section is about to be seen
const CubeScene = dynamic(() => import("@/components/cube/CubeScene"), {
  ssr: false,
  loading: () => (
    <p className="flex h-full items-center justify-center text-sm text-zinc-500">
      Loading the cube…
    </p>
  ),
});

const buttonClass =
  "rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/5";

export function CubeSection() {
  const stage = useRef<HTMLDivElement>(null);
  const near = useInView(stage, { once: true, margin: "300px 0px" });
  const [state, setState] = useState(createCube);

  const handleMove = useCallback(
    (move: Move) => setState((s) => applyMove(s, move)),
    [],
  );

  return (
    <section id="playground" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Playground"
        title="Give it a spin"
        description="A real Rubik's cube, running in your browser. Scramble it and see."
      />

      <div
        ref={stage}
        role="group"
        aria-label="3D Rubik's cube"
        className="h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] md:h-[560px]"
      >
        {near && <CubeScene state={state} onMove={handleMove} />}
      </div>

      <p className="mt-4 text-center text-sm text-zinc-500">
        Drag the background or a centre piece to rotate the cube. Drag a corner
        or edge piece to turn its layer.
      </p>

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          className={buttonClass}
          onClick={() => setState((s) => applyMoves(s, scramble(20)))}
        >
          Scramble
        </button>
        <button
          type="button"
          className={buttonClass}
          disabled={state.history.length === 0}
          onClick={() => setState(createCube())}
        >
          Reset
        </button>
      </div>
    </section>
  );
}
