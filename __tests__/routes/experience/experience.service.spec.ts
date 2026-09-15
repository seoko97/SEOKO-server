import { Test, TestingModule } from "@nestjs/testing";

import { CREATE_EXPERIENCE_STUB, EXPERIENCE_STUB } from "test/utils/stub";

import { ExperienceRepository } from "@/routes/experience/experience.repository";
import { ExperienceService } from "@/routes/experience/experience.service";
import { EXPERIENCE_ERROR } from "@/utils/constants";

vi.mock("@/routes/experience/experience.repository");

describe("ExperienceService", () => {
  let service: ExperienceService;
  let repository: ExperienceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperienceService, ExperienceRepository],
    }).compile();

    service = module.get<ExperienceService>(ExperienceService);
    repository = module.get<ExperienceRepository>(ExperienceRepository);

    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe("경력 생성", () => {
    let repositoryCreateSpy: TestSpyInstance;
    let repositoryGetOneSpy: TestSpyInstance;

    const GET_ALL_PARAMS = { title: CREATE_EXPERIENCE_STUB.title };

    beforeEach(() => {
      repositoryCreateSpy = vi.spyOn(repository, "create");
      repositoryGetOneSpy = vi.spyOn(repository, "getOne");
    });

    it("성공", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(null);
      repositoryCreateSpy.mockResolvedValueOnce(EXPERIENCE_STUB);

      const result = await service.create(CREATE_EXPERIENCE_STUB);

      expect(result).toEqual(EXPERIENCE_STUB);

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith(GET_ALL_PARAMS);

      expect(repositoryCreateSpy).toHaveBeenCalledTimes(1);
      expect(repositoryCreateSpy).toHaveBeenCalledWith(CREATE_EXPERIENCE_STUB);
    });

    it("실패 - 이미 존재하는 경력", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(EXPERIENCE_STUB);

      await expect(service.create(CREATE_EXPERIENCE_STUB)).rejects.toThrow(
        EXPERIENCE_ERROR.ALREADY_EXISTS,
      );

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith(GET_ALL_PARAMS);

      expect(repositoryCreateSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("경력 수정", () => {
    let repositoryGetByIdSpy: TestSpyInstance;
    let repositoryGetOneSpy: TestSpyInstance;
    let repositoryFindOneAndUpdateSpy: TestSpyInstance;

    const GET_ALL_PARAMS = { title: EXPERIENCE_STUB.title, _id: { $ne: EXPERIENCE_STUB._id } };

    beforeEach(() => {
      repositoryGetByIdSpy = vi.spyOn(repository, "getById");
      repositoryGetOneSpy = vi.spyOn(repository, "getOne");
      repositoryFindOneAndUpdateSpy = vi.spyOn(repository, "findOneAndUpdate");
    });

    it("성공", async () => {
      repositoryGetByIdSpy.mockResolvedValueOnce(EXPERIENCE_STUB);
      repositoryGetOneSpy.mockResolvedValueOnce(null);
      repositoryFindOneAndUpdateSpy.mockResolvedValueOnce(EXPERIENCE_STUB);

      const result = await service.update(EXPERIENCE_STUB._id, CREATE_EXPERIENCE_STUB);

      expect(result).toEqual(EXPERIENCE_STUB);

      expect(repositoryGetByIdSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetByIdSpy).toHaveBeenCalledWith(EXPERIENCE_STUB._id);

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith(GET_ALL_PARAMS);

      expect(repositoryFindOneAndUpdateSpy).toHaveBeenCalledTimes(1);
      expect(repositoryFindOneAndUpdateSpy).toHaveBeenCalledWith(
        { _id: EXPERIENCE_STUB._id },
        CREATE_EXPERIENCE_STUB,
      );
    });

    it("실패 - 존재하지 않는 경력", async () => {
      repositoryGetByIdSpy.mockResolvedValueOnce(null);

      await expect(
        service.update(EXPERIENCE_STUB._id, CREATE_EXPERIENCE_STUB),
      ).rejects.toThrow(EXPERIENCE_ERROR.NOT_FOUND);

      expect(repositoryGetByIdSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetByIdSpy).toHaveBeenCalledWith(EXPERIENCE_STUB._id);

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(0);

      expect(repositoryFindOneAndUpdateSpy).toHaveBeenCalledTimes(0);
    });

    it("실패 - 이미 존재하는 경력", async () => {
      repositoryGetByIdSpy.mockResolvedValueOnce(EXPERIENCE_STUB);
      repositoryGetOneSpy.mockResolvedValueOnce(EXPERIENCE_STUB);

      await expect(
        service.update(EXPERIENCE_STUB._id, CREATE_EXPERIENCE_STUB),
      ).rejects.toThrow(EXPERIENCE_ERROR.ALREADY_EXISTS);

      expect(repositoryGetByIdSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetByIdSpy).toHaveBeenCalledWith(EXPERIENCE_STUB._id);

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith(GET_ALL_PARAMS);

      expect(repositoryFindOneAndUpdateSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("경력 삭제", () => {
    let repositoryGetByIdSpy: TestSpyInstance;
    let repositoryDeleteSpy: TestSpyInstance;

    beforeEach(() => {
      repositoryGetByIdSpy = vi.spyOn(repository, "getById");
      repositoryDeleteSpy = vi.spyOn(repository, "delete");
    });

    it("성공", async () => {
      repositoryGetByIdSpy.mockResolvedValueOnce(EXPERIENCE_STUB);
      repositoryDeleteSpy.mockResolvedValueOnce(true);

      const result = await service.delete(EXPERIENCE_STUB._id);

      expect(result).toEqual(true);

      expect(repositoryGetByIdSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetByIdSpy).toHaveBeenCalledWith(EXPERIENCE_STUB._id);

      expect(repositoryDeleteSpy).toHaveBeenCalledTimes(1);
      expect(repositoryDeleteSpy).toHaveBeenCalledWith(EXPERIENCE_STUB._id);
    });

    it("실패 - 존재하지 않는 경력", async () => {
      repositoryGetByIdSpy.mockResolvedValueOnce(null);

      await expect(service.delete(EXPERIENCE_STUB._id)).rejects.toThrow(
        EXPERIENCE_ERROR.NOT_FOUND,
      );

      expect(repositoryGetByIdSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetByIdSpy).toHaveBeenCalledWith(EXPERIENCE_STUB._id);

      expect(repositoryDeleteSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("모든 경력 조회", () => {
    it("성공", async () => {
      const repositoryGetAllSpy = vi.spyOn(repository, "getAll");

      repositoryGetAllSpy.mockResolvedValueOnce([EXPERIENCE_STUB]);

      const result = await service.getAll();

      expect(result).toEqual([EXPERIENCE_STUB]);

      expect(repositoryGetAllSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetAllSpy).toHaveBeenCalledWith({}, {}, { sort: { start: -1 } });
    });
  });
});
