import { Controller, Get, Param } from "@nestjs/common";

import { TagService } from "@/routes/tag/tag.service";

@Controller("tag")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getAll() {
    return await this.tagService.getAll();
  }

  @Get(":name")
  async getByName(@Param("name") name: string) {
    return await this.tagService.getByName(name);
  }
}
