"use client";

import { useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { SectionHeading } from "@/components/Reveal";
import {
  applyMove,
  createCube,
  isSolved,
  parseAlgorithm,
  scramble,
  solvingMoves,
  type Move,
} from "@/lib/cube";
import type { Script } from "@/lib/cube-drag";

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
  const near = useInView(stage, { once: true, margin: "300px 0px" }); // start loading early
  const visible = useInView(stage); // draw only while on screen
  const scriptId = useRef(0);

  const [state, setState] = useState(createCube);
  const [script, setScript] = useState<Script | null>(null);
  const [playing, setPlaying] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleMove = useCallback((move: Move) => {
    setTouched(true);
    setState((s) => applyMove(s, move));
  }, []);
  const handleSettled = useCallback(() => setPlaying(false), []);

  // hand a list of moves to the scene to play, one after another
  const play = useCallback((moves: Move[], seconds: number) => {
    setPlaying(true);
    setScript({ id: ++scriptId.current, moves, seconds });
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (playing || event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key.toUpperCase();
    if (key.length !== 1 || !"URFDLB".includes(key)) return;
    event.preventDefault();
    play(parseAlgorithm(event.shiftKey ? `${key}'` : key), 0.15);
  }

  const solve = () => {
    const moves = solvingMoves(state);
    // long histories play faster, so Solve never takes more than about 3 seconds
    play(moves, Math.max(0.06, Math.min(0.16, 3 / moves.length)));
  };

  const status = playing
    ? "Turning…"
    : touched && isSolved(state)
      ? "Solved. Nice!"
      : touched
        ? "Keep going, or press Solve."
        : "Drag a piece to start.";

  return (
    <section id="playground" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Playground"
        title="Give it a spin"
        description="A real Rubik's cube, running in your browser. Scramble it, then solve it, or press Solve."
      />

      <div
        ref={stage}
        role="group"
        aria-label="3D Rubik's cube"
        aria-describedby="cube-help"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-cyan md:h-[560px]"
      >
        {near && (
          <CubeScene
            state={state}
            script={script}
            active={visible}
            onMove={handleMove}
            onSettled={handleSettled}
          />
        )}
      </div>

      <p
        aria-live="polite"
        className="mt-4 text-center text-sm font-medium text-zinc-300"
      >
        {status}
      </p>
      <p id="cube-help" className="mt-1 text-center text-sm text-zinc-500">
        Drag the background or a centre piece to rotate the cube, and a corner
        or edge piece to turn its layer. With the cube focused, press U, D, L,
        R, F or B to turn a face, and hold Shift to turn it the other way.
      </p>

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          className={buttonClass}
          disabled={playing}
          onClick={() => play(scramble(20), 0.1)}
        >
          Scramble
        </button>
        <button
          type="button"
          className={buttonClass}
          disabled={playing || state.history.length === 0}
          onClick={solve}
        >
          Solve
        </button>
        <button
          type="button"
          className={buttonClass}
          disabled={playing || state.history.length === 0}
          onClick={() => {
            setState(createCube());
            setTouched(false);
          }}
        >
          Reset
        </button>
      </div>
    </section>
  );
}
