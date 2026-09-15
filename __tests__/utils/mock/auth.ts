import { Response } from "express";

const RESPONSE_MOCK = {
  cookie: vi.fn(),
  clearCookie: vi.fn(),
} as unknown as Response;

export { RESPONSE_MOCK };
