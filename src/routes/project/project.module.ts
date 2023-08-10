import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SequenceModule } from "@/common/sequence/sequence.module";
import { PostRepository } from "@/routes/post/post.repository";
import { Project, ProjectSchema } from "@/routes/project/project.schema";

import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    SequenceModule,
  ],
  providers: [ProjectService, PostRepository],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
