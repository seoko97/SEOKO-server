import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { FilterQuery } from "mongoose";

import { SequenceRepository } from "@/common/sequence/sequence.repository";
import { CreatePostDto } from "@/routes/post/dto/create-post.dto";
import { UpdatePostDto } from "@/routes/post/dto/update-post.dto";
import { Post, PostDocument, PostModel } from "@/routes/post/post.schema";
import { TagDocument } from "@/routes/tag/tag.schema";

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: PostModel,
    private readonly sequenceRepository: SequenceRepository,
  ) {}

  async save(post: PostDocument) {
    return post.save();
  }

  async create(createPostDto: CreatePostDto) {
    const nid = await this.sequenceRepository.getNextSequence("post");

    return this.postModel.create({ nid, ...createPostDto });
  }

  async delete(_id: string) {
    return this.postModel.deleteOne({ _id });
  }

  async update(updatePostDto: UpdatePostDto) {
    return this.postModel.updateOne({ _id: updatePostDto._id }, updatePostDto);
  }

  async deleteSeriesInPosts(seriesId: string) {
    return this.postModel.updateMany({ series: seriesId }, { series: null });
  }

  async pushTags(postId: string, tags: TagDocument[]) {
    return this.postModel.updateOne({ _id: postId }, { $push: { tags: { $each: tags } } });
  }

  async pullTags(postId: string, tags: TagDocument[]) {
    return this.postModel.updateOne({ _id: postId }, { $pull: { tags: { $in: tags } } });
  }

  async increaseToLikes(postId: string, ip: string) {
    return this.postModel.updateOne({ _id: postId }, { $push: { likes: ip } });
  }

  async decreaseToLikes(postId: string, ip: string) {
    return this.postModel.updateOne({ _id: postId }, { $pull: { likes: ip } });
  }

  async increaseToViews(postId: string, ip: string) {
    return this.postModel.updateOne({ _id: postId }, { $push: { views: ip } });
  }

  async isViewed(postId: string, ip: string) {
    return this.postModel.exists({ _id: postId, views: { $in: ip } });
  }

  async getAll(options: FilterQuery<PostDocument>, limit: number, offset: number) {
    return this.postModel.find(options).populate("tags").skip(offset).limit(limit);
  }

  async getById(_id: string) {
    return this.postModel.findOne({ _id }).populate("tags").populate("series");
  }

  async getByNumId(nid: number, ip: string) {
    return this.postModel
      .findOne(
        { nid },
        {
          _id: 1,
          title: 1,
          content: 1,
          thumbnail: 1,
          nid: 1,
          createdAt: 1,
          updatedAt: 1,
          tags: 1,
          series: 1,
          likeCount: { $size: "$likes" },
          isLiked: { $in: [ip, "$likes"] },
          viewCount: { $size: "$views" },
        },
      )
      .populate("tags")
      .populate("series");
  }

  async getSibling(targetNid: number) {
    const [prev, next] = await Promise.all([
      this.postModel.findOne({ nid: { $lt: targetNid } }),
      this.postModel.findOne({ nid: { $gt: targetNid } }),
    ]);

    return { prev, next };
  }
}
