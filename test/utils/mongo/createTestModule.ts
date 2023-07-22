import { ModuleMetadata } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { MongoMemoryServer } from "test/utils/mongo/mongodb-memory-server-setup";

async function createTestingModule(metadata: ModuleMetadata = {}): Promise<TestingModule> {
  await MongoMemoryServer.start();

  const testModule: TestingModule = await Test.createTestingModule({
    imports: [...(metadata.imports ?? [])],
    ...metadata,
  }).compile();

  return testModule;
}

export default createTestingModule;
