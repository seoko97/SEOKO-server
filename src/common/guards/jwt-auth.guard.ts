import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

import { IS_PUBLIC_KEY } from "@/utils/constants";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super();
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

  handleRequest(err: unknown, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException(info.message);
    }
    return user;
  }

  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const cookies = req.cookies;

    const accessToken = cookies[this.configService.get<string>("ACCESS_HEADER")];
    const refreshToken = cookies[this.configService.get<string>("REFRESH_HEADER")];

    if (accessToken) {
      req.headers.authorization = `Bearer ${accessToken}`;
    }

    if (refreshToken) {
      req.headers.refresh = `Bearer ${refreshToken}`;
    }

    return req;
  }
}
