/**
 * The decisions behind dragging a Rubik's cube, as pure maths:
 * which layer a drag turns, which way, and how far it snaps.
 * Nothing here knows about the screen or Three.js.
 */

import type { Axis, Dir, Layer, Move, Vec } from "@/lib/cube";

const AXES: readonly Axis[] = ["x", "y", "z"];

/** A quarter turn, in radians. */
export const QUARTER = Math.PI / 2;

/**
 * You touched a face of a piece (its outward normal is normalAxis/normalSign)
 * and dragged along +tangentAxis on that face. Which layer turns, and does a
 * drag along +tangent mean a positive (sign 1) or negative (sign -1) rotation
 * around the layer's axis? Dragging a face along +tangent carries the sticker
 * on it towards +tangent, which is what makes this work out.
 */
export function layerTurnFor(
  piece: Vec,
  normalAxis: Axis,
  normalSign: Dir,
  tangentAxis: Axis,
): { axis: Axis; layer: Layer; sign: Dir } {
  if (normalAxis === tangentAxis) {
    throw new Error("A drag along a face cannot follow its own normal");
  }
  const n = AXES.indexOf(normalAxis);
  const t = AXES.indexOf(tangentAxis);
  const turnAxis = 3 - n - t; // the one axis that is neither
  const cyclic = (t - n + 3) % 3 === 1 ? 1 : -1; // x->y->z->x counts as +
  return {
    axis: AXES[turnAxis],
    layer: piece[turnAxis] as Layer,
    sign: (normalSign * cyclic) as Dir,
  };
}

export type TangentCandidate = {
  axis: Axis;
  /** Where one unit along +axis lands on screen, in pixels (y down). */
  screen: readonly [number, number];
};

/**
 * Of the directions you could be dragging along the face, pick the one that
 * lines up best with the finger. Returns the signed pixels dragged along it,
 * its on-screen unit direction and how many pixels one cube unit covers.
 */
export function pickTangent(
  drag: readonly [number, number],
  candidates: readonly TangentCandidate[],
) {
  let best: {
    axis: Axis;
    along: number;
    unit: [number, number];
    pxPerUnit: number;
  } | null = null;
  for (const c of candidates) {
    const length = Math.hypot(c.screen[0], c.screen[1]);
    if (length < 1e-6) continue; // seen edge-on: no usable direction
    const unit: [number, number] = [c.screen[0] / length, c.screen[1] / length];
    const along = drag[0] * unit[0] + drag[1] * unit[1];
    if (!best || Math.abs(along) > Math.abs(best.along)) {
      best = { axis: c.axis, along, unit, pxPerUnit: length };
    }
  }
  return best;
}

/**
 * Let go at this angle (radians, either way): how many quarter turns to
 * snap to? Small nudges spring back to 0; anything past about 20 degrees
 * commits to at least one turn. Never more than two.
 */
export function quarterTurnsFor(angle: number, threshold = 0.35): number {
  const size = Math.abs(angle);
  if (size < threshold) return 0;
  const turns = Math.min(2, Math.max(1, Math.round(size / QUARTER)));
  return Math.sign(angle) * turns;
}

/** Quarter turns around +axis (negative = the other way) as cube moves. */
export function movesForTurns(axis: Axis, layer: Layer, turns: number): Move[] {
  const dir: Dir = turns > 0 ? 1 : -1;
  return Array.from({ length: Math.abs(turns) }, () => ({ axis, layer, dir }));
}

/** Moves to play one after another, animated. A new id means a new script. */
export type Script = { id: number; moves: Move[]; seconds: number };
