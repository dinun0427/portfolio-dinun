import { describe, expect, it } from "vitest";
import {
  applyMoves,
  createCube,
  rotateVector,
  type Axis,
  type Vec,
} from "@/lib/cube";
import {
  layerTurnFor,
  movesForTurns,
  pickTangent,
  quarterTurnsFor,
} from "@/lib/cube-drag";

const AXES: Axis[] = ["x", "y", "z"];
const unit = (axis: Axis, sign = 1): Vec =>
  AXES.map((a) => (a === axis ? sign : 0)) as unknown as Vec;

describe("layerTurnFor", () => {
  it("turns the layer so the touched sticker travels along the drag", () => {
    for (const normalAxis of AXES) {
      for (const tangentAxis of AXES) {
        if (normalAxis === tangentAxis) continue;
        for (const normalSign of [1, -1] as const) {
          const { axis, sign } = layerTurnFor(
            [1, 1, 1],
            normalAxis,
            normalSign,
            tangentAxis,
          );
          // a quarter turn carries the sticker's normal onto +tangent
          expect(
            rotateVector(axis, sign, unit(normalAxis, normalSign)),
          ).toEqual(unit(tangentAxis));
        }
      }
    }
  });

  it("uses the layer the piece sits in along the turning axis", () => {
    // top face, dragged along x: the front/back slice turns (axis z)
    const front = layerTurnFor([1, 1, 1], "y", 1, "x");
    expect(front).toEqual({ axis: "z", layer: 1, sign: -1 });
    const middle = layerTurnFor([1, 1, 0], "y", 1, "x");
    expect(middle.layer).toBe(0);
    const back = layerTurnFor([-1, 1, -1], "y", 1, "x");
    expect(back.layer).toBe(-1);
  });

  it("really moves the touched piece when the move is played", () => {
    // grab the top-front-right corner by its top sticker, drag to the right
    const { axis, layer, sign } = layerTurnFor([1, 1, 1], "y", 1, "x");
    const cube = applyMoves(createCube(), [{ axis, layer, dir: sign }]);
    const corner = cube.cubies.find((c) => c.home.join() === "1,1,1")!;
    expect(corner.position).toEqual([1, -1, 1]); // slid down the right side
  });

  it("refuses a drag along the face's own normal", () => {
    expect(() => layerTurnFor([1, 1, 1], "y", 1, "y")).toThrow();
  });
});

describe("pickTangent", () => {
  const candidates = [
    { axis: "x" as const, screen: [100, 0] as const },
    { axis: "z" as const, screen: [0, 50] as const },
  ];

  it("picks the direction that best matches the drag, with its sign", () => {
    const right = pickTangent([30, 5], candidates)!;
    expect(right.axis).toBe("x");
    expect(right.along).toBeCloseTo(30);
    expect(right.pxPerUnit).toBe(100);

    const up = pickTangent([0, -40], candidates)!;
    expect(up.axis).toBe("z");
    expect(up.along).toBeCloseTo(-40);
  });

  it("ignores directions seen edge-on, and can find nothing", () => {
    const flat = [
      { axis: "x" as const, screen: [0, 0] as const },
      candidates[1],
    ];
    expect(pickTangent([30, 0], flat)!.axis).toBe("z");
    expect(pickTangent([30, 0], [flat[0]])).toBeNull();
  });
});

describe("quarterTurnsFor", () => {
  it("springs small nudges back", () => {
    expect(quarterTurnsFor(0)).toBe(0);
    expect(quarterTurnsFor(0.2)).toBe(0);
    expect(quarterTurnsFor(-0.2)).toBe(0);
  });

  it("commits to a turn past the threshold, in either direction", () => {
    expect(quarterTurnsFor(0.4)).toBe(1);
    expect(quarterTurnsFor(-0.4)).toBe(-1);
    expect(quarterTurnsFor(1.2)).toBe(1);
  });

  it("rounds to the nearest quarter and never goes past two", () => {
    expect(quarterTurnsFor(2.4)).toBe(2);
    expect(quarterTurnsFor(-3)).toBe(-2);
    expect(quarterTurnsFor(6)).toBe(2);
  });
});

describe("movesForTurns", () => {
  it("makes one move per quarter turn, in the right direction", () => {
    expect(movesForTurns("y", 1, 0)).toEqual([]);
    expect(movesForTurns("y", 1, 1)).toEqual([{ axis: "y", layer: 1, dir: 1 }]);
    expect(movesForTurns("x", -1, -2)).toEqual([
      { axis: "x", layer: -1, dir: -1 },
      { axis: "x", layer: -1, dir: -1 },
    ]);
  });
});
