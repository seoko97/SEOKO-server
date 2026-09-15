import { USER_STUB, USER_STUB_NON_PASSWORD } from "test/utils/stub";

const MockUserService = vi.fn().mockReturnValue({
  create: vi.fn().mockResolvedValue(USER_STUB),
  getByUserId: vi.fn().mockResolvedValue(USER_STUB),
  getById: vi.fn().mockResolvedValue(USER_STUB_NON_PASSWORD),
  updateRefreshToken: vi.fn(),
});

const MockUserRepository = vi.fn().mockReturnValue({
  create: vi.fn().mockResolvedValue(USER_STUB),
  getByUserId: vi.fn().mockResolvedValue(USER_STUB),
  getById: vi.fn().mockResolvedValue(USER_STUB_NON_PASSWORD),
  hashPassword: vi.fn().mockResolvedValue("hashedPassword"),
  updateRefreshToken: vi.fn(),
});

export { MockUserService, MockUserRepository };
