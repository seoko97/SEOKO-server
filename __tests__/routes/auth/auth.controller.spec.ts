import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

import { RESPONSE_MOCK } from "test/utils/mock";
import {
  TOKEN_STUB,
  TOKEN_USER_STUB,
  USER_ID_PASSWORD_STUB,
  USER_STUB_NON_PASSWORD,
} from "test/utils/stub";

import { LocalAuthGuard, RefreshJwtAuthGuard } from "@/common/guards";
import { AuthController } from "@/routes/auth/auth.controller";
import { AuthService } from "@/routes/auth/auth.service";
import { UserService } from "@/routes/user/user.service";
import { EJwtTokenType } from "@/types";

vi.mock("@/routes/auth/auth.service");
vi.mock("@/routes/user/user.service");

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UserService, ConfigService],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({})
      .overrideGuard(RefreshJwtAuthGuard)
      .useValue({})
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  describe("로그인", () => {
    let userServiceGetByIdSpy: TestSpyInstance;
    let authServiceSigninSpy: TestSpyInstance;
    let authServiceRegisterTokenInCookieSpy: TestSpyInstance;

    beforeEach(() => {
      userServiceGetByIdSpy = vi.spyOn(userService, "getById");
      authServiceSigninSpy = vi.spyOn(authService, "signin");
      authServiceRegisterTokenInCookieSpy = vi.spyOn(authService, "registerTokenInCookie");
    });

    it("성공", async () => {
      userServiceGetByIdSpy.mockResolvedValueOnce(USER_STUB_NON_PASSWORD);
      authServiceSigninSpy.mockResolvedValueOnce([TOKEN_STUB, TOKEN_STUB]);

      const result = await controller.signin(USER_ID_PASSWORD_STUB, TOKEN_USER_STUB, RESPONSE_MOCK);

      expect(userServiceGetByIdSpy).toHaveBeenCalledWith(TOKEN_USER_STUB._id);
      expect(authServiceSigninSpy).toHaveBeenCalledWith(USER_STUB_NON_PASSWORD);
      expect(authServiceRegisterTokenInCookieSpy).toHaveBeenCalledTimes(2);
      expect(authServiceRegisterTokenInCookieSpy).toHaveBeenCalledWith({
        type: EJwtTokenType.ACCESS,
        token: TOKEN_STUB,
        res: RESPONSE_MOCK,
      });
      expect(authServiceRegisterTokenInCookieSpy).toHaveBeenCalledWith({
        type: EJwtTokenType.REFRESH,
        token: TOKEN_STUB,
        res: RESPONSE_MOCK,
      });
      expect(result).toEqual({ username: USER_STUB_NON_PASSWORD.username });
    });
  });

  describe("로그아웃", () => {
    let userServiceUpdateRefreshTokenSpy: TestSpyInstance;
    let authServiceClearCookieSpy: TestSpyInstance;

    beforeEach(() => {
      userServiceUpdateRefreshTokenSpy = vi.spyOn(userService, "updateRefreshToken");
      authServiceClearCookieSpy = vi.spyOn(authService, "clearCookie");
    });

    it("성공", async () => {
      await controller.signout(TOKEN_USER_STUB, RESPONSE_MOCK);

      expect(userServiceUpdateRefreshTokenSpy).toHaveBeenCalledTimes(1);
      expect(userServiceUpdateRefreshTokenSpy).toHaveBeenCalledWith(TOKEN_USER_STUB._id, null);
      expect(authServiceClearCookieSpy).toHaveBeenCalledTimes(1);
      expect(authServiceClearCookieSpy).toHaveBeenCalledWith(RESPONSE_MOCK);
    });
  });

  describe("토큰 재발급", () => {
    let authServiceSigninSpy: TestSpyInstance;
    let authServiceRegisterTokenInCookieSpy: TestSpyInstance;
    let authServiceVerifyRefreshTokenSpy: TestSpyInstance;
    let userServiceGetById: TestSpyInstance;

    beforeEach(() => {
      authServiceSigninSpy = vi.spyOn(authService, "signin");
      authServiceRegisterTokenInCookieSpy = vi.spyOn(authService, "registerTokenInCookie");
      authServiceVerifyRefreshTokenSpy = vi.spyOn(authService, "verifyRefreshToken");
      userServiceGetById = vi.spyOn(userService, "getById");
    });

    it("성공", async () => {
      authServiceSigninSpy.mockReturnValueOnce([TOKEN_STUB, TOKEN_STUB]);
      authServiceVerifyRefreshTokenSpy.mockReturnValueOnce(true);
      userServiceGetById.mockResolvedValueOnce(USER_STUB_NON_PASSWORD);

      await controller.refresh(TOKEN_USER_STUB, RESPONSE_MOCK);

      expect(authServiceSigninSpy).toHaveBeenCalledTimes(1);
      expect(authServiceSigninSpy).toHaveBeenCalledWith(TOKEN_USER_STUB);
      expect(authServiceVerifyRefreshTokenSpy).toHaveBeenCalledTimes(1);
      expect(authServiceVerifyRefreshTokenSpy).toHaveBeenCalledWith(USER_STUB_NON_PASSWORD.refreshToken);
      expect(authServiceRegisterTokenInCookieSpy).toHaveBeenCalledTimes(1);
      expect(authServiceRegisterTokenInCookieSpy).toHaveBeenCalledWith({
        type: EJwtTokenType.ACCESS,
        token: TOKEN_STUB,
        res: RESPONSE_MOCK,
      });
    });
  });
});
