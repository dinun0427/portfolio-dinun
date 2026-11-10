/**
 * Every colour theme of the site. To add one, add one line to `themes`:
 * a background, a text colour and three accents. Everything else (cards,
 * softer greys, readable label colours, button text) is worked out for you.
 */

import {
  contrast,
  ensureContrast,
  luminance,
  mix,
  parseHex,
  readableOn,
  toTriplet,
  type Rgb,
} from "@/lib/colour";

export type Theme = {
  id: string;
  name: string;
  /** page background */
  bg: string;
  /** main text and headings */
  text: string;
  /** buttons, fills, glows */
  primary: string;
  /** labels, links, second gradient colour */
  secondary: string;
  /** third gradient colour */
  tertiary: string;
  /** card colour; worked out from bg and text when left out */
  surface?: string;
};

const t = (
  id: string,
  name: string,
  bg: string,
  text: string,
  primary: string,
  secondary: string,
  tertiary: string,
  surface?: string,
): Theme => ({ id, name, bg, text, primary, secondary, tertiary, surface });

export const themes: Theme[] = [
  // ---- light ----
  t(
    "indigo-ink",
    "Indigo Ink",
    "#ffffff",
    "#0f172a",
    "#4f46e5",
    "#0891b2",
    "#db2777",
    "#f5f6fb",
  ),
  t(
    "emerald-forest",
    "Emerald Forest",
    "#ffffff",
    "#0b1f1a",
    "#047857",
    "#0d9488",
    "#d97706",
    "#f3f8f5",
  ),
  t(
    "ocean-blue",
    "Ocean Blue",
    "#ffffff",
    "#0b1220",
    "#2563eb",
    "#0284c7",
    "#ea580c",
    "#f1f5f9",
  ),
  t(
    "warm-coral",
    "Warm Coral",
    "#ffffff",
    "#1f1720",
    "#e11d48",
    "#7c3aed",
    "#d97706",
    "#fff6f2",
  ),
  t(
    "sage-cream",
    "Sage & Cream",
    "#fefcf6",
    "#162a2c",
    "#5e6c58",
    "#2f6f73",
    "#a5694f",
    "#f4efe6",
  ),
  t(
    "github-light",
    "GitHub Light",
    "#ffffff",
    "#1f2328",
    "#0969da",
    "#8250df",
    "#bf3989",
  ),
  t(
    "solarized-light",
    "Solarized Light",
    "#fdf6e3",
    "#073642",
    "#268bd2",
    "#2aa198",
    "#d33682",
  ),
  t(
    "catppuccin-latte",
    "Catppuccin Latte",
    "#eff1f5",
    "#4c4f69",
    "#8839ef",
    "#1e66f5",
    "#ea76cb",
  ),
  t(
    "rose-pine-dawn",
    "Rosé Pine Dawn",
    "#faf4ed",
    "#4a4570",
    "#286983",
    "#907aa9",
    "#d7827e",
  ),
  t(
    "gruvbox-light",
    "Gruvbox Light",
    "#fbf1c7",
    "#3c3836",
    "#d65d0e",
    "#458588",
    "#b16286",
  ),
  t(
    "lavender-mist",
    "Lavender Mist",
    "#faf8ff",
    "#2a2140",
    "#7c3aed",
    "#a855f7",
    "#ec4899",
  ),
  t(
    "desert-sand",
    "Desert Sand",
    "#faf7f2",
    "#2b2118",
    "#b45309",
    "#0f766e",
    "#be123c",
  ),
  t(
    "mint-fresh",
    "Mint Fresh",
    "#f4fffb",
    "#0f2a22",
    "#059669",
    "#0ea5a4",
    "#e11d48",
  ),
  t(
    "graphite-light",
    "Graphite Light",
    "#fafafa",
    "#18181b",
    "#27272a",
    "#52525b",
    "#a1a1aa",
  ),
  // ---- dark ----
  t(
    "nebula",
    "Nebula",
    "#05060a",
    "#e4e4e7",
    "#8b5cf6",
    "#22d3ee",
    "#f472b6",
    "#11131d",
  ),
  t(
    "forest-cream",
    "Forest & Cream",
    "#162a2c",
    "#f4efe6",
    "#5e6c58",
    "#a3b59b",
    "#d6e0e2",
    "#1d3235",
  ),
  t(
    "dracula",
    "Dracula",
    "#282a36",
    "#f8f8f2",
    "#bd93f9",
    "#8be9fd",
    "#ff79c6",
  ),
  t("nord", "Nord", "#2e3440", "#eceff4", "#88c0d0", "#81a1c1", "#b48ead"),
  t(
    "solarized-dark",
    "Solarized Dark",
    "#002b36",
    "#eee8d5",
    "#268bd2",
    "#2aa198",
    "#d33682",
  ),
  t(
    "gruvbox-dark",
    "Gruvbox Dark",
    "#282828",
    "#ebdbb2",
    "#fabd2f",
    "#8ec07c",
    "#d3869b",
  ),
  t(
    "tokyo-night",
    "Tokyo Night",
    "#1a1b26",
    "#c0caf5",
    "#7aa2f7",
    "#7dcfff",
    "#bb9af7",
  ),
  t(
    "catppuccin-mocha",
    "Catppuccin Mocha",
    "#1e1e2e",
    "#cdd6f4",
    "#cba6f7",
    "#89dceb",
    "#f5c2e7",
  ),
  t(
    "rose-pine",
    "Rosé Pine",
    "#191724",
    "#e0def4",
    "#c4a7e7",
    "#9ccfd8",
    "#ebbcba",
  ),
  t(
    "one-dark",
    "One Dark",
    "#282c34",
    "#d7dae0",
    "#61afef",
    "#56b6c2",
    "#c678dd",
  ),
  t(
    "monokai",
    "Monokai",
    "#272822",
    "#f8f8f2",
    "#a6e22e",
    "#66d9ef",
    "#f92672",
  ),
  t(
    "github-dark",
    "GitHub Dark",
    "#0d1117",
    "#e6edf3",
    "#58a6ff",
    "#3fb950",
    "#d2a8ff",
  ),
  t(
    "midnight-blue",
    "Midnight Blue",
    "#0b1220",
    "#e2e8f0",
    "#38bdf8",
    "#818cf8",
    "#f472b6",
  ),
  t("carbon", "Carbon", "#121212", "#eeeeee", "#f97316", "#fbbf24", "#ef4444"),
  t("matrix", "Matrix", "#020a05", "#b6f7c1", "#22c55e", "#4ade80", "#a3e635"),
  t(
    "synthwave",
    "Synthwave",
    "#1a1033",
    "#f3e8ff",
    "#ff2e97",
    "#00e5ff",
    "#ffd400",
  ),
  t("coffee", "Coffee", "#1e1612", "#f2e6d8", "#d4a373", "#e9c46a", "#bc6c25"),
  t(
    "ocean-deep",
    "Ocean Deep",
    "#06202b",
    "#d8f3f7",
    "#2dd4bf",
    "#38bdf8",
    "#fbbf24",
  ),
  t("sunset", "Sunset", "#1f1020", "#ffe9e0", "#fb923c", "#f43f5e", "#facc15"),
];

