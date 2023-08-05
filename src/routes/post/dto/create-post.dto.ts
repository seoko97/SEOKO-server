import { PickType } from "@nestjs/mapped-types";

import { IsArray, IsString } from "class-validator";

import { Post } from "@/routes/post/post.schema";

export class CreatePostDto extends PickType(Post, ["title", "content", "thumbnail"]) {
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsString()
  series?: string;
}
