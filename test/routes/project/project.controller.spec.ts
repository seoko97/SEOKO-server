import { Test, TestingModule } from "@nestjs/testing";

import { PROJECT_STUB } from "test/utils/stub";

import { ProjectController } from "@/routes/project/project.controller";
import { ProjectService } from "@/routes/project/project.service";

jest.mock("@/routes/project/project.service");

describe("ProjectController", () => {
  let controller: ProjectController;
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [ProjectService],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
    service = module.get<ProjectService>(ProjectService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe("프로젝트 생성", () => {
    it("성공", async () => {
      const serviceCreateSpy: jest.SpyInstance = jest.spyOn(service, "create");
      serviceCreateSpy.mockResolvedValueOnce(PROJECT_STUB);

      const result = await controller.create(PROJECT_STUB);

      expect(result).toEqual(PROJECT_STUB);
      expect(serviceCreateSpy).toBeCalledTimes(1);
      expect(serviceCreateSpy).toBeCalledWith(PROJECT_STUB);
    });
  });

  describe("프로젝트 수정", () => {
    it("성공", async () => {
      const serviceUpdateSpy: jest.SpyInstance = jest.spyOn(service, "update");
      serviceUpdateSpy.mockResolvedValueOnce(PROJECT_STUB);

      const result = await controller.update("1", PROJECT_STUB);

      expect(result).toEqual(PROJECT_STUB);
      expect(serviceUpdateSpy).toBeCalledTimes(1);
      expect(serviceUpdateSpy).toBeCalledWith("1", PROJECT_STUB);
    });
  });

  describe("프로젝트 삭제", () => {
    it("성공", async () => {
      const serviceDeleteSpy: jest.SpyInstance = jest.spyOn(service, "delete");
      serviceDeleteSpy.mockResolvedValueOnce(undefined);

      const projectId = PROJECT_STUB._id;
      const result = await controller.delete(projectId);

      expect(result).toBe(true);
      expect(serviceDeleteSpy).toBeCalledTimes(1);
      expect(serviceDeleteSpy).toBeCalledWith(projectId);
    });
  });

  describe("프로젝트 조회", () => {
    it("성공 - 단일 프로젝트", async () => {
      const serviceGetByNumIdSpy: jest.SpyInstance = jest.spyOn(service, "getByNumId");
      serviceGetByNumIdSpy.mockResolvedValueOnce(PROJECT_STUB);

      const result = await controller.getByNumId(1);

      expect(result).toEqual(PROJECT_STUB);
      expect(serviceGetByNumIdSpy).toBeCalledTimes(1);
      expect(serviceGetByNumIdSpy).toBeCalledWith(1);
    });

    it("성공 - 전체 프로젝트", async () => {
      const serviceGetAllSpy: jest.SpyInstance = jest.spyOn(service, "getAll");
      serviceGetAllSpy.mockResolvedValueOnce([PROJECT_STUB]);

      const result = await controller.getAll();

      expect(result).toEqual([PROJECT_STUB]);
      expect(serviceGetAllSpy).toBeCalledTimes(1);
    });
  });
});
