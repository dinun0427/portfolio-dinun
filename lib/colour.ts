/** Small colour helpers: enough to keep every theme readable. */

export type Rgb = readonly [number, number, number];

export function parseHex(hex: string): Rgb {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(`Not a #rrggbb colour: ${hex}`);
  const n = parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** "r g b", the form the CSS variables use (so Tailwind can add opacity). */
export function toTriplet(rgb: Rgb): string {
  return rgb.map((c) => Math.round(c)).join(" ");
}

/** Blend from a towards b. t = 0 is a, t = 1 is b. */
export function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

/** How bright a colour looks to the eye, 0 (black) to 1 (white). */
export function luminance(rgb: Rgb): number {
  const [r, g, b] = rgb.map((c) => {
    const v = Math.round(c) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio, 1 (none) to 21 (black on white). Text needs 4.5. */
export function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Nudge a colour towards `toward` until it reads on `bg` at the given
 * contrast. A colour that already reads is left alone.
 */
export function ensureContrast(
  colour: Rgb,
  bg: Rgb,
  min: number,
  toward: Rgb,
): Rgb {
  for (let t = 0; t <= 1.0001; t += 0.04) {
    const candidate = mix(colour, toward, t);
    if (contrast(candidate, bg) >= min) return candidate;
  }
  return toward;
}

const WHITE: Rgb = [255, 255, 255];
const NEAR_BLACK: Rgb = [11, 11, 15];

/** Text colour that reads best on top of `bg` (white or near-black). */
export function readableOn(bg: Rgb): Rgb {
  return contrast(WHITE, bg) >= contrast(NEAR_BLACK, bg) ? WHITE : NEAR_BLACK;
}
