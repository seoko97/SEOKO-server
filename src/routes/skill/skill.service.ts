import { BadRequestException, Injectable } from "@nestjs/common";

import { FilterQuery } from "mongoose";

import { CreateSkillDto } from "@/routes/skill/dto/create-skill.dto";
import { UpdateSkillDto } from "@/routes/skill/dto/update-skill.dto";
import { SkillRepository } from "@/routes/skill/skill.repository";
import { SkillDocument } from "@/routes/skill/skill.schema";
import { SKILL_ERROR } from "@/utils/constants";

@Injectable()
export class SkillService {
  constructor(private readonly skillRepository: SkillRepository) {}

  async create(data: CreateSkillDto) {
    await this.checkToExist({ name: data.name });

    return await this.skillRepository.create(data);
  }

  async update(_id: string, data: UpdateSkillDto) {
    await this.checkToExistById(_id);

    await this.checkToExist({ name: data.name, _id: { $ne: _id } });

    return this.skillRepository.findOneAndUpdate({ _id }, data);
  }

  async delete(_id: string) {
    await this.checkToExistById(_id);

    return this.skillRepository.delete(_id);
  }

  async getAll() {
    return await this.skillRepository.getAllToSkillType();
  }

  async checkToExistById(_id: string) {
    const skill = await this.skillRepository.getById(_id);

    if (!skill) {
      throw new BadRequestException(SKILL_ERROR.NOT_FOUND);
    }

    return true;
  }

  async checkToExist(query: FilterQuery<SkillDocument>) {
    const skill = await this.skillRepository.getOne(query);

    if (skill) {
      throw new BadRequestException(SKILL_ERROR.ALREADY_EXISTS);
    }

    return true;
  }
}
