import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
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
        ink: {
          950: "#05060a",
          900: "#0a0b12",
          800: "#11131d",
          700: "#1a1d2b",
        },
        accent: {
          violet: "#8b5cf6",
          cyan: "#22d3ee",
          pink: "#f472b6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
