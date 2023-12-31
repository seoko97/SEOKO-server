import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import {
  POST_CREATE_STUB,
  POST_CREATE_STUB_WITHOUT_TAGS_AND_SERIES,
  POST_STUB,
  POST_UPDATE_STUB,
  SERIES_STUB,
  TAG_STUB,
} from "test/utils/stub";

import { PostRepository } from "@/routes/post/post.repository";
import { PostService } from "@/routes/post/post.service";
import { SeriesService } from "@/routes/series/series.service";
import { TagService } from "@/routes/tag/tag.service";
import { POST_ERROR, POST_FIND_PROJECTION } from "@/utils/constants";
import { filterQueryByPosts } from "@/utils/filterQueryByPosts";

jest.mock("@/routes/post/post.repository");
jest.mock("@/routes/series/series.service");
jest.mock("@/routes/tag/tag.service");
jest.mock("@/common/decorators/transaction.decorator", () => ({
  Transactional: () => {
    return jest.fn();
  },
}));

describe("PostService", () => {
  let postRepository: PostRepository;
  let postService: PostService;
  let seriesService: SeriesService;
  let tagService: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService, PostRepository, SeriesService, TagService],
    }).compile();

    postRepository = module.get<PostRepository>(PostRepository);
    postService = module.get<PostService>(PostService);
    seriesService = module.get<SeriesService>(SeriesService);
    tagService = module.get<TagService>(TagService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(postRepository).toBeDefined();
    expect(postService).toBeDefined();
    expect(seriesService).toBeDefined();
    expect(tagService).toBeDefined();
  });

  describe("게시글 생성", () => {
    let postRepositoryCreateSpy: jest.SpyInstance;
    let seriesServicePushPostSpy: jest.SpyInstance;
    let tagServicePushPostIdInTagsSpy: jest.SpyInstance;

    let POST;

    beforeEach(() => {
      POST = {
        ...POST_STUB,
        save: jest.fn().mockResolvedValue(POST_STUB),
        populate: jest.fn().mockResolvedValue(POST_STUB),
      };

      postRepositoryCreateSpy = jest.spyOn(postRepository, "create");
      seriesServicePushPostSpy = jest.spyOn(seriesService, "pushPostIdInSeries");
      tagServicePushPostIdInTagsSpy = jest.spyOn(tagService, "pushPostIdInTags");
    });

    it("성공", async () => {
      postRepositoryCreateSpy.mockResolvedValueOnce(POST);
      seriesServicePushPostSpy.mockResolvedValueOnce(SERIES_STUB);
      tagServicePushPostIdInTagsSpy.mockResolvedValueOnce([TAG_STUB]);

      const { tags, series, ...rest } = POST_CREATE_STUB;

      const post = await postService.create(POST_CREATE_STUB);

      expect(post).toEqual(POST);
      expect(postRepositoryCreateSpy).toBeCalledTimes(1);
      expect(postRepositoryCreateSpy).toBeCalledWith(rest);
      expect(seriesServicePushPostSpy).toBeCalledTimes(1);
      expect(seriesServicePushPostSpy).toBeCalledWith(series, POST._id);
      expect(tagServicePushPostIdInTagsSpy).toBeCalledTimes(1);
      expect(tagServicePushPostIdInTagsSpy).toBeCalledWith(tags, POST._id);
    });

    it("성공 - 태그, 시리즈 없을 때", async () => {
      postRepositoryCreateSpy.mockResolvedValueOnce(POST);

      const post = await postService.create(POST_CREATE_STUB_WITHOUT_TAGS_AND_SERIES);

      expect(post).toEqual(POST);
      expect(postRepositoryCreateSpy).toBeCalledTimes(1);
      expect(postRepositoryCreateSpy).toBeCalledWith(POST_CREATE_STUB_WITHOUT_TAGS_AND_SERIES);
      expect(seriesServicePushPostSpy).toBeCalledTimes(0);
      expect(tagServicePushPostIdInTagsSpy).toBeCalledTimes(0);
    });

    it("실패 - 이미 존재하는 게시글", async () => {
      postRepositoryCreateSpy.mockRejectedValueOnce(
        new BadRequestException(POST_ERROR.FAIL_CREATE),
      );

      const { tags: _, series: __, ...rest } = POST_CREATE_STUB;

      try {
        await postService.create(POST_CREATE_STUB);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toEqual(POST_ERROR.FAIL_CREATE);

        expect(postRepositoryCreateSpy).toBeCalledTimes(1);
        expect(postRepositoryCreateSpy).toBeCalledWith(rest);

        expect(seriesServicePushPostSpy).toBeCalledTimes(0);
        expect(tagServicePushPostIdInTagsSpy).toBeCalledTimes(0);
      }
    });
  });

  describe("게시글 수정", () => {
    const postId = POST_STUB._id;
    const nid = POST_STUB.nid;

    let postRepositoryGetOneSpy: jest.SpyInstance;
    let postRepositoryUpdateSpy: jest.SpyInstance;
    let postRepositoryPushTagsSpy: jest.SpyInstance;
    let postRepositoryPullTagsSpy: jest.SpyInstance;
    let tagServicePushPostIdInTagsSpy: jest.SpyInstance;
    let tagServicePullPostIdInTagsSpy: jest.SpyInstance;
    let seriesServicePushPostIdSpy: jest.SpyInstance;
    let seriesServicePullPostIdSpy: jest.SpyInstance;

    beforeEach(() => {
      postRepositoryGetOneSpy = jest.spyOn(postRepository, "getOne");
      postRepositoryUpdateSpy = jest.spyOn(postRepository, "update");
      postRepositoryPushTagsSpy = jest.spyOn(postRepository, "pushTags");
      postRepositoryPullTagsSpy = jest.spyOn(postRepository, "pullTags");
      tagServicePushPostIdInTagsSpy = jest.spyOn(tagService, "pushPostIdInTags");
      tagServicePullPostIdInTagsSpy = jest.spyOn(tagService, "pullPostIdInTags");
      seriesServicePushPostIdSpy = jest.spyOn(seriesService, "pushPostIdInSeries");
      seriesServicePullPostIdSpy = jest.spyOn(seriesService, "pullPostIdInSeries");
    });

    it("성공", async () => {
      const POST = { ...POST_STUB };

      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);
      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);
      postRepositoryUpdateSpy.mockResolvedValueOnce(POST);
      postRepositoryPushTagsSpy.mockResolvedValueOnce(undefined);
      postRepositoryPullTagsSpy.mockResolvedValueOnce(undefined);
      tagServicePushPostIdInTagsSpy.mockResolvedValueOnce([TAG_STUB]);
      tagServicePullPostIdInTagsSpy.mockResolvedValueOnce([TAG_STUB]);
      seriesServicePushPostIdSpy.mockResolvedValueOnce(SERIES_STUB);
      seriesServicePullPostIdSpy.mockResolvedValueOnce(undefined);

      const { deleteTags, addTags, ...rest } = POST_UPDATE_STUB;

      const post = await postService.update(nid, { ...POST_UPDATE_STUB });

      expect(post).toEqual(POST);
      expect(postRepositoryGetOneSpy).toBeCalledTimes(2);
      expect(postRepositoryGetOneSpy).toBeCalledWith({ nid });
      expect(postRepositoryGetOneSpy).toBeCalledWith({ nid });

      expect(postRepositoryUpdateSpy).toBeCalledTimes(1);
      expect(postRepositoryUpdateSpy).toBeCalledWith(postId, { ...rest, series: SERIES_STUB._id });

      expect(postRepositoryPushTagsSpy).toBeCalledTimes(1);
      expect(postRepositoryPushTagsSpy).toBeCalledWith(postId, [TAG_STUB]);

      expect(postRepositoryPullTagsSpy).toBeCalledTimes(1);
      expect(postRepositoryPullTagsSpy).toBeCalledWith(postId, [TAG_STUB]);

      expect(tagServicePushPostIdInTagsSpy).toBeCalledTimes(1);
      expect(tagServicePushPostIdInTagsSpy).toBeCalledWith(addTags, postId);

      expect(tagServicePullPostIdInTagsSpy).toBeCalledTimes(1);
      expect(tagServicePullPostIdInTagsSpy).toBeCalledWith(deleteTags, postId);

      expect(seriesServicePushPostIdSpy).toBeCalledTimes(1);
      expect(seriesServicePushPostIdSpy).toBeCalledWith(POST_UPDATE_STUB.series, postId);

      expect(seriesServicePullPostIdSpy).toBeCalledTimes(1);
      expect(seriesServicePullPostIdSpy).toBeCalledWith(POST_STUB.series.name, postId);
    });

    it("실패 - 존재하지 않는 게시글", async () => {
      postRepositoryGetOneSpy.mockResolvedValueOnce(null);

      await expect(postService.update(nid, { ...POST_UPDATE_STUB })).rejects.toThrowError();

      expect(postRepositoryGetOneSpy).toBeCalledTimes(1);
      expect(postRepositoryGetOneSpy).toBeCalledWith({ nid });
      expect(postRepositoryUpdateSpy).toBeCalledTimes(0);
      expect(postRepositoryPushTagsSpy).toBeCalledTimes(0);
      expect(postRepositoryPullTagsSpy).toBeCalledTimes(0);
      expect(tagServicePushPostIdInTagsSpy).toBeCalledTimes(0);
      expect(tagServicePullPostIdInTagsSpy).toBeCalledTimes(0);
      expect(seriesServicePushPostIdSpy).toBeCalledTimes(0);
      expect(seriesServicePullPostIdSpy).toBeCalledTimes(0);
    });

    it("실패 - 업데이트시 에러 발생", async () => {
      const POST = { ...POST_STUB };

      POST.series = null;

      const POST_UPDATE = { ...POST_UPDATE_STUB };
      POST_UPDATE.series = null;

      const { deleteTags: _, addTags: __, ...rest } = POST_UPDATE;

      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);
      postRepositoryUpdateSpy.mockRejectedValueOnce(new Error(POST_ERROR.FAIL_UPDATE));

      try {
        await postService.update(nid, POST_UPDATE);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.status).toEqual(400);
        expect(e.message).toEqual(POST_ERROR.FAIL_UPDATE);

        expect(postRepositoryGetOneSpy).toBeCalledTimes(1);
        expect(postRepositoryGetOneSpy).toBeCalledWith({ nid });

        expect(postRepositoryUpdateSpy).toBeCalledTimes(1);
        expect(postRepositoryUpdateSpy).toBeCalledWith(postId, rest);

        expect(postRepositoryPushTagsSpy).toBeCalledTimes(0);
        expect(postRepositoryPullTagsSpy).toBeCalledTimes(0);
        expect(tagServicePushPostIdInTagsSpy).toBeCalledTimes(0);
        expect(tagServicePullPostIdInTagsSpy).toBeCalledTimes(0);
        expect(seriesServicePushPostIdSpy).toBeCalledTimes(0);
        expect(seriesServicePullPostIdSpy).toBeCalledTimes(0);
      }
    });
  });

  describe("게시글 삭제", () => {
    const postId = POST_STUB._id;
    const nid = POST_STUB.nid;

    let postRepositoryGetOneSpy: jest.SpyInstance;
    let postRepositoryDeleteSpy: jest.SpyInstance;
    let seriesServicePullPostIdSpy: jest.SpyInstance;
    let tagServicePullPostIdInTagsSpy: jest.SpyInstance;

    beforeEach(() => {
      postRepositoryGetOneSpy = jest.spyOn(postRepository, "getOne");
      postRepositoryDeleteSpy = jest.spyOn(postRepository, "delete");
      seriesServicePullPostIdSpy = jest.spyOn(seriesService, "pullPostIdInSeries");
      tagServicePullPostIdInTagsSpy = jest.spyOn(tagService, "pullPostIdInTags");
    });

    it("성공", async () => {
      const POST = { ...POST_STUB };

      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);
      postRepositoryDeleteSpy.mockResolvedValueOnce(undefined);
      seriesServicePullPostIdSpy.mockResolvedValueOnce(undefined);
      tagServicePullPostIdInTagsSpy.mockResolvedValueOnce(undefined);

      await postService.delete(nid);

      expect(postRepositoryGetOneSpy).toBeCalledTimes(1);
      expect(postRepositoryGetOneSpy).toBeCalledWith({ nid }, {}, { populate: ["tags", "series"] });

      expect(postRepositoryDeleteSpy).toBeCalledTimes(1);
      expect(postRepositoryDeleteSpy).toBeCalledWith(postId);

      expect(seriesServicePullPostIdSpy).toBeCalledTimes(1);
      expect(seriesServicePullPostIdSpy).toBeCalledWith(POST.series.name, postId);

      expect(tagServicePullPostIdInTagsSpy).toBeCalledTimes(1);
      expect(tagServicePullPostIdInTagsSpy).toBeCalledWith(
        POST.tags.map((tag) => tag.name),
        postId,
      );
    });
  });

  describe("게시글 좋아요", () => {
    const nid = POST_STUB.nid;

    const POST = { ...POST_STUB };

    const POST_TO_RESULT = {
      ...POST,
      likeCount: 0,
      viewCount: 0,
      isLike: false,
    };

    let postRepositoryGetOneSpy: jest.SpyInstance;

    beforeEach(() => {
      postRepositoryGetOneSpy = jest.spyOn(postRepository, "getOne");
    });

    it("증가", async () => {
      const postRepositoryIncreaseLikeSpy: jest.SpyInstance = jest.spyOn(
        postRepository,
        "increaseToLikes",
      );
      const postRepositoryGetOneSpy: jest.SpyInstance = jest.spyOn(postRepository, "getOne");

      postRepositoryGetOneSpy.mockResolvedValueOnce(POST_TO_RESULT);
      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);
      postRepositoryIncreaseLikeSpy.mockResolvedValueOnce(undefined);

      const projection = { ...POST_FIND_PROJECTION, isLiked: { $in: ["ip", "$likes"] } };

      await postService.increaseToLikes(nid, "ip");

      expect(postRepositoryIncreaseLikeSpy).toBeCalledTimes(1);
      expect(postRepositoryIncreaseLikeSpy).toBeCalledWith(nid, "ip");
      expect(postRepositoryGetOneSpy).toBeCalledTimes(2);
      expect(postRepositoryGetOneSpy).toBeCalledWith({ nid });
      expect(postRepositoryGetOneSpy).toBeCalledWith({ nid }, projection);
    });

    it("감소", async () => {
      const postRepositoryDecreaseLikeSpy: jest.SpyInstance = jest.spyOn(
        postRepository,
        "decreaseToLikes",
      );

      postRepositoryDecreaseLikeSpy.mockResolvedValueOnce(undefined);
      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);

      await postService.decreaseToLikes(nid, "ip");

      expect(postRepositoryDecreaseLikeSpy).toBeCalledTimes(1);
      expect(postRepositoryDecreaseLikeSpy).toBeCalledWith(nid, "ip");
      expect(postRepositoryGetOneSpy).toBeCalledTimes(1);
      expect(postRepositoryGetOneSpy).toBeCalledWith({ nid });
    });
  });

  describe("게시글 조회수", () => {
    const nid = POST_STUB.nid;
    const POST = { ...POST_STUB };

    it("증가", async () => {
      const postRepositoryIncreaseViewsSpy: jest.SpyInstance = jest.spyOn(
        postRepository,
        "increaseToViews",
      );
      const postRepositoryGetOneSpy: jest.SpyInstance = jest.spyOn(postRepository, "getOne");

      postRepositoryIncreaseViewsSpy.mockResolvedValueOnce(undefined);
      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);

      await postService.increaseToViews(nid, "ip");

      expect(postRepositoryIncreaseViewsSpy).toBeCalledTimes(1);
      expect(postRepositoryIncreaseViewsSpy).toBeCalledWith(nid, "ip");
      expect(postRepositoryGetOneSpy).toBeCalledTimes(1);
      expect(postRepositoryGetOneSpy).toBeCalledWith({ nid });
    });
  });

  describe("게시글 전체 조회", () => {
    const POSTS = [POST_STUB];

    const BASE_OPTIONS = {
      sort: { _id: -1 },
      populate: ["tags", "series"],
      limit: 10,
      skip: 0,
    };

    let postRepositoryGetAllSpy: jest.SpyInstance;

    beforeEach(() => {
      postRepositoryGetAllSpy = jest.spyOn(postRepository, "getAll");
      postRepositoryGetAllSpy.mockResolvedValueOnce(POSTS);
    });

    it("성공", async () => {
      const posts = await postService.getAll({});

      expect(posts).toEqual(POSTS);
      expect(postRepositoryGetAllSpy).toBeCalledTimes(1);
      expect(postRepositoryGetAllSpy).toBeCalledWith({}, POST_FIND_PROJECTION, BASE_OPTIONS);
    });

    it("성공 - 텍스트", async () => {
      const dto = {
        text: "text",
      };
      const filter = filterQueryByPosts(dto);

      const posts = await postService.getAll(dto);

      expect(posts).toEqual(POSTS);
      expect(postRepositoryGetAllSpy).toBeCalledTimes(1);
      expect(postRepositoryGetAllSpy).toBeCalledWith(filter, POST_FIND_PROJECTION, BASE_OPTIONS);
    });

    it("성공 - 시리즈/태그", async () => {
      const dto = {
        series: POST_STUB.series.name,
        tag: TAG_STUB.name,
      };

      const filter = filterQueryByPosts(dto);

      const posts = await postService.getAll(dto);

      expect(posts).toEqual(POSTS);
      expect(postRepositoryGetAllSpy).toBeCalledTimes(1);
      expect(postRepositoryGetAllSpy).toBeCalledWith(filter, POST_FIND_PROJECTION, BASE_OPTIONS);
    });

    it("성공 - 텍스트/시리즈/태그/스킵/리미트", async () => {
      const dto = {
        text: "text",
        series: POST_STUB.series.name,
        tag: TAG_STUB.name,
        skip: 1000,
        limit: 1000,
      };

      const filter = filterQueryByPosts(dto);
      const options = {
        ...BASE_OPTIONS,
        skip: dto.skip,
        limit: dto.limit,
      };

      const posts = await postService.getAll(dto);

      expect(posts).toEqual(POSTS);
      expect(postRepositoryGetAllSpy).toBeCalledTimes(1);
      expect(postRepositoryGetAllSpy).toBeCalledWith(filter, POST_FIND_PROJECTION, options);
    });
  });

  describe("게시글 조회", () => {
    const POST = { ...POST_STUB };

    it("성공 - 숫자 id로 조회", async () => {
      const postRepositoryGetOneSpy: jest.SpyInstance = jest.spyOn(postRepository, "getOne");
      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);

      const projection = { ...POST_FIND_PROJECTION, isLiked: { $in: ["ip", "$likes"] } };
      const options = { populate: ["tags", "series"] };

      const post = await postService.getByNumId(POST.nid, "ip");

      expect(post).toEqual(POST);
      expect(postRepositoryGetOneSpy).toBeCalledTimes(1);
      expect(postRepositoryGetOneSpy).toBeCalledWith({ nid: POST.nid }, projection, options);
    });

    it("성공 - Object id로 조회", async () => {
      const postRepositoryGetByIdSpy: jest.SpyInstance = jest.spyOn(postRepository, "getById");
      postRepositoryGetByIdSpy.mockResolvedValueOnce(POST);

      const post = await postService.getById(POST._id);

      expect(post).toEqual(POST);
      expect(postRepositoryGetByIdSpy).toBeCalledTimes(1);
      expect(postRepositoryGetByIdSpy).toBeCalledWith(POST._id);
    });

    it("성공 - 특정 게시글을 기준으로 이전/다음 게시글 조회", async () => {
      const postRepositoryGetOneSpy: jest.SpyInstance = jest.spyOn(postRepository, "getOne");
      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);
      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);

      const projection = { _id: 1, nid: 1, title: 1 };

      const post = await postService.getSibling(POST.nid);

      expect(post).toEqual({ prev: POST, next: POST });
      expect(postRepositoryGetOneSpy).toBeCalledTimes(2);
      expect(postRepositoryGetOneSpy).toBeCalledWith({ nid: { $lt: POST.nid } }, projection, {
        sort: { nid: -1 },
      });
      expect(postRepositoryGetOneSpy).toBeCalledWith({ nid: { $gt: POST.nid } }, projection);
    });
  });
});
