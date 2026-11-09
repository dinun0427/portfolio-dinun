import { describe, expect, it } from "vitest";
import { createCube } from "@/lib/cube";
import { CUBIE_SIZE, FACE_COLOURS, stickersFor } from "@/lib/cube-view";

describe("stickersFor", () => {
  it("gives a corner 3 stickers, an edge 2, a face centre 1 and the core 0", () => {
    expect(stickersFor([1, 1, 1])).toHaveLength(3);
    expect(stickersFor([1, 1, 0])).toHaveLength(2);
    expect(stickersFor([1, 0, 0])).toHaveLength(1);
    expect(stickersFor([0, 0, 0])).toHaveLength(0);
  });

  it("colours each side by the face it started on", () => {
    const [top] = stickersFor([0, 1, 0]);
    expect(top.colour).toBe(FACE_COLOURS["y+"]);
    const [back] = stickersFor([0, 0, -1]);
    expect(back.colour).toBe(FACE_COLOURS["z-"]);
  });

  it("puts each sticker just outside its side of the piece", () => {
    const [right] = stickersFor([1, 0, 0]);
    expect(right.position[0]).toBeGreaterThan(CUBIE_SIZE / 2);
    expect(right.position[1]).toBe(0);
    const [bottom] = stickersFor([0, -1, 0]);
    expect(bottom.position[1]).toBeLessThan(-CUBIE_SIZE / 2);
  });

  it("makes 54 stickers on a whole cube, 9 per colour", () => {
    const all = createCube().cubies.flatMap((c) => stickersFor(c.home));
    expect(all).toHaveLength(54);
    for (const colour of Object.values(FACE_COLOURS)) {
      expect(all.filter((s) => s.colour === colour)).toHaveLength(9);
    }
  });
});
