"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import {
  SIGNATURE_DURATION,
  SIGNATURE_VIEWBOX,
  signatureStrokes,
} from "@/lib/signature";

const STORAGE_KEY = "intro-seen";
const START_DELAY = 0.3; // seconds before the pen touches the paper
const HOLD = 0.5; // seconds the finished signature stays on screen
const FADE = 0.7; // seconds for the overlay to fade away

type Phase = "writing" | "leaving" | "done";

export function SignatureIntro() {
  const [phase, setPhase] = useState<Phase>("writing");

  // remember that it has played in this browser session
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage unavailable: the intro simply plays again next time */
    }
  }, []);

  useEffect(() => {
    if (phase === "writing") {
      const timer = setTimeout(
        () => setPhase("leaving"),
        (START_DELAY + SIGNATURE_DURATION + HOLD) * 1000,
      );
      return () => clearTimeout(timer);
    }
    if (phase === "leaving") {
      const timer = setTimeout(() => setPhase("done"), FADE * 1000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPhase("leaving");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (phase === "done") return null;

  return (
    <div
      data-signature-intro
      data-testid="signature-intro"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-700 ${
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <svg
        role="img"
        aria-label="Dinun Ranasinghe's signature, being written"
        viewBox={SIGNATURE_VIEWBOX}
        fill="none"
        stroke="white"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[min(88vw,760px)] drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]"
      >
        {signatureStrokes.map((stroke) => (
          <path
            key={stroke.d}
            d={stroke.d}
            pathLength={1}
            className="sig-stroke"
            style={
              {
                "--sig-delay": `${(stroke.delay + START_DELAY).toFixed(2)}s`,
                "--sig-duration": `${stroke.duration}s`,
              } as CSSProperties
            }
          />
        ))}
      </svg>

      <button
        type="button"
        onClick={() => setPhase("leaving")}
        className="absolute bottom-8 right-8 font-mono text-xs uppercase tracking-widest text-zinc-500 transition hover:text-white focus-visible:text-white"
      >
        Skip
      </button>
    </div>
  );
}
