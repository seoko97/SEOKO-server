import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { CreateSeriesDto } from "@/routes/series/dto/create-series.dto";
import { UpdateSeriesDtoWithId } from "@/routes/series/dto/update-series.dto";
import { SeriesRepository } from "@/routes/series/series.repository";
import { SERIES_ERROR } from "@/utils/constants";

@Injectable()
export class SeriesService {
  constructor(private readonly seriesRepository: SeriesRepository) {}

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

  async updateToPushPost(seriesId: string, postId: string) {
    await this.checkSeriesById(seriesId);

    await this.seriesRepository.updateToPushPost(seriesId, postId);

    return this.seriesRepository.getById(seriesId);
  }

  async delete(_id: string) {
    await this.checkSeriesById(_id);

    await this.seriesRepository.delete(_id);

    return true;
  }

  async getByAll() {
    return this.seriesRepository.getByAll();
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
