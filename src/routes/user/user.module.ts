import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserController } from "@/routes/user/user.controller";
import { UserRepository } from "@/routes/user/user.repository";
import { User, UserSchema } from "@/routes/user/user.schema";
import { UserService } from "@/routes/user/user.service";

const USER_MODULE_IMPORTS = [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])];

const USER_MODULE_EXPORTS = [UserService];

const USER_MODULE_PROVIDERS = [UserController, UserService, UserRepository];

@Module({
  imports: USER_MODULE_IMPORTS,
  exports: USER_MODULE_EXPORTS,
  providers: USER_MODULE_PROVIDERS,
})
export class UserModule {}
