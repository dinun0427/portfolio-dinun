import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme-boot";
import { DEFAULT_THEME, findTheme } from "@/lib/themes";

const CHANGE_EVENT = "portfolio-theme-change";

/** The theme the visitor chose and saved (or the default). */
export function getSavedTheme(): string {
  try {
    const id = localStorage.getItem(THEME_STORAGE_KEY);
    if (id && findTheme(id)) return id;
  } catch {
    // storage can be blocked (private windows); the default is fine then
  }
  return DEFAULT_THEME;
}

/** Show a theme on the page without saving it (used for the hover preview). */
export function showTheme(id: string) {
  document.documentElement.dataset.theme = id;
}

/** Show a theme and remember it for next time. */
export function saveTheme(id: string) {
  showTheme(id);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // not saved, but it still applies for this visit
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  // another tab changed the theme: follow it
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    showTheme(getSavedTheme());
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** The saved theme id. The server (and first paint) says "default". */
export function useSavedTheme() {
  return useSyncExternalStore(subscribe, getSavedTheme, () => DEFAULT_THEME);
}
