import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SequenceModule } from "@/common/sequence/sequence.module";
import { TagController } from "@/routes/tag/tag.controller";
import { TagRepository } from "@/routes/tag/tag.repository";
import { Tag, TagSchema } from "@/routes/tag/tag.schema";
import { TagService } from "@/routes/tag/tag.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]), SequenceModule],
  controllers: [TagController],
  providers: [TagService, TagRepository],
  exports: [TagService, TagRepository],
})
export class TagModule {}
