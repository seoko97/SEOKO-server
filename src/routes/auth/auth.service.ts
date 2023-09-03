import { CookieOptions, Response } from "express";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

import { AuthConstantProvider } from "@/common/providers/auth-constant.provider";
import { EJwtTokenType, IRegisterTokenInCookieArgs, TTokenUser } from "@/types";
import { AUTH_ERROR } from "@/utils/constants";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authConstantProvider: AuthConstantProvider,
  ) {}

  // 로그인시 access token과 refresh token을 발급
  async signin(user: TTokenUser) {
    const { ACCESS_EXPIRES, REFRESH_EXPIRES } = this.authConstantProvider;

    const accessOptions: JwtSignOptions = { expiresIn: ACCESS_EXPIRES };
    const refreshOptions: JwtSignOptions = { expiresIn: REFRESH_EXPIRES };

    const accessToken = this.signature(user._id, accessOptions);
    const refreshToken = this.signature(user._id, refreshOptions);

    return [accessToken, refreshToken];
  }

  // refresh token 유효성 검사
  // 서버에 저장된 유저 토큰이 유효한 토큰인지 확인
  async verifyRefreshToken(refreshToken: string) {
    try {
      const options = { secret: this.authConstantProvider.JWT_SECRET_KEY };

      const isVerify = await this.jwtService.verify(refreshToken, options);

      if (!Boolean(isVerify)) throw new UnauthorizedException();

      return true;
    } catch (e) {
      throw new UnauthorizedException(AUTH_ERROR.UNAUTHORIZED);
    }
  }

  // 입력받은 데이터를 통해 토큰을 발급
  signature(_id: string, options: JwtSignOptions) {
    options.secret = this.authConstantProvider.JWT_SECRET_KEY;

    return this.jwtService.sign({ _id }, options);
  }

  // response header에 access token과 refresh token을 등록
  registerTokenInCookie({ type, token, res }: IRegisterTokenInCookieArgs) {
    const { ACCESS_HEADER, REFRESH_HEADER, COOKIE_MAX_AGE } = this.authConstantProvider;

    const isRefresh = type === EJwtTokenType.REFRESH;
    const tokenName = isRefresh ? REFRESH_HEADER : ACCESS_HEADER;

    const cookieOptions: CookieOptions = {
      httpOnly: isRefresh,
      maxAge: Number(COOKIE_MAX_AGE),
      secure: true,
    };

    res.cookie(tokenName, token, cookieOptions);
  }

  // response header에서 access token과 refresh token을 삭제
  clearCookie(res: Response) {
    const { ACCESS_HEADER, REFRESH_HEADER } = this.authConstantProvider;

    res.clearCookie(ACCESS_HEADER);
    res.clearCookie(REFRESH_HEADER);
  }
}
