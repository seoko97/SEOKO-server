import { TestingModule } from "@nestjs/testing";

import { RESPONSE_MOCK } from "test/utils/mock";
import createTestingModule from "test/utils/mongo/createTestModule";
import {
  TOKEN_STUB,
  TOKEN_USER_STUB,
  USER_ID_PASSWORD_STUB,
  USER_STUB_NON_PASSWORD,
} from "test/utils/stub";

import { AuthController } from "@/routes/auth/auth.controller";
import { AuthService } from "@/routes/auth/auth.service";
import { UserService } from "@/routes/user/user.service";
import { EJwtTokenType } from "@/types";

jest.mock("@/routes/auth/auth.service");
jest.mock("@/routes/user/user.service");

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UserService],
    });

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  describe("로그인", () => {
    let userServiceGetByIdSpy: jest.SpyInstance;
    let authServiceSigninSpy: jest.SpyInstance;
    let authServiceRegisterTokenInCookieSpy: jest.SpyInstance;

    beforeEach(() => {
      userServiceGetByIdSpy = jest.spyOn(userService, "getById");
      authServiceSigninSpy = jest.spyOn(authService, "signin");
      authServiceRegisterTokenInCookieSpy = jest.spyOn(authService, "registerTokenInCookie");
    });

    it("성공", async () => {
      userServiceGetByIdSpy.mockResolvedValueOnce(USER_STUB_NON_PASSWORD);
      authServiceSigninSpy.mockResolvedValueOnce([TOKEN_STUB, TOKEN_STUB]);

      const result = await controller.signin(USER_ID_PASSWORD_STUB, TOKEN_USER_STUB, RESPONSE_MOCK);

      expect(userServiceGetByIdSpy).toBeCalledWith(TOKEN_USER_STUB._id);
      expect(authServiceSigninSpy).toBeCalledWith(USER_STUB_NON_PASSWORD);
      expect(authServiceRegisterTokenInCookieSpy).toBeCalledTimes(2);
      expect(authServiceRegisterTokenInCookieSpy).toBeCalledWith({
        type: EJwtTokenType.ACCESS,
        token: TOKEN_STUB,
        res: RESPONSE_MOCK,
      });
      expect(authServiceRegisterTokenInCookieSpy).toBeCalledWith({
        type: EJwtTokenType.REFRESH,
        token: TOKEN_STUB,
        res: RESPONSE_MOCK,
      });
      expect(result).toEqual({ username: USER_STUB_NON_PASSWORD.username });
    });
  });

  describe("로그아웃", () => {
    let userServiceUpdateRefreshTokenSpy: jest.SpyInstance;
    let authServiceClearCookieSpy: jest.SpyInstance;

    beforeEach(() => {
      userServiceUpdateRefreshTokenSpy = jest.spyOn(userService, "updateRefreshToken");
      authServiceClearCookieSpy = jest.spyOn(authService, "clearCookie");
    });

    it("성공", async () => {
      await controller.signout(TOKEN_USER_STUB, RESPONSE_MOCK);

      expect(userServiceUpdateRefreshTokenSpy).toBeCalledTimes(1);
      expect(userServiceUpdateRefreshTokenSpy).toBeCalledWith(TOKEN_USER_STUB._id, null);
      expect(authServiceClearCookieSpy).toBeCalledTimes(1);
      expect(authServiceClearCookieSpy).toBeCalledWith(RESPONSE_MOCK);
    });
  });

  describe("토큰 재발급", () => {
    let authServiceSigninSpy: jest.SpyInstance;
    let authServiceRegisterTokenInCookieSpy: jest.SpyInstance;

    beforeEach(() => {
      authServiceSigninSpy = jest.spyOn(authService, "signin");
      authServiceRegisterTokenInCookieSpy = jest.spyOn(authService, "registerTokenInCookie");
    });

    it("성공", async () => {
      authServiceSigninSpy.mockReturnValueOnce([TOKEN_STUB, TOKEN_STUB]);

      await controller.refresh(TOKEN_USER_STUB, RESPONSE_MOCK);

      expect(authServiceSigninSpy).toBeCalledTimes(1);
      expect(authServiceSigninSpy).toBeCalledWith(TOKEN_USER_STUB);
      expect(authServiceRegisterTokenInCookieSpy).toBeCalledTimes(1);
      expect(authServiceRegisterTokenInCookieSpy).toBeCalledWith({
        type: EJwtTokenType.ACCESS,
        token: TOKEN_STUB,
        res: RESPONSE_MOCK,
      });
    });
  });
});
