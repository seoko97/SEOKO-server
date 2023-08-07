import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { PostService } from "@/routes/post/post.service";
import { CreateSeriesDto } from "@/routes/series/dto/create-series.dto";
import { UpdateSeriesDtoWithId } from "@/routes/series/dto/update-series.dto";
import { SeriesRepository } from "@/routes/series/series.repository";
import { SERIES_ERROR } from "@/utils/constants";

@Injectable()
export class SeriesService {
  constructor(
    private readonly seriesRepository: SeriesRepository,
    private readonly postService: PostService,
  ) {}

  async create(createSeriesDto: CreateSeriesDto) {
    const { name } = createSeriesDto;

    const prevSeries = await this.seriesRepository.getByName(name);

    if (prevSeries) {
      throw new BadRequestException(SERIES_ERROR.ALREADY_EXISTS);
    }

    return this.seriesRepository.create(createSeriesDto);
  }

  async update(updateSeriesDto: UpdateSeriesDtoWithId) {
    await this.checkSeriesById(updateSeriesDto._id);

    await this.seriesRepository.update(updateSeriesDto);

    return this.seriesRepository.getById(updateSeriesDto._id);
  }

  async pushPostIdInSeries(name: string, postId: string) {
    const series = await this.seriesRepository.findOrCreate(name);

    await this.seriesRepository.pushPostIdInSeries(series._id, postId);

    return series;
  }

  async pullPostIdInSeries(name: string, postId: string) {
    const series = await this.seriesRepository.getByName(name);

    if (!series) {
      throw new BadRequestException(SERIES_ERROR.NOT_FOUND);
    }

    await this.seriesRepository.pullPostIdInSeries(series._id, postId);
  }

  async delete(_id: string) {
    await this.checkSeriesById(_id);

    await this.postService.deleteSeriesInPosts(_id);
    await this.seriesRepository.delete(_id);

    return true;
  }

  async getAll() {
    return this.seriesRepository.getAll();
  }

  async getByNumId(nid: number) {
    const series = await this.seriesRepository.getByNumId(nid);

    if (!series) {
      throw new NotFoundException(SERIES_ERROR.NOT_FOUND);
    }

    return series;
  }

  async checkSeriesById(_id: string) {
    const series = await this.seriesRepository.getById(_id);

    if (!series) {
      throw new BadRequestException(SERIES_ERROR.NOT_FOUND);
    }

    return true;
  }
}
