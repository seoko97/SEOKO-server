import { Controller, Get, Post } from "@nestjs/common";

import { CreateUserDTO } from "@/routes/user/dto/create-user.dto";
import { UserService } from "@/routes/user/user.service";
import { TTokenUser } from "@/types";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(input: CreateUserDTO) {
    return this.userService.create(input);
  }

  @Get()
  async getUser(_user: TTokenUser) {
    return this.userService.getById(_user._id);
  }
}
