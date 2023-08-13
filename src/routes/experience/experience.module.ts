import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SequenceModule } from "@/common/sequence/sequence.module";
import { ExperienceRepository } from "@/routes/experience/experience.repository";
import { Experience, ExperienceSchema } from "@/routes/experience/experience.schema";

import { ExperienceController } from "./experience.controller";
import { ExperienceService } from "./experience.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Experience.name, schema: ExperienceSchema }]),
    SequenceModule,
  ],
  providers: [ExperienceService, ExperienceRepository],
  controllers: [ExperienceController],
  exports: [ExperienceService],
})
export class ExperienceModule {}
