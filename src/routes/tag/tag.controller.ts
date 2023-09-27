import { Controller, Get, Param } from "@nestjs/common";

import { Public } from "@/common/decorators";
import { TagService } from "@/routes/tag/tag.service";

@Controller("tags")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @Get()
  async getAll() {
    return this.tagService.getAll();
  }

  @Public()
  @Get(":name")
  async getByName(@Param("name") name: string) {
    const tag = await this.tagService.getByName(name);

    return tag;
  }
}
