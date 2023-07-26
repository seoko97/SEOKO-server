import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import * as bcrypt from "bcrypt";
import { Strategy as LStrategy } from "passport-local";

import { UserService } from "@/routes/user/user.service";
import { USER_ERROR } from "@/utils/constants";

@Injectable()
export class LocalStrategy extends PassportStrategy(LStrategy) {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: "userId",
      passwordField: "password",
    });
  }

  async validate(userId: string, password: string): Promise<any> {
    const _user = await this.userService.getByUserId(userId);

    if (!_user) throw new BadRequestException(USER_ERROR.NOT_FOUND);

    const isCompare = await bcrypt.compare(password, _user.password);

    if (!isCompare) throw new BadRequestException(USER_ERROR.PASSWORD_NOT_MATCH);

    return this.userService.getById(_user.id);
  }
}
