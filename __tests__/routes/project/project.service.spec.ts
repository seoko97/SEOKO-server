import { Test, TestingModule } from "@nestjs/testing";

import { CREATE_PROJECT_STUB, PROJECT_STUB, UPDATE_PROJECT_STUB } from "test/utils/stub";

import { ProjectRepository } from "@/routes/project/project.repository";
import { ProjectService } from "@/routes/project/project.service";
import { PROJECT_ERROR } from "@/utils/constants";

vi.mock("@/routes/project/project.repository");

describe("ProjectService", () => {
  let service: ProjectService;
  let repository: ProjectRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService, ProjectRepository],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    repository = module.get<ProjectRepository>(ProjectRepository);

    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe("프로젝트 생성", () => {
    it("성공", async () => {
      const repositoryCreateSpy = vi
        .spyOn(repository, "create")
        .mockResolvedValueOnce(PROJECT_STUB);

      const result = await service.create(CREATE_PROJECT_STUB);

      expect(result).toEqual(PROJECT_STUB);

      expect(repositoryCreateSpy).toHaveBeenCalledTimes(1);
      expect(repositoryCreateSpy).toHaveBeenCalledWith(CREATE_PROJECT_STUB);
    });
  });

  describe("프로젝트 수정", () => {
    const _id = PROJECT_STUB._id;
    const nid = PROJECT_STUB.nid;

    let repositoryGetOneSpy: TestSpyInstance;
    let repositoryFindOneAndUpdateSpy: TestSpyInstance;

    beforeEach(() => {
      repositoryGetOneSpy = vi.spyOn(repository, "getOne");
      repositoryFindOneAndUpdateSpy = vi.spyOn(repository, "findOneAndUpdate");
    });

    it("성공", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(PROJECT_STUB);
      repositoryFindOneAndUpdateSpy.mockResolvedValueOnce(PROJECT_STUB);

      const result = await service.update(nid, UPDATE_PROJECT_STUB);

      expect(result).toEqual(PROJECT_STUB);

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith({ nid });

      expect(repositoryFindOneAndUpdateSpy).toHaveBeenCalledTimes(1);
      expect(repositoryFindOneAndUpdateSpy).toHaveBeenCalledWith({ _id }, UPDATE_PROJECT_STUB);
    });

    it("실패 - 존재하지 않는 프로젝트", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(null);

      await expect(service.update(nid, UPDATE_PROJECT_STUB)).rejects.toThrow(
        PROJECT_ERROR.NOT_FOUND,
      );

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith({ nid });

      expect(repositoryFindOneAndUpdateSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("프로젝트 삭제", () => {
    const _id = PROJECT_STUB._id;
    const nid = PROJECT_STUB.nid;

    let repositoryGetOneSpy: TestSpyInstance;
    let repositoryFindOneAndDeleteSpy: TestSpyInstance;

    beforeEach(() => {
      repositoryGetOneSpy = vi.spyOn(repository, "getOne");
      repositoryFindOneAndDeleteSpy = vi.spyOn(repository, "findOneAndDelete");
    });

    it("성공", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(PROJECT_STUB);
      repositoryFindOneAndDeleteSpy.mockResolvedValueOnce(PROJECT_STUB);

      const result = await service.delete(nid);

      expect(result).toBe(PROJECT_STUB);

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith({ nid });

      expect(repositoryFindOneAndDeleteSpy).toHaveBeenCalledTimes(1);
      expect(repositoryFindOneAndDeleteSpy).toHaveBeenCalledWith({ _id });
    });

    it("실패 - 존재하지 않는 프로젝트", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(null);

      await expect(service.delete(nid)).rejects.toThrow(PROJECT_ERROR.NOT_FOUND);

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith({ nid });

      expect(repositoryFindOneAndDeleteSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("프로젝트 number id로 가져오기", () => {
    let repositoryGetOneSpy: TestSpyInstance;

    beforeEach(() => {
      repositoryGetOneSpy = vi.spyOn(repository, "getOne");
    });

    it("성공", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(PROJECT_STUB);

      const result = await service.getByNumId(PROJECT_STUB.nid);

      expect(result).toEqual(PROJECT_STUB);

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith({ nid: PROJECT_STUB.nid });
    });

    it("실패 - 존재하지 않는 프로젝트", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(null);

      await expect(service.getByNumId(PROJECT_STUB.nid)).rejects.toThrow(
        PROJECT_ERROR.NOT_FOUND,
      );

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith({ nid: PROJECT_STUB.nid });
    });
  });

  describe("프로젝트 리스트 가져오기", () => {
    it("성공", async () => {
      const repositoryGetListSpy: TestSpyInstance = vi
        .spyOn(repository, "getAll")
        .mockResolvedValueOnce([PROJECT_STUB]);

      const result = await service.getAll();

      expect(result).toEqual([PROJECT_STUB]);

      expect(repositoryGetListSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetListSpy).toHaveBeenCalledWith({}, {}, { sort: { _id: -1 } });
    });
  });
});
