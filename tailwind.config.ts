import type { Config } from "tailwindcss";

// colours come from the palette in app/globals.css (so one place changes everything)
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        blink: { "0%, 50%": { opacity: "1" }, "51%, 100%": { opacity: "0" } },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(30px, -40px)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        shimmer: "shimmer 6s linear infinite",
        pulseRing: "pulseRing 1.8s ease-out infinite",
        float: "float 18s ease-in-out infinite",
        bob: "bob 6s ease-in-out infinite",
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      colors: {
        // the page and its surfaces
        ink: {
          950: token("forest"),
          900: token("forest-deep"),
          800: token("forest-soft"),
          700: token("forest-lift"),
        },
        // the accent colours used for labels, gradients and glows
        accent: {
          violet: token("sage"),
          cyan: token("sage-light"),
          pink: token("mist"),
        },
        // existing class names (text-white, text-zinc-400...) now read the palette
        white: token("ivory"),
        zinc: {
          200: token("cream"),
          300: token("mist"),
          400: token("muted"),
          500: token("faint"),
        },
        violet: { 400: token("sage-light"), 600: token("sage") },
        emerald: { 300: token("mist"), 400: token("sage-light") },
        sky: { 300: token("cream") },
      },
    },
  },
  plugins: [],
};

export default config;
