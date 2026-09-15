import { BadRequestException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import createTestingModule from "test/utils/mongo/createTestModule";
import { USER_INPUT_STUB, USER_STUB, USER_STUB_NON_PASSWORD } from "test/utils/stub";

import { UserRepository } from "@/routes/user/user.repository";
import { UserService } from "@/routes/user/user.service";
import { USER_ERROR } from "@/utils/constants";

vi.mock("@/routes/user/user.repository");

describe("UserService", () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      providers: [UserService, UserRepository],
    });

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);

    vi.clearAllMocks();
  });

  describe("유저 생성", () => {
    let repositoryGetOneSpy: TestSpyInstance;
    let repositoryCreateSpy: TestSpyInstance;

    beforeEach(() => {
      repositoryGetOneSpy = vi.spyOn(repository, "getOne");
      repositoryCreateSpy = vi.spyOn(repository, "create");
    });

    it("성공", async () => {
      repositoryGetOneSpy.mockResolvedValueOnce(null);
      repositoryCreateSpy.mockResolvedValueOnce(USER_STUB_NON_PASSWORD);

      const user = await service.create(USER_INPUT_STUB);

      expect(user).toEqual(USER_STUB_NON_PASSWORD);

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith({ userId: USER_INPUT_STUB.userId });

      expect(repositoryCreateSpy).toHaveBeenCalledTimes(1);
      expect(repositoryCreateSpy).toHaveBeenCalledWith(USER_INPUT_STUB);
    });

    describe("실패", () => {
      it("이미 존재하는 유저", async () => {
        repositoryGetOneSpy.mockResolvedValueOnce(USER_STUB);

        try {
          await service.create(USER_STUB);
        } catch (e) {
          expect(e.status).toBe(400);
          expect(e.message).toBe(USER_ERROR.ALREADY_EXISTS);
          expect(e).toBeInstanceOf(BadRequestException);

          expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
          expect(repositoryGetOneSpy).toHaveBeenCalledWith({ userId: USER_INPUT_STUB.userId });

          expect(repositoryCreateSpy).not.toHaveBeenCalled();
        }
      });
    });
  });

  describe("유저 조회", () => {
    it("유저 아이디로 조회", async () => {
      const repositoryGetOneSpy = vi.spyOn(repository, "getOne");
      repositoryGetOneSpy.mockResolvedValueOnce(USER_STUB);

      const user = await service.getByUserId(USER_STUB.userId);

      expect(user).toEqual(USER_STUB);
      expect(user.password).toBeDefined();

      expect(repositoryGetOneSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetOneSpy).toHaveBeenCalledWith({ userId: USER_STUB.userId });
    });

    it("unique id로 조회", async () => {
      const repositoryGetByIdSpy = vi.spyOn(repository, "getById");
      repositoryGetByIdSpy.mockResolvedValueOnce(USER_STUB_NON_PASSWORD);

      const user = await service.getById(USER_STUB._id);

      expect(user).toEqual(USER_STUB_NON_PASSWORD);
      expect(user.password).toBeUndefined();

      expect(repositoryGetByIdSpy).toHaveBeenCalledTimes(1);
      expect(repositoryGetByIdSpy).toHaveBeenCalledWith(USER_STUB._id, { password: 0 });
    });
  });
});
