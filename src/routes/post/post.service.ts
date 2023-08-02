import { Injectable } from "@nestjs/common";

import { POST_STUB } from "test/utils/stub";

import { PostRepository } from "@/routes/post/post.repository";
import { SeriesService } from "@/routes/series/series.service";
import { TagService } from "@/routes/tag/tag.service";

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagService: TagService,
    private readonly seriesService: SeriesService,
  ) {}

  async create(createPostDto: any) {
    return POST_STUB;
  }

  async delete(_id: string) {
    return true;
  }

  async update(updatePostDto: any) {
    return POST_STUB;
  }

  async increaseToLikes(postId: string, ip: string) {
    return true;
  }

  async decreaseToLikes(postId: string, ip: string) {
    return true;
  }

  async increaseToViews(postId: string, ip: string) {
    return true;
  }

  async getAll(getPostsDto: any) {
    return [POST_STUB];
  }

  async getByNumId(nid: number) {
    return POST_STUB;
  }

  async getSiblings(targetNid: string) {
    return [POST_STUB, POST_STUB];
  }
}
