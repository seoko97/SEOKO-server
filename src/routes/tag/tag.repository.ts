import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { BaseRepository } from "@/common/repository/base.repository";
import { SequenceRepository } from "@/common/sequence/sequence.repository";
import { Tag, TagDocument, TagModel } from "@/routes/tag/tag.schema";
import { GET_TAGS_OPTIONS } from "@/utils/constants/tag";

@Injectable()
export class TagRepository extends BaseRepository<TagDocument> {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: TagModel,
    sequenceRepository: SequenceRepository,
  ) {
    super(tagModel, sequenceRepository);
  }

  async addPostIdInTags(tags: TagDocument[], postId: string) {
    return await this.tagModel.updateMany(
      { posts: { $ne: postId }, _id: { $in: tags.map((tag) => tag._id) } },
      { $push: { posts: postId } },
    );
  }

  async pullPostIdInTags(tagNames: string[], postId: string) {
    await this.tagModel
      .updateMany({ name: { $in: tagNames }, posts: { $in: postId } }, { $pull: { posts: postId } })
      .exec();

    await this.deleteTagsByEmptyPosts();
  }

  async pullPostIdByPostId(postId: string) {
    await this.tagModel.updateMany({ posts: { $in: postId } }, { $pull: { posts: postId } });

    await this.deleteTagsByEmptyPosts();
  }

  async deleteTagsByEmptyPosts() {
    await this.tagModel.deleteMany({ posts: { $size: 0 } });
  }

  async findOrCreate(name: string) {
    const tag = await this.tagModel.findOne({ name });

    if (tag) return tag;

    return super.create({ name });
  }

  async getAllToA() {
    return this.tagModel.aggregate<TagDocument>(GET_TAGS_OPTIONS).exec();
  }
}
