import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import * as bcrypt from "bcryptjs";

import { BaseRepository } from "@/common/repository/base.repository";
import { SequenceRepository } from "@/common/sequence/sequence.repository";
import { CreateUserDTO } from "@/routes/user/dto/create-user.dto";
import { User, UserDocument, UserModel } from "@/routes/user/user.schema";

const BCRYPT_SALT = 10;

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserModel,
    sequenceRepository: SequenceRepository,
  ) {
    super(userModel, sequenceRepository);
  }

  async create(createUserDto: CreateUserDTO) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, BCRYPT_SALT);

    return super.create(createUserDto);
  }
}
