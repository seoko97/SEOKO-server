import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthConstantProvider {
  JWT_SECRET_KEY: string;
  ACCESS_HEADER: string;
  REFRESH_HEADER: string;
  ACCESS_EXPIRES: string;
  REFRESH_EXPIRES: string;
  COOKIE_MAX_AGE: string;

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.init();
  }

  private init() {
    this.JWT_SECRET_KEY = this.configService.get<string>("JWT_SECRET_KEY");
    this.ACCESS_HEADER = this.configService.get<string>("ACCESS_HEADER");
    this.REFRESH_HEADER = this.configService.get<string>("REFRESH_HEADER");
    this.ACCESS_EXPIRES = this.configService.get<string>("ACCESS_EXPIRES");
    this.REFRESH_EXPIRES = this.configService.get<string>("REFRESH_EXPIRES");
    this.COOKIE_MAX_AGE = this.configService.get<string>("COOKIE_MAX_AGE");
  }
}
