import { PartialType } from "@nestjs/mapped-types";

import { CreateSeriesDto } from "@/routes/series/dto/create-series.dto";

export class UpdateSeriesDto extends PartialType(CreateSeriesDto) {}
