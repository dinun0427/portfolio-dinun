import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CubeSection } from "@/components/cube/CubeSection";

vi.mock("next/dynamic", () => ({ default: () => () => null }));

describe("CubeSection", () => {
  it("shows the heading and the controls", () => {
    render(<CubeSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Give it a spin" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Scramble" })).toBeEnabled();
  });

  it("can only be reset after the cube has been scrambled", () => {
    render(<CubeSection />);
    const reset = screen.getByRole("button", { name: "Reset" });
    expect(reset).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Scramble" }));
    expect(reset).toBeEnabled();
    fireEvent.click(reset);
    expect(reset).toBeDisabled();
  });
});
