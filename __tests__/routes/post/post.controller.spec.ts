import { Test, TestingModule } from "@nestjs/testing";

import { GET_POSTS_DTO_STUB, POST_CREATE_STUB, POST_STUB, POST_UPDATE_STUB } from "test/utils/stub";

import { PostController } from "@/routes/post/post.controller";
import { PostService } from "@/routes/post/post.service";

vi.mock("@/routes/post/post.service");

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

    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe("게시글 생성", () => {
    it("성공", async () => {
      const serviceCreateSpy: TestSpyInstance = vi.spyOn(service, "create");
      serviceCreateSpy.mockResolvedValueOnce(POST_STUB);

      const result = await controller.create(POST_CREATE_STUB);

      expect(result).toEqual(POST_STUB);
      expect(serviceCreateSpy).toHaveBeenCalledTimes(1);
      expect(serviceCreateSpy).toHaveBeenCalledWith(POST_CREATE_STUB);
    });
  });

  describe("게시글 수정", () => {
    it("성공", async () => {
      const serviceUpdateSpy: TestSpyInstance = vi.spyOn(service, "update");
      serviceUpdateSpy.mockResolvedValueOnce(POST_STUB);

      const nid = POST_STUB.nid;
      const result = await controller.update(nid, POST_UPDATE_STUB);

      expect(result).toEqual(POST_STUB);
      expect(serviceUpdateSpy).toHaveBeenCalledTimes(1);
      expect(serviceUpdateSpy).toHaveBeenCalledWith(nid, POST_UPDATE_STUB);
    });
  });

  describe("게시글 삭제", () => {
    it("성공", async () => {
      const serviceDeleteSpy: TestSpyInstance = vi.spyOn(service, "delete");
      serviceDeleteSpy.mockResolvedValueOnce(undefined);

      const nid = POST_STUB.nid;

      const result = await controller.delete(nid);

      expect(result).toBeUndefined();
      expect(serviceDeleteSpy).toHaveBeenCalledTimes(1);
      expect(serviceDeleteSpy).toHaveBeenCalledWith(nid);
    });
  });

  describe("게시글 조회", () => {
    it("전체 조회", async () => {
      const serviceGetAllSpy: TestSpyInstance = vi.spyOn(service, "getAll");
      serviceGetAllSpy.mockResolvedValueOnce([POST_STUB]);

      const result = await controller.getPosts(GET_POSTS_DTO_STUB);

      expect(result).toEqual([POST_STUB]);
      expect(serviceGetAllSpy).toHaveBeenCalledTimes(1);
      expect(serviceGetAllSpy).toHaveBeenCalledWith(GET_POSTS_DTO_STUB);
    });

    it("number id를 통한 조회", async () => {
      const nid = POST_STUB.nid;

      const POST_TO_RESULT = {
        ...POST_STUB,
        likeCount: 0,
        viewCount: 0,
        isLiked: false,
      };

      const serviceGetByNumIdSpy: TestSpyInstance = vi.spyOn(service, "getByNumId");
      const serviceIncreaseViewCountSpy: TestSpyInstance = vi.spyOn(service, "increaseToViews");

      serviceGetByNumIdSpy.mockResolvedValueOnce(POST_TO_RESULT);
      serviceIncreaseViewCountSpy.mockResolvedValueOnce(undefined);

      const result = await controller.getPost(nid, "ip");

      expect(result).toEqual(POST_TO_RESULT);

      expect(serviceGetByNumIdSpy).toHaveBeenCalledTimes(1);
      expect(serviceGetByNumIdSpy).toHaveBeenCalledWith(nid, "ip");

      expect(serviceIncreaseViewCountSpy).toHaveBeenCalledTimes(1);
      expect(serviceIncreaseViewCountSpy).toHaveBeenCalledWith(nid, "ip");
    });

    it("이전/다음 게시글 조회", async () => {
      const POST_TO_RESULT = {
        prev: POST_STUB,
        next: POST_STUB,
      };

      const serviceGetSiblingSpy: TestSpyInstance = vi.spyOn(service, "getSibling");
      serviceGetSiblingSpy.mockResolvedValueOnce(POST_TO_RESULT);

      const result = await controller.getSiblingPost(POST_STUB.nid);

      expect(result).toEqual(POST_TO_RESULT);
      expect(serviceGetSiblingSpy).toHaveBeenCalledTimes(1);
      expect(serviceGetSiblingSpy).toHaveBeenCalledWith(POST_STUB.nid);
    });
  });

  describe("게시글 좋아요", () => {
    it("증가", async () => {
      const serviceIncreaseLikeCountSpy: TestSpyInstance = vi.spyOn(service, "increaseToLikes");
      serviceIncreaseLikeCountSpy.mockResolvedValueOnce(undefined);

      const nid = POST_STUB.nid;

      const result = await controller.like(nid, "ip");

      expect(result).toBeUndefined();
      expect(serviceIncreaseLikeCountSpy).toHaveBeenCalledTimes(1);
      expect(serviceIncreaseLikeCountSpy).toHaveBeenCalledWith(nid, "ip");
    });

    it("감소", async () => {
      const serviceDecreaseLikeCountSpy: TestSpyInstance = vi.spyOn(service, "decreaseToLikes");
      serviceDecreaseLikeCountSpy.mockResolvedValueOnce(undefined);

      const nid = POST_STUB.nid;

      const result = await controller.unlike(nid, "ip");

      expect(result).toBeUndefined();
      expect(serviceDecreaseLikeCountSpy).toHaveBeenCalledTimes(1);
      expect(serviceDecreaseLikeCountSpy).toHaveBeenCalledWith(nid, "ip");
    });
  });
});
