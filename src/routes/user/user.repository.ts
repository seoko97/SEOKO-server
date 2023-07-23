import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import * as bcrypt from "bcrypt";

import { CreateUserDTO } from "@/routes/user/dto/create-user.dto";
import { User, UserModel } from "@/routes/user/user.schema";

const BCRYPT_SALT = 10;

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel) {}

  async create(createUserDto: CreateUserDTO) {
    createUserDto.password = await this.hashPassword(createUserDto.password);

    return this.userModel.create(createUserDto);
  }

  async getById(_id: string) {
    return this.userModel.findById(_id, { password: 0 });
  }

  async getByUserId(userId: string) {
    return this.userModel.findOne({ userId });
  }

  async updateRefreshToken(_id: string, refreshToken: string = null) {
    return this.userModel.updateOne({ _id }, { refreshToken });
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, BCRYPT_SALT);
  }
}
