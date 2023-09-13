import { BadRequestException, Inject, Injectable, forwardRef } from "@nestjs/common";

import { FilterQuery } from "mongoose";

import { Transactional } from "@/common/decorators/transaction.decorator";
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

  @Transactional()
  async create(createPostDto: CreatePostDto) {
    const { tags: tagNames, series: seriesName, ...rest } = createPostDto;

    try {
      const post = await this.postRepository.create(rest);

      if (seriesName) {
        post.series = await this.seriesService.pushPostIdInSeries(seriesName, post._id);
      }

      if (tagNames?.length) {
        post.tags = await this.tagService.pushPostIdInTags(tagNames, post._id);
      }

      await this.postRepository.save(post);

      return post;
    } catch (error) {
      throw new BadRequestException(error?.massage || POST_ERROR.FAIL_CREATE);
    }
  }

  @Transactional()
  async delete(nid: number) {
    const post = await this.postRepository.getOne({ nid }, {}, { populate: ["tags", "series"] });
    const _id = post._id;

    if (!post) {
      throw new BadRequestException(POST_ERROR.NOT_FOUND);
    }

    const tagNames = post.tags.map((tag) => tag.name);

    if (post.series) await this.seriesService.pullPostIdInSeries(post.series.name, _id);
    if (tagNames.length) await this.tagService.pullPostIdInTags(tagNames, _id);
    await this.postRepository.delete(_id);

    return post.nid;
  }

  @Transactional()
  async update(nid: number, updatePostDto: UpdatePostDto) {
    const { addTags = [], deleteTags = [], series: seriesName, ...rest } = updatePostDto;

    const post = await this.postRepository.getOne({ nid });
    const _id = post._id;

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

    return this.postRepository.getOne({ nid });
  }

  @Transactional()
  async increaseToLikes(nid: number, ip: string) {
    await this.existPost({ nid });

    const projection = { ...POST_FIND_PROJECTION, isLiked: { $in: [ip, "$likes"] } };

    const post = await this.postRepository.getOne({ nid }, projection);

    if (post.isLiked) {
      throw new BadRequestException(POST_ERROR.ALREADY_LIKED);
    }

    await this.postRepository.increaseToLikes(nid, ip);

    return nid;
  }

  @Transactional()
  async decreaseToLikes(nid: number, ip: string) {
    await this.existPost({ nid });

    await this.postRepository.decreaseToLikes(nid, ip);

    return nid;
  }

  @Transactional()
  async increaseToViews(nid: number, ip: string) {
    await this.existPost({ nid });

    const post = await this.postRepository.isViewed(nid, ip);

    if (post) return;

    await this.postRepository.increaseToViews(nid, ip);
  }

  async getAll(getPostsDto: GetPostsDto) {
    const { skip = 0, limit = 10, sort = -1, ...rest } = getPostsDto;

    const filter = filterQueryByPosts(rest);
    const options = { skip, limit, sort: { _id: sort }, populate: ["tags", "series"] };

    return this.postRepository.getAll(filter, POST_FIND_PROJECTION, options);
  }

  async getByNumId(nid: number, ip: string) {
    const projection = { ...POST_FIND_PROJECTION, isLiked: { $in: [ip, "$likes"] } };

    const post = await this.postRepository.getOne({ nid }, projection, {
      populate: ["tags", "series"],
    });

    if (!post) {
      throw new BadRequestException(POST_ERROR.NOT_FOUND);
    }

    return post;
  }

  async getById(_id: string) {
    return this.postRepository.getById(_id);
  }

  async getSibling(targetNid: number) {
    const projection = { _id: 1, nid: 1, title: 1 };

    const [prev, next] = await Promise.all([
      this.postRepository.getOne({ nid: { $lt: targetNid } }, projection),
      this.postRepository.getOne({ nid: { $gt: targetNid } }, projection),
    ]);

    return { prev, next };
  }

  async existPost(filter: FilterQuery<PostDocument>) {
    const post = await this.postRepository.getOne(filter);

    if (!post) {
      throw new BadRequestException(POST_ERROR.NOT_FOUND);
    }

    return true;
  }
}
