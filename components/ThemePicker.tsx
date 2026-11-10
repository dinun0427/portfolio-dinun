"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type SVGProps,
} from "react";
import { saveTheme, showTheme, useSavedTheme } from "@/lib/theme-client";
import { themeMode, themes, type Theme } from "@/lib/themes";

function PaletteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** A tiny preview of a theme: its page colour with its accents on top. */
function Swatch({ theme }: { theme: Theme }) {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1 ring-1 ring-black/15"
      style={{ background: theme.bg }}
    >
      {[theme.primary, theme.secondary, theme.tertiary, theme.text].map(
        (colour, i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-full"
            style={{ background: colour }}
          />
        ),
      )}
    </span>
  );
}

const GROUPS = (["light", "dark"] as const).map((mode) => ({
  mode,
  title: mode === "light" ? "Light" : "Dark",
  themes: themes.filter((theme) => themeMode(theme) === mode),
}));

/** The palette button (top right) and its list of themes. */
export function ThemePicker() {
  const saved = useSavedTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // close without choosing: undo any hover preview
  const close = useCallback(
    (returnFocus: boolean) => {
      setOpen(false);
      setQuery("");
      showTheme(saved);
      if (returnFocus) trigger.current?.focus();
    },
    [saved],
  );

  useEffect(() => {
    if (!open) return;
    // a keyboard pops up on phones, so only focus the search box with a mouse
    if (window.matchMedia("(pointer: fine)").matches) search.current?.focus();
    else panel.current?.focus();

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) close(false);
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  function choose(id: string) {
    saveTheme(id);
    setOpen(false);
    setQuery("");
    trigger.current?.focus();
  }

  // arrow keys move between the search box and the themes
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const items = Array.from(
      list.current?.querySelectorAll<HTMLButtonElement>(
        "button[data-theme-id]",
      ) ?? [],
    );
    if (items.length === 0) return;
    event.preventDefault();
    const at = items.indexOf(document.activeElement as HTMLButtonElement);
    const down = event.key === "ArrowDown";
    const next =
      at === -1
        ? down
          ? 0
          : items.length - 1
        : (at + (down ? 1 : -1) + items.length) % items.length;
    items[next].focus();
  }

  const q = query.trim().toLowerCase();
  const groups = GROUPS.map((group) => ({
    ...group,
    themes: group.themes.filter((theme) =>
      theme.name.toLowerCase().includes(q),
    ),
  })).filter((group) => group.themes.length > 0);

  return (
    <div ref={wrapper} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-label="Change theme"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => (open ? close(true) : setOpen(true))}
        className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-accent-cyan hover:text-white"
      >
        <PaletteIcon className="h-[18px] w-[18px]" />
      </button>

      {open && (
        <div
          ref={panel}
          id={panelId}
          role="dialog"
          aria-label="Choose a theme"
          tabIndex={-1}
          onKeyDown={onKeyDown}
          onMouseLeave={() => showTheme(saved)}
          className="fixed inset-x-4 top-[4.5rem] z-50 flex max-h-[min(70vh,30rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-950 shadow-2xl shadow-black/25 focus:outline-none md:absolute md:inset-x-auto md:right-0 md:top-full md:mt-3 md:w-80"
        >
          <div className="border-b border-white/10 p-3">
            <input
              ref={search}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search themes…"
              aria-label="Search themes"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-accent-cyan focus:outline-none"
            />
          </div>

          {/* data-lenis-prevent: let this list scroll normally, not with the page */}
          <div
            ref={list}
            data-lenis-prevent
            className="overflow-y-auto overscroll-contain p-2"
          >
            {groups.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-zinc-400">
                No theme matches &ldquo;{query}&rdquo;.
              </p>
            )}
            {groups.map((group) => (
              <div
                key={group.mode}
                role="group"
                aria-label={`${group.title} themes`}
              >
                <h3 className="px-3 pb-1 pt-3 font-mono text-xs uppercase tracking-widest text-zinc-500">
                  {group.title}
                </h3>
                {group.themes.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    data-theme-id={theme.id}
                    aria-pressed={saved === theme.id}
                    onMouseEnter={() => showTheme(theme.id)}
                    onFocus={() => showTheme(theme.id)}
                    onClick={() => choose(theme.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none ${
                      saved === theme.id ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-4 text-accent-cyan">
                        {saved === theme.id && (
                          <CheckIcon className="h-4 w-4" />
                        )}
                      </span>
                      {theme.name}
                    </span>
                    <Swatch theme={theme} />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
