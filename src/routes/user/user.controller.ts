import { Body, Controller, Get, Post } from "@nestjs/common";

import { Public, User } from "@/common/decorators";
import { CreateUserDTO } from "@/routes/user/dto/create-user.dto";
import { UserService } from "@/routes/user/user.service";
import { TTokenUser } from "@/types";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async createUser(@Body() input: CreateUserDTO) {
    const { username } = await this.userService.create(input);

    return { username };
  }

  @Get()
  async getUser(@User() _user: TTokenUser) {
    const { username } = await this.userService.getById(_user._id);

    return { username };
  }
}
