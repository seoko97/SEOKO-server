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

vi.mock("@/routes/post/post.repository");
vi.mock("@/routes/series/series.repository");
vi.mock("@/common/decorators/transaction.decorator", () => ({
  Transactional: () => {
    return vi.fn();
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

    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("시리즈 생성", () => {
    let repositoryCreateSpy: TestSpyInstance;
    let repositoryGetOneSpy: TestSpyInstance;

    beforeEach(() => {
      repositoryCreateSpy = vi.spyOn(repository, "create");
      repositoryGetOneSpy = vi.spyOn(repository, "getOne");
    });

    it("성공", async () => {
      repositoryCreateSpy.mockResolvedValueOnce(SERIES_STUB_WITHOUT_POSTS);

      const series = await service.create(SERIES_CREATE_INPUT_STUB);

      expect(series).toEqual(SERIES_STUB_WITHOUT_POSTS);
      expect(repositoryCreateSpy).toHaveBeenCalledTimes(1);
      expect(repositoryCreateSpy).toHaveBeenCalledWith(SERIES_CREATE_INPUT_STUB);
      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith({ name: SERIES_CREATE_INPUT_STUB.name });
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
          expect(repositoryCreateSpy).toHaveBeenCalledTimes(0);
          expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
          expect(repositoryGetOneSpy).toHaveBeenCalledWith({ name: SERIES_CREATE_INPUT_STUB.name });
        }
      });
    });
  });

  describe("시리즈 전체 수정", () => {
    const nid = SERIES_STUB.nid;
    const _id = SERIES_STUB._id;
    const GET_ONE_ARGS = [{ nid }, SERIES_FIND_PROJECTION, SERIES_FIND_OPTIONS];

    let repositoryFindOneAndUpdateSpy: TestSpyInstance;
    let repositoryGetOneSpy: TestSpyInstance;

    beforeEach(() => {
      repositoryFindOneAndUpdateSpy = vi.spyOn(repository, "findOneAndUpdate");
      repositoryGetOneSpy = vi.spyOn(repository, "getOne");
    });

    it("성공", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(SERIES_STUB);
      repositoryFindOneAndUpdateSpy.mockResolvedValueOnce(SERIES_STUB);

      const series = await service.update(nid, SERIES_UPDATE_INPUT_STUB);

      expect(series).toEqual(SERIES_STUB);
      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith(...GET_ONE_ARGS);
      expect(repositoryFindOneAndUpdateSpy).toHaveBeenCalledTimes(1);
      expect(repositoryFindOneAndUpdateSpy).toHaveBeenCalledWith({ _id }, SERIES_UPDATE_INPUT_STUB);
    });

    it("실패", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(null);

      try {
        await service.update(nid, SERIES_STUB);
      } catch (e) {
        expect(e.status).toBe(404);
        expect(e.message).toBe(SERIES_ERROR.NOT_FOUND);
        expect(e).toBeInstanceOf(NotFoundException);

        expect(repositoryFindOneAndUpdateSpy).toHaveBeenCalledTimes(0);
        expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
        expect(repositoryGetOneSpy).toHaveBeenCalledWith(...GET_ONE_ARGS);
      }
    });
  });

  describe("시리즈 수정 - 게시글 추가", () => {
    let repositoryFindOrCreateSpy: TestSpyInstance;
    let repositoryPushPostId: TestSpyInstance;

    beforeEach(() => {
      repositoryFindOrCreateSpy = vi.spyOn(repository, "findOrCreate");
      repositoryPushPostId = vi.spyOn(repository, "pushPostIdInSeries");
    });

    it("성공", async () => {
      repositoryFindOrCreateSpy.mockResolvedValueOnce(SERIES_STUB);
      repositoryPushPostId.mockResolvedValueOnce(undefined);

      const seriesId = SERIES_STUB._id;
      const seriesName = SERIES_STUB.name;
      const postId = SERIES_STUB.posts[0]._id;

      const series = await service.pushPostIdInSeries(seriesName, postId);

      expect(series).toEqual(SERIES_STUB);
      expect(repositoryPushPostId).toHaveBeenCalledTimes(1);
      expect(repositoryPushPostId).toHaveBeenCalledWith(seriesId, postId);
      expect(repositoryFindOrCreateSpy).toHaveBeenCalledTimes(1);
      expect(repositoryFindOrCreateSpy).toHaveBeenCalledWith(seriesName);
    });
  });

  describe("시리즈 수정 - 게시글 제거", () => {
    let repositoryGetOneSpy: TestSpyInstance;
    let repositoryPullPostIdSpy: TestSpyInstance;

    beforeEach(() => {
      repositoryGetOneSpy = vi.spyOn(repository, "getOne");
      repositoryPullPostIdSpy = vi.spyOn(repository, "pullPostIdInSeries");
    });

    it("성공", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(SERIES_STUB);
      repositoryPullPostIdSpy.mockResolvedValueOnce(undefined);

      const seriesId = SERIES_STUB._id;
      const seriesName = SERIES_STUB.name;
      const postId = SERIES_STUB.posts[0]._id;

      await service.pullPostIdInSeries(seriesName, postId);

      expect(repositoryPullPostIdSpy).toHaveBeenCalledTimes(1);
      expect(repositoryPullPostIdSpy).toHaveBeenCalledWith(seriesId, postId);
      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith({ name: seriesName });
    });
  });

  describe("시리즈 삭제", () => {
    const nid = SERIES_STUB.nid;
    const GET_ONE_ARGS = [{ nid }, SERIES_FIND_PROJECTION, SERIES_FIND_OPTIONS];

    let postRepositoryDeleteSeriesSpy: TestSpyInstance;
    let repositoryDeleteSpy: TestSpyInstance;
    let repositoryGetOneSpy: TestSpyInstance;

    beforeEach(() => {
      postRepositoryDeleteSeriesSpy = vi.spyOn(postRepository, "deleteSeriesInPosts");
      repositoryDeleteSpy = vi.spyOn(repository, "delete");
      repositoryGetOneSpy = vi.spyOn(repository, "getOne");
    });

    it("성공", async () => {
      postRepositoryDeleteSeriesSpy.mockResolvedValueOnce(undefined);
      repositoryGetOneSpy.mockResolvedValueOnce(SERIES_STUB);
      repositoryDeleteSpy.mockResolvedValueOnce(SERIES_STUB);

      await service.delete(nid);

      expect(postRepositoryDeleteSeriesSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryDeleteSeriesSpy).toHaveBeenCalledWith(SERIES_STUB._id);

      expect(repositoryDeleteSpy).toHaveBeenCalledTimes(1);
      expect(repositoryDeleteSpy).toHaveBeenCalledWith(SERIES_STUB._id);

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith(...GET_ONE_ARGS);
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

          expect(repositoryDeleteSpy).toHaveBeenCalledTimes(0);
          expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
          expect(repositoryGetOneSpy).toHaveBeenCalledWith(...GET_ONE_ARGS);
        }
      });
    });
  });

  describe("시리즈 조회", () => {
    // 전체 조회
    // number id를 통해 조회
    const args = [{ nid: SERIES_STUB.nid }, SERIES_FIND_PROJECTION, SERIES_FIND_OPTIONS];

    let repositoryGetAllSpy: TestSpyInstance;
    let repositoryGetOneSpy: TestSpyInstance;

    beforeEach(() => {
      repositoryGetAllSpy = vi.spyOn(repository, "getAll");
      repositoryGetOneSpy = vi.spyOn(repository, "getOne");
    });

    describe("성공", () => {
      it("전체 조회", async () => {
        repositoryGetAllSpy.mockResolvedValueOnce([SERIES_STUB]);

        const series = await service.getAll();

        expect(series).toEqual([SERIES_STUB]);
        expect(repositoryGetAllSpy).toHaveBeenCalledTimes(1);
      });

      it("number id를 통해 조회", async () => {
        repositoryGetOneSpy.mockResolvedValueOnce(SERIES_STUB);

        const series = await service.getByNumId(SERIES_STUB.nid);

        expect(series).toEqual(SERIES_STUB);
        expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
        expect(repositoryGetOneSpy).toHaveBeenCalledWith(...args);
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

          expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
          expect(repositoryGetOneSpy).toHaveBeenCalledWith(...args);
        }
      });
    });
  });
});
