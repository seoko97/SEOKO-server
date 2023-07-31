import { BadRequestException, ConflictException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import createTestingModule from "test/utils/mongo/createTestModule";
import { USER_INPUT_STUB, USER_STUB, USER_STUB_NON_PASSWORD } from "test/utils/stub";

import { UserController } from "@/routes/user/user.controller";
import { UserService } from "@/routes/user/user.service";
import { USER_ERROR } from "@/utils/constants";

jest.mock("@/routes/user/user.service");

describe("UserController", () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    });

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  describe("유저 생성", () => {
    let serviceCreateSpy: jest.SpyInstance;

    beforeEach(() => {
      serviceCreateSpy = jest.spyOn(service, "create");
    });

    it("성공", async () => {
      serviceCreateSpy.mockResolvedValueOnce(USER_STUB);

      const user = await controller.createUser(USER_INPUT_STUB);

      expect(serviceCreateSpy).toHaveBeenCalledWith(USER_INPUT_STUB);
      expect(user).toEqual({ username: USER_STUB.username });
    });

    describe("실패", () => {
      it("이미 존재하는 유저", async () => {
        serviceCreateSpy.mockRejectedValueOnce(new ConflictException(USER_ERROR.ALREADY_EXISTS));

        try {
          await controller.createUser(USER_INPUT_STUB);
        } catch (e) {
          expect(e.status).toBe(409);
          expect(e.message).toBe(USER_ERROR.ALREADY_EXISTS);
          expect(e).toBeInstanceOf(ConflictException);
        }

        expect(serviceCreateSpy).toHaveBeenCalledWith(USER_INPUT_STUB);
      });

      it("올바르지 않은 유저 정보", async () => {
        serviceCreateSpy.mockRejectedValueOnce(new BadRequestException(USER_ERROR.BAD_REQUEST));

        try {
          await controller.createUser(USER_INPUT_STUB);
        } catch (e) {
          expect(e.status).toBe(400);
          expect(e.message).toBe(USER_ERROR.BAD_REQUEST);
          expect(e).toBeInstanceOf(BadRequestException);
        }

        expect(serviceCreateSpy).toHaveBeenCalledWith(USER_INPUT_STUB);
      });
    });
  });

  describe("유저 조회", () => {
    const TOKEN_USER = { _id: USER_STUB._id };

    let serviceGetByIdSpy: jest.SpyInstance;

    beforeEach(() => {
      serviceGetByIdSpy = jest.spyOn(service, "getById");
    });

    it("성공", async () => {
      serviceGetByIdSpy.mockResolvedValueOnce(USER_STUB_NON_PASSWORD);

      const user = await controller.getUser(TOKEN_USER);

      expect(serviceGetByIdSpy).toHaveBeenCalledWith(USER_STUB._id);
      expect(user).toEqual({ username: USER_STUB.username });
    });

    describe("실패", () => {
      it("존재하지 않는 유저", async () => {
        serviceGetByIdSpy.mockRejectedValueOnce(new BadRequestException(USER_ERROR.BAD_REQUEST));

        try {
          await controller.getUser(TOKEN_USER);
        } catch (e) {
          expect(e.status).toBe(400);
          expect(e.message).toBe(USER_ERROR.BAD_REQUEST);
          expect(e).toBeInstanceOf(BadRequestException);
        }

        expect(serviceGetByIdSpy).toHaveBeenCalledWith(USER_STUB._id);
      });
    });
  });
});
