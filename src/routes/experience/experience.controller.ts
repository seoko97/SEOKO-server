import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";

import { ValidateObjectIdPipe } from "@/common/pipes/validate-objectid.pipe";
import { CreateExperienceDto } from "@/routes/experience/dto/create-experience.dto";
import { UpdateExperienceDto } from "@/routes/experience/dto/update-experience.dto";
import { ExperienceService } from "@/routes/experience/experience.service";

@Controller("experiences")
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  async create(@Body() data: CreateExperienceDto) {
    return this.experienceService.create(data);
  }

  @Put(":_id")
  async update(@Param("_id", ValidateObjectIdPipe) _id: string, @Body() data: UpdateExperienceDto) {
    return this.experienceService.update(_id, { ...data });
  }

  @Delete(":_id")
  async delete(@Param("_id", ValidateObjectIdPipe) _id: string) {
    await this.experienceService.delete(_id);

    return true;
  }

  @Get()
  async getAll() {
    return this.experienceService.getAll();
  }
}
