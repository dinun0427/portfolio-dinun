import type { Vec } from "@/lib/cube";

/** Stickerless-style colours: white top, green front, red right. Tweak freely. */
export const FACE_COLOURS: Record<string, string> = {
  "x+": "#d90f26", // right  - red
  "x-": "#ff6a00", // left   - orange
  "y+": "#f6f6f4", // top    - white
  "y-": "#ffd400", // bottom - yellow
  "z+": "#0aa84f", // front  - green
  "z-": "#0a4fd6", // back   - blue
};

/** The six sides of a piece, in the order a Three.js box numbers them. */
export const SIDES = ["x+", "x-", "y+", "y-", "z+", "z-"] as const;

/** Edge length of one piece. Pieces sit 1 apart, so the rest is the seam. */
export const CUBIE_SIZE = 0.98;
/** How rounded the pieces are. 0 would be sharp corners. */
export const CUBIE_RADIUS = 0.08;

/** The monogram on the middle square of the white face. */
export const LOGO_TEXT = "DR";

/**
 * The colour of each side of a piece, or null for a side that faces the
 * inside of the cube. Corner: 3 colours, edge: 2, face centre: 1, core: 0.
 */
export function sideColours(home: Vec): (string | null)[] {
  return SIDES.map((key, i) => {
    const axis = i >> 1; // sides 0-1 are x, 2-3 are y, 4-5 are z
    const side = i % 2 === 0 ? 1 : -1;
    return home[axis] === side ? FACE_COLOURS[key] : null;
  });
}

/** Only the centre of the top (white) face carries the logo. */
export function hasLogo(home: Vec): boolean {
  return home[0] === 0 && home[1] === 1 && home[2] === 0;
}
