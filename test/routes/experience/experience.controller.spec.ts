import { Test, TestingModule } from "@nestjs/testing";

import { CREATE_EXPERIENCE_STUB, EXPERIENCE_STUB } from "test/utils/stub";

import { ExperienceController } from "@/routes/experience/experience.controller";
import { ExperienceService } from "@/routes/experience/experience.service";

jest.mock("@/routes/experience/experience.service");

describe("ExperienceController", () => {
  let controller: ExperienceController;
  let service: ExperienceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperienceController],
      providers: [ExperienceService],
    }).compile();

    controller = module.get<ExperienceController>(ExperienceController);
    service = module.get<ExperienceService>(ExperienceService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe("경력 생성", () => {
    it("성공", async () => {
      const serviceCreateSpy = jest.spyOn(service, "create").mockResolvedValueOnce(EXPERIENCE_STUB);

      const result = await controller.create(CREATE_EXPERIENCE_STUB);

      expect(result).toEqual(EXPERIENCE_STUB);

      expect(serviceCreateSpy).toBeCalledTimes(1);
      expect(serviceCreateSpy).toBeCalledWith(CREATE_EXPERIENCE_STUB);
    });
  });

  describe("경력 수정", () => {
    it("성공", async () => {
      const serviceUpdateSpy = jest.spyOn(service, "update").mockResolvedValueOnce(EXPERIENCE_STUB);

      const result = await controller.update(EXPERIENCE_STUB._id, CREATE_EXPERIENCE_STUB);

      expect(result).toEqual(EXPERIENCE_STUB);

      expect(serviceUpdateSpy).toBeCalledTimes(1);
      expect(serviceUpdateSpy).toBeCalledWith(EXPERIENCE_STUB._id, CREATE_EXPERIENCE_STUB);
    });
  });

  describe("경력 삭제", () => {
    it("성공", async () => {
      const serviceDeleteSpy = jest.spyOn(service, "delete").mockResolvedValueOnce();

      const result = await controller.delete(EXPERIENCE_STUB._id);

      expect(result).toEqual(true);

      expect(serviceDeleteSpy).toBeCalledTimes(1);
      expect(serviceDeleteSpy).toBeCalledWith(EXPERIENCE_STUB._id);
    });
  });

  describe("경력 조회", () => {
    it("성공", async () => {
      const serviceGetAllSpy = jest
        .spyOn(service, "getAll")
        .mockResolvedValueOnce([EXPERIENCE_STUB]);

      const result = await controller.getAll();

      expect(result).toEqual([EXPERIENCE_STUB]);

      expect(serviceGetAllSpy).toBeCalledTimes(1);
      expect(serviceGetAllSpy).toBeCalledWith();
    });
  });
});
