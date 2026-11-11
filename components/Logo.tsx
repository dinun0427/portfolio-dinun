"use client";

import { useState } from "react";
import { profile } from "@/lib/data";

// The two letters, drawn as high-contrast serif shapes. The R's stem passes
// through the D's bowl, so the pair reads as one linked monogram.
const D_SHAPE =
  "M44 28 H58 C114 28 156 56 156 92 C156 128 114 156 58 152 H44 V149 H55 V31 H44 Z M62 34 C104 36 138 60 138 92 C138 124 104 146 62 147 Z";
const R_SHAPE =
  "M110 22 H126 C172 22 204 36 204 60 C204 82 176 94 140 96 C160 98 168 112 182 132 C196 150 212 160 236 160 C206 172 176 160 160 136 C148 118 142 104 126 100 V153 H142 V157 H110 V153 H122 V26 H110 Z M130 28 V92 C160 92 186 84 186 60 C186 40 160 28 130 28 Z";

// Paths down the middle of each stroke. A thick line is drawn along them to
// reveal the letters as if they were being written by hand.
const D_PEN = "M58 150 L58 30 C114 28 154 56 154 92 C154 128 114 154 58 150";
const R_PEN_BOWL =
  "M124 154 L124 26 C170 24 196 38 196 60 C196 84 168 92 130 94";
const R_PEN_LEG = "M146 96 C160 100 170 118 184 136 C200 156 214 162 236 160";

/**
 * The "DR" monogram. It writes itself in (D, then R, then the long swash
 * of the R), then a light slowly sweeps across. Hover to write it again.
 * Pure SVG + CSS; styles are in app/globals.css (.dr-logo).
 */
export function Logo() {
  const [run, setRun] = useState(0);

  return (
    <a
      href="#"
      aria-label={`${profile.initials} – back to top`}
      onMouseEnter={() => setRun((n) => n + 1)}
      className="dr-logo inline-flex items-center py-1 pr-2"
    >
      <svg
        key={run}
        viewBox="0 0 250 190"
        aria-hidden="true"
        className="h-12 w-auto overflow-visible"
      >
        <defs>
          <linearGradient id="dr-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "rgb(var(--t-primary))" }} />
            <stop offset="1" style={{ stopColor: "rgb(var(--t-secondary))" }} />
          </linearGradient>
          <linearGradient id="dr-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>

          <mask
            id="dr-reveal-d"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="250"
            height="190"
          >
            <path className="dr-pen dr-pen-d" d={D_PEN} pathLength={1} />
          </mask>
          <mask
            id="dr-reveal-r"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="250"
            height="190"
          >
            <path className="dr-pen dr-pen-r1" d={R_PEN_BOWL} pathLength={1} />
            <path className="dr-pen dr-pen-r2" d={R_PEN_LEG} pathLength={1} />
          </mask>
          <mask
            id="dr-shape"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="250"
            height="190"
          >
            <path d={D_SHAPE} fill="#fff" fillRule="evenodd" />
            <path d={R_SHAPE} fill="#fff" fillRule="evenodd" />
          </mask>
        </defs>

        <g className="dr-glyphs">
          <g mask="url(#dr-reveal-d)">
            <path d={D_SHAPE} fill="url(#dr-fill)" fillRule="evenodd" />
          </g>
          <g mask="url(#dr-reveal-r)">
            <path d={R_SHAPE} fill="url(#dr-fill)" fillRule="evenodd" />
          </g>
          <g mask="url(#dr-shape)">
            <rect
              className="dr-sheen"
              x="-70"
              y="-10"
              width="60"
              height="210"
              fill="url(#dr-sheen)"
              transform="skewX(-18)"
            />
          </g>
        </g>
      </svg>
    </a>
  );
}
