import { Test, TestingModule } from "@nestjs/testing";

import { CREATE_EXPERIENCE_STUB, EXPERIENCE_STUB } from "test/utils/stub";

import { ExperienceRepository } from "@/routes/experience/experience.repository";
import { ExperienceService } from "@/routes/experience/experience.service";
import { EXPERIENCE_ERROR } from "@/utils/constants";

jest.mock("@/routes/experience/experience.repository");

describe("ExperienceService", () => {
  let service: ExperienceService;
  let repository: ExperienceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperienceService, ExperienceRepository],
    }).compile();

    service = module.get<ExperienceService>(ExperienceService);
    repository = module.get<ExperienceRepository>(ExperienceRepository);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe("경력 생성", () => {
    let repositoryCreateSpy: jest.SpyInstance;
    let repositoryGetOneSpy: jest.SpyInstance;

    const GET_ALL_PARAMS = { title: CREATE_EXPERIENCE_STUB.title, _id: { $ne: "" } };

    beforeEach(() => {
      repositoryCreateSpy = jest.spyOn(repository, "create");
      repositoryGetOneSpy = jest.spyOn(repository, "getOne");
    });

    it("성공", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(null);
      repositoryCreateSpy.mockResolvedValueOnce(EXPERIENCE_STUB);

      const result = await service.create(CREATE_EXPERIENCE_STUB);

      expect(result).toEqual(EXPERIENCE_STUB);

      expect(repositoryGetOneSpy).toBeCalledTimes(1);
      expect(repositoryGetOneSpy).toBeCalledWith(GET_ALL_PARAMS);

      expect(repositoryCreateSpy).toBeCalledTimes(1);
      expect(repositoryCreateSpy).toBeCalledWith(CREATE_EXPERIENCE_STUB);
    });

    it("실패 - 이미 존재하는 경력", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(EXPERIENCE_STUB);

      await expect(service.create(CREATE_EXPERIENCE_STUB)).rejects.toThrowError(
        EXPERIENCE_ERROR.ALREADY_EXISTS,
      );

      expect(repositoryGetOneSpy).toBeCalledTimes(1);
      expect(repositoryGetOneSpy).toBeCalledWith(GET_ALL_PARAMS);

      expect(repositoryCreateSpy).toBeCalledTimes(0);
    });
  });

  describe("경력 수정", () => {
    let repositoryGetByIdSpy: jest.SpyInstance;
    let repositoryGetOneSpy: jest.SpyInstance;
    let repositoryFindOneAndUpdateSpy: jest.SpyInstance;

    const GET_ALL_PARAMS = { title: EXPERIENCE_STUB.title, _id: { $ne: EXPERIENCE_STUB._id } };

    beforeEach(() => {
      repositoryGetByIdSpy = jest.spyOn(repository, "getById");
      repositoryGetOneSpy = jest.spyOn(repository, "getOne");
      repositoryFindOneAndUpdateSpy = jest.spyOn(repository, "findOneAndUpdate");
    });

    it("성공", async () => {
      repositoryGetByIdSpy.mockResolvedValueOnce(EXPERIENCE_STUB);
      repositoryGetOneSpy.mockResolvedValueOnce(null);
      repositoryFindOneAndUpdateSpy.mockResolvedValueOnce(EXPERIENCE_STUB);

      const result = await service.update(EXPERIENCE_STUB._id, CREATE_EXPERIENCE_STUB);

      expect(result).toEqual(EXPERIENCE_STUB);

      expect(repositoryGetByIdSpy).toBeCalledTimes(1);
      expect(repositoryGetByIdSpy).toBeCalledWith(EXPERIENCE_STUB._id);

      expect(repositoryGetOneSpy).toBeCalledTimes(1);
      expect(repositoryGetOneSpy).toBeCalledWith(GET_ALL_PARAMS);

      expect(repositoryFindOneAndUpdateSpy).toBeCalledTimes(1);
      expect(repositoryFindOneAndUpdateSpy).toBeCalledWith(
        { _id: EXPERIENCE_STUB._id },
        CREATE_EXPERIENCE_STUB,
      );
    });

    it("실패 - 존재하지 않는 경력", async () => {
      repositoryGetByIdSpy.mockResolvedValueOnce(null);

      await expect(
        service.update(EXPERIENCE_STUB._id, CREATE_EXPERIENCE_STUB),
      ).rejects.toThrowError(EXPERIENCE_ERROR.NOT_FOUND);

      expect(repositoryGetByIdSpy).toBeCalledTimes(1);
      expect(repositoryGetByIdSpy).toBeCalledWith(EXPERIENCE_STUB._id);

      expect(repositoryGetOneSpy).toBeCalledTimes(0);

      expect(repositoryFindOneAndUpdateSpy).toBeCalledTimes(0);
    });

    it("실패 - 이미 존재하는 경력", async () => {
      repositoryGetByIdSpy.mockResolvedValueOnce(EXPERIENCE_STUB);
      repositoryGetOneSpy.mockResolvedValueOnce(EXPERIENCE_STUB);

      await expect(
        service.update(EXPERIENCE_STUB._id, CREATE_EXPERIENCE_STUB),
      ).rejects.toThrowError(EXPERIENCE_ERROR.ALREADY_EXISTS);

      expect(repositoryGetByIdSpy).toBeCalledTimes(1);
      expect(repositoryGetByIdSpy).toBeCalledWith(EXPERIENCE_STUB._id);

      expect(repositoryGetOneSpy).toBeCalledTimes(1);
      expect(repositoryGetOneSpy).toBeCalledWith(GET_ALL_PARAMS);

      expect(repositoryFindOneAndUpdateSpy).toBeCalledTimes(0);
    });
  });

  describe("경력 삭제", () => {
    let repositoryGetByIdSpy: jest.SpyInstance;
    let repositoryDeleteSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryGetByIdSpy = jest.spyOn(repository, "getById");
      repositoryDeleteSpy = jest.spyOn(repository, "delete");
    });

    it("성공", async () => {
      repositoryGetByIdSpy.mockResolvedValueOnce(EXPERIENCE_STUB);
      repositoryDeleteSpy.mockResolvedValueOnce(true);

      const result = await service.delete(EXPERIENCE_STUB._id);

      expect(result).toEqual(true);

      expect(repositoryGetByIdSpy).toBeCalledTimes(1);
      expect(repositoryGetByIdSpy).toBeCalledWith(EXPERIENCE_STUB._id);

      expect(repositoryDeleteSpy).toBeCalledTimes(1);
      expect(repositoryDeleteSpy).toBeCalledWith(EXPERIENCE_STUB._id);
    });

    it("실패 - 존재하지 않는 경력", async () => {
      repositoryGetByIdSpy.mockResolvedValueOnce(null);

      await expect(service.delete(EXPERIENCE_STUB._id)).rejects.toThrowError(
        EXPERIENCE_ERROR.NOT_FOUND,
      );

      expect(repositoryGetByIdSpy).toBeCalledTimes(1);
      expect(repositoryGetByIdSpy).toBeCalledWith(EXPERIENCE_STUB._id);

      expect(repositoryDeleteSpy).toBeCalledTimes(0);
    });
  });

  describe("모든 경력 조회", () => {
    it("성공", async () => {
      const repositoryGetAllSpy = jest.spyOn(repository, "getAll");

      repositoryGetAllSpy.mockResolvedValueOnce([EXPERIENCE_STUB]);

      const result = await service.getAll();

      expect(result).toEqual([EXPERIENCE_STUB]);

      expect(repositoryGetAllSpy).toBeCalledTimes(1);
      expect(repositoryGetAllSpy).toBeCalledWith({}, {}, { sort: { start: -1 } });
    });
  });
});
