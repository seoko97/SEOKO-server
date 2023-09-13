import { Test, TestingModule } from "@nestjs/testing";

import { CREATE_PROJECT_STUB, PROJECT_STUB, UPDATE_PROJECT_STUB } from "test/utils/stub";

import { ProjectRepository } from "@/routes/project/project.repository";
import { ProjectService } from "@/routes/project/project.service";
import { PROJECT_ERROR } from "@/utils/constants";

jest.mock("@/routes/project/project.repository");

describe("ProjectService", () => {
  let service: ProjectService;
  let repository: ProjectRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService, ProjectRepository],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    repository = module.get<ProjectRepository>(ProjectRepository);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe("프로젝트 생성", () => {
    it("성공", async () => {
      const repositoryCreateSpy = jest
        .spyOn(repository, "create")
        .mockResolvedValueOnce(PROJECT_STUB);

      const result = await service.create(CREATE_PROJECT_STUB);

      expect(result).toEqual(PROJECT_STUB);

      expect(repositoryCreateSpy).toHaveBeenCalledTimes(1);
      expect(repositoryCreateSpy).toBeCalledWith(CREATE_PROJECT_STUB);
    });
  });

  describe("프로젝트 수정", () => {
    const _id = PROJECT_STUB._id;
    const nid = PROJECT_STUB.nid;

    let repositoryGetOneSpy: jest.SpyInstance;
    let repositoryFindOneAndUpdateSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryGetOneSpy = jest.spyOn(repository, "getOne");
      repositoryFindOneAndUpdateSpy = jest.spyOn(repository, "findOneAndUpdate");
    });

    it("성공", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(PROJECT_STUB);
      repositoryFindOneAndUpdateSpy.mockResolvedValueOnce(PROJECT_STUB);

      const result = await service.update(nid, UPDATE_PROJECT_STUB);

      expect(result).toEqual(PROJECT_STUB);

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toBeCalledWith({ nid });

      expect(repositoryFindOneAndUpdateSpy).toHaveBeenCalledTimes(1);
      expect(repositoryFindOneAndUpdateSpy).toBeCalledWith({ _id }, UPDATE_PROJECT_STUB);
    });

    it("실패 - 존재하지 않는 프로젝트", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(null);

      await expect(service.update(nid, UPDATE_PROJECT_STUB)).rejects.toThrowError(
        PROJECT_ERROR.NOT_FOUND,
      );

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toBeCalledWith({ nid });

      expect(repositoryFindOneAndUpdateSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("프로젝트 삭제", () => {
    const _id = PROJECT_STUB._id;
    const nid = PROJECT_STUB.nid;

    let repositoryGetOneSpy: jest.SpyInstance;
    let repositoryFindOneAndDeleteSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryGetOneSpy = jest.spyOn(repository, "getOne");
      repositoryFindOneAndDeleteSpy = jest.spyOn(repository, "findOneAndDelete");
    });

    it("성공", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(PROJECT_STUB);
      repositoryFindOneAndDeleteSpy.mockResolvedValueOnce(PROJECT_STUB);

      const result = await service.delete(nid);

      expect(result).toBe(PROJECT_STUB);

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toBeCalledWith({ nid });

      expect(repositoryFindOneAndDeleteSpy).toHaveBeenCalledTimes(1);
      expect(repositoryFindOneAndDeleteSpy).toBeCalledWith({ _id });
    });

    it("실패 - 존재하지 않는 프로젝트", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(null);

      await expect(service.delete(nid)).rejects.toThrowError(PROJECT_ERROR.NOT_FOUND);

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toBeCalledWith({ nid });

      expect(repositoryFindOneAndDeleteSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("프로젝트 number id로 가져오기", () => {
    let repositoryGetOneSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryGetOneSpy = jest.spyOn(repository, "getOne");
    });

    it("성공", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(PROJECT_STUB);

      const result = await service.getByNumId(PROJECT_STUB.nid);

      expect(result).toEqual(PROJECT_STUB);

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toBeCalledWith({ nid: PROJECT_STUB.nid });
    });

    it("실패 - 존재하지 않는 프로젝트", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(null);

      await expect(service.getByNumId(PROJECT_STUB.nid)).rejects.toThrowError(
        PROJECT_ERROR.NOT_FOUND,
      );

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toBeCalledWith({ nid: PROJECT_STUB.nid });
    });
  });

  describe("프로젝트 리스트 가져오기", () => {
    it("성공", async () => {
      const repositoryGetListSpy: jest.SpyInstance = jest
        .spyOn(repository, "getAll")
        .mockResolvedValueOnce([PROJECT_STUB]);

      const result = await service.getAll();

      expect(result).toEqual([PROJECT_STUB]);

      expect(repositoryGetListSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetListSpy).toBeCalledWith({}, {}, { sort: { _id: -1 } });
    });
  });
});
