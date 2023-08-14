import { Test, TestingModule } from "@nestjs/testing";

import { TAG_STUB } from "test/utils/stub";

import { TagRepository } from "@/routes/tag/tag.repository";
import { TagService } from "@/routes/tag/tag.service";

jest.mock("@/routes/tag/tag.repository");
jest.mock("@/common/decorators/transaction.decorator", () => ({
  Transactional: () => {
    return jest.fn();
  },
}));

describe("TagService", () => {
  let service: TagService;
  let repository: TagRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagService, TagRepository],
    }).compile();

    service = module.get<TagService>(TagService);
    repository = module.get<TagRepository>(TagRepository);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("태그 조회", () => {
    it("태그 전체 조회", async () => {
      const repositoryGetAllSpy: jest.SpyInstance = jest.spyOn(repository, "getAllToA");
      repositoryGetAllSpy.mockResolvedValueOnce([TAG_STUB]);

      const tags = await service.getAll();

      expect(tags).toEqual([TAG_STUB]);
      expect(repositoryGetAllSpy).toHaveBeenCalled();
      expect(repositoryGetAllSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetAllSpy).toHaveBeenCalledWith();
    });

    it("태그 이름으로 조회", async () => {
      const repositoryGetOneSpy: jest.SpyInstance = jest.spyOn(repository, "getOne");
      repositoryGetOneSpy.mockResolvedValueOnce(TAG_STUB);

      const tag = await service.getByName(TAG_STUB.name);

      expect(tag).toEqual(TAG_STUB);
      expect(repositoryGetOneSpy).toHaveBeenCalled();
      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith(
        { name: TAG_STUB.name },
        {},
        { populate: "posts" },
      );
    });
  });

  describe("태그에 게시글 추가", () => {
    it("성공", async () => {
      const repositoryFindOrCreateSpy: jest.SpyInstance = jest.spyOn(repository, "findOrCreate");
      const repositoryAddPostIdInTagsSpy: jest.SpyInstance = jest.spyOn(
        repository,
        "addPostIdInTags",
      );
      repositoryFindOrCreateSpy.mockResolvedValueOnce(TAG_STUB);
      repositoryAddPostIdInTagsSpy.mockResolvedValueOnce(TAG_STUB);

      const tags = await service.pushPostIdInTags([TAG_STUB.name], TAG_STUB.posts[0]._id);

      expect(tags).toEqual([TAG_STUB]);

      expect(repositoryFindOrCreateSpy).toHaveBeenCalled();
      expect(repositoryFindOrCreateSpy).toHaveBeenCalledTimes(1);
      expect(repositoryFindOrCreateSpy).toHaveBeenCalledWith(TAG_STUB.name);

      expect(repositoryAddPostIdInTagsSpy).toHaveBeenCalled();
      expect(repositoryAddPostIdInTagsSpy).toHaveBeenCalledTimes(1);
      expect(repositoryAddPostIdInTagsSpy).toHaveBeenCalledWith([TAG_STUB], TAG_STUB.posts[0]._id);
    });
  });

  describe("태그에 게시글 삭제", () => {
    it("태그 이름 배열을 받아 해당 이름과 일치하는 태그를 찾아 게시글 아이디를 삭제한다", async () => {
      const repositoryPullPostIdInTagsSpy: jest.SpyInstance = jest.spyOn(
        repository,
        "pullPostIdInTags",
      );
      const repositoryGetAllSpy: jest.SpyInstance = jest.spyOn(repository, "getAll");

      repositoryPullPostIdInTagsSpy.mockResolvedValueOnce(true);
      repositoryGetAllSpy.mockResolvedValueOnce([TAG_STUB]);

      const tags = await service.pullPostIdInTags([TAG_STUB.name], TAG_STUB.posts[0]._id);

      expect(tags).toEqual([TAG_STUB]);

      expect(repositoryPullPostIdInTagsSpy).toHaveBeenCalled();
      expect(repositoryPullPostIdInTagsSpy).toHaveBeenCalledTimes(1);
      expect(repositoryPullPostIdInTagsSpy).toHaveBeenCalledWith(
        [TAG_STUB.name],
        TAG_STUB.posts[0]._id,
      );

      expect(repositoryGetAllSpy).toHaveBeenCalled();
      expect(repositoryGetAllSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetAllSpy).toHaveBeenCalledWith({ name: { $in: [TAG_STUB.name] } });
    });

    it("게시글 아이디를 받아 해당 게시글을 가지고 있는 태그를 찾아 게시글 아이디를 삭제한다", async () => {
      const repositoryPullPostIdByPostIdSpy: jest.SpyInstance = jest.spyOn(
        repository,
        "pullPostIdByPostId",
      );
      repositoryPullPostIdByPostIdSpy.mockResolvedValueOnce(undefined);

      await service.pullPostIdByPostId(TAG_STUB.posts[0]._id);

      expect(repositoryPullPostIdByPostIdSpy).toHaveBeenCalled();
      expect(repositoryPullPostIdByPostIdSpy).toHaveBeenCalledTimes(1);
      expect(repositoryPullPostIdByPostIdSpy).toHaveBeenCalledWith(TAG_STUB.posts[0]._id);
    });
  });
});
