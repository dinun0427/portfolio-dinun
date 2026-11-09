/**
 * Rubik's cube logic: pure TypeScript, no React, no rendering.
 *
 * Coordinates match Three.js: +x right, +y up, +z towards the viewer.
 * The cube is 27 pieces at positions -1, 0 or 1 on each axis. A move turns
 * one layer (all pieces sharing one coordinate on one axis) by 90 degrees.
 * State is immutable: every function returns a new state.
 */

export type Axis = "x" | "y" | "z";
export type Layer = -1 | 0 | 1;
/** 1 = counter-clockwise looking down the positive axis (right-hand rule). */
export type Dir = 1 | -1;
export type Vec = readonly [number, number, number];
/** 3x3 rotation matrix, row-major. */
export type Mat3 = readonly number[];

export type Move = {
  readonly axis: Axis;
  readonly layer: Layer;
  readonly dir: Dir;
};

export type Cubie = {
  /** Fixed identity, 0..26. */
  readonly id: number;
  /** Where the piece started (also tells which faces carry stickers). */
  readonly home: Vec;
  /** Where the piece is now. */
  readonly position: Vec;
  /** How the piece is turned now, relative to its start. */
  readonly orientation: Mat3;
};

export type CubeState = {
  readonly cubies: readonly Cubie[];
  /** Moves made since the cube was solved; turns cancelling each other are dropped. */
  readonly history: readonly Move[];
};

const AXES: readonly Axis[] = ["x", "y", "z"];
const LAYERS: readonly Layer[] = [-1, 0, 1];
const IDENTITY: Mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

const axisIndex = (axis: Axis) => AXES.indexOf(axis);
/** Turns -0 into 0 so results compare cleanly. */
const clean = (n: number) => (n === 0 ? 0 : n);

/** Rotate a vector 90 degrees around an axis. */
export function rotateVector(axis: Axis, dir: Dir, v: Vec): Vec {
  const [x, y, z] = v;
  let r: [number, number, number];
  if (axis === "x") r = dir === 1 ? [x, -z, y] : [x, z, -y];
  else if (axis === "y") r = dir === 1 ? [z, y, -x] : [-z, y, x];
  else r = dir === 1 ? [-y, x, z] : [y, -x, z];
  return [clean(r[0]), clean(r[1]), clean(r[2])];
}

function rotateMatrix(axis: Axis, dir: Dir, m: Mat3): Mat3 {
  const out = [...m];
  for (let c = 0; c < 3; c++) {
    const [x, y, z] = rotateVector(axis, dir, [m[c], m[3 + c], m[6 + c]]);
    out[c] = x;
    out[3 + c] = y;
    out[6 + c] = z;
  }
  return out;
}

/** A solved cube: 27 pieces, each home and unturned. */
export function createCube(): CubeState {
  const cubies: Cubie[] = [];
  for (const x of LAYERS) {
    for (const y of LAYERS) {
      for (const z of LAYERS) {
        cubies.push({
          id: cubies.length,
          home: [x, y, z],
          position: [x, y, z],
          orientation: IDENTITY,
        });
      }
    }
  }
  return { cubies, history: [] };
}

export function invertMove(move: Move): Move {
  return { ...move, dir: move.dir === 1 ? -1 : 1 };
}

const sameLayer = (a: Move, b: Move) =>
  a.axis === b.axis && a.layer === b.layer;

/** Ids of the 9 pieces in a layer. */
export function layerCubieIds(
  state: CubeState,
  axis: Axis,
  layer: Layer,
): number[] {
  const i = axisIndex(axis);
  return state.cubies.filter((c) => c.position[i] === layer).map((c) => c.id);
}

export function applyMove(state: CubeState, move: Move): CubeState {
  const i = axisIndex(move.axis);
  const cubies = state.cubies.map((c) =>
    c.position[i] === move.layer
      ? {
          ...c,
          position: rotateVector(move.axis, move.dir, c.position),
          orientation: rotateMatrix(move.axis, move.dir, c.orientation),
        }
      : c,
  );

  // Turning back undoes the last move, so history stays as short as possible.
  const last = state.history[state.history.length - 1];
  const history =
    last && sameLayer(last, move) && last.dir !== move.dir
      ? state.history.slice(0, -1)
      : [...state.history, move];

  return { cubies, history };
}

export function applyMoves(
  state: CubeState,
  moves: readonly Move[],
): CubeState {
  return moves.reduce(applyMove, state);
}

/** The moves that undo everything done so far (what "Solve" replays). */
export function solvingMoves(state: CubeState): Move[] {
  return [...state.history].reverse().map(invertMove);
}

/**
 * Solved means every face shows one colour. Looking at stickers, not
 * positions, means turning the whole cube (all three layers) is still solved.
 */
export function isSolved(state: CubeState): boolean {
  const colourOnFace = new Map<string, string>();
  for (const c of state.cubies) {
    for (let a = 0; a < 3; a++) {
      const sign = c.home[a];
      if (sign === 0) continue; // no sticker on this side
      const colour = `${AXES[a]}${sign > 0 ? "+" : "-"}`;
      // where that sticker points now: column a of the orientation, scaled
      let face = "";
      for (let r = 0; r < 3; r++) {
        const n = c.orientation[3 * r + a] * sign;
        if (n !== 0) face = `${AXES[r]}${n > 0 ? "+" : "-"}`;
      }
      const seen = colourOnFace.get(face);
      if (seen !== undefined && seen !== colour) return false;
      colourOnFace.set(face, colour);
    }
  }
  return true;
}

/** Standard notation: clockwise when looking at that face. */
const FACE_MOVES: Record<string, Move> = {
  U: { axis: "y", layer: 1, dir: -1 },
  D: { axis: "y", layer: -1, dir: 1 },
  R: { axis: "x", layer: 1, dir: -1 },
  L: { axis: "x", layer: -1, dir: 1 },
  F: { axis: "z", layer: 1, dir: -1 },
  B: { axis: "z", layer: -1, dir: 1 },
};

/** "R U R' U2" -> moves. Letters U D R L F B, ' = reverse, 2 = twice. */
export function parseAlgorithm(text: string): Move[] {
  const moves: Move[] = [];
  for (const token of text.trim().split(/\s+/).filter(Boolean)) {
    const match = /^([URFDLB])(2|')?$/.exec(token);
    if (!match) throw new Error(`Invalid move: ${token}`);
    const base = FACE_MOVES[match[1]];
    if (match[2] === "2") moves.push(base, base);
    else moves.push(match[2] === "'" ? invertMove(base) : base);
  }
  return moves;
}

/**
 * Random moves for scrambling. Pass your own rng for repeatable results.
 * Never turns the same layer twice in a row.
 */
export function scramble(length = 20, rng: () => number = Math.random): Move[] {
  const moves: Move[] = [];
  while (moves.length < length) {
    const move: Move = {
      axis: AXES[Math.floor(rng() * 3)],
      layer: LAYERS[Math.floor(rng() * 3)],
      dir: rng() < 0.5 ? 1 : -1,
    };
    const prev = moves[moves.length - 1];
    if (prev && sameLayer(prev, move)) continue;
    moves.push(move);
  }
  return moves;
}
