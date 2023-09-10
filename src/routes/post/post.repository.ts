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

  async increaseToLikes(nid: number, ip: string) {
    return this.postModel.updateOne({ nid }, { $push: { likes: ip } });
  }

  async decreaseToLikes(nid: number, ip: string) {
    return this.postModel.updateOne({ nid }, { $pull: { likes: ip } });
  }

  async increaseToViews(nid: number, ip: string) {
    return this.postModel.updateOne({ nid }, { $push: { views: ip } });
  }

  async isViewed(nid: number, ip: string) {
    return this.postModel.exists({ nid, views: { $in: ip } });
  }

  async getById(_id: string) {
    return super.getById(_id, POST_FIND_PROJECTION, { populate: ["tags", "series"] });
  }
}
