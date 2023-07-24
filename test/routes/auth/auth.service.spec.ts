import { JwtModule, JwtService } from "@nestjs/jwt";
import { TestingModule } from "@nestjs/testing";

import jwt from "jsonwebtoken";
import createTestingModule from "test/utils/mongo/createTestModule";
import { TOKEN_STUB, USER_STUB, USER_STUB_NON_PASSWORD } from "test/utils/stub";

import { AuthConstantProvider } from "@/common/providers/auth-constant.provider";
import { AuthService } from "@/routes/auth/auth.service";
import { UserService } from "@/routes/user/user.service";
import { USER_ERROR } from "@/utils/constants";

jest.mock("@/routes/auth/auth.service");
jest.mock("@/routes/user/user.service");
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn(),
}));

describe("AuthService", () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let authConstantProvider: AuthConstantProvider;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      imports: [JwtModule],
      providers: [
        AuthService,
        UserService,
        {
          provide: AuthConstantProvider,
          useValue: {
            JWT_SECRET_KEY: "JWT_SECRET_KEY",
            ACCESS_HEADER: "ACCESS_HEADER",
            REFRESH_HEADER: "REFRESH_HEADER",
            ACCESS_EXPIRES: "ACCESS_EXPIRES",
            REFRESH_EXPIRES: "REFRESH_EXPIRES",
            COOKIE_MAX_AGE: "COOKIE_MAX_AGE",
          },
        },
      ],
    });

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    authConstantProvider = module.get<AuthConstantProvider>(AuthConstantProvider);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(authConstantProvider).toBeDefined();
  });

  describe("로그인", () => {
    let authServiceSignatureSpy: jest.SpyInstance;

    beforeEach(() => {
      authServiceSignatureSpy = jest.spyOn(authService, "signature");
    });

    // 로그인시 access token과 refresh token을 발급
    // response header를 mock으로 만들어서 테스트
    it("성공", async () => {
      authServiceSignatureSpy.mockReturnValueOnce(TOKEN_STUB);

      const USER_INPUT = {
        userId: USER_STUB.userId,
        password: USER_STUB.password,
      };

      const result = await authService.signin(USER_INPUT);

      expect(result).toEqual([TOKEN_STUB, TOKEN_STUB]);
    });
  });

  describe("입력한 아이디와 비밀번호가 유저 정보와 일치하는지 확인", () => {
    // 로그인 요청시 입력한 아이디와 비밀번호가 유저 정보와 일치하는지 확인
    // 확인됐다면 유저 정보를 반환
    let userServiceGetByIdSpy: jest.SpyInstance;
    let userServiceGetByUserIdSpy: jest.SpyInstance;
    let authServiceComparePasswordSpy: jest.SpyInstance;

    beforeEach(() => {
      userServiceGetByIdSpy = jest.spyOn(userService, "getById");
      userServiceGetByUserIdSpy = jest.spyOn(userService, "getByUserId");
      authServiceComparePasswordSpy = jest.spyOn(authService, "comparePassword");
    });

    it("성공", async () => {
      userServiceGetByIdSpy.mockResolvedValueOnce(USER_STUB_NON_PASSWORD);
      userServiceGetByUserIdSpy.mockResolvedValueOnce(USER_STUB);
      authServiceComparePasswordSpy.mockResolvedValueOnce(true);

      const USER_INPUT = {
        userId: USER_STUB.userId,
        password: USER_STUB.password,
      };

      const result = await authService.validateUser(USER_INPUT);

      expect(result).toEqual(USER_STUB_NON_PASSWORD);
    });

    describe("실패", () => {
      // 실패 조건?
      // 1. 유저 정보가 없는 경우
      // 2. 비밀번호가 일치하지 않는 경우
      it("유저 정보가 없는 경우", async () => {
        userServiceGetByIdSpy.mockResolvedValueOnce(null);

        const USER_INPUT = {
          userId: USER_STUB.userId,
          password: USER_STUB.password,
        };

        try {
          await authService.validateUser(USER_INPUT);
        } catch (e) {
          expect(e.status).toBe(404);
          expect(e.message).toBe(USER_ERROR.NOT_FOUND);
        }
      });

      it("비밀번호가 일치하지 않는 경우", async () => {
        userServiceGetByUserIdSpy.mockResolvedValueOnce(USER_STUB);
        authServiceComparePasswordSpy.mockResolvedValueOnce(false);

        const USER_INPUT = {
          userId: USER_STUB.userId,
          password: USER_STUB.password,
        };

        try {
          await authService.validateUser(USER_INPUT);
        } catch (e) {
          expect(e.status).toBe(400);
          expect(e.message).toBe(USER_ERROR.BAD_REQUEST);
        }
      });
    });
  });

  describe("refresh token 유효성 검사", () => {
    let jwtVerifySpy: jest.SpyInstance;
    let userServiceGetByIdSpy: jest.SpyInstance;

    beforeEach(() => {
      userServiceGetByIdSpy = jest.spyOn(userService, "getById");
      jwtVerifySpy = jest.spyOn(jwt, "verify");
    });

    it("성공", async () => {
      userServiceGetByIdSpy.mockResolvedValueOnce(USER_STUB_NON_PASSWORD);
      jwtVerifySpy.mockReturnValueOnce({ _id: USER_STUB_NON_PASSWORD._id });

      const result = await authService.verifyRefreshToken();

      expect(jwtVerifySpy).toHaveBeenCalledTimes(1);
      expect(jwtVerifySpy).toHaveBeenCalledWith({
        _id: USER_STUB_NON_PASSWORD._id,
      });
      expect(result).toBe(true);
    });

    describe("실패", () => {
      it("유저 정보가 없는 경우", async () => {
        userServiceGetByIdSpy.mockResolvedValueOnce(null);

        try {
          await authService.verifyRefreshToken();
        } catch (e) {
          expect(e.status).toBe(404);
          expect(e.message).toBe(USER_ERROR.NOT_FOUND);
        }
      });

      it("유저 정보에 refresh token이 없는 경우", async () => {
        userServiceGetByIdSpy.mockResolvedValueOnce({
          ...USER_STUB_NON_PASSWORD,
          refreshToken: null,
        });

        try {
          await authService.verifyRefreshToken();
        } catch (e) {
          expect(e.status).toBe(401);
          expect(e.message).toBe(USER_ERROR.UNAUTHORIZED);
        }
      });

      it("토큰이 유효하지 않은 경우", async () => {
        userServiceGetByIdSpy.mockResolvedValueOnce(USER_STUB_NON_PASSWORD);
        jwtVerifySpy.mockRejectedValueOnce(new Error());

        try {
          await authService.verifyRefreshToken();
        } catch (e) {
          expect(e.status).toBe(401);
          expect(e.message).toBe(USER_ERROR.UNAUTHORIZED);
        }
      });
    });
  });
});
