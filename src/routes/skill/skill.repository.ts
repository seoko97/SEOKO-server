import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { BaseRepository } from "@/common/repository/base.repository";
import { SequenceRepository } from "@/common/sequence/sequence.repository";
import { Skill, SkillDocument, SkillModel } from "@/routes/skill/skill.schema";
import { SkillType, TFilteredSkills } from "@/types";

@Injectable()
export class SkillRepository extends BaseRepository<SkillDocument> {
  constructor(
    @InjectModel(Skill.name) private readonly skillModel: SkillModel,
    sequenceRepository: SequenceRepository,
  ) {
    super(skillModel, sequenceRepository);
  }

  async getAllToSkillType() {
    const skills = await this.skillModel.aggregate([
      { $group: { _id: "$type", skills: { $push: "$$ROOT" } } },
    ]);

    return skills.reduce<TFilteredSkills>(
      (acc, { _id, skills }) => {
        acc[_id] = skills;

        return acc;
      },
      {
        [SkillType.FRONT_END]: [],
        [SkillType.BACK_END]: [],
        [SkillType.DEV_OPS]: [],
        [SkillType.LANGUAGE]: [],
      } as TFilteredSkills,
    );
  }
}
