import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { JwtAuthGuard } from "@/common/guards";
import { CommonModule } from "@/common/modules";
import { AuthModule } from "@/routes/auth/auth.module";
import { UserModule } from "@/routes/user/user.module";

@Module({
  imports: [CommonModule, UserModule, AuthModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
