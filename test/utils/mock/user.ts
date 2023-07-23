import { USER_STUB, USER_STUB_NON_PASSWORD } from "test/utils/stub";

const MockUserService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(USER_STUB),
  getByUserId: jest.fn().mockResolvedValue(USER_STUB),
  getById: jest.fn().mockResolvedValue(USER_STUB_NON_PASSWORD),
  updateRefreshToken: jest.fn(),
});

const MockUserRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(USER_STUB),
  getByUserId: jest.fn().mockResolvedValue(USER_STUB),
  getById: jest.fn().mockResolvedValue(USER_STUB_NON_PASSWORD),
  hashPassword: jest.fn().mockResolvedValue("hashedPassword"),
  updateRefreshToken: jest.fn(),
});

export { MockUserService, MockUserRepository };
