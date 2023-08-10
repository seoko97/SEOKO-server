import { Test, TestingModule } from "@nestjs/testing";

import { GET_POSTS_DTO_STUB, POST_CREATE_STUB, POST_STUB, POST_UPDATE_STUB } from "test/utils/stub";

import { PostController } from "@/routes/post/post.controller";
import { PostService } from "@/routes/post/post.service";

jest.mock("@/routes/post/post.service");

describe("PostController", () => {
  let controller: PostController;
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe("게시글 생성", () => {
    it("성공", async () => {
      const serviceCreateSpy: jest.SpyInstance = jest.spyOn(service, "create");
      serviceCreateSpy.mockResolvedValueOnce(POST_STUB);

      const result = await controller.create(POST_CREATE_STUB);

      expect(result).toEqual(POST_STUB);
      expect(serviceCreateSpy).toBeCalledTimes(1);
      expect(serviceCreateSpy).toBeCalledWith(POST_CREATE_STUB);
    });
  });

  describe("게시글 수정", () => {
    it("성공", async () => {
      const serviceUpdateSpy: jest.SpyInstance = jest.spyOn(service, "update");
      serviceUpdateSpy.mockResolvedValueOnce(POST_STUB);

      const result = await controller.update(POST_UPDATE_STUB);

      expect(result).toEqual(POST_STUB);
      expect(serviceUpdateSpy).toBeCalledTimes(1);
      expect(serviceUpdateSpy).toBeCalledWith(POST_UPDATE_STUB);
    });
  });

  describe("게시글 삭제", () => {
    it("성공", async () => {
      const serviceDeleteSpy: jest.SpyInstance = jest.spyOn(service, "delete");
      serviceDeleteSpy.mockResolvedValueOnce(undefined);

      const result = await controller.delete(POST_STUB._id);

      expect(result).toBeUndefined();
      expect(serviceDeleteSpy).toBeCalledTimes(1);
      expect(serviceDeleteSpy).toBeCalledWith(POST_STUB._id);
    });
  });

  describe("게시글 조회", () => {
    it("전체 조회", async () => {
      const serviceGetAllSpy: jest.SpyInstance = jest.spyOn(service, "getAll");
      serviceGetAllSpy.mockResolvedValueOnce([POST_STUB]);

      const result = await controller.getPosts(GET_POSTS_DTO_STUB);

      expect(result).toEqual([POST_STUB]);
      expect(serviceGetAllSpy).toBeCalledTimes(1);
      expect(serviceGetAllSpy).toBeCalledWith(GET_POSTS_DTO_STUB);
    });

    it("number id를 통한 조회", async () => {
      const POST_TO_RESULT = {
        ...POST_STUB,
        likeCount: 0,
        viewCount: 0,
        isLiked: false,
      };

      const serviceGetByNumIdSpy: jest.SpyInstance = jest.spyOn(service, "getByNumId");
      const serviceGetSiblingSpy: jest.SpyInstance = jest.spyOn(service, "getSibling");
      const serviceIncreaseViewCountSpy: jest.SpyInstance = jest.spyOn(service, "increaseToViews");

      serviceGetByNumIdSpy.mockResolvedValueOnce(POST_TO_RESULT);
      serviceGetSiblingSpy.mockResolvedValueOnce([POST_STUB, POST_STUB]);
      serviceIncreaseViewCountSpy.mockResolvedValueOnce(undefined);

      const result = await controller.getPost(POST_STUB.nid, "ip");

      expect(result).toEqual({ post: POST_TO_RESULT, sibling: [POST_STUB, POST_STUB] });

      expect(serviceGetByNumIdSpy).toBeCalledTimes(1);
      expect(serviceGetByNumIdSpy).toBeCalledWith(POST_STUB.nid, "ip");

      expect(serviceGetSiblingSpy).toBeCalledTimes(1);
      expect(serviceGetSiblingSpy).toBeCalledWith(POST_STUB.nid);

      expect(serviceIncreaseViewCountSpy).toBeCalledTimes(1);
      expect(serviceIncreaseViewCountSpy).toBeCalledWith(POST_STUB._id, "ip");
    });
  });

  describe("게시글 좋아요", () => {
    it("증가", async () => {
      const serviceIncreaseLikeCountSpy: jest.SpyInstance = jest.spyOn(service, "increaseToLikes");
      serviceIncreaseLikeCountSpy.mockResolvedValueOnce(undefined);

      const result = await controller.like(POST_STUB._id, "ip");

      expect(result).toBeUndefined();
      expect(serviceIncreaseLikeCountSpy).toBeCalledTimes(1);
      expect(serviceIncreaseLikeCountSpy).toBeCalledWith(POST_STUB._id, "ip");
    });

    it("감소", async () => {
      const serviceDecreaseLikeCountSpy: jest.SpyInstance = jest.spyOn(service, "decreaseToLikes");
      serviceDecreaseLikeCountSpy.mockResolvedValueOnce(undefined);

      const result = await controller.unlike(POST_STUB._id, "ip");

      expect(result).toBeUndefined();
      expect(serviceDecreaseLikeCountSpy).toBeCalledTimes(1);
      expect(serviceDecreaseLikeCountSpy).toBeCalledWith(POST_STUB._id, "ip");
    });
  });
});