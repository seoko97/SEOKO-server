import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { AuthConstantProvider } from "@/common/providers/auth-constant.provider";
import { AccessJwtStrategy, LocalStrategy, RefreshJwtStrategy } from "@/common/strategies";
import { AuthController } from "@/routes/auth/auth.controller";
import { AuthService } from "@/routes/auth/auth.service";
import { UserModule } from "@/routes/user/user.module";

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET_KEY"),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    AuthConstantProvider,
    LocalStrategy,
    AccessJwtStrategy,
    RefreshJwtStrategy,
  ],
})
export class AuthModule {}
