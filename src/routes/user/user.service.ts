import { ConflictException, Injectable } from "@nestjs/common";

import { CreateUserDTO } from "@/routes/user/dto/create-user.dto";
import { UserRepository } from "@/routes/user/user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDTO) {
    const user = await this.userRepository.getByUserId(createUserDto.userId);

    if (user) throw new ConflictException("이미 존재하는 유저입니다.");

    return this.userRepository.create(createUserDto);
  }

  async getByUserId(userId: string) {
    return this.userRepository.getByUserId(userId);
  }

  async getById(_id: string) {
    return this.userRepository.getById(_id);
  }

  async updateRefreshToken(_id: string, refreshToken: string = null) {
    return this.userRepository.updateRefreshToken(_id, refreshToken);
  }
}
