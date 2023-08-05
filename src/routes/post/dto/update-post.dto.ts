import { PickType } from "@nestjs/mapped-types";

import { IsArray, IsString } from "class-validator";

import { Post } from "@/routes/post/post.schema";

export class UpdatePostDto extends PickType(Post, ["_id", "title", "content", "thumbnail"]) {
  @IsString()
  series?: string;

  @IsArray()
  @IsString({ each: true })
  deleteTags?: string[];

  @IsArray()
  @IsString({ each: true })
  addTags?: string[];
}
