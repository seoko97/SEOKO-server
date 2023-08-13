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

jest.mock("@/routes/skill/skill.repository");

describe("SkillService", () => {
  let service: SkillService;
  let repository: SkillRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillService, SkillRepository],
    }).compile();

    service = module.get<SkillService>(SkillService);
    repository = module.get<SkillRepository>(SkillRepository);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe("스킬 생성", () => {
    let createSpy: jest.SpyInstance;
    let getOneSpy: jest.SpyInstance;

    const GET_ALL_PARAMS = { name: CREATE_SKILL_STUB.name, _id: { $ne: "" } };

    beforeEach(() => {
      createSpy = jest.spyOn(repository, "create");
      getOneSpy = jest.spyOn(repository, "getOne");
    });

    it("성공", async () => {
      getOneSpy.mockResolvedValue(null);
      createSpy.mockResolvedValue(SKILL_STUB);

      const result = await service.create(CREATE_SKILL_STUB);

      expect(result).toEqual(SKILL_STUB);

      expect(getOneSpy).toBeCalledTimes(1);
      expect(getOneSpy).toBeCalledWith(GET_ALL_PARAMS);

      expect(createSpy).toBeCalledTimes(1);
      expect(createSpy).toBeCalledWith(CREATE_SKILL_STUB);
    });

    it("실패 - 동일한 이름을 가진 스킬이 존재", async () => {
      getOneSpy.mockResolvedValue(SKILL_STUB);

      await expect(service.create(CREATE_SKILL_STUB)).rejects.toThrowError(
        SKILL_ERROR.ALREADY_EXISTS,
      );

      expect(getOneSpy).toBeCalledTimes(1);
      expect(getOneSpy).toBeCalledWith(GET_ALL_PARAMS);

      expect(createSpy).not.toBeCalled();
    });
  });

  describe("스킬 수정", () => {
    let getByIdSpy: jest.SpyInstance;
    let getOneSpy: jest.SpyInstance;
    let findOneAndUpdateSpy: jest.SpyInstance;

    const skillId = SKILL_STUB._id;
    const GET_ALL_PARAMS = { name: SKILL_STUB.name, _id: { $ne: skillId } };

    beforeEach(() => {
      getByIdSpy = jest.spyOn(repository, "getById");
      getOneSpy = jest.spyOn(repository, "getOne");
      findOneAndUpdateSpy = jest.spyOn(repository, "findOneAndUpdate");
    });

    it("성공", async () => {
      getByIdSpy.mockResolvedValue(SKILL_STUB);
      getOneSpy.mockResolvedValue(null);
      findOneAndUpdateSpy.mockResolvedValue(SKILL_STUB);

      const result = await service.update(skillId, UPDATE_SKILL_STUB);

      expect(result).toEqual(SKILL_STUB);

      expect(getByIdSpy).toBeCalledTimes(1);
      expect(getByIdSpy).toBeCalledWith(skillId);

      expect(getOneSpy).toBeCalledTimes(1);
      expect(getOneSpy).toBeCalledWith(GET_ALL_PARAMS);

      expect(findOneAndUpdateSpy).toBeCalledTimes(1);
      expect(findOneAndUpdateSpy).toBeCalledWith({ _id: skillId }, UPDATE_SKILL_STUB);
    });

    it("실패 - 존재하지 않는 스킬", async () => {
      getByIdSpy.mockResolvedValue(null);

      await expect(service.update(skillId, UPDATE_SKILL_STUB)).rejects.toThrowError(
        SKILL_ERROR.NOT_FOUND,
      );

      expect(getByIdSpy).toBeCalledTimes(1);
      expect(getByIdSpy).toBeCalledWith(skillId);

      expect(getOneSpy).not.toBeCalled();
      expect(findOneAndUpdateSpy).not.toBeCalled();
    });

    it("실패 - 동일한 이름을 가진 스킬이 존재", async () => {
      getByIdSpy.mockResolvedValue(SKILL_STUB);
      getOneSpy.mockResolvedValue(SKILL_STUB);

      await expect(service.update(skillId, UPDATE_SKILL_STUB)).rejects.toThrowError(
        SKILL_ERROR.ALREADY_EXISTS,
      );

      expect(getByIdSpy).toBeCalledTimes(1);
      expect(getByIdSpy).toBeCalledWith(skillId);

      expect(getOneSpy).toBeCalledTimes(1);
      expect(getOneSpy).toBeCalledWith(GET_ALL_PARAMS);

      expect(findOneAndUpdateSpy).not.toBeCalled();
    });
  });

  describe("스킬 삭제", () => {
    let getByIdSpy: jest.SpyInstance;
    let deleteSpy: jest.SpyInstance;

    beforeEach(() => {
      getByIdSpy = jest.spyOn(repository, "getById");
      deleteSpy = jest.spyOn(repository, "delete");
    });

    it("성공", async () => {
      getByIdSpy.mockResolvedValue(SKILL_STUB);
      deleteSpy.mockResolvedValue(SKILL_STUB);

      const result = await service.delete(SKILL_STUB._id);

      expect(result).toEqual(SKILL_STUB);

      expect(getByIdSpy).toBeCalledTimes(1);
      expect(getByIdSpy).toBeCalledWith(SKILL_STUB._id);

      expect(deleteSpy).toBeCalledTimes(1);
      expect(deleteSpy).toBeCalledWith(SKILL_STUB._id);
    });

    it("실패 - 존재하지 않는 스킬", async () => {
      getByIdSpy.mockResolvedValue(null);

      await expect(service.delete(SKILL_STUB._id)).rejects.toThrowError(SKILL_ERROR.NOT_FOUND);

      expect(getByIdSpy).toBeCalledTimes(1);
      expect(getByIdSpy).toBeCalledWith(SKILL_STUB._id);

      expect(deleteSpy).not.toBeCalled();
    });
  });

  describe("스킬 전체 조회", () => {
    it("성공", async () => {
      const getAllSpy = jest.spyOn(repository, "getAllToSkillType");
      getAllSpy.mockResolvedValue(SKILLS_STUB_BY_SKILL_TYPE);

      const result = await service.getAll();

      expect(result).toEqual(SKILLS_STUB_BY_SKILL_TYPE);

      expect(getAllSpy).toBeCalledTimes(1);
    });
  });
});
