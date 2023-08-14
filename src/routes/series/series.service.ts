import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { Transactional } from "@/common/decorators/transaction.decorator";
import { PostRepository } from "@/routes/post/post.repository";
import { CreateSeriesDto } from "@/routes/series/dto/create-series.dto";
import { UpdateSeriesDto } from "@/routes/series/dto/update-series.dto";
import { SeriesRepository } from "@/routes/series/series.repository";
import { SERIES_ERROR, SERIES_FIND_OPTIONS, SERIES_FIND_PROJECTION } from "@/utils/constants";

@Injectable()
export class SeriesService {
  constructor(
    private readonly seriesRepository: SeriesRepository,
    private readonly postRepository: PostRepository,
  ) {}

  @Transactional()
  async create(createSeriesDto: CreateSeriesDto) {
    const { name } = createSeriesDto;

    const prevSeries = await this.seriesRepository.getOne({ name });

    if (prevSeries) {
      throw new BadRequestException(SERIES_ERROR.ALREADY_EXISTS);
    }

    return this.seriesRepository.create(createSeriesDto);
  }

  @Transactional()
  async update(_id: string, updateSeriesDto: UpdateSeriesDto) {
    await this.checkSeriesById(_id);

    return this.seriesRepository.findOneAndUpdate({ _id }, updateSeriesDto);
  }

  @Transactional()
  async pushPostIdInSeries(name: string, postId: string) {
    const series = await this.seriesRepository.findOrCreate(name);

    await this.seriesRepository.pushPostIdInSeries(series._id, postId);

    return series;
  }

  @Transactional()
  async pullPostIdInSeries(name: string, postId: string) {
    const series = await this.seriesRepository.getOne({ name });

    if (!series) {
      throw new BadRequestException(SERIES_ERROR.NOT_FOUND);
    }

    await this.seriesRepository.pullPostIdInSeries(series._id, postId);
  }

  @Transactional()
  async delete(_id: string) {
    await this.checkSeriesById(_id);

    await this.postRepository.deleteSeriesInPosts(_id);
    await this.seriesRepository.delete(_id);

    return true;
  }

  async getAll() {
    return this.seriesRepository.getAll();
  }

  async getByNumId(nid: number) {
    const series = await this.seriesRepository.getOne(
      { nid },
      SERIES_FIND_PROJECTION,
      SERIES_FIND_OPTIONS,
    );

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
