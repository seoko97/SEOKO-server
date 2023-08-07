import { PickType } from "@nestjs/mapped-types";

import { IsArray, IsString } from "class-validator";

import { IsOptionalCustom } from "@/common/decorators/is-optional.decorator";
import { Post } from "@/routes/post/post.schema";

export class UpdatePostDto extends PickType(Post, ["_id", "title", "content", "thumbnail"]) {
  @IsOptionalCustom(IsString())
  series?: string;

  @IsOptionalCustom(IsArray(), IsString({ each: true }))
  deleteTags?: string[];

  @IsOptionalCustom(IsArray(), IsString({ each: true }))
  addTags?: string[];
}
