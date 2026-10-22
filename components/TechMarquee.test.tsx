import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TechMarquee } from "@/components/TechMarquee";
import { techRows } from "@/lib/data";
import { techIcons } from "@/lib/tech-icons";

describe("TechMarquee", () => {
  it("lists every technology once for assistive tech", () => {
    render(<TechMarquee />);
    expect(
      screen.getByRole("region", { name: "Technologies I work with" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(
      techRows.flat().length,
    );
  });

  it("renders a second copy of each item so the loop has no gap", () => {
    render(<TechMarquee />);
    for (const name of techRows.flat()) {
      expect(screen.getAllByText(name)).toHaveLength(2);
    }
  });

  it("has a logo for every technology", () => {
    const missing = techRows.flat().filter((name) => !techIcons[name]);
    expect(missing, "technologies without a logo").toEqual([]);
  });
});
