import { Test, TestingModule } from "@nestjs/testing";

import { CREATE_EXPERIENCE_STUB, EXPERIENCE_STUB } from "test/utils/stub";

import { ExperienceController } from "@/routes/experience/experience.controller";
import { ExperienceService } from "@/routes/experience/experience.service";

vi.mock("@/routes/experience/experience.service");

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

    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe("경력 생성", () => {
    it("성공", async () => {
      const serviceCreateSpy = vi.spyOn(service, "create").mockResolvedValueOnce(EXPERIENCE_STUB);

      const result = await controller.create(CREATE_EXPERIENCE_STUB);

      expect(result).toEqual(EXPERIENCE_STUB);

      expect(serviceCreateSpy).toHaveBeenCalledTimes(1);
      expect(serviceCreateSpy).toHaveBeenCalledWith(CREATE_EXPERIENCE_STUB);
    });
  });

  describe("경력 수정", () => {
    it("성공", async () => {
      const serviceUpdateSpy = vi.spyOn(service, "update").mockResolvedValueOnce(EXPERIENCE_STUB);

      const result = await controller.update(EXPERIENCE_STUB._id, CREATE_EXPERIENCE_STUB);

      expect(result).toEqual(EXPERIENCE_STUB);

      expect(serviceUpdateSpy).toHaveBeenCalledTimes(1);
      expect(serviceUpdateSpy).toHaveBeenCalledWith(EXPERIENCE_STUB._id, CREATE_EXPERIENCE_STUB);
    });
  });

  describe("경력 삭제", () => {
    it("성공", async () => {
      const serviceDeleteSpy = vi.spyOn(service, "delete").mockResolvedValueOnce();

      const result = await controller.delete(EXPERIENCE_STUB._id);

      expect(result).toEqual(true);

      expect(serviceDeleteSpy).toHaveBeenCalledTimes(1);
      expect(serviceDeleteSpy).toHaveBeenCalledWith(EXPERIENCE_STUB._id);
    });
  });

  describe("경력 조회", () => {
    it("성공", async () => {
      const serviceGetAllSpy = vi
        .spyOn(service, "getAll")
        .mockResolvedValueOnce([EXPERIENCE_STUB]);

      const result = await controller.getAll();

      expect(result).toEqual([EXPERIENCE_STUB]);

      expect(serviceGetAllSpy).toHaveBeenCalledTimes(1);
      expect(serviceGetAllSpy).toHaveBeenCalledWith();
    });
  });
});
