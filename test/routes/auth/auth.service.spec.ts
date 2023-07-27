import { JwtModule, JwtService } from "@nestjs/jwt";
import { TestingModule } from "@nestjs/testing";

import { RESPONSE_MOCK } from "test/utils/mock";
import createTestingModule from "test/utils/mongo/createTestModule";
import { TOKEN_STUB, TOKEN_USER_STUB, USER_STUB } from "test/utils/stub";

import { AuthConstantProvider } from "@/common/providers/auth-constant.provider";
import { AuthService } from "@/routes/auth/auth.service";
import { EJwtTokenType } from "@/types";
import { AUTH_ERROR } from "@/utils/constants";

jest.mock("@/routes/user/user.service");
jest.mock("@/common/providers/auth-constant.provider");

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
    it("성공", async () => {
      authService.signature = jest.fn().mockReturnValue(TOKEN_STUB);

      const result = await authService.signin(TOKEN_USER_STUB);

      expect(authService.signature).toHaveBeenCalledTimes(2);
      expect(authService.signature).toReturnWith(TOKEN_STUB);
      expect(result).toEqual([TOKEN_STUB, TOKEN_STUB]);
    });
  });

  describe("refresh token 유효성 검사", () => {
    let jwtServiceVerifySpy: jest.SpyInstance;

    beforeEach(() => {
      jwtServiceVerifySpy = jest.spyOn(jwtService, "verify");
    });

    it("성공", async () => {
      jwtServiceVerifySpy.mockReturnValueOnce(true);

      const result = await authService.verifyRefreshToken(USER_STUB.refreshToken);

      expect(jwtServiceVerifySpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    describe("실패", () => {
      it("유저 정보에 refresh token이 없는 경우", async () => {
        try {
          await authService.verifyRefreshToken(null);
        } catch (e) {
          expect(e.status).toBe(401);
          expect(jwtServiceVerifySpy).toHaveBeenCalledTimes(1);
          expect(e.message).toBe(AUTH_ERROR.UNAUTHORIZED);
        }
      });

      it("토큰이 유효하지 않은 경우", async () => {
        jwtServiceVerifySpy.mockRejectedValueOnce(new Error());

        try {
          await authService.verifyRefreshToken(USER_STUB.refreshToken);
        } catch (e) {
          expect(e.status).toBe(401);
          expect(jwtServiceVerifySpy).toHaveBeenCalledTimes(1);
          expect(e.message).toBe(AUTH_ERROR.UNAUTHORIZED);
        }
      });
    });
  });

  describe("response header에 토큰 등록", () => {
    const res = RESPONSE_MOCK;

    it("access token", () => {
      authService.registerTokenInCookie({
        type: EJwtTokenType.ACCESS,
        token: TOKEN_STUB,
        res,
      });

      expect(res.cookie).toHaveBeenCalledTimes(1);
      expect(res.cookie).toHaveBeenCalledWith(authConstantProvider.ACCESS_HEADER, TOKEN_STUB, {
        httpOnly: true,
        maxAge: Number(authConstantProvider.COOKIE_MAX_AGE),
        secure: true,
      });
    });

    it("refresh token", () => {
      authService.registerTokenInCookie({
        type: EJwtTokenType.REFRESH,
        token: TOKEN_STUB,
        res,
      });

      expect(res.cookie).toHaveBeenCalledTimes(1);
      expect(res.cookie).toHaveBeenCalledWith(authConstantProvider.REFRESH_HEADER, TOKEN_STUB, {
        httpOnly: true,
        maxAge: Number(authConstantProvider.COOKIE_MAX_AGE),
        secure: true,
      });
    });
  });
});
