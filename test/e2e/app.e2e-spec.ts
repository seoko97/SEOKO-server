import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import * as request from "supertest";
import { MongoMemoryModule } from "test/utils/mongo/mongo-memory.module";
import { MongoMemoryServer } from "test/utils/mongo/mongodb-memory-server-setup";

import { AppModule } from "@/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongoMemoryModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await MongoMemoryServer.stop();
    await app.close();
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer()).get("/").expect(200).expect("Hello World!");
  });
});
