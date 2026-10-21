import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SignatureIntro } from "@/components/SignatureIntro";
import { signatureStrokes } from "@/lib/signature";

describe("signature data", () => {
  it("has strokes that are written in order", () => {
    expect(signatureStrokes.length).toBeGreaterThan(10);
    signatureStrokes.forEach((stroke, i) => {
      expect(stroke.d.startsWith("M")).toBe(true);
      expect(stroke.duration).toBeGreaterThanOrEqual(0);
      if (i > 0) {
        expect(stroke.delay).toBeGreaterThanOrEqual(
          signatureStrokes[i - 1].delay,
        );
      }
    });
  });
});

describe("SignatureIntro", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("draws every stroke", () => {
    const { container } = render(<SignatureIntro />);
    expect(container.querySelectorAll("path")).toHaveLength(
      signatureStrokes.length,
    );
  });

  it("remembers that it has played this session", () => {
    render(<SignatureIntro />);
    expect(sessionStorage.getItem("intro-seen")).toBe("1");
  });

  it("removes itself once the signature is written", () => {
    render(<SignatureIntro />);
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByTestId("signature-intro")).not.toBeInTheDocument();
  });

  it("can be skipped with the button", () => {
    render(<SignatureIntro />);
    fireEvent.click(screen.getByRole("button", { name: "Skip" }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByTestId("signature-intro")).not.toBeInTheDocument();
  });
});
