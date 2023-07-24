import { Module } from "@nestjs/common";

import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { CommonModule } from "@/common/modules";
import { AuthModule } from "@/routes/auth/auth.module";
import { UserModule } from "@/routes/user/user.module";

@Module({
  imports: [CommonModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
