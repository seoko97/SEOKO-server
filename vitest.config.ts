import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const resolvePath = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@": resolvePath("./src"),
      test: resolvePath("./__tests__"),
    },
  },
  test: {
    root: "./",
    globals: true,
    include: ["__tests__/**/*.spec.ts"],
  },
});
