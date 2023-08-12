import { BadRequestException, Injectable } from "@nestjs/common";

import { CreateProjectDto } from "@/routes/project/dto/create-project.dto";
import { UpdateProjectDto } from "@/routes/project/dto/update-project.dto";
import { ProjectRepository } from "@/routes/project/project.repository";
import { PROJECT_ERROR } from "@/utils/constants";

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(dto: CreateProjectDto) {
    return this.projectRepository.create(dto);
  }

  async update(_id: string, dto: UpdateProjectDto) {
    const project = await this.projectRepository.getById(_id);

    if (!project) {
      throw new BadRequestException(PROJECT_ERROR.NOT_FOUND);
    }

    return this.projectRepository.findOneAndUpdate({ _id }, dto);
  }

  async delete(_id: string) {
    const project = await this.projectRepository.getById(_id);

    if (!project) {
      throw new BadRequestException(PROJECT_ERROR.NOT_FOUND);
    }

    return this.projectRepository.delete(_id);
  }

  async getByNumId(nid: number) {
    const project = await this.projectRepository.getOne({ nid });

    if (!project) {
      throw new BadRequestException(PROJECT_ERROR.NOT_FOUND);
    }

    return project;
  }

  async getAll() {
    return this.projectRepository.getAll();
  }
}
