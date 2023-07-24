import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

import * as bcrypt from "bcrypt";

import { AuthConstantProvider } from "@/common/providers/auth-constant.provider";
import { TTokenUser } from "@/types";
import { USER_ERROR } from "@/utils/constants";

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
      const isVerify = await this.jwtService.verify(refreshToken);

      if (!Boolean(isVerify)) throw new UnauthorizedException();

      return true;
    } catch (e) {
      throw new UnauthorizedException(USER_ERROR.UNAUTHORIZED);
    }
  }

  // 입력받은 데이터를 통해 토큰을 발급
  signature(_id: string, options: JwtSignOptions) {
    return this.jwtService.sign({ id: _id }, options);
  }

  // 토큰을 쿠키에 등록
  registerTokenInCookie() {
    return;
  }

  // response header에서 access token과 refresh token을 삭제
  clearCookie() {
    return;
  }
}
