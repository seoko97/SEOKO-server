import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SequenceModule } from "@/common/sequence/sequence.module";
import { PostModule } from "@/routes/post/post.module";
import { SeriesRepository } from "@/routes/series/series.repository";
import { Series, SeriesSchema } from "@/routes/series/series.schema";

import { SeriesController } from "./series.controller";
import { SeriesService } from "./series.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Series.name, schema: SeriesSchema }]),
    forwardRef(() => PostModule),
    SequenceModule,
  ],
  providers: [SeriesService, SeriesRepository],
  controllers: [SeriesController],
  exports: [SeriesService],
})
export class SeriesModule {}
