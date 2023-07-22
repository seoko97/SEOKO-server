import { Controller, Get, Post } from "@nestjs/common";

@Controller("user")
export class UserController {
  @Post()
  async createUser(input: any) {
    return;
  }

  @Get()
  async getUser(_user: any) {
    return;
  }
}
