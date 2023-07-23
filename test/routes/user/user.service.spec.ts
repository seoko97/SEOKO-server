import { ConflictException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import { MockUserRepository } from "test/utils/mock/user";
import createTestingModule from "test/utils/mongo/createTestModule";
import { USER_STUB, USER_STUB_NON_PASSWORD } from "test/utils/stub/user";

import { UserRepository } from "@/routes/user/user.repository";
import { UserService } from "@/routes/user/user.service";

describe("UserService", () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useClass: MockUserRepository,
        },
      ],
    });

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  describe("유저 생성", () => {
    let repositoryGetByUserIdSpy: jest.SpyInstance;

    beforeEach(() => {
      repositoryGetByUserIdSpy = jest.spyOn(repository, "getByUserId");
    });

    it("성공", async () => {
      repositoryGetByUserIdSpy.mockImplementationOnce(() => null);

      const user = await service.create(USER_STUB);

      expect(user).toEqual(USER_STUB);
    });

    describe("실패", () => {
      it("이미 존재하는 유저", async () => {
        try {
          await service.create(USER_STUB);
        } catch (e) {
          expect(e.status).toBe(409);
          expect(e.message).toBe("이미 존재하는 유저입니다.");
          expect(e).toBeInstanceOf(ConflictException);
        }
      });
    });
  });

  describe("유저 조회", () => {
    // 유저 아이디로 조회시애는 패스워드가 존재함
    it("유저 아이디로 조회", async () => {
      const user = await service.getByUserId(USER_STUB.userId);

      expect(user).toEqual(USER_STUB);
      expect(user.password).toBeDefined();
    });

    // unique id로 조회시 패스워드가 존재하지 않음
    it("unique id로 조회", async () => {
      const user = await service.getById(USER_STUB._id);

      expect(user).toEqual(USER_STUB_NON_PASSWORD);
      expect(user.password).toBeUndefined();
    });
  });
});
