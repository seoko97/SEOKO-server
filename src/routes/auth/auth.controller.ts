import { Response } from "express";

import { Controller, Post, Res, UseGuards } from "@nestjs/common";

import { Public, User } from "@/common/decorators";
import { LocalAuthGuard } from "@/common/guards";
import { AuthService } from "@/routes/auth/auth.service";
import { SigninDTO } from "@/routes/auth/dto/signin.dto";
import { UserService } from "@/routes/user/user.service";
import { EJwtTokenType, TTokenUser } from "@/types";

@Controller("auth")
export class AuthController {
  constructor(private userService: UserService, private authService: AuthService) {}

  // localGuard를 통해 검증된 User 정보를 가져옴
  // 해당 User 정보를 통해 access token과 refresh token을 발급
  // 발급된 token을 response header에 담아서 전송
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("signin")
  async signin(_: SigninDTO, @User() _user: TTokenUser, @Res({ passthrough: true }) res: Response) {
    const user = await this.userService.getById(_user._id);

    const [accessToken, refreshToken] = await this.authService.signin(user);

    this.authService.registerTokenInCookie({
      type: EJwtTokenType.ACCESS,
      token: accessToken,
      res,
    });

    this.authService.registerTokenInCookie({
      type: EJwtTokenType.REFRESH,
      token: refreshToken,
      res,
    });

    return { username: user.username };
  }

  // AuthGuard를 통해 검증된 User 정보를 가져옴
  // response header에 담겨있는 token을 제거
  @Post("signout")
  async signout(@User() _user: TTokenUser, @Res({ passthrough: true }) res: Response) {
    await this.userService.updateRefreshToken(_user._id, null);

    this.authService.clearCookie(res);

    return true;
  }

  // AuthGuard를 통해 검증된 User 정보를 가져옴
  // 검증된 User 정보를 통해 access token 재발급
  @Post("refresh")
  async refresh(@User() _user: TTokenUser, @Res({ passthrough: true }) res: Response) {
    await this.authService.verifyRefreshToken(_user._id);

    const [accessToken] = await this.authService.signin(_user);

    this.authService.registerTokenInCookie({
      type: EJwtTokenType.ACCESS,
      token: accessToken,
      res,
    });

    return true;
  }
}
