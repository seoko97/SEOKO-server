import { PartialType } from "@nestjs/mapped-types";

import { IsString } from "class-validator";

import { CreateSeriesDto } from "@/routes/series/dto/create-series.dto";

export class UpdateSeriesDto extends PartialType(CreateSeriesDto) {}

export class UpdateSeriesToPushPostDto {
  @IsString()
  postId!: string;
}
