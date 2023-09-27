import { PickType } from "@nestjs/mapped-types";

import { Experience } from "@/routes/experience/experience.schema";

export class CreateExperienceDto extends PickType(Experience, [
  "title",
  "description",
  "start",
  "end",
]) {}
