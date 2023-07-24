import { JwtModule, JwtService } from "@nestjs/jwt";
import { TestingModule } from "@nestjs/testing";

import * as bcrypt from "bcrypt";
import createTestingModule from "test/utils/mongo/createTestModule";
import { TOKEN_STUB, TOKEN_USER_STUB, USER_STUB, USER_STUB_NON_PASSWORD } from "test/utils/stub";

import { AuthConstantProvider } from "@/common/providers/auth-constant.provider";
import { AuthService } from "@/routes/auth/auth.service";
import { USER_ERROR } from "@/utils/constants";

jest.mock("@/routes/user/user.service");
jest.mock("@/common/providers/auth-constant.provider");
jest.mock("bcrypt");

describe("AuthService", () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let authConstantProvider: AuthConstantProvider;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      imports: [JwtModule],
      providers: [
        AuthService,
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
    jwtService = module.get<JwtService>(JwtService);
    authConstantProvider = module.get<AuthConstantProvider>(AuthConstantProvider);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(authConstantProvider).toBeDefined();
  });

  describe("로그인", () => {
    // 로그인시 access token과 refresh token을 발급
    // response header를 mock으로 만들어서 테스트
    it("성공", async () => {
      authService.signature = jest.fn().mockReturnValue(TOKEN_STUB);

      const result = await authService.signin(TOKEN_USER_STUB);

      expect(authService.signature).toHaveBeenCalledTimes(2);
      expect(authService.signature).toReturnWith(TOKEN_STUB);
      expect(result).toEqual([TOKEN_STUB, TOKEN_STUB]);
    });
  });

  describe("입력한 아이디와 비밀번호가 유저 정보와 일치하는지 확인", () => {
    let bcryptCompareSpy: jest.SpyInstance;

    beforeEach(() => {
      bcryptCompareSpy = jest.spyOn(bcrypt, "compare");
    });

    it("성공", async () => {
      bcryptCompareSpy.mockReturnValueOnce(true);

      const result = await authService.comparePassword(USER_STUB.password, USER_STUB.password);

      expect(result).toEqual(USER_STUB_NON_PASSWORD);
    });

    describe("실패", () => {
      // 실패 조건?
      // 1. 유저 정보가 없는 경우
      // 2. 비밀번호가 일치하지 않는 경우
      it("비밀번호가 일치하지 않는 경우", async () => {
        bcryptCompareSpy.mockReturnValueOnce(false);

        try {
          await authService.comparePassword(USER_STUB.password, USER_STUB.password);
        } catch (e) {
          expect(e.status).toBe(400);
          expect(e.message).toBe(USER_ERROR.BAD_REQUEST);
        }
      });
    });
  });

  describe("refresh token 유효성 검사", () => {
    let jwtServiceVerifySpy: jest.SpyInstance;

    beforeEach(() => {
      jwtServiceVerifySpy = jest.spyOn(jwtService, "verify");
    });

    it("성공", async () => {
      jwtServiceVerifySpy.mockReturnValueOnce(true);

      const result = await authService.verifyRefreshToken(USER_STUB, USER_STUB.refreshToken);

      expect(jwtServiceVerifySpy).toHaveBeenCalledTimes(1);
      expect(jwtServiceVerifySpy).toHaveBeenCalledWith({
        _id: USER_STUB_NON_PASSWORD._id,
      });
      expect(result).toBe(true);
    });

    describe("실패", () => {
      it("유저 정보에 refresh token이 없는 경우", async () => {
        try {
          await authService.verifyRefreshToken(USER_STUB, null);
        } catch (e) {
          expect(e.status).toBe(401);
          expect(e.message).toBe(USER_ERROR.UNAUTHORIZED);
        }
      });

      it("토큰이 유효하지 않은 경우", async () => {
        jwtServiceVerifySpy.mockRejectedValueOnce(new Error());

        try {
          await authService.verifyRefreshToken(USER_STUB, USER_STUB.refreshToken);
        } catch (e) {
          expect(e.status).toBe(401);
          expect(e.message).toBe(USER_ERROR.UNAUTHORIZED);
        }
      });
    });
  });
});
