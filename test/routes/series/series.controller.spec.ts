import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { SERIES_STUB } from "test/utils/stub/series";

import { SeriesController } from "@/routes/series/series.controller";
import { SeriesService } from "@/routes/series/series.service";
import { SERIES_ERROR } from "@/utils/constants";

jest.mock("@/routes/series/series.service");

describe("SeriesController", () => {
  let controller: SeriesController;
  let service: SeriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeriesController],
      providers: [SeriesService],
    }).compile();

    controller = module.get<SeriesController>(SeriesController);
    service = module.get<SeriesService>(SeriesService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("모든 시리즈 정보 요청", () => {
    let serviceGetByAllSpy: jest.SpyInstance;

    beforeEach(() => {
      serviceGetByAllSpy = jest.spyOn(service, "getByAll");
    });

    it("성공", async () => {
      serviceGetByAllSpy.mockResolvedValueOnce([SERIES_STUB]);

      const series = await controller.getSeries();

      expect(series).toEqual([SERIES_STUB]);
      expect(serviceGetByAllSpy).toHaveBeenCalled();
      expect(serviceGetByAllSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("특정 시리즈 정보 요청", () => {
    let serviceGetByNumIdSpy: jest.SpyInstance;

    beforeEach(() => {
      serviceGetByNumIdSpy = jest.spyOn(service, "getByNumId");
    });

    it("성공", async () => {
      serviceGetByNumIdSpy.mockResolvedValueOnce(SERIES_STUB);

      const series = await controller.getSeriesByNumId("1");

      expect(series).toEqual(SERIES_STUB);
      expect(serviceGetByNumIdSpy).toHaveBeenCalled();
      expect(serviceGetByNumIdSpy).toHaveBeenCalledTimes(1);
    });

    it("실패 - 존재하지 않는 시리즈", async () => {
      serviceGetByNumIdSpy.mockRejectedValueOnce(new NotFoundException(SERIES_ERROR.NOT_FOUND));

      try {
        await controller.getSeriesByNumId("1");
      } catch (e) {
        expect(e.status).toBe(404);
        expect(e.message).toBe(SERIES_ERROR.NOT_FOUND);
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(serviceGetByNumIdSpy).toHaveBeenCalled();
      expect(serviceGetByNumIdSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("시리즈 정보 수정", () => {
    let serviceUpdateSpy: jest.SpyInstance;

    beforeEach(() => {
      serviceUpdateSpy = jest.spyOn(service, "update");
    });

    it("성공", async () => {
      serviceUpdateSpy.mockResolvedValueOnce(SERIES_STUB);

      const series = await controller.updateSeries("1", SERIES_STUB);

      expect(series).toEqual(SERIES_STUB);
      expect(serviceUpdateSpy).toHaveBeenCalled();
      expect(serviceUpdateSpy).toHaveBeenCalledTimes(1);
    });

    it("실패 - 존재하지 않는 시리즈", async () => {
      serviceUpdateSpy.mockRejectedValueOnce(new BadRequestException(SERIES_ERROR.NOT_FOUND));

      try {
        await controller.updateSeries("1", SERIES_STUB);
      } catch (e) {
        expect(e.status).toBe(400);
        expect(e.message).toBe(SERIES_ERROR.NOT_FOUND);
        expect(e).toBeInstanceOf(BadRequestException);
      }

      expect(serviceUpdateSpy).toHaveBeenCalled();
      expect(serviceUpdateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("시리즈 정보 삭제", () => {
    let serviceDeleteSpy: jest.SpyInstance;

    beforeEach(() => {
      serviceDeleteSpy = jest.spyOn(service, "delete");
    });

    it("성공", async () => {
      serviceDeleteSpy.mockResolvedValueOnce(SERIES_STUB);

      const series = await controller.deleteSeries("1");

      expect(series).toEqual(SERIES_STUB);
      expect(serviceDeleteSpy).toHaveBeenCalled();
      expect(serviceDeleteSpy).toHaveBeenCalledTimes(1);
    });

    it("실패 - 존재하지 않는 시리즈", async () => {
      serviceDeleteSpy.mockRejectedValueOnce(new BadRequestException(SERIES_ERROR.NOT_FOUND));

      try {
        await controller.deleteSeries("1");
      } catch (e) {
        expect(e.status).toBe(400);
        expect(e.message).toBe(SERIES_ERROR.NOT_FOUND);
        expect(e).toBeInstanceOf(BadRequestException);
      }

      expect(serviceDeleteSpy).toHaveBeenCalled();
      expect(serviceDeleteSpy).toHaveBeenCalledTimes(1);
    });
  });
});
