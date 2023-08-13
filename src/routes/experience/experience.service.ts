import { BadRequestException, Injectable } from "@nestjs/common";

import { CreateExperienceDto } from "@/routes/experience/dto/create-experience.dto";
import { UpdateExperienceDto } from "@/routes/experience/dto/update-experience.dto";
import { ExperienceRepository } from "@/routes/experience/experience.repository";
import { EXPERIENCE_ERROR } from "@/utils/constants";

@Injectable()
export class ExperienceService {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async create(data: CreateExperienceDto) {
    await this.checkToExistByTitle(data.title);

    return this.experienceRepository.create(data);
  }

  async update(_id: string, data: UpdateExperienceDto) {
    await this.checkToExistById(_id);

    await this.checkToExistByTitle(data.title, _id);

    return this.experienceRepository.findOneAndUpdate({ _id }, data);
  }

  async delete(_id: string) {
    await this.checkToExistById(_id);

    return this.experienceRepository.delete(_id);
  }

  async getAll() {
    return this.experienceRepository.getAll({}, {}, { sort: { start: -1 } });
  }

  async checkToExistById(_id: string) {
    const experience = await this.experienceRepository.getById(_id);

    if (!experience) {
      throw new BadRequestException(EXPERIENCE_ERROR.NOT_FOUND);
    }

    return true;
  }

  async checkToExistByTitle(title: string, _id = "") {
    const experience = await this.experienceRepository.getOne({ title, _id: { $ne: _id } });

    if (experience) {
      throw new BadRequestException(EXPERIENCE_ERROR.ALREADY_EXISTS);
    }

    return true;
  }
}
