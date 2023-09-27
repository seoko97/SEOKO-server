import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { BaseRepository } from "@/common/repository/base.repository";
import { SequenceRepository } from "@/common/sequence/sequence.repository";
import { Project, ProjectDocument, ProjectModel } from "@/routes/project/project.schema";

@Injectable()
export class ProjectRepository extends BaseRepository<ProjectDocument> {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: ProjectModel,
    sequenceRepository: SequenceRepository,
  ) {
    super(projectModel, sequenceRepository);
  }
}
