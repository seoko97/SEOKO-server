import { Body, Controller, Delete, Get, Param, Put } from "@nestjs/common";

import { Public } from "@/common/decorators";
import { UpdateSeriesDto } from "@/routes/series/dto/update-series.dto";
import { SeriesService } from "@/routes/series/series.service";

@Controller("series")
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Public()
  @Get()
  async getAll() {
    const series = await this.seriesService.getAll();

    return series;
  }

  @Public()
  @Get(":nid")
  async getByNumId(@Param("nid") nid: number) {
    const series = await this.seriesService.getByNumId(nid);

    return series;
  }

  @Put(":nid")
  async update(@Param("nid") nid: number, @Body() updateSeriesDto: UpdateSeriesDto) {
    const series = await this.seriesService.update(nid, updateSeriesDto);

    return series;
  }

  @Delete(":nid")
  async delete(@Param("nid") nid: number) {
    await this.seriesService.delete(nid);

    return true;
  }
}
