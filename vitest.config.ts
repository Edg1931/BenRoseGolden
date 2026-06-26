import { defineConfig } from "vitest/config";

/** Unit tests for the highest-risk pure logic (quiz scoring, eligibility). */
export default defineConfig({
  resolve: {
    // Resolve the "@/*" path alias from tsconfig.json natively (Vite 6+).
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
