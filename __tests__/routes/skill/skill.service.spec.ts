import { Test, TestingModule } from "@nestjs/testing";

import {
  CREATE_SKILL_STUB,
  SKILLS_STUB_BY_SKILL_TYPE,
  SKILL_STUB,
  UPDATE_SKILL_STUB,
} from "test/utils/stub";

import { SkillRepository } from "@/routes/skill/skill.repository";
import { SkillService } from "@/routes/skill/skill.service";
import { SKILL_ERROR } from "@/utils/constants";

vi.mock("@/routes/skill/skill.repository");

describe("SkillService", () => {
  let service: SkillService;
  let repository: SkillRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillService, SkillRepository],
    }).compile();

    service = module.get<SkillService>(SkillService);
    repository = module.get<SkillRepository>(SkillRepository);

    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe("스킬 생성", () => {
    let createSpy: TestSpyInstance;
    let getOneSpy: TestSpyInstance;

    const GET_ALL_PARAMS = { name: CREATE_SKILL_STUB.name };

    beforeEach(() => {
      createSpy = vi.spyOn(repository, "create");
      getOneSpy = vi.spyOn(repository, "getOne");
    });

    it("성공", async () => {
      getOneSpy.mockResolvedValue(null);
      createSpy.mockResolvedValue(SKILL_STUB);

      const result = await service.create(CREATE_SKILL_STUB);

      expect(result).toEqual(SKILL_STUB);

      expect(getOneSpy).toHaveBeenCalledTimes(1);
      expect(getOneSpy).toHaveBeenCalledWith(GET_ALL_PARAMS);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith(CREATE_SKILL_STUB);
    });

    it("실패 - 동일한 이름을 가진 스킬이 존재", async () => {
      getOneSpy.mockResolvedValue(SKILL_STUB);

      await expect(service.create(CREATE_SKILL_STUB)).rejects.toThrow(
        SKILL_ERROR.ALREADY_EXISTS,
      );

      expect(getOneSpy).toHaveBeenCalledTimes(1);
      expect(getOneSpy).toHaveBeenCalledWith(GET_ALL_PARAMS);

      expect(createSpy).not.toHaveBeenCalled();
    });
  });

  describe("스킬 수정", () => {
    let getByIdSpy: TestSpyInstance;
    let getOneSpy: TestSpyInstance;
    let findOneAndUpdateSpy: TestSpyInstance;

    const skillId = SKILL_STUB._id;
    const GET_ALL_PARAMS = { name: SKILL_STUB.name, _id: { $ne: skillId } };

    beforeEach(() => {
      getByIdSpy = vi.spyOn(repository, "getById");
      getOneSpy = vi.spyOn(repository, "getOne");
      findOneAndUpdateSpy = vi.spyOn(repository, "findOneAndUpdate");
    });

    it("성공", async () => {
      getByIdSpy.mockResolvedValue(SKILL_STUB);
      getOneSpy.mockResolvedValue(null);
      findOneAndUpdateSpy.mockResolvedValue(SKILL_STUB);

      const result = await service.update(skillId, UPDATE_SKILL_STUB);

      expect(result).toEqual(SKILL_STUB);

      expect(getByIdSpy).toHaveBeenCalledTimes(1);
      expect(getByIdSpy).toHaveBeenCalledWith(skillId);

      expect(getOneSpy).toHaveBeenCalledTimes(1);
      expect(getOneSpy).toHaveBeenCalledWith(GET_ALL_PARAMS);

      expect(findOneAndUpdateSpy).toHaveBeenCalledTimes(1);
      expect(findOneAndUpdateSpy).toHaveBeenCalledWith({ _id: skillId }, UPDATE_SKILL_STUB);
    });

    it("실패 - 존재하지 않는 스킬", async () => {
      getByIdSpy.mockResolvedValue(null);

      await expect(service.update(skillId, UPDATE_SKILL_STUB)).rejects.toThrow(
        SKILL_ERROR.NOT_FOUND,
      );

      expect(getByIdSpy).toHaveBeenCalledTimes(1);
      expect(getByIdSpy).toHaveBeenCalledWith(skillId);

      expect(getOneSpy).not.toHaveBeenCalled();
      expect(findOneAndUpdateSpy).not.toHaveBeenCalled();
    });

    it("실패 - 동일한 이름을 가진 스킬이 존재", async () => {
      getByIdSpy.mockResolvedValue(SKILL_STUB);
      getOneSpy.mockResolvedValue(SKILL_STUB);

      await expect(service.update(skillId, UPDATE_SKILL_STUB)).rejects.toThrow(
        SKILL_ERROR.ALREADY_EXISTS,
      );

      expect(getByIdSpy).toHaveBeenCalledTimes(1);
      expect(getByIdSpy).toHaveBeenCalledWith(skillId);

      expect(getOneSpy).toHaveBeenCalledTimes(1);
      expect(getOneSpy).toHaveBeenCalledWith(GET_ALL_PARAMS);

      expect(findOneAndUpdateSpy).not.toHaveBeenCalled();
    });
  });

  describe("스킬 삭제", () => {
    let getByIdSpy: TestSpyInstance;
    let deleteSpy: TestSpyInstance;

    beforeEach(() => {
      getByIdSpy = vi.spyOn(repository, "getById");
      deleteSpy = vi.spyOn(repository, "delete");
    });

    it("성공", async () => {
      getByIdSpy.mockResolvedValue(SKILL_STUB);
      deleteSpy.mockResolvedValue(SKILL_STUB);

      const result = await service.delete(SKILL_STUB._id);

      expect(result).toEqual(SKILL_STUB);

      expect(getByIdSpy).toHaveBeenCalledTimes(1);
      expect(getByIdSpy).toHaveBeenCalledWith(SKILL_STUB._id);

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith(SKILL_STUB._id);
    });

    it("실패 - 존재하지 않는 스킬", async () => {
      getByIdSpy.mockResolvedValue(null);

      await expect(service.delete(SKILL_STUB._id)).rejects.toThrow(SKILL_ERROR.NOT_FOUND);

      expect(getByIdSpy).toHaveBeenCalledTimes(1);
      expect(getByIdSpy).toHaveBeenCalledWith(SKILL_STUB._id);

      expect(deleteSpy).not.toHaveBeenCalled();
    });
  });

  describe("스킬 전체 조회", () => {
    it("성공", async () => {
      const getAllSpy = vi.spyOn(repository, "getAllToSkillType");
      getAllSpy.mockResolvedValue(SKILLS_STUB_BY_SKILL_TYPE);

      const result = await service.getAll();

      expect(result).toEqual(SKILLS_STUB_BY_SKILL_TYPE);

      expect(getAllSpy).toHaveBeenCalledTimes(1);
    });
  });
});
