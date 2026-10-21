import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SmoothScroll } from "@/components/SmoothScroll";

const { destroy, scrollTo, MockLenis } = vi.hoisted(() => {
  const destroy = vi.fn();
  const scrollTo = vi.fn();
  const MockLenis = vi.fn(function MockLenis() {
    return { destroy, scrollTo };
  });
  return { destroy, scrollTo, MockLenis };
});

vi.mock("lenis", () => ({ default: MockLenis }));

describe("SmoothScroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts smooth scrolling and cleans up on unmount", () => {
    const { unmount } = render(<SmoothScroll />);
    expect(MockLenis).toHaveBeenCalledTimes(1);
    unmount();
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it("glides to same-page anchor links", () => {
    render(
      <>
        <SmoothScroll />
        <a href="#about">About</a>
        <section id="about" />
      </>,
    );
    fireEvent.click(screen.getByRole("link", { name: "About" }));
    expect(scrollTo).toHaveBeenCalledWith(document.getElementById("about"));
  });

  it("leaves the skip link to the browser", () => {
    render(
      <>
        <SmoothScroll />
        <a href="#main">Skip</a>
        <main id="main" />
      </>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Skip" }));
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("does nothing for reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
    } as MediaQueryList);
    render(<SmoothScroll />);
    expect(MockLenis).not.toHaveBeenCalled();
  });
});
