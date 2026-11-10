import { describe, expect, it } from "vitest";
import {
  contrast,
  ensureContrast,
  luminance,
  mix,
  parseHex,
  readableOn,
  toTriplet,
} from "@/lib/colour";

describe("colour", () => {
  it("reads #rrggbb and writes 'r g b'", () => {
    expect(parseHex("#8b5cf6")).toEqual([139, 92, 246]);
    expect(toTriplet(parseHex("#162a2c"))).toBe("22 42 44");
    expect(() => parseHex("red")).toThrow();
    expect(() => parseHex("#fff")).toThrow();
  });

  it("blends two colours", () => {
    expect(mix([0, 0, 0], [100, 200, 50], 0.5)).toEqual([50, 100, 25]);
    expect(mix([10, 20, 30], [90, 80, 70], 0)).toEqual([10, 20, 30]);
  });

  it("measures contrast like WCAG", () => {
    expect(luminance([255, 255, 255])).toBeCloseTo(1);
    expect(contrast([0, 0, 0], [255, 255, 255])).toBeCloseTo(21);
    expect(contrast([255, 255, 255], [255, 255, 255])).toBeCloseTo(1);
  });

  it("nudges a hard-to-read colour until it reads, and leaves good ones alone", () => {
    const bg = parseHex("#ffffff");
    const pale = parseHex("#a5f3fc");
    const fixed = ensureContrast(pale, bg, 4.5, parseHex("#0f172a"));
    expect(contrast(fixed, bg)).toBeGreaterThan(4.49);
    const dark = parseHex("#0f172a");
    expect(ensureContrast(dark, bg, 4.5, dark)).toEqual(dark);
  });

  it("picks white or near-black text for a button colour", () => {
    expect(readableOn(parseHex("#4f46e5"))).toEqual([255, 255, 255]);
    expect(readableOn(parseHex("#fde047"))[0]).toBeLessThan(50);
  });
});
