import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";

import { Public } from "@/common/decorators";
import { ValidateObjectIdPipe } from "@/common/pipes/validate-objectid.pipe";
import { CreateProjectDto } from "@/routes/project/dto/create-project.dto";
import { UpdateProjectDto } from "@/routes/project/dto/update-project.dto";
import { ProjectService } from "@/routes/project/project.service";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    const project = await this.projectService.create(createProjectDto);

    return project;
  }

  @Put(":_id")
  async update(
    @Param("_id", ValidateObjectIdPipe) _id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.projectService.update(_id, updateProjectDto);

    return project;
  }

  @Delete(":_id")
  async delete(@Param("_id", ValidateObjectIdPipe) _id: string) {
    await this.projectService.delete(_id);

    return true;
  }

  @Public()
  @Get(":nid")
  async getByNumId(@Param("nid") nid: number) {
    const project = await this.projectService.getByNumId(nid);

    return project;
  }

  @Public()
  @Get()
  async getAll() {
    const projects = await this.projectService.getAll();

    return projects;
  }
}
