import { CreateSkillDto } from "@/routes/skill/dto/create-skill.dto";
import { UpdateSkillDto } from "@/routes/skill/dto/update-skill.dto";
import { SkillDocument } from "@/routes/skill/skill.schema";
import { SkillType, TFilteredSkills } from "@/types";

const CREATE_SKILL_STUB: CreateSkillDto = {
  name: "test",
  type: SkillType.FRONT_END,
  icon: "test",
};

const UPDATE_SKILL_STUB: UpdateSkillDto = {
  ...CREATE_SKILL_STUB,
};

const SKILL_STUB = {
  _id: "test",
  ...CREATE_SKILL_STUB,
} as unknown as SkillDocument;

const SKILLS_STUB_BY_SKILL_TYPE = {
  [SkillType.FRONT_END]: [SKILL_STUB],
  [SkillType.BACK_END]: [SKILL_STUB],
  [SkillType.DEV_OPS]: [SKILL_STUB],
} as unknown as TFilteredSkills;

export { CREATE_SKILL_STUB, UPDATE_SKILL_STUB, SKILL_STUB, SKILLS_STUB_BY_SKILL_TYPE };
