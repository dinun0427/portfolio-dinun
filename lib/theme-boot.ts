/**
 * Server-safe pieces of theme saving (no React in here), so the layout can use
 * them. The script runs in <head> before the page paints, so a returning
 * visitor never sees a flash of the wrong theme.
 */

export const THEME_STORAGE_KEY = "portfolio-theme";

export const THEME_BOOT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t&&/^[a-z0-9-]{1,40}$/.test(t))document.documentElement.dataset.theme=t}catch(e){}`;
