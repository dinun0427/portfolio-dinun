import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CursorGlow } from "@/components/CursorGlow";

describe("CursorGlow", () => {
  it("renders a decorative, hidden-from-assistive-tech light layer", () => {
    render(<CursorGlow />);
    expect(screen.getByTestId("cursor-glow")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
