import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { BaseRepository } from "@/common/repository/base.repository";
import { SequenceRepository } from "@/common/sequence/sequence.repository";
import { Series, SeriesDocument, SeriesModel } from "@/routes/series/series.schema";
import { SERIES_FIND_PROJECTION } from "@/utils/constants";

@Injectable()
export class SeriesRepository extends BaseRepository<SeriesDocument> {
  constructor(
    @InjectModel(Series.name) private readonly seriesModel: SeriesModel,
    sequenceRepository: SequenceRepository,
  ) {
    super(seriesModel, sequenceRepository);
  }

  async pushPostIdInSeries(seriesId: string, postId: string) {
    return this.seriesModel.updateOne(
      {
        _id: seriesId,
        posts: { $nin: postId },
      },
      { $push: { posts: postId } },
    );
  }

  async pullPostIdInSeries(seriesId: string, postId: string) {
    return this.seriesModel.updateOne(
      {
        _id: seriesId,
        posts: { $in: [postId] },
      },
      { $pull: { posts: postId } },
    );
  }

  async getAll() {
    return this.seriesModel.find({}, { ...SERIES_FIND_PROJECTION, posts: 0 });
  }

  async getById(_id: string) {
    return this.seriesModel.findById(_id, SERIES_FIND_PROJECTION);
  }

  async findOrCreate(name: string) {
    const series = await this.getOne({ name });

    if (series) {
      return series;
    }

    return this.create({ name });
  }
}
