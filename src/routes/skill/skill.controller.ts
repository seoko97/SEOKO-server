import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";

import { Public } from "@/common/decorators";
import { ValidateObjectIdPipe } from "@/common/pipes/validate-objectid.pipe";
import { CreateSkillDto } from "@/routes/skill/dto/create-skill.dto";
import { UpdateSkillDto } from "@/routes/skill/dto/update-skill.dto";
import { SkillService } from "@/routes/skill/skill.service";

@Controller("skills")
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  async create(@Body() data: CreateSkillDto) {
    return this.skillService.create(data);
  }

  @Put(":_id")
  async update(@Param("_id", ValidateObjectIdPipe) _id: string, @Body() data: UpdateSkillDto) {
    return this.skillService.update(_id, { ...data });
  }

  @Delete(":_id")
  async delete(@Param("_id", ValidateObjectIdPipe) _id: string) {
    await this.skillService.delete(_id);

    return true;
  }

  @Public()
  @Get()
  async getAll() {
    return this.skillService.getAll();
  }
}
