import type { TestSpyInstance } from "vitest";

declare global {
  type TestSpyInstance = TestSpyInstance;
}

export {};
