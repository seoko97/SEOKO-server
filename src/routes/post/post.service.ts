import { BadRequestException, Inject, Injectable, forwardRef } from "@nestjs/common";

import { CreatePostDto } from "@/routes/post/dto/create-post.dto";
import { GetPostsDto } from "@/routes/post/dto/get-posts.dto";
import { UpdatePostDto } from "@/routes/post/dto/update-post.dto";
import { PostRepository } from "@/routes/post/post.repository";
import { PostDocument } from "@/routes/post/post.schema";
import { SeriesService } from "@/routes/series/series.service";
import { TagService } from "@/routes/tag/tag.service";
import { POST_ERROR } from "@/utils/constants";
import { filterQueryByPosts } from "@/utils/filterQueryByPosts";

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagService: TagService,
    @Inject(forwardRef(() => SeriesService)) private readonly seriesService: SeriesService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const { tags: tagNames, series: seriesName, ...rest } = createPostDto;

    let post: PostDocument;

    try {
      post = await this.postRepository.create(rest);

      if (seriesName) {
        post.series = await this.seriesService.pushPostIdInSeries(seriesName, post._id);
      }

      if (tagNames?.length) {
        post.tags = await this.tagService.pushPostIdInTags(tagNames, post._id);
      }

      await this.postRepository.save(post);
    } catch (error) {
      throw new BadRequestException(error?.massage || POST_ERROR.FAIL_CREATE);
    }

    await post.populate("tags");
    await post.populate("series");

    return post;
  }

  async delete(_id: string) {
    const post = await this.postRepository.getById(_id);

    if (!post) {
      throw new BadRequestException(POST_ERROR.NOT_FOUND);
    }

    const tagNames = post.tags.map((tag) => tag.name);

    await this.seriesService.pullPostIdInSeries(post.series.name, _id);
    await this.tagService.pullPostIdInTags(tagNames, _id);
    await this.postRepository.delete(_id);
  }

  async update(updatePostDto: UpdatePostDto) {
    const _id = updatePostDto._id;
    const { addTags = [], deleteTags = [], series: seriesName, ...rest } = updatePostDto;

    const post = await this.postRepository.getById(_id);

    if (!post) {
      throw new BadRequestException(POST_ERROR.NOT_FOUND);
    }

    const input = { ...rest, series: null };
    const prevSeriesName = post.series?.name ?? null;

    try {
      // 기존에 시리즈가 존재하고 입력받은 시리즈와 다르다면 기존 시리즈 제거
      if (prevSeriesName && prevSeriesName !== seriesName) {
        input.series = null;
        await this.seriesService.pullPostIdInSeries(prevSeriesName, _id);
      }

      // 입력받은 시리즈가 null이 아니고 기존 시리즈가 다르다면
      if (seriesName && prevSeriesName !== seriesName) {
        input.series = await this.seriesService.pushPostIdInSeries(seriesName, _id);
      }

      await this.postRepository.update(input);

      const [dTags, aTags] = await Promise.all([
        this.tagService.pullPostIdInTags(deleteTags, _id),
        this.tagService.pushPostIdInTags(addTags, _id),
      ]);

      await this.postRepository.pushTags(_id, aTags);
      await this.postRepository.pullTags(_id, dTags);
    } catch (error) {
      throw new BadRequestException(error?.massage || POST_ERROR.FAIL_UPDATE);
    }

    return this.postRepository.getById(_id);
  }

  async deleteSeriesInPosts(seriesId: string) {
    return this.postRepository.deleteSeriesInPosts(seriesId);
  }

  async increaseToLikes(postId: string, ip: string) {
    const { nid } = await this.existPostById(postId);

    const post = await this.postRepository.getByNumId(nid, ip);

    if (post.isLiked) {
      throw new BadRequestException(POST_ERROR.ALREADY_LIKED);
    }

    return this.postRepository.increaseToLikes(postId, ip);
  }

  async decreaseToLikes(postId: string, ip: string) {
    await this.existPostById(postId);

    return this.postRepository.decreaseToLikes(postId, ip);
  }

  async increaseToViews(postId: string, ip: string) {
    await this.existPostById(postId);

    const post = await this.postRepository.isViewed(postId, ip);

    if (post) return;

    await this.postRepository.increaseToViews(postId, ip);
  }

  async getAll(getPostsDto: GetPostsDto) {
    const { offset = 0, limit = 10, ...rest } = getPostsDto;

    const options = filterQueryByPosts(rest);

    return this.postRepository.getAll(options, limit, offset);
  }

  async getByNumId(nid: number, ip: string) {
    const post = await this.postRepository.getByNumId(nid, ip);

    if (!post) {
      throw new BadRequestException(POST_ERROR.NOT_FOUND);
    }

    return post;
  }

  async getById(_id: string) {
    return this.postRepository.getById(_id);
  }

  async getSibling(targetNid: number) {
    return this.postRepository.getSibling(targetNid);
  }

  async existPostById(_id: string) {
    const post = await this.postRepository.getById(_id);

    if (!post) {
      throw new BadRequestException(POST_ERROR.NOT_FOUND);
    }

    return post;
  }
}
