import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";

import { Public } from "@/common/decorators";
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

  @Put(":nid")
  async update(@Param("nid") nid: number, @Body() updateProjectDto: UpdateProjectDto) {
    const project = await this.projectService.update(nid, updateProjectDto);

    return project;
  }

  @Delete(":nid")
  async delete(@Param("nid") nid: number) {
    await this.projectService.delete(nid);

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
