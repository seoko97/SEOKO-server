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

    let repositoryGetByIdSpy: jest.SpyInstance;
    let repositoryFindOneAndUpdateSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryGetByIdSpy = jest.spyOn(repository, "getById");
      repositoryFindOneAndUpdateSpy = jest.spyOn(repository, "findOneAndUpdate");
    });

    it("성공", async () => {
      repositoryGetByIdSpy.mockResolvedValueOnce(PROJECT_STUB);
      repositoryFindOneAndUpdateSpy.mockResolvedValueOnce(PROJECT_STUB);

      const result = await service.update(_id, UPDATE_PROJECT_STUB);

      expect(result).toEqual(PROJECT_STUB);

      expect(repositoryGetByIdSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetByIdSpy).toBeCalledWith(_id);

      expect(repositoryFindOneAndUpdateSpy).toHaveBeenCalledTimes(1);
      expect(repositoryFindOneAndUpdateSpy).toBeCalledWith({ _id }, UPDATE_PROJECT_STUB);
    });

    it("실패 - 존재하지 않는 프로젝트", async () => {
      repositoryGetByIdSpy.mockResolvedValueOnce(null);

      await expect(service.update(_id, UPDATE_PROJECT_STUB)).rejects.toThrowError(
        PROJECT_ERROR.NOT_FOUND,
      );

      expect(repositoryGetByIdSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetByIdSpy).toBeCalledWith(_id);

      expect(repositoryFindOneAndUpdateSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("프로젝트 삭제", () => {
    let repositoryGetByIdSpy: jest.SpyInstance;
    let repositoryDeleteSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryGetByIdSpy = jest.spyOn(repository, "getById");
      repositoryDeleteSpy = jest.spyOn(repository, "delete");
    });

    it("성공", async () => {
      repositoryGetByIdSpy = jest.spyOn(repository, "getById");
      repositoryDeleteSpy = jest.spyOn(repository, "delete");

      repositoryGetByIdSpy.mockResolvedValueOnce(PROJECT_STUB);
      repositoryDeleteSpy.mockResolvedValueOnce(undefined);

      const result = await service.delete(PROJECT_STUB._id);

      expect(result).toBeUndefined();

      expect(repositoryGetByIdSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetByIdSpy).toBeCalledWith(PROJECT_STUB._id);

      expect(repositoryDeleteSpy).toHaveBeenCalledTimes(1);
      expect(repositoryDeleteSpy).toBeCalledWith(PROJECT_STUB._id);
    });

    it("실패 - 존재하지 않는 프로젝트", async () => {
      repositoryGetByIdSpy.mockResolvedValueOnce(null);

      await expect(service.delete(PROJECT_STUB._id)).rejects.toThrowError(PROJECT_ERROR.NOT_FOUND);

      expect(repositoryGetByIdSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetByIdSpy).toBeCalledWith(PROJECT_STUB._id);

      expect(repositoryDeleteSpy).toHaveBeenCalledTimes(0);
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
      expect(repositoryGetListSpy).toBeCalledWith();
    });
  });
});
