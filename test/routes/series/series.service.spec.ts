import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import {
  SERIES_CREATE_INPUT_STUB,
  SERIES_STUB,
  SERIES_STUB_WITHOUT_POSTS,
  SERIES_UPDATE_INPUT_STUB,
} from "test/utils/stub/series";

import { SeriesRepository } from "@/routes/series/series.repository";
import { SeriesService } from "@/routes/series/series.service";
import { SERIES_ERROR } from "@/utils/constants";

jest.mock("@/routes/series/series.repository");

describe("SeriesService", () => {
  let service: SeriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeriesService, SeriesRepository],
    }).compile();

    service = module.get<SeriesService>(SeriesService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("시리즈 생성", () => {
    let repositoryCreateSpy: jest.SpyInstance;
    let repositoryGetByNameSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryCreateSpy = jest.spyOn(SeriesRepository.prototype, "create");
      repositoryGetByNameSpy = jest.spyOn(SeriesRepository.prototype, "getByName");
    });

    it("성공", async () => {
      repositoryCreateSpy.mockImplementationOnce(() => SERIES_STUB_WITHOUT_POSTS);

      const series = await service.create(SERIES_CREATE_INPUT_STUB);

      expect(series).toEqual(SERIES_STUB_WITHOUT_POSTS);
      expect(repositoryCreateSpy).toBeCalledTimes(1);
      expect(repositoryCreateSpy).toBeCalledWith(SERIES_CREATE_INPUT_STUB);
      expect(repositoryGetByNameSpy).toBeCalledTimes(1);
      expect(repositoryGetByNameSpy).toBeCalledWith(SERIES_CREATE_INPUT_STUB.name);
    });

    describe("실패", () => {
      it("이미 존재하는 시리즈", async () => {
        repositoryGetByNameSpy.mockResolvedValueOnce(SERIES_STUB);

        try {
          await service.create(SERIES_CREATE_INPUT_STUB);
        } catch (e) {
          expect(e.status).toBe(400);
          expect(e.message).toBe(SERIES_ERROR.ALREADY_EXISTS);
          expect(e).toBeInstanceOf(BadRequestException);
          expect(repositoryCreateSpy).toBeCalledTimes(0);
          expect(repositoryGetByNameSpy).toBeCalledTimes(1);
          expect(repositoryGetByNameSpy).toBeCalledWith(SERIES_CREATE_INPUT_STUB.name);
        }
      });
    });
  });

  describe("시리즈 수정", () => {
    let repositoryUpdateSpy: jest.SpyInstance;
    let repositoryUpdateToPushPostSpy: jest.SpyInstance;
    let repositoryGetByIdSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryUpdateSpy = jest.spyOn(SeriesRepository.prototype, "update");
      repositoryUpdateToPushPostSpy = jest.spyOn(SeriesRepository.prototype, "updateToPushPost");
      repositoryGetByIdSpy = jest.spyOn(SeriesRepository.prototype, "getById");
    });

    describe("성공", () => {
      it("시리즈 전체 수정", async () => {
        repositoryGetByIdSpy.mockImplementationOnce(() => SERIES_STUB);
        repositoryGetByIdSpy.mockImplementationOnce(() => SERIES_STUB);
        repositoryUpdateSpy.mockImplementationOnce(() => SERIES_STUB);

        const series = await service.update(SERIES_UPDATE_INPUT_STUB);

        expect(series).toEqual(SERIES_STUB);
        expect(repositoryGetByIdSpy).toBeCalledTimes(2);
        expect(repositoryGetByIdSpy).toBeCalledWith(SERIES_STUB._id);
        expect(repositoryGetByIdSpy).toBeCalledWith(SERIES_STUB._id);
        expect(repositoryUpdateSpy).toBeCalledTimes(1);
        expect(repositoryUpdateSpy).toBeCalledWith(SERIES_UPDATE_INPUT_STUB);
      });

      it("시리즈에 게시글 추가", async () => {
        repositoryGetByIdSpy.mockImplementationOnce(() => SERIES_STUB);
        repositoryGetByIdSpy.mockImplementationOnce(() => SERIES_STUB);
        repositoryUpdateToPushPostSpy.mockImplementationOnce(() => SERIES_STUB);

        const series = await service.updateToPushPost(SERIES_STUB._id, SERIES_STUB.posts[0]._id);

        expect(series).toEqual(SERIES_STUB);
        expect(repositoryGetByIdSpy).toBeCalledTimes(2);
        expect(repositoryGetByIdSpy).toBeCalledWith(SERIES_STUB._id);
        expect(repositoryGetByIdSpy).toBeCalledWith(SERIES_STUB._id);
        expect(repositoryUpdateToPushPostSpy).toBeCalledTimes(1);
        expect(repositoryUpdateToPushPostSpy).toBeCalledWith(
          SERIES_STUB._id,
          SERIES_STUB.posts[0]._id,
        );
      });
    });

    describe("실패", () => {
      it("시리즈 전체 수정 - 존재하지 않는 시리즈", async () => {
        repositoryGetByIdSpy.mockResolvedValueOnce(null);

        try {
          await service.update(SERIES_STUB);
        } catch (e) {
          expect(e.status).toBe(400);
          expect(e.message).toBe(SERIES_ERROR.NOT_FOUND);
          expect(e).toBeInstanceOf(BadRequestException);

          expect(repositoryUpdateSpy).toBeCalledTimes(0);
          expect(repositoryGetByIdSpy).toBeCalledTimes(1);
          expect(repositoryGetByIdSpy).toBeCalledWith(SERIES_STUB._id);
        }
      });

      it("시리즈에 게시글 추가 - 존재하지 않는 시리즈", async () => {
        repositoryGetByIdSpy.mockResolvedValueOnce(null);

        try {
          await service.updateToPushPost(SERIES_STUB._id, SERIES_STUB.posts[0]._id);
        } catch (e) {
          expect(e.status).toBe(400);
          expect(e.message).toBe(SERIES_ERROR.NOT_FOUND);
          expect(e).toBeInstanceOf(BadRequestException);

          expect(repositoryUpdateToPushPostSpy).toBeCalledTimes(0);
          expect(repositoryGetByIdSpy).toBeCalledTimes(1);
          expect(repositoryGetByIdSpy).toBeCalledWith(SERIES_STUB._id);
        }
      });
    });
  });

  describe("시리즈 삭제", () => {
    let repositoryDeleteSpy: jest.SpyInstance;
    let repositoryGetByIdSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryDeleteSpy = jest.spyOn(SeriesRepository.prototype, "delete");
      repositoryGetByIdSpy = jest.spyOn(SeriesRepository.prototype, "getById");
    });

    it("성공", async () => {
      repositoryGetByIdSpy.mockImplementationOnce(() => SERIES_STUB);
      repositoryDeleteSpy.mockImplementationOnce(() => SERIES_STUB);

      const isCompleted = await service.delete(SERIES_STUB._id);

      expect(isCompleted).toEqual(true);
    });

    describe("실패", () => {
      it("존재하지 않는 시리즈", async () => {
        repositoryGetByIdSpy.mockResolvedValueOnce(null);

        try {
          await service.delete(SERIES_STUB._id);
        } catch (e) {
          expect(e.status).toBe(400);
          expect(e.message).toBe(SERIES_ERROR.NOT_FOUND);
          expect(e).toBeInstanceOf(BadRequestException);

          expect(repositoryDeleteSpy).toBeCalledTimes(0);
          expect(repositoryGetByIdSpy).toBeCalledTimes(1);
          expect(repositoryGetByIdSpy).toBeCalledWith(SERIES_STUB._id);
        }
      });
    });
  });

  describe("시리즈 조회", () => {
    // 전체 조회
    // number id를 통해 조회
    let repositoryGetByAllSpy: jest.SpyInstance;
    let repositoryGetByNumIdSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryGetByAllSpy = jest.spyOn(SeriesRepository.prototype, "getByAll");
      repositoryGetByNumIdSpy = jest.spyOn(SeriesRepository.prototype, "getByNumId");
    });

    describe("성공", () => {
      it("전체 조회", async () => {
        repositoryGetByAllSpy.mockImplementationOnce(() => [SERIES_STUB]);

        const series = await service.getByAll();

        expect(series).toEqual([SERIES_STUB]);
        expect(repositoryGetByAllSpy).toBeCalledTimes(1);
      });

      it("number id를 통해 조회", async () => {
        repositoryGetByNumIdSpy.mockImplementationOnce(() => SERIES_STUB);

        const series = await service.getByNumId(SERIES_STUB.nid);

        expect(series).toEqual(SERIES_STUB);
        expect(repositoryGetByNumIdSpy).toBeCalledTimes(1);
        expect(repositoryGetByNumIdSpy).toBeCalledWith(SERIES_STUB.nid);
      });
    });

    describe("실패", () => {
      it("number id를 통해 조회 - 존재하지 않는 시리즈", async () => {
        repositoryGetByNumIdSpy.mockResolvedValueOnce(null);

        try {
          await service.getByNumId(SERIES_STUB.nid);
        } catch (e) {
          expect(e.status).toBe(404);
          expect(e.message).toBe(SERIES_ERROR.NOT_FOUND);
          expect(e).toBeInstanceOf(NotFoundException);

          expect(repositoryGetByNumIdSpy).toBeCalledTimes(1);
          expect(repositoryGetByNumIdSpy).toBeCalledWith(SERIES_STUB.nid);
        }
      });
    });
  });
});
