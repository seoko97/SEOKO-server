import { PickType } from "@nestjs/mapped-types";

import { Series } from "@/routes/series/series.schema";

export class CreateSeriesDto extends PickType(Series, ["name", "thumbnail"]) {}
