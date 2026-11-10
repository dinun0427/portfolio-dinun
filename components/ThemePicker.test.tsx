import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ThemePicker } from "@/components/ThemePicker";
import { THEME_STORAGE_KEY } from "@/lib/theme-boot";
import { DEFAULT_THEME } from "@/lib/themes";

const html = document.documentElement;
const reset = () => {
  localStorage.clear();
  delete html.dataset.theme;
};

describe("ThemePicker", () => {
  beforeEach(reset);
  afterEach(reset);

  async function open() {
    const user = userEvent.setup();
    render(<ThemePicker />);
    await user.click(screen.getByRole("button", { name: "Change theme" }));
    return user;
  }

  it("is closed at first and opens with the palette button", async () => {
    const user = userEvent.setup();
    render(<ThemePicker />);
    const button = screen.getByRole("button", { name: "Change theme" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("dialog", { name: "Choose a theme" }),
    ).toBeInTheDocument();
  });

  it("lists light and dark themes and marks the current one", async () => {
    await open();
    expect(
      screen.getByRole("group", { name: "Light themes" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Dark themes" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Indigo Ink" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Dracula" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("applies the chosen theme, remembers it and closes", async () => {
    const user = await open();
    await user.click(screen.getByRole("button", { name: "Dracula" }));

    expect(html.dataset.theme).toBe("dracula");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dracula");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("previews on hover, and goes back when closed without choosing", async () => {
    const user = await open();
    await user.hover(screen.getByRole("button", { name: "Nord" }));
    expect(html.dataset.theme).toBe("nord");

    await user.keyboard("{Escape}");
    expect(html.dataset.theme).toBe(DEFAULT_THEME);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it("searches by name", async () => {
    const user = await open();
    const search = screen.getByRole("searchbox", { name: "Search themes" });

    await user.type(search, "dra");
    expect(screen.getByRole("button", { name: "Dracula" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Nord" }),
    ).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "zzzz");
    expect(screen.getByText(/No theme matches/)).toBeInTheDocument();
  });

  it("remembers a theme saved on an earlier visit", async () => {
    localStorage.setItem(THEME_STORAGE_KEY, "nord");
    await open();
    expect(screen.getByRole("button", { name: "Nord" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
