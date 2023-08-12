import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { BaseRepository } from "@/common/repository/base.repository";
import { SequenceRepository } from "@/common/sequence/sequence.repository";
import { Post, PostDocument, PostModel } from "@/routes/post/post.schema";
import { TagDocument } from "@/routes/tag/tag.schema";
import { IUpdatePostArgs } from "@/types";
import { POST_FIND_PROJECTION } from "@/utils/constants";

@Injectable()
export class PostRepository extends BaseRepository<PostDocument> {
  constructor(
    @InjectModel(Post.name) private readonly postModel: PostModel,
    sequenceRepository: SequenceRepository,
  ) {
    super(postModel, sequenceRepository);
  }

  async save(post: PostDocument) {
    return post.save();
  }

  async update(_id: string, updatePostDto: IUpdatePostArgs) {
    return this.postModel.updateOne({ _id }, updatePostDto);
  }

  async deleteSeriesInPosts(seriesId: string) {
    return this.postModel.updateMany({ series: seriesId }, { series: null });
  }

  async pushTags(postId: string, tags: TagDocument[]) {
    return this.postModel.updateOne(
      { _id: postId, tags: { $nin: tags } },
      { $push: { tags: { $each: tags } } },
    );
  }

  async pullTags(postId: string, tags: TagDocument[]) {
    return this.postModel.updateOne(
      { _id: postId, tags: { $in: tags } },
      { $pull: { tags: { $in: tags } } },
    );
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

  async getById(_id: string) {
    return super.getById(_id, POST_FIND_PROJECTION, { populate: ["tags", "series"] });
  }

  async getSibling(targetNid: number) {
    const [prev, next] = await Promise.all([
      this.getOne({ nid: { $lt: targetNid } }, POST_FIND_PROJECTION),
      this.getOne({ nid: { $gt: targetNid } }, POST_FIND_PROJECTION),
    ]);

    return { prev, next };
  }
}
