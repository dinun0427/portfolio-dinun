import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ScrollProgress } from "@/components/ScrollProgress";

// jsdom has no scrolling layout, so GSAP itself is replaced here;
// the real animation is covered by the e2e test.
vi.mock("@/lib/gsap", () => ({ gsap: {}, useGSAP: vi.fn() }));

describe("ScrollProgress", () => {
  it("renders a decorative bar hidden from assistive tech", () => {
    render(<ScrollProgress />);
    expect(screen.getByTestId("scroll-progress")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
