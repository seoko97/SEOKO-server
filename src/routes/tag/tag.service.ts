import { Injectable } from "@nestjs/common";

import { Transactional } from "@/common/decorators/transaction.decorator";
import { TagRepository } from "@/routes/tag/tag.repository";
import { TagDocument } from "@/routes/tag/tag.schema";

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async getAll() {
    return this.tagRepository.getAllToA();
  }

  async getByName(name: string) {
    return this.tagRepository.getOne(
      { name },
      { name: 1, postCount: { $size: "$posts" } },
      { populate: "posts" },
    );
  }

  @Transactional()
  async pushPostIdInTags(tagNames: string[], postId: string) {
    const tags: TagDocument[] = [];

    for (const tagName of tagNames) {
      const tag = await this.tagRepository.findOrCreate(tagName);
      tags.push(tag);
    }

    await this.tagRepository.addPostIdInTags(tags, postId);

    return tags;
  }

  @Transactional()
  async pullPostIdInTags(tagNames: string[], postId: string) {
    await this.tagRepository.pullPostIdInTags(tagNames, postId);

    return this.tagRepository.getAll({ name: { $in: tagNames } });
  }

  @Transactional()
  async pullPostIdByPostId(postId: string) {
    await this.tagRepository.pullPostIdByPostId(postId);
  }
}
