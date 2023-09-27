import { Test, TestingModule } from "@nestjs/testing";

import { CREATE_SKILL_STUB, SKILLS_STUB_BY_SKILL_TYPE, SKILL_STUB } from "test/utils/stub";

import { SkillController } from "@/routes/skill/skill.controller";
import { SkillService } from "@/routes/skill/skill.service";

jest.mock("@/routes/skill/skill.service");

describe("SkillController", () => {
  let controller: SkillController;
  let service: SkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillController],
      providers: [SkillService],
    }).compile();

    controller = module.get<SkillController>(SkillController);
    service = module.get<SkillService>(SkillService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe("스킬 생성", () => {
    it("성공", async () => {
      const serviceCreateSpy = jest.spyOn(service, "create").mockResolvedValueOnce(SKILL_STUB);

      const result = await controller.create(CREATE_SKILL_STUB);

      expect(result).toEqual(SKILL_STUB);

      expect(serviceCreateSpy).toBeCalledTimes(1);
      expect(serviceCreateSpy).toBeCalledWith(CREATE_SKILL_STUB);
    });
  });

  describe("스킬 수정", () => {
    it("성공", async () => {
      const serviceUpdateSpy = jest.spyOn(service, "update").mockResolvedValueOnce(SKILL_STUB);

      const result = await controller.update(SKILL_STUB._id, CREATE_SKILL_STUB);

      expect(result).toEqual(SKILL_STUB);

      expect(serviceUpdateSpy).toBeCalledTimes(1);
      expect(serviceUpdateSpy).toBeCalledWith(SKILL_STUB._id, CREATE_SKILL_STUB);
    });
  });

  describe("스킬 삭제", () => {
    it("성공", async () => {
      const serviceDeleteSpy = jest.spyOn(service, "delete").mockResolvedValueOnce();

      const result = await controller.delete(SKILL_STUB._id);

      expect(result).toEqual(true);

      expect(serviceDeleteSpy).toBeCalledTimes(1);
      expect(serviceDeleteSpy).toBeCalledWith(SKILL_STUB._id);
    });
  });

  describe("스킬 조회", () => {
    it("성공", async () => {
      const serviceGetAllSpy = jest
        .spyOn(service, "getAll")
        .mockResolvedValueOnce(SKILLS_STUB_BY_SKILL_TYPE);

      const result = await controller.getAll();

      expect(result).toEqual(SKILLS_STUB_BY_SKILL_TYPE);

      expect(serviceGetAllSpy).toBeCalledTimes(1);
      expect(serviceGetAllSpy).toBeCalledWith();
    });
  });
});
