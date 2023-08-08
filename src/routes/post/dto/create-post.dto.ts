import { PickType } from "@nestjs/mapped-types";

import { IsArray, IsString } from "class-validator";

import { IsOptionalCustom } from "@/common/decorators/is-optional.decorator";
import { Post } from "@/routes/post/post.schema";

export class CreatePostDto extends PickType(Post, ["title", "content", "thumbnail"]) {
  @IsOptionalCustom(IsArray(), IsString({ each: true }))
  tags?: string[];

  @IsOptionalCustom(IsString())
  series?: string;
}
