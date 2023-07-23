import { Module } from "@nestjs/common";

import { AuthController } from "@/routes/auth/auth.controller";
import { UserModule } from "@/routes/user/user.module";

@Module({
  imports: [UserModule],
  controllers: [AuthController],
})
export class AuthModule {}
