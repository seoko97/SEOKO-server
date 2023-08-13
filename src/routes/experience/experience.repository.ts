import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { BaseRepository } from "@/common/repository/base.repository";
import { SequenceRepository } from "@/common/sequence/sequence.repository";
import {
  Experience,
  ExperienceDocument,
  ExperienceModel,
} from "@/routes/experience/experience.schema";

@Injectable()
export class ExperienceRepository extends BaseRepository<ExperienceDocument> {
  constructor(
    @InjectModel(Experience.name) experienceModel: ExperienceModel,
    sequenceRepository: SequenceRepository,
  ) {
    super(experienceModel, sequenceRepository);
  }
}
