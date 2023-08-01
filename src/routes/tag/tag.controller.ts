import { Controller, Get, Param } from "@nestjs/common";

import { TagService } from "@/routes/tag/tag.service";

@Controller("tags")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getAll() {
    return this.tagService.getAll();
  }

  @Get(":name")
  async getByName(@Param("name") name: string) {
    return this.tagService.getByName(name);
  }
}
