import { IsNumber, IsString } from "class-validator";

import { IsOptionalCustom } from "@/common/decorators/is-optional.decorator";

export class GetPostsDto {
  @IsOptionalCustom(IsString())
  series?: string;

  @IsOptionalCustom(IsNumber())
  offset?: number;

  @IsOptionalCustom(IsNumber())
  limit?: number;

  @IsOptionalCustom(IsString())
  tag?: string;

  @IsOptionalCustom(IsString())
  text?: string;
}
