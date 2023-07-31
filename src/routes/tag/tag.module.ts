import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Tag, TagSchema } from "@/routes/tag/tag.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
})
export class TagModule {}
