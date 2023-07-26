import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy as JStrategy } from "passport-jwt";

import { TTokenUser } from "@/types";

@Injectable()
export class JwtStrategy extends PassportStrategy(JStrategy) {
  constructor(private configService: ConfigService) {
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
