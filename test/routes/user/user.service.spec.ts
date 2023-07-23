import { getModelToken } from "@nestjs/mongoose";
import { TestingModule } from "@nestjs/testing";

import createTestingModule from "test/utils/mongo/createTestModule";
import { MongoMemoryServer } from "test/utils/mongo/mongodb-memory-server-setup";

import { UserRepository } from "@/routes/user/user.repository";
import { User, UserModel } from "@/routes/user/user.schema";
import { UserService } from "@/routes/user/user.service";

describe("UserService", () => {
  let service: UserService;
  let repository: UserRepository;
  let model: UserModel;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      providers: [
        UserService,
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: User,
        },
      ],
    });

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
    model = module.get<UserModel>(getModelToken(User.name));

    repository;
    model;
  });

  afterEach(async () => {
    await MongoMemoryServer.stop();
  });

  it("should be defined", async () => {
    expect(service).toBeDefined();
  });
});
