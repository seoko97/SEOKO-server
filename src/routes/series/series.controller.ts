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
    const series = await this.seriesService.getAll();

    return series;
  }

  @Public()
  @Get(":nid")
  async getSeriesByNumId(@Param("nid") nid: number) {
    const series = await this.seriesService.getByNumId(nid);

    return series;
  }

  @Patch(":_id")
  async updateSeries(@Param("_id") _id: string, @Body() updateSeriesDto: UpdateSeriesDto) {
    const series = await this.seriesService.update(_id, updateSeriesDto);

    return series;
  }

  @Delete(":_id")
  async deleteSeries(@Param("_id") _id: string) {
    await this.seriesService.delete(_id);

    return true;
  }
}
