import { describe, expect, it } from "vitest";
import {
  applyMove,
  applyMoves,
  createCube,
  invertMove,
  isSolved,
  layerCubieIds,
  parseAlgorithm,
  rotateVector,
  scramble,
  solvingMoves,
  type Move,
} from "@/lib/cube";

const run = (algorithm: string) =>
  applyMoves(createCube(), parseAlgorithm(algorithm));

// small deterministic random numbers, so scrambles are repeatable
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("createCube", () => {
  it("has 27 pieces at 27 different places, and is solved", () => {
    const cube = createCube();
    expect(cube.cubies).toHaveLength(27);
    expect(new Set(cube.cubies.map((c) => c.position.join())).size).toBe(27);
    expect(cube.history).toEqual([]);
    expect(isSolved(cube)).toBe(true);
  });
});

describe("rotateVector", () => {
  it("follows the right-hand rule", () => {
    expect(rotateVector("x", 1, [0, 1, 0])).toEqual([0, 0, 1]);
    expect(rotateVector("y", 1, [0, 0, 1])).toEqual([1, 0, 0]);
    expect(rotateVector("z", 1, [1, 0, 0])).toEqual([0, 1, 0]);
  });

  it("is undone by turning the other way", () => {
    expect(rotateVector("y", -1, rotateVector("y", 1, [1, 1, 0]))).toEqual([
      1, 1, 0,
    ]);
  });
});

describe("applyMove", () => {
  it("only moves the 9 pieces of the turned layer", () => {
    const move: Move = { axis: "y", layer: 1, dir: -1 };
    const before = createCube();
    const after = applyMove(before, move);
    const turned = layerCubieIds(before, "y", 1);
    expect(turned).toHaveLength(9);
    for (const c of after.cubies) {
      const was = before.cubies[c.id];
      if (turned.includes(c.id)) {
        expect(c.position[1]).toBe(1);
      } else {
        expect(c.position).toEqual(was.position);
        expect(c.orientation).toEqual(was.orientation);
      }
    }
  });

  it("U moves the front-right-top corner to the front-left-top", () => {
    const cube = run("U");
    const corner = cube.cubies.find((c) => c.home.join() === "1,1,1")!;
    expect(corner.position).toEqual([-1, 1, 1]);
  });

  it("four turns of the same move bring the cube back", () => {
    const cube = run("R R R R");
    expect(isSolved(cube)).toBe(true);
    expect(cube.cubies.map((c) => c.position)).toEqual(
      createCube().cubies.map((c) => c.position),
    );
  });

  it("is not solved after one turn", () => {
    expect(isSolved(run("F"))).toBe(false);
  });

  it("turning the middle slice scrambles it, four turns fix it", () => {
    const middle: Move = { axis: "x", layer: 0, dir: 1 };
    expect(isSolved(applyMove(createCube(), middle))).toBe(false);
    expect(
      isSolved(applyMoves(createCube(), [middle, middle, middle, middle])),
    ).toBe(true);
  });

  it("turning the whole cube still counts as solved", () => {
    const whole = ([-1, 0, 1] as const).map((layer) => ({
      axis: "y" as const,
      layer,
      dir: 1 as const,
    }));
    const cube = applyMoves(createCube(), whole);
    expect(cube.cubies[0].position).not.toEqual(
      createCube().cubies[0].position,
    );
    expect(isSolved(cube)).toBe(true);
  });

  it("R U R' U' repeated 6 times returns to solved (a known property)", () => {
    expect(isSolved(run("R U R' U'"))).toBe(false);
    expect(isSolved(run("R U R' U' ".repeat(6)))).toBe(true);
  });

  it("does not change the state it was given", () => {
    const cube = createCube();
    applyMove(cube, { axis: "x", layer: 1, dir: 1 });
    expect(isSolved(cube)).toBe(true);
    expect(cube.history).toEqual([]);
  });
});

describe("history and solving", () => {
  it("records moves and drops a move that is undone straight away", () => {
    const cube = run("R U");
    expect(cube.history).toHaveLength(2);
    expect(run("R R'").history).toEqual([]);
    expect(run("R U U' R'").history).toEqual([]);
  });

  it("replaying solvingMoves solves a scrambled cube", () => {
    const scrambled = applyMoves(createCube(), scramble(25, seeded(7)));
    expect(isSolved(scrambled)).toBe(false);
    const solved = applyMoves(scrambled, solvingMoves(scrambled));
    expect(isSolved(solved)).toBe(true);
    expect(solved.history).toEqual([]);
  });

  it("invertMove flips the direction", () => {
    const move: Move = { axis: "z", layer: 0, dir: 1 };
    expect(invertMove(move)).toEqual({ axis: "z", layer: 0, dir: -1 });
  });
});

describe("parseAlgorithm", () => {
  it("reads turns, reverse turns and double turns", () => {
    expect(parseAlgorithm("R")).toHaveLength(1);
    expect(parseAlgorithm("U'")[0].dir).toBe(1);
    expect(parseAlgorithm("F2")).toHaveLength(2);
    expect(parseAlgorithm("  R  U ")).toHaveLength(2);
    expect(parseAlgorithm("")).toEqual([]);
  });

  it("rejects things that are not moves", () => {
    expect(() => parseAlgorithm("R X")).toThrow("Invalid move: X");
  });
});

describe("scramble", () => {
  it("makes the requested number of moves, repeatably", () => {
    const a = scramble(20, seeded(1));
    expect(a).toHaveLength(20);
    expect(a).toEqual(scramble(20, seeded(1)));
  });

  it("never turns the same layer twice in a row", () => {
    const moves = scramble(200, seeded(3));
    for (let i = 1; i < moves.length; i++) {
      const same =
        moves[i].axis === moves[i - 1].axis &&
        moves[i].layer === moves[i - 1].layer;
      expect(same).toBe(false);
    }
  });
});
