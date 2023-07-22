import { BadRequestException, ConflictException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import { MockUserService } from "test/utils/mock/user";
import createTestingModule from "test/utils/mongo/createTestModule";
import { USER_STUB } from "test/utils/stub/user";

import { UserController } from "@/routes/user/user.controller";
import { UserService } from "@/routes/user/user.service";

describe("UserController", () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useClass: MockUserService,
        },
      ],
    });

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  describe("유저 생성", () => {
    let serviceCreateSpy: jest.SpyInstance;
    let serviceGetByUserIdSpy: jest.SpyInstance;

    beforeEach(() => {
      serviceCreateSpy = jest.spyOn(service, "create");
      serviceGetByUserIdSpy = jest.spyOn(service, "getByUserId");
    });

    it("성공", async () => {
      const user = await controller.createUser(USER_STUB);

      expect(user).toEqual(USER_STUB);
    });

    describe("실패", () => {
      it("이미 존재하는 유저", async () => {
        serviceGetByUserIdSpy.mockImplementationOnce(() => {
          throw new ConflictException("이미 존재하는 유저입니다.");
        });

        try {
          await controller.createUser(USER_STUB);
        } catch (e) {
          expect(e.status).toBe(409);
          expect(e.message).toBe("이미 존재하는 유저입니다.");
          expect(e).toBeInstanceOf(ConflictException);
        }
      });

      it("올바르지 않은 유저 정보", async () => {
        serviceCreateSpy.mockImplementationOnce(() => {
          throw new BadRequestException("올바르지 않은 유저 정보입니다.");
        });

        try {
          await controller.createUser(USER_STUB);
        } catch (e) {
          expect(e.status).toBe(400);
          expect(e.message).toBe("올바르지 않은 유저 정보입니다.");
          expect(e).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
