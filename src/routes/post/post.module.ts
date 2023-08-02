import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SequenceModule } from "@/common/sequence/sequence.module";
import { PostRepository } from "@/routes/post/post.repository";
import { Post, PostSchema } from "@/routes/post/post.schema";
import { SeriesModule } from "@/routes/series/series.module";
import { TagModule } from "@/routes/tag/tag.module";

import { PostController } from "./post.controller";
import { PostService } from "./post.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    TagModule,
    SeriesModule,
    SequenceModule,
  ],
  providers: [PostService, PostRepository],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