/** The theme a first-time visitor sees (and what the server renders). */
export const DEFAULT_THEME = "indigo-ink";

export const findTheme = (id: string) =>
  themes.find((theme) => theme.id === id);

export function themeMode(theme: Theme): "light" | "dark" {
  return luminance(parseHex(theme.bg)) > 0.35 ? "light" : "dark";
}

/** All the colours a theme gives the page, as CSS variables ("r g b"). */
export function themeVars(theme: Theme): Record<string, string> {
  const bg = parseHex(theme.bg);
  const text = parseHex(theme.text);
  const light = themeMode(theme) === "light";

  const primary = parseHex(theme.primary);
  const secondary = parseHex(theme.secondary);
  const tertiary = parseHex(theme.tertiary);
  const surface = theme.surface
    ? parseHex(theme.surface)
    : mix(bg, text, light ? 0.05 : 0.07);

  // accents used as small text get nudged until they are readable on the page
  const readable = (colour: Rgb) => ensureContrast(colour, bg, 4.5, text);

  return {
    "t-bg": toTriplet(bg),
    "t-surface": toTriplet(surface),
    "t-strong": toTriplet(text),
    "t-soft": toTriplet(mix(text, bg, 0.06)),
    "t-body": toTriplet(mix(text, bg, 0.14)),
    "t-muted": toTriplet(ensureContrast(mix(text, bg, 0.4), bg, 4.5, text)),
    "t-faint": toTriplet(ensureContrast(mix(text, bg, 0.55), bg, 3.2, text)),
    "t-primary": toTriplet(primary),
    "t-secondary": toTriplet(secondary),
    "t-tertiary": toTriplet(tertiary),
    "t-primary-text": toTriplet(readable(primary)),
    "t-secondary-text": toTriplet(readable(secondary)),
    "t-tertiary-text": toTriplet(readable(tertiary)),
    "t-on-primary": toTriplet(readableOn(primary)),
    // little adjustments that depend on a light or dark page
    "t-logo-dark": light ? "18%" : "0%",
    "t-shadow-alpha": light ? "0.18" : "0.5",
  };
}

const declarations = (theme: Theme) =>
  `color-scheme:${themeMode(theme)};` +
  Object.entries(themeVars(theme))
    .map(([name, value]) => `--${name}:${value};`)
    .join("");

/**
 * The stylesheet for every theme. The default theme is also the plain page
 * (no attribute), so the server-rendered HTML is right before any script runs.
 */
export function themeCss(): string {
  return themes
    .map((theme) => {
      const selector =
        theme.id === DEFAULT_THEME
          ? `:root,html[data-theme="${theme.id}"]`
          : `html[data-theme="${theme.id}"]`;
      return `${selector}{${declarations(theme)}}`;
    })
    .join("\n");
}

/** Used by tests: how well does each piece read against the page? */
export function readability(theme: Theme) {
  const bg = parseHex(theme.bg);
  const channel = (name: string) =>
    parseHex(
      "#" +
        themeVars(theme)
          [name].split(" ")
          .map((n) => Number(n).toString(16).padStart(2, "0"))
          .join(""),
    );
  return {
    strong: contrast(channel("t-strong"), bg),
    body: contrast(channel("t-body"), bg),
    muted: contrast(channel("t-muted"), bg),
    faint: contrast(channel("t-faint"), bg),
    primaryText: contrast(channel("t-primary-text"), bg),
    secondaryText: contrast(channel("t-secondary-text"), bg),
    tertiaryText: contrast(channel("t-tertiary-text"), bg),
    onPrimary: contrast(channel("t-on-primary"), parseHex(theme.primary)),
  };
}
