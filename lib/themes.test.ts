import { describe, expect, it } from "vitest";
import {
  DEFAULT_THEME,
  findTheme,
  readability,
  themeCss,
  themeMode,
  themeVars,
  themes,
} from "@/lib/themes";

describe("themes", () => {
  it("have unique, URL-safe ids and a name each", () => {
    const ids = themes.map((theme) => theme.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const theme of themes) {
      expect(theme.id).toMatch(/^[a-z0-9-]{1,40}$/);
      expect(theme.name.length).toBeGreaterThan(0);
    }
  });

  it("include light and dark themes, and the default exists", () => {
    expect(findTheme(DEFAULT_THEME)).toBeDefined();
    const modes = new Set(themes.map(themeMode));
    expect(modes).toEqual(new Set(["light", "dark"]));
    expect(themeMode(findTheme("indigo-ink")!)).toBe("light");
    expect(themeMode(findTheme("dracula")!)).toBe("dark");
  });

  it("keep text readable on every theme", () => {
    const problems: string[] = [];
    for (const theme of themes) {
      const r = readability(theme);
      const check = (label: string, value: number, min: number) => {
        if (value < min)
          problems.push(
            `${theme.name}: ${label} ${value.toFixed(1)} (needs ${min})`,
          );
      };
      check("headings", r.strong, 7);
      check("body text", r.body, 4.5);
      check("secondary text", r.muted, 4.5);
      check("faint text", r.faint, 3);
      check("primary labels", r.primaryText, 4.5);
      check("secondary labels", r.secondaryText, 4.5);
      check("tertiary labels", r.tertiaryText, 4.5);
      check("button text", r.onPrimary, 4.5);
    }
    expect(problems).toEqual([]);
  });
});

describe("themeVars", () => {
  it("gives every variable as a 'r g b' triplet (or a plain value)", () => {
    const vars = themeVars(findTheme("dracula")!);
    expect(vars["t-bg"]).toBe("40 42 54");
    expect(vars["t-strong"]).toBe("248 248 242");
    for (const [name, value] of Object.entries(vars)) {
      if (name === "t-logo-dark" || name === "t-shadow-alpha") continue;
      expect(value).toMatch(/^\d{1,3} \d{1,3} \d{1,3}$/);
    }
  });

  it("uses the surface a theme asks for, and works one out otherwise", () => {
    expect(themeVars(findTheme("indigo-ink")!)["t-surface"]).toBe(
      "245 246 251",
    );
    expect(themeVars(findTheme("dracula")!)["t-surface"]).not.toBe(
      themeVars(findTheme("dracula")!)["t-bg"],
    );
  });

  it("adjusts shadows and logos for light and dark pages", () => {
    expect(themeVars(findTheme("indigo-ink")!)["t-logo-dark"]).toBe("18%");
    expect(themeVars(findTheme("dracula")!)["t-logo-dark"]).toBe("0%");
  });
});

describe("themeCss", () => {
  const css = themeCss();

  it("has a rule for every theme", () => {
    for (const theme of themes)
      expect(css).toContain(`html[data-theme="${theme.id}"]`);
  });

  it("makes the default theme the plain page too", () => {
    expect(css).toContain(`:root,html[data-theme="${DEFAULT_THEME}"]`);
  });

  it("sets the browser's own light or dark mode per theme", () => {
    expect(css).toContain("color-scheme:light;");
    expect(css).toContain("color-scheme:dark;");
  });
});
