import { Test, TestingModule } from "@nestjs/testing";

import { TAG_STUB } from "test/utils/stub";

import { TagController } from "@/routes/tag/tag.controller";
import { TagService } from "@/routes/tag/tag.service";

jest.mock("@/routes/tag/tag.service");

describe("TagController", () => {
  let controller: TagController;
  let service: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [TagService],
    }).compile();

    controller = module.get<TagController>(TagController);
    service = module.get<TagService>(TagService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("태그 전체 조회", async () => {
    const serviceGetAllSpy: jest.SpyInstance = jest.spyOn(service, "getAll");
    serviceGetAllSpy.mockResolvedValueOnce([TAG_STUB]);

    const tags = await controller.getAll();

    expect(tags).toEqual([TAG_STUB]);
    expect(serviceGetAllSpy).toHaveBeenCalled();
    expect(serviceGetAllSpy).toHaveBeenCalledTimes(1);
  });

  it("태그 이름으로 조회", async () => {
    const serviceGetByNameSpy: jest.SpyInstance = jest.spyOn(service, "getByName");
    serviceGetByNameSpy.mockResolvedValueOnce(TAG_STUB);

    const tag = await controller.getByName("태그 이름");

    expect(tag).toEqual(TAG_STUB);
    expect(serviceGetByNameSpy).toHaveBeenCalled();
    expect(serviceGetByNameSpy).toHaveBeenCalledTimes(1);
    expect(serviceGetByNameSpy).toHaveBeenCalledWith("태그 이름");
  });
});
