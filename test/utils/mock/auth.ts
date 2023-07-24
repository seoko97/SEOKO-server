import { Response } from "express";

const RESPONSE_MOCK = {
  cookie: jest.fn(),
  clearCookie: jest.fn(),
} as unknown as Response;

export { RESPONSE_MOCK };
