import { PickType } from "@nestjs/mapped-types";

import { Skill } from "@/routes/skill/skill.schema";

export class CreateSkillDto extends PickType(Skill, ["name", "type", "icon"]) {}
