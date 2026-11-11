import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SocialRail } from "@/components/SocialRail";
import { socials } from "@/lib/data";

describe("SocialRail", () => {
  it("links to every social account", () => {
    render(<SocialRail />);
    for (const social of socials) {
      expect(screen.getByRole("link", { name: social.label })).toHaveAttribute(
        "href",
        social.href,
      );
    }
  });

  it("opens web profiles in a new tab but not the email link", () => {
    render(<SocialRail />);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByRole("link", { name: "Email" })).not.toHaveAttribute(
      "target",
    );
  });
});
