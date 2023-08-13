import { PartialType } from "@nestjs/mapped-types";

import { CreateExperienceDto } from "@/routes/experience/dto/create-experience.dto";

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}
