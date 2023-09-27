import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import {
  SERIES_CREATE_INPUT_STUB,
  SERIES_STUB,
  SERIES_STUB_WITHOUT_POSTS,
  SERIES_UPDATE_INPUT_STUB,
} from "test/utils/stub";

import { PostRepository } from "@/routes/post/post.repository";
import { SeriesRepository } from "@/routes/series/series.repository";
import { SeriesService } from "@/routes/series/series.service";
import { SERIES_ERROR, SERIES_FIND_OPTIONS, SERIES_FIND_PROJECTION } from "@/utils/constants";

jest.mock("@/routes/post/post.repository");
jest.mock("@/routes/series/series.repository");
jest.mock("@/common/decorators/transaction.decorator", () => ({
  Transactional: () => {
    return jest.fn();
  },
}));

describe("SeriesService", () => {
  let service: SeriesService;
  let postRepository: PostRepository;
  let repository: SeriesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeriesService, PostRepository, SeriesRepository],
    }).compile();

    service = module.get<SeriesService>(SeriesService);
    postRepository = module.get<PostRepository>(PostRepository);
    repository = module.get<SeriesRepository>(SeriesRepository);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("시리즈 생성", () => {
    let repositoryCreateSpy: jest.SpyInstance;
    let repositoryGetOneSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryCreateSpy = jest.spyOn(repository, "create");
      repositoryGetOneSpy = jest.spyOn(repository, "getOne");
    });

    it("성공", async () => {
      repositoryCreateSpy.mockResolvedValueOnce(SERIES_STUB_WITHOUT_POSTS);

      const series = await service.create(SERIES_CREATE_INPUT_STUB);

      expect(series).toEqual(SERIES_STUB_WITHOUT_POSTS);
      expect(repositoryCreateSpy).toBeCalledTimes(1);
      expect(repositoryCreateSpy).toBeCalledWith(SERIES_CREATE_INPUT_STUB);
      expect(repositoryGetOneSpy).toBeCalledTimes(1);
      expect(repositoryGetOneSpy).toBeCalledWith({ name: SERIES_CREATE_INPUT_STUB.name });
    });

    describe("실패", () => {
      it("이미 존재하는 시리즈", async () => {
        repositoryGetOneSpy.mockResolvedValueOnce(SERIES_STUB);

        try {
          await service.create(SERIES_CREATE_INPUT_STUB);
        } catch (e) {
          expect(e.status).toBe(400);
          expect(e.message).toBe(SERIES_ERROR.ALREADY_EXISTS);
          expect(e).toBeInstanceOf(BadRequestException);
          expect(repositoryCreateSpy).toBeCalledTimes(0);
          expect(repositoryGetOneSpy).toBeCalledTimes(1);
          expect(repositoryGetOneSpy).toBeCalledWith({ name: SERIES_CREATE_INPUT_STUB.name });
        }
      });
    });
  });

  describe("시리즈 전체 수정", () => {
    const nid = SERIES_STUB.nid;
    const _id = SERIES_STUB._id;
    const GET_ONE_ARGS = [{ nid }, SERIES_FIND_PROJECTION, SERIES_FIND_OPTIONS];

    let repositoryFindOneAndUpdateSpy: jest.SpyInstance;
    let repositoryGetOneSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryFindOneAndUpdateSpy = jest.spyOn(repository, "findOneAndUpdate");
      repositoryGetOneSpy = jest.spyOn(repository, "getOne");
    });

    it("성공", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(SERIES_STUB);
      repositoryFindOneAndUpdateSpy.mockResolvedValueOnce(SERIES_STUB);

      const series = await service.update(nid, SERIES_UPDATE_INPUT_STUB);

      expect(series).toEqual(SERIES_STUB);
      expect(repositoryGetOneSpy).toBeCalledTimes(1);
      expect(repositoryGetOneSpy).toBeCalledWith(...GET_ONE_ARGS);
      expect(repositoryFindOneAndUpdateSpy).toBeCalledTimes(1);
      expect(repositoryFindOneAndUpdateSpy).toBeCalledWith({ _id }, SERIES_UPDATE_INPUT_STUB);
    });

    it("실패", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(null);

      try {
        await service.update(nid, SERIES_STUB);
      } catch (e) {
        expect(e.status).toBe(404);
        expect(e.message).toBe(SERIES_ERROR.NOT_FOUND);
        expect(e).toBeInstanceOf(NotFoundException);

        expect(repositoryFindOneAndUpdateSpy).toBeCalledTimes(0);
        expect(repositoryGetOneSpy).toBeCalledTimes(1);
        expect(repositoryGetOneSpy).toBeCalledWith(...GET_ONE_ARGS);
      }
    });
  });

  describe("시리즈 수정 - 게시글 추가", () => {
    let repositoryFindOrCreateSpy: jest.SpyInstance;
    let repositoryPushPostId: jest.SpyInstance;

    beforeEach(() => {
      repositoryFindOrCreateSpy = jest.spyOn(repository, "findOrCreate");
      repositoryPushPostId = jest.spyOn(repository, "pushPostIdInSeries");
    });

    it("성공", async () => {
      repositoryFindOrCreateSpy.mockResolvedValueOnce(SERIES_STUB);
      repositoryPushPostId.mockResolvedValueOnce(undefined);

      const seriesId = SERIES_STUB._id;
      const seriesName = SERIES_STUB.name;
      const postId = SERIES_STUB.posts[0]._id;

      const series = await service.pushPostIdInSeries(seriesName, postId);

      expect(series).toEqual(SERIES_STUB);
      expect(repositoryPushPostId).toBeCalledTimes(1);
      expect(repositoryPushPostId).toBeCalledWith(seriesId, postId);
      expect(repositoryFindOrCreateSpy).toBeCalledTimes(1);
      expect(repositoryFindOrCreateSpy).toBeCalledWith(seriesName);
    });
  });

  describe("시리즈 수정 - 게시글 제거", () => {
    let repositoryGetOneSpy: jest.SpyInstance;
    let repositoryPullPostIdSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryGetOneSpy = jest.spyOn(repository, "getOne");
      repositoryPullPostIdSpy = jest.spyOn(repository, "pullPostIdInSeries");
    });

    it("성공", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(SERIES_STUB);
      repositoryPullPostIdSpy.mockResolvedValueOnce(undefined);

      const seriesId = SERIES_STUB._id;
      const seriesName = SERIES_STUB.name;
      const postId = SERIES_STUB.posts[0]._id;

      await service.pullPostIdInSeries(seriesName, postId);

      expect(repositoryPullPostIdSpy).toBeCalledTimes(1);
      expect(repositoryPullPostIdSpy).toBeCalledWith(seriesId, postId);
      expect(repositoryGetOneSpy).toBeCalledTimes(1);
      expect(repositoryGetOneSpy).toBeCalledWith({ name: seriesName });
    });
  });

  describe("시리즈 삭제", () => {
    const nid = SERIES_STUB.nid;
    const GET_ONE_ARGS = [{ nid }, SERIES_FIND_PROJECTION, SERIES_FIND_OPTIONS];

    let postRepositoryDeleteSeriesSpy: jest.SpyInstance;
    let repositoryDeleteSpy: jest.SpyInstance;
    let repositoryGetOneSpy: jest.SpyInstance;

    beforeEach(() => {
      postRepositoryDeleteSeriesSpy = jest.spyOn(postRepository, "deleteSeriesInPosts");
      repositoryDeleteSpy = jest.spyOn(repository, "delete");
      repositoryGetOneSpy = jest.spyOn(repository, "getOne");
    });

    it("성공", async () => {
      postRepositoryDeleteSeriesSpy.mockResolvedValueOnce(undefined);
      repositoryGetOneSpy.mockResolvedValueOnce(SERIES_STUB);
      repositoryDeleteSpy.mockResolvedValueOnce(SERIES_STUB);

      const isCompleted = await service.delete(nid);

      expect(isCompleted).toEqual(true);

      expect(postRepositoryDeleteSeriesSpy).toBeCalledTimes(1);
      expect(postRepositoryDeleteSeriesSpy).toBeCalledWith(SERIES_STUB._id);

      expect(repositoryDeleteSpy).toBeCalledTimes(1);
      expect(repositoryDeleteSpy).toBeCalledWith(SERIES_STUB._id);

      expect(repositoryGetOneSpy).toBeCalledTimes(1);
      expect(repositoryGetOneSpy).toBeCalledWith(...GET_ONE_ARGS);
    });

    describe("실패", () => {
      it("존재하지 않는 시리즈", async () => {
        repositoryGetOneSpy.mockResolvedValueOnce(null);

        try {
          await service.delete(nid);
        } catch (e) {
          expect(e.status).toBe(404);
          expect(e.message).toBe(SERIES_ERROR.NOT_FOUND);
          expect(e).toBeInstanceOf(NotFoundException);

          expect(repositoryDeleteSpy).toBeCalledTimes(0);
          expect(repositoryGetOneSpy).toBeCalledTimes(1);
          expect(repositoryGetOneSpy).toBeCalledWith(...GET_ONE_ARGS);
        }
      });
    });
  });

  describe("시리즈 조회", () => {
    // 전체 조회
    // number id를 통해 조회
    const args = [{ nid: SERIES_STUB.nid }, SERIES_FIND_PROJECTION, SERIES_FIND_OPTIONS];

    let repositoryGetAllSpy: jest.SpyInstance;
    let repositoryGetOneSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryGetAllSpy = jest.spyOn(repository, "getAll");
      repositoryGetOneSpy = jest.spyOn(repository, "getOne");
    });

    describe("성공", () => {
      it("전체 조회", async () => {
        repositoryGetAllSpy.mockResolvedValueOnce([SERIES_STUB]);

        const series = await service.getAll();

        expect(series).toEqual([SERIES_STUB]);
        expect(repositoryGetAllSpy).toBeCalledTimes(1);
      });

      it("number id를 통해 조회", async () => {
        repositoryGetOneSpy.mockResolvedValueOnce(SERIES_STUB);

        const series = await service.getByNumId(SERIES_STUB.nid);

        expect(series).toEqual(SERIES_STUB);
        expect(repositoryGetOneSpy).toBeCalledTimes(1);
        expect(repositoryGetOneSpy).toBeCalledWith(...args);
      });
    });

    describe("실패", () => {
      it("number id를 통해 조회 - 존재하지 않는 시리즈", async () => {
        repositoryGetOneSpy.mockResolvedValueOnce(null);

        try {
          await service.getByNumId(SERIES_STUB.nid);
        } catch (e) {
          expect(e.status).toBe(404);
          expect(e.message).toBe(SERIES_ERROR.NOT_FOUND);
          expect(e).toBeInstanceOf(NotFoundException);

          expect(repositoryGetOneSpy).toBeCalledTimes(1);
          expect(repositoryGetOneSpy).toBeCalledWith(...args);
        }
      });
    });
  });
});
