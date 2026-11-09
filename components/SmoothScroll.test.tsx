import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SmoothScroll } from "@/components/SmoothScroll";

const mocks = vi.hoisted(() => {
  const destroy = vi.fn();
  const scrollTo = vi.fn();
  const on = vi.fn();
  const raf = vi.fn();
  const MockLenis = vi.fn(function MockLenis() {
    return { destroy, scrollTo, on, raf };
  });
  const ticker = { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() };
  const update = vi.fn();
  return { destroy, scrollTo, on, raf, MockLenis, ticker, update };
});

vi.mock("lenis", () => ({ default: mocks.MockLenis }));
vi.mock("@/lib/gsap", () => ({
  gsap: { ticker: mocks.ticker },
  ScrollTrigger: { update: mocks.update },
}));

describe("SmoothScroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("runs Lenis on GSAP's clock and cleans up on unmount", () => {
    const { unmount } = render(<SmoothScroll />);
    expect(mocks.MockLenis).toHaveBeenCalledTimes(1);

    // every Lenis scroll updates ScrollTrigger
    expect(mocks.on).toHaveBeenCalledWith("scroll", expect.any(Function));
    mocks.on.mock.calls[0][1]();
    expect(mocks.update).toHaveBeenCalledTimes(1);

    // GSAP's ticker drives Lenis (time is in seconds, Lenis wants ms)
    expect(mocks.ticker.add).toHaveBeenCalledTimes(1);
    const onTick = mocks.ticker.add.mock.calls[0][0];
    onTick(2);
    expect(mocks.raf).toHaveBeenCalledWith(2000);

    unmount();
    expect(mocks.ticker.remove).toHaveBeenCalledWith(onTick);
    expect(mocks.destroy).toHaveBeenCalledTimes(1);
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
    expect(mocks.scrollTo).toHaveBeenCalledWith(
      document.getElementById("about"),
    );
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
    expect(mocks.scrollTo).not.toHaveBeenCalled();
  });

  it("does nothing for reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
    } as MediaQueryList);
    render(<SmoothScroll />);
    expect(mocks.MockLenis).not.toHaveBeenCalled();
    expect(mocks.ticker.add).not.toHaveBeenCalled();
  });
});
