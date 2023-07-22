import { Injectable } from "@nestjs/common";

import { UserRepository } from "@/routes/user/user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(input: any) {
    return;
  }

  async getByUserId(userId: string) {
    return;
  }

  async getById(id: string) {
    return;
  }

  async updateRefreshToken(id: string, refreshToken: string = null) {
    return;
  }
}
