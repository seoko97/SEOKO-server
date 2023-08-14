import { Injectable } from "@nestjs/common";

import { Transactional } from "@/common/decorators/transaction.decorator";
import { TagRepository } from "@/routes/tag/tag.repository";

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async getAll() {
    return this.tagRepository.getAllToA();
  }

  async getByName(name: string) {
    return this.tagRepository.getOne({ name }, {}, { populate: "posts" });
  }

  @Transactional()
  async pushPostIdInTags(tagNames: string[], postId: string) {
    const tags = await Promise.all(
      tagNames.map((tagName) => this.tagRepository.findOrCreate(tagName)),
    );

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
