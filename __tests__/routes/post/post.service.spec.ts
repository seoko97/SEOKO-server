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

vi.mock("@/routes/post/post.repository");
vi.mock("@/routes/series/series.service");
vi.mock("@/routes/tag/tag.service");
vi.mock("@/common/decorators/transaction.decorator", () => ({
  Transactional: () => {
    return vi.fn();
  },
}));

const createQueryMock = (result: unknown) => ({
  populate: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(result) }),
  select: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(result) }),
});

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

    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(postRepository).toBeDefined();
    expect(postService).toBeDefined();
    expect(seriesService).toBeDefined();
    expect(tagService).toBeDefined();
  });

  describe("게시글 생성", () => {
    let postRepositoryCreateSpy: TestSpyInstance;
    let seriesServicePushPostSpy: TestSpyInstance;
    let tagServicePushPostIdInTagsSpy: TestSpyInstance;

    let POST;

    beforeEach(() => {
      POST = {
        ...POST_STUB,
        save: vi.fn().mockResolvedValue(POST_STUB),
        populate: vi.fn().mockResolvedValue(POST_STUB),
      };

      postRepositoryCreateSpy = vi.spyOn(postRepository, "create");
      seriesServicePushPostSpy = vi.spyOn(seriesService, "pushPostIdInSeries");
      tagServicePushPostIdInTagsSpy = vi.spyOn(tagService, "pushPostIdInTags");
    });

    it("성공", async () => {
      postRepositoryCreateSpy.mockResolvedValueOnce(POST);
      seriesServicePushPostSpy.mockResolvedValueOnce(SERIES_STUB);
      tagServicePushPostIdInTagsSpy.mockResolvedValueOnce([TAG_STUB]);

      const { tags, series, ...rest } = POST_CREATE_STUB;

      const post = await postService.create(POST_CREATE_STUB);

      expect(post).toEqual(POST);
      expect(postRepositoryCreateSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryCreateSpy).toHaveBeenCalledWith(rest);
      expect(seriesServicePushPostSpy).toHaveBeenCalledTimes(1);
      expect(seriesServicePushPostSpy).toHaveBeenCalledWith(series, POST._id);
      expect(tagServicePushPostIdInTagsSpy).toHaveBeenCalledTimes(1);
      expect(tagServicePushPostIdInTagsSpy).toHaveBeenCalledWith(tags, POST._id);
    });

    it("성공 - 태그, 시리즈 없을 때", async () => {
      postRepositoryCreateSpy.mockResolvedValueOnce(POST);

      const post = await postService.create(POST_CREATE_STUB_WITHOUT_TAGS_AND_SERIES);

      expect(post).toEqual(POST);
      expect(postRepositoryCreateSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryCreateSpy).toHaveBeenCalledWith(POST_CREATE_STUB_WITHOUT_TAGS_AND_SERIES);
      expect(seriesServicePushPostSpy).toHaveBeenCalledTimes(0);
      expect(tagServicePushPostIdInTagsSpy).toHaveBeenCalledTimes(0);
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

        expect(postRepositoryCreateSpy).toHaveBeenCalledTimes(1);
        expect(postRepositoryCreateSpy).toHaveBeenCalledWith(rest);

        expect(seriesServicePushPostSpy).toHaveBeenCalledTimes(0);
        expect(tagServicePushPostIdInTagsSpy).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe("게시글 수정", () => {
    const postId = POST_STUB._id;
    const nid = POST_STUB.nid;

    let postRepositoryGetOneSpy: TestSpyInstance;
    let postRepositoryUpdateSpy: TestSpyInstance;
    let postRepositoryPushTagsSpy: TestSpyInstance;
    let postRepositoryPullTagsSpy: TestSpyInstance;
    let tagServicePushPostIdInTagsSpy: TestSpyInstance;
    let tagServicePullPostIdInTagsSpy: TestSpyInstance;
    let seriesServicePushPostIdSpy: TestSpyInstance;
    let seriesServicePullPostIdSpy: TestSpyInstance;

    beforeEach(() => {
      postRepositoryGetOneSpy = vi.spyOn(postRepository, "getOne");
      postRepositoryUpdateSpy = vi.spyOn(postRepository, "update");
      postRepositoryPushTagsSpy = vi.spyOn(postRepository, "pushTags");
      postRepositoryPullTagsSpy = vi.spyOn(postRepository, "pullTags");
      tagServicePushPostIdInTagsSpy = vi.spyOn(tagService, "pushPostIdInTags");
      tagServicePullPostIdInTagsSpy = vi.spyOn(tagService, "pullPostIdInTags");
      seriesServicePushPostIdSpy = vi.spyOn(seriesService, "pushPostIdInSeries");
      seriesServicePullPostIdSpy = vi.spyOn(seriesService, "pullPostIdInSeries");
    });

    it("성공", async () => {
      const POST = { ...POST_STUB };

      postRepositoryGetOneSpy.mockReturnValueOnce(createQueryMock(POST));
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
      expect(postRepositoryGetOneSpy).toHaveBeenCalledTimes(2);
      expect(postRepositoryGetOneSpy).toHaveBeenCalledWith({ nid });
      expect(postRepositoryGetOneSpy).toHaveBeenCalledWith({ nid });

      expect(postRepositoryUpdateSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryUpdateSpy).toHaveBeenCalledWith(postId, { ...rest, series: SERIES_STUB._id });

      expect(postRepositoryPushTagsSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryPushTagsSpy).toHaveBeenCalledWith(postId, [TAG_STUB]);

      expect(postRepositoryPullTagsSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryPullTagsSpy).toHaveBeenCalledWith(postId, [TAG_STUB]);

      expect(tagServicePushPostIdInTagsSpy).toHaveBeenCalledTimes(1);
      expect(tagServicePushPostIdInTagsSpy).toHaveBeenCalledWith(addTags, postId);

      expect(tagServicePullPostIdInTagsSpy).toHaveBeenCalledTimes(1);
      expect(tagServicePullPostIdInTagsSpy).toHaveBeenCalledWith(deleteTags, postId);

      expect(seriesServicePushPostIdSpy).toHaveBeenCalledTimes(1);
      expect(seriesServicePushPostIdSpy).toHaveBeenCalledWith(POST_UPDATE_STUB.series, postId);

      expect(seriesServicePullPostIdSpy).toHaveBeenCalledTimes(1);
      expect(seriesServicePullPostIdSpy).toHaveBeenCalledWith(POST_STUB.series.name, postId);
    });

    it("실패 - 존재하지 않는 게시글", async () => {
      postRepositoryGetOneSpy.mockReturnValueOnce(createQueryMock(null));

      await expect(postService.update(nid, { ...POST_UPDATE_STUB })).rejects.toThrow();

      expect(postRepositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryGetOneSpy).toHaveBeenCalledWith({ nid });
      expect(postRepositoryUpdateSpy).toHaveBeenCalledTimes(0);
      expect(postRepositoryPushTagsSpy).toHaveBeenCalledTimes(0);
      expect(postRepositoryPullTagsSpy).toHaveBeenCalledTimes(0);
      expect(tagServicePushPostIdInTagsSpy).toHaveBeenCalledTimes(0);
      expect(tagServicePullPostIdInTagsSpy).toHaveBeenCalledTimes(0);
      expect(seriesServicePushPostIdSpy).toHaveBeenCalledTimes(0);
      expect(seriesServicePullPostIdSpy).toHaveBeenCalledTimes(0);
    });

    it("실패 - 업데이트시 에러 발생", async () => {
      const POST = { ...POST_STUB };

      POST.series = null;

      const POST_UPDATE = { ...POST_UPDATE_STUB };
      POST_UPDATE.series = null;

      const { deleteTags: _, addTags: __, ...rest } = POST_UPDATE;

      postRepositoryGetOneSpy.mockReturnValueOnce(createQueryMock(POST));
      postRepositoryUpdateSpy.mockRejectedValueOnce(new Error(POST_ERROR.FAIL_UPDATE));

      try {
        await postService.update(nid, POST_UPDATE);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.status).toEqual(400);
        expect(e.message).toEqual(POST_ERROR.FAIL_UPDATE);

        expect(postRepositoryGetOneSpy).toHaveBeenCalledTimes(1);
        expect(postRepositoryGetOneSpy).toHaveBeenCalledWith({ nid });

        expect(postRepositoryUpdateSpy).toHaveBeenCalledTimes(1);
        expect(postRepositoryUpdateSpy).toHaveBeenCalledWith(postId, rest);

        expect(postRepositoryPushTagsSpy).toHaveBeenCalledTimes(0);
        expect(postRepositoryPullTagsSpy).toHaveBeenCalledTimes(0);
        expect(tagServicePushPostIdInTagsSpy).toHaveBeenCalledTimes(0);
        expect(tagServicePullPostIdInTagsSpy).toHaveBeenCalledTimes(0);
        expect(seriesServicePushPostIdSpy).toHaveBeenCalledTimes(0);
        expect(seriesServicePullPostIdSpy).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe("게시글 삭제", () => {
    const postId = POST_STUB._id;
    const nid = POST_STUB.nid;

    let postRepositoryGetOneSpy: TestSpyInstance;
    let postRepositoryDeleteSpy: TestSpyInstance;
    let seriesServicePullPostIdSpy: TestSpyInstance;
    let tagServicePullPostIdInTagsSpy: TestSpyInstance;

    beforeEach(() => {
      postRepositoryGetOneSpy = vi.spyOn(postRepository, "getOne");
      postRepositoryDeleteSpy = vi.spyOn(postRepository, "delete");
      seriesServicePullPostIdSpy = vi.spyOn(seriesService, "pullPostIdInSeries");
      tagServicePullPostIdInTagsSpy = vi.spyOn(tagService, "pullPostIdInTags");
    });

    it("성공", async () => {
      const POST = { ...POST_STUB };

      postRepositoryGetOneSpy.mockReturnValueOnce(createQueryMock(POST));
      postRepositoryDeleteSpy.mockResolvedValueOnce(undefined);
      seriesServicePullPostIdSpy.mockResolvedValueOnce(undefined);
      tagServicePullPostIdInTagsSpy.mockResolvedValueOnce(undefined);

      await postService.delete(nid);

      expect(postRepositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryGetOneSpy).toHaveBeenCalledWith({ nid });

      expect(postRepositoryDeleteSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryDeleteSpy).toHaveBeenCalledWith(postId);

      expect(seriesServicePullPostIdSpy).toHaveBeenCalledTimes(1);
      expect(seriesServicePullPostIdSpy).toHaveBeenCalledWith(POST.series.name, postId);

      expect(tagServicePullPostIdInTagsSpy).toHaveBeenCalledTimes(1);
      expect(tagServicePullPostIdInTagsSpy).toHaveBeenCalledWith(
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

    let postRepositoryGetOneSpy: TestSpyInstance;

    beforeEach(() => {
      postRepositoryGetOneSpy = vi.spyOn(postRepository, "getOne");
    });

    it("증가", async () => {
      const postRepositoryIncreaseLikeSpy: TestSpyInstance = vi.spyOn(
        postRepository,
        "increaseToLikes",
      );
      const postRepositoryGetOneSpy: TestSpyInstance = vi.spyOn(postRepository, "getOne");

      postRepositoryGetOneSpy.mockResolvedValueOnce(POST_TO_RESULT);
      postRepositoryGetOneSpy.mockReturnValueOnce(createQueryMock(POST));
      postRepositoryIncreaseLikeSpy.mockResolvedValueOnce(undefined);

      const projection = { ...POST_FIND_PROJECTION, isLiked: { $in: ["ip", "$likes"] } };

      await postService.increaseToLikes(nid, "ip");

      expect(postRepositoryIncreaseLikeSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryIncreaseLikeSpy).toHaveBeenCalledWith(nid, "ip");
      expect(postRepositoryGetOneSpy).toHaveBeenCalledTimes(2);
      expect(postRepositoryGetOneSpy).toHaveBeenCalledWith({ nid });
      expect(postRepositoryGetOneSpy).toHaveBeenCalledWith({ nid });
    });

    it("감소", async () => {
      const postRepositoryDecreaseLikeSpy: TestSpyInstance = vi.spyOn(
        postRepository,
        "decreaseToLikes",
      );

      postRepositoryDecreaseLikeSpy.mockResolvedValueOnce(undefined);
      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);

      await postService.decreaseToLikes(nid, "ip");

      expect(postRepositoryDecreaseLikeSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryDecreaseLikeSpy).toHaveBeenCalledWith(nid, "ip");
      expect(postRepositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryGetOneSpy).toHaveBeenCalledWith({ nid });
    });
  });

  describe("게시글 조회수", () => {
    const nid = POST_STUB.nid;
    const POST = { ...POST_STUB };

    it("증가", async () => {
      const postRepositoryIncreaseViewsSpy: TestSpyInstance = vi.spyOn(
        postRepository,
        "increaseToViews",
      );
      const postRepositoryGetOneSpy: TestSpyInstance = vi.spyOn(postRepository, "getOne");

      postRepositoryIncreaseViewsSpy.mockResolvedValueOnce(undefined);
      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);

      await postService.increaseToViews(nid, "ip");

      expect(postRepositoryIncreaseViewsSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryIncreaseViewsSpy).toHaveBeenCalledWith(nid, "ip");
      expect(postRepositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryGetOneSpy).toHaveBeenCalledWith({ nid });
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

    let postRepositoryGetAllSpy: TestSpyInstance;

    beforeEach(() => {
      postRepositoryGetAllSpy = vi.spyOn(postRepository, "getAll");
      postRepositoryGetAllSpy.mockResolvedValueOnce(POSTS);
    });

    it("성공", async () => {
      const posts = await postService.getAll({});

      expect(posts).toEqual(POSTS);
      expect(postRepositoryGetAllSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryGetAllSpy).toHaveBeenCalledWith({}, POST_FIND_PROJECTION, BASE_OPTIONS);
    });

    it("성공 - 텍스트", async () => {
      const dto = {
        text: "text",
      };
      const filter = filterQueryByPosts(dto);

      const posts = await postService.getAll(dto);

      expect(posts).toEqual(POSTS);
      expect(postRepositoryGetAllSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryGetAllSpy).toHaveBeenCalledWith(filter, POST_FIND_PROJECTION, BASE_OPTIONS);
    });

    it("성공 - 시리즈/태그", async () => {
      const dto = {
        series: POST_STUB.series.name,
        tag: TAG_STUB.name,
      };

      const filter = filterQueryByPosts(dto);

      const posts = await postService.getAll(dto);

      expect(posts).toEqual(POSTS);
      expect(postRepositoryGetAllSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryGetAllSpy).toHaveBeenCalledWith(filter, POST_FIND_PROJECTION, BASE_OPTIONS);
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
      expect(postRepositoryGetAllSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryGetAllSpy).toHaveBeenCalledWith(filter, POST_FIND_PROJECTION, options);
    });
  });

  describe("게시글 조회", () => {
    const POST = { ...POST_STUB };

    it("성공 - 숫자 id로 조회", async () => {
      const postRepositoryGetOneSpy: TestSpyInstance = vi.spyOn(postRepository, "getOne");
      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);

      const projection = { ...POST_FIND_PROJECTION, isLiked: { $in: ["ip", "$likes"] } };
      const options = { populate: ["tags", "series"] };

      const post = await postService.getByNumId(POST.nid, "ip");

      expect(post).toEqual(POST);
      expect(postRepositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryGetOneSpy).toHaveBeenCalledWith({ nid: POST.nid }, projection, options);
    });

    it("성공 - Object id로 조회", async () => {
      const postRepositoryGetByIdSpy: TestSpyInstance = vi.spyOn(postRepository, "getById");
      postRepositoryGetByIdSpy.mockReturnValueOnce({ populate: vi.fn().mockResolvedValue(POST) });

      const post = await postService.getById(POST._id);

      expect(post).toEqual(POST);
      expect(postRepositoryGetByIdSpy).toHaveBeenCalledTimes(1);
      expect(postRepositoryGetByIdSpy).toHaveBeenCalledWith(POST._id, POST_FIND_PROJECTION);
    });

    it("성공 - 특정 게시글을 기준으로 이전/다음 게시글 조회", async () => {
      const postRepositoryGetOneSpy: TestSpyInstance = vi.spyOn(postRepository, "getOne");
      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);
      postRepositoryGetOneSpy.mockResolvedValueOnce(POST);

      const projection = { _id: 1, nid: 1, title: 1 };

      const post = await postService.getSibling(POST.nid);

      expect(post).toEqual({ prev: POST, next: POST });
      expect(postRepositoryGetOneSpy).toHaveBeenCalledTimes(2);
      expect(postRepositoryGetOneSpy).toHaveBeenCalledWith({ nid: { $lt: POST.nid } }, projection, {
        sort: { nid: -1 },
      });
      expect(postRepositoryGetOneSpy).toHaveBeenCalledWith({ nid: { $gt: POST.nid } }, projection);
    });
  });
});
