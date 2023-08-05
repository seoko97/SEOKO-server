import { applyDecorators } from "@nestjs/common";

import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export const IsOptionalCustom = (_decorator: PropertyDecorator) => {
  return applyDecorators(IsOptional(), IsNotEmpty(), _decorator);
};

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
