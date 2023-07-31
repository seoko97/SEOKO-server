import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Series, SeriesSchema } from "@/routes/series/series.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Series.name, schema: SeriesSchema }])],
})
export class SeriesModule {}
