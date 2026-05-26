import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        fg: "var(--fg)",
        "fg-2": "var(--fg-2)",
        "fg-3": "var(--fg-3)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        line: "var(--line)",
        "line-soft": "var(--line-soft)",
        card: "var(--card)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Pretendard", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        en: ["var(--font-en)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "tick": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-33.3333%)" },
        },
        "reveal-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "modal-fade": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "modal-pop": {
          "0%": { opacity: "0", transform: "scale(0.95) translateY(8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        tick: "tick 50s linear infinite",
        "reveal-in": "reveal-in .6s ease forwards",
        "modal-fade": "modal-fade .25s ease",
        "modal-pop": "modal-pop .35s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
