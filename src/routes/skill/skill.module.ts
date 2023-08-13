import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SequenceModule } from "@/common/sequence/sequence.module";
import { SkillRepository } from "@/routes/skill/skill.repository";
import { Skill, SkillSchema } from "@/routes/skill/skill.schema";

import { SkillController } from "./skill.controller";
import { SkillService } from "./skill.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }]), SequenceModule],
  providers: [SkillService, SkillRepository],
  controllers: [SkillController],
  exports: [SkillService],
})
export class SkillModule {}
