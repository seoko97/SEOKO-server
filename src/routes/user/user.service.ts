import { BadRequestException, Injectable } from "@nestjs/common";

import { CreateUserDTO } from "@/routes/user/dto/create-user.dto";
import { UserRepository } from "@/routes/user/user.repository";
import { USER_ERROR } from "@/utils/constants";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDTO) {
    const userId = createUserDto.userId;
    const user = await this.userRepository.getOne({ userId });

    if (user) {
      throw new BadRequestException(USER_ERROR.ALREADY_EXISTS);
    }

    return this.userRepository.create(createUserDto);
  }

  async getByUserId(userId: string) {
    return this.userRepository.getOne({ userId });
  }

  async getById(_id: string) {
    return this.userRepository.getById(_id, { password: 0 });
  }

  async updateRefreshToken(_id: string, refreshToken: string = null) {
    return this.userRepository.update(_id, { refreshToken });
  }
}
