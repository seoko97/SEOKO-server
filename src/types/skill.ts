import { SkillDocument } from "@/routes/skill/skill.schema";

enum SkillType {
  LANGUAGE = "language",
  FRONT_END = "front",
  BACK_END = "back",
  DEV_OPS = "devops",
}

type TFilteredSkills = Record<SkillType, SkillDocument[]>;

export { SkillType, TFilteredSkills };
