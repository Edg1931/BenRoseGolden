import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Matched to the real Benjamin Rose brand (benrose.org / class decks):
        // a bold red with a spiral-rose mark and a warm orange accent, on soft
        // pink/cream. `plum` now holds the deep brand red used for dark sections
        // (name kept so existing usages don't churn); `gold` is the orange accent
        // that also nods to The Golden Group.
        border: "hsl(20 22% 88%)",
        input: "hsl(20 22% 88%)",
        ring: "hsl(349 80% 47%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(350 24% 15%)",
        muted: {
          DEFAULT: "hsl(18 42% 96%)",
          foreground: "hsl(350 8% 42%)",
        },
        brand: {
          plum: "hsl(349 68% 32%)",
          rose: "hsl(349 80% 47%)",
          blush: "hsl(349 100% 96%)",
          gold: "hsl(30 92% 50%)",
          cream: "hsl(18 60% 98%)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
