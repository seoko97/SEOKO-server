import { PartialType } from "@nestjs/mapped-types";

import { CreateSkillDto } from "@/routes/skill/dto/create-skill.dto";

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}
