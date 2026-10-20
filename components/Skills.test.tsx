import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skills } from "@/components/Skills";
import { skillGroups } from "@/lib/data";

describe("Skills", () => {
  it("renders every group and skill from the data file", () => {
    render(<Skills />);
    for (const group of skillGroups) {
      expect(
        screen.getByRole("heading", { name: group.title }),
      ).toBeInTheDocument();
      for (const skill of group.skills) {
        expect(screen.getAllByText(skill.name).length).toBeGreaterThan(0);
      }
    }
  });

  it("exposes each skill level as a progress bar with its percentage", () => {
    render(<Skills />);
    const skills = skillGroups.flatMap((group) => group.skills);
    const bars = screen.getAllByRole("progressbar");

    expect(bars).toHaveLength(skills.length);
    skills.forEach((skill, i) => {
      expect(bars[i]).toHaveAttribute("aria-valuenow", String(skill.level));
      expect(bars[i]).toHaveAccessibleName(`${skill.name} proficiency`);
    });
  });
});
