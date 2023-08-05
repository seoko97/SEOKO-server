import { ExecutionContext, Injectable, Type, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { AuthGuard, IAuthGuard } from "@nestjs/passport";

import { EJwtTokenType } from "@/types";
import { AUTH_ERROR, IS_PUBLIC_KEY } from "@/utils/constants";

const generateJwtAuthGuard = (key: string): Type<IAuthGuard> => {
  @Injectable()
  class JwtAuthGuard extends AuthGuard(`jwt-${key}`) {
    HEADER: string;

    constructor(private readonly configService: ConfigService) {
      super();

      this.HEADER = this.configService.get<string>(
        key === EJwtTokenType.ACCESS ? "ACCESS_HEADER" : "REFRESH_HEADER",
      );
    }

    handleRequest(err: unknown, user: any, info: any) {
      if (err || !user) {
        switch (info?.message) {
          case "No auth token":
            throw new UnauthorizedException(AUTH_ERROR.NO_SIGN);
          case "jwt expired":
            throw new UnauthorizedException(AUTH_ERROR.EXPIRED_TOKEN);
          case "invalid token":
            throw new UnauthorizedException(AUTH_ERROR.INVALID_TOKEN);
          default:
            throw err || new UnauthorizedException(info.message);
        }
      }

      return user;
    }

    getRequest(context: ExecutionContext) {
      const req = context.switchToHttp().getRequest();

      const cookies = req.cookies;

      const token = cookies[this.HEADER];

      if (token) req.headers.authorization = `Bearer ${token}`;

      return req;
    }
  }

  return JwtAuthGuard;
};

@Injectable()
export class AccessJwtAuthGuard extends generateJwtAuthGuard(EJwtTokenType.ACCESS) {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super(configService);
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}

export const RefreshJwtAuthGuard = generateJwtAuthGuard(EJwtTokenType.REFRESH);
