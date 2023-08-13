import { BadRequestException, Injectable } from "@nestjs/common";

import { SkillRepository } from "@/routes/skill/skill.repository";
import { SKILL_ERROR } from "@/utils/constants";

@Injectable()
export class SkillService {
  constructor(private readonly skillRepository: SkillRepository) {}

  async create(data: any) {
    await this.checkToExistByTitle(data.name);

    return await this.skillRepository.create(data);
  }

  async update(_id: string, data: any) {
    await this.checkToExistById(_id);

    await this.checkToExistByTitle(data.name, _id);

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

  async checkToExistByTitle(name: string, _id = "") {
    const skill = await this.skillRepository.getOne({ name, _id: { $ne: _id } });

    if (skill) {
      throw new BadRequestException(SKILL_ERROR.ALREADY_EXISTS);
    }

    return true;
  }
}
