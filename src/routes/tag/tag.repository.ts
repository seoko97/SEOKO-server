import { Inject, Injectable } from "@nestjs/common";

import { SequenceRepository } from "@/common/sequence/sequence.repository";
import { Tag, TagDocument, TagModel } from "@/routes/tag/tag.schema";
import { GET_TAGS_OPTIONS } from "@/utils/constants/tag";

@Injectable()
export class TagRepository {
  constructor(
    @Inject(Tag.name) private readonly tagModel: TagModel,
    private readonly sequenceRepository: SequenceRepository,
  ) {}

  async addPostIdInTags(tags: TagDocument[], postId: string) {
    return await this.tagModel.updateMany(
      { _id: { $in: tags.map((tag) => tag._id) } },
      { $addToSet: { posts: postId } },
    );
  }

  async pullPostIdInTagNames(tagNames: string[], postId: string) {
    await this.tagModel
      .updateMany({ name: { $in: tagNames } }, { $pull: { posts: postId } })
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

    const nid = await this.sequenceRepository.getNextSequence("tag");

    return await this.tagModel.create({ name, nid });
  }

  async getByName(name: string) {
    const tag = await this.tagModel.findOne({ name }).populate("posts");

    return tag[0];
  }

  async getAll() {
    return await this.tagModel.aggregate<TagDocument>(GET_TAGS_OPTIONS).exec();
  }

  async getAllByTagNames(tagNames: string[]) {
    return await this.tagModel.find({ name: { $in: tagNames } });
  }
}
