import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const resolvePath = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": resolvePath("./src"),
      test: resolvePath("./__tests__"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["__tests__/**/*.spec.ts"],
    coverage: {
      include: ["src/**/*.ts"],
      provider: "v8",
      reportsDirectory: "./coverage",
    },
  },
});
