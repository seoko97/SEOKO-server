import { SkillDocument } from "@/routes/skill/skill.schema";

enum SkillType {
  FRONT_END = "front",
  BACK_END = "back",
  DEV_OPS = "devops",
}

type TFilteredSkills = Record<SkillType, SkillDocument[]>;

export { SkillType, TFilteredSkills };
