import { Injectable } from "@nestjs/common";

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

  async pushPostIdInTags(tagNames: string[], postId: string) {
    const tags = await Promise.all(
      tagNames.map((tagName) => this.tagRepository.findOrCreate(tagName)),
    );

    await this.tagRepository.addPostIdInTags(tags, postId);

    return tags;
  }

  async pullPostIdInTags(tagNames: string[], postId: string) {
    await this.tagRepository.pullPostIdInTags(tagNames, postId);

    return this.tagRepository.getAll({ name: { $in: tagNames } });
  }

  async pullPostIdByPostId(postId: string) {
    await this.tagRepository.pullPostIdByPostId(postId);
  }
}
