import { USER_STUB } from "test/utils/stub/user";

const MockUserService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(USER_STUB),
  getByUserId: jest.fn().mockResolvedValue(USER_STUB),
  getById: jest.fn().mockResolvedValue(USER_STUB),
  updateRefreshToken: jest.fn(),
});

const MockUserRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(USER_STUB),
  getByUserId: jest.fn().mockResolvedValue(USER_STUB),
  getById: jest.fn().mockResolvedValue(USER_STUB),
  updateRefreshToken: jest.fn(),
  hashPassword: jest.fn(),
});

export { MockUserService, MockUserRepository };
