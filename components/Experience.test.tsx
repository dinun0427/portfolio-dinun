import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Experience } from "@/components/Experience";
import { experience } from "@/lib/data";

describe("Experience", () => {
  it("renders every job from the data file in order", () => {
    render(<Experience />);
    const roles = screen
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);

    expect(roles).toEqual(experience.map((job) => job.role));
  });
});
