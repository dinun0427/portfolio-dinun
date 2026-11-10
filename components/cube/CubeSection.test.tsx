import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CubeSection } from "@/components/cube/CubeSection";
import type { Move } from "@/lib/cube";

// jsdom has no layout, so pretend the cube is always on screen
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useInView: () => true,
}));

// jsdom has no WebGL, so the 3D scene is replaced by one that plays scripts at once
vi.mock("next/dynamic", async () => {
  const { useEffect } = await import("react");
  type Props = {
    script: { moves: Move[] } | null;
    onMove: (move: Move) => void;
    onSettled: () => void;
  };
  return {
    default: () =>
      function MockScene({ script, onMove, onSettled }: Props) {
        useEffect(() => {
          if (!script) return;
          script.moves.forEach((move) => onMove(move));
          onSettled();
        }, [script, onMove, onSettled]);
        return null;
      },
  };
});

const button = (name: string) => screen.getByRole("button", { name });
const cube = () => screen.getByRole("group", { name: "3D Rubik's cube" });

describe("CubeSection", () => {
  it("shows the heading, and Solve and Reset start switched off", () => {
    render(<CubeSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Give it a spin" }),
    ).toBeInTheDocument();
    expect(button("Scramble")).toBeEnabled();
    expect(button("Solve")).toBeDisabled();
    expect(button("Reset")).toBeDisabled();
  });

  it("scrambles, then Solve brings it back to solved", () => {
    render(<CubeSection />);
    fireEvent.click(button("Scramble"));
    expect(button("Solve")).toBeEnabled();
    expect(screen.queryByText("Solved. Nice!")).not.toBeInTheDocument();

    fireEvent.click(button("Solve"));
    expect(button("Solve")).toBeDisabled();
    expect(screen.getByText("Solved. Nice!")).toBeInTheDocument();
  });

  it("Reset puts the cube back without playing anything", () => {
    render(<CubeSection />);
    fireEvent.click(button("Scramble"));
    fireEvent.click(button("Reset"));
    expect(button("Reset")).toBeDisabled();
    expect(screen.getByText("Drag a piece to start.")).toBeInTheDocument();
  });

  it("turns a face from the keyboard, and Shift turns it back", () => {
    render(<CubeSection />);
    fireEvent.keyDown(cube(), { key: "x" }); // not a face: ignored
    expect(button("Reset")).toBeDisabled();

    fireEvent.keyDown(cube(), { key: "r" });
    expect(button("Reset")).toBeEnabled();

    fireEvent.keyDown(cube(), { key: "R", shiftKey: true }); // R' undoes R
    expect(button("Reset")).toBeDisabled();
    expect(screen.getByText("Solved. Nice!")).toBeInTheDocument();
  });
});
