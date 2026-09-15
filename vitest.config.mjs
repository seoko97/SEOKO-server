import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    root: "./",
    globals: true,
    include: ["__tests__/**/*.spec.ts"],
  },
});
