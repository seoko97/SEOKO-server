import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Post, PostSchema } from "@/routes/post/post.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
})
export class PostModule {}
