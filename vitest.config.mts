import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Gli ambienti jsdom si scelgono per file (`// @vitest-environment jsdom`).
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["node_modules/**", "examples/**"],
  },
});
