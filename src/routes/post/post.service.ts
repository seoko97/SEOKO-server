import { BadRequestException, Inject, Injectable, forwardRef } from "@nestjs/common";

import { CreatePostDto } from "@/routes/post/dto/create-post.dto";
import { GetPostsDto } from "@/routes/post/dto/get-posts.dto";
import { UpdatePostDto } from "@/routes/post/dto/update-post.dto";
import { PostRepository } from "@/routes/post/post.repository";
import { PostDocument } from "@/routes/post/post.schema";
import { SeriesService } from "@/routes/series/series.service";
import { TagService } from "@/routes/tag/tag.service";
import { POST_ERROR, POST_FIND_PROJECTION } from "@/utils/constants";
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

  async update(_id: string, updatePostDto: UpdatePostDto) {
    const { addTags = [], deleteTags = [], series: seriesName, ...rest } = updatePostDto;

    const post = await this.postRepository.getById(_id);

    if (!post) {
      throw new BadRequestException(POST_ERROR.NOT_FOUND);
    }

    const input = { ...rest, series: post.series ?? null };
    const prevSeriesName = post.series?.name ?? null;

    try {
      if (prevSeriesName && prevSeriesName !== seriesName) {
        input.series = null;
        await this.seriesService.pullPostIdInSeries(prevSeriesName, _id);
      }

      if (seriesName && prevSeriesName !== seriesName) {
        input.series = await this.seriesService.pushPostIdInSeries(seriesName, _id);
      }

      await this.postRepository.update(_id, input);

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

    const projection = { ...POST_FIND_PROJECTION, isLiked: { $in: [ip, "$likes"] } };

    const post = await this.postRepository.getOne({ nid }, projection);

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
    const { skip = 0, limit = 10, ...rest } = getPostsDto;

    const filter = filterQueryByPosts(rest);
    const options = { skip, limit, sort: { _id: -1 }, populate: ["tags", "series"] };

    return this.postRepository.getAll(filter, POST_FIND_PROJECTION, options);
  }

  async getByNumId(nid: number, ip: string) {
    const projection = { ...POST_FIND_PROJECTION, isLiked: { $in: [ip, "$likes"] } };

    const post = await this.postRepository.getOne({ nid }, projection);

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
