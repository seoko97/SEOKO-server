import { Test, TestingModule } from "@nestjs/testing";

import { TAG_STUB } from "test/utils/stub";

import { TagRepository } from "@/routes/tag/tag.repository";
import { TagService } from "@/routes/tag/tag.service";

jest.mock("@/routes/tag/tag.repository");

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
      const repositoryGetAllSpy: jest.SpyInstance = jest.spyOn(repository, "getAll");
      repositoryGetAllSpy.mockResolvedValueOnce([TAG_STUB]);

      const tags = await service.getAll();

      expect(tags).toEqual([TAG_STUB]);
      expect(repositoryGetAllSpy).toHaveBeenCalled();
      expect(repositoryGetAllSpy).toHaveBeenCalledTimes(1);
    });

    it("태그 이름으로 조회", async () => {
      const repositoryGetByNameSpy: jest.SpyInstance = jest.spyOn(repository, "getByName");
      repositoryGetByNameSpy.mockResolvedValueOnce(TAG_STUB);

      const tag = await service.getByName(TAG_STUB.name);

      expect(tag).toEqual(TAG_STUB);
      expect(repositoryGetByNameSpy).toHaveBeenCalled();
      expect(repositoryGetByNameSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetByNameSpy).toHaveBeenCalledWith(TAG_STUB.name);
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

      const tags = await service.pushPostIdInTagNames([TAG_STUB.name], TAG_STUB.posts[0]._id);

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
      const repositoryPullPostIdInTagNamesSpy: jest.SpyInstance = jest.spyOn(
        repository,
        "pullPostIdInTagNames",
      );
      const repositoryGetAllByTagNamesSpy: jest.SpyInstance = jest.spyOn(
        repository,
        "getAllByTagNames",
      );
      repositoryPullPostIdInTagNamesSpy.mockResolvedValueOnce(true);
      repositoryGetAllByTagNamesSpy.mockResolvedValueOnce([TAG_STUB]);

      const tags = await service.pullPostIdInTagNames([TAG_STUB.name], TAG_STUB.posts[0]._id);

      expect(tags).toEqual([TAG_STUB]);

      expect(repositoryPullPostIdInTagNamesSpy).toHaveBeenCalled();
      expect(repositoryPullPostIdInTagNamesSpy).toHaveBeenCalledTimes(1);
      expect(repositoryPullPostIdInTagNamesSpy).toHaveBeenCalledWith(
        [TAG_STUB.name],
        TAG_STUB.posts[0]._id,
      );

      expect(repositoryGetAllByTagNamesSpy).toHaveBeenCalled();
      expect(repositoryGetAllByTagNamesSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetAllByTagNamesSpy).toHaveBeenCalledWith([TAG_STUB.name]);
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
