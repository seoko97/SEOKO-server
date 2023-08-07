import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { SequenceRepository } from "@/common/sequence/sequence.repository";
import { CreateSeriesDto } from "@/routes/series/dto/create-series.dto";
import { UpdateSeriesDtoWithId } from "@/routes/series/dto/update-series.dto";
import { Series, SeriesModel } from "@/routes/series/series.schema";

@Injectable()
export class SeriesRepository {
  constructor(
    @InjectModel(Series.name) private readonly seriesModel: SeriesModel,
    private readonly sequenceRepository: SequenceRepository,
  ) {}

  async create(createSeriesDto: CreateSeriesDto) {
    const nid = await this.sequenceRepository.getNextSequence("series");

    return this.seriesModel.create({ nid, ...createSeriesDto });
  }

  async update(updateSeriesDto: UpdateSeriesDtoWithId) {
    const { _id, ...rest } = updateSeriesDto;

    return this.seriesModel.updateOne({ _id }, rest);
  }

  async pushPostIdInSeries(seriesId: string, postId: string) {
    return this.seriesModel.updateOne({ _id: seriesId }, { $push: { posts: postId } });
  }

  async pullPostIdInSeries(seriesId: string, postId: string) {
    return this.seriesModel.updateOne({ _id: seriesId }, { $pull: { posts: postId } });
  }

  async delete(_id: string) {
    return this.seriesModel.deleteOne({ _id });
  }

  async getAll() {
    return this.seriesModel.find({ postCount: { $gt: 0 } });
  }

  async getByNumId(nid: number) {
    return this.seriesModel.findOne({ nid });
  }

  async getById(_id: string) {
    return this.seriesModel.findById(_id);
  }

  async getByName(name: string) {
    return this.seriesModel.findOne({ name });
  }

  async findOrCreate(name: string) {
    const series = await this.getByName(name);

    if (series) {
      return series;
    }

    return this.create({ name });
  }
}
