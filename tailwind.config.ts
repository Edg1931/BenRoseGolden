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
        // Partnership palette, keyed to the Benjamin Rose brand (benrose.org):
        // warm berry plum + rose on cream, with The Golden Group's gold as the
        // partner accent. Tuned to the public brand's rose motif — when the
        // official style-guide hexes are available, update these tokens and the
        // whole app retunes.
        border: "hsl(30 25% 88%)",
        input: "hsl(30 25% 88%)",
        ring: "hsl(338 65% 46%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(331 35% 16%)",
        muted: {
          DEFAULT: "hsl(33 40% 95%)",
          foreground: "hsl(331 12% 42%)",
        },
        brand: {
          plum: "hsl(331 48% 24%)",
          rose: "hsl(338 65% 46%)",
          blush: "hsl(340 60% 96%)",
          gold: "hsl(42 80% 42%)",
          cream: "hsl(36 50% 97%)",
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
