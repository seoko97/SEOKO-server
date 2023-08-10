import { PickType } from "@nestjs/mapped-types";

import { Project } from "@/routes/project/project.schema";

export class CreateProjectDto extends PickType(Project, [
  "title",
  "description",
  "content",
  "thumbnail",
  "github",
  "start",
  "end",
]) {}
