import { describe, expect, it } from "vitest";
import { createCube } from "@/lib/cube";
import {
  FACE_COLOURS,
  LOGO_TEXT,
  SIDES,
  hasLogo,
  sideColours,
} from "@/lib/cube-view";

const coloured = (home: [number, number, number]) =>
  sideColours(home).filter(Boolean);

describe("sideColours", () => {
  it("colours 3 sides of a corner, 2 of an edge, 1 of a face centre and none of the core", () => {
    expect(coloured([1, 1, 1])).toHaveLength(3);
    expect(coloured([1, 1, 0])).toHaveLength(2);
    expect(coloured([1, 0, 0])).toHaveLength(1);
    expect(coloured([0, 0, 0])).toHaveLength(0);
  });

  it("colours each side by the face it started on", () => {
    const top = sideColours([0, 1, 0]);
    expect(top[SIDES.indexOf("y+")]).toBe(FACE_COLOURS["y+"]);
    const back = sideColours([0, 0, -1]);
    expect(back[SIDES.indexOf("z-")]).toBe(FACE_COLOURS["z-"]);
  });

  it("makes 54 coloured sides on a whole cube, 9 per colour", () => {
    const all = createCube()
      .cubies.flatMap((c) => sideColours(c.home))
      .filter(Boolean);
    expect(all).toHaveLength(54);
    for (const colour of Object.values(FACE_COLOURS)) {
      expect(all.filter((c) => c === colour)).toHaveLength(9);
    }
  });

  it("uses six different colours", () => {
    expect(new Set(Object.values(FACE_COLOURS)).size).toBe(6);
  });
});

describe("logo", () => {
  it("sits only on the centre of the white (top) face", () => {
    expect(hasLogo([0, 1, 0])).toBe(true);
    expect(hasLogo([0, -1, 0])).toBe(false);
    expect(hasLogo([1, 1, 0])).toBe(false);
    expect(createCube().cubies.filter((c) => hasLogo(c.home))).toHaveLength(1);
  });

  it("says DR", () => {
    expect(LOGO_TEXT).toBe("DR");
  });
});
