import { Request } from "express";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy as JStrategy } from "passport-jwt";

import { UserService } from "@/routes/user/user.service";
import { EJwtTokenType, TTokenUser } from "@/types";
import { USER_ERROR } from "@/utils/constants";

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(JStrategy, `jwt-${EJwtTokenType.ACCESS}`) {
  constructor(private readonly configService: ConfigService) {
    const JWT_SECRET = configService.get("JWT_SECRET_KEY");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  validate(payload: TTokenUser) {
    return { _id: payload._id };
  }
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  JStrategy,
  `jwt-${EJwtTokenType.REFRESH}`,
) {
  REFRESH_HEADER: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const JWT_SECRET = configService.get("JWT_SECRET_KEY");
    const REFRESH_HEADER = configService.get("REFRESH_HEADER");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
      passReqToCallback: true,
    });

    this.REFRESH_HEADER = REFRESH_HEADER;
  }

  async validate(req: Request, payload: TTokenUser) {
    const refreshToken = req.cookies?.[this.REFRESH_HEADER];

    const user = await this.userService.getById(payload._id);

    if (!refreshToken || !user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException(USER_ERROR.UNAUTHORIZED);
    }

    return { _id: payload._id };
  }
}
