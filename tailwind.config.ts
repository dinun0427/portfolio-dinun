import type { Config } from "tailwindcss";

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
      },
      animation: {
        blink: "blink 1s step-end infinite",
        shimmer: "shimmer 6s linear infinite",
        pulseRing: "pulseRing 1.8s ease-out infinite",
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
