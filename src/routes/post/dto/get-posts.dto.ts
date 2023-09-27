import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

import { IsOptionalCustom } from "@/common/decorators/is-optional.decorator";

export class GetPostsDto {
  @IsOptionalCustom(IsString())
  series?: string;

  @Type(() => Number)
  @IsOptionalCustom(IsNumber())
  skip?: number;

  @Type(() => Number)
  @IsOptionalCustom(IsNumber())
  limit?: number;

  @Type(() => Number)
  @IsOptionalCustom(IsNumber())
  sort?: number;

  @IsOptionalCustom(IsString())
  tag?: string;

  @IsOptionalCustom(IsString())
  text?: string;
}
