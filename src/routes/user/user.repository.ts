import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { ObjectId } from "mongoose";

import { User, UserModel } from "@/routes/user/user.schema";

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel) {}

  async create(input: any) {
    return;
  }

  async getById(id: ObjectId) {
    return;
  }

  async getByUserId(userId: string) {
    return;
  }

  async updateRefreshToken(id: ObjectId, refreshToken: string = null) {
    return;
  }

  async hashPassword(input: any) {
    return;
  }
}
