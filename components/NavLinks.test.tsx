import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NavLinks } from "@/components/NavLinks";

const links = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
] as const;

describe("NavLinks", () => {
  it("links to each section", () => {
    render(<NavLinks links={links} active="" />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "#about",
    );
    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute(
      "href",
      "#skills",
    );
  });

  it("marks only the current section", () => {
    render(<NavLinks links={links} active="skills" />);
    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("still works when hovered", async () => {
    const user = userEvent.setup();
    render(<NavLinks links={links} active="" />);
    await user.hover(screen.getByRole("link", { name: "About" }));
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });
});
