import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";

import { Public } from "@/common/decorators";
import { UpdateSeriesDto } from "@/routes/series/dto/update-series.dto";
import { SeriesService } from "@/routes/series/series.service";

@Controller("series")
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Public()
  @Get()
  async getSeries() {
    return await this.seriesService.getByAll();
  }

  @Public()
  @Get(":numId")
  async getSeriesByNumId(@Param("numId") numId: string) {
    return await this.seriesService.getByNumId(Number(numId));
  }

  @Patch(":_id")
  async updateSeries(@Param("_id") _id: string, @Body() updateSeriesDto: UpdateSeriesDto) {
    const input = {
      ...updateSeriesDto,
      _id,
    };

    return await this.seriesService.update(input);
  }

  @Delete("_id")
  async deleteSeries(@Param("_id") _id: string) {
    return await this.seriesService.delete(_id);
  }
}
