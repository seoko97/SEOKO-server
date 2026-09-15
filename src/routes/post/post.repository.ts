import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { BaseRepository } from "@/common/repository/base.repository";
import { SequenceRepository } from "@/common/sequence/sequence.repository";
import { Post, PostDocument, type PostModel } from "@/routes/post/post.schema";
import { TagDocument } from "@/routes/tag/tag.schema";
import { IUpdatePostArgs } from "@/types";

@Injectable()
export class PostRepository extends BaseRepository<Post> {
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
    const tagIds = tags.map((tag) => tag._id);

    return this.postModel.updateOne(
      { _id: postId },
      { $addToSet: { tags: { $each: tagIds } } },
    );
  }

  async pullTags(postId: string, tags: TagDocument[]) {
    const tagIds = tags.map((tag) => tag._id);

    return this.postModel.updateOne(
      { _id: postId, tags: { $in: tagIds } },
      { $pull: { tags: { $in: tagIds } } },
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
    return this.postModel.exists({ nid, views: { $in: [ip] } });
  }
}
