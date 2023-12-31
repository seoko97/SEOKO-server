import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SequenceModule } from "@/common/sequence/sequence.module";
import { UserController } from "@/routes/user/user.controller";
import { UserRepository } from "@/routes/user/user.repository";
import { User, UserSchema } from "@/routes/user/user.schema";
import { UserService } from "@/routes/user/user.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), SequenceModule],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserController, UserService, UserRepository],
})
export class UserModule {}
