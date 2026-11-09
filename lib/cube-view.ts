import type { Axis, Vec } from "@/lib/cube";

/** Standard colours: white top, green front, red right, and their opposites. */
export const FACE_COLOURS: Record<string, string> = {
  "x+": "#dc2626", // right  - red
  "x-": "#f97316", // left   - orange
  "y+": "#f4f4f5", // top    - white
  "y-": "#facc15", // bottom - yellow
  "z+": "#16a34a", // front  - green
  "z-": "#2563eb", // back   - blue
};

/** Edge length of one piece. Pieces sit 1 apart, so the rest is the gap. */
export const CUBIE_SIZE = 0.94;

const HALF_PI = Math.PI / 2;

/** A flat plane faces +z by default; these turn it to face each side. */
const STICKER_ROTATIONS: Record<string, Vec> = {
  "x+": [0, HALF_PI, 0],
  "x-": [0, -HALF_PI, 0],
  "y+": [-HALF_PI, 0, 0],
  "y-": [HALF_PI, 0, 0],
  "z+": [0, 0, 0],
  "z-": [0, Math.PI, 0],
};

export type Sticker = {
  key: string;
  colour: string;
  position: Vec;
  rotation: Vec;
};

const AXES: readonly Axis[] = ["x", "y", "z"];

/** The coloured stickers of one piece, from where it started: corner 3, edge 2, face centre 1, core 0. */
export function stickersFor(home: Vec): Sticker[] {
  const stickers: Sticker[] = [];
  home.forEach((side, i) => {
    if (side === 0) return;
    const key = `${AXES[i]}${side > 0 ? "+" : "-"}`;
    const position: [number, number, number] = [0, 0, 0];
    position[i] = side * (CUBIE_SIZE / 2 + 0.002); // just off the surface
    stickers.push({
      key,
      colour: FACE_COLOURS[key],
      position,
      rotation: STICKER_ROTATIONS[key],
    });
  });
  return stickers;
}
