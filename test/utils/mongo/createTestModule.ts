import { ModuleMetadata } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

async function createTestingModule(metadata: ModuleMetadata = {}): Promise<TestingModule> {
  const testModule: TestingModule = await Test.createTestingModule({
    ...metadata,
  }).compile();

  return testModule;
}

export default createTestingModule;
